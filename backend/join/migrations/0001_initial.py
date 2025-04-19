# Generated by Django 5.2 on 2025-04-15 10:51

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Contact",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=200)),
                ("email", models.EmailField(max_length=254)),
                ("phone", models.IntegerField()),
                ("isUser", models.BooleanField(default=False)),
                ("color", models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name="Subtasks",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=200)),
                ("status", models.CharField(default="inwork", max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name="Task",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=200)),
                ("description", models.TextField()),
                ("date", models.DateField()),
                ("prio", models.CharField(max_length=200)),
                ("category", models.CharField(max_length=100)),
                ("color", models.CharField(max_length=100)),
                ("inits", models.CharField(max_length=100)),
                ("status", models.CharField(default="todo", max_length=50)),
                (
                    "assignedto",
                    models.ManyToManyField(
                        related_name="assignedto", to="join.contact"
                    ),
                ),
                (
                    "subtasks",
                    models.ManyToManyField(related_name="subtasks", to="join.subtasks"),
                ),
            ],
        ),
    ]
