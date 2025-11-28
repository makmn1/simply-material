import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, test, expect, beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import { FabBase } from './fab-base';
import { FabColor, FabSize } from './fab-base.types';
import { SimplyMatRippleDirective } from '../../../../../miscellaneous/ripple/ripple';

@Component({
  template: `
    <!-- Basic FAB base with default values -->
    <button
      data-testid="default-fab"
      simplyMatFabBase>
      <span>+</span>
    </button>

    <!-- FAB base with different colors -->
    <button
      data-testid="primary-fab"
      simplyMatFabBase
      [color]="'primary'">
      <span>+</span>
    </button>

    <button
      data-testid="secondary-fab"
      simplyMatFabBase
      [color]="'secondary'">
      <span>+</span>
    </button>

    <button
      data-testid="tertiary-fab"
      simplyMatFabBase
      [color]="'tertiary'">
      <span>+</span>
    </button>

    <!-- FAB base with different sizes -->
    <button
      data-testid="small-fab"
      simplyMatFabBase
      [size]="'small'">
      <span>+</span>
    </button>

    <button
      data-testid="medium-fab"
      simplyMatFabBase
      [size]="'medium'">
      <span>+</span>
    </button>

    <button
      data-testid="large-fab"
      simplyMatFabBase
      [size]="'large'">
      <span>+</span>
    </button>

    <!-- Tonal FAB base -->
    <button
      data-testid="tonal-fab"
      simplyMatFabBase
      [tonal]="true">
      <span>+</span>
    </button>

    <!-- FAB base with ARIA attributes -->
    <button
      data-testid="aria-label-fab"
      simplyMatFabBase
      [ariaLabel]="'Add item'">
      <span>+</span>
    </button>

    <button
      data-testid="aria-labelledby-fab"
      simplyMatFabBase
      [ariaLabelledby]="'label-id'">
      <span>+</span>
    </button>

    <span id="label-id">Add</span>

    <!-- Dynamic FAB base for reactive tests -->
    <button
      data-testid="dynamic-fab"
      simplyMatFabBase
      [color]="dynamicColor()"
      [size]="dynamicSize()"
      [tonal]="dynamicTonal()"
      [ariaLabel]="dynamicAriaLabel()"
      [ariaLabelledby]="dynamicAriaLabelledby()">
      <span>+</span>
    </button>
  `,
  imports: [FabBase],
})
class FabBaseTestComponent {
  dynamicColor = signal<FabColor>('primary');
  dynamicSize = signal<FabSize>('small');
  dynamicTonal = signal<boolean>(false);
  dynamicAriaLabel = signal<string | null>(null);
  dynamicAriaLabelledby = signal<string | null>(null);
}

export class FabBasePage {
  constructor(protected fixture: ComponentFixture<any>) {}

  getDirective(testId: string): FabBase | null {
    const element = page.getByTestId(testId).query();
    if (!element) return null;
    const allDirectives = this.fixture.debugElement.queryAll(By.directive(FabBase));
    const debugElement = allDirectives.find((el) => el.nativeElement === element);
    if (!debugElement) return null;
    try {
      return debugElement.injector.get(FabBase, null);
    } catch {
      return null;
    }
  }

  getRippleDirective(testId: string): SimplyMatRippleDirective | null {
    const element = page.getByTestId(testId).query();
    if (!element) return null;
    const allDirectives = this.fixture.debugElement.queryAll(By.directive(SimplyMatRippleDirective));
    const debugElement = allDirectives.find((el) => el.nativeElement === element);
    if (!debugElement) return null;
    try {
      return debugElement.injector.get(SimplyMatRippleDirective, null);
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
}

describe('FabBase', () => {
  let fixture: ComponentFixture<FabBaseTestComponent>;
  let testPage: FabBasePage;
  let testComponent: FabBaseTestComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FabBaseTestComponent, FabBase],
    });

    fixture = TestBed.createComponent(FabBaseTestComponent);
    testPage = new FabBasePage(fixture);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('Directive Initialization', () => {
    test('should create directive instance', () => {
      const directive = testPage.getDirective('default-fab');
      expect(directive).toBeTruthy();
      expect(directive).toBeInstanceOf(FabBase);
    });

    test('should attach SimplyMatRippleDirective host directive', () => {
      const directive = testPage.getRippleDirective('default-fab');
      expect(directive).toBeTruthy();
      expect(directive).toBeInstanceOf(SimplyMatRippleDirective);
    });

    test('should create on button element', () => {
      const element = testPage.getElement('default-fab');
      expect(element?.tagName.toLowerCase()).toBe('button');
    });
  });

  describe('Input Properties - Color', () => {
    test('should default to primary color', () => {
      const directive = testPage.getDirective('default-fab');
      expect(directive?.color()).toBe('primary');
    });

    test('should reflect primary color', () => {
      const directive = testPage.getDirective('primary-fab');
      expect(directive?.color()).toBe('primary');
    });

    test('should reflect secondary color', () => {
      const directive = testPage.getDirective('secondary-fab');
      expect(directive?.color()).toBe('secondary');
    });

    test('should reflect tertiary color', () => {
      const directive = testPage.getDirective('tertiary-fab');
      expect(directive?.color()).toBe('tertiary');
    });
  });

  describe('Input Properties - Size', () => {
    test('should default to small size', () => {
      const directive = testPage.getDirective('default-fab');
      expect(directive?.size()).toBe('small');
    });

    test('should reflect small size', () => {
      const directive = testPage.getDirective('small-fab');
      expect(directive?.size()).toBe('small');
    });

    test('should reflect medium size', () => {
      const directive = testPage.getDirective('medium-fab');
      expect(directive?.size()).toBe('medium');
    });

    test('should reflect large size', () => {
      const directive = testPage.getDirective('large-fab');
      expect(directive?.size()).toBe('large');
    });
  });

  describe('Input Properties - Tonal', () => {
    test('should default to non-tonal (false)', () => {
      const directive = testPage.getDirective('default-fab');
      expect(directive?.tonal()).toBe(false);
    });

    test('should reflect tonal state when true', () => {
      const directive = testPage.getDirective('tonal-fab');
      expect(directive?.tonal()).toBe(true);
    });
  });

  describe('Input Properties - ARIA Attributes', () => {
    test('should default ariaLabel to null', () => {
      const directive = testPage.getDirective('default-fab');
      expect(directive?.ariaLabel()).toBeNull();
    });

    test('should reflect ariaLabel when set', () => {
      const directive = testPage.getDirective('aria-label-fab');
      expect(directive?.ariaLabel()).toBe('Add item');
    });

    test('should default ariaLabelledby to null', () => {
      const directive = testPage.getDirective('default-fab');
      expect(directive?.ariaLabelledby()).toBeNull();
    });

    test('should reflect ariaLabelledby when set', () => {
      const directive = testPage.getDirective('aria-labelledby-fab');
      expect(directive?.ariaLabelledby()).toBe('label-id');
    });
  });

  describe('Host Attributes - Color', () => {
    test('should set data-sm-color attribute to primary', () => {
      expect(testPage.getAttribute('primary-fab', 'data-sm-color')).toBe('primary');
    });

    test('should set data-sm-color attribute to secondary', () => {
      expect(testPage.getAttribute('secondary-fab', 'data-sm-color')).toBe('secondary');
    });

    test('should set data-sm-color attribute to tertiary', () => {
      expect(testPage.getAttribute('tertiary-fab', 'data-sm-color')).toBe('tertiary');
    });

    test('should default to primary color', () => {
      expect(testPage.getAttribute('default-fab', 'data-sm-color')).toBe('primary');
    });
  });

  describe('Host Attributes - Size', () => {
    test('should set data-sm-size attribute to small', () => {
      expect(testPage.getAttribute('small-fab', 'data-sm-size')).toBe('small');
    });

    test('should set data-sm-size attribute to medium', () => {
      expect(testPage.getAttribute('medium-fab', 'data-sm-size')).toBe('medium');
    });

    test('should set data-sm-size attribute to large', () => {
      expect(testPage.getAttribute('large-fab', 'data-sm-size')).toBe('large');
    });

    test('should default to small size', () => {
      expect(testPage.getAttribute('default-fab', 'data-sm-size')).toBe('small');
    });
  });

  describe('Host Attributes - Tonal', () => {
    test('should set data-sm-tonal attribute when tonal is true', () => {
      expect(testPage.hasAttribute('tonal-fab', 'data-sm-tonal')).toBe(true);
    });

    test('should not set data-sm-tonal attribute when tonal is false', () => {
      expect(testPage.hasAttribute('default-fab', 'data-sm-tonal')).toBe(false);
    });
  });

  describe('Host Attributes - ARIA', () => {
    test('should set aria-label attribute when ariaLabel is set', () => {
      expect(testPage.getAttribute('aria-label-fab', 'aria-label')).toBe('Add item');
    });

    test('should not set aria-label attribute when ariaLabel is null', () => {
      expect(testPage.hasAttribute('default-fab', 'aria-label')).toBe(false);
    });

    test('should set aria-labelledby attribute when ariaLabelledby is set', () => {
      expect(testPage.getAttribute('aria-labelledby-fab', 'aria-labelledby')).toBe('label-id');
    });

    test('should not set aria-labelledby attribute when ariaLabelledby is null', () => {
      expect(testPage.hasAttribute('default-fab', 'aria-labelledby')).toBe(false);
    });
  });

  describe('Reactive Updates - Color', () => {
    test('should update data-sm-color attribute when color input changes', async () => {
      expect(testPage.getAttribute('dynamic-fab', 'data-sm-color')).toBe('primary');

      testComponent.dynamicColor.set('secondary');
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-fab', 'data-sm-color')).toBe('secondary');
    });

    test('should update directive color signal when color input changes', async () => {
      const directive = testPage.getDirective('dynamic-fab');
      expect(directive?.color()).toBe('primary');

      testComponent.dynamicColor.set('tertiary');
      await fixture.whenStable();

      expect(directive?.color()).toBe('tertiary');
    });
  });

  describe('Reactive Updates - Size', () => {
    test('should update data-sm-size attribute when size input changes', async () => {
      expect(testPage.getAttribute('dynamic-fab', 'data-sm-size')).toBe('small');

      testComponent.dynamicSize.set('large');
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-fab', 'data-sm-size')).toBe('large');
    });

    test('should update directive size signal when size input changes', async () => {
      const directive = testPage.getDirective('dynamic-fab');
      expect(directive?.size()).toBe('small');

      testComponent.dynamicSize.set('medium');
      await fixture.whenStable();

      expect(directive?.size()).toBe('medium');
    });
  });

  describe('Reactive Updates - Tonal', () => {
    test('should update data-sm-tonal attribute when tonal input changes', async () => {
      expect(testPage.hasAttribute('dynamic-fab', 'data-sm-tonal')).toBe(false);

      testComponent.dynamicTonal.set(true);
      await fixture.whenStable();

      expect(testPage.hasAttribute('dynamic-fab', 'data-sm-tonal')).toBe(true);
    });

    test('should update directive tonal signal when tonal input changes', async () => {
      const directive = testPage.getDirective('dynamic-fab');
      expect(directive?.tonal()).toBe(false);

      testComponent.dynamicTonal.set(true);
      await fixture.whenStable();

      expect(directive?.tonal()).toBe(true);
    });

    test('should remove data-sm-tonal attribute when tonal changes from true to false', async () => {
      testComponent.dynamicTonal.set(true);
      await fixture.whenStable();

      expect(testPage.hasAttribute('dynamic-fab', 'data-sm-tonal')).toBe(true);

      testComponent.dynamicTonal.set(false);
      await fixture.whenStable();

      expect(testPage.hasAttribute('dynamic-fab', 'data-sm-tonal')).toBe(false);
    });
  });

  describe('Reactive Updates - ARIA Attributes', () => {
    test('should update aria-label attribute when ariaLabel input changes', async () => {
      expect(testPage.hasAttribute('dynamic-fab', 'aria-label')).toBe(false);

      testComponent.dynamicAriaLabel.set('New label');
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-fab', 'aria-label')).toBe('New label');
    });

    test('should update directive ariaLabel signal when ariaLabel input changes', async () => {
      const directive = testPage.getDirective('dynamic-fab');
      expect(directive?.ariaLabel()).toBeNull();

      testComponent.dynamicAriaLabel.set('Test label');
      await fixture.whenStable();

      expect(directive?.ariaLabel()).toBe('Test label');
    });

    test('should remove aria-label attribute when ariaLabel changes to null', async () => {
      testComponent.dynamicAriaLabel.set('Initial label');
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-fab', 'aria-label')).toBe('Initial label');

      testComponent.dynamicAriaLabel.set(null);
      await fixture.whenStable();

      expect(testPage.hasAttribute('dynamic-fab', 'aria-label')).toBe(false);
    });

    test('should update aria-labelledby attribute when ariaLabelledby input changes', async () => {
      expect(testPage.hasAttribute('dynamic-fab', 'aria-labelledby')).toBe(false);

      testComponent.dynamicAriaLabelledby.set('new-label-id');
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-fab', 'aria-labelledby')).toBe('new-label-id');
    });

    test('should update directive ariaLabelledby signal when ariaLabelledby input changes', async () => {
      const directive = testPage.getDirective('dynamic-fab');
      expect(directive?.ariaLabelledby()).toBeNull();

      testComponent.dynamicAriaLabelledby.set('test-id');
      await fixture.whenStable();

      expect(directive?.ariaLabelledby()).toBe('test-id');
    });

    test('should remove aria-labelledby attribute when ariaLabelledby changes to null', async () => {
      testComponent.dynamicAriaLabelledby.set('initial-id');
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-fab', 'aria-labelledby')).toBe('initial-id');

      testComponent.dynamicAriaLabelledby.set(null);
      await fixture.whenStable();

      expect(testPage.hasAttribute('dynamic-fab', 'aria-labelledby')).toBe(false);
    });
  });
});
