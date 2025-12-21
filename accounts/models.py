from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('GERENTE', 'Gerente'),
        ('ESTOQUISTA', 'Estoquista'),
    )
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ESTOQUISTA')
    matricula = models.CharField(max_length=20, unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'matricula', 'role']

    def __str__(self):
        return f"{self.first_name} ({self.role})"