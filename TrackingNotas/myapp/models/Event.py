from django.db import models
from django.conf import settings
from .Course import Course
from django.core.validators import MinValueValidator, MaxValueValidator

class Event(models.Model):
    idEvent = models.AutoField(primary_key=True)
    idCourse = models.ForeignKey(Course, on_delete=models.CASCADE)
    amountEvent = models.IntegerField(null=False)
    percentageProgress = models.FloatField(null=False, validators=[
        MinValueValidator(0),
        MaxValueValidator(100)
    ])
    percentageExam = models.FloatField(null=False, validators=[
        MinValueValidator(0),
        MaxValueValidator(100)
    ])

    def __str__(self):
        return "Course: %s, Amount Event: %d, Percentage Progress: %.2f, Percentage Exam: %.2f" % (
            self.idCourse, self.amountEvent, self.percentageProgress, self.percentageExam
        )
    
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    id_user_created = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='event_created', on_delete=models.SET_NULL, null=True, blank=True)
    id_user_modified = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='event_modified', on_delete=models.SET_NULL, null=True, blank=True)
