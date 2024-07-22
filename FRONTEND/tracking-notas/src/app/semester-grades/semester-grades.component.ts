import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-semester-grades',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './semester-grades.component.html',
  styleUrls: ['./semester-grades.component.css'],
  providers: [AuthService],
})
export class SemesterGradesComponent implements OnInit {
  studentId: number = 1 // Cambiar esto por el ID del estudiante
  courses: any[] = [];
  courseGrades: { [key: number]: any } = {};
  acumFila: number[] = [];
  acumFilaPunt: number[] = [];

  constructor(private authService: AuthService, private http: HttpClient, private router: Router){
  }
  ngOnInit(): void {
    this.loadCourse();
  }

  loadCourse(): void {
    const apiUrl = 'http://127.0.0.1:8000/api/courses/';
    this.http.get(apiUrl).subscribe((data: any) => {
      this.courses = data;
      this.loadGrades();
    });
  }

  sendGradesHTML() {
    for (let courseId in this.courseGrades) {
      const unitReport = this.courseGrades[courseId];
      if (unitReport.idUnitReport) { // Verifica que `idUnitReport` esté definido
        this.authService.updateGrades(unitReport.idUnitReport, unitReport).subscribe(
          response => {
            console.log('Updated unit report:', response);
          },
          error => console.log('Error:', error)
        );
      }
    }
  }
  
  loadGrades(): void {
    const apiGradesUrl = `http://127.0.0.1:8000/api/unitreports/student/${this.studentId}/`;
    this.http.get<any []>(apiGradesUrl).subscribe((data) => {
      data.forEach((unitReport: any) => {
        if (!this.courseGrades[unitReport.idCourse]) {
          this.courseGrades[unitReport.idCourse] = unitReport;
        }
      });
    }, error => {
      console.log('Error loading grades:', error);
    });
  }


  averageGrades() {
    this.acumFila = []; 
    for (let course of this.courses) {
      const courseGrades = this.courseGrades[course.idCourse] || {
        eval_cont1: 0, parcial1: 0,
        eval_cont2: 0, parcial2: 0,
        eval_cont3: 0, parcial3: 0
      };
      let acumPercentage = 0;
      acumPercentage += this.prom(courseGrades.eval_cont1, course.e1);
      console.log(acumPercentage);
      acumPercentage += this.prom(courseGrades.parcial1, course.p1);
      acumPercentage += this.prom(courseGrades.eval_cont2, course.e2);
      acumPercentage += this.prom(courseGrades.parcial2, course.p2);
      acumPercentage += this.prom(courseGrades.eval_cont3, course.e3);
      acumPercentage += this.prom(courseGrades.parcial3, course.p3);
      this.acumFila.push(acumPercentage);
    }
    this.averageGradesPunt();
  }

  prom(percentage: number, grades: number){
    return percentage * grades / 20;
  }

  averageGradesPunt(){
    this.acumFilaPunt = [];
    let acumPunt = 0;
    for(let acum of this.acumFila){
      acumPunt = acum / 5;
      this.acumFilaPunt.push(acumPunt);

    }
  }
  logout(){
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken){
      this.authService.logout(refreshToken).subscribe(
        response => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          this.router.navigate(['login']);
        },

        error => {
          console.error('Error during logout', error);
        }
      )
    }
  }
}