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
  courses: any[] = [];
  courseGrades: { [key: number]: any } = {};
  acumFila: { acumPercentage: number; totalPercentage: number }[] = [];
  acumFilaPunt: { acumPunt: number; totalPoints: number }[] = [];
  semester: number = 1;
  username: string = "";
  iduser: number = 0;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.semester = parseInt(localStorage.getItem('semester') || '1', 10);
    this.username = localStorage.getItem('username') || '';
    console.log('Username from localStorage: ', this.username);
    this.authService.enviarUser(this.username);
    if (!this.username) {
      console.error('Username is not set in localStorage');
      return;
    }
    this.loadCourse();
  }

  loadCourse(): void {
    console.log('Semestre del usuario: ', this.semester);
    this.authService.getCoursesBySemester(this.semester).subscribe((data: any) => {
      console.log('Datos de cursos recibidos: ', data);
      this.courses = data.filter((course: any) => course.semester === this.semester);
      this.loadGrades();
    });
  }

  sendGradesHTML(): void {
    console.log('Datos de courseGrades antes de guardar:', this.courseGrades);
    for (let i in this.courseGrades) {
      console.log('Indice: ', i);
      const unitReport = this.courseGrades[i];
      if (unitReport.idUnitReport) { // Verifica que `idUnitReport` esté definido
        this.authService.updateGrades(unitReport.idUnitReport, unitReport).subscribe(
          response => {
            console.log('Datos despues de cargar:', response);
          },
          error => {
            console.log('Error:', error);
          }
        );
      }
    }
  }

  loadGrades(): void {
    const apiGradesUrl = `http://127.0.0.1:8000/api/unitreports/username/${this.username}/`;
    this.http.get<any[]>(apiGradesUrl).subscribe(
      (data) => {
        console.log('Datos de calificaciones recibidos:', data);
        data.forEach((unitReport: any) => {
          if (!this.courseGrades[unitReport.idCourse]) {
            this.courseGrades[unitReport.idCourse] = {
              idUnitReport: unitReport.idUnitReport,
              eval_cont1: unitReport.eval_cont1 || 0,
              parcial1: unitReport.parcial1 || 0,
              eval_cont2: unitReport.eval_cont2 || 0,
              parcial2: unitReport.parcial2 || 0,
              eval_cont3: unitReport.eval_cont3 || 0,
              parcial3: unitReport.parcial3 || 0,
            };
            console.log('Datos enviados: ', this.courseGrades);
          } else {
            console.log(`Duplicate course ID: ${unitReport.idCourse}`);
          }
        });
      },
      (error) => {
        console.error('Error al cargar las calificaciones:', error);
      }
    );
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
      let totalPercentage = 0;

      if (courseGrades.eval_cont1 > 0) {
        acumPercentage += this.prom(courseGrades.eval_cont1, course.e1);
        totalPercentage += course.e1;
      }
      if (courseGrades.parcial1 > 0) {
        acumPercentage += this.prom(courseGrades.parcial1, course.p1);
        totalPercentage += course.p1;
      }
      if (courseGrades.eval_cont2 > 0) {
        acumPercentage += this.prom(courseGrades.eval_cont2, course.e2);
        totalPercentage += course.e2;
      }
      if (courseGrades.parcial2 > 0) {
        acumPercentage += this.prom(courseGrades.parcial2, course.p2);
        totalPercentage += course.p2;
      }
      if (courseGrades.eval_cont3 > 0) {
        acumPercentage += this.prom(courseGrades.eval_cont3, course.e3);
        totalPercentage += course.e3;
      }
      if (courseGrades.parcial3 > 0) {
        acumPercentage += this.prom(courseGrades.parcial3, course.p3);
        totalPercentage += course.p3;
      }

      this.acumFila.push({
        acumPercentage,
        totalPercentage
      });
    }
    this.averageGradesPunt();
  }

  prom(percentage: number, grades: number) {
    return percentage * grades / 20;
  }

  averageGradesPunt() {
    this.acumFilaPunt = [];
    for (let acum of this.acumFila) {
      const totalPoints = acum.totalPercentage / 5;
      const acumPunt = acum.acumPercentage / 5;
      this.acumFilaPunt.push({
        acumPunt,
        totalPoints
      });
    }
  }

  isLocalStorageAvailable(): boolean {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  logout() {
    this.authService.logout().subscribe(
      response => {
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error during logout', error);
      }
    );
  }
}