import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para ngModel

@Component({
  selector: 'app-book-grades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-grades.component.html',
  styleUrls: ['./book-grades.component.css']
})
export class BookGradesComponent implements OnInit {
  courses: any[] = [];
  overallAverage: number = 0; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    const apiUrl = 'http://127.0.0.1:8000/api/courses/';
    this.http.get(apiUrl).subscribe((data: any) => {
      this.courses = data.map((course: any) => ({ ...course, grade: null })); // Inicializar la nota
    });
  }

  calculateOverallAverage(): void {
    let totalCredits = 0;
    let totalGradePoints = 0;
  
    this.courses.forEach(course => {
      const grade = course.grade !== null ? course.grade : 0;
      totalCredits += course.credit; // Asegúrate de que el atributo se llame 'credit'
      totalGradePoints += grade * course.credit; // Asegúrate de que el atributo se llame 'credit'
    });
  
    this.overallAverage = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  
    // Redondear a 4 decimales
    this.overallAverage = parseFloat(this.overallAverage.toFixed(4));
  }
}
