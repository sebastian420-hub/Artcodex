from django.contrib.auth.models import AbstractUser
from django.db import models


POST_CATEGORIES = [
    ('computer_graphics', '3D Computer Graphics'),
    ('graphic_designs', 'Graphic Designs'),
    ('model_3d', '3D Models'),
    ('painting', 'Painting'),
    ('photography', 'Photography'),
    ('music', 'Music'),
]

class User(AbstractUser):
    pass  


class Model_3D(models.Model):
    file = models.FileField(upload_to='posts/model_3d/', null=True, blank=True)
    bin_file = models.FileField(upload_to='posts/model_3d/', null=True, blank=True)

    def __str__(self):
        return self.file.url if self.file else "No 3D model file found"

class Model_3D_PNG(models.Model):
    model_3d = models.ForeignKey(Model_3D, on_delete=models.CASCADE, related_name="textures")
    texture = models.FileField(upload_to='posts/model_3d/textures/', null=True, blank=True)

    def __str__(self):
        return self.texture.url if self.texture else "No texture file found"



class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    post = models.TextField(max_length=200)
    image = models.ImageField(upload_to='posts/images/', null=True, blank=True)
    model_3d = models.ForeignKey('Model_3D', on_delete=models.CASCADE, related_name="model_3d", null=True, blank=True)
    likes = models.ManyToManyField(User, related_name="liked_posts", blank=True)
    category = models.CharField(max_length=20, choices=POST_CATEGORIES, null=True, blank=True)
    link = models.URLField(max_length=200, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        model_3d_data = {}
        if self.model_3d:
            model_3d_data = {
                "file": self.model_3d.file.url if self.model_3d.file else '',
                "bin_file": self.model_3d.bin_file.url if self.model_3d.bin_file else '',
                "textures": [texture.texture.url for texture in self.model_3d.textures.all()]
            }
        return {
            "id": self.id,
            "user": self.user.username,
            "post": self.post,
            "image": self.image.url if self.image else '',
            "model_3d": model_3d_data,
            "likes": self.likes.count(),
            "category": self.category if self.category else '',
            "link": self.link if self.link else '',
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

    def __str__(self):
        return f"{self.user.username}'s post: {self.post[:20]}..."
    

    

# def validate_3d_model_extension(value):
#     import os
#     from django.core.exceptions import ValidationError
#     valid_extensions = ['.glb', '.gltf', '.obj']  # Add more as needed
#     ext = os.path.splitext(value.name)[1].lower()
#     if ext not in valid_extensions:
#         raise ValidationError(f'Unsupported file extension. Allowed: {", ".join(valid_extensions)}')
    

# model_3d = models.FileField(upload_to='posts/model_3d/', validators=[validate_3d_model_extension], null=True, blank=True)


class Following(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")

    def save(self, *args, **kwargs):
        if self.follower == self.followed:
            raise ValueError("Users cannot follow themselves")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.follower.username} follows {self.followed.username}"

    class Meta:
        unique_together = ('follower', 'followed')  


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    comment = models.TextField(max_length=500)  
    created = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "comment": self.comment,  
            "timestamp": self.created.strftime("%b %d %Y, %I:%M %p")  
        }

    def __str__(self):
        return f"{self.user.username}'s comment on post {self.post.id}"