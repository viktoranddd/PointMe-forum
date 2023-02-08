from django.contrib import admin

# Register your models here.
from .models import Likes, Posts, Users, Comments

admin.site.register(Likes)
admin.site.register(Posts)
admin.site.register(Users)
admin.site.register(Comments)
