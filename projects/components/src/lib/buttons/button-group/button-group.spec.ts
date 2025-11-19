import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroup } from './button-group';
import {provideZonelessChangeDetection} from '@angular/core';

describe('ButtonGroup', () => {
  let component: ButtonGroup;
  let fixture: ComponentFixture<ButtonGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ButtonGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
