from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.decorators import api_view
import jwt
import datetime
import os
from django.http import JsonResponse

SECRET_KEY = os.getenv("SECRET_KEY")

def home(request):
    return JsonResponse({"message": "Auth DB API is running!"})

def generate_jwt(user):
    payload = {
        'id': user.id,
        'username': user.username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        'iat': datetime.datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

@api_view(['POST'])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(username=email, password=password)
    if user is not None:
        token = generate_jwt(user)
        return JsonResponse({"token": token, "message": "Login successful"})
    else:
        return JsonResponse({"error": "Invalid credentials"}, status=401)

