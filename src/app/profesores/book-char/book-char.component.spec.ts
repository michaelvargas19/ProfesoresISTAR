import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCharComponent } from './book-char.component';

describe('BookCharComponent', () => {
  let component: BookCharComponent;
  let fixture: ComponentFixture<BookCharComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookCharComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookCharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
