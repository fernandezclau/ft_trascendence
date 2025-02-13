# from django.urls import path
#
# from . import views
# from .views import index, spa_content
#
# urlpatterns = [
#     path('', index, name='index'),  # Página principal con index.html
#     path("content/<str:page>", spa_content, name="spa_content"),
#     path('register/', views.register, name='register')
# ]

from django.urls import path
from .views import registro

urlpatterns = [
    path('', registro, name='registro'),  # Página principal con index.html
    path("registro/", registro, name="registro"),
]

