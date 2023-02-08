from django.shortcuts import render
from datetime import date

from rest_framework.filters import SearchFilter

from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse

from django.conf import settings
import redis
import uuid
import json


from bmstu_lab.models import Users
from bmstu_lab.models import Posts
from bmstu_lab.models import Likes
from bmstu_lab.models import Comments

from rest_framework import viewsets
from bmstu_lab.serializers import UsersSerializer
from bmstu_lab.serializers import PostsSerializer
from bmstu_lab.serializers import LikesSerializer
from bmstu_lab.serializers import CommentsSerializer

# Connect to our Redis instance
session_storage = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)


@csrf_exempt
def auth_view(request):
    decode_body = json.loads(request.body.decode('utf-8'))

    username = decode_body['username']  # допустим передали username и password
    password = decode_body['password']

    user = Users.objects.filter(username=username, pass_field=password)

    if len(user) > 0:
        random_key = str(uuid.uuid4())
        session_storage.set(random_key, user[0].id, ex=1200)

        data = {"status": "ok", "id": user[0].id, "username": username, "is_admin": user[0].is_admin}
        dump = json.dumps(data)
        response = HttpResponse(dump, content_type="application/json")
        response.set_cookie("session_id", random_key, samesite='None', path='/')  # пусть ключем для куки будет session_id

        return response

    else:
        data = {"status": "error", "error": "login failed"}
        dump = json.dumps(data)
        return HttpResponse(dump, content_type="application/json")

@csrf_exempt
def logout_view(request):
    ssid = request.COOKIES["session_id"]
    session_storage.delete(ssid)

    data = {"status": "ok"}
    dump = json.dumps(data)
    response = HttpResponse(dump, content_type="application/json")
    return response


@csrf_exempt
def register_view(request):
    decode_body = json.loads(request.body.decode('utf-8'))
    username = decode_body["username"]  # допустим передали username и password
    descript = decode_body["descript"]
    password = decode_body["password"]

    try:
        user = Users.objects.get(username=username)
        data = {"status": "exists"}
        dump = json.dumps(data)
        response = HttpResponse(dump, content_type="application/json")
    except Users.DoesNotExist:
        user = Users.objects.create(username=username, pass_field=password, descript=descript)
        user.save()

        random_key = str(uuid.uuid4())
        session_storage.set(random_key, user.id, ex=1200)

        data = {"status": "ok", "id": user.id, "username": username, "is_admin": user.is_admin}
        dump = json.dumps(data)

        response = HttpResponse(dump, content_type="application/json")
        response.set_cookie("session_id", random_key, samesite='None')

    return response


@csrf_exempt
def auth_check_view(request):
    try:
        ssid = request.COOKIES["session_id"]

        if session_storage.get(ssid) != None:
            decode_ssid = session_storage.get(ssid).decode('utf-8')
            user = Users.objects.filter(id=decode_ssid)

            if len(user) > 0:
                data = {"status": "authorise", "id": user[0].id, "username": user[0].username, "is_admin": user[0].is_admin}
                dump = json.dumps(data)
                response = HttpResponse(dump, content_type="application/json")
                return response

            else:
                data = {"status": "error", "error": "login failed"}
                dump = json.dumps(data)
                return HttpResponse(dump, content_type="application/json")



        else:
            data = {"status": "authorisation has expired"}
            dump = json.dumps(data)

            response = HttpResponse(dump, content_type="application/json")

    except:
        data = {"status": "no authorisation"}
        dump = json.dumps(data)

        response = HttpResponse(dump, content_type="application/json")

    return response


@csrf_exempt
def post_like_view(request):
    try:
        ssid = request.COOKIES["session_id"]
        ident = session_storage.get(ssid)

        decode_body = json.loads(request.body.decode('utf-8'))
        post = decode_body["post"]
        user = decode_body["user"]

        if str(ident) == ("b'" + str(user) + "'"):

            try:
                like = Likes.objects.get(post=post, user=user)
                data = {"status": "exists"}
                dump = json.dumps(data)
                response = HttpResponse(dump, content_type="application/json")
            except Likes.DoesNotExist:
                like = Likes.objects.create(post_id=post, user_id=user)
                like.save()

                data = {"status": "ok", "post": post, "user": user}
                dump = json.dumps(data)

                response = HttpResponse(dump, content_type="application/json")

        else:
            data = {"status": "authorisation has expired"}
            dump = json.dumps(data)
            response = HttpResponse(dump, content_type="application/json")

        return response

    except:
        data = {"status": "no authorisation"}
        dump = json.dumps(data)
        response = HttpResponse(dump, content_type="application/json")

        return response


@csrf_exempt
def post_post_view(request):
    try:
        ssid = request.COOKIES["session_id"]
        ident = session_storage.get(ssid)

        decode_body = json.loads(request.body.decode('utf-8'))
        author = decode_body["author"]
        title = decode_body["title"]
        descript = decode_body["descript"]

        if str(ident) == ("b'" + str(author) + "'"):
            post = Posts.objects.create(author_id=author, title=title, descript=descript)
            post.save()

            data = {"status": "ok", "post": post.id, "author": author}
            dump = json.dumps(data)

            response = HttpResponse(dump, content_type="application/json")

        else:
            data = {"status": "authorisation has expired"}
            dump = json.dumps(data)
            response = HttpResponse(dump, content_type="application/json")

        return response

    except:
        data = {"status": "no authorisation"}
        dump = json.dumps(data)
        response = HttpResponse(dump, content_type="application/json")

        return response


@csrf_exempt
def post_comment_view(request):
    try:
        ssid = request.COOKIES["session_id"]
        ident = session_storage.get(ssid)

        decode_body = json.loads(request.body.decode('utf-8'))
        post = decode_body["post"]
        author = decode_body["author"]
        ref = decode_body["ref"]
        comm = decode_body["comm"]

        if str(ident) == ("b'" + str(author) + "'"):
            comment = Comments.objects.create(post_id=post, author_id=author, ref_id=ref, comm=comm)
            comment.save()

            data = {"status": "ok", "post": comment.post_id, "comment": comment.id, "author": author}
            dump = json.dumps(data)

            response = HttpResponse(dump, content_type="application/json")

        else:
            data = {"status": "authorisation has expired"}
            dump = json.dumps(data)
            response = HttpResponse(dump, content_type="application/json")

        return response

    except:
        data = {"status": "no authorisation"}
        dump = json.dumps(data)
        response = HttpResponse(dump, content_type="application/json")

        return response

@csrf_exempt
def change_status_view(request):
    try:
        ssid = request.COOKIES["session_id"]
        decode_ident = session_storage.get(ssid).decode('utf-8')
        user = Users.objects.filter(id=decode_ident)

        if user[0].is_admin == 1:
            decode_body = json.loads(request.body.decode('utf-8'))
            id = decode_body["id"]
            post_status = decode_body["post_status"]

            post = Posts.objects.filter(id=id).update(post_status=post_status)

            # post = Posts.objects.create(author_id=author, title=title, descript=descript)
            # post.save()

            data = {"status": "ok", "post": id, "post_status": post_status}
            dump = json.dumps(data)

            response = HttpResponse(dump, content_type="application/json")

        else:
            data = {"status": "no rights"}
            dump = json.dumps(data)
            response = HttpResponse(dump, content_type="application/json")

        return response

    except:
        data = {"status": "no authorisation"}
        dump = json.dumps(data)
        response = HttpResponse(dump, content_type="application/json")

        return response

@csrf_exempt
def hide_comment_view(request):
    try:
        ssid = request.COOKIES["session_id"]
        decode_ident = session_storage.get(ssid).decode('utf-8')
        user = Users.objects.filter(id=decode_ident)

        if user[0].is_admin == 1:
            decode_body = json.loads(request.body.decode('utf-8'))
            id = decode_body["id"]

            # comment = Comments.objects.filter(id=id).update(is_normal=0)
            # comment = Comments.objects.filter(id=id)
            refComments = Comments.objects.filter(ref=id)
            if len(refComments) > 0:
                Comments.objects.filter(id=id).update(is_normal=0)
            else:
                Comments.objects.filter(id=id).update(is_normal=0, is_visible=0)

            # post = Posts.objects.create(author_id=author, title=title, descript=descript)
            # post.save()

            data = {"status": "ok", "comment": id}
            dump = json.dumps(data)

            response = HttpResponse(dump, content_type="application/json")

        else:
            data = {"status": "no rights"}
            dump = json.dumps(data)
            response = HttpResponse(dump, content_type="application/json")

        return response

    except:
        data = {"status": "no authorisation"}
        dump = json.dumps(data)
        response = HttpResponse(dump, content_type="application/json")

        return response


def hello(request):
    return render(request, 'index.html', {'data': {
        'current_date': date.today(),
        'list': ['python', 'django', 'html']
    }})


def postList(request):
    return render(request, 'posts.html', {'data': {
        'current_date': date.today(),
        'posts': Posts.objects.all().select_related('author')
    }})


def GetPost(request, id):
    return render(request, 'post.html', {'data': {
        'current_date': date.today(),
        'post': Posts.objects.select_related('author').filter(id=id)[0],
        'likes': Likes.objects.filter(id_post=id).count(),
        'comments': Comments.objects.filter(post_id=id)
    }})


def postListForUser(request, user_id):
    return render(request, 'user.html', {'data': {
        'current_date': date.today(),
        'user': Users.objects.filter(id=user_id)[0],
        'posts': Posts.objects.all().select_related('author').filter(author=user_id)
    }})


class UsersViewSet(viewsets.ModelViewSet):
    """
    API endpoint, который позволяет просматривать и редактировать акции компаний
    """
    queryset = Users.objects.all()
    serializer_class = UsersSerializer  # Сериализатор для модели


class PostsViewSet(viewsets.ModelViewSet):
    """
    API endpoint, который позволяет просматривать и редактировать акции компаний
    """
    queryset = Posts.objects.exclude(post_status=2)
    filter_backends = [SearchFilter, DjangoFilterBackend]
    filterset_fields = ['author', 'id']
    search_fields = ['title', 'descript']
    serializer_class = PostsSerializer  # Сериализатор для модели


class LikesViewSet(viewsets.ModelViewSet):
    """
    API endpoint, который позволяет просматривать и редактировать акции компаний
    """
    queryset = Likes.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['post']
    serializer_class = LikesSerializer  # Сериализатор для модели


class CommentsViewSet(viewsets.ModelViewSet):
    """
    API endpoint, который позволяет просматривать и редактировать акции компаний
    """
    queryset = Comments.objects.filter(is_visible=1)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['post']
    serializer_class = CommentsSerializer  # Сериализатор для модели