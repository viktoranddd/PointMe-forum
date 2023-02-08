from bmstu_lab.models import Users
from bmstu_lab.models import Posts
from bmstu_lab.models import Likes
from bmstu_lab.models import Comments
from rest_framework import serializers


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        # Модель, которую мы сериализуем
        model = Users
        # Поля, которые мы сериализуем
        fields = ["id", "username", "pass_field", "descript", "image", "reg_datetime"]


class PostsSerializer(serializers.ModelSerializer):
    class Meta:
        # Модель, которую мы сериализуем
        model = Posts
        # Поля, которые мы сериализуем
        fields = ["id", "author", "title", "descript", "image", "post_datetime", "post_status"]


class LikesSerializer(serializers.ModelSerializer):
    class Meta:
        # Модель, которую мы сериализуем
        model = Likes
        # Поля, которые мы сериализуем
        fields = ["id", "post", "user"]


class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        # Модель, которую мы сериализуем
        model = Comments
        # Поля, которые мы сериализуем
        fields = ["id", "post", "author", "ref", "comm", "comm_datetime", "is_visible", "is_normal"]