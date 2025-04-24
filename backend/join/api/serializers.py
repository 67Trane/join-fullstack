from rest_framework import serializers
from join.models import Task, Contact, Status, SubTask, CurrentUser
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class RegistrationSerializer(serializers.ModelSerializer):
    repeated_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'repeated_password']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }
        
    def save(self):
        pw = self.validated_data['password']
        repeated_pw = self.validated_data['repeated_password']
        
        if pw != repeated_pw:
            raise serializers.ValidationError({'error': 'Password dont match'})
        
        account = User(email=self.validated_data['email'], username=self.validated_data['username'])
        account.set_password(pw)
        account.save()
        return account

class EmailAuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField(label="E-Mail")
    password = serializers.CharField(label="Passwort", write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Versuch, den User über die E-Mail zu holen
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Ungültige E-Mail / Passwort Kombination.")

        # authenticate erwartet einen username, also leiten wir weiter
        user = authenticate(username=user_obj.username, password=password)
        if not user:
            raise serializers.ValidationError("Ungültige E-Mail / Passwort Kombination.")

        attrs['user'] = user
        return attrs

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
        fields = ['id', 'title', 'description', 'prio', 'status',
                  'assignedto', 'date', 'category', 'color', 'inits', 'subtask', 'user']

    def update(self, instance, validated_data):
        subs = validated_data.pop('subtask', None)
        instance = super().update(instance, validated_data)

        if subs is not None:
            instance.subtask.all().delete()
            for s in subs:
                SubTask.objects.create(task=instance, **s)

        return instance

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


class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentUser
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
