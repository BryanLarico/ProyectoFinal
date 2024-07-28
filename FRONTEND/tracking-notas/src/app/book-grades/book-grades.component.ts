import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

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
  userId: number = 0;
  coursesGrades: { [key: number]: any } = {};
  user: string = '';
  
  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    if (this.isLocalStorageAvailable()) {
      this.userId = parseInt(localStorage.getItem('userId') || '0', 10);
      this.user = localStorage.getItem('username') || '';
      console.log('Usuario desde book: ', this.user);
      console.log('UsuarioID desde book: ', this.userId);
    }
    this.loadCourses();
    this.loadGrades();
  }

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

  loadCourses(): void {
    if (this.isLocalStorageAvailable()) {
      this.semester = parseInt(localStorage.getItem('semester') || '1', 10);
    }
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
      console.log('Cursos actuales y anteriores: ', this.courses);
    }).catch(error => {
      console.error('Error loading courses:', error);
    });
  }

  loadGrades(): void {
    const apiGradesUrl = `http://127.0.0.1:8000/api/coursesGradesStudent/user/${this.user}`;
    console.log('IDUSER:', this.user);
    this.http.get<CourseGradesStudent[]>(apiGradesUrl).subscribe(
      (data) => {
        console.log('Datos recibidos:', data); // Agrega esto para depurar
        
        data.forEach((grade) => {
          const course = this.courses.find(c => c.idCourse === grade.idCourse);
          if (course) {
            course.finalGrade = grade.finalGrade;
            course.idCourseGradesStudent = grade.idCourseGradesStudent;
            this.userId = grade.username;

          } else {
            console.log(`Curso con ID ${grade.idCourse} no encontrado.`);
          }
        });
        console.log('Calificaciones cargadas:', this.courses);
      },
      (error) => {
        console.error('Error al cargar las calificaciones:', error);
      }
    );
  }

  saveGrades(): void {
    console.log('Guardando calificaciones:', this.coursesGrades);
    this.courses.forEach(course => {
      console.log('ID CourseGradesStudent:', course.idCourseGradesStudent); // Verificar el ID
      if (course.idCourseGradesStudent !== null) { // Verificar que el ID existe antes de actualizar
        const updateUrl = `http://127.0.0.1:8000/api/coursesGradesStudent/${course.idCourseGradesStudent}/`;
        const courseGradesStudentData: Partial<CourseGradesStudent> = {
          idCourse: course.idCourse, // Asegúrate de enviar el idCourse
          username: this.userId,     // Asegúrate de enviar el username
          finalGrade: course.finalGrade
        };
        this.http.put(updateUrl, courseGradesStudentData).subscribe(
          (response: any) => console.log('Calificación actualizada:', response),
          (error: any) => {
            console.error('Error al actualizar la calificación:', error);
            if (error.error) {
              console.error('Detalles del error:', error.error);
            }
          }
        );
      } else {
        console.warn(`ID CourseGradesStudent no está definido para el curso ${course.idCourse}`);
      }
    });
  }

  calculateOverallAverage(): void {
    console.log('Cursos:', this.courses); // Verifica que `courses` contiene datos
  
    let totalCredits = 0;
    let totalGradePoints = 0;
  
    this.courses.forEach(course => {
      const grade = course.finalGrade !== null ? course.finalGrade : 0;
      totalCredits += course.credit; // Asegúrate de que el atributo se llame 'credit'
      totalGradePoints += grade * course.credit; // Asegúrate de que el atributo se llame 'credit'
    });
  
    this.overallAverage = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  
    // Redondear a 4 decimales
    this.overallAverage = parseFloat(this.overallAverage.toFixed(4));
  }
}

interface CourseGradesStudent {
  idCourseGradesStudent: number;
  idCourse: number;
  username: number; 
  finalGrade: number | null;
}
