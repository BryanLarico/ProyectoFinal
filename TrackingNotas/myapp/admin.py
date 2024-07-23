from django.contrib import admin
from django.conf import settings
from django.contrib.auth import get_user_model
from .models.Career import Career
from .models.Course import Course
from .models.Event import Event
from .models.Grades import Grades
from .models.Registration import Registration
from .models.Section import Section
from .models.Student import Student
from .models.Teacher import Teacher
from .models.UnitReport import UnitReport
from .models.CourseGradesStudent import CourseGradesStudent
from .models.UserManager import User, UserManager

#CustomUser = get_user_model()

class BaseAdmin(admin.ModelAdmin):
    exclude = ('id_user_created', 'id_user_modified')

    def save_model(self, request, obj, form, change):
        if not change or not obj.id_user_created:
            obj.id_user_created = request.user
        obj.id_user_modified = request.user
        super().save_model(request, obj, form, change)
   
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'user_type', 'semester', 'name', 'dni', 'registration_date', 'usuario_activo', 'usuario_teacher')
    search_fields = ('username', 'email', 'semeste', 'name', 'dni')
    list_filter = ('user_type', 'usuario_activo', 'usuario_teacher')
   
class UserManagerAdmin(BaseAdmin):
    list_display: ['username', 'email', 'password']

class CourseAdmin(BaseAdmin):
    list_display = ['idCourse', 'nameCourse', 'credit', 'prerequisite', 'semester', 'laboratory', 'hoursTeory', 'hoursPractice', 'p1', 'p2', 'p3', 'e1', 'e2', 'e3', 'status', 'created', 'modified']

class CourseGradesStudentAdmin(BaseAdmin):
    list_display = ['idCourseGradesStudent', 'idCourse', 'idStudent', 'finalGrade', 'created', 'modified']
    
class EventAdmin(BaseAdmin):
    list_display = ['idEvent', 'idCourse', 'amountEvent', 'percentageProgress', 'percentageExam', 'created', 'modified']

class RegistrationAdmin(BaseAdmin):
    list_display = ['idRegistration', 'student', 'semester', 'created', 'modified']

class SectionAdmin(BaseAdmin):
    list_display = ['course', 'group', 'capacity', 'created', 'modified']

class StudentAdmin(BaseAdmin):
    list_display = ['idStudent', 'email', 'password', 'name', 'career', 'phone', 'created', 'modified']

class TeacherAdmin(BaseAdmin):
    list_display = ['idTeacher', 'email', 'password', 'name', 'phone', 'created', 'modified']

class GradesAdmin(BaseAdmin):
    list_display = ['idGrades', 'idRegistration', 'idEvent', 'progress', 'exam', 'average', 'created', 'modified']

class CareerAdmin(BaseAdmin):
    list_display = ['idCareer', 'nameCareer', 'created', 'modified']

class UnitReportAdmin(BaseAdmin):
    list_display = ['idUnitReport', 'idCourse', 'username', 'eval_cont1', 'parcial1', 'eval_cont2', 'parcial2', 'eval_cont3', 'parcial3']

admin.site.register(Course, CourseAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Registration, RegistrationAdmin)
admin.site.register(Section, SectionAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Grades, GradesAdmin)
admin.site.register(Career, CareerAdmin)
admin.site.register(UnitReport, UnitReportAdmin)
admin.site.register(CourseGradesStudent, CourseGradesStudentAdmin)
#admin.site.register(UserManager, User)