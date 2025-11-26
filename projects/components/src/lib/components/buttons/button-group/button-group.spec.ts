import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, test, expect, beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import { SimplyMatButtonGroup } from './button-group';
import { SimplyMatButtonGroupBase, ButtonGroupType, ButtonGroupSize, ButtonGroupDefaultShape } from './button-group-base';

describe('SimplyMatButtonGroup', () => {
  let fixture: ComponentFixture<ButtonGroupTestComponent>;
  let pageModel: ButtonGroupPage;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ButtonGroupTestComponent);
    await fixture.whenStable();
    pageModel = new ButtonGroupPage(fixture);
  });

  describe('component inheritance', () => {
    test('should extend SimplyMatButtonGroupBase', () => {
      const component = pageModel.getComponent('default-group');

      expect(component).toBeInstanceOf(SimplyMatButtonGroupBase);
    });

    test('should inherit type input with default value "standard"', () => {
      const component = pageModel.getComponent('default-group');

      expect(component?.type()).toBe('standard');
    });

    test('should inherit size input with default value "small"', () => {
      const component = pageModel.getComponent('default-group');

      expect(component?.size()).toBe('small');
    });

    test('should inherit defaultButtonShape input with default value "round"', () => {
      const component = pageModel.getComponent('default-group');

      expect(component?.defaultButtonShape()).toBe('round');
    });

    test('should inherit disableWidthAnimations input with default value false', () => {
      const component = pageModel.getComponent('default-group');

      expect(component?.disableWidthAnimations()).toBe(false);
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
  });

  describe('provider configuration', () => {
    let providerFixture: ComponentFixture<ButtonGroupProviderTestComponent>;
    let providerPageModel: ButtonGroupPage;

    beforeEach(async () => {
      providerFixture = TestBed.createComponent(ButtonGroupProviderTestComponent);
      await providerFixture.whenStable();
      providerPageModel = new ButtonGroupPage(providerFixture);
    });

    test('should provide SimplyMatButtonGroupBase via forwardRef', () => {
      const debugElement = providerFixture.debugElement.query(By.directive(SimplyMatButtonGroup));
      const injectedBase = debugElement?.injector.get(SimplyMatButtonGroupBase, null);

      expect(injectedBase).not.toBeNull();
    });

    test('should resolve SimplyMatButtonGroupBase provider to SimplyMatButtonGroup instance', () => {
      const debugElement = providerFixture.debugElement.query(By.directive(SimplyMatButtonGroup));
      const injectedBase = debugElement?.injector.get(SimplyMatButtonGroupBase, null);

      expect(injectedBase).toBeInstanceOf(SimplyMatButtonGroup);
    });

    test('should provide same instance for SimplyMatButtonGroupBase and SimplyMatButtonGroup', () => {
      const buttonGroup = providerPageModel.getComponent('provider-test-group');
      const debugElement = providerFixture.debugElement.query(By.directive(SimplyMatButtonGroup));
      const injectedBase = debugElement?.injector.get(SimplyMatButtonGroupBase, null);

      expect(injectedBase).toBe(buttonGroup);
    });
  });

  describe('selector', () => {
    test('should have selector "simply-mat-button-group:not([ngListbox])"', () => {
      const element = page.getByTestId('default-group').query();

      expect(element?.tagName.toLowerCase()).toBe('simply-mat-button-group');
    });

    test('should render component correctly with its selector', async () => {
      const component = pageModel.getComponent('default-group');

      expect(component).not.toBeNull();
      await expect.element(page.getByTestId('default-group')).toBeInTheDocument();
    });
  });

  describe('host attribute bindings', () => {
    test('should bind data-sm-type attribute', async () => {
      const typeAttr = await pageModel.getTypeAttribute('type-standard-group');

      expect(typeAttr).toBe('standard');
    });

    test('should bind data-sm-size attribute', async () => {
      const sizeAttr = await pageModel.getSizeAttribute('size-large-group');

      expect(sizeAttr).toBe('large');
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
  });

  describe('input properties', () => {
    test('should accept all ButtonGroupType values', () => {
      const standardGroup = pageModel.getComponent('type-standard-group');
      expect(standardGroup?.type()).toBe('standard');

      const connectedGroup = pageModel.getComponent('type-connected-group');
      expect(connectedGroup?.type()).toBe('connected');
    });

    test('should accept all ButtonGroupSize values', () => {
      const xsmallGroup = pageModel.getComponent('size-xsmall-group');
      expect(xsmallGroup?.size()).toBe('xsmall');

      const smallGroup = pageModel.getComponent('size-small-group');
      expect(smallGroup?.size()).toBe('small');

      const mediumGroup = pageModel.getComponent('size-medium-group');
      expect(mediumGroup?.size()).toBe('medium');

      const largeGroup = pageModel.getComponent('size-large-group');
      expect(largeGroup?.size()).toBe('large');

      const xlargeGroup = pageModel.getComponent('size-xlarge-group');
      expect(xlargeGroup?.size()).toBe('xlarge');
    });

    test('should accept all ButtonGroupDefaultShape values', () => {
      const roundGroup = pageModel.getComponent('shape-round-group');
      expect(roundGroup?.defaultButtonShape()).toBe('round');

      const squareGroup = pageModel.getComponent('shape-square-group');
      expect(squareGroup?.defaultButtonShape()).toBe('square');
    });

    test('should accept boolean values for disableWidthAnimations', () => {
      const disabledGroup = pageModel.getComponent('disable-animations-group');
      expect(disabledGroup?.disableWidthAnimations()).toBe(true);

      const enabledGroup = pageModel.getComponent('default-group');
      expect(enabledGroup?.disableWidthAnimations()).toBe(false);
    });
  });
});

@Component({
  template: `
    <simply-mat-button-group data-testid="default-group">
      Default Group
    </simply-mat-button-group>

    <simply-mat-button-group
      data-testid="type-standard-group"
      [type]="'standard'">
      Standard Type
    </simply-mat-button-group>

    <simply-mat-button-group
      data-testid="type-connected-group"
      [type]="'connected'">
      Connected Type
    </simply-mat-button-group>

    <simply-mat-button-group
      data-testid="size-xsmall-group"
      [size]="'xsmall'">
      XSmall Size
    </simply-mat-button-group>

    <simply-mat-button-group
      data-testid="size-small-group"
      [size]="'small'">
      Small Size
    </simply-mat-button-group>

    <simply-mat-button-group
      data-testid="size-medium-group"
      [size]="'medium'">
      Medium Size
    </simply-mat-button-group>

    <simply-mat-button-group
      data-testid="size-large-group"
      [size]="'large'">
      Large Size
    </simply-mat-button-group>

    <simply-mat-button-group
      data-testid="size-xlarge-group"
      [size]="'xlarge'">
      XLarge Size
    </simply-mat-button-group>

    <simply-mat-button-group
      data-testid="shape-round-group"
      [defaultButtonShape]="'round'">
      Round Shape
    </simply-mat-button-group>

    <simply-mat-button-group
      data-testid="shape-square-group"
      [defaultButtonShape]="'square'">
      Square Shape
    </simply-mat-button-group>

    <simply-mat-button-group
      data-testid="disable-animations-group"
      [disableWidthAnimations]="true">
      Animations Disabled
    </simply-mat-button-group>

    <simply-mat-button-group
      data-testid="dynamic-group"
      [type]="dynamicType()"
      [size]="dynamicSize()"
      [defaultButtonShape]="dynamicShape()"
      [disableWidthAnimations]="dynamicDisableAnimations()">
      Dynamic Group
    </simply-mat-button-group>
  `,
  imports: [SimplyMatButtonGroup],
})
class ButtonGroupTestComponent {
  dynamicType = signal<ButtonGroupType>('standard');
  dynamicSize = signal<ButtonGroupSize>('small');
  dynamicShape = signal<ButtonGroupDefaultShape>('round');
  dynamicDisableAnimations = signal(false);
}

@Component({
  template: `
    <simply-mat-button-group data-testid="provider-test-group">
      Provider Test
    </simply-mat-button-group>
  `,
  imports: [SimplyMatButtonGroup],
})
class ButtonGroupProviderTestComponent {}

class ButtonGroupPage {
  constructor(public fixture: ComponentFixture<any>) {}

  getComponent(testId: string): SimplyMatButtonGroup | null {
    const element = page.getByTestId(testId).query();
    if (!element) return null;
    const allComponents = this.fixture.debugElement.queryAll(By.directive(SimplyMatButtonGroup));
    const debugElement = allComponents.find((el) => el.nativeElement === element);
    if (!debugElement) return null;
    try {
      return debugElement.injector.get(SimplyMatButtonGroup, null);
    } catch {
      return null;
    }
  }

  async getTypeAttribute(testId: string): Promise<string | null> {
    const element = page.getByTestId(testId).query();
    return element?.getAttribute('data-sm-type') || null;
  }

  async getSizeAttribute(testId: string): Promise<string | null> {
    const element = page.getByTestId(testId).query();
    return element?.getAttribute('data-sm-size') || null;
  }
}

