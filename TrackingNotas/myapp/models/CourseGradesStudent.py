from django.db import models
from django.conf import settings
from .Course import Course
from django.core.validators import MinValueValidator, MaxValueValidator
from .UserManager import User, UserManager

class CourseGradesStudent(models.Model):
    idCourseGradesStudent = models.AutoField(primary_key=True)
    idCourse = models.ForeignKey(Course, on_delete=models.CASCADE)
    username = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    finalGrade = models.IntegerField(null=True, blank=True, validators=[
        MinValueValidator(0),
        MaxValueValidator(20)
    ])
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    id_user_created = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='course_created_grades_students', 
        on_delete=models.SET_NULL, null=True, 
        blank=True)
    id_user_modified = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='course_modified_grades_students',
        on_delete=models.SET_NULL, null=True, 
        blank=True)