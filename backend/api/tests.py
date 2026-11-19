from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Project, Task


class TaskFlowAPITests(APITestCase):
    def setUp(self):
        # Create two separate users to test private workspace isolation
        self.user_a = User.objects.create_user(username='alice', password='password123')
        self.user_b = User.objects.create_user(username='bob', password='password123')

        self.project_a = Project.objects.create(
            owner=self.user_a, name='Backend Refactor', color='#2563eb'
        )
        self.task_a = Task.objects.create(
            owner=self.user_a,
            project=self.project_a,
            title='Optimize SQL indexes',
            priority='HIGH',
        )
        self.task_b = Task.objects.create(
            owner=self.user_b,
            title='Bob private task',
            priority='LOW',
        )

    def test_unauthenticated_access_blocked(self):
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_returns_auth_token(self):
        response = self.client.post(
            '/api/login/',
            {'username': 'alice', 'password': 'password123'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_user_only_sees_own_tasks(self):
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title'], 'Optimize SQL indexes')

    def test_create_task_assigns_authenticated_owner(self):
        self.client.force_authenticate(user=self.user_a)
        response = self.client.post(
            '/api/tasks/',
            {
                'title': 'Write API documentation',
                'priority': 'MEDIUM',
                'project': self.project_a.id,
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.filter(owner=self.user_a).count(), 2)

    def test_search_filter_matches_title(self):
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get('/api/tasks/?search=indexes')
        self.assertEqual(response.data['count'], 1)

        empty_response = self.client.get('/api/tasks/?search=nonexistent')
        self.assertEqual(empty_response.data['count'], 0)