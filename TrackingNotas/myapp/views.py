from rest_framework import generics, permissions, viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate
# from django.contrib.auth.models import User
from .serializers import UserSerializer
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
from .serializers import (
    CareerSerializer, CourseSerializer, EventSerializer,
    GradesSerializer, RegistrationSerializer, SectionSerializer,
    StudentSerializer, TeacherSerializer, UnitReportSerializer,
    CourseGradesStudentSerializer,
    UserSerializer, UserManageCreateSerializer, UserManageSerializer,
    CustomTokenObtainPairSerializer,
)

class UserRegister(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            semester = request.data.get('semester')
            courses = Course.objects.filter(semester=semester)
            for course in courses:
                UnitReport.objects.create(username=user, idCourse=course)
            response_data = {
                'userId': user.id,
                'username': user.username,
                'email': user.email,
                'semester': user.semester,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        return Response({'error': 'GET method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
class UserLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        print(user)  # Añade esta línea para depuración
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request):
        return Response({'error': 'GET method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class UserLogout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print(str(e))
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserByUsernameAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username, *args, **kwargs):
        try:
            user = User.objects.get(username=username)
            response_data = {
                'userId': user.id,
                'username': user.username,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
class UserEdit(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

# USERMANAGE API's VIEW

class UserCreateApiView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserManageCreateSerializer(data=request.data)
        print("Datos recibidos:", request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Errores de validación:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListApiView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserManageSerializer

class UserDetailApiView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserManageSerializer

class UserUpdateApiView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserManageSerializer
    lookup_field = 'id'

class UserDeleteApiView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserManageSerializer
    lookup_field = 'id'# USER API's VIEW

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
"""
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    #authentication_classes = (TokenAuthentication,)
    #permission_classes = (IsAuthenticated,)
"""
class CourseListCreateAPIView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    #permission_classes = [IsAuthenticated]

class CourseDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    #permission_classes = [IsAuthenticated]

class CourseBySemesterAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CourseSerializer
    def get_queryset(self):
        semester = self.kwargs['semester']
        return Course.objects.filter(semester=semester)
    
class CourseGradesStudentListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = CourseGradesStudent.objects.all()
    serializer_class = CourseGradesStudentSerializer
    #permission_classes = [IsAuthenticated]
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CourseGradesStudentByUserDetailAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CourseGradesStudentSerializer
    def get_queryset(self):
        username = self.kwargs['username']
        return CourseGradesStudent.objects.filter(username__username=username)

class CourseGradesStudentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = CourseGradesStudent.objects.all()
    serializer_class = CourseGradesStudentSerializer
    #permission_classes = [IsAuthenticated]

class CourseGradesStudentViewSet(viewsets.ModelViewSet):
    queryset = CourseGradesStudent.objects.all()
    serializer_class = CourseGradesStudentSerializer

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class StudentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    #permission_classes = [IsAuthenticated]

class StudentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    #permission_classes = [IsAuthenticated]

class UnitReportListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = UnitReport.objects.all()
    serializer_class = UnitReportSerializer

class UnitReportDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = UnitReport.objects.all()
    serializer_class = UnitReportSerializer
    
class UnitReportByStudentAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            unitReports = UnitReport.objects.filter(username=user)
            if unitReports.exists():
                serializer = UnitReportSerializer(unitReports, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class TeacherListCreateAPIView(generics.ListCreateAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    #permission_classes = [IsAuthenticated]

class TeacherDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    #permission_classes = [IsAuthenticated]

class EventListCreateAPIView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    #permission_classes = [IsAuthenticated]

class EventDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    #permission_classes = [IsAuthenticated]

class CareerListCreateAPIView(generics.ListCreateAPIView):
    queryset = Career.objects.all()
    serializer_class = CareerSerializer
    #permission_classes = [IsAuthenticated]

class CareerDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Career.objects.all()
    serializer_class = CareerSerializer
    #permission_classes = [IsAuthenticated]

class GradesListCreateAPIView(generics.ListCreateAPIView):
    queryset = Grades.objects.all()
    serializer_class = GradesSerializer
    #permission_classes = [IsAuthenticated]

class GradesDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Grades.objects.all()
    serializer_class = GradesSerializer
    #permission_classes = [IsAuthenticated]

class RegistrationListCreateAPIView(generics.ListCreateAPIView):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    #permission_classes = [IsAuthenticated]

class RegistrationDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    #permission_classes = [IsAuthenticated]

class SectionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    #permission_classes = [IsAuthenticated]

class SectionDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    #permission_classes = [IsAuthenticated]
"""
class RegisterStudentView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
"""        

"""
def generate_report():
    courses = Course.objects.all()
    reports = []

    for course in courses:
        registrations = Registration.objects.filter(course=course)
        
        for registration in registrations:
            events = Event.objects.filter(idCourse=course)
            
            unit_report_data = {
                'idCourse': course,
                'idStudent': registration.student,
                'idEvent1': None,
                'idEvent2': None,
                'idEvent3': None,
                'eval_cont1': None,
                'parcial1': None,
                'eval_cont2': None,
                'parcial2': None,
                'eval_cont3': None,
                'parcial3': None,
            }
            
            for event in events:
                grades = Grades.objects.filter(idRegistration=registration, idEvent=event).first()
                if grades:
                    if event.amountEvent == 1:
                        unit_report_data['idEvent1'] = event
                        unit_report_data['eval_cont1'] = grades.progress
                        unit_report_data['parcial1'] = grades.exam
                    elif event.amountEvent == 2:
                        unit_report_data['idEvent2'] = event
                        unit_report_data['eval_cont2'] = grades.progress
                        unit_report_data['parcial2'] = grades.exam
                    elif event.amountEvent == 3:
                        unit_report_data['idEvent3'] = event
                        unit_report_data['eval_cont3'] = grades.progress
                        unit_report_data['parcial3'] = grades.exam
            
            unit_report = UnitReport.objects.create(**unit_report_data)
            total_percentage, total_score = unit_report.calculate_accumulated()
            unit_report.save()

            reports.append(unit_report)

    return reports

def report_view(request):
    reports = generate_report()
    return render(request, 'grades_template.html', {'reports': reports})
"""

def paginaPrincipalView(request, *args , **kwargs):
    print(args, kwargs)
    print(request.user)
    return render(request, "home.html", {})

"""  
def careerView(request):
    form = Career(request.POST or None)
    if form.is_valid():
        form.save()
        form = PersonaForm()
    context = {
        'form': form
    }
    return render(request, 'templates/career.html', context)
"""