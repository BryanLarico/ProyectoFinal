# webapp/myapp/models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None,**extra_fields):
        if not email:
            raise ValueError('El usuario debe tener un correo electrónico')

        email = self.normalize_email(email)
        usuario = self.model(username=username, email=email, **extra_fields)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('El usuario debe tener un correo electrónico')

        extra_fields.setdefault('semester', 1)  # Proporciona un valor por defecto para el campo 'semester'
        extra_fields.setdefault('user_type', 'admin')
        extra_fields.setdefault('usuario_teacher', True)

        email = self.normalize_email(email)
        usuario = self.model(username=username, email=email, **extra_fields)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario
    """
    def create_superuser(self, username, email, password=None):
        #extra_fields.setdefault('is_staff', True)
        #extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, email, password)
    """
    
    def create_total_user(self, email, username, user_type, name, dni, password=None):
        if not email:
            raise ValueError('El usuario debe tener un correo electrónico')

        email = self.normalize_email(email)
        usuario = self.model(
            username=username,
            email=email,
            user_type=user_type,
            name=name,
            dni=dni,
        )
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario


class User(AbstractBaseUser):
    ADMIN = 'admin'
    CLIENT = 'client'

    USER_TYPE_CHOICES = [
        (ADMIN, 'Teacher'),
        (CLIENT, 'Student'),
    ]

    username = models.CharField('Nombre de usuario', unique=True, max_length=100)
    email = models.EmailField('Correo Electrónico', max_length=254, unique=True)
    user_type = models.CharField(max_length=15, choices=USER_TYPE_CHOICES, default=CLIENT)
    semester = models.IntegerField('Semestre', default=1, validators=[
        MinValueValidator(1),
        MaxValueValidator(10)
    ])
    name = models.CharField('Nombres', max_length=200, blank=True, null=True)
    dni = models.CharField(max_length=20, blank=True, null=True)
    registration_date = models.DateField(auto_now_add=True)
    usuario_activo = models.BooleanField(default=True)
    usuario_teacher = models.BooleanField(default=False)
    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return f'{self.username}, {self.dni}'

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.usuario_teacher

    @property
    def is_superuser(self):
        return self.user_type == self.ADMIN
