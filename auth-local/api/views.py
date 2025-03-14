from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import api_view
from django.middleware.csrf import get_token
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import get_user_model
import jwt
import datetime
import os
import environ
from django.core.exceptions import ValidationError

CustomUser = get_user_model()
env = environ.Env()
environ.Env.read_env(os.path.join(os.path.dirname(__file__), '../.env'))

SECRET_KEY = env('SECRET_KEY')

LOGGED_IN_USERS = {}

def generate_jwt(user):
    payload = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'image_url': user.image_url, 
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

@api_view(["POST"])
@csrf_protect
def register_user(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    temp = email.lower()
    email = temp

    if not username or not email or not password:
        return JsonResponse({"error": "Todos los campos son obligatorios."}, status=400)
    if CustomUser.objects.filter(email=email).exists():
        return JsonResponse({"error": "Este email ya está registrado."}, status=400)
    if CustomUser.objects.filter(username=username).exists():
        return JsonResponse({"error": "Este nombre de usuario ya está en uso."}, status=400)
    if len(password) < 8:
        return JsonResponse({"error": "La contraseña debe tener al menos 8 caracteres."}, status=400)
    if(len(username) < 4):
        return JsonResponse({"error": "El nombre de usuario debe tener al menos 4 caracteres."}, status=400)
    if not any(char.isdigit() for char in password):
        return JsonResponse({"error": "La contraseña debe tener al menos un dígito."}, status=400)
    if not any(char.isupper() for char in password):
        return JsonResponse({"error": "La contraseña debe tener al menos una letra mayúscula."}, status=400)

    if not email.count("@") == 1 or not email.count(".") >= 1:
        return JsonResponse({"error": "Email inválido."}, status=400)

    try:
        user = CustomUser.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            image_url="https://i.imgur.com/DP2aShH.png"
        )
        token = generate_jwt(user)

        return JsonResponse({
            "message": "Usuario registrado correctamente.",
            "token": token,
            "username": user.username,
            "image_url": user.image_url
        }, status=201)

    except ValidationError as e:
        return JsonResponse({"error": str(e)}, status=400)


@api_view(["GET"])
def get_csrf_token(request):
    response = JsonResponse({"csrfToken": get_token(request)})
    response["Access-Control-Allow-Credentials"] = "true"
    response["Access-Control-Allow-Origin"] = "https://localhost:8443"
    response.set_cookie(
        "csrftoken",
        get_token(request),
        max_age=60 * 60,
        secure=True,
        httponly=True,
        samesite="Lax"
    )
    return response

@api_view(["POST"])
@csrf_protect
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return JsonResponse({"error": "Email y contraseña son requeridos."}, status=400)

    user = CustomUser.objects.filter(email=email).first()
    
    if user and check_password(password, user.password):
        token = generate_jwt(user)

        LOGGED_IN_USERS[user.id] = token
        
        return JsonResponse({
            "token": token,
            "username": user.username,
            "image_url": user.image_url,
            "message": "Login exitoso"
        }, status=200)
    
    return JsonResponse({"error": "Credenciales inválidas"}, status=401)

@api_view(["GET"])
def get_user_token(request):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return JsonResponse({"error": "Unauthorized"}, status=401)

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("id")

        # 🔹 Validar que el usuario sigue autenticado
        if user_id not in LOGGED_IN_USERS or LOGGED_IN_USERS[user_id] != token:
            return JsonResponse({"error": "Unauthorized"}, status=401)

        return JsonResponse({"token": token})
    
    except jwt.ExpiredSignatureError:
        return JsonResponse({"error": "Token expired"}, status=401)
    except jwt.DecodeError:
        return JsonResponse({"error": "Invalid token"}, status=401)

@api_view(["POST"])
def logout_user(request):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return JsonResponse({"error": "Unauthorized"}, status=401)

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("id")

        if user_id in LOGGED_IN_USERS:
            del LOGGED_IN_USERS[user_id]

        return JsonResponse({"message": "Logout exitoso"}, status=200)
    
    except jwt.ExpiredSignatureError:
        return JsonResponse({"error": "Token expired"}, status=401)
    except jwt.DecodeError:
        return JsonResponse({"error": "Invalid token"}, status=401)