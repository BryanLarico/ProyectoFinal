from django.db import models
from datetime import datetime
from django.conf import settings


class Teacher(models.Model):
    idTeacher = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    id_user_created = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='teacher_created', on_delete=models.SET_NULL, null=True, blank=True)
    id_user_modified = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='teacher_modified', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = "Teacher"
        verbose_name_plural = "Teachers"

    def __str__(self):
        return self.name
