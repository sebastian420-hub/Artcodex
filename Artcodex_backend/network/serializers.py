from rest_framework import serializers
from .models import User, Post, Following, Comment, Model_3D_PNG, Model_3D
# import os
# import zipfile
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.conf import settings
# from .utils import extract_zip

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class Model_3D_PNGSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model_3D_PNG
        fields = ['id', 'texture']

class Model_3DSerializer(serializers.ModelSerializer):
    textures = Model_3D_PNGSerializer(many=True, read_only=True)

    class Meta:
        model = Model_3D
        fields = ['id', 'file', 'bin_file', 'textures']

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    image = serializers.ImageField(allow_null=True, required=False)
    category = serializers.CharField(allow_blank=True, required=False)
    link = serializers.URLField(allow_blank=True, required=False)
    model_3d = serializers.FileField(allow_null=True, required=False, write_only=True) 
    model_3d_bin = serializers.FileField(allow_null=True, required=False, write_only=True) 
    textures = serializers.ListField(
        child=serializers.FileField(),
        allow_empty=True,
        required=False,
        write_only=True
    )
    model_3d_data = Model_3DSerializer(source='model_3d', read_only=True)  

    class Meta:
        model = Post
        fields = ['id', 'user', 'post', 'image', 'model_3d', 'model_3d_bin', 'textures', 'model_3d_data', 'likes_count', 'category', 'link', 'timestamp']
        read_only_fields = ['timestamp', 'model_3d_data']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def create(self, validated_data):
        model_3d_file = validated_data.pop('model_3d', None)
        model_3d_bin_file = validated_data.pop('model_3d_bin', None)
        textures_files = validated_data.pop('textures', [])
        print(textures_files)
        post = Post.objects.create(**validated_data)
        if model_3d_file or model_3d_bin_file or textures_files:
            model_3d = Model_3D.objects.create(
                file=model_3d_file,
                bin_file=model_3d_bin_file
            )
            post.model_3d = model_3d
            post.save()
            for texture_file in textures_files:
                Model_3D_PNG.objects.create(model_3d=model_3d, texture=texture_file)
        return post
    
    def validate(self, data):
        image = data.get('image')
        model_3d = data.get('model_3d')
        if not image and not model_3d:
            raise serializers.ValidationError("Post must have either an image or a 3D model")
        return data

class FollowingSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    followed = UserSerializer(read_only=True)
    class Meta:
        model = Following
        fields = ['id', 'follower', 'followed']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'comment', 'created']
        read_only_fields = ['created']