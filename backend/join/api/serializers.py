from rest_framework import serializers
from join.models import Task, Contact, User, Status, SubTask



class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTask
        fields = ['name', 'status']

class TaskSerializer(serializers.ModelSerializer):
    subtask = SubTaskSerializer(many=True, required=False)
    assignedto = serializers.SlugRelatedField(
        many=True,
        queryset=Contact.objects.all(),
        slug_field='nameIn'
    )

    class Meta:
        model = Task
        fields = ['id','title', 'description', 'prio', 'status',  'assignedto', 'date', 'category', 'color', 'inits', 'subtask']

    def create(self, data):
        subs = data.pop('subtask', [])
        task = super().create(data)
        for s in subs:
            SubTask.objects.create(task=task, **s)
        return task


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = [
            "awaitfeedback",
            "done",
            "inprogress",
            "todo",
            "urgent"
        ]


