import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, test, expect, beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import { SimplyMatIcon } from './icon';

@Component({
  template: `
    <!-- Default icon with ariaHidden true (default) -->
    <simply-mat-icon data-testid="default-icon">
      <span class="material-symbols-rounded">add</span>
    </simply-mat-icon>

    <!-- Icon with ariaHidden false -->
    <simply-mat-icon data-testid="aria-hidden-false-icon" [ariaHidden]="false">
      <span class="material-symbols-rounded">edit</span>
    </simply-mat-icon>

    <!-- Icon with ariaHidden false and ariaLabel -->
    <simply-mat-icon
      data-testid="aria-label-icon"
      [ariaHidden]="false"
      [ariaLabel]="'Edit item'">
      <span class="material-symbols-rounded">edit</span>
    </simply-mat-icon>

    <!-- Icon with ariaHidden true and ariaLabel (should be ignored) -->
    <simply-mat-icon
      data-testid="aria-hidden-true-with-label-icon"
      [ariaHidden]="true"
      [ariaLabel]="'Should be ignored'">
      <span class="material-symbols-rounded">delete</span>
    </simply-mat-icon>

    <!-- Dynamic icon for reactive tests -->
    <simply-mat-icon
      data-testid="dynamic-icon"
      [ariaHidden]="dynamicAriaHidden()"
      [ariaLabel]="dynamicAriaLabel()">
      <span class="material-symbols-rounded">settings</span>
    </simply-mat-icon>

    <!-- Icons with different font-sizes set directly for view encapsulation tests -->
    <simply-mat-icon data-testid="icon-2rem" style="font-size: 2rem;">
      <span class="material-symbols-rounded">star</span>
    </simply-mat-icon>

    <simply-mat-icon data-testid="icon-3rem" style="font-size: 3rem;">
      <span class="material-symbols-rounded">favorite</span>
    </simply-mat-icon>
  `,
  imports: [SimplyMatIcon],
})
class IconTestComponent {
  dynamicAriaHidden = signal<boolean>(true);
  dynamicAriaLabel = signal<string | null>(null);
}

export class IconPage {
  constructor(protected fixture: ComponentFixture<any>) {}

  getComponent(testId: string): SimplyMatIcon | null {
    const element = page.getByTestId(testId).query();
    if (!element) return null;
    const allComponents = this.fixture.debugElement.queryAll(By.directive(SimplyMatIcon));
    const debugElement = allComponents.find((el) => el.nativeElement === element);
    if (!debugElement) return null;
    try {
      return debugElement.injector.get(SimplyMatIcon, null);
    } catch {
      return null;
    }
  }

  getElement(testId: string): HTMLElement | null {
    return page.getByTestId(testId).query() as HTMLElement | null;
  }

  getAttribute(testId: string, attr: string): string | null {
    const element = this.getElement(testId);
    return element ? element.getAttribute(attr) : null;
  }

  hasAttribute(testId: string, attr: string): boolean {
    const element = this.getElement(testId);
    return element ? element.hasAttribute(attr) : false;
  }

  getMaterialSymbolSpan(testId: string): HTMLElement | null {
    const iconElement = this.getElement(testId);
    if (!iconElement) return null;
    return iconElement.querySelector('.material-symbols-rounded') as HTMLElement | null;
  }

  getComputedFontSize(element: HTMLElement): string {
    return window.getComputedStyle(element).fontSize;
  }
}

describe('SimplyMatIcon', () => {
  let fixture: ComponentFixture<IconTestComponent>;
  let testPage: IconPage;
  let testComponent: IconTestComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [IconTestComponent, SimplyMatIcon],
    });

    fixture = TestBed.createComponent(IconTestComponent);
    testPage = new IconPage(fixture);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('Component Initialization', () => {
    test('should create component instance', () => {
      const component = testPage.getComponent('default-icon');
      expect(component).toBeTruthy();
      expect(component).toBeInstanceOf(SimplyMatIcon);
    });

    test('should render icon element', () => {
      const element = testPage.getElement('default-icon');
      expect(element).toBeTruthy();
      expect(element?.tagName.toLowerCase()).toBe('simply-mat-icon');
    });
  });

  describe('ARIA Inputs - Default ariaHidden (true)', () => {
    test('should have aria-hidden="true" attribute by default', () => {
      expect(testPage.getAttribute('default-icon', 'aria-hidden')).toBe('true');
    });

    test('should not have role attribute when ariaHidden is true', () => {
      expect(testPage.hasAttribute('default-icon', 'role')).toBe(false);
    });

    test('should not have aria-label attribute when ariaHidden is true', () => {
      expect(testPage.hasAttribute('default-icon', 'aria-label')).toBe(false);
    });
  });

  describe('ARIA Inputs - ariaHidden false', () => {
    test('should not have aria-hidden attribute when ariaHidden is false', () => {
      expect(testPage.hasAttribute('aria-hidden-false-icon', 'aria-hidden')).toBe(false);
    });

    test('should have role="img" attribute when ariaHidden is false', () => {
      expect(testPage.getAttribute('aria-hidden-false-icon', 'role')).toBe('img');
    });

    test('should not have aria-label when ariaHidden is false and ariaLabel is null', () => {
      expect(testPage.hasAttribute('aria-hidden-false-icon', 'aria-label')).toBe(false);
    });
  });

  describe('ARIA Inputs - ariaLabel when ariaHidden is false', () => {
    test('should have aria-label attribute with provided value', () => {
      expect(testPage.getAttribute('aria-label-icon', 'aria-label')).toBe('Edit item');
    });

    test('should have role="img" attribute when ariaLabel is provided', () => {
      expect(testPage.getAttribute('aria-label-icon', 'role')).toBe('img');
    });
  });

  describe('ARIA Inputs - ariaLabel ignored when ariaHidden is true', () => {
    test('should have aria-hidden="true" even when ariaLabel is provided', () => {
      expect(testPage.getAttribute('aria-hidden-true-with-label-icon', 'aria-hidden')).toBe('true');
    });

    test('should not have aria-label attribute when ariaHidden is true, even if ariaLabel is provided', () => {
      expect(testPage.hasAttribute('aria-hidden-true-with-label-icon', 'aria-label')).toBe(false);
    });
  });

  describe('ARIA Inputs - Reactive Updates', () => {
    test('should update aria-hidden attribute when ariaHidden changes from true to false', async () => {
      expect(testPage.getAttribute('dynamic-icon', 'aria-hidden')).toBe('true');

      testComponent.dynamicAriaHidden.set(false);
      await fixture.whenStable();

      expect(testPage.hasAttribute('dynamic-icon', 'aria-hidden')).toBe(false);
    });

    test('should add role="img" when ariaHidden changes from true to false', async () => {
      expect(testPage.hasAttribute('dynamic-icon', 'role')).toBe(false);

      testComponent.dynamicAriaHidden.set(false);
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-icon', 'role')).toBe('img');
    });

    test('should update aria-label when ariaLabel changes', async () => {
      testComponent.dynamicAriaHidden.set(false);
      testComponent.dynamicAriaLabel.set('Dynamic label');
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-icon', 'aria-label')).toBe('Dynamic label');
    });

    test('should remove aria-label when ariaLabel changes to null', async () => {
      testComponent.dynamicAriaHidden.set(false);
      testComponent.dynamicAriaLabel.set('Initial label');
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-icon', 'aria-label')).toBe('Initial label');

      testComponent.dynamicAriaLabel.set(null);
      await fixture.whenStable();

      expect(testPage.hasAttribute('dynamic-icon', 'aria-label')).toBe(false);
    });
  });

  describe('View Encapsulation - Font-size Inheritance', () => {
    test('should inherit font-size from icon component when icon has font-size 2rem', () => {
      const iconElement = testPage.getElement('icon-2rem');
      const materialSymbolSpan = testPage.getMaterialSymbolSpan('icon-2rem');

      expect(iconElement).toBeTruthy();
      expect(materialSymbolSpan).toBeTruthy();

      // Because view encapsulation is None, we can set font-size on the icon from outside
      // and the material symbol span should inherit it
      const computedFontSize = testPage.getComputedFontSize(materialSymbolSpan!);
      expect(computedFontSize).toBe('32px');
    });

    test('should inherit font-size from icon component when icon has font-size 3rem', () => {
      const iconElement = testPage.getElement('icon-3rem');
      const materialSymbolSpan = testPage.getMaterialSymbolSpan('icon-3rem');

      expect(iconElement).toBeTruthy();
      expect(materialSymbolSpan).toBeTruthy();

      // Because view encapsulation is None, we can set font-size on the icon from outside
      // and the material symbol span should inherit it
      const computedFontSize = testPage.getComputedFontSize(materialSymbolSpan!);
      expect(computedFontSize).toBe('48px');
    });
  });
});

