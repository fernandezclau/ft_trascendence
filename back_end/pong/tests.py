# pong/tests.py
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import CustomUser


class RegisterTests(APITestCase):
    def test_register_user(self):
        url = reverse('register')
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123",
            "password2": "password123"
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], "User created successfully")
        self.assertIn('user', response.data)

    def test_register_user_password_mismatch(self):
        url = reverse('register')
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123",
            "password2": "differentpassword"
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_register_user_email_taken(self):
        # Primero creamos un usuario
        url = reverse('register')
        data = {
            "username": "existinguser",
            "email": "existinguser@example.com",
            "password": "password123",
            "password2": "password123"
        }
        self.client.post(url, data, format='json')  # Registro inicial

        # Intentamos registrar otro usuario con el mismo email
        data['username'] = "anotheruser"
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

class LoginTestCase(APITestCase):

    def setUp(self):
        """
        Configuración inicial antes de ejecutar las pruebas.
        Crea un usuario de prueba para usarlo en las pruebas de login.
        """
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword', email='testuser@example.com')

    def test_login_success(self):
        """
        Prueba de login exitoso.
        """
        data = {
            'username': 'testuser',
            'password': 'testpassword',
        }
        response = self.client.post('/api/login/', data, format='json')

        # Verificamos que la respuesta sea un estado 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Login exitoso')
        self.assertEqual(response.data['user']['username'], 'testuser')
        self.assertEqual(response.data['user']['email'], 'testuser@example.com')

    def test_login_invalid_credentials(self):
        """
        Prueba para cuando las credenciales son incorrectas.
        """
        data = {
            'username': 'testuser',
            'password': 'wrongpassword',
        }
        response = self.client.post('/api/login/', data, format='json')

        # Verificamos que la respuesta sea un estado 400 BAD REQUEST
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], 'Credenciales incorrectas')

    def test_login_user_not_exists(self):
        """
        Prueba para cuando el usuario no existe.
        """
        data = {
            'username': 'nonexistentuser',
            'password': 'somepassword',
        }
        response = self.client.post('/api/login/', data, format='json')

        # Verificamos que la respuesta sea un estado 400 BAD REQUEST
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], 'Credenciales incorrectas')


class LogoutTestCase(APITestCase):

    def setUp(self):
        """
        Configuración inicial antes de ejecutar las pruebas.
        Crea un usuario de prueba y lo autentica.
        """
        # Crear un usuario de prueba
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword')

        # Autenticamos al usuario para la sesión de pruebas
        self.client.login(username='testuser', password='testpassword')  # Este login es para simular la autenticación

    def test_logout_success(self):
        """
        Prueba de logout exitoso.
        Verifica que el usuario pueda hacer logout correctamente.
        """
        response = self.client.post('/api/logout/')  # Llamamos al endpoint de logout

        # Verificamos que la respuesta sea un estado 200 OK y el mensaje de éxito
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Logout exitoso')

    def test_logout_access_after_logout(self):
        """
        Verifica que, después de hacer logout, el usuario no pueda acceder a recursos protegidos.
        """
        # Hacemos logout
        self.client.post('/api/logout/')  # Realizamos logout

        # Intentamos acceder a un recurso protegido
        response = self.client.get('/api/protected-endpoint/')  # Este endpoint debe estar protegido

        # Verificamos que no se pueda acceder al recurso y que devuelva un error 401
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logout_without_authentication(self):
        """
        Verifica que un usuario no autenticado no pueda hacer logout.
        """
        # No estamos logueados, pero intentamos hacer logout
        response = self.client.post('/api/logout/')  # Intentamos hacer logout sin autenticarnos

        # Verificamos que la respuesta sea un error 401, ya que no estamos autenticados
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['detail'], 'Authentication credentials were not provided.')
