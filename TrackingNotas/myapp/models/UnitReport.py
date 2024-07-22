from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from .Course import Course
from .Event import Event
from .Student import Student

class UnitReport(models.Model):
    idUnitReport = models.AutoField(primary_key=True)
    idCourse = models.ForeignKey(Course, on_delete=models.CASCADE, null=True)
    idStudent = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
    eval_cont1 = models.FloatField(null=True, blank=True, validators=[
        MinValueValidator(0),
        MaxValueValidator(20)
    ])
    parcial1 = models.FloatField(null=True, blank=True, validators=[
        MinValueValidator(0),
        MaxValueValidator(20)
    ])
    eval_cont2 = models.FloatField(null=True, blank=True, validators=[
        MinValueValidator(0),
        MaxValueValidator(20)
    ])
    parcial2 = models.FloatField(null=True, blank=True, validators=[
        MinValueValidator(0),
        MaxValueValidator(20)
    ])
    eval_cont3 = models.FloatField(null=True, blank=True, validators=[
        MinValueValidator(0),
        MaxValueValidator(20)
    ])
    parcial3 = models.FloatField(null=True, blank=True, validators=[
        MinValueValidator(0),
        MaxValueValidator(20)
    ])

    def __str__(self):
        return f"Unit Report for Course: {self.idCourse.nameCourse} and Student: {self.idStudent.name}"