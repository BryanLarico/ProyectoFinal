import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/auth/login/login.component';
import SignupComponent from './app/auth/signup/signup.component';
import { SemesterGradesComponent } from './app/semester-grades/semester-grades.component';
import { BookGradesComponent } from './app/book-grades/book-grades.component';
import { provideHttpClient } from '@angular/common/http';
import { PruebaComponent } from './app/prueba/prueba.component';
import { SignupTeacherComponent } from './app/auth/signup-teacher/signup-teacher.component';
import { CreateCourseComponent } from './app/create-course/create-course.component';
import { HomeComponent } from './app/home/home.component';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter([
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'signup-teacher', component: SignupTeacherComponent },
      { path: 'create-course', component: CreateCourseComponent },
      { path: 'book-grades', component: BookGradesComponent },
      { path: 'semester-grades', component: SemesterGradesComponent },
      { path: 'home', component: HomeComponent },
      { path: 'prueba', component: PruebaComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      //{ path: '**', redirectTo: '' }
    ])
  ]
});