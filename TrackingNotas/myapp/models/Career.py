from django.db import models
from datetime import datetime
from django.conf import settings

class Career(models.Model):
    idCareer = models.AutoField(primary_key=True)
    nameCareer = models.CharField(max_length=100, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    id_user_created = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='career_created', on_delete=models.SET_NULL, null=True, blank=True)
    id_user_modified = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='career_modified', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = "Career"
        verbose_name_plural = "Careers"

    def __str__(self):
        return self.nameCareer
