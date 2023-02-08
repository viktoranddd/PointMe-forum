"""bmstu URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from bmstu_lab import views

# from bmstu_lab import views as pointme_views



router = routers.DefaultRouter()
router.register(r'users', views.UsersViewSet)
router.register(r'posts', views.PostsViewSet)
router.register(r'likes', views.LikesViewSet)
router.register(r'comments', views.CommentsViewSet)

schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello/', views.hello, name='hello'),
    path('drf/', include(router.urls)),
    path('', views.postList),
    path('user/<int:user_id>/', views.postListForUser, name='user_url'),
    path('post/<int:id>/', views.GetPost, name='post_url'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/auth/', views.auth_view),
    path('api/logout/', views.logout_view),
    path('api/register/', views.register_view),
    path('api/check/', views.auth_check_view),
    path('api/post_like/', views.post_like_view),
    path('api/post_post/', views.post_post_view),
    path('api/post_comment/', views.post_comment_view),
    path('api/change_status/', views.change_status_view),
    path('api/hide_comment/', views.hide_comment_view),

]