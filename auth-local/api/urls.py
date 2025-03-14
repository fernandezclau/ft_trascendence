from django.urls import path, include
from .views import login_user, register_user, get_csrf_token, get_user_token, logout_user

urlpatterns = [
    path("api/auth/register", register_user, name="register_user"),
    path("api/auth/login", login_user, name="login_user"),
    path("api/auth/csrf/", get_csrf_token, name="get_csrf_token"),
    path("api/auth/get_user_token", get_user_token, name="get_user_token"),
    path("api/auth/logout", logout_user, name="logout_user"),
    path("", include("django_prometheus.urls")),
]
    