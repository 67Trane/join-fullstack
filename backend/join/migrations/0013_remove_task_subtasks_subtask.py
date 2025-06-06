# Generated by Django 5.2 on 2025-04-19 13:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("join", "0012_task_subtasks"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="task",
            name="subtasks",
        ),
        migrations.CreateModel(
            name="SubTask",
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
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("todo", "To Do"),
                            ("inwork", "In Work"),
                            ("done", "Done"),
                        ],
                        default="todo",
                        max_length=20,
                    ),
                ),
                (
                    "task",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="subtasks",
                        to="join.task",
                    ),
                ),
            ],
        ),
    ]
