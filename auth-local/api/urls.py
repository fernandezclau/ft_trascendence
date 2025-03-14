from django.urls import path, include
from .views import login_user, register_user, get_csrf_token, get_user_token, logout_user
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def metrics_view(request):
    return HttpResponse(generate_latest(), content_type=CONTENT_TYPE_LATEST)

urlpatterns = [
    path("api/auth/register", register_user, name="register_user"),
    path("api/auth/login", login_user, name="login_user"),
    path("api/auth/csrf/", get_csrf_token, name="get_csrf_token"),
    path("api/auth/get_user_token", get_user_token, name="get_user_token"),
    path("api/auth/logout", logout_user, name="logout_user"),
    path("", include("django_prometheus.urls")),
    path("metrics/", metrics_view, name="metrics"),
]
    