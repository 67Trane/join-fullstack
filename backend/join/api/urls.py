from django.contrib import admin
from django.urls import path, include
from .views import TaskView, ContactsView,SubTaskView, UserView, StatusView
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'addTask', TaskView)
router.register(r'contacts', ContactsView, basename='contacts')  # Hier den Basename explizit festlegen
router.register(r'curent-user', UserView, basename = 'user')
router.register(r'Status', StatusView, basename = 'status')

urlpatterns = [
    path('', include(router.urls)),
]