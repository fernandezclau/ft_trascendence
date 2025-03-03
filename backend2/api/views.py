from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import make_password, check_password
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
import requests
import jwt
import datetime
import os

# Obtener el modelo CustomUser
CustomUser = get_user_model()

SECRET_KEY = os.getenv("SECRET_KEY")

def generate_jwt(user):
    payload = {
        'id': user.id,
        'username': user.username,
        'image_url': user.image_url,  # Agregar imagen para el frontend
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

@api_view(['POST'])
def register_user(request):
    """Registra un usuario con email y contraseña."""
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not email or not password:
        return JsonResponse({"error": "Todos los campos son obligatorios."}, status=400)

    if CustomUser.objects.filter(username=username).exists():
        return JsonResponse({"error": "Este nombre de usuario ya está en uso."}, status=400)

    if CustomUser.objects.filter(email=email).exists():
        return JsonResponse({"error": "Este email ya está registrado."}, status=400)

    try:
        user = CustomUser.objects.create(
            username=username,
            email=email,
            password=make_password(password),  # Hashear la contraseña
            image_url="https://i.imgur.com/DP2aShH.png"  # Imagen por defecto
        )
        return JsonResponse({"message": "Usuario registrado correctamente."}, status=201)
    except ValidationError as e:
        return JsonResponse({"error": str(e)}, status=400)

@api_view(['POST'])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return JsonResponse({"error": "Email y contraseña son requeridos."}, status=400)

    user = CustomUser.objects.filter(email=email).first()
    if user and check_password(password, user.password):
        token = generate_jwt(user)
        return JsonResponse({"token": token, "image_url": user.image_url, "message": "Login exitoso"})
    
    return JsonResponse({"error": "Credenciales inválidas"}, status=401)
