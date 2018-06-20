import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfePaperComponent } from './confe-paper.component';

describe('ConfePaperComponent', () => {
  let component: ConfePaperComponent;
  let fixture: ComponentFixture<ConfePaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfePaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfePaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
