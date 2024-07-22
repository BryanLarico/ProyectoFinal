from django.db import models
from datetime import datetime
from django.conf import settings
from.Course import Course

class Section(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    GROUPS = [
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
    ]
    group = models.CharField(null=False, max_length=1, choices=GROUPS, default='A')
    capacity = models.PositiveIntegerField(null=False, default=20)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    id_user_created = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='section_created', on_delete=models.SET_NULL, null=True, blank=True)
    id_user_modified = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='section_modified', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['course__nameCourse', 'group', 'capacity']
        constraints = [
            models.UniqueConstraint(fields=['course', 'group'], name='unique_workload')
        ]

    def __str__(self):
        return "%s %s %s" % (self.course.nameCourse, self.group, self.capacity)