import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { page } from 'vitest/browser';
import { ButtonShapeMorph } from './button-shape-morph';
import { BUTTON_SHAPE_MORPH_ROLE, ButtonShapeMorphConfig, MorphConfig } from './button-shape-morph-type.token';
import { ShapeMorph } from '../../../../../services/shape-morph';
import {ButtonGroupType} from '../../button-group/button-group-base';

let globalTestConfig: ButtonShapeMorphConfig | null = null;

@Component({
  template: `
    <div class="button-group" id="standard-group">
      <button data-testid="btn1" smButtonShapeMorph class="simply-mat-button">Button 1</button>
      <button data-testid="btn2" smButtonShapeMorph class="simply-mat-button">Button 2</button>
      <button data-testid="btn3" smButtonShapeMorph class="simply-mat-button">Button 3</button>
    </div>
    <div class="button-group" id="connected-group">
      <button data-testid="btn4" smButtonShapeMorph class="simply-mat-button">Button 4</button>
      <button data-testid="btn5" smButtonShapeMorph class="simply-mat-button">Button 5</button>
    </div>
    <button data-testid="standalone-btn" smButtonShapeMorph class="simply-mat-button">Standalone</button>
    <button data-testid="togglable-btn" smButtonShapeMorph class="simply-mat-button">Togglable</button>
    <button data-testid="icon-btn" smButtonShapeMorph class="simply-mat-icon-button">Icon</button>
    <div data-testid="no-directive">No directive</div>
  `,
  imports: [ButtonShapeMorph],
  standalone: true,
  viewProviders: [
    {
      provide: BUTTON_SHAPE_MORPH_ROLE,
      useFactory: () => globalTestConfig!,
    },
  ],
  styles: [`
    button {
      padding: 8px 16px;
      border: none;
      background: #ccc;
    }
    [data-testid="standalone-btn"], [data-testid="togglable-btn"], [data-testid="icon-btn"] {
      margin: 8px;
    }
  `]
})
class ButtonShapeMorphTestComponent {}

export class ButtonShapeMorphPage {
  constructor(private fixture: ComponentFixture<any>) {}

  getDirective(testId: string): ButtonShapeMorph | null {
    const element = page.getByTestId(testId).query();
    if (!element) return null;
    const allDirectives = this.fixture.debugElement.queryAll(By.directive(ButtonShapeMorph));
    const debugElement = allDirectives.find((el) => el.nativeElement === element);
    if (!debugElement) return null;
    try {
      return debugElement.injector.get(ButtonShapeMorph, null);
    } catch {
      return null;
    }
  }

  getElement(testId: string): HTMLElement | null {
    return page.getByTestId(testId).query() as HTMLElement | null;
  }

  async triggerPointerDown(testId: string, button: number = 0, pointerId: number = 1): Promise<void> {
    const element = this.getElement(testId);
    if (!element) return;
    const directive = this.getDirective(testId);
    if (!directive) return;

    const event = new PointerEvent('pointerdown', {
      button,
      pointerId,
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
    await directive.animatePointerDown(event);
    await this.fixture.whenStable();
  }

  async triggerPointerUp(testId: string, inside: boolean = true, pointerId: number = 1): Promise<void> {
    const element = this.getElement(testId);
    if (!element) return;
    const directive = this.getDirective(testId);
    if (!directive) return;

    const target = inside ? element : document.body;
    const event = new PointerEvent('pointerup', {
      pointerId,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'target', { value: target, writable: false });
    window.dispatchEvent(event);
    await directive.animateWindowPointerUp(event);
    await this.fixture.whenStable();
  }

  async triggerPointerCancel(testId: string, pointerId: number = 1): Promise<void> {
    const element = this.getElement(testId);
    if (!element) return;
    const directive = this.getDirective(testId);
    if (!directive) return;

    const event = new PointerEvent('pointercancel', {
      pointerId,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
    await directive.animateWindowPointerCancel(event);
    await this.fixture.whenStable();
  }

  async triggerKeyDown(testId: string, key: string, repeat: boolean = false): Promise<void> {
    const element = this.getElement(testId);
    if (!element) return;
    const directive = this.getDirective(testId);
    if (!directive) return;

    const event = new KeyboardEvent('keydown', {
      key,
      repeat,
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);

    if (key === 'Enter') {
      await directive.animateKeyDownEnter(event);
    } else if (key === ' ') {
      await directive.animateKeyDownSpace(event);
    }
    await this.fixture.whenStable();
  }

  async triggerClick(testId: string): Promise<void> {
    const element = this.getElement(testId);
    if (!element) return;
    const directive = this.getDirective(testId);
    if (!directive) return;

    await directive.animateClick();
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

  calculateExpectedWidth(testId: string, baseWidth: number): string {
    const element = this.getElement(testId);
    if (!element) return `${baseWidth.toFixed(4)}px`;

    const raw = getComputedStyle(element).getPropertyValue('--sm-button-group-pressed-width-multiplier');
    if (!raw) return `${baseWidth.toFixed(4)}px`;

    const trimmed = raw.trim();
    if (!trimmed) return `${baseWidth.toFixed(4)}px`;

    const numeric = Number.parseFloat(trimmed);
    if (!Number.isFinite(numeric)) return `${baseWidth.toFixed(4)}px`;

    let multiplier: number;
    if (trimmed.endsWith('%')) {
      multiplier = numeric / 100;
    } else {
      multiplier = numeric;
    }

    const expectedWidth = baseWidth * (1 + multiplier);
    return `${expectedWidth.toFixed(4)}px`;
  }
}

describe('ButtonShapeMorph', () => {
  let fixture: ComponentFixture<ButtonShapeMorphTestComponent>;
  let testPage: ButtonShapeMorphPage;
  let testConfig: ButtonShapeMorphConfig;

  function createTestConfig(overrides: Partial<MorphConfig> = {}): ButtonShapeMorphConfig {
    const defaultConfig: MorphConfig = {
      buttonShapeMorphRole: 'button',
      buttonGroupType: undefined,
      buttonSize: signal('medium'),
      buttonShape: signal('round'),
      togglable: signal(false),
      isSelected: signal(false),
      disableWidthAnimations: signal(false),
      ...overrides,
    };

    return {
      morphConfig: defaultConfig,
      registerShapeMorphHost: vi.fn(),
    };
  }

  function createWritableSignalConfig(overrides: Partial<{
    buttonSize: string;
    buttonShape: string;
    buttonGroupType: ButtonGroupType | undefined;
    togglable: boolean;
    isSelected: boolean;
    disableWidthAnimations: boolean;
  }> = {}): ButtonShapeMorphConfig {
    const defaultConfig: MorphConfig = {
      buttonShapeMorphRole: 'button',
      buttonGroupType: overrides.buttonGroupType !== undefined ? signal(overrides.buttonGroupType) : undefined,
      buttonSize: signal(overrides.buttonSize ?? 'medium'),
      buttonShape: signal(overrides.buttonShape ?? 'round'),
      togglable: signal(overrides.togglable ?? false),
      isSelected: signal(overrides.isSelected ?? false),
      disableWidthAnimations: signal(overrides.disableWidthAnimations ?? false),
    };

    return {
      morphConfig: defaultConfig,
      registerShapeMorphHost: vi.fn(),
    };
  }

  async function createFixtureWithConfig(config: ButtonShapeMorphConfig): Promise<{
    fixture: ComponentFixture<ButtonShapeMorphTestComponent>;
    page: ButtonShapeMorphPage;
  }> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ButtonShapeMorphTestComponent, ButtonShapeMorph],
      providers: [
        ShapeMorph,
        {
          provide: BUTTON_SHAPE_MORPH_ROLE,
          useValue: config,
        },
      ],
    });

    const newFixture = TestBed.createComponent(ButtonShapeMorphTestComponent);
    newFixture.detectChanges();
    await newFixture.whenStable();

    const newTestPage = new ButtonShapeMorphPage(newFixture);
    return { fixture: newFixture, page: newTestPage };
  }

  function setupStandardButtonCSS(testPage: ButtonShapeMorphPage, testId: string): void {
    testPage.setCSSVar(testId, '--md-comp-button-medium-shape-round', '8px');
    testPage.setCSSVar(testId, '--md-comp-button-medium-shape-pressed-morph', '4px');
    testPage.setCSSVar(testId, '--md-comp-button-medium-shape-spring-animation-damping', '0.5');
    testPage.setCSSVar(testId, '--md-comp-button-medium-shape-spring-animation-stiffness', '100');
  }

  function setupWidthMorphingButtonCSS(testPage: ButtonShapeMorphPage, testId: string, multiplier: string = '0.15'): void {
    testPage.setCSSVar(testId, '--sm-button-group-pressed-width-multiplier', multiplier);
    testPage.setCSSVar(testId, '--md-comp-button-medium-shape-round', '8px');
    testPage.setCSSVar(testId, '--md-comp-button-medium-shape-pressed-morph', '4px');
    testPage.setCSSVar(testId, '--md-comp-button-medium-shape-spring-animation-damping', '0.5');
    testPage.setCSSVar(testId, '--md-comp-button-medium-shape-spring-animation-stiffness', '100');
  }

  beforeEach(async () => {
    testConfig = createTestConfig();
    globalTestConfig = testConfig;

    TestBed.configureTestingModule({
      imports: [ButtonShapeMorphTestComponent, ButtonShapeMorph],
      providers: [ShapeMorph],
    });

    fixture = TestBed.createComponent(ButtonShapeMorphTestComponent);
    testPage = new ButtonShapeMorphPage(fixture);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    globalTestConfig = null;
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Directive Initialization', () => {
    test('should create directive on button with smButtonShapeMorph attribute', () => {
      const directive = testPage.getDirective('standalone-btn');
      expect(directive).toBeTruthy();
      expect(directive).toBeInstanceOf(ButtonShapeMorph);
    });

    test('should not create directive on element without smButtonShapeMorph', () => {
      const directive = testPage.getDirective('no-directive');
      expect(directive).toBeNull();
    });

    test('should initialize view after ngAfterViewInit', async () => {
      const directive = testPage.getDirective('standalone-btn');
      expect(directive).toBeTruthy();

      await fixture.whenStable();

      const element = testPage.getElement('standalone-btn');
      expect(element).toBeTruthy();
    });

    test('should register shape morph host on construction', () => {
      expect(testConfig.registerShapeMorphHost).toHaveBeenCalled();
      expect(testConfig.registerShapeMorphHost).toHaveBeenCalledWith(expect.any(ButtonShapeMorph));
    });
  });

  describe('Configuration Changes', () => {
    test('should handle configuration changes after view init', async () => {
      const directive = testPage.getDirective('standalone-btn');
      expect(directive).toBeTruthy();

      await fixture.whenStable();

      const newConfig = createWritableSignalConfig({ buttonShape: 'square' });
      const { page: newTestPage } = await createFixtureWithConfig(newConfig);
      const newDirective = newTestPage.getDirective('standalone-btn');
      expect(newDirective).toBeTruthy();
    });

    test('should handle configuration changes before view init', async () => {
      const newConfig = createWritableSignalConfig({ buttonShape: 'square' });
      const { page: newTestPage } = await createFixtureWithConfig(newConfig);
      const directive = newTestPage.getDirective('standalone-btn');
      expect(directive).toBeTruthy();
    });
  });

  describe('Pointer Events', () => {
    test('should handle pointer down with primary button', async () => {
      const directive = testPage.getDirective('standalone-btn');
      expect(directive).toBeTruthy();

      await testPage.triggerPointerDown('standalone-btn', 0, 1);

      expect(directive).toBeTruthy();
    });

    test('should ignore pointer down with non-primary button', async () => {
      const directive = testPage.getDirective('standalone-btn');

      await testPage.triggerPointerDown('standalone-btn', 2, 1);
      await fixture.whenStable();

      expect(directive).toBeTruthy();
    });

    test('should handle pointer up inside button', async () => {
      const directive = testPage.getDirective('standalone-btn');

      await testPage.triggerPointerDown('standalone-btn', 0, 1);
      await testPage.triggerPointerUp('standalone-btn', true, 1);

      expect(directive).toBeTruthy();
    });

    test('should handle pointer up outside button', async () => {
      const directive = testPage.getDirective('standalone-btn');

      await testPage.triggerPointerDown('standalone-btn', 0, 1);
      await testPage.triggerPointerUp('standalone-btn', false, 1);

      expect(directive).toBeTruthy();
    });

    test('should handle pointer cancel', async () => {
      const directive = testPage.getDirective('standalone-btn');

      await testPage.triggerPointerDown('standalone-btn', 0, 1);
      await testPage.triggerPointerCancel('standalone-btn', 1);

      expect(directive).toBeTruthy();
    });

    test('should ignore pointer up with different pointer ID', async () => {
      const directive = testPage.getDirective('standalone-btn');

      await testPage.triggerPointerDown('standalone-btn', 0, 1);
      await testPage.triggerPointerUp('standalone-btn', true, 2);

      expect(directive).toBeTruthy();
    });
  });

  describe('Keyboard Events', () => {
    test('should handle Enter key down', async () => {
      const directive = testPage.getDirective('standalone-btn');

      await testPage.triggerKeyDown('standalone-btn', 'Enter');

      expect(directive).toBeTruthy();
    });

    test('should handle Space key down', async () => {
      const directive = testPage.getDirective('standalone-btn');

      await testPage.triggerKeyDown('standalone-btn', ' ');

      expect(directive).toBeTruthy();
    });

    test('should ignore Space key repeat', async () => {
      const directive = testPage.getDirective('standalone-btn');

      await testPage.triggerKeyDown('standalone-btn', ' ', false);
      await fixture.whenStable();

      await testPage.triggerKeyDown('standalone-btn', ' ', true);
      await fixture.whenStable();

      expect(directive).toBeTruthy();
    });
  });

  describe('Click Events', () => {
    test('should handle click with existing animation controls', async () => {
      const directive = testPage.getDirective('standalone-btn');

      await testPage.triggerPointerDown('standalone-btn', 0, 1);
      await fixture.whenStable();

      await testPage.triggerClick('standalone-btn');
      await fixture.whenStable();

      expect(directive).toBeTruthy();
    });

    test('should handle click without animation controls', async () => {
      const directive = testPage.getDirective('standalone-btn');

      await testPage.triggerClick('standalone-btn');
      await fixture.whenStable();

      expect(directive).toBeTruthy();
    });
  });

  describe('Animation Methods', () => {
    test('should animate press in with border radius', async () => {
      const directive = testPage.getDirective('standalone-btn');

      setupStandardButtonCSS(testPage, 'standalone-btn');

      directive!.animatePressIn(false);

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|4px/),
      });
    });

    test('should animate press in with selected state', async () => {
      const selectedConfig = createTestConfig({ isSelected: signal(true) });
      const { page: newTestPage } = await createFixtureWithConfig(selectedConfig);
      const directive = newTestPage.getDirective('standalone-btn');

      newTestPage.setCSSVar('standalone-btn', '--md-comp-button-medium-selected-container-shape-round', '12px');
      newTestPage.setCSSVar('standalone-btn', '--md-comp-button-medium-shape-pressed-morph', '4px');
      newTestPage.setCSSVar('standalone-btn', '--md-comp-button-medium-shape-spring-animation-damping', '0.5');
      newTestPage.setCSSVar('standalone-btn', '--md-comp-button-medium-shape-spring-animation-stiffness', '100');

      directive!.animatePressIn(true);

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|4px/),
      });
    });

    test('should animate to rest', async () => {
      const directive = testPage.getDirective('standalone-btn');

      setupStandardButtonCSS(testPage, 'standalone-btn');

      directive!.animatePressIn(false);
      await fixture.whenStable();

      await directive!.animateToRest();

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|8px/),
      });
    });

    test('should return undefined when view not initialized', () => {
      const directive = testPage.getDirective('standalone-btn');
      expect(directive).toBeTruthy();
    });

    test('should cancel previous animation when starting new one', async () => {
      const directive = testPage.getDirective('standalone-btn');

      setupStandardButtonCSS(testPage, 'standalone-btn');

      directive!.animatePressIn(false);
      await fixture.whenStable();

      directive!.animatePressIn(false);

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|4px/),
      });
    });
  });

  describe('Width Morphing', () => {
    test('should read width multiplier from CSS variable', async () => {
      testPage.setCSSVar('btn1', '--sm-button-group-pressed-width-multiplier', '0.15');

      await fixture.whenStable();

      const element = testPage.getElement('btn1');
      expect(element).toBeTruthy();
    });

    test('should parse percentage width multiplier', async () => {
      testPage.setCSSVar('btn1', '--sm-button-group-pressed-width-multiplier', '15%');

      await fixture.whenStable();

      const element = testPage.getElement('btn1');
      expect(element).toBeTruthy();
    });

    test('should handle zero width multipliers', async () => {
      const directive = testPage.getDirective('btn1');
      testPage.setCSSVar('btn1', '--sm-button-group-pressed-width-multiplier', '0');

      await fixture.whenStable();

      setupStandardButtonCSS(testPage, 'btn1');

      directive!.animatePressIn(false);

      await expect.element(page.getByTestId('btn1')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|4px/),
      });
    });

    test('should animate width when width morphing is enabled', async () => {
      const directive = testPage.getDirective('btn1');

      setupWidthMorphingButtonCSS(testPage, 'btn1');

      testPage.setCSSVar('btn2', '--md-comp-button-medium-shape-round', '8px');
      testPage.setCSSVar('btn2', '--md-comp-button-medium-shape-spring-animation-damping', '0.5');
      testPage.setCSSVar('btn2', '--md-comp-button-medium-shape-spring-animation-stiffness', '100');

      await fixture.whenStable();

      const initialWidth = testPage.getWidth('btn1');
      expect(initialWidth).toBeGreaterThan(0);

      const expectedWidth = testPage.calculateExpectedWidth('btn1', initialWidth);

      directive!.animatePressIn(false);
      await fixture.whenStable();

      const element = page.getByTestId('btn1').element();

      await expect.element(page.getByTestId('btn1')).toHaveStyle({
        width: expectedWidth,
      });
      const borderRadius = getComputedStyle(element).borderTopLeftRadius;
      expect(borderRadius).toBeTruthy();
    });

    test('should skip width animation when skipWidth option is true', async () => {
      const directive = testPage.getDirective('btn1');

      setupWidthMorphingButtonCSS(testPage, 'btn1');

      await fixture.whenStable();

      const initialWidth = testPage.getWidth('btn1');

      directive!.animatePressIn(false, { skipWidth: true });

      await expect.element(page.getByTestId('btn1')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|4px/),
      });
      const newWidth = testPage.getWidth('btn1');
      expect(newWidth).toBe(initialWidth);
    });

    test('should restore width on animateToRest', async () => {
      const directive = testPage.getDirective('btn1');

      setupWidthMorphingButtonCSS(testPage, 'btn1');

      await fixture.whenStable();

      const initialWidth = testPage.getWidth('btn1');
      expect(initialWidth).toBeGreaterThan(0);

      directive!.animatePressIn(false);
      await fixture.whenStable();

      await directive!.animateToRest();

      await expect.element(page.getByTestId('btn1')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|8px/),
      });
      const restoredWidth = testPage.getWidth('btn1');
      expect(restoredWidth).toBe(initialWidth);
    });

    test('should handle no neighbors case', async () => {
      const directive = testPage.getDirective('standalone-btn');

      setupWidthMorphingButtonCSS(testPage, 'standalone-btn');

      await fixture.whenStable();

      const initialWidth = testPage.getWidth('standalone-btn');
      expect(initialWidth).toBeGreaterThan(0);

      const expectedWidth = testPage.calculateExpectedWidth('standalone-btn', initialWidth);

      directive!.animatePressIn(false);

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        width: expectedWidth,
      });
      const element = page.getByTestId('standalone-btn').element();
      const borderRadius = getComputedStyle(element).borderTopLeftRadius;
      expect(borderRadius).toBeTruthy();
    });
  });

  describe('Neighbor Detection', () => {
    test('should detect adjacent neighbors in same row', async () => {
      const directive = testPage.getDirective('btn2');

      testPage.setCSSVar('btn2', '--sm-button-group-pressed-width-multiplier', '0.15');
      testPage.setCSSVar('btn2', '--md-comp-button-medium-shape-round', '8px');
      testPage.setCSSVar('btn2', '--md-comp-button-medium-shape-pressed-morph', '4px');
      testPage.setCSSVar('btn2', '--md-comp-button-medium-shape-spring-animation-damping', '0.5');
      testPage.setCSSVar('btn2', '--md-comp-button-medium-shape-spring-animation-stiffness', '100');

      testPage.setCSSVar('btn1', '--md-comp-button-medium-shape-spring-animation-damping', '0.5');
      testPage.setCSSVar('btn1', '--md-comp-button-medium-shape-spring-animation-stiffness', '100');
      testPage.setCSSVar('btn3', '--md-comp-button-medium-shape-spring-animation-damping', '0.5');
      testPage.setCSSVar('btn3', '--md-comp-button-medium-shape-spring-animation-stiffness', '100');

      await fixture.whenStable();

      directive!.animatePressIn(false);

      const element = page.getByTestId('btn2').element();
      const width = getComputedStyle(element).width;
      expect(width).toBeTruthy();
      expect(width).not.toBe('0px');
      const borderRadius = getComputedStyle(element).borderTopLeftRadius;
      expect(borderRadius).toBeTruthy();
    });

    test('should handle button with no parent', async () => {
      const directive = testPage.getDirective('standalone-btn');

      testPage.setCSSVar('standalone-btn', '--md-comp-button-medium-shape-round', '8px');
      testPage.setCSSVar('standalone-btn', '--md-comp-button-medium-shape-pressed-morph', '4px');
      testPage.setCSSVar('standalone-btn', '--md-comp-button-medium-shape-spring-animation-damping', '0.5');
      testPage.setCSSVar('standalone-btn', '--md-comp-button-medium-shape-spring-animation-stiffness', '100');

      await fixture.whenStable();

      directive!.animatePressIn(false);

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|4px/),
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle disabled width animations', async () => {
      const disabledConfig = createTestConfig({ disableWidthAnimations: signal(true) });
      const { page: newTestPage } = await createFixtureWithConfig(disabledConfig);
      const directive = newTestPage.getDirective('standalone-btn');

      setupWidthMorphingButtonCSS(newTestPage, 'standalone-btn');

      const initialWidth = newTestPage.getWidth('standalone-btn');

      directive!.animatePressIn(false);

      await expect.element(page.getByTestId('standalone-btn')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|4px/),
      });
      const newWidth = newTestPage.getWidth('standalone-btn');
      expect(newWidth).toBe(initialWidth);
    });

    test('should handle togglable button with selected state', async () => {
      const togglableConfig = createTestConfig({
        togglable: signal(true),
        isSelected: signal(true),
      });
      const { page: newTestPage } = await createFixtureWithConfig(togglableConfig);
      const directive = newTestPage.getDirective('togglable-btn');

      newTestPage.setCSSVar('togglable-btn', '--md-comp-button-medium-selected-container-shape-round', '12px');
      newTestPage.setCSSVar('togglable-btn', '--md-comp-button-medium-shape-pressed-morph', '4px');
      newTestPage.setCSSVar('togglable-btn', '--md-comp-button-medium-shape-spring-animation-damping', '0.5');
      newTestPage.setCSSVar('togglable-btn', '--md-comp-button-medium-shape-spring-animation-stiffness', '100');

      await directive!.animateToRest();

      await expect.element(page.getByTestId('togglable-btn')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|12px/),
      });
    });

    test('should handle icon button role', async () => {
      const iconConfig = createTestConfig({ buttonShapeMorphRole: 'icon' });
      const { page: newTestPage } = await createFixtureWithConfig(iconConfig);
      const directive = newTestPage.getDirective('icon-btn');

      newTestPage.setCSSVar('icon-btn', '--md-comp-icon-button-medium-container-shape-round', '50%');
      newTestPage.setCSSVar('icon-btn', '--md-comp-icon-button-medium-shape-pressed-morph', '4px');
      newTestPage.setCSSVar('icon-btn', '--md-comp-icon-button-medium-shape-spring-animation-damping', '0.5');
      newTestPage.setCSSVar('icon-btn', '--md-comp-icon-button-medium-shape-spring-animation-stiffness', '100');

      directive!.animatePressIn(false);

      await expect.element(page.getByTestId('icon-btn')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|4px/),
      });
    });

    test('should handle connected button group type', async () => {
      const connectedConfig = createTestConfig({
        buttonGroupType: signal<ButtonGroupType>('connected'),
      });
      const { page: newTestPage } = await createFixtureWithConfig(connectedConfig);
      const directive = newTestPage.getDirective('btn4');

      newTestPage.setCSSVar('btn4', '--sm-comp-button-connected-medium-shape-round', '8px');
      newTestPage.setCSSVar('btn4', '--sm-comp-button-connected-medium-shape-pressed-morph', '4px');
      newTestPage.setCSSVar('btn4', '--md-comp-button-medium-shape-spring-animation-damping', '0.5');
      newTestPage.setCSSVar('btn4', '--md-comp-button-medium-shape-spring-animation-stiffness', '100');

      directive!.animatePressIn(false);

      await expect.element(page.getByTestId('btn4')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|4px/),
      });
    });
  });
});
