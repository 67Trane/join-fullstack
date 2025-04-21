from join.models import Task, Contact, User, Status, SubTask
from rest_framework import viewsets
from .serializers import SubTaskSerializer,TaskSerializer, ContactSerializer,StatusSerializer , UserSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class SubTaskView(viewsets.ModelViewSet):
    queryset = SubTask.objects.all()
    serializer_class = SubTaskSerializer

class TaskView(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    @action(detail=True, methods=['get'])
    def subtask(self, request, pk=None):
        # pk ist hier die Task‑ID
        task = self.get_object()
        subs  = task.subtask.all()
        page  = self.paginate_queryset(subs)
        if page is not None:
            serializer = SubTaskSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = SubTaskSerializer(subs, many=True)
        return Response(serializer.data)

class ContactsView(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer



class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class StatusView(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer