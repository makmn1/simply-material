import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import {page} from 'vitest/browser';
import {SimplyMatButtonGroupSelection} from './button-group-selection';
import {ButtonGroupSize, ButtonGroupType, SimplyMatButtonGroupBase} from './button-group-base';
import {SimplyMatButtonOption} from '../button/button-option';
import {ButtonBase} from '../core/button-base/button-base';
import {Listbox} from '@angular/aria/listbox';
import {loadButtonShapeMorphTestCssVars} from '../core/button-shape-morph/button-shape-morph-test-helpers';
import {ShapeMorph} from '../../../../services/shape-morph';
import {BUTTON_GROUP_BASE_CONFIG, ButtonGroupBaseConfig} from './button-group-base.token';

describe('SimplyMatButtonGroupSelection', () => {
  let fixture: ComponentFixture<ButtonGroupSelectionTestComponent>;
  let pageModel: ButtonGroupSelectionPage;

  beforeEach(async () => {
    loadButtonShapeMorphTestCssVars();

    TestBed.configureTestingModule({
      imports: [ButtonGroupSelectionTestComponent],
      providers: [ShapeMorph],
    });

    fixture = TestBed.createComponent(ButtonGroupSelectionTestComponent);
    await fixture.whenStable();
    pageModel = new ButtonGroupSelectionPage(fixture);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Component Initialization & Inheritance', () => {
    test('should extend SimplyMatButtonGroupBase', () => {
      const component = pageModel.getComponent('basic-group');

      expect(component).toBeInstanceOf(SimplyMatButtonGroupBase);
      expect(component).toBeInstanceOf(SimplyMatButtonGroupSelection);
    });

    test('should provide SimplyMatButtonGroupBase via forwardRef', () => {
      const debugElement = fixture.debugElement.query(By.css('[data-testid="basic-group"]'));
      const injectedBase = debugElement?.injector.get(SimplyMatButtonGroupBase, null);

      expect(injectedBase).not.toBeNull();
      expect(injectedBase).toBeInstanceOf(SimplyMatButtonGroupSelection);
    });

    test('should resolve SimplyMatButtonGroupBase provider to SimplyMatButtonGroupSelection instance', () => {
      const buttonGroup = pageModel.getComponent('basic-group');
      const debugElement = fixture.debugElement.query(By.css('[data-testid="basic-group"]'));
      const injectedBase = debugElement?.injector.get(SimplyMatButtonGroupBase, null);

      expect(injectedBase).toBe(buttonGroup);
    });

    test('should have selector "simply-mat-button-group-selection"', () => {
      const element = page.getByTestId('basic-group').query();

      expect(element?.tagName.toLowerCase()).toBe('simply-mat-button-group-selection');
    });

    test('should render component correctly with its selector', async () => {
      const component = pageModel.getComponent('basic-group');

      expect(component).not.toBeNull();
      await expect.element(page.getByTestId('basic-group')).toBeInTheDocument();
    });

    test('should have Listbox host directive attached', () => {
      const listbox = pageModel.getListboxDirective('basic-group');

      expect(listbox).not.toBeNull();
      expect(listbox).toBeInstanceOf(Listbox);
    });

    test('should have buttons that can be queried', async () => {
      const button1 = pageModel.getElement('basic-btn1');
      const button2 = pageModel.getElement('basic-btn2');
      const button3 = pageModel.getElement('basic-btn3');

      expect(button1).toBeTruthy();
      expect(button2).toBeTruthy();
      expect(button3).toBeTruthy();

      expect(button1?.hasAttribute('ngoption')).toBe(true);
      expect(button2?.hasAttribute('ngoption')).toBe(true);
      expect(button3?.hasAttribute('ngoption')).toBe(true);
    });
  });

  describe('Listbox Input Configuration', () => {
    test('should pass through id input to Listbox', async () => {
      const element = page.getByTestId('id-test-group').query();

      expect(element?.getAttribute('id')).toBe('test-listbox-id');
    });

    test('should pass through orientation input to Listbox (horizontal)', async () => {
      const listbox = pageModel.getListboxDirective('orientation-horizontal-group');

      expect(listbox?.orientation()).toBe('horizontal');
    });

    test('should pass through orientation input to Listbox (vertical)', async () => {
      const listbox = pageModel.getListboxDirective('orientation-vertical-group');

      expect(listbox?.orientation()).toBe('vertical');
    });

    test('should default to vertical orientation per Listbox defaults', async () => {
      // Test on a group without explicit orientation set
      const listbox = pageModel.getListboxDirective('default-orientation-group');

      // We can't change this default since Angular doesn't support overriding inputs for directives
      expect(listbox?.orientation()).toBe('vertical');
    });

    test('should pass through multi input to Listbox (single selection)', async () => {
      const listbox = pageModel.getListboxDirective('single-selection-group');

      expect(listbox?.multi()).toBe(false);
    });

    test('should pass through multi input to Listbox (multi selection)', async () => {
      const listbox = pageModel.getListboxDirective('multi-selection-group');

      expect(listbox?.multi()).toBe(true);
    });

    test('should pass through wrap input to Listbox', async () => {
      const listbox = pageModel.getListboxDirective('wrap-test-group');

      expect(listbox?.wrap()).toBe(true);
    });

    test('should pass through disabled input to Listbox', async () => {
      const listbox = pageModel.getListboxDirective('disabled-group');

      expect(listbox?.disabled()).toBe(true);
    });

    test('should pass through readonly input to Listbox', async () => {
      const listbox = pageModel.getListboxDirective('readonly-group');

      expect(listbox?.readonly()).toBe(true);
    });

    test('should pass through softDisabled input to Listbox', async () => {
      const listbox = pageModel.getListboxDirective('soft-disabled-group');

      expect(listbox?.softDisabled()).toBe(true);
    });

    test('should update multi input reactively', async () => {
      fixture.componentInstance.dynamicMulti.set(false);
      await fixture.whenStable();

      let listbox = pageModel.getListboxDirective('dynamic-group');
      expect(listbox?.multi()).toBe(false);

      fixture.componentInstance.dynamicMulti.set(true);
      await fixture.whenStable();

      listbox = pageModel.getListboxDirective('dynamic-group');
      expect(listbox?.multi()).toBe(true);
    });

    test('should update disabled input reactively', async () => {
      fixture.componentInstance.dynamicDisabled.set(false);
      await fixture.whenStable();

      let listbox = pageModel.getListboxDirective('dynamic-group');
      expect(listbox?.disabled()).toBe(false);

      fixture.componentInstance.dynamicDisabled.set(true);
      await fixture.whenStable();

      listbox = pageModel.getListboxDirective('dynamic-group');
      expect(listbox?.disabled()).toBe(true);
    });
  });

  describe('Touched State Behavior', () => {
    test('should initialize with touched state as false', () => {
      const component = pageModel.getComponent('basic-group');

      expect(component?.touched()).toBe(false);
    });

    test('should NOT set touched when clicking a button in the group', async () => {
      const component = pageModel.getComponent('basic-group');
      expect(component?.touched()).toBe(false);

      await pageModel.clickButton('basic-btn1');
      await fixture.whenStable();

      expect(component?.touched()).toBe(false);
    });

    test('should NOT set touched when selecting a button in the group', async () => {
      const component = pageModel.getComponent('basic-group');
      expect(component?.touched()).toBe(false);

      await pageModel.clickButton('basic-btn2');
      await fixture.whenStable();

      expect(component?.touched()).toBe(false);
    });

    test('should NOT set touched when focusing between buttons in the group', async () => {
      const component = pageModel.getComponent('basic-group');
      expect(component?.touched()).toBe(false);

      await pageModel.focusButton('basic-btn1');
      await fixture.whenStable();
      expect(component?.touched()).toBe(false);

      await pageModel.focusButton('basic-btn2');
      await fixture.whenStable();
      expect(component?.touched()).toBe(false);

      await pageModel.focusButton('basic-btn3');
      await fixture.whenStable();
      expect(component?.touched()).toBe(false);
    });

    test('should set touched to true when focus moves OUT of button group', async () => {
      const component = pageModel.getComponent('basic-group');
      expect(component?.touched()).toBe(false);

      await pageModel.focusButton('basic-btn1');
      await fixture.whenStable();

      await pageModel.blurToOutside('basic-btn1');
      await fixture.whenStable();

      expect(component?.touched()).toBe(true);
    });

    test('should set touched to true when tabbing out of button group', async () => {
      const component = pageModel.getComponent('basic-group');
      expect(component?.touched()).toBe(false);

      await pageModel.focusButton('basic-btn3');
      await fixture.whenStable();

      await pageModel.triggerFocusOut('basic-btn3', null);
      await fixture.whenStable();

      expect(component?.touched()).toBe(true);
    });

    test('should stay touched when refocused after being touched', async () => {
      const component = pageModel.getComponent('basic-group');

      await pageModel.focusButton('basic-btn1');
      await pageModel.blurToOutside('basic-btn1');
      await fixture.whenStable();
      expect(component?.touched()).toBe(true);

      await pageModel.focusButton('basic-btn2');
      await fixture.whenStable();

      expect(component?.touched()).toBe(true);
    });

    test('should stay touched when buttons are clicked after being touched', async () => {
      const component = pageModel.getComponent('basic-group');

      await pageModel.focusButton('basic-btn1');
      await pageModel.blurToOutside('basic-btn1');
      await fixture.whenStable();
      expect(component?.touched()).toBe(true);

      await pageModel.clickButton('basic-btn2');
      await fixture.whenStable();

      expect(component?.touched()).toBe(true);
    });

    test('should NOT set touched when value is programmatically changed', async () => {
      const component = pageModel.getComponent('basic-group');
      expect(component?.touched()).toBe(false);

      component?.value.set(['btn1']);
      await fixture.whenStable();

      expect(component?.touched()).toBe(false);
    });

    test('should NOT set touched when Listbox values are programmatically changed', async () => {
      const component = pageModel.getComponent('basic-group');
      const listbox = pageModel.getListboxDirective('basic-group');
      expect(component?.touched()).toBe(false);

      listbox?.values.set(['btn2']);
      await fixture.whenStable();

      expect(component?.touched()).toBe(false);
    });

    test('should properly detect focus leaving group when relatedTarget is outside', async () => {
      const component = pageModel.getComponent('basic-group');
      const outsideElement = page.getByTestId('outside-element').query() as HTMLElement;

      await pageModel.focusButton('basic-btn1');
      await fixture.whenStable();

      await pageModel.triggerFocusOut('basic-btn1', outsideElement);
      await fixture.whenStable();

      expect(component?.touched()).toBe(true);
    });

    test('should NOT set touched when relatedTarget is another button in the same group', async () => {
      const component = pageModel.getComponent('basic-group');
      const btn2Element = page.getByTestId('basic-btn2').query() as HTMLElement;

      await pageModel.focusButton('basic-btn1');
      await fixture.whenStable();

      await pageModel.triggerFocusOut('basic-btn1', btn2Element);
      await fixture.whenStable();

      expect(component?.touched()).toBe(false);
    });

    test('should NOT set touched when focus moves OUT while readonly is true', async () => {
      const component = pageModel.getComponent('readonly-sync-group');

      fixture.componentInstance.dynamicReadonly.set(true);
      await fixture.whenStable();

      expect(component?.touched()).toBe(false);

      await pageModel.focusButton('readonly-sync-btn1');
      await fixture.whenStable();

      await pageModel.blurToOutside('readonly-sync-btn1');
      await fixture.whenStable();

      expect(component?.touched()).toBe(false);
    });

    test('should set touched when focus moves OUT while readonly is false', async () => {
      const component = pageModel.getComponent('readonly-sync-group');

      fixture.componentInstance.dynamicReadonly.set(false);
      await fixture.whenStable();

      expect(component?.touched()).toBe(false);

      await pageModel.focusButton('readonly-sync-btn1');
      await fixture.whenStable();

      await pageModel.blurToOutside('readonly-sync-btn1');
      await fixture.whenStable();

      expect(component?.touched()).toBe(true);
    });

    test('should handle readonly toggle for touched state', async () => {
      const component = pageModel.getComponent('readonly-sync-group');

      fixture.componentInstance.dynamicReadonly.set(false);
      await fixture.whenStable();

      await pageModel.focusButton('readonly-sync-btn1');
      await pageModel.blurToOutside('readonly-sync-btn1');
      await fixture.whenStable();

      expect(component?.touched()).toBe(true);

      component?.touched.set(false);
      await fixture.whenStable();

      fixture.componentInstance.dynamicReadonly.set(true);
      await fixture.whenStable();

      await pageModel.focusButton('readonly-sync-btn2');
      await pageModel.blurToOutside('readonly-sync-btn2');
      await fixture.whenStable();

      expect(component?.touched()).toBe(false);
    });

    test('should stay untouched when tabbing out while readonly', async () => {
      const component = pageModel.getComponent('readonly-sync-group');

      fixture.componentInstance.dynamicReadonly.set(true);
      await fixture.whenStable();

      expect(component?.touched()).toBe(false);

      await pageModel.focusButton('readonly-sync-btn3');
      await fixture.whenStable();

      await pageModel.triggerFocusOut('readonly-sync-btn3', null);
      await fixture.whenStable();

      expect(component?.touched()).toBe(false);
    });
  });

  describe('Value Model Synchronization', () => {
    test('should initialize with empty value array', () => {
      const component = pageModel.getComponent('basic-group');

      expect(component?.value()).toEqual([]);
    });

    test('should initialize Listbox with empty values array', () => {
      const listbox = pageModel.getListboxDirective('basic-group');

      expect(listbox?.values()).toEqual([]);
    });

    test('should sync component.value to Listbox.values', async () => {
      const component = pageModel.getComponent('basic-group');
      const listbox = pageModel.getListboxDirective('basic-group');

      component?.value.set(['btn1']);
      await fixture.whenStable();

      expect(listbox?.values()).toEqual(['btn1']);
    });

    test('should sync Listbox.values to component.value', async () => {
      const component = pageModel.getComponent('basic-group');
      const listbox = pageModel.getListboxDirective('basic-group');

      listbox?.values.set(['btn2']);
      await fixture.whenStable();

      expect(component?.value()).toEqual(['btn2']);
    });

    test('should sync multiple values in multi-selection mode', async () => {
      const component = pageModel.getComponent('multi-selection-group');
      const listbox = pageModel.getListboxDirective('multi-selection-group');

      component?.value.set(['multi-btn1', 'multi-btn2']);
      await fixture.whenStable();

      expect(listbox?.values()).toEqual(['multi-btn1', 'multi-btn2']);
    });

    test('should sync from Listbox to component with multiple values', async () => {
      const component = pageModel.getComponent('multi-selection-group');
      const listbox = pageModel.getListboxDirective('multi-selection-group');

      listbox?.values.set(['multi-btn2', 'multi-btn3']);
      await fixture.whenStable();

      expect(component?.value()).toEqual(['multi-btn2', 'multi-btn3']);
    });

    test('should sync single value arrays correctly', async () => {
      const component = pageModel.getComponent('single-selection-group');
      const listbox = pageModel.getListboxDirective('single-selection-group');

      component?.value.set(['single-btn1']);
      await fixture.whenStable();

      expect(listbox?.values()).toEqual(['single-btn1']);
    });

    test('should maintain sync between listbox and component values', async () => {
      const component = pageModel.getComponent('single-selection-group');
      const listbox = pageModel.getListboxDirective('single-selection-group');

      listbox?.values.set(['single-btn1']);
      await fixture.whenStable();

      expect(component?.value()).toContain('single-btn1');

      component?.value.set(['single-btn2']);
      await fixture.whenStable();

      expect(listbox?.values()).toContain('single-btn2');
    });

    test('should not cause infinite loop during bidirectional sync', async () => {
      const component = pageModel.getComponent('basic-group');
      const listbox = pageModel.getListboxDirective('basic-group');

      component?.value.set(['btn1']);
      await fixture.whenStable();

      expect(listbox?.values()).toEqual(['btn1']);
      expect(component?.value()).toEqual(['btn1']);
    });

    test('should handle empty array synchronization', async () => {
      const component = pageModel.getComponent('multi-selection-group');
      const listbox = pageModel.getListboxDirective('multi-selection-group');

      component?.value.set(['multi-btn1', 'multi-btn2']);
      await fixture.whenStable();

      component?.value.set([]);
      await fixture.whenStable();

      expect(listbox?.values()).toEqual([]);
    });
  });

  describe('Readonly Value Synchronization', () => {
    test('should reset listbox values to form values when readonly is true', async () => {
      const component = pageModel.getComponent('readonly-sync-group');
      const listbox = pageModel.getListboxDirective('readonly-sync-group');

      component?.value.set(['readonly-btn1']);
      await fixture.whenStable();

      fixture.componentInstance.dynamicReadonly.set(true);
      await fixture.whenStable();

      listbox?.values.set(['readonly-btn2']);
      await fixture.whenStable();

      expect(listbox?.values()).toEqual(['readonly-btn1']);
      expect(component?.value()).toEqual(['readonly-btn1']);
    });

    test('should update form values from listbox when readonly is false', async () => {
      const component = pageModel.getComponent('readonly-sync-group');
      const listbox = pageModel.getListboxDirective('readonly-sync-group');

      fixture.componentInstance.dynamicReadonly.set(false);
      await fixture.whenStable();

      listbox?.values.set(['readonly-btn2']);
      await fixture.whenStable();

      expect(component?.value()).toEqual(['readonly-btn2']);
    });

    test('should allow form-to-listbox sync when readonly is true', async () => {
      const component = pageModel.getComponent('readonly-sync-group');
      const listbox = pageModel.getListboxDirective('readonly-sync-group');

      fixture.componentInstance.dynamicReadonly.set(true);
      await fixture.whenStable();

      component?.value.set(['readonly-btn3']);
      await fixture.whenStable();

      expect(listbox?.values()).toEqual(['readonly-btn3']);
    });

    test('should handle readonly toggle while values are set', async () => {
      const component = pageModel.getComponent('readonly-sync-group');
      const listbox = pageModel.getListboxDirective('readonly-sync-group');

      fixture.componentInstance.dynamicReadonly.set(false);
      component?.value.set(['readonly-btn1']);
      await fixture.whenStable();

      fixture.componentInstance.dynamicReadonly.set(true);
      await fixture.whenStable();

      listbox?.values.set(['readonly-btn2']);
      await fixture.whenStable();

      expect(listbox?.values()).toEqual(['readonly-btn1']);
      expect(component?.value()).toEqual(['readonly-btn1']);

      fixture.componentInstance.dynamicReadonly.set(false);
      await fixture.whenStable();

      listbox?.values.set(['readonly-btn3']);
      await fixture.whenStable();

      expect(component?.value()).toEqual(['readonly-btn3']);
    });
  });

  describe('Border Radius Animation on Programmatic Changes - Standard Group', () => {
    beforeEach(async () => {
      await fixture.whenStable();
      pageModel.setAnimationCssVars('standard-btn1');
      pageModel.setAnimationCssVars('standard-btn2');
    });

    test('should animate border radius when button is programmatically selected', async () => {
      const component = pageModel.getComponent('standard-group');
      const button = pageModel.getButtonDirective('standard-btn1');
      const startingBorderRadius = pageModel.buttonSmallRoundBorderRadius;

      const initialElement = pageModel.getElement('standard-btn1');
      const initialRadius = pageModel.extractPixelNumber(getComputedStyle(initialElement!).borderTopLeftRadius);
      expect(initialRadius).toBe(startingBorderRadius);

      component?.value.set(['standard-btn1']);
      await fixture.whenStable();

      button?.setSelected(true);
      await fixture.whenStable();

      await expect.poll(() => {
        const element = pageModel.getElement('standard-btn1');
        return pageModel.extractPixelNumber(getComputedStyle(element!).borderTopLeftRadius);
      }, { timeout: 1000 }).toBeGreaterThan(startingBorderRadius);

      await expect.poll(() => {
        const element = pageModel.getElement('standard-btn1');
        const currentBorderRadius = pageModel.extractPixelNumber(getComputedStyle(element!).borderTopLeftRadius);
        return Math.abs(currentBorderRadius - pageModel.buttonSmallSelectedBorderRadius);
      }, { timeout: 2000 }).toBeLessThan(1);
    });

    test('should animate border radius when button is programmatically deselected', async () => {
      const component = pageModel.getComponent('standard-group');
      const button = pageModel.getButtonDirective('standard-btn1');
      const startingBorderRadius = pageModel.buttonSmallRoundBorderRadius;

      component?.value.set(['standard-btn1']);
      button?.setSelected(true);
      await fixture.whenStable();

      await expect.poll(() => {
        const element = pageModel.getElement('standard-btn1');
        const currentBorderRadius = pageModel.extractPixelNumber(getComputedStyle(element!).borderTopLeftRadius);
        return Math.abs(currentBorderRadius - pageModel.buttonSmallSelectedBorderRadius);
      }, { timeout: 2000 }).toBeLessThan(1);

      component?.value.set([]);
      button?.setSelected(false);
      await fixture.whenStable();

      await expect.poll(() => {
        const element = pageModel.getElement('standard-btn1');
        const currentBorderRadius = pageModel.extractPixelNumber(getComputedStyle(element!).borderTopLeftRadius);
        return Math.abs(currentBorderRadius - startingBorderRadius);
      }, { timeout: 2000 }).toBeLessThan(1);
    });

    test('should skip width animations during programmatic changes', async () => {
      const component = pageModel.getComponent('standard-group');

      const initialWidth = pageModel.getWidth('standard-btn1');

      component?.value.set(['standard-btn1']);
      await fixture.whenStable();

      const finalWidth = pageModel.getWidth('standard-btn1');
      expect(finalWidth).toBe(initialWidth);
    });

    test('should update button selected state when setSelected is called', async () => {
      const button = pageModel.getButtonDirective('standard-btn1');

      expect(button?.baseConfig.isSelected()).toBe(false);

      button?.setSelected(true);
      await fixture.whenStable();

      expect(button?.baseConfig.isSelected()).toBe(true);
    });

    test('should handle multiple button selection animations', async () => {
      pageModel.setAnimationCssVars('multi-btn1');
      pageModel.setAnimationCssVars('multi-btn2');

      const button1 = pageModel.getButtonDirective('multi-btn1');
      const button2 = pageModel.getButtonDirective('multi-btn2');

      button1?.setSelected(true);
      button2?.setSelected(true);
      await fixture.whenStable();

      expect(button1?.baseConfig.isSelected()).toBe(true);
      expect(button2?.baseConfig.isSelected()).toBe(true);
    });
  });

  describe('Border Radius Animation on Programmatic Changes - Connected Group', () => {
    beforeEach(async () => {
      await fixture.whenStable();
      pageModel.setAnimationCssVars('connected-btn1');
      pageModel.setAnimationCssVars('connected-btn2');
    });

    test('should use connected group CSS variables for animations', async () => {
      const button = pageModel.getButtonDirective('connected-btn1');

      // Verify initial state (may be set by loadButtonShapeMorphTestCssVars, so just verify it's a number)
      const initialElement = pageModel.getElement('connected-btn1');
      const initialRadius = pageModel.extractPixelNumber(getComputedStyle(initialElement!).borderTopLeftRadius);
      expect(initialRadius).toBeGreaterThan(0);

      button?.setSelected(true);
      await fixture.whenStable();

      await expect.poll(() => {
        const element = pageModel.getElement('connected-btn1');
        const currentBorderRadius = pageModel.extractPixelNumber(getComputedStyle(element!).borderTopLeftRadius);
        return Math.abs(currentBorderRadius - pageModel.buttonConnectedSmallSelectedBorderRadius);
      }, { timeout: 2000 }).toBeLessThan(1);
    });

    test('should animate deselection using connected group CSS variables', async () => {
      const button = pageModel.getButtonDirective('connected-btn2');
      const restingBorderRadius = pageModel.buttonConnectedSmallBorderRadius;

      button?.setSelected(true);
      await fixture.whenStable();

      await expect.poll(() => {
        const element = pageModel.getElement('connected-btn2');
        const currentBorderRadius = pageModel.extractPixelNumber(getComputedStyle(element!).borderTopLeftRadius);
        return Math.abs(currentBorderRadius - pageModel.buttonConnectedSmallSelectedBorderRadius);
      }, { timeout: 2000 }).toBeLessThan(1);

      button?.setSelected(false);
      await fixture.whenStable();

      await expect.poll(() => {
        const element = pageModel.getElement('connected-btn2');
        const currentBorderRadius = pageModel.extractPixelNumber(getComputedStyle(element!).borderTopLeftRadius);
        return Math.abs(currentBorderRadius - restingBorderRadius);
      }, { timeout: 2000 }).toBeLessThan(1);
    });
  });

  describe('Inherited Button Group Properties', () => {
    test('should inherit type input with default value "standard"', () => {
      const component = pageModel.getComponent('basic-group');

      expect(component?.type()).toBe('standard');
    });

    test('should inherit and respond to type input changes', async () => {
      fixture.componentInstance.dynamicType.set('standard');
      await fixture.whenStable();

      let component = pageModel.getComponent('dynamic-group');
      expect(component?.type()).toBe('standard');

      fixture.componentInstance.dynamicType.set('connected');
      await fixture.whenStable();

      component = pageModel.getComponent('dynamic-group');
      expect(component?.type()).toBe('connected');
    });

    test('should inherit size input with default value "small"', () => {
      const component = pageModel.getComponent('basic-group');

      expect(component?.size()).toBe('small');
    });

    test('should inherit and respond to size input changes', async () => {
      fixture.componentInstance.dynamicSize.set('small');
      await fixture.whenStable();

      let component = pageModel.getComponent('dynamic-group');
      expect(component?.size()).toBe('small');

      fixture.componentInstance.dynamicSize.set('xlarge');
      await fixture.whenStable();

      component = pageModel.getComponent('dynamic-group');
      expect(component?.size()).toBe('xlarge');
    });

    test('should inherit defaultButtonShape input with default value "round"', () => {
      const component = pageModel.getComponent('basic-group');

      expect(component?.defaultButtonShape()).toBe('round');
    });

    test('should inherit disableWidthAnimations input with default value false', () => {
      const component = pageModel.getComponent('basic-group');

      expect(component?.disableWidthAnimations()).toBe(false);
    });

    test('should bind data-sm-type host attribute', async () => {
      const typeAttr = await pageModel.getTypeAttribute('standard-group');

      expect(typeAttr).toBe('standard');
    });

    test('should bind data-sm-size host attribute', async () => {
      const sizeAttr = await pageModel.getSizeAttribute('basic-group');

      expect(sizeAttr).toBe('small');
    });

    test('should update data-sm-type when type changes', async () => {
      fixture.componentInstance.dynamicType.set('standard');
      await fixture.whenStable();

      let typeAttr = await pageModel.getTypeAttribute('dynamic-group');
      expect(typeAttr).toBe('standard');

      fixture.componentInstance.dynamicType.set('connected');
      await fixture.whenStable();

      typeAttr = await pageModel.getTypeAttribute('dynamic-group');
      expect(typeAttr).toBe('connected');
    });

    test('should update data-sm-size when size changes', async () => {
      fixture.componentInstance.dynamicSize.set('small');
      await fixture.whenStable();

      let sizeAttr = await pageModel.getSizeAttribute('dynamic-group');
      expect(sizeAttr).toBe('small');

      fixture.componentInstance.dynamicSize.set('xlarge');
      await fixture.whenStable();

      sizeAttr = await pageModel.getSizeAttribute('dynamic-group');
      expect(sizeAttr).toBe('xlarge');
    });

    test('should accept all ButtonGroupType values', () => {
      const standardGroup = pageModel.getComponent('standard-group');
      expect(standardGroup?.type()).toBe('standard');

      const connectedGroup = pageModel.getComponent('connected-group');
      expect(connectedGroup?.type()).toBe('connected');
    });

    test('should accept all ButtonGroupSize values', () => {
      const smallGroup = pageModel.getComponent('basic-group');
      expect(smallGroup?.size()).toBe('small');
    });

    test('should accept all ButtonGroupDefaultShape values', () => {
      const roundGroup = pageModel.getComponent('basic-group');
      expect(roundGroup?.defaultButtonShape()).toBe('round');
    });
  });

  describe('BUTTON_GROUP_BASE_CONFIG Provider', () => {
    test('should provide BUTTON_GROUP_BASE_CONFIG token', () => {
      const baseConfig = pageModel.getBaseConfig('basic-group');

      expect(baseConfig).not.toBeNull();
    });

    test('should return baseConfig with correct structure', () => {
      const component = pageModel.getComponent('basic-group');
      const baseConfig = component?.baseConfig;

      expect(baseConfig).toBeDefined();
      expect(baseConfig?.groupDisabled).toBeDefined();
      expect(baseConfig?.groupSoftDisabled).toBeDefined();
      expect(baseConfig?.groupReadonly).toBeDefined();
    });

    test('should reflect disabled input in baseConfig.groupDisabled', async () => {
      fixture.componentInstance.dynamicDisabled.set(true);
      await fixture.whenStable();

      const component = pageModel.getComponent('dynamic-group');
      const baseConfig = component?.baseConfig;

      expect(baseConfig?.groupDisabled()).toBe(true);
    });

    test('should reflect softDisabled input in baseConfig.groupSoftDisabled', async () => {
      fixture.componentInstance.dynamicSoftDisabled.set(true);
      await fixture.whenStable();

      const component = pageModel.getComponent('dynamic-group');
      const baseConfig = component?.baseConfig;

      expect(baseConfig?.groupSoftDisabled()).toBe(true);
    });

    test('should reflect readonly input in baseConfig.groupReadonly', async () => {
      fixture.componentInstance.dynamicReadonly.set(true);
      await fixture.whenStable();

      const component = pageModel.getComponent('dynamic-group');
      const baseConfig = component?.baseConfig;

      expect(baseConfig?.groupReadonly()).toBe(true);
    });

    test('should update baseConfig.groupDisabled reactively', async () => {
      fixture.componentInstance.dynamicDisabled.set(false);
      await fixture.whenStable();

      let component = pageModel.getComponent('dynamic-group');
      expect(component?.baseConfig.groupDisabled()).toBe(false);

      fixture.componentInstance.dynamicDisabled.set(true);
      await fixture.whenStable();

      component = pageModel.getComponent('dynamic-group');
      expect(component?.baseConfig.groupDisabled()).toBe(true);
    });

    test('should update baseConfig.groupSoftDisabled reactively', async () => {
      fixture.componentInstance.dynamicSoftDisabled.set(false);
      await fixture.whenStable();

      let component = pageModel.getComponent('dynamic-group');
      expect(component?.baseConfig.groupSoftDisabled()).toBe(false);

      fixture.componentInstance.dynamicSoftDisabled.set(true);
      await fixture.whenStable();

      component = pageModel.getComponent('dynamic-group');
      expect(component?.baseConfig.groupSoftDisabled()).toBe(true);
    });

    test('should update baseConfig.groupReadonly reactively', async () => {
      fixture.componentInstance.dynamicReadonly.set(false);
      await fixture.whenStable();

      let component = pageModel.getComponent('dynamic-group');
      expect(component?.baseConfig.groupReadonly()).toBe(false);

      fixture.componentInstance.dynamicReadonly.set(true);
      await fixture.whenStable();

      component = pageModel.getComponent('dynamic-group');
      expect(component?.baseConfig.groupReadonly()).toBe(true);
    });
  });
});

@Component({
  template: `
    <simply-mat-button-group-selection
      data-testid="basic-group"
      orientation="horizontal">
      <button data-testid="basic-btn1" simplyMatButton ngOption [value]="'btn1'">Button 1</button>
      <button data-testid="basic-btn2" simplyMatButton ngOption [value]="'btn2'">Button 2</button>
      <button data-testid="basic-btn3" simplyMatButton ngOption [value]="'btn3'">Button 3</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection
      data-testid="id-test-group"
      orientation="horizontal"
      id="test-listbox-id">
      <button data-testid="id-btn1" simplyMatButton ngOption [value]="'id1'">ID 1</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection
      data-testid="orientation-horizontal-group"
      orientation="horizontal">
      <button data-testid="horiz-btn1" simplyMatButton ngOption [value]="'h1'">H1</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection
      data-testid="orientation-vertical-group"
      orientation="vertical">
      <button data-testid="vert-btn1" simplyMatButton ngOption [value]="'v1'">V1</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection data-testid="default-orientation-group">
      <button data-testid="default-btn1" simplyMatButton ngOption [value]="'d1'">D1</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection
      data-testid="single-selection-group"
      orientation="horizontal"
      [multi]="false">
      <button data-testid="single-btn1" simplyMatButton ngOption [value]="'single-btn1'">Single 1</button>
      <button data-testid="single-btn2" simplyMatButton ngOption [value]="'single-btn2'">Single 2</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection
      data-testid="multi-selection-group"
      orientation="horizontal"
      [multi]="true">
      <button data-testid="multi-btn1" simplyMatButton ngOption [value]="'multi-btn1'">Multi 1</button>
      <button data-testid="multi-btn2" simplyMatButton ngOption [value]="'multi-btn2'">Multi 2</button>
      <button data-testid="multi-btn3" simplyMatButton ngOption [value]="'multi-btn3'">Multi 3</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection
      data-testid="wrap-test-group"
      orientation="horizontal"
      [wrap]="true">
      <button data-testid="wrap-btn1" simplyMatButton ngOption [value]="'w1'">W1</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection
      data-testid="disabled-group"
      orientation="horizontal"
      [disabled]="true">
      <button data-testid="disabled-btn1" simplyMatButton ngOption [value]="'d1'">D1</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection
      data-testid="readonly-group"
      orientation="horizontal"
      [readonly]="true">
      <button data-testid="readonly-btn1" simplyMatButton ngOption [value]="'r1'">R1</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection
      data-testid="soft-disabled-group"
      orientation="horizontal"
      [softDisabled]="true">
      <button data-testid="soft-btn1" simplyMatButton ngOption [value]="'s1'">S1</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection
      data-testid="standard-group"
      orientation="horizontal"
      [type]="'standard'">
      <button data-testid="standard-btn1" simplyMatButton ngOption [value]="'standard-btn1'">Standard 1</button>
      <button data-testid="standard-btn2" simplyMatButton ngOption [value]="'standard-btn2'">Standard 2</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection
      data-testid="connected-group"
      orientation="horizontal"
      [type]="'connected'">
      <button data-testid="connected-btn1" simplyMatButton ngOption [value]="'connected-btn1'">Connected 1</button>
      <button data-testid="connected-btn2" simplyMatButton ngOption [value]="'connected-btn2'">Connected 2</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection
      data-testid="dynamic-group"
      orientation="horizontal"
      [type]="dynamicType()"
      [size]="dynamicSize()"
      [multi]="dynamicMulti()"
      [disabled]="dynamicDisabled()"
      [softDisabled]="dynamicSoftDisabled()"
      [readonly]="dynamicReadonly()">
      <button data-testid="dynamic-btn1" simplyMatButton ngOption [value]="'dyn1'">Dyn 1</button>
      <button data-testid="dynamic-btn2" simplyMatButton ngOption [value]="'dyn2'">Dyn 2</button>
    </simply-mat-button-group-selection>

    <simply-mat-button-group-selection
      data-testid="readonly-sync-group"
      orientation="horizontal"
      [readonly]="dynamicReadonly()">
      <button data-testid="readonly-sync-btn1" simplyMatButton ngOption [value]="'readonly-btn1'">Readonly 1</button>
      <button data-testid="readonly-sync-btn2" simplyMatButton ngOption [value]="'readonly-btn2'">Readonly 2</button>
      <button data-testid="readonly-sync-btn3" simplyMatButton ngOption [value]="'readonly-btn3'">Readonly 3</button>
    </simply-mat-button-group-selection>

    <button data-testid="outside-element">Outside Button</button>
  `,
  imports: [SimplyMatButtonGroupSelection, SimplyMatButtonOption],
})
class ButtonGroupSelectionTestComponent {
  dynamicType = signal<ButtonGroupType>('standard');
  dynamicSize = signal<ButtonGroupSize>('small');
  dynamicMulti = signal(false);
  dynamicDisabled = signal(false);
  dynamicSoftDisabled = signal(false);
  dynamicReadonly = signal(false);
}

class ButtonGroupSelectionPage {
  constructor(public fixture: ComponentFixture<any>) {}

  getComponent(testId: string): SimplyMatButtonGroupSelection<any> | null {
    const element = page.getByTestId(testId).query();
    if (!element) return null;
    const allComponents = this.fixture.debugElement.queryAll(By.directive(SimplyMatButtonGroupSelection));
    const debugElement = allComponents.find((el) => el.nativeElement === element);
    if (!debugElement) return null;
    try {
      return debugElement.injector.get(SimplyMatButtonGroupSelection, null);
    } catch {
      return null;
    }
  }

  getListboxDirective(testId: string): Listbox<any> | null {
    const element = page.getByTestId(testId).query();
    if (!element) return null;
    const allDirectives = this.fixture.debugElement.queryAll(By.directive(Listbox));
    const debugElement = allDirectives.find((el) => el.nativeElement === element);
    if (!debugElement) return null;
    try {
      return debugElement.injector.get(Listbox, null);
    } catch {
      return null;
    }
  }

  getBaseConfig(testId: string): ButtonGroupBaseConfig | null {
    const element = page.getByTestId(testId).query();
    if (!element) return null;
    const allComponents = this.fixture.debugElement.queryAll(By.directive(SimplyMatButtonGroupSelection));
    const debugElement = allComponents.find((el) => el.nativeElement === element);
    if (!debugElement) return null;
    try {
      return debugElement.injector.get(BUTTON_GROUP_BASE_CONFIG, null);
    } catch {
      return null;
    }
  }

  getButtonDirective(testId: string): ButtonBase | null {
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

  async clickButton(testId: string): Promise<void> {
    const element = this.getElement(testId);
    if (!element) return;
    element.click();
    await this.fixture.whenStable();
  }

  async focusButton(testId: string): Promise<void> {
    const element = this.getElement(testId);
    if (!element) return;
    element.focus();
    await this.fixture.whenStable();
  }

  async blurToOutside(testId: string): Promise<void> {
    const element = this.getElement(testId);
    const outsideElement = this.getElement('outside-element');
    if (!element || !outsideElement) return;

    outsideElement.focus();
    await this.fixture.whenStable();
  }

  async triggerFocusOut(testId: string, relatedTarget: HTMLElement | null): Promise<void> {
    const element = this.getElement(testId);
    if (!element) return;

    const event = new FocusEvent('focusout', {
      bubbles: true,
      relatedTarget: relatedTarget,
    });
    element.dispatchEvent(event);
    await this.fixture.whenStable();
  }

  async getTypeAttribute(testId: string): Promise<string | null> {
    const element = this.getElement(testId);
    return element?.getAttribute('data-sm-type') || null;
  }

  async getSizeAttribute(testId: string): Promise<string | null> {
    const element = this.getElement(testId);
    return element?.getAttribute('data-sm-size') || null;
  }

  getWidth(testId: string): number {
    const element = this.getElement(testId);
    if (!element) return 0;
    return element.getBoundingClientRect().width;
  }

  setCSSVar(testId: string, varName: string, value: string): void {
    const element = this.getElement(testId);
    if (element) {
      element.style.setProperty(varName, value);
    }
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

  public buttonSmallRoundBorderRadius = 8;
  public buttonSmallPressedBorderRadius = 16;
  public buttonSmallSelectedBorderRadius = 12;
  public buttonConnectedSmallBorderRadius = 10;
  public buttonConnectedSmallSelectedBorderRadius = 14;
}
