from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework import routers, permissions
from rest_framework.authtoken.views import ObtainAuthToken
#from myapp.views import paginaPrincipalView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from webapp.myapp.views import paginaPrincipalView, careerView
from .views import (
    UserRegister, UserLogin, UserLogout, UserDetail, 
    UserEdit, UserCreateApiView, UserListApiView,
    UserUpdateApiView, UserDeleteApiView,
    UserDetailApiView, CustomTokenObtainPairSerializer,
    CustomTokenObtainPairView,
    CareerListCreateAPIView, CareerDetailAPIView,
    CourseListCreateAPIView, CourseDetailAPIView,
    EventListCreateAPIView, EventDetailAPIView,
    GradesListCreateAPIView, GradesDetailAPIView,
    RegistrationListCreateAPIView, RegistrationDetailAPIView,
    SectionListCreateAPIView, SectionDetailAPIView,
    StudentListCreateAPIView, StudentDetailAPIView,
    TeacherListCreateAPIView, TeacherDetailAPIView,
    UnitReportListCreateAPIView, UnitReportDetailAPIView,
    UnitReportByStudentAPIView, CourseBySemesterAPIView,
    CourseGradesStudentListCreateAPIView, CourseGradesStudentDetailAPIView,
)

schema_view = get_schema_view(
    openapi.Info(
        title="TrackingNotas API",
        default_version='v1',
        description="API documentation for TrackingNotas",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = routers.DefaultRouter()
#router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/', include(router.urls)),
    path('register/', UserRegister.as_view(), name='user-register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', UserLogout.as_view(), name='user-logout'),
    path('edit/', UserEdit.as_view(), name='user-edit'),
    path('profile/', UserDetail.as_view(), name='user-detail'),
    path('list/', UserListApiView.as_view(), name='user-list'),
    # path('careerView/', careerView),
    #path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    #path('auth/', ObtainAuthToken.as_view()),
    
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),  # Documentación de la API
    
    #path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    #path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('careers/', CareerListCreateAPIView.as_view(), name='career-list-create'),
    path('careers/<int:pk>/', CareerDetailAPIView.as_view(), name='career-detail'),

    # URLs para Course
    path('course/', CourseListCreateAPIView.as_view(), name='course-list-create'),
    path('course/<int:pk>/', CourseDetailAPIView.as_view(), name='course-delete-update'),
    path('courses/<int:pk>/', CourseDetailAPIView.as_view(), name='course-detail'),
    path('courses/semester/<int:semester>/', CourseBySemesterAPIView.as_view(), name='course-by-semester'),

    path('coursesGradesStudent/', CourseGradesStudentListCreateAPIView.as_view(), name='course-grades-student-list-create'),
    path('coursesGradesStudent/<int:pk>/', CourseGradesStudentDetailAPIView.as_view(), name='course-grades-student-detail'),
    
    # URLs para UnitReport
    path('unitreports/', UnitReportListCreateAPIView.as_view(), name='unitreport-list-create'),
    path('unitreports/<int:pk>/', UnitReportDetailAPIView.as_view(), name='unitreport-detail'),
    path('unitreports/username/<str:username>/', UnitReportByStudentAPIView.as_view(), name='unitreport-by-username'),    
    # URLs para Student
    path('students/', StudentListCreateAPIView.as_view(), name='student-list-create'),
    path('students/<int:pk>/', StudentDetailAPIView.as_view(), name='student-detail'),
    
    # URLs para Event
    path('events/', EventListCreateAPIView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventDetailAPIView.as_view(), name='event-detail'),

    # URLs para Grades
    path('grades/', GradesListCreateAPIView.as_view(), name='grades-list-create'),
    path('grades/<int:pk>/', GradesDetailAPIView.as_view(), name='grades-detail'),

    # URLs para Registration
    path('registrations/', RegistrationListCreateAPIView.as_view(), name='registration-list-create'),
    path('registrations/<int:pk>/', RegistrationDetailAPIView.as_view(), name='registration-detail'),

    # URLs para Section
    path('sections/', SectionListCreateAPIView.as_view(), name='section-list-create'),
    path('sections/<int:pk>/', SectionDetailAPIView.as_view(), name='section-detail'),

    # URLs para Teacher
    path('teachers/', TeacherListCreateAPIView.as_view(), name='teacher-list-create'),
    path('teachers/<int:pk>/', TeacherDetailAPIView.as_view(), name='teacher-detail'),

    # path('report/', report_view, name='report-view'),
]