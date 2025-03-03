from django.http import JsonResponse
from rest_framework.decorators import api_view
import requests
import jwt
import datetime
import os
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
import environ

env = environ.Env()
environ.Env.read_env(os.path.join(os.path.dirname(__file__), '../.env'))

User = get_user_model()

SECRET_KEY = env('SECRET_KEY')
CLIENT_ID = env('CLIENT_ID')
CLIENT_SECRET = env('CLIENT_SECRET')
REDIRECT_URI = env('REDIRECT_URI')

def generate_jwt(user):
    """Genera un token JWT para el usuario autenticado."""
    payload = {
        'id': user.id,
        'username': user.username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def login_42(request):
    """Redirige al usuario a la API de 42 para autenticación."""
    auth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code"
    return redirect(auth_url)

@api_view(['GET'])
def callback_42(request):
    
    code = request.GET.get("code")
    if not code:
        return JsonResponse({"error": "No code provided"}, status=400)

    token_url = "https://api.intra.42.fr/oauth/token"
    token_data = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "redirect_uri": REDIRECT_URI,
    }
    response = requests.post(token_url, data=token_data)

    if response.status_code != 200:
        return JsonResponse({"error": "Failed to obtain access token"}, status=400)

    access_token = response.json().get("access_token")

    user_info_url = "https://api.intra.42.fr/v2/me"
    headers = {"Authorization": f"Bearer {access_token}"}
    user_info_response = requests.get(user_info_url, headers=headers)

    if user_info_response.status_code != 200:
        return JsonResponse({"error": "Failed to fetch user info"}, status=400)

    user_data = user_info_response.json()
    intra_id = user_data.get("id")
    login = user_data.get("login")
    email = user_data.get("email")
    image_url = user_data.get("image", {}).get("link")

    user, created = User.objects.get_or_create(
        username=login,
        defaults={
            "email": email,
            "image_url": image_url,
            "token": access_token,
        }
    )
    if not created:
        user.token = access_token
        user.save()

    # Generar un token JWT
    jwt_token = generate_jwt(user)
    redirect_url = f"http://localhost:8080/?token={jwt_token}&index.html"
    return redirect(redirect_url)
