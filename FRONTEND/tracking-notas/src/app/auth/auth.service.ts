import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/';
  private apiUrlSignUP = 'http://127.0.0.1:8000/api/register/';
  private apiUrlLogin = 'http://127.0.0.1:8000/api/login/';
  private apiGrades = 'http://127.0.0.1:8000/api/unitreports/';
  private apiLogout = 'http://127.0.0.1:8000/api/logout/';
  private apiCourses = 'http://127.0.0.1:8000/api/courses/';
  private apiCoursesFinalGrades = 'http://127.0.0.1:8000/api/coursesGradesStudent/';
  user: string = "";

  constructor(private http: HttpClient) {}

  login(userData: UserLogin): Observable<any> {
    return this.http.post<{ refresh: string, access: string, user_type: string, usuario_teacher: boolean }>(this.apiUrlLogin, userData).pipe(
      tap(response => {
        console.log('Login auth:', response); // Depuración

        if (response && response.access && response.refresh) {
          this.setTokens(response.access, response.refresh);
          console.log('Access token set:', this.getAccessToken()); // Depuración
          console.log('Refresh token set:', this.getRefreshToken()); // Depuración
        } else {
          console.error('Tokens are undefined or response does not contain tokens');
        }

        // Puedes usar el user_type para otras lógicas en tu aplicación
        console.log('User type:', response.user_type); // Depuración
        console.log('Usuario, teacher:', response.usuario_teacher);
      }),
      catchError(this.handleError('login', [])) // Manejo de errores
    );
  }
   // Método para almacenar los tokens en localStorage
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  createCourseGradesStudent(courseGradesStudent: CourseGradesStudent): Observable<any> {
    return this.http.post(`${this.apiUrl}coursesGradesStudent/`, courseGradesStudent);
  }

  updateCourseGrades(courseGradesId: number, data: any): Observable<any> {
    const url = `${this.apiCoursesFinalGrades}${courseGradesId}/`;
    return this.http.put(url, data);
  }

  enviarUser(user: string){
    this.user = user;
  }

  recibirUser(){
    return this.user;
  }

  // Métodos para obtener los tokens desde localStorage
  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // Ejemplo de un método de manejo de errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`); // Log a to console for now
      return of(result as T);
    };
  }

  signup(userData: UserData): Observable<any> {
    return this.http.post(this.apiUrlSignUP, userData);
  }

  getIdUser(userName: number): Observable<any> {
    const url = `http://127.0.0.1:8000/api/unitreports/username/${userName}`;
    return this.http.get(url);
  }

  createUnitReport(unitReport: UnitReport): Observable<any> {
    const url = `http://127.0.0.1:8000/api/unitreports/`;
    return this.http.post(url, unitReport);
  }

  getCoursesBySemester(semester: number): Observable<any> {
    const url = `${this.apiCourses}semester/${semester}`;
    console.log('API URL:', url);
    return this.http.get(url);
  }

  sendGrades(grades: Grades): Observable<any> {
    return this.http.post(this.apiGrades, grades);
  }

  updateGrades(unitReportId: number, data: any): Observable<any> {
    const url = `${this.apiGrades}${unitReportId}/`;
    return this.http.put(url, data);
  }

  logout(): Observable<any> {
    const token = this.getAccessToken();
    if (!token) {
      console.error('No access token found');
      return of(null);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiLogout, {}, { headers }).pipe(
      tap(() => {
        console.log('Logout successful'); // Depuración
        this.clearTokens();
      }),
      catchError(this.handleError('logout', [])) // Manejo de errores
    );
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('auth_token');
  }

    // Ejemplo del método `getToken`
  private getToken(): string | null {
    return localStorage.getItem('token');    
  
  }
  getAuthHeaders() {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
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

interface UserData {
  username: string,
  email: string,
  semester: number,
  password: string,
  name: string,
  dni: string,
  usuario_activo: boolean,
  usuario_teacher: boolean,
}

interface UserLogin {
  username: string;
  password: string;
}

interface courseGrades {
  course: string;
  e1_percentage: number;
  e1_grades: number;
  p1_percentage: number;
  p1_grades: number;
  e2_percentage: number;
  e2_grades: number;
  p2_percentage: number;
  p2_grades: number;
  e3_percentage: number;
  e3_grades: number;
  p3_percentage: number;
  p3_grades: number;
  percentage_acum: number;
  socre_acum: number;
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
interface Grades {
  idUnitReport: number;
  idCourse: number;
  username: string;
  eval_cont1: number;
  parcial1: number;
  eval_cont2: number;
  parcial2: number;
  eval_cont3: number;
  parcial3: number;
}
interface UserLogin {
  username: string;
  password: string;
}

interface CourseGradesStudent {
  idCourseGradesStudent: number;
  idCourse: number;
  username: string;
  finalGrade: number | null;
}