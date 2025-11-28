import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, test, expect, beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import { SimplyMatExtendedFab } from './extended-fab';

@Component({
  template: `<button data-testid="extended-fab-btn" simplyMatExtendedFab><span>Create</span></button>`,
  imports: [SimplyMatExtendedFab],
})
class ExtendedFabTestComponent {}

describe('SimplyMatExtendedFab', () => {
  let fixture: ComponentFixture<ExtendedFabTestComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ExtendedFabTestComponent],
    });

    fixture = TestBed.createComponent(ExtendedFabTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  test('should create component', () => {
    const component = fixture.debugElement.query(By.directive(SimplyMatExtendedFab));
    expect(component).toBeTruthy();
    expect(component.componentInstance).toBeInstanceOf(SimplyMatExtendedFab);
  });

  test('should apply simply-mat-extended-fab class to the element', async () => {
    await expect.element(page.getByTestId('extended-fab-btn')).toHaveClass('simply-mat-extended-fab');
  });
});

