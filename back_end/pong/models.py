from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

# AbstractUser built-in Django class that provides the core functionality
# of a user model (e.g., username, password, email, etc.).
class CustomUser(AbstractUser):
    # Adding a unique email field to the user model
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username
