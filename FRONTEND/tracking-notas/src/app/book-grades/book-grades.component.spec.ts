import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookGradesComponent } from './book-grades.component';

describe('BookGradesComponent', () => {
  let component: BookGradesComponent;
  let fixture: ComponentFixture<BookGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookGradesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
