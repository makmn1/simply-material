import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, test, expect, beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import { SimplyMatButtonOption } from './button-option';
import { SimplyMatButton, ButtonVariant, ButtonSize, ButtonShape } from './button';
import { ButtonBase } from '../core/button-base/button-base';
import { BUTTON_BASE_CONFIG } from '../core/button-base/button-base.token';
import { ButtonPage } from './button.spec';
import {SimplyMatRippleDirective} from '../../core/ripple/ripple';

class ButtonOptionPage extends ButtonPage {
  override getComponent(testId: string): SimplyMatButtonOption | null {
    const element = page.getByTestId(testId).query();
    if (!element) return null;
    const allComponents = this.fixture.debugElement.queryAll(By.directive(SimplyMatButtonOption));
    const debugElement = allComponents.find((el) => el.nativeElement === element);
    if (!debugElement) return null;
    try {
      return debugElement.injector.get(SimplyMatButtonOption, null);
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
}

@Component({
  template: `
    <button
      data-testid="default-option-btn"
      simplyMatButton
      ngOption>
      Default Option
    </button>

    <button
      data-testid="elevated-option-btn"
      simplyMatButton
      ngOption
      [variant]="'elevated'">
      Elevated Option
    </button>

    <button
      data-testid="large-option-btn"
      simplyMatButton
      ngOption
      [size]="'large'">
      Large Option
    </button>

    <button
      data-testid="square-option-btn"
      simplyMatButton
      ngOption
      [shape]="'square'">
      Square Option
    </button>

    <button
      data-testid="disabled-option-btn"
      simplyMatButton
      ngOption
      [disabled]="disabledSignal()">
      Disabled Option
    </button>

    <button
      data-testid="soft-disabled-option-btn"
      simplyMatButton
      ngOption
      [softDisabled]="softDisabledSignal()">
      Soft Disabled Option
    </button>

    <button
      data-testid="readonly-option-btn"
      simplyMatButton
      ngOption
      [readonly]="readonlySignal()">
      Readonly Option
    </button>

    <button
      data-testid="dynamic-option-btn"
      simplyMatButton
      ngOption
      [variant]="dynamicVariant()"
      [size]="dynamicSize()"
      [shape]="dynamicShape()"
      [disabled]="dynamicDisabled()"
      [softDisabled]="dynamicSoftDisabled()"
      [readonly]="dynamicReadonly()">
      Dynamic Option
    </button>
  `,
  imports: [SimplyMatButtonOption],
})
class ButtonOptionTestComponent {
  disabledSignal = signal(true);
  softDisabledSignal = signal(true);
  readonlySignal = signal(true);

  dynamicVariant = signal<ButtonVariant>('filled');
  dynamicSize = signal<ButtonSize>('small');
  dynamicShape = signal<ButtonShape | undefined>(undefined);
  dynamicDisabled = signal<boolean | undefined>(false);
  dynamicSoftDisabled = signal<boolean | undefined>(undefined);
  dynamicReadonly = signal<boolean | undefined>(undefined);
}

describe('SimplyMatButtonOption', () => {
  let fixture: ComponentFixture<ButtonOptionTestComponent>;
  let testPage: ButtonOptionPage;
  let testComponent: ButtonOptionTestComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ButtonOptionTestComponent, SimplyMatButtonOption],
    });

    fixture = TestBed.createComponent(ButtonOptionTestComponent);
    testPage = new ButtonOptionPage(fixture);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('Class Inheritance', () => {
    test('should extend SimplyMatButton class', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component).toBeTruthy();
      expect(component).toBeInstanceOf(SimplyMatButtonOption);
      expect(component).toBeInstanceOf(SimplyMatButton);
    });

    test('should attach ButtonBase host directive', () => {
      const directive = testPage.getDirective('default-option-btn');
      expect(directive).toBeTruthy();
      expect(directive).toBeInstanceOf(ButtonBase);
    });

    test('should provide BUTTON_BASE_CONFIG token', () => {
      const element = page.getByTestId('default-option-btn').query();
      const debugElement = fixture.debugElement.queryAll(By.directive(SimplyMatButtonOption))
        .find((el) => el.nativeElement === element);

      const config = debugElement?.injector.get(BUTTON_BASE_CONFIG, null);
      expect(config).toBeTruthy();
    });

    test('should attach SimplyMatRippleDirective host directive', () => {
      const ripple = testPage.getRippleDirective('default-option-btn');
      expect(ripple).toBeTruthy();
      expect(ripple).toBeInstanceOf(SimplyMatRippleDirective);
    });
  });

  describe('Togglable Behavior', () => {
    test('should always be togglable (togglable = true)', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.baseConfig.togglable()).toBe(true);
    });

    test('should have data-sm-toggle attribute set to true', () => {
      expect(testPage.getAttribute('default-option-btn', 'data-sm-toggle')).toBe('true');
    });

    test('togglable should always return true regardless of component state', () => {
      const component = testPage.getComponent('disabled-option-btn');
      expect(component?.baseConfig.togglable()).toBe(true);
    });
  });

  describe('Selected State', () => {
    test('should start with isSelected = false by default', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.baseConfig.isSelected()).toBe(false);
      expect(component?.isSelected()).toBe(false);
    });

    test('should have data-sm-selected attribute set to false by default', () => {
      expect(testPage.getAttribute('default-option-btn', 'data-sm-selected')).toBe('false');
    });

    test('isSelected should be writable for programmatic updates', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.isSelected).toBeTruthy();

      component?.isSelected.set(true);
      expect(component?.isSelected()).toBe(true);
      expect(component?.baseConfig.isSelected()).toBe(true);
    });

    test('should update data-sm-selected attribute when isSelected changes', async () => {
      const component = testPage.getComponent('default-option-btn');

      component?.isSelected.set(true);
      await fixture.whenStable();

      expect(testPage.getAttribute('default-option-btn', 'data-sm-selected')).toBe('true');
    });

    test('should have aria-pressed attribute reflecting selected state', () => {
      expect(testPage.getAttribute('default-option-btn', 'aria-pressed')).toBe('false');
    });

    test('should update aria-pressed when isSelected changes', async () => {
      const component = testPage.getComponent('default-option-btn');

      component?.isSelected.set(true);
      await fixture.whenStable();

      expect(testPage.getAttribute('default-option-btn', 'aria-pressed')).toBe('true');
    });
  });

  describe('Inherited Behavior - Variant', () => {
    test('should respect variant input - filled (default)', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.baseConfig.buttonVariant()).toBe('filled');
      expect(testPage.getAttribute('default-option-btn', 'data-sm-variant')).toBe('filled');
    });

    test('should respect variant input - elevated', () => {
      const component = testPage.getComponent('elevated-option-btn');
      expect(component?.baseConfig.buttonVariant()).toBe('elevated');
      expect(testPage.getAttribute('elevated-option-btn', 'data-sm-variant')).toBe('elevated');
    });

    test('should update variant reactively', async () => {
      const component = testPage.getComponent('dynamic-option-btn');
      expect(component?.baseConfig.buttonVariant()).toBe('filled');

      testComponent.dynamicVariant.set('tonal');
      await fixture.whenStable();

      expect(component?.baseConfig.buttonVariant()).toBe('tonal');
      expect(testPage.getAttribute('dynamic-option-btn', 'data-sm-variant')).toBe('tonal');
    });
  });

  describe('Inherited Behavior - Size', () => {
    test('should respect size input - small (default)', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.baseConfig.buttonSize()).toBe('small');
      expect(testPage.getAttribute('default-option-btn', 'data-sm-size')).toBe('small');
    });

    test('should respect size input - large', () => {
      const component = testPage.getComponent('large-option-btn');
      expect(component?.baseConfig.buttonSize()).toBe('large');
      expect(testPage.getAttribute('large-option-btn', 'data-sm-size')).toBe('large');
    });

    test('should update size reactively', async () => {
      const component = testPage.getComponent('dynamic-option-btn');
      expect(component?.baseConfig.buttonSize()).toBe('small');

      testComponent.dynamicSize.set('xlarge');
      await fixture.whenStable();

      expect(component?.baseConfig.buttonSize()).toBe('xlarge');
      expect(testPage.getAttribute('dynamic-option-btn', 'data-sm-size')).toBe('xlarge');
    });
  });

  describe('Inherited Behavior - Shape', () => {
    test('should respect shape input - round (default)', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.baseConfig.buttonShape()).toBeUndefined();
      expect(testPage.getAttribute('default-option-btn', 'data-sm-shape')).toBe('round');
    });

    test('should respect shape input - square', () => {
      const component = testPage.getComponent('square-option-btn');
      expect(component?.baseConfig.buttonShape()).toBe('square');
      expect(testPage.getAttribute('square-option-btn', 'data-sm-shape')).toBe('square');
    });

    test('should update shape reactively', async () => {
      const component = testPage.getComponent('dynamic-option-btn');
      expect(component?.baseConfig.buttonShape()).toBeUndefined();

      testComponent.dynamicShape.set('square');
      await fixture.whenStable();

      expect(component?.baseConfig.buttonShape()).toBe('square');
      expect(testPage.getAttribute('dynamic-option-btn', 'data-sm-shape')).toBe('square');
    });
  });

  describe('Inherited Behavior - Disabled', () => {
    test('should respect disabled input - undefined (default)', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.baseConfig.buttonDisabled()).toBeUndefined();
      expect(testPage.hasAttribute('default-option-btn', 'disabled')).toBe(false);
    });

    test('should respect disabled input - true', () => {
      const component = testPage.getComponent('disabled-option-btn');
      expect(component?.baseConfig.buttonDisabled()).toBe(true);
      expect(testPage.hasAttribute('disabled-option-btn', 'disabled')).toBe(true);
    });

    test('should update disabled reactively', async () => {
      const component = testPage.getComponent('dynamic-option-btn');
      expect(component?.baseConfig.buttonDisabled()).toBe(false);

      testComponent.dynamicDisabled.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonDisabled()).toBe(true);
      expect(testPage.hasAttribute('dynamic-option-btn', 'disabled')).toBe(true);
    });

    test('should accept undefined explicitly', async () => {
      const component = testPage.getComponent('dynamic-option-btn');
      testComponent.dynamicDisabled.set(undefined);
      await fixture.whenStable();
      expect(component?.baseConfig.buttonDisabled()).toBeUndefined();
    });
  });

  describe('Inherited Behavior - Soft Disabled', () => {
    test('should respect soft disabled input - undefined (default)', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.baseConfig.buttonSoftDisabled()).toBeUndefined();
    });

    test('should respect soft disabled input - true', () => {
      const component = testPage.getComponent('soft-disabled-option-btn');
      expect(component?.baseConfig.buttonSoftDisabled()).toBe(true);
    });

    test('should update soft disabled reactively', async () => {
      const component = testPage.getComponent('dynamic-option-btn');
      expect(component?.baseConfig.buttonSoftDisabled()).toBeUndefined();

      testComponent.dynamicSoftDisabled.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonSoftDisabled()).toBe(true);
    });
  });

  describe('Inherited Behavior - Readonly', () => {
    test('should respect readonly input - undefined (default)', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.baseConfig.buttonReadonly()).toBeUndefined();
    });

    test('should respect readonly input - true', () => {
      const component = testPage.getComponent('readonly-option-btn');
      expect(component?.baseConfig.buttonReadonly()).toBe(true);
    });

    test('should update readonly reactively', async () => {
      const component = testPage.getComponent('dynamic-option-btn');
      expect(component?.baseConfig.buttonReadonly()).toBeUndefined();

      testComponent.dynamicReadonly.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonReadonly()).toBe(true);
    });
  });

  describe('BaseConfig Properties', () => {
    test('should have buttonShapeMorphRole set to "button"', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.baseConfig.buttonShapeMorphRole).toBe('button');
    });

    test('should have defaultButtonShape set to "round"', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.baseConfig.defaultButtonShape).toBe('round');
    });

    test('baseConfig.togglable should always return true', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.baseConfig.togglable()).toBe(true);
    });

    test('baseConfig.isSelected should reflect internal state', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.baseConfig.isSelected()).toBe(false);

      component?.isSelected.set(true);
      expect(component?.baseConfig.isSelected()).toBe(true);
    });

    test('should have same structure as parent baseConfig', () => {
      const component = testPage.getComponent('default-option-btn');
      const config = component?.baseConfig;

      expect(config).toBeTruthy();
      expect(config?.buttonShapeMorphRole).toBeDefined();
      expect(config?.buttonVariant).toBeDefined();
      expect(config?.buttonSize).toBeDefined();
      expect(config?.buttonShape).toBeDefined();
      expect(config?.defaultButtonShape).toBeDefined();
      expect(config?.buttonDisabled).toBeDefined();
      expect(config?.buttonSoftDisabled).toBeDefined();
      expect(config?.buttonReadonly).toBeDefined();
      expect(config?.togglable).toBeDefined();
      expect(config?.isSelected).toBeDefined();
    });
  });

  describe('Differences from SimplyMatButton', () => {
    test('should not use linkedSignal for isSelected (uses regular signal)', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.isSelected()).toBe(false);

      component?.isSelected.set(true);
      expect(component?.isSelected()).toBe(true);
    });

    test('should always be togglable unlike parent which defaults to false', () => {
      const component = testPage.getComponent('default-option-btn');
      expect(component?.baseConfig.togglable()).toBe(true);
    });
  });
});

