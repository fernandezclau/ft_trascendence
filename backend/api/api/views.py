from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Item
from .serializers import ItemSerializer
import requests
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth.models import User

@api_view(['GET'])
def getData(request):
    items = Item.objects.all()
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def addItem(request):
    serializer = ItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)



CLIENT_ID = "u-s4t2ud-7456ff4f1b1c4670f566f8f9ba5ca586461a68cc7935c230a7d415d55f0aae94"
CLIENT_SECRET = "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"
REDIRECT_URI = "http://localhost:8000/api/auth/callback"

def login_42(request):

    auth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code"
    return redirect(auth_url)

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
    login = user_data.get("login")
    email = user_data.get("email")

    user, created = User.objects.get_or_create(
        username=login,
        defaults={"email": email}
    )


    if created:

        return JsonResponse({
            "login": login,
            "email": email,
            "new_user": created
        })

    return JsonResponse({
        "login": login,
        "email": email,
        "new_user": created
    })