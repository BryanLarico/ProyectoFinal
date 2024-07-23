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
  semester: number = 1;
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.semester = parseInt(localStorage.getItem('semester') || '1', 10);
    const coursesPromises: Promise<any>[] = [];
    const apiUrl = 'http://127.0.0.1:8000/api/courses/';
  
    for (let semester = this.semester; semester >= 1; semester--) {
      const url = `${apiUrl}semester/${semester}`;
      coursesPromises.push(this.http.get(url).toPromise());
    }
  
    Promise.all(coursesPromises).then((results) => {
      this.courses = results.flatMap((data: any) => 
        data.map((course: any) => ({ ...course, grade: null }))
      );
      console.log('Cursos actuales y anteriores: ',this.courses);
    }).catch(error => {
      console.error('Error loading courses:', error);
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
