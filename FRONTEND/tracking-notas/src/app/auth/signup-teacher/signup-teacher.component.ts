import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup-teacher',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup-teacher.component.html',
  styleUrl: './signup-teacher.component.css'
})
export class SignupTeacherComponent implements OnInit{
  courses: Course[] = [];
  register = {
    username: '',
    email: '',
    semester: 1, 
    password: '',
    name: '', 
    dni: '',
    usuario_activo: true,
    usuario_teacher: true,
  }  

  constructor(private authService: AuthService, private http: HttpClient) {}

ngOnInit(): void {}

isLocalStorageAvailable(): boolean {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

registerUser() {
  console.log(this.register.usuario_teacher);
  this.authService.signup(this.register).subscribe(
    response => {
      alert('User ' + this.register.username + ' created');

      if (this.isLocalStorageAvailable()) {
        localStorage.setItem('semester', this.register.semester.toString());
        localStorage.setItem('isTeacher', this.register.usuario_teacher.toString());
      }

      console.log(this.register.semester);
      this.getCourses();
      this.createUnitReportsForSemester();
    },
    error => console.log('Error:', error)
  );
  console.log(this.register);
}
  getCourses() {
    this.authService.getCoursesBySemester(this.register.semester).subscribe(
      response => {
        this.courses = response;
        console.log(this.courses);
      },
      (error) => console.log('Error:', error)
    );
  }
  createUnitReportsForSemester() {
    this.authService.getCoursesBySemester(this.register.semester).subscribe(
      (courses: Course[]) => {
        this.courses = courses;
        courses.forEach((course: Course) => {
          const unitReport: UnitReport = {
            idUnitReport: 0, // O algún valor predeterminado si se requiere
            idCourse: course.idCourse,
            username: this.register.username,
            eval_cont1: null,
            parcial1: null,
            eval_cont2: null,
            parcial2: null,
            eval_cont3: null,
            parcial3: null,
          };
          this.authService.createUnitReport(unitReport).subscribe(
            (response) => console.log('UnitReport created:', response),
            (error) => console.log('Error creating UnitReport:', error)
          );
        });
      },
      (error) => console.log('Error:', error)
    );
  }
}

interface Course {
  idCourse: number;
  nameCourse: string;
  credit?: number;
  prerequisite?: number;
  semester?: number;
  p1?: number;
  p2?: number;
  p3?: number;
  e1?: number;
  e2?: number;
  e3?: number;
  status?: boolean;
}

interface UnitReport {
  idUnitReport: number;
  idCourse: number;
  username: string;
  eval_cont1: number | null;
  parcial1: number | null;
  eval_cont2: number | null;
  parcial2: number | null;
  eval_cont3: number | null;
  parcial3: number | null;
}
