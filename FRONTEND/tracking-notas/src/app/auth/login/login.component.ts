import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService],
})
export class LoginComponent implements OnInit{
  input = {
    username: '',
    password: '',
  }  
  isAdmin = false;
  constructor(private authService: AuthService, private router: Router){

  }

  ngOnInit(): void {
  }
  loginUser() {
    this.authService.login(this.input).subscribe(
      response => {
        console.log(response); 
        localStorage.setItem('username', this.input.username);
        if (response.usuario_teacher) {
          this.router.navigate(['../../prueba']);
        } else {
          this.router.navigate(['../../semester-grades']);
        }
      },
      error => console.log('Error: ', error)
    );
    console.log(this.input);
  }
}