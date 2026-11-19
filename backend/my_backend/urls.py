from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ProjectViewSet, TaskViewSet, register_user, login_user

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', register_user),
    path('api/login/', login_user),
    path('api/', include(router.urls)),
]