from django.urls import path, include
from .views import login_user, register_user

urlpatterns = [
    path("api/auth/login", login_user, name="login_user"),
    path("api/auth/register", register_user, name="register_user"),
    path('api/auth/', include('api.urls')),
]
