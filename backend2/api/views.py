from django.http import JsonResponse
from rest_framework.decorators import api_view
import jwt
import datetime
import os
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User

SECRET_KEY = os.getenv("SECRET_KEY")

def home(request):
    return JsonResponse({"message": "Auth DB API is running!"})

def generate_jwt(user):
    """Genera un JWT para el usuario autenticado."""
    payload = {
        'id': user.id,
        'username': user.username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

@api_view(['POST'])
def register_user(request):
    """Registra un usuario con email y contraseña."""
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return JsonResponse({"error": "Email y contraseña son requeridos."}, status=400)

    if User.objects.filter(username=email).exists():
        return JsonResponse({"error": "Este usuario ya existe."}, status=400)

    user = User.objects.create_user(username=email, email=email, password=password) # create_user ya hashea la pass

    return JsonResponse({"message": "Usuario creado correctamente."}, status=201)

@api_view(['POST'])
def login_user(request):
    """Autentica un usuario y devuelve un token JWT."""
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return JsonResponse({"error": "Email y contraseña son requeridos."}, status=400)

    user = User.objects.filter(username=email).first()
    if user and check_password(password, user.password): # check_password compara la pass ingresada con la hasheada
        token = generate_jwt(user)
        return JsonResponse({"token": token, "message": "Login exitoso"})
    
    return JsonResponse({"error": "Credenciales inválidas"}, status=401)
