from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

#from django.contrib.auth.models import User 
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
from rest_framework_simplejwt.views import TokenObtainPairView

"""
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'password']
"""        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'semester', 'password', 'name', 'dni']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            semester=validated_data['semester'],
            user_type=validated_data.get('user_type', 'client'),
            name=validated_data.get('name', ''),
            dni=validated_data.get('dni', ''),
            registration_date=validated_data.get('registration_date', None),
            usuario_activo=validated_data.get('usuario_activo', True),
            usuario_teacher=validated_data.get('usuario_teacher', False),
        )
        return user

class UserManageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        #extra_kwargs = {'password': {'write_only': True}}
    
class UserManageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'semester', 'user_type', 'name',  'dni']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_total_user(
            email=validated_data['email'],
            username=validated_data['username'],
            user_type=validated_data.get('user_type', 'default_type'),
            name=validated_data.get('name', ''),
            dni=validated_data.get('dni', ''),
            semester=validated_data.get('semester', 1),
            password=validated_data['password'],
            registration_date=validated_data.get('registration_date'),
            usuario_activo=validated_data.get('usuario_activo', True),
            usuario_teacher=validated_data.get('usuario_teacher', False)
        )
        print(f"User registered: {user.username}, {user.user_type}")
        return user

class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(username=attrs['username'], password=attrs['password'])
        print(user)  # Imprime el objeto del usuario para verificar sus atributos
        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            payload = {
                'refresh': str(refresh),
                'access': access_token,
                'user_type': getattr(user, 'user_type', 'N/A')  # Usa getattr para evitar errores si el atributo no existe
            }
            return payload
        else:
            raise serializers.ValidationError("Credenciales inválidas")

class CareerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Career
        fields = ['idCareer', 'nameCareer', 'created', 'modified']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['idCourse', 'nameCourse', 'credit', 'prerequisite', 'semester', 'laboratory', 'hoursTeory', 'hoursPractice', 'p1', 'p2', 'p3', 'e1', 'e2', 'e3', 'status', 'created', 'modified']

class CourseGradesStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseGradesStudent
        fields = ['idCourseGradesStudent', 'idCourse', 'idStudent', 'finalGrade', 'created', 'modified']

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['idStudent', 'email', 'password', 'name', 'career', 'phone', 'created', 'modified']

class UnitReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitReport
        fields = ['idUnitReport', 'idCourse', 'username', 'eval_cont1', 'parcial1', 'eval_cont2', 
            'parcial2', 'eval_cont3', 'parcial3']

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['idTeacher', 'email', 'password', 'name', 'phone', 'created', 'modified']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['idEvent', 'idCourse', 'amountEvent', 'percentageProgress', 'percentageExam', 'created', 'modified']

class GradesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grades
        fields = ['idGrades', 'idRegistration', 'idEvent', 'progress', 'exam', 'average', 'created', 'modified']

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ['idRegistration', 'student', 'semester', 'created', 'modified']

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['course', 'group', 'capacity', 'created', 'modified']