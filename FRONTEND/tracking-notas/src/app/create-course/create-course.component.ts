import { Component, OnInit } from '@angular/core';
import { CreateService } from './create.service';
import { Course } from './course';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.css'
})
export class CreateCourseComponent implements OnInit{

  courses: Course[] = [];
  newCourse: Course = {
    idCourse: 0,
    nameCourse: '',
    credit: null,
    prerequisite: null,
    semester: null,
    laboratory: false,
    hoursTeory: 0,
    hoursPractice: 0,
    p1: null,
    p2: null,
    p3: null,
    e1: null,
    e2: null,
    e3: null,
    status: true
  }

  selectedCourse: Course | null = null;

  isEditing = false;

  get currentCourse(): Course{
    return this.isEditing && this.selectedCourse ? this.selectedCourse : this.newCourse;
    console.log(this.selectedCourse);
  }
  constructor(private courseService: CreateService){}
  ngOnInit(): void {
    this.getCourses();
  }

  getCourses(): void{
    this.courseService.getCourses().subscribe((data: Course[]) => {
      this.courses = data;
    });
  }

  createCourse(): void{
    this.courseService.createCourses(this.newCourse).subscribe(() => {
      this.getCourses();
      this.resetForm();
    });
  }

  deleteCourse(id: number): void{
    this.courseService.deleteCourse(id).subscribe(() => {
      this.getCourses();
    });
  }

  editCourse(course: Course): void{
    this.selectedCourse = { ...course };
    this.isEditing = true;
  }

  updateCourse(): void{
    console.log('Selected course data before update:', this.selectedCourse);
    if(this.selectedCourse){
      this.courseService.updateCourse(this.selectedCourse).subscribe(() => {
        this.getCourses();
        this.resetForm();
      });
    }
  }

  resetForm(): void{
    this.newCourse = {
      idCourse: 0,
      nameCourse: '',
      credit: null,
      prerequisite: null,
      semester: null,
      laboratory: false,
      hoursTeory: null,
      hoursPractice: null,
      p1: null,
      p2: null,
      p3: null,
      e1: null,
      e2: null,
      e3: null,
      status: true
    };
    this.selectedCourse = null;
    this.isEditing = false;
  }

  onSubmit() : void{
    if(this.isEditing && this.selectedCourse){
      this.updateCourse();
    } else {
      this.createCourse();
    }
  }

}
