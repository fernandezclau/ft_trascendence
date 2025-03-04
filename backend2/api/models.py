from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    image_url = models.URLField(blank=True, null=True)

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="backend2_customuser_set",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="backend2_customuser_permissions_set",
        blank=True
    )

    class Meta:
        db_table = "backend2_customuser"  # Tabla con prefijo para evitar conflictos
        managed = True  # Django la manejará automáticamente
