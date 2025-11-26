import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { page } from 'vitest/browser';
import { SimplyMatButton, ButtonVariant, ButtonSize, ButtonShape } from './button';
import { ButtonBase } from '../core/button-base/button-base';
import { BUTTON_BASE_CONFIG } from '../core/button-base/button-base.token';

@Component({
  template: `
    <!-- Basic button with default values -->
    <button
      data-testid="default-btn"
      simplyMatButton>
      Default Button
    </button>

    <!-- Button with all variant types -->
    <button
      data-testid="filled-btn"
      simplyMatButton
      [variant]="'filled'">
      Filled
    </button>

    <button
      data-testid="elevated-btn"
      simplyMatButton
      [variant]="'elevated'">
      Elevated
    </button>

    <button
      data-testid="tonal-btn"
      simplyMatButton
      [variant]="'tonal'">
      Tonal
    </button>

    <button
      data-testid="outlined-btn"
      simplyMatButton
      [variant]="'outlined'">
      Outlined
    </button>

    <button
      data-testid="text-btn"
      simplyMatButton
      [variant]="'text'">
      Text
    </button>

    <!-- Buttons with different sizes -->
    <button
      data-testid="xsmall-btn"
      simplyMatButton
      [size]="'xsmall'">
      XSmall
    </button>

    <button
      data-testid="small-btn"
      simplyMatButton
      [size]="'small'">
      Small
    </button>

    <button
      data-testid="medium-btn"
      simplyMatButton
      [size]="'medium'">
      Medium
    </button>

    <button
      data-testid="large-btn"
      simplyMatButton
      [size]="'large'">
      Large
    </button>

    <button
      data-testid="xlarge-btn"
      simplyMatButton
      [size]="'xlarge'">
      XLarge
    </button>

    <!-- Buttons with different shapes -->
    <button
      data-testid="round-btn"
      simplyMatButton
      [shape]="'round'">
      Round
    </button>

    <button
      data-testid="square-btn"
      simplyMatButton
      [shape]="'square'">
      Square
    </button>

    <!-- Disabled button -->
    <button
      data-testid="disabled-btn"
      simplyMatButton
      [disabled]="disabledSignal()">
      Disabled
    </button>

    <!-- Soft disabled button -->
    <button
      data-testid="soft-disabled-btn"
      simplyMatButton
      [softDisabled]="softDisabledSignal()">
      Soft Disabled
    </button>

    <!-- Readonly button -->
    <button
      data-testid="readonly-btn"
      simplyMatButton
      [readonly]="readonlySignal()">
      Readonly
    </button>

    <!-- Togglable buttons -->
    <button
      data-testid="togglable-btn"
      simplyMatButton
      [togglable]="true">
      Togglable
    </button>

    <button
      data-testid="togglable-selected-btn"
      simplyMatButton
      [togglable]="true"
      [selected]="selectedSignal()">
      Togglable Selected
    </button>

    <!-- Anchor element -->
    <a
      data-testid="anchor-btn"
      simplyMatButton
      [disabled]="anchorDisabledSignal()">
      Anchor Button
    </a>

    <!-- Dynamic button for reactive tests -->
    <button
      data-testid="dynamic-btn"
      simplyMatButton
      [variant]="dynamicVariant()"
      [size]="dynamicSize()"
      [shape]="dynamicShape()"
      [disabled]="dynamicDisabled()"
      [softDisabled]="dynamicSoftDisabled()"
      [readonly]="dynamicReadonly()"
      [togglable]="dynamicTogglable()"
      [selected]="dynamicSelected()">
      Dynamic Button
    </button>
  `,
  imports: [SimplyMatButton],
})
class ButtonTestComponent {
  disabledSignal = signal(true);
  softDisabledSignal = signal(true);
  readonlySignal = signal(true);
  anchorDisabledSignal = signal(false);
  selectedSignal = signal(true);

  dynamicVariant = signal<ButtonVariant>('filled');
  dynamicSize = signal<ButtonSize>('small');
  dynamicShape = signal<ButtonShape | undefined>(undefined);
  dynamicDisabled = signal<boolean | undefined>(false);
  dynamicSoftDisabled = signal<boolean | undefined>(undefined);
  dynamicReadonly = signal<boolean | undefined>(undefined);
  dynamicTogglable = signal(false);
  dynamicSelected = signal(false);
}

export class ButtonPage {
  constructor(protected fixture: ComponentFixture<any>) {}

  getComponent(testId: string): SimplyMatButton | null {
    const element = page.getByTestId(testId).query();
    if (!element) return null;
    const allComponents = this.fixture.debugElement.queryAll(By.directive(SimplyMatButton));
    const debugElement = allComponents.find((el) => el.nativeElement === element);
    if (!debugElement) return null;
    try {
      return debugElement.injector.get(SimplyMatButton, null);
    } catch {
      return null;
    }
  }

  getDirective(testId: string): ButtonBase | null {
    const element = page.getByTestId(testId).query();
    if (!element) return null;
    const allDirectives = this.fixture.debugElement.queryAll(By.directive(ButtonBase));
    const debugElement = allDirectives.find((el) => el.nativeElement === element);
    if (!debugElement) return null;
    try {
      return debugElement.injector.get(ButtonBase, null);
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

describe('SimplyMatButton', () => {
  let fixture: ComponentFixture<ButtonTestComponent>;
  let testPage: ButtonPage;
  let testComponent: ButtonTestComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ButtonTestComponent, SimplyMatButton],
    });

    fixture = TestBed.createComponent(ButtonTestComponent);
    testPage = new ButtonPage(fixture);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('Component Initialization', () => {
    test('should create component instance', () => {
      const component = testPage.getComponent('default-btn');
      expect(component).toBeTruthy();
      expect(component).toBeInstanceOf(SimplyMatButton);
    });

    test('should attach ButtonBase host directive', () => {
      const directive = testPage.getDirective('default-btn');
      expect(directive).toBeTruthy();
      expect(directive).toBeInstanceOf(ButtonBase);
    });

    test('should provide BUTTON_BASE_CONFIG token', () => {
      const element = page.getByTestId('default-btn').query();
      const debugElement = fixture.debugElement.queryAll(By.directive(SimplyMatButton))
        .find((el) => el.nativeElement === element);

      const config = debugElement?.injector.get(BUTTON_BASE_CONFIG, null);
      expect(config).toBeTruthy();
    });

    test('should create on button element', () => {
      const element = testPage.getElement('default-btn');
      expect(element?.tagName.toLowerCase()).toBe('button');
    });

    test('should create on anchor element', () => {
      const element = testPage.getElement('anchor-btn');
      expect(element?.tagName.toLowerCase()).toBe('a');
    });
  });

  describe('BaseConfig Properties - Static Values', () => {
    test('should have buttonShapeMorphRole set to "button"', () => {
      const component = testPage.getComponent('default-btn');
      expect(component?.baseConfig.buttonShapeMorphRole).toBe('button');
    });

    test('should have defaultButtonShape set to "round"', () => {
      const component = testPage.getComponent('default-btn');
      expect(component?.baseConfig.defaultButtonShape).toBe('round');
    });
  });

  describe('BaseConfig Properties - Variant', () => {
    test('should reflect filled variant', () => {
      const component = testPage.getComponent('filled-btn');
      expect(component?.baseConfig.buttonVariant()).toBe('filled');
    });

    test('should reflect elevated variant', () => {
      const component = testPage.getComponent('elevated-btn');
      expect(component?.baseConfig.buttonVariant()).toBe('elevated');
    });

    test('should reflect tonal variant', () => {
      const component = testPage.getComponent('tonal-btn');
      expect(component?.baseConfig.buttonVariant()).toBe('tonal');
    });

    test('should reflect outlined variant', () => {
      const component = testPage.getComponent('outlined-btn');
      expect(component?.baseConfig.buttonVariant()).toBe('outlined');
    });

    test('should reflect text variant', () => {
      const component = testPage.getComponent('text-btn');
      expect(component?.baseConfig.buttonVariant()).toBe('text');
    });

    test('should default to filled variant', () => {
      const component = testPage.getComponent('default-btn');
      expect(component?.baseConfig.buttonVariant()).toBe('filled');
    });
  });

  describe('BaseConfig Properties - Size', () => {
    test('should reflect xsmall size', () => {
      const component = testPage.getComponent('xsmall-btn');
      expect(component?.baseConfig.buttonSize()).toBe('xsmall');
    });

    test('should reflect small size', () => {
      const component = testPage.getComponent('small-btn');
      expect(component?.baseConfig.buttonSize()).toBe('small');
    });

    test('should reflect medium size', () => {
      const component = testPage.getComponent('medium-btn');
      expect(component?.baseConfig.buttonSize()).toBe('medium');
    });

    test('should reflect large size', () => {
      const component = testPage.getComponent('large-btn');
      expect(component?.baseConfig.buttonSize()).toBe('large');
    });

    test('should reflect xlarge size', () => {
      const component = testPage.getComponent('xlarge-btn');
      expect(component?.baseConfig.buttonSize()).toBe('xlarge');
    });

    test('should default to small size', () => {
      const component = testPage.getComponent('default-btn');
      expect(component?.baseConfig.buttonSize()).toBe('small');
    });
  });

  describe('BaseConfig Properties - Shape', () => {
    test('should reflect round shape', () => {
      const component = testPage.getComponent('round-btn');
      expect(component?.baseConfig.buttonShape()).toBe('round');
    });

    test('should reflect square shape', () => {
      const component = testPage.getComponent('square-btn');
      expect(component?.baseConfig.buttonShape()).toBe('square');
    });

    test('should return undefined when shape not specified', () => {
      const component = testPage.getComponent('default-btn');
      expect(component?.baseConfig.buttonShape()).toBeUndefined();
    });
  });

  describe('BaseConfig Properties - Disabled', () => {
    test('should reflect disabled state', () => {
      const component = testPage.getComponent('disabled-btn');
      expect(component?.baseConfig.buttonDisabled()).toBe(true);
    });

    test('should default to undefined when not set', () => {
      const component = testPage.getComponent('default-btn');
      expect(component?.baseConfig.buttonDisabled()).toBeUndefined();
    });

    test('should accept undefined explicitly', async () => {
      const component = testPage.getComponent('dynamic-btn');
      testComponent.dynamicDisabled.set(undefined);
      await fixture.whenStable();
      expect(component?.baseConfig.buttonDisabled()).toBeUndefined();
    });
  });

  describe('BaseConfig Properties - Soft Disabled', () => {
    test('should reflect soft disabled state when true', () => {
      const component = testPage.getComponent('soft-disabled-btn');
      expect(component?.baseConfig.buttonSoftDisabled()).toBe(true);
    });

    test('should default to undefined when not set', () => {
      const component = testPage.getComponent('default-btn');
      expect(component?.baseConfig.buttonSoftDisabled()).toBeUndefined();
    });

    test('should accept undefined explicitly', () => {
      const component = testPage.getComponent('dynamic-btn');
      testComponent.dynamicSoftDisabled.set(undefined);
      expect(component?.baseConfig.buttonSoftDisabled()).toBeUndefined();
    });
  });

  describe('BaseConfig Properties - Readonly', () => {
    test('should reflect readonly state when true', () => {
      const component = testPage.getComponent('readonly-btn');
      expect(component?.baseConfig.buttonReadonly()).toBe(true);
    });

    test('should default to undefined when not set', () => {
      const component = testPage.getComponent('default-btn');
      expect(component?.baseConfig.buttonReadonly()).toBeUndefined();
    });

    test('should accept undefined explicitly', () => {
      const component = testPage.getComponent('dynamic-btn');
      testComponent.dynamicReadonly.set(undefined);
      expect(component?.baseConfig.buttonReadonly()).toBeUndefined();
    });
  });

  describe('BaseConfig Properties - Togglable', () => {
    test('should reflect togglable state', () => {
      const component = testPage.getComponent('togglable-btn');
      expect(component?.baseConfig.togglable()).toBe(true);
    });

    test('should default to non-togglable (false)', () => {
      const component = testPage.getComponent('default-btn');
      expect(component?.baseConfig.togglable()).toBe(false);
    });
  });

  describe('BaseConfig Properties - Selected (isSelected)', () => {
    test('should reflect selected state', () => {
      const component = testPage.getComponent('togglable-selected-btn');
      expect(component?.baseConfig.isSelected()).toBe(true);
    });

    test('should default to not selected (false)', () => {
      const component = testPage.getComponent('togglable-btn');
      expect(component?.baseConfig.isSelected()).toBe(false);
    });

    test('isSelected should be a writable signal', () => {
      const component = testPage.getComponent('togglable-btn');
      expect(component?.baseConfig.isSelected).toBeTruthy();

      component?.baseConfig.isSelected.set(true);
      expect(component?.baseConfig.isSelected()).toBe(true);
    });
  });

  describe('Host Attributes - Variant', () => {
    test('should set data-sm-variant attribute to filled', () => {
      expect(testPage.getAttribute('filled-btn', 'data-sm-variant')).toBe('filled');
    });

    test('should set data-sm-variant attribute to elevated', () => {
      expect(testPage.getAttribute('elevated-btn', 'data-sm-variant')).toBe('elevated');
    });

    test('should set data-sm-variant attribute to tonal', () => {
      expect(testPage.getAttribute('tonal-btn', 'data-sm-variant')).toBe('tonal');
    });

    test('should set data-sm-variant attribute to outlined', () => {
      expect(testPage.getAttribute('outlined-btn', 'data-sm-variant')).toBe('outlined');
    });

    test('should set data-sm-variant attribute to text', () => {
      expect(testPage.getAttribute('text-btn', 'data-sm-variant')).toBe('text');
    });
  });

  describe('Host Attributes - Size', () => {
    test('should set data-sm-size attribute to xsmall', () => {
      expect(testPage.getAttribute('xsmall-btn', 'data-sm-size')).toBe('xsmall');
    });

    test('should set data-sm-size attribute to small', () => {
      expect(testPage.getAttribute('small-btn', 'data-sm-size')).toBe('small');
    });

    test('should set data-sm-size attribute to medium', () => {
      expect(testPage.getAttribute('medium-btn', 'data-sm-size')).toBe('medium');
    });

    test('should set data-sm-size attribute to large', () => {
      expect(testPage.getAttribute('large-btn', 'data-sm-size')).toBe('large');
    });

    test('should set data-sm-size attribute to xlarge', () => {
      expect(testPage.getAttribute('xlarge-btn', 'data-sm-size')).toBe('xlarge');
    });

    test('should default to small size', () => {
      expect(testPage.getAttribute('default-btn', 'data-sm-size')).toBe('small');
    });
  });

  describe('Host Attributes - Shape', () => {
    test('should set data-sm-shape attribute to round when specified', () => {
      expect(testPage.getAttribute('round-btn', 'data-sm-shape')).toBe('round');
    });

    test('should set data-sm-shape attribute to square when specified', () => {
      expect(testPage.getAttribute('square-btn', 'data-sm-shape')).toBe('square');
    });

    test('should set data-sm-shape attribute to round (default) when not specified', () => {
      expect(testPage.getAttribute('default-btn', 'data-sm-shape')).toBe('round');
    });
  });

  describe('Host Attributes - Toggle State', () => {
    test('should set data-sm-toggle attribute to true for togglable button', () => {
      expect(testPage.getAttribute('togglable-btn', 'data-sm-toggle')).toBe('true');
    });

    test('should set data-sm-toggle attribute to false for non-togglable button', () => {
      expect(testPage.getAttribute('default-btn', 'data-sm-toggle')).toBe('false');
    });
  });

  describe('Host Attributes - Selected State', () => {
    test('should set data-sm-selected attribute to true when selected', () => {
      expect(testPage.getAttribute('togglable-selected-btn', 'data-sm-selected')).toBe('true');
    });

    test('should set data-sm-selected attribute to false when not selected', () => {
      expect(testPage.getAttribute('togglable-btn', 'data-sm-selected')).toBe('false');
    });
  });

  describe('Host Attributes - ARIA Pressed', () => {
    test('should set aria-pressed attribute on togglable button when selected', () => {
      expect(testPage.getAttribute('togglable-selected-btn', 'aria-pressed')).toBe('true');
    });

    test('should set aria-pressed attribute on togglable button when not selected', () => {
      expect(testPage.getAttribute('togglable-btn', 'aria-pressed')).toBe('false');
    });

    test('should not set aria-pressed attribute on non-togglable button', () => {
      expect(testPage.hasAttribute('default-btn', 'aria-pressed')).toBe(false);
    });
  });

  describe('Host Attributes - Disabled Button', () => {
    test('should set disabled attribute on native button when disabled', () => {
      expect(testPage.hasAttribute('disabled-btn', 'disabled')).toBe(true);
    });

    test('should not set disabled attribute on native button when enabled', () => {
      expect(testPage.hasAttribute('default-btn', 'disabled')).toBe(false);
    });
  });

  describe('Host Attributes - Disabled Anchor', () => {
    test('should set aria-disabled attribute on anchor when disabled', async () => {
      testComponent.anchorDisabledSignal.set(true);
      await fixture.whenStable();

      expect(testPage.getAttribute('anchor-btn', 'aria-disabled')).toBe('true');
    });

    test('should not set aria-disabled attribute on anchor when enabled', async () => {
      testComponent.anchorDisabledSignal.set(false);
      await fixture.whenStable();

      expect(testPage.hasAttribute('anchor-btn', 'aria-disabled')).toBe(false);
    });

    test('should set tabindex to -1 on anchor when disabled', async () => {
      testComponent.anchorDisabledSignal.set(true);
      await fixture.whenStable();

      expect(testPage.getAttribute('anchor-btn', 'tabindex')).toBe('-1');
    });

    test('should set tabindex to 0 on anchor when enabled', () => {
      expect(testPage.getAttribute('anchor-btn', 'tabindex')).toBe('0');
    });
  });

  describe('Reactive Updates - Variant', () => {
    test('should update data-sm-variant attribute when variant input changes', async () => {
      expect(testPage.getAttribute('dynamic-btn', 'data-sm-variant')).toBe('filled');

      testComponent.dynamicVariant.set('elevated');
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-btn', 'data-sm-variant')).toBe('elevated');
    });

    test('should update baseConfig.buttonVariant signal when variant input changes', async () => {
      const component = testPage.getComponent('dynamic-btn');
      expect(component?.baseConfig.buttonVariant()).toBe('filled');

      testComponent.dynamicVariant.set('tonal');
      await fixture.whenStable();

      expect(component?.baseConfig.buttonVariant()).toBe('tonal');
    });
  });

  describe('Reactive Updates - Size', () => {
    test('should update data-sm-size attribute when size input changes', async () => {
      expect(testPage.getAttribute('dynamic-btn', 'data-sm-size')).toBe('small');

      testComponent.dynamicSize.set('large');
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-btn', 'data-sm-size')).toBe('large');
    });

    test('should update baseConfig.buttonSize signal when size input changes', async () => {
      const component = testPage.getComponent('dynamic-btn');
      expect(component?.baseConfig.buttonSize()).toBe('small');

      testComponent.dynamicSize.set('xlarge');
      await fixture.whenStable();

      expect(component?.baseConfig.buttonSize()).toBe('xlarge');
    });
  });

  describe('Reactive Updates - Shape', () => {
    test('should update data-sm-shape attribute when shape input changes', async () => {
      expect(testPage.getAttribute('dynamic-btn', 'data-sm-shape')).toBe('round');

      testComponent.dynamicShape.set('square');
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-btn', 'data-sm-shape')).toBe('square');
    });

    test('should update baseConfig.buttonShape signal when shape input changes', async () => {
      const component = testPage.getComponent('dynamic-btn');
      expect(component?.baseConfig.buttonShape()).toBeUndefined();

      testComponent.dynamicShape.set('round');
      await fixture.whenStable();

      expect(component?.baseConfig.buttonShape()).toBe('round');
    });
  });

  describe('Reactive Updates - Disabled', () => {
    test('should update disabled attribute when disabled input changes', async () => {
      expect(testPage.hasAttribute('dynamic-btn', 'disabled')).toBe(false);

      testComponent.dynamicDisabled.set(true);
      await fixture.whenStable();

      expect(testPage.hasAttribute('dynamic-btn', 'disabled')).toBe(true);
    });

    test('should update baseConfig.buttonDisabled signal when disabled input changes', async () => {
      const component = testPage.getComponent('dynamic-btn');
      expect(component?.baseConfig.buttonDisabled()).toBe(false);

      testComponent.dynamicDisabled.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonDisabled()).toBe(true);
    });

    test('should handle transition from undefined to true', async () => {
      const component = testPage.getComponent('dynamic-btn');
      testComponent.dynamicDisabled.set(undefined);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonDisabled()).toBeUndefined();

      testComponent.dynamicDisabled.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonDisabled()).toBe(true);
    });
  });

  describe('Reactive Updates - Soft Disabled', () => {
    test('should update baseConfig.buttonSoftDisabled signal when softDisabled input changes', async () => {
      const component = testPage.getComponent('dynamic-btn');
      expect(component?.baseConfig.buttonSoftDisabled()).toBeUndefined();

      testComponent.dynamicSoftDisabled.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonSoftDisabled()).toBe(true);
    });

    test('should handle transition from undefined to true', async () => {
      const component = testPage.getComponent('dynamic-btn');
      testComponent.dynamicSoftDisabled.set(undefined);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonSoftDisabled()).toBeUndefined();

      testComponent.dynamicSoftDisabled.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonSoftDisabled()).toBe(true);
    });

    test('should handle transition from true to false', async () => {
      const component = testPage.getComponent('dynamic-btn');
      testComponent.dynamicSoftDisabled.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonSoftDisabled()).toBe(true);

      testComponent.dynamicSoftDisabled.set(false);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonSoftDisabled()).toBe(false);
    });
  });

  describe('Reactive Updates - Readonly', () => {
    test('should update baseConfig.buttonReadonly signal when readonly input changes', async () => {
      const component = testPage.getComponent('dynamic-btn');
      expect(component?.baseConfig.buttonReadonly()).toBeUndefined();

      testComponent.dynamicReadonly.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonReadonly()).toBe(true);
    });

    test('should handle transition from undefined to true', async () => {
      const component = testPage.getComponent('dynamic-btn');
      testComponent.dynamicReadonly.set(undefined);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonReadonly()).toBeUndefined();

      testComponent.dynamicReadonly.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonReadonly()).toBe(true);
    });

    test('should handle transition from true to false', async () => {
      const component = testPage.getComponent('dynamic-btn');
      testComponent.dynamicReadonly.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonReadonly()).toBe(true);

      testComponent.dynamicReadonly.set(false);
      await fixture.whenStable();

      expect(component?.baseConfig.buttonReadonly()).toBe(false);
    });
  });

  describe('Reactive Updates - Togglable', () => {
    test('should update data-sm-toggle attribute when togglable input changes', async () => {
      expect(testPage.getAttribute('dynamic-btn', 'data-sm-toggle')).toBe('false');

      testComponent.dynamicTogglable.set(true);
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-btn', 'data-sm-toggle')).toBe('true');
    });

    test('should update baseConfig.togglable signal when togglable input changes', async () => {
      const component = testPage.getComponent('dynamic-btn');
      expect(component?.baseConfig.togglable()).toBe(false);

      testComponent.dynamicTogglable.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.togglable()).toBe(true);
    });

    test('should add aria-pressed attribute when button becomes togglable', async () => {
      expect(testPage.hasAttribute('dynamic-btn', 'aria-pressed')).toBe(false);

      testComponent.dynamicTogglable.set(true);
      await fixture.whenStable();

      expect(testPage.hasAttribute('dynamic-btn', 'aria-pressed')).toBe(true);
    });
  });

  describe('Reactive Updates - Selected (via linkedSignal)', () => {
    test('should update data-sm-selected attribute when selected input changes', async () => {
      testComponent.dynamicTogglable.set(true);
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-btn', 'data-sm-selected')).toBe('false');

      testComponent.dynamicSelected.set(true);
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-btn', 'data-sm-selected')).toBe('true');
    });

    test('should update baseConfig.isSelected via linkedSignal when selected input changes', async () => {
      const component = testPage.getComponent('dynamic-btn');
      testComponent.dynamicTogglable.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.isSelected()).toBe(false);

      testComponent.dynamicSelected.set(true);
      await fixture.whenStable();

      expect(component?.baseConfig.isSelected()).toBe(true);
    });

    test('should update aria-pressed attribute when selected input changes', async () => {
      testComponent.dynamicTogglable.set(true);
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-btn', 'aria-pressed')).toBe('false');

      testComponent.dynamicSelected.set(true);
      await fixture.whenStable();

      expect(testPage.getAttribute('dynamic-btn', 'aria-pressed')).toBe('true');
    });
  });
});

