import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [AuthService],
})

export default class SignupComponent implements OnInit{
  courses: Course[] = [];
  coursesViewed: Course[] = [];
  userId: string='';
  iD: number = 0;
  register = {
    username: '',
    email: '',
    semester: 1, 
    password: '',
    name: '', 
    dni: '',
    usuario_activo: true,
    usuario_teacher: false,
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
    this.authService.signup(this.register).subscribe(
      response => {
        alert('User ' + this.register.username + ' created');
        
        if (this.isLocalStorageAvailable()) {
          localStorage.setItem('semester', this.register.semester.toString());
        }
  
        console.log(this.register.semester);
        this.userId = response.username;
        this.getUserIdByUsername(this.userId);
        this.getCourses();
        this.createUnitReportsForSemester();
        console.log(this.register.username);
        this.createCourseGradesStudents();
      },
      error => console.log('Error:', error)
    );
  }
  getUserIdByUsername(username: string): void {
    this.http.get<{ userId: number, username: string }>(`http://127.0.0.1:8000/api/idUser/user/${username}`)
      .subscribe(
        response => {
          this.iD = response.userId; 
          console.log('User ID:', this.iD);
        },
        error => {
          console.error('Error:', error);
        }
      );
  }
  async createCourseGradesStudents() {
    const currentSemester = this.register.semester;
    try {
      for (let semester: number = 1; semester <= currentSemester; semester++) {
        const courses: Course[] = await firstValueFrom(this.authService.getCoursesBySemester(semester));
        this.coursesViewed = courses;
  
        for (const course of this.coursesViewed) {
          const courseGradesStudent: CourseGradesStudent = {
            idCourseGradesStudent: 0, 
            idCourse: course.idCourse,
            username: this.iD.toString(),
            finalGrade: null, 
          };
          console.log('Prueba de courseGradesStudent: ', courseGradesStudent);
          this.authService.createCourseGradesStudent(courseGradesStudent).subscribe(
            (response) => console.log('CourseGrades created:', response),
            (error) => {
              console.log('Error creating CourseGrades:', error);
              console.log(courseGradesStudent); 
            }
          );
        }
      }
    } catch (error) {
      console.log('Error getting courses:', error);
    }
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

interface CourseGradesStudent {
  idCourseGradesStudent: number;
  idCourse: number;
  username: string;
  finalGrade: number | null;
}