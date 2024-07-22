from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime
from django.conf import settings
from .Registration import Registration
from .Event import Event

class Grades(models.Model):
    idGrades = models.AutoField(primary_key=True)
    idRegistration = models.ForeignKey(Registration, on_delete=models.CASCADE)
    idEvent = models.ForeignKey(Event, on_delete=models.CASCADE)
    progress = models.IntegerField(null=False, validators=[
        MinValueValidator(0),
        MaxValueValidator(20)
    ])
    exam = models.IntegerField(null=False, validators=[
        MinValueValidator(0),
        MaxValueValidator(20)
    ])
    average = models.IntegerField(null=False, validators=[
        MinValueValidator(0),
        MaxValueValidator(20)
    ])
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    id_user_created = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='grades_created', on_delete=models.SET_NULL, null=True, blank=True)
    id_user_modified = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='grades_modified', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return "Registration: %s, Unit: %s, Progress: %d, Exam: %d, Average: %d" % (
            self.id_registration, self.id_unit, self.progress, self.exam, self.average
        )

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(progress__gte=0, progress__lte=20), name='progress_range'),
            models.CheckConstraint(check=models.Q(exam__gte=0, exam__lte=20), name='exam_range'),
            models.CheckConstraint(check=models.Q(average__gte=0, average__lte=20), name='average_range')
        ]
