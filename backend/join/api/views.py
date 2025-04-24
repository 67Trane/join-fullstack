from join.models import Task, Contact, CurrentUser, Status, SubTask
from rest_framework import viewsets
from .serializers import SubTaskSerializer, TaskSerializer, ContactSerializer, StatusSerializer, CurrentUserSerializer, EmailAuthTokenSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.views import APIView
from .serializers import RegistrationSerializer
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken


class RegistrationView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)

        data = {}
        if serializer.is_valid():
            saved_account = serializer.save()
            token, created = Token.objects.get_or_create(user=saved_account)
            data = {
                'token': token.key,
                'username': saved_account.username,
                'email': saved_account.email,
                'user': saved_account.id,
            }
            return Response(data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomLoginView(ObtainAuthToken):
    permission_classes = [permissions.AllowAny]
    serializer_class = EmailAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
                'email': user.email,
                'user': user.id
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubTaskView(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = SubTask.objects.all()
    serializer_class = SubTaskSerializer


class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    @action(detail=True, methods=['get'])
    def subtask(self, request, pk=None):
        # pk ist hier die Task‑ID
        task = self.get_object()
        subs = task.subtask.all()
        page = self.paginate_queryset(subs)
        if page is not None:
            serializer = SubTaskSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = SubTaskSerializer(subs, many=True)
        return Response(serializer.data)


class ContactsView(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ContactSerializer

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user)


class CurrentUserView(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = CurrentUser.objects.all()
    serializer_class = CurrentUserSerializer


class StatusView(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
