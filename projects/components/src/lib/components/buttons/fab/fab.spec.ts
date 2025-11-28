import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, test, expect, beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import { SimplyMatFab } from './fab';

@Component({
  template: `<button data-testid="fab-btn" simplyMatFab><span>+</span></button>`,
  imports: [SimplyMatFab],
})
class FabTestComponent {}

describe('SimplyMatFab', () => {
  let fixture: ComponentFixture<FabTestComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FabTestComponent],
    });

    fixture = TestBed.createComponent(FabTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  test('should create component', () => {
    const component = fixture.debugElement.query(By.directive(SimplyMatFab));
    expect(component).toBeTruthy();
    expect(component.componentInstance).toBeInstanceOf(SimplyMatFab);
  });

  test('should apply simply-mat-fab class to the element', async () => {
    await expect.element(page.getByTestId('fab-btn')).toHaveClass('simply-mat-fab');
  });
});
