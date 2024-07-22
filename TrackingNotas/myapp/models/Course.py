from django.db import models
from django.conf import settings
from .Teacher import Teacher

class Course(models.Model):
    idCourse = models.IntegerField(primary_key=True, unique=True)
    nameCourse = models.CharField(max_length=100, unique=True)
    credit = models.IntegerField(null=True)
    prerequisite = models.IntegerField(null=True, blank=True)
    semester = models.IntegerField(null=True)
    laboratory = models.BooleanField(null=True, blank=True)
    hoursTeory = models.IntegerField(null=True, blank=True)
    hoursPractice = models.IntegerField(null=True, blank=True)
    p1 = models.IntegerField(null=True)
    p2 = models.IntegerField(null=True)
    p3 = models.IntegerField(null=True)
    e1 = models.IntegerField(null=True)
    e2 = models.IntegerField(null=True)
    e3 = models.IntegerField(null=True)
    status = models.BooleanField(null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    id_user_created = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='course_created', 
        on_delete=models.SET_NULL, null=True, 
        blank=True)
    id_user_modified = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='course_modified',
        on_delete=models.SET_NULL, null=True, 
        blank=True)

    def __str__(self):
        return "%s" % (self.nameCourse)
