import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { page } from 'vitest/browser';
import { ButtonBase } from './button-base';
import { BUTTON_BASE_CONFIG, BaseConfig } from './button-base.token';
import { ButtonShapeMorph } from '../button-shape-morph/button-shape-morph';
import { ShapeMorph } from '../../../../../services/shape-morph';
import { loadButtonShapeMorphTestCssVars } from '../button-shape-morph/button-shape-morph-test-helpers';
import { ButtonShapeMorphPage } from '../button-shape-morph/button-shape-morph.spec';
import {SimplyMatButtonGroupBase} from '../../button-group/button-group-base';
import {BUTTON_GROUP_BASE_CONFIG, BaseConfig as GroupBaseConfig} from '../../button-group/button-group-base.token';

let globalButtonGroupConfig: (GroupBaseConfig & {
  groupDisabled: WritableSignal<boolean>;
  groupSoftDisabled: WritableSignal<boolean>;
  groupReadonly: WritableSignal<boolean>;
}) | null = null;

@Component({
  selector: 'test-button-group',
  template: '<ng-content/>',
  imports: [],
  providers: [
    {
      provide: SimplyMatButtonGroupBase,
      useExisting: TestButtonGroup
    },
    {
      provide: BUTTON_GROUP_BASE_CONFIG,
      useFactory: () => ({
        baseConfig: globalButtonGroupConfig!,
      }),
    },
  ],
  host: {
    '[attr.data-sm-size]': 'size()',
    '[attr.data-sm-type]': 'type()',
  },
})
class TestButtonGroup extends SimplyMatButtonGroupBase {
  constructor() {
    super();
  }
}

let globalBaseConfig: (BaseConfig<string> & {
  buttonVariant: WritableSignal<string>;
  buttonSize: WritableSignal<string | undefined>;
  buttonShape: WritableSignal<string | undefined>;
  buttonDisabled: WritableSignal<boolean | undefined>;
  buttonSoftDisabled: WritableSignal<boolean | undefined>;
  buttonReadonly: WritableSignal<boolean | undefined>;
  togglable: WritableSignal<boolean>;
  isSelected: WritableSignal<boolean>;
}) | null = null;

@Component({
  template: `
    <button
      data-testid="standalone-btn"
      simplyMatButtonBase
      class="simply-mat-button">
      Standalone
    </button>

    <a
      data-testid="anchor-btn"
      simplyMatButtonBase
      class="simply-mat-button">
      Anchor
    </a>

    <button
      data-testid="togglable-btn"
      simplyMatButtonBase
      class="simply-mat-button">
      Togglable
    </button>

    <button
      data-testid="disabled-btn"
      simplyMatButtonBase
      class="simply-mat-button">
      Disabled
    </button>

    <test-button-group data-testid="button-group">
      <button
        data-testid="group-btn1"
        simplyMatButtonBase
        class="simply-mat-button">
        Group Button 1
      </button>
      <button
        data-testid="group-btn2"
        simplyMatButtonBase
        class="simply-mat-button">
        Group Button 2
      </button>
    </test-button-group>

    <test-button-group data-testid="connected-group" [type]="'connected'">
      <button
        data-testid="connected-btn1"
        simplyMatButtonBase
        class="simply-mat-button">
        Connected Button 1
      </button>
      <button
        data-testid="connected-btn2"
        simplyMatButtonBase
        class="simply-mat-button">
        Connected Button 2
      </button>
    </test-button-group>
  `,
  imports: [ButtonBase, TestButtonGroup],
  viewProviders: [
    {
      provide: BUTTON_BASE_CONFIG,
      useFactory: () => ({
        baseConfig: globalBaseConfig!,
      }),
    },
  ],
})
class ButtonBaseTestComponent {}

class ButtonBasePage {
  private shapeMorphPage: ButtonShapeMorphPage;

  constructor(private fixture: ComponentFixture<ButtonBaseTestComponent>) {
    this.shapeMorphPage = new ButtonShapeMorphPage(fixture as any);
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

  getShapeMorphDirective(testId: string): ButtonShapeMorph | null {
    return this.shapeMorphPage.getDirective(testId);
  }

  getElement(testId: string): HTMLElement | null {
    return page.getByTestId(testId).query() as HTMLElement | null;
  }

  async click(testId: string): Promise<void> {
    const element = this.getElement(testId);
    if (!element) return;
    element.click();
    await this.fixture.whenStable();
  }

  async triggerPointerDown(testId: string, button: number = 0, pointerId: number = 1): Promise<void> {
    const element = this.getElement(testId);
    if (!element) return;

    const event = new PointerEvent('pointerdown', {
      button,
      pointerId,
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
    await this.fixture.whenStable();
  }

  async triggerPointerUp(testId: string, inside: boolean = true, pointerId: number = 1): Promise<void> {
    const element = this.getElement(testId);
    if (!element) return;

    const target = inside ? element : document.body;
    const event = new PointerEvent('pointerup', {
      pointerId,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'target', { value: target, writable: false });
    window.dispatchEvent(event);
    await this.fixture.whenStable();
  }

  async triggerKeyDown(testId: string, key: string, repeat: boolean = false): Promise<void> {
    const element = this.getElement(testId);
    if (!element) return;

    const event = new KeyboardEvent('keydown', {
      key,
      repeat,
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
    await this.fixture.whenStable();
  }

  async triggerKeyUp(testId: string, key: string): Promise<void> {
    const element = this.getElement(testId);
    if (!element) return;

    const event = new KeyboardEvent('keyup', {
      key,
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
    await this.fixture.whenStable();
  }

  setCSSVar(testId: string, varName: string, value: string): void {
    const element = this.getElement(testId);
    if (element) {
      element.style.setProperty(varName, value);
    }
  }

  getWidth(testId: string): number {
    const element = this.getElement(testId);
    if (!element) return 0;
    return element.getBoundingClientRect().width;
  }

  setAnimationCssVars(buttonTestId: string) {
    this.setCSSVar(buttonTestId, '--md-comp-button-small-shape-round', `${this.buttonSmallRoundBorderRadius}px`);
    this.setCSSVar(buttonTestId, '--md-comp-button-small-shape-pressed-morph', `${this.buttonSmallPressedBorderRadius}px`);
    this.setCSSVar(buttonTestId, '--md-comp-button-small-selected-container-shape-round', `${this.buttonSmallSelectedBorderRadius}px`);
    this.setCSSVar(buttonTestId, '--md-comp-button-small-shape-spring-animation-damping', '0.5');
    this.setCSSVar(buttonTestId, '--md-comp-button-small-shape-spring-animation-stiffness', '100');
    this.setCSSVar(buttonTestId, '--sm-comp-button-connected-small-shape-round', `${this.buttonConnectedSmallBorderRadius}px`);
    this.setCSSVar(buttonTestId, '--sm-comp-button-connected-small-selected-container-shape-round', `${this.buttonConnectedSmallSelectedBorderRadius}px`);
  }

  extractPixelNumber(value: string): number {
    return Number.parseFloat(value.replace('px', ''));
  }

  // Make sure these numbers stay different
  public buttonSmallRoundBorderRadius = 8
  public buttonSmallPressedBorderRadius = 16
  public buttonSmallSelectedBorderRadius = 12
  public buttonConnectedSmallBorderRadius = 10
  public buttonConnectedSmallSelectedBorderRadius = 14
}

describe('ButtonBase', () => {
  let fixture: ComponentFixture<ButtonBaseTestComponent>;
  let testPage: ButtonBasePage;

  function createBaseConfig(overrides: Partial<{
    buttonShapeMorphRole: 'button' | 'icon';
    buttonVariant: string;
    buttonSize: string | undefined;
    buttonShape: string | undefined;
    defaultButtonShape: string;
    buttonDisabled: boolean | undefined;
    buttonSoftDisabled: boolean | undefined;
    buttonReadonly: boolean | undefined;
    togglable: boolean;
    isSelected: boolean;
  }> = {}): BaseConfig<string> & {
    buttonVariant: WritableSignal<string>;
    buttonSize: WritableSignal<string | undefined>;
    buttonShape: WritableSignal<string | undefined>;
    buttonDisabled: WritableSignal<boolean | undefined>;
    buttonSoftDisabled: WritableSignal<boolean | undefined>;
    buttonReadonly: WritableSignal<boolean | undefined>;
    togglable: WritableSignal<boolean>;
    isSelected: WritableSignal<boolean>;
  } {
    return {
      buttonShapeMorphRole: overrides.buttonShapeMorphRole ?? 'button',
      buttonVariant: signal(overrides.buttonVariant ?? 'filled'),
      buttonSize: signal(overrides.buttonSize ?? undefined),
      buttonShape: signal(overrides.buttonShape ?? undefined),
      defaultButtonShape: overrides.defaultButtonShape ?? 'round',
      buttonDisabled: signal(overrides.buttonDisabled ?? undefined),
      buttonSoftDisabled: signal(overrides.buttonSoftDisabled ?? undefined),
      buttonReadonly: signal(overrides.buttonReadonly ?? undefined),
      togglable: signal(overrides.togglable ?? false),
      isSelected: signal(overrides.isSelected ?? false),
    };
  }

  function createButtonGroupConfig(overrides: Partial<{
    groupDisabled: boolean;
    groupSoftDisabled: boolean;
    groupReadonly: boolean;
  }> = {}): GroupBaseConfig & {
    groupDisabled: WritableSignal<boolean>;
    groupSoftDisabled: WritableSignal<boolean>;
    groupReadonly: WritableSignal<boolean>;
  } {
    return {
      groupDisabled: signal(overrides.groupDisabled ?? false),
      groupSoftDisabled: signal(overrides.groupSoftDisabled ?? false),
      groupReadonly: signal(overrides.groupReadonly ?? false),
    };
  }

  beforeEach(async () => {
    loadButtonShapeMorphTestCssVars();

    globalBaseConfig = createBaseConfig();
    globalButtonGroupConfig = createButtonGroupConfig();

    TestBed.configureTestingModule({
      imports: [ButtonBaseTestComponent, ButtonBase, TestButtonGroup],
      providers: [
        ShapeMorph,
      ],
    });

    fixture = TestBed.createComponent(ButtonBaseTestComponent);
    testPage = new ButtonBasePage(fixture);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    globalBaseConfig = null;
    globalButtonGroupConfig = null;
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Directive Initialization', () => {
    test('should create directive on button with simplyMatButtonBase attribute', () => {
      const directive = testPage.getDirective('standalone-btn');
      expect(directive).toBeTruthy();
      expect(directive).toBeInstanceOf(ButtonBase);
    });

    test('should create directive on anchor with simplyMatButtonBase attribute', () => {
      const directive = testPage.getDirective('anchor-btn');
      expect(directive).toBeTruthy();
      expect(directive).toBeInstanceOf(ButtonBase);
    });

    test('should have ButtonShapeMorph host directive', () => {
      const shapeMorph = testPage.getShapeMorphDirective('standalone-btn');
      expect(shapeMorph).toBeTruthy();
      expect(shapeMorph).toBeInstanceOf(ButtonShapeMorph);
    });
  });

  describe('Computed Properties - Effective Button Size', () => {
    test('should return user-supplied buttonSize when present', () => {
      globalBaseConfig!.buttonSize.set('large');
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonSize()).toBe('large');
    });

    test('should fall back to buttonGroup size when buttonSize is undefined', () => {
      globalBaseConfig!.buttonSize.set(undefined);
      const directive = testPage.getDirective('group-btn1');
      expect(directive!.effectiveButtonSize()).toBe('small');
    });

    test('should fall back to "small" when both buttonSize and buttonGroup are undefined', () => {
      globalBaseConfig!.buttonSize.set(undefined);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonSize()).toBe('small');
    });

    test('should update reactively when config changes', async () => {
      globalBaseConfig!.buttonSize.set('small');
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonSize()).toBe('small');

      globalBaseConfig!.buttonSize.set('xlarge');
      await fixture.whenStable();
      expect(directive!.effectiveButtonSize()).toBe('xlarge');
    });

    test('should prefer user-supplied size over button group size', () => {
      globalBaseConfig!.buttonSize.set('xlarge');
      const directive = testPage.getDirective('group-btn1');
      expect(directive!.effectiveButtonSize()).toBe('xlarge');
    });
  });

  describe('Computed Properties - Effective Button Shape', () => {
    test('should return user-supplied buttonShape when present', () => {
      globalBaseConfig!.buttonShape.set('square');
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonShape()).toBe('square');
    });

    test('should fall back to buttonGroup defaultButtonShape when buttonShape is undefined', () => {
      globalBaseConfig!.buttonShape.set(undefined);
      const directive = testPage.getDirective('group-btn1');
      expect(directive!.effectiveButtonShape()).toBe('round');
    });

    test('should fall back to "round" when both buttonShape and buttonGroup are undefined', () => {
      globalBaseConfig!.buttonShape.set(undefined);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonShape()).toBe('round');
    });

    test('should update reactively when config changes', async () => {
      globalBaseConfig!.buttonShape.set('round');
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonShape()).toBe('round');

      globalBaseConfig!.buttonShape.set('square');
      await fixture.whenStable();
      expect(directive!.effectiveButtonShape()).toBe('square');
    });

    test('should prefer user-supplied shape over button group shape', () => {
      globalBaseConfig!.buttonShape.set('square');
      const directive = testPage.getDirective('group-btn1');
      expect(directive!.effectiveButtonShape()).toBe('square');
    });
  });

  describe('Computed Properties - Effective Button Disabled', () => {
    test('should return button disabled value when set', () => {
      globalBaseConfig!.buttonDisabled.set(true);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonDisabled()).toBe(true);
    });

    test('should fall back to button group disabled when button disabled is undefined', () => {
      globalBaseConfig!.buttonDisabled.set(undefined);
      globalButtonGroupConfig!.groupDisabled.set(true);
      const directive = testPage.getDirective('group-btn1');
      expect(directive!.effectiveButtonDisabled()).toBe(true);
    });

    test('should default to false when both button and button group disabled are undefined', () => {
      globalBaseConfig!.buttonDisabled.set(undefined);
      globalButtonGroupConfig!.groupDisabled.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonDisabled()).toBe(false);
    });

    test('should prefer button disabled value over button group disabled value', () => {
      globalBaseConfig!.buttonDisabled.set(false);
      globalButtonGroupConfig!.groupDisabled.set(true);
      const directive = testPage.getDirective('group-btn1');
      expect(directive!.effectiveButtonDisabled()).toBe(false);
    });

    test('should update reactively when config changes', async () => {
      globalBaseConfig!.buttonDisabled.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonDisabled()).toBe(false);

      globalBaseConfig!.buttonDisabled.set(true);
      await fixture.whenStable();
      expect(directive!.effectiveButtonDisabled()).toBe(true);
    });
  });

  describe('Computed Properties - Effective Button Soft Disabled', () => {
    test('should return button soft disabled value when set', () => {
      globalBaseConfig!.buttonSoftDisabled.set(true);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonSoftDisabled()).toBe(true);
    });

    test('should fall back to button group soft disabled when button soft disabled is undefined', () => {
      globalBaseConfig!.buttonSoftDisabled.set(undefined);
      globalButtonGroupConfig!.groupSoftDisabled.set(true);
      const directive = testPage.getDirective('group-btn1');
      expect(directive!.effectiveButtonSoftDisabled()).toBe(true);
    });

    test('should default to false when both button and button group soft disabled are undefined', () => {
      globalBaseConfig!.buttonSoftDisabled.set(undefined);
      globalButtonGroupConfig!.groupSoftDisabled.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonSoftDisabled()).toBe(false);
    });

    test('should prefer button soft disabled value over button group soft disabled value', () => {
      globalBaseConfig!.buttonSoftDisabled.set(false);
      globalButtonGroupConfig!.groupSoftDisabled.set(true);
      const directive = testPage.getDirective('group-btn1');
      expect(directive!.effectiveButtonSoftDisabled()).toBe(false);
    });

    test('should update reactively when config changes', async () => {
      globalBaseConfig!.buttonSoftDisabled.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonSoftDisabled()).toBe(false);

      globalBaseConfig!.buttonSoftDisabled.set(true);
      await fixture.whenStable();
      expect(directive!.effectiveButtonSoftDisabled()).toBe(true);
    });
  });

  describe('Computed Properties - Effective Button Readonly', () => {
    test('should return button readonly value when set', () => {
      globalBaseConfig!.buttonReadonly.set(true);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonReadonly()).toBe(true);
    });

    test('should fall back to button group readonly when button readonly is undefined', () => {
      globalBaseConfig!.buttonReadonly.set(undefined);
      globalButtonGroupConfig!.groupReadonly.set(true);
      const directive = testPage.getDirective('group-btn1');
      expect(directive!.effectiveButtonReadonly()).toBe(true);
    });

    test('should default to false when both button and button group readonly are undefined', () => {
      globalBaseConfig!.buttonReadonly.set(undefined);
      globalButtonGroupConfig!.groupReadonly.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonReadonly()).toBe(false);
    });

    test('should prefer button readonly value over button group readonly value', () => {
      globalBaseConfig!.buttonReadonly.set(false);
      globalButtonGroupConfig!.groupReadonly.set(true);
      const directive = testPage.getDirective('group-btn1');
      expect(directive!.effectiveButtonReadonly()).toBe(false);
    });

    test('should update reactively when config changes', async () => {
      globalBaseConfig!.buttonReadonly.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.effectiveButtonReadonly()).toBe(false);

      globalBaseConfig!.buttonReadonly.set(true);
      await fixture.whenStable();
      expect(directive!.effectiveButtonReadonly()).toBe(true);
    });
  });

  describe('State Getters - isHardDisabled', () => {
    test('should return false when not disabled', () => {
      globalBaseConfig!.buttonDisabled.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isHardDisabled).toBe(false);
    });

    test('should return true when disabled but not soft disabled', () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isHardDisabled).toBe(true);
    });

    test('should return false when disabled and soft disabled', () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(true);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isHardDisabled).toBe(false);
    });
  });

  describe('State Getters - isSoftDisabled', () => {
    test('should return false when not disabled', () => {
      globalBaseConfig!.buttonDisabled.set(false);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isSoftDisabled).toBe(false);
    });

    test('should return false when disabled but not soft disabled', () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isSoftDisabled).toBe(false);
    });

    test('should return true when disabled and soft disabled', () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(true);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isSoftDisabled).toBe(true);
    });
  });

  describe('State Getters - isDisabledLike', () => {
    test('should return false when neither hard nor soft disabled', () => {
      globalBaseConfig!.buttonDisabled.set(false);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isDisabledLike).toBe(false);
    });

    test('should return true when hard disabled', () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isDisabledLike).toBe(true);
    });

    test('should return true when soft disabled', () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(true);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isDisabledLike).toBe(true);
    });

    test('should return true when both hard and soft disabled', () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(true);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isDisabledLike).toBe(true);
    });
  });

  describe('State Getters - isStateChangeBlocked', () => {
    test('should return false when not disabled and not readonly', () => {
      globalBaseConfig!.buttonDisabled.set(false);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      globalBaseConfig!.buttonReadonly.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isStateChangeBlocked).toBe(false);
    });

    test('should return true when hard disabled', () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      globalBaseConfig!.buttonReadonly.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isStateChangeBlocked).toBe(true);
    });

    test('should return true when soft disabled', () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(true);
      globalBaseConfig!.buttonReadonly.set(false);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isStateChangeBlocked).toBe(true);
    });

    test('should return true when readonly', () => {
      globalBaseConfig!.buttonDisabled.set(false);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      globalBaseConfig!.buttonReadonly.set(true);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isStateChangeBlocked).toBe(true);
    });

    test('should return true when both disabled and readonly', () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      globalBaseConfig!.buttonReadonly.set(true);
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isStateChangeBlocked).toBe(true);
    });
  });

  describe('Attribute Updates', () => {
    test('should set aria-disabled to "true" when hard disabled', async () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element!.getAttribute('aria-disabled')).toBe('true');
    });

    test('should set aria-disabled to "true" when soft disabled', async () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(true);
      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element!.getAttribute('aria-disabled')).toBe('true');
    });

    test('should not set aria-disabled when not disabled', async () => {
      globalBaseConfig!.buttonDisabled.set(false);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element!.hasAttribute('aria-disabled')).toBe(false);
    });

    test('should set aria-readonly to "true" when readonly', async () => {
      globalBaseConfig!.buttonReadonly.set(true);
      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element!.getAttribute('aria-readonly')).toBe('true');
    });

    test('should not set aria-readonly when not readonly', async () => {
      globalBaseConfig!.buttonReadonly.set(false);
      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element!.hasAttribute('aria-readonly')).toBe(false);
    });

    test('should set data-sm-disabled-hard when hard disabled', async () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element!.hasAttribute('data-sm-disabled-hard')).toBe(true);
    });

    test('should not set data-sm-disabled-hard when soft disabled', async () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(true);
      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element!.hasAttribute('data-sm-disabled-hard')).toBe(false);
    });

    test('should set data-sm-disabled-soft when soft disabled', async () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(true);
      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element!.hasAttribute('data-sm-disabled-soft')).toBe(true);
    });

    test('should not set data-sm-disabled-soft when hard disabled', async () => {
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element!.hasAttribute('data-sm-disabled-soft')).toBe(false);
    });

    test('should set data-sm-readonly when readonly', async () => {
      globalBaseConfig!.buttonReadonly.set(true);
      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element!.hasAttribute('data-sm-readonly')).toBe(true);
    });

    test('should not set data-sm-readonly when not readonly', async () => {
      globalBaseConfig!.buttonReadonly.set(false);
      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element!.hasAttribute('data-sm-readonly')).toBe(false);
    });
  });

  describe('Event Handlers - Pointer Events', () => {
    beforeEach(() => testPage.setAnimationCssVars('standalone-btn'));

    test('should call animatePointerDown when pointer down is triggered', async () => {
      const startingBorderRadius = testPage.buttonSmallRoundBorderRadius;

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });

      await testPage.triggerPointerDown('standalone-btn');

      // Should queue up this animation instead of playing it right away, otherwise the next assertion will fail
      await testPage.triggerPointerUp('standalone-btn', false);

      await expect.poll(() => testPage.getElement('standalone-btn')).toSatisfy((element: HTMLElement) => {
        const currentBorderRadius = testPage.extractPixelNumber(getComputedStyle(element).borderTopLeftRadius);
        return currentBorderRadius > startingBorderRadius;
      });

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });
    });

    test('should not trigger animation when disabled', async () => {
      const startingBorderRadius = testPage.buttonSmallRoundBorderRadius;

      globalBaseConfig!.buttonDisabled.set(true);
      await fixture.whenStable();

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });

      await testPage.triggerPointerDown('standalone-btn');
      await fixture.whenStable();

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });
    });
  });

  describe('Event Handlers - Keyboard Events', () => {
    beforeEach(() => testPage.setAnimationCssVars('standalone-btn'));

    test('should increase border radius when Enter key is pressed', async () => {
      const startingBorderRadius = testPage.buttonSmallRoundBorderRadius;

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });

      await testPage.triggerKeyDown('standalone-btn', 'Enter');

      await expect.poll(() => testPage.getElement('standalone-btn')).toSatisfy((element: HTMLElement) => {
        const currentBorderRadius = testPage.extractPixelNumber(getComputedStyle(element).borderTopLeftRadius);
        return currentBorderRadius > startingBorderRadius;
      });
    });

    test('should increase border radius when Space key is pressed', async () => {
      const startingBorderRadius = testPage.buttonSmallRoundBorderRadius;

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });

      await testPage.triggerKeyDown('standalone-btn', ' ');

      await expect.poll(() => testPage.getElement('standalone-btn')).toSatisfy((element: HTMLElement) => {
        const currentBorderRadius = testPage.extractPixelNumber(getComputedStyle(element).borderTopLeftRadius);
        return currentBorderRadius > startingBorderRadius;
      });
    });

    test('should not change border radius when disabled (Enter)', async () => {
      const startingBorderRadius = testPage.buttonSmallRoundBorderRadius;

      globalBaseConfig!.buttonDisabled.set(true);
      await fixture.whenStable();

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });

      await testPage.triggerKeyDown('standalone-btn', 'Enter');
      await fixture.whenStable();

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });
    });

    test('should not change border radius when disabled (Space)', async () => {
      const startingBorderRadius = testPage.buttonSmallRoundBorderRadius;

      globalBaseConfig!.buttonDisabled.set(true);
      await fixture.whenStable();

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });

      await testPage.triggerKeyDown('standalone-btn', ' ');
      await fixture.whenStable();

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });
    });

    test('should trigger click on Space keyup for anchor', async () => {
      const element = testPage.getElement('anchor-btn');
      const clickSpy = vi.fn();
      element!.addEventListener('click', clickSpy);

      await testPage.triggerKeyUp('anchor-btn', ' ');

      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('Event Handlers - Click Events', () => {
    beforeEach(() => {
      testPage.setAnimationCssVars('standalone-btn');
      testPage.setAnimationCssVars('togglable-btn');
    });

    test('should animate to resting state when clicked', async () => {
      const startingBorderRadius = testPage.buttonSmallRoundBorderRadius;

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });

      await testPage.click('standalone-btn');

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });
    });

    test('should not change border radius when clicked while disabled', async () => {
      const startingBorderRadius = testPage.buttonSmallRoundBorderRadius;

      globalBaseConfig!.buttonDisabled.set(true);
      await fixture.whenStable();

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });

      await testPage.click('standalone-btn');
      await fixture.whenStable();

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });
    });

    test('should toggle isSelected for non-selection-controlled togglable button', async () => {
      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(false);
      await fixture.whenStable();

      const directive = testPage.getDirective('togglable-btn');
      let emittedValue: boolean | undefined;
      directive!.selectedChange.subscribe(value => {
        emittedValue = value;
      });

      await testPage.click('togglable-btn');

      expect(globalBaseConfig!.isSelected()).toBe(true);
      expect(emittedValue).toBe(true);

      await testPage.click('togglable-btn');

      expect(globalBaseConfig!.isSelected()).toBe(false);
      expect(emittedValue).toBe(false);
    });

    test('should not toggle isSelected for non-togglable button', async () => {
      globalBaseConfig!.togglable.set(false);
      globalBaseConfig!.isSelected.set(false);
      await fixture.whenStable();

      await testPage.click('standalone-btn');

      expect(globalBaseConfig!.isSelected()).toBe(false);
    });

    test('should not toggle isSelected when readonly', async () => {
      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(false);
      globalBaseConfig!.buttonReadonly.set(true);
      await fixture.whenStable();

      await testPage.click('togglable-btn');

      expect(globalBaseConfig!.isSelected()).toBe(false);
    });

    test('should not toggle isSelected when hard disabled', async () => {
      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(false);
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      await fixture.whenStable();

      await testPage.click('togglable-btn');

      expect(globalBaseConfig!.isSelected()).toBe(false);
    });

    test('should not toggle isSelected when soft disabled', async () => {
      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(false);
      globalBaseConfig!.buttonDisabled.set(true);
      globalBaseConfig!.buttonSoftDisabled.set(true);
      await fixture.whenStable();

      await testPage.click('togglable-btn');

      expect(globalBaseConfig!.isSelected()).toBe(false);
    });

    test('should toggle isSelected when not blocked', async () => {
      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(false);
      globalBaseConfig!.buttonDisabled.set(false);
      globalBaseConfig!.buttonSoftDisabled.set(false);
      globalBaseConfig!.buttonReadonly.set(false);
      await fixture.whenStable();

      await testPage.click('togglable-btn');

      expect(globalBaseConfig!.isSelected()).toBe(true);
    });
  });

  describe('Button vs Anchor Differences', () => {
    test('isNativeButton should return true for button element', () => {
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isNativeButton()).toBe(true);
    });

    test('isNativeButton should return false for anchor element', () => {
      const directive = testPage.getDirective('anchor-btn');
      expect(directive!.isNativeButton()).toBe(false);
    });

    test('isAnchor should return true for anchor element', () => {
      const directive = testPage.getDirective('anchor-btn');
      expect(directive!.isAnchor()).toBe(true);
    });

    test('isAnchor should return false for button element', () => {
      const directive = testPage.getDirective('standalone-btn');
      expect(directive!.isAnchor()).toBe(false);
    });

    test('disabled button should have disabled attribute', async () => {
      globalBaseConfig!.buttonDisabled.set(true);
      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element!.hasAttribute('disabled')).toBe(true);
    });

    test('disabled anchor should have aria-disabled attribute', async () => {
      globalBaseConfig!.buttonDisabled.set(true);
      await fixture.whenStable();

      const element = testPage.getElement('anchor-btn');
      expect(element!.getAttribute('aria-disabled')).toBe('true');
    });

    test('disabled anchor should have tabindex -1', async () => {
      globalBaseConfig!.buttonDisabled.set(true);
      await fixture.whenStable();

      const element = testPage.getElement('anchor-btn');
      expect(element!.getAttribute('tabindex')).toBe('-1');
    });

    test('enabled anchor should have tabindex 0', async () => {
      globalBaseConfig!.buttonDisabled.set(false);
      await fixture.whenStable();

      const element = testPage.getElement('anchor-btn');
      expect(element!.getAttribute('tabindex')).toBe('0');
    });

    test('enabled button should not have disabled attribute', async () => {
      globalBaseConfig!.buttonDisabled.set(false);
      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element!.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('Button Group Integration and Width Animations', () => {
    test('should inherit size from button group', () => {
      globalBaseConfig!.buttonSize.set(undefined);

      const directive = testPage.getDirective('group-btn1');
      expect(directive!.effectiveButtonSize()).toBe('small');
    });

    test('should inherit shape from button group', () => {
      globalBaseConfig!.buttonShape.set(undefined);

      const directive = testPage.getDirective('group-btn1');
      expect(directive!.effectiveButtonShape()).toBe('round');
    });

    test('morphConfig should include buttonGroupType', () => {
      const directive = testPage.getDirective('group-btn1');
      const morphConfig = directive!.morphConfig;

      expect(morphConfig.buttonGroupType).toBeDefined();
    });

    test('morphConfig should include disableWidthAnimations from button group', () => {
      const directive = testPage.getDirective('group-btn1');
      const morphConfig = directive!.morphConfig;

      expect(morphConfig.disableWidthAnimations).toBeDefined();
    });

    test('standalone button should have undefined buttonGroupType', () => {
      const directive = testPage.getDirective('standalone-btn');
      const morphConfig = directive!.morphConfig;

      expect(morphConfig.buttonGroupType).toBeUndefined();
    });

    test('should get width from button group when width animations are enabled', async () => {
      testPage.setAnimationCssVars('group-btn1');
      testPage.setCSSVar('group-btn1', '--sm-button-group-pressed-width-multiplier', '0.15');

      const initialWidth = testPage.getWidth('group-btn1');

      expect(initialWidth).toBeGreaterThan(0);
    });

    test('morphConfig should use effectiveButtonSize and effectiveButtonShape', () => {
      globalBaseConfig!.buttonSize.set('xlarge');
      globalBaseConfig!.buttonShape.set('square');

      const directive = testPage.getDirective('group-btn1');
      const morphConfig = directive!.morphConfig;

      expect(morphConfig.buttonSize()).toBe('xlarge');
      expect(morphConfig.buttonShape()).toBe('square');
    });
  });

  describe('Selection State - setSelected Method', () => {
    beforeEach(() => {
      testPage.setAnimationCssVars('togglable-btn');
      testPage.setCSSVar('togglable-btn', '--md-comp-button-small-selected-container-shape-round', '12px');
    });

    test('should be no-op when already at target state', async () => {
      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(false);

      const directive = testPage.getDirective('togglable-btn');

      directive!.setSelected(false);
      await fixture.whenStable();

      expect(globalBaseConfig!.isSelected()).toBe(false);
    });

    test('should update isSelected signal and emit selectedChange', async () => {
      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(false);

      const directive = testPage.getDirective('togglable-btn');
      let emittedValue: boolean | undefined;
      directive!.selectedChange.subscribe(value => {
        emittedValue = value;
      });

      directive!.setSelected(true);
      await fixture.whenStable();

      expect(globalBaseConfig!.isSelected()).toBe(true);
      expect(emittedValue).toBe(true);
    });

    test('should skip width animations when programmatically changed', async () => {
      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(false);
      testPage.setAnimationCssVars('togglable-btn');

      const directive = testPage.getDirective('togglable-btn');

      const initialWidth = testPage.getWidth('togglable-btn');

      directive!.setSelected(true);
      await fixture.whenStable();

      const finalWidth = testPage.getWidth('togglable-btn');
      expect(finalWidth).toBe(initialWidth);
    });

    test('should animate press then rest when programmatically changed', async () => {
      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(false);
      testPage.setAnimationCssVars('togglable-btn');

      const directive = testPage.getDirective('togglable-btn');
      const startingBorderRadius = testPage.buttonSmallRoundBorderRadius;

      await expect.element(page.getByTestId('togglable-btn')).toHaveStyle({
        borderTopLeftRadius: `${startingBorderRadius}px`,
      });

      directive!.setSelected(true);

      await expect.poll(() => testPage.getElement('togglable-btn')).toSatisfy((element: HTMLElement) => {
        const currentBorderRadius = testPage.extractPixelNumber(getComputedStyle(element).borderTopLeftRadius);
        return currentBorderRadius > startingBorderRadius;
      });

      await fixture.whenStable();
      await expect.poll(() => testPage.getElement('togglable-btn')).toSatisfy((element: HTMLElement) => {
        const currentBorderRadius = testPage.extractPixelNumber(getComputedStyle(element).borderTopLeftRadius);
        return currentBorderRadius >= startingBorderRadius;
      });
    });

    test('should set border radius to selected CSS var when toggled to selected', async () => {
      testPage.setAnimationCssVars('togglable-btn');

      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(false);
      await fixture.whenStable();

      const directive = testPage.getDirective('togglable-btn');

      directive!.setSelected(true);
      await fixture.whenStable();

      await expect.poll(() => testPage.getElement('togglable-btn'), { timeout: 2000 }).toSatisfy((element: HTMLElement) => {
        const currentBorderRadius = testPage.extractPixelNumber(getComputedStyle(element).borderTopLeftRadius);
        return Math.abs(currentBorderRadius - testPage.buttonSmallSelectedBorderRadius) < 1;
      });
    });

    test('should set border radius to resting CSS var when toggled to unselected', async () => {
      testPage.setAnimationCssVars('togglable-btn');

      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(true);
      await fixture.whenStable();

      const directive = testPage.getDirective('togglable-btn');

      directive!.setSelected(false);
      await fixture.whenStable();

      await expect.poll(() => testPage.getElement('togglable-btn'), { timeout: 2000 }).toSatisfy((element: HTMLElement) => {
        const currentBorderRadius = testPage.extractPixelNumber(getComputedStyle(element).borderTopLeftRadius);
        return Math.abs(currentBorderRadius - testPage.buttonSmallRoundBorderRadius) < 1;
      });
    });
  });

  describe('Toggle Button Border Radius - Standard Button Group', () => {
    test('should use standard group selected CSS var when toggled to selected', async () => {
      testPage.setAnimationCssVars('group-btn1');

      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(false);
      await fixture.whenStable();

      await page.getByTestId('group-btn1').click();
      await fixture.whenStable();

      await expect.poll(() => testPage.getElement('group-btn1'), { timeout: 2000 }).toSatisfy((element: HTMLElement) => {
        const currentBorderRadius = testPage.extractPixelNumber(getComputedStyle(element).borderTopLeftRadius);
        return Math.abs(currentBorderRadius - testPage.buttonSmallSelectedBorderRadius) < 1;
      });
    });

    test('should use standard group resting CSS var when toggled to unselected', async () => {
      testPage.setAnimationCssVars('group-btn1');

      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(true);
      await fixture.whenStable();

      await page.getByTestId('group-btn1').click();
      await fixture.whenStable();

      await expect.poll(() => testPage.getElement('group-btn1'), { timeout: 2000 }).toSatisfy((element: HTMLElement) => {
        const currentBorderRadius = testPage.extractPixelNumber(getComputedStyle(element).borderTopLeftRadius);
        return Math.abs(currentBorderRadius - testPage.buttonSmallRoundBorderRadius) < 1;
      });
    });
  });

  describe('Toggle Button Border Radius - Connected Button Group', () => {
    test('should use connected group selected CSS var when toggled to selected', async () => {
      testPage.setAnimationCssVars('connected-btn1');

      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(false);
      await fixture.whenStable();

      await page.getByTestId('connected-btn1').click();
      await fixture.whenStable();

      await expect.poll(() => testPage.getElement('connected-btn1'), { timeout: 2000 }).toSatisfy((element: HTMLElement) => {
        const currentBorderRadius = testPage.extractPixelNumber(getComputedStyle(element).borderTopLeftRadius);
        return Math.abs(currentBorderRadius - testPage.buttonConnectedSmallSelectedBorderRadius) < 1;
      });
    });

    test('should use connected group resting CSS var when toggled to unselected', async () => {
      testPage.setAnimationCssVars('connected-btn1');

      globalBaseConfig!.togglable.set(true);
      globalBaseConfig!.isSelected.set(true);
      await fixture.whenStable();

      await page.getByTestId('connected-btn1').click();
      await fixture.whenStable();

      await expect.poll(() => testPage.getElement('connected-btn1')).toSatisfy((element: HTMLElement) => {
        const currentBorderRadius = testPage.extractPixelNumber(getComputedStyle(element).borderTopLeftRadius);
        return Math.abs(currentBorderRadius - testPage.buttonConnectedSmallBorderRadius) < 1;
      });
    });
  });
});

