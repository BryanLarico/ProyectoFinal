import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService],
})
export class LoginComponent implements OnInit {
  input = {
    username: '',
    password: '',
  }  
  isAdmin = false;
  userId: string = '';

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

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

  loginUser(loginForm: NgForm) {
    if (loginForm.invalid) {
      // Aquí puedes agregar lógica para manejar la presentación de mensajes de error o retroalimentación al usuario
      console.log('Formulario inválido');
      return;
    }
  
    this.authService.login(this.input).subscribe(
      response => {
        this.userId = response.userId;
        console.log('ID de user en Login', response);
  
        if (this.isLocalStorageAvailable()) {
          // Accede a localStorage solo en el entorno del navegador
          localStorage.setItem('username', this.input.username);
          localStorage.setItem('userId', this.userId);
          localStorage.setItem('isTeacher', response.usuario_teacher);
  
          if (response.usuario_teacher) {
            this.router.navigate(['../../create-course']);
          } else {
            this.router.navigate(['../../semester-grades']).then(() => {
              this.cdr.detectChanges(); // Forzar detección de cambios
            });
          }
        }
      },
      error => console.log('Error: ', error)
    );
    console.log(this.input);
  }
}
