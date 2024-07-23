import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CreateService {

  private apiUrl = "http://127.0.0.1:8000/api/course/";

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]>{
    return this.http.get<any[]>(this.apiUrl);
  }

  createCourses(course: Course): Observable<Course>{
    return this.http.post<Course>(this.apiUrl, course);
  }

  deleteCourse(id: number): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    console.log('API URL:', url);
    return this.http.delete(url);
  }

  updateCourse(course: Course): Observable<Course>{
    const url = `${this.apiUrl}${course.idCourse}/`;
    return this.http.put<Course>(url, course);
  }
}
