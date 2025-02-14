# pong/urls.py
from django.urls import path
from .views import RegisterView, LoginView, LogoutView, SomeProtectedView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('protected-endpoint/', SomeProtectedView.as_view(), name='protected-endpoint'),
]
