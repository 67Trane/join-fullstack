from django.contrib import admin
from django.urls import path, include
from .views import TaskView, ContactsView, CurrentUserView, StatusView, RegistrationView, CustomLoginView
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

router = routers.SimpleRouter()
router.register(r'addTask', TaskView, basename='task')
router.register(r'contacts', ContactsView, basename='contacts')
router.register(r'curent-user', CurrentUserView, basename='current-user')
router.register(r'Status', StatusView, basename='status')


urlpatterns = [
    path('', include(router.urls)),
    path('registration/', RegistrationView.as_view(), name="registration"),
    # path("login/", obtain_auth_token, name="login") CutomLoginView mit obatin_auth_token wechseln für die nicht-custom variante
    path("login/", CustomLoginView.as_view(), name="login")
]
