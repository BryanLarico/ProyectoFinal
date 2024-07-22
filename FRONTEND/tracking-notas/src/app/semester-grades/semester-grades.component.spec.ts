import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterGradesComponent } from './semester-grades.component';

describe('SemesterGradesComponent', () => {
  let component: SemesterGradesComponent;
  let fixture: ComponentFixture<SemesterGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemesterGradesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemesterGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
