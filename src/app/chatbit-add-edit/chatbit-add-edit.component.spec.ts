import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbitAddEditComponent } from './chatbit-add-edit.component';

describe('ChatbitAddEditComponent', () => {
  let component: ChatbitAddEditComponent;
  let fixture: ComponentFixture<ChatbitAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatbitAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatbitAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
