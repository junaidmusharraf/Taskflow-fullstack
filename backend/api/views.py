from django.contrib.auth import authenticate
from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Project, Task
from .serializers import UserRegistrationSerializer, ProjectSerializer, TaskSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {'token': token.key, 'username': user.username},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username})

    return Response(
        {'error': 'Invalid username or password'},
        status=status.HTTP_401_UNAUTHORIZED
    )


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    pagination_class = None

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user).order_by('name')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'due_date', 'priority']

    def get_queryset(self):
        queryset = (
            Task.objects.select_related('project')
            .filter(owner=self.request.user)
            .order_by('-created_at', '-id')
        )

        project_id = self.request.query_params.get('project')
        priority = self.request.query_params.get('priority')
        completed = self.request.query_params.get('completed')

        if project_id and project_id != 'ALL':
            queryset = queryset.filter(project_id=project_id)

        if priority and priority != 'ALL':
            queryset = queryset.filter(priority=priority)

        if completed == 'PENDING':
            queryset = queryset.filter(completed=False)
        elif completed == 'COMPLETED':
            queryset = queryset.filter(completed=True)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)