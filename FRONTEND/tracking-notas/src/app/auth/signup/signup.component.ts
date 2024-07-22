import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [AuthService],
})
export class SignupComponent implements OnInit{
  courses: any[] = [];
  register = {
    username: '',
    email: '',
    semester: 1,
    password: '',
    name: '',
    dni: '',
    usuario_activo: true,
    usuario_teacher: false,
    
    //is_staff: true,
    //is_superuser: true,
  }  

  constructor(private authService: AuthService, private http: HttpClient){
  }

  ngOnInit(): void {
  }
  registerUser(){
    this.authService.signup(this.register).subscribe(
      response => {
        alert('User ' + this.register.username + ' created')
        console.log(this.register.semester)
        this.getCourses();
      },
      error => console.log('Error:', error)
    )
    console.log(this.register);
  }
  getCourses() {
    this.authService.getCoursesBySemester(this.register.semester).subscribe(
      response => {
        this.courses = response;
        console.log(this.courses);
      },
      error => console.log('Error:', error)
    );
  }
}