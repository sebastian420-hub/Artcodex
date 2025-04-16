from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from .views import RegisterView

router = DefaultRouter()
router.register(r'posts', views.PostViewSet)  
router.register(r'users', views.UserViewSet)
router.register(r'following', views.FollowingViewSet)
router.register(r'comments', views.CommentViewSet)

urlpatterns = [
    path('api/', include(router.urls)), 
    
    
    path('api/posts/<int:post_id>/like/', views.like_post, name='like_post'),
    path('api/follow/<str:username>/', views.follow, name='follow'),
    path('api/followers/<str:username>/', views.get_followers, name='get_followers'),
    path('api/profile/<str:username>/posts/', views.profile_posts, name='profile_posts'),
    path('api/posts/<int:post_id>/comments/', views.get_comments, name='get_comments'),
    
    
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)