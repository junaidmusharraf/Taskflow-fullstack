from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Project, Task

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )


class ProjectSerializer(serializers.ModelSerializer):
    task_count = serializers.IntegerField(source='tasks.count', read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'color', 'task_count', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    project_color = serializers.CharField(source='project.color', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'project', 'project_name', 'project_color',
            'title', 'description', 'priority', 'due_date',
            'completed', 'created_at'
        ]