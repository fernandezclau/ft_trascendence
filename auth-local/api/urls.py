from django.urls import path, include
from .views import login_user, register_user, get_csrf_token
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def metrics_view(request):
    return HttpResponse(generate_latest(), content_type=CONTENT_TYPE_LATEST)

urlpatterns = [
    path("api/auth/register", register_user, name="register_user"),
    path("api/auth/login", view=login_user, name="login_user"),
    path("api/auth/csrf/", get_csrf_token, name="get_csrf_token"),
    path("metrics/", metrics_view, name="metrics"),
]
