from django.db import models
from django.conf import settings
from .Teacher import Teacher
from .Course import Course
from .Student import Student
from django.core.validators import MinValueValidator, MaxValueValidator

class CourseGradesStudent(models.Model):
    idCourseGradesStudent = models.AutoField(primary_key=True)
    idCourse = models.ForeignKey(Course, on_delete=models.CASCADE)
    idStudent = models.ForeignKey(Student, on_delete=models.CASCADE)
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

    def __str__(self):
        finalGrade_display = self.finalGrade if self.finalGrade is not None else 'N/A'
        course_name = self.idCourse.nameCourse 
        student_name = self.idStudent.name  
        return "Course: %s, Student: %s, Final Grade: %s" % (
            course_name, student_name, finalGrade_display
        )