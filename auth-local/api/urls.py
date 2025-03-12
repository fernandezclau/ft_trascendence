urlpatterns = [
    path("api/auth/register", register_user, name="register_user"),
    path("api/auth/login", view=login_user, name="login_user"),
    path("api/auth/verify-otp", view=verify_otp, name="verify_otp"),
    path("api/auth/otp-setup", view=get_otp_setup, name="get_otp_setup"),
    path("api/auth/csrf/", get_csrf_token, name="get_csrf_token"),
    path("", include("django_prometheus.urls")),
]