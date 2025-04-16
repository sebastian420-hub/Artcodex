from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import User, Post, Following, Comment
from .serializers import UserSerializer, PostSerializer, FollowingSerializer, CommentSerializer
from rest_framework import generics
from rest_framework import status
from .serializers import UserRegistrationSerializer
from django.core.paginator import Paginator


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    authentication_classes = []  
    permission_classes = []     

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "User registered successfully",
        }, status=status.HTTP_201_CREATED)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-timestamp')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        category = request.query_params.get('category', None)
        user = request.query_params.get('user', None)
        has_3d_model = request.query_params.get('has_3d_model', None)
        page = request.query_params.get('page', 1)
        queryset = self.queryset
        if category:
            queryset = queryset.filter(category=category)
        if user:
            queryset = queryset.filter(user=user)
        if has_3d_model == 'true':  
            queryset = queryset.filter(model_3d__isnull=False)
        elif has_3d_model == 'false':  
            queryset = queryset.filter(model_3d__isnull=True)
        
        
        paginator = Paginator(queryset, 10)  
        page_obj = paginator.get_page(page)
        
        serializer = self.get_serializer(page_obj, many=True)
        return Response({
            'posts': serializer.data,
            'has_next': page_obj.has_next(),
            'next_page_number': page_obj.next_page_number() if page_obj.has_next() else None
        })

class FollowingViewSet(viewsets.ModelViewSet):
    queryset = Following.objects.all()
    serializer_class = FollowingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(follower=self.request.user)

    @action(detail=False, methods=['get'], url_path=r'(?P<username>[^/.]+)')
    def by_username(self, request, username=None):
        user = get_object_or_404(User, username=username)
        following = user.following.all()
        serializer = self.get_serializer(following, many=True)
        followed_users = [item['followed'] for item in serializer.data]
        return Response(followed_users)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    user = request.user
    if post.likes.filter(id=user.id).exists():
        post.likes.remove(user)
        action = "unliked"
    else:
        post.likes.add(user)
        action = "liked"
    return Response({"success": True, "action": action, "likes_count": post.likes.count()})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow(request, username):
    user = request.user
    followed = get_object_or_404(User, username=username)
    if user == followed:
        return Response({"success": False, "error": "Cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)
    
    following, created = Following.objects.get_or_create(follower=user, followed=followed)
    if not created:
        following.delete()
        return Response({"success": True, "isFollowing": False, "message": f"{user.username} unfollowed {followed.username}"})
    return Response({"success": True, "isFollowing": True, "message": f"{user.username} followed {followed.username}"}) 

@api_view(['GET'])
def profile_posts(request, username):
    user = get_object_or_404(User, username=username)
    posts = user.posts.all().order_by('-timestamp')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_followers(request, username):
    user = get_object_or_404(User, username=username)
    followers = user.followers.all()
    serializer = UserSerializer(followers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_comments(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    comments = post.comments.all().order_by('-created')
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)
