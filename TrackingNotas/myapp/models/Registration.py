from django.db import models
from datetime import datetime
from django.conf import settings
from .Student import Student

class Registration(models.Model):
    idRegistration = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    semester = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    id_user_created = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='registration_created', on_delete=models.SET_NULL, null=True, blank=True)
    id_user_modified = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='registration_modified', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = "Registration"
        verbose_name_plural = "Registrations"

    def __str__(self):
        return f"{self.student.name} - Semester {self.semester}"
