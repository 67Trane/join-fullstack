from django.conf import settings
from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Status(models.Model):
    awaitfeedback = models.CharField(max_length=50)
    done = models.CharField(max_length=50)
    inprogress = models.CharField(max_length=50)
    todo = models.CharField(max_length=50)
    urgent = models.CharField(max_length=50)


class CurrentUser(models.Model):
    token = models.CharField(max_length=200, blank=True)
    nameIn = models.CharField(max_length=100)
    emailIn = models.EmailField(blank=True)
    phoneIn = models.IntegerField(default=0, blank=True)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class Contact(models.Model):
    nameIn = models.CharField(max_length=200)
    emailIn = models.EmailField()
    phoneIn = models.CharField(max_length=20)
    isUser = models.BooleanField(default=False)
    color = models.CharField(max_length=100)
    user = models.ManyToManyField(
        User,
        related_name='contacts',
        blank=True
    )


class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    assignedto = models.ManyToManyField(Contact, blank=True, related_name="assignedto")
    date = models.DateField()
    prio = models.CharField(max_length=200)
    category = models.CharField(max_length=100, choices=[("Technical Task", "Technical Task"), ("User Story", "User Story")])
    color = models.JSONField(blank=True, default=list)
    inits = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=50, default="todo")
    user = models.ManyToManyField(
        User,
        related_name='task_user',
        blank=True
    )

    def __str__(self):
        return self.title


class SubTask(models.Model):
    task = models.ForeignKey(
        Task,
        related_name="subtask",
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=200)
    status = models.CharField(
        max_length=20,
        choices=[("todo", "To Do"), ("inwork", "In Work"), ("done", "Done")],
        default="todo"
    )
