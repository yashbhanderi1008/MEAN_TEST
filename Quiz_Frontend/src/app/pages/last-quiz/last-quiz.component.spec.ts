import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastQuizComponent } from './last-quiz.component';

describe('LastQuizComponent', () => {
  let component: LastQuizComponent;
  let fixture: ComponentFixture<LastQuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LastQuizComponent]
    });
    fixture = TestBed.createComponent(LastQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
