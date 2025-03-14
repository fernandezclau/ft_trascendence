from django.urls import path, include
from . import views
from .views import get_user_info, logout_user


urlpatterns = [
    path("api/auth/42/login", views.login_42, name="login_42"),
    path("api/auth/callback", views.callback_42, name="callback_42"),
    path("api/auth/user", get_user_info, name="get_user_info"),
    path("api/auth/get_user_token", views.get_user_token, name="get_user_token"),
    path("api/auth/logout", logout_user, name="logout_user"),
    path("", include("django_prometheus.urls")),
]
