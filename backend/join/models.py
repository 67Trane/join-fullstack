from django.db import models

# Create your models here.
class Status(models.Model):
    awaitfeedback = models.CharField(max_length=50)
    done = models.CharField(max_length=50)
    inprogress = models.CharField(max_length=50)
    todo = models.CharField(max_length=50)
    urgent = models.CharField(max_length=50)

class User(models.Model):
    nameIn = models.CharField(max_length=100)


class Contact(models.Model):
    nameIn = models.CharField(max_length=200)
    emailIn = models.EmailField()
    phoneIn = models.IntegerField()
    isUser = models.BooleanField(default=False)
    color = models.CharField(max_length=100)

    def __str__(self):
        return self.nameIn  

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    assignedto =models.ManyToManyField(Contact, blank=True, related_name="assignedto")
    date = models.DateField()
    prio = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    color = models.CharField(max_length=100, blank=True)
    inits = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=50, default="todo")

    def __str__(self):
        return self.title

class SubTask(models.Model):
    task = models.ForeignKey(
        Task,
        related_name="subtask",
        on_delete=models.CASCADE
    )
    name    = models.CharField(max_length=200)
    status  = models.CharField(
        max_length=20,
        choices=[("todo","To Do"), ("inwork","In Work"), ("done","Done")],
        default="todo"
    )