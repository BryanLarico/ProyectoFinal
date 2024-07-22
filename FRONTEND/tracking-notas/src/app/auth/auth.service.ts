import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlSignUP = 'http://127.0.0.1:8000/api/register/';
  private apiUrlLogin = 'http://127.0.0.1:8000/api/login/';
  private apiGrades = 'http://127.0.0.1:8000/api/unitreports/';
  private apiLogout = 'http://127.0.0.1:8000/api/logout/';
  private apiCourses = 'http://127.0.0.1:8000/api/courses/';
  
  constructor(private http: HttpClient) {}

  login(userData: UserLogin): Observable<any> {
    return this.http.post(this.apiUrlLogin, userData).pipe(
      tap((response: any) => {
        this.setToken(response.token);
      })
    );
  }

  signup(userData: UserData): Observable<any> {
    return this.http.post(this.apiUrlSignUP, userData);
  }

  getCoursesBySemester(semester: number): Observable<any> {
    return this.http.get(`${this.apiCourses}?semester=${semester}`);
  }

  sendGrades(grades: Grades): Observable<any> {
    return this.http.post(this.apiGrades, grades);
  }

  updateGrades(unitReportId: number, data: any): Observable<any> {
    const url = `${this.apiGrades}${unitReportId}/`;
    return this.http.put(url, data);
  }

  logout(refreshToken: string): Observable<any> {
    const body = { refresh_token: refreshToken };
    return this.http.post(this.apiLogout, body).pipe(
      tap(() => {
        this.removeToken();
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
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
interface Grades {
  idUnitReport: number;
  idCourse: number; // FP1
  idStudent: number; // Bryan
  eval_cont1: number;
  parcial1: number;
  eval_cont2: number;
  parcial2: number;
  eval_cont3: number;
  parcial3: number;
}