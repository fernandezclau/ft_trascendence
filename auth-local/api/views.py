from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from rest_framework.decorators import api_view
from django.middleware.csrf import get_token
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import get_user_model
import jwt
import datetime
import os
import environ
from django.core.exceptions import ValidationError

# Importar el servicio OTP
from .otp_service import OTPService

CustomUser = get_user_model()
env = environ.Env()
environ.Env.read_env(os.path.join(os.path.dirname(__file__), '../.env'))

SECRET_KEY = env('SECRET_KEY')

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
@csrf_exempt 
def register_user(request):
    # (código existente de validación)
    
    try:
        # Generar clave secreta para OTP
        otp_secret = OTPService.generate_secret()
        
        # Crear usuario con la clave secreta
        user = CustomUser.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            image_url="https://i.imgur.com/DP2aShH.png",
            otp_secret=otp_secret,
            otp_verified=False
        )
        
        # Generar token temporal para configuración 2FA
        setup_token = jwt.encode({
            'user_id': user.id,
            'type': 'otp_setup',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15)  # Válido por 15 minutos
        }, SECRET_KEY, algorithm='HS256')
        
        # Generar código QR para configuración de Google Authenticator
        qr_code = OTPService.generate_qr_code(username, otp_secret)

        return JsonResponse({
            "message": "Usuario registrado correctamente. Por favor, configura la autenticación de dos factores.",
            "setup_token": setup_token,
            "qr_code": qr_code,
            "username": user.username,
            "image_url": user.image_url,
            "requiresOTP": True
        }, status=201)

    except ValidationError as e:
        return JsonResponse({"error": str(e)}, status=400)

@api_view(['POST'])
@csrf_protect 
def login_user(request):
    """Autentica un usuario con email y contraseña."""
    email = request.data.get("email")
    password = request.data.get("password")
    otp_token = request.data.get("otp")

    if not email or not password:
        return JsonResponse({"error": "Email y contraseña son requeridos."}, status=400)

    user = CustomUser.objects.filter(email=email).first()
    
    if user and check_password(password, user.password):
        # Si el usuario no ha completado la verificación 2FA
        if not user.otp_verified:
            return JsonResponse({
                "requiresOTP": True,
                "message": "Completa la verificación OTP",
                "userId": user.id
            }, status=200)
        
        # Verificar OTP si el usuario ya está configurado
        if not otp_token:
            return JsonResponse({
                "requiresOTP": True,
                "message": "Ingresa el código de autenticación de Google Authenticator",
                "userId": user.id
            }, status=200)
        
        # Verificar OTP
        is_valid = OTPService.verify_otp(user.otp_secret, otp_token)
        if not is_valid:
            return JsonResponse({"error": "Código de autenticación inválido"}, status=401)
        
        # Si todo es correcto, generar token JWT
        token = generate_jwt(user)
        return JsonResponse({
            "token": token,
            "username": user.username,
            "image_url": user.image_url,
            "message": "Login exitoso"
        }, status=200)
    
    return JsonResponse({"error": "Credenciales inválidas"}, status=401)

@api_view(["POST"])
def verify_otp(request):
    """Verifica el código OTP durante el primer login o configuración"""
    # Obtener el token desde el encabezado
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JsonResponse({"error": "Token no proporcionado"}, status=401)
    
    token = auth_header.split(" ")[1]
    
    # Obtener datos del cuerpo de la solicitud
    otp_token = request.data.get("otp")
    
    if not otp_token:
        return JsonResponse({"error": "Código OTP requerido"}, status=400)

    try:
        # Verificar token temporal
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        
        # Verificar tipo de token
        token_type = payload.get('type')
        if token_type not in ['otp_setup', 'login']:
            return JsonResponse({"error": "Token inválido"}, status=401)
        
        # Obtener usuario
        user = CustomUser.objects.get(id=payload['user_id'])
        
        # Verificar OTP
        is_valid = OTPService.verify_otp(user.otp_secret, otp_token)
        if not is_valid:
            return JsonResponse({"error": "Código de autenticación inválido"}, status=401)
        
        # Marcar usuario como verificado
        user.otp_verified = True
        user.save()
        
        # Generar token JWT
        token = generate_jwt(user)
        return JsonResponse({
            "token": token,
            "username": user.username,
            "image_url": user.image_url,
            "message": "Verificación completada exitosamente"
        }, status=200)
        
    except jwt.ExpiredSignatureError:
        return JsonResponse({"error": "Token expirado"}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({"error": "Token inválido"}, status=401)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "Usuario no encontrado"}, status=404)

@api_view(["GET"])
def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)}, status=200)

@api_view(["GET"])
def get_otp_setup(request):
    """Obtiene la información de configuración OTP usando un token temporal"""
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        return JsonResponse({"error": "Token no proporcionado"}, status=401)
    
    token = auth_header.split(" ")[1]
    
    try:
        # Verificar token temporal
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        
        # Verificar que es un token de configuración OTP
        if payload.get('type') != 'otp_setup':
            return JsonResponse({"error": "Token inválido"}, status=401)
        
        # Obtener usuario
        user = CustomUser.objects.get(id=payload['user_id'])
        
        # Generar código QR
        qr_code = OTPService.generate_qr_code(user.username, user.otp_secret)
        
        return JsonResponse({
            "qr_code": qr_code,
            "userId": user.id
        })
    
    except jwt.ExpiredSignatureError:
        return JsonResponse({"error": "Token expirado"}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({"error": "Token inválido"}, status=401)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "Usuario no encontrado"}, status=404)