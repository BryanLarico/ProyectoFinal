import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

// Importa tus componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SemesterGradesComponent } from './semester-grades/semester-grades.component';
import { BookGradesComponent } from './book-grades/book-grades.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule // Usa AppRoutingModule para las rutas
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
