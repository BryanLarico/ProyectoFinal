import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import SignupComponent from './auth/signup/signup.component';
import { SemesterGradesComponent } from './semester-grades/semester-grades.component';
import { BookGradesComponent } from './book-grades/book-grades.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'book-grades', component: BookGradesComponent },
  { path: 'semester-grades', component: SemesterGradesComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];