import { Component, signal, Signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, test, expect, beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import {
  SimplyMatButtonGroupBase,
  ButtonGroupType,
  ButtonGroupSize,
  ButtonGroupDefaultShape
} from './button-group-base';

describe('SimplyMatButtonGroupBase', () => {
  let fixture: ComponentFixture<ButtonGroupTestComponent>;
  let pageModel: ButtonGroupBasePage;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ButtonGroupTestComponent);
    await fixture.whenStable();
    pageModel = new ButtonGroupBasePage(fixture);
  });

  describe('default configuration', () => {
    test('should create component with default values', () => {
      const component = pageModel.getComponent('default-group');

      expect(component).not.toBeNull();
    });

    test('should have default type of "standard"', () => {
      const component = pageModel.getComponent('default-group');

      expect(component?.type()).toBe('standard');
    });

    test('should have default size of "small"', () => {
      const component = pageModel.getComponent('default-group');

      expect(component?.size()).toBe('small');
    });

    test('should have default defaultButtonShape of "round"', () => {
      const component = pageModel.getComponent('default-group');

      expect(component?.defaultButtonShape()).toBe('round');
    });

    test('should have default disableWidthAnimations of false', () => {
      const component = pageModel.getComponent('default-group');

      expect(component?.disableWidthAnimations()).toBe(false);
    });
  });

  describe('type input', () => {
    test('should accept "standard" type', () => {
      const component = pageModel.getComponent('type-group');

      expect(component?.type()).toBe('standard');
    });

    test('should accept "connected" type', async () => {
      fixture.componentInstance.dynamicType.set('connected');
      await fixture.whenStable();

      const component = pageModel.getComponent('dynamic-group');

      expect(component?.type()).toBe('connected');
    });
  });

  describe('size input', () => {
    test('should accept "xsmall" size', () => {
      const component = pageModel.getComponent('size-xsmall-group');

      expect(component?.size()).toBe('xsmall');
    });

    test('should accept "small" size', () => {
      const component = pageModel.getComponent('size-small-group');

      expect(component?.size()).toBe('small');
    });

    test('should accept "medium" size', () => {
      const component = pageModel.getComponent('size-medium-group');

      expect(component?.size()).toBe('medium');
    });

    test('should accept "large" size', () => {
      const component = pageModel.getComponent('size-large-group');

      expect(component?.size()).toBe('large');
    });

    test('should accept "xlarge" size', () => {
      const component = pageModel.getComponent('size-xlarge-group');

      expect(component?.size()).toBe('xlarge');
    });
  });

  describe('defaultButtonShape input', () => {
    test('should accept "round" shape', () => {
      const component = pageModel.getComponent('shape-round-group');

      expect(component?.defaultButtonShape()).toBe('round');
    });

    test('should accept "square" shape', () => {
      const component = pageModel.getComponent('shape-square-group');

      expect(component?.defaultButtonShape()).toBe('square');
    });
  });

  describe('disableWidthAnimations input', () => {
    test('should accept true value', () => {
      const component = pageModel.getComponent('disable-animations-group');

      expect(component?.disableWidthAnimations()).toBe(true);
    });

    test('should accept false value', () => {
      const component = pageModel.getComponent('default-group');

      expect(component?.disableWidthAnimations()).toBe(false);
    });
  });

  describe('disabled, softDisabled, and readonly inputs', () => {
    test('should have default disabled value of false', () => {
      const component = pageModel.getComponent('default-group');

      expect(component?.disabled()).toBe(false);
    });

    test('should have default softDisabled value of false', () => {
      const component = pageModel.getComponent('default-group');

      expect(component?.softDisabled()).toBe(false);
    });

    test('should have default readonly value of false', () => {
      const component = pageModel.getComponent('default-group');

      expect(component?.readonly()).toBe(false);
    });

    test('should accept disabled true value', () => {
      const component = pageModel.getComponent('disabled-true-group');

      expect(component?.disabled()).toBe(true);
    });

    test('should accept softDisabled true value', () => {
      const component = pageModel.getComponent('soft-disabled-true-group');

      expect(component?.softDisabled()).toBe(true);
    });

    test('should accept readonly true value', () => {
      const component = pageModel.getComponent('readonly-true-group');

      expect(component?.readonly()).toBe(true);
    });

    test('should update disabled reactively', async () => {
      fixture.componentInstance.dynamicDisabled.set(false);
      await fixture.whenStable();

      let component = pageModel.getComponent('dynamic-group');
      expect(component?.disabled()).toBe(false);

      fixture.componentInstance.dynamicDisabled.set(true);
      await fixture.whenStable();

      component = pageModel.getComponent('dynamic-group');
      expect(component?.disabled()).toBe(true);
    });

    test('should update softDisabled reactively', async () => {
      fixture.componentInstance.dynamicSoftDisabled.set(false);
      await fixture.whenStable();

      let component = pageModel.getComponent('dynamic-group');
      expect(component?.softDisabled()).toBe(false);

      fixture.componentInstance.dynamicSoftDisabled.set(true);
      await fixture.whenStable();

      component = pageModel.getComponent('dynamic-group');
      expect(component?.softDisabled()).toBe(true);
    });

    test('should update readonly reactively', async () => {
      fixture.componentInstance.dynamicReadonly.set(false);
      await fixture.whenStable();

      let component = pageModel.getComponent('dynamic-group');
      expect(component?.readonly()).toBe(false);

      fixture.componentInstance.dynamicReadonly.set(true);
      await fixture.whenStable();

      component = pageModel.getComponent('dynamic-group');
      expect(component?.readonly()).toBe(true);
    });
  });

  describe('host attribute bindings', () => {
    test('should bind data-sm-type to type input', async () => {
      const typeAttr = await pageModel.getTypeAttribute('type-group');

      expect(typeAttr).toBe('standard');
    });

    test('should bind data-sm-size to size input', async () => {
      const sizeAttr = await pageModel.getSizeAttribute('size-xlarge-group');

      expect(sizeAttr).toBe('xlarge');
    });

    test('should update data-sm-type when type input changes', async () => {
      fixture.componentInstance.dynamicType.set('standard');
      await fixture.whenStable();

      let typeAttr = await pageModel.getTypeAttribute('dynamic-group');
      expect(typeAttr).toBe('standard');

      fixture.componentInstance.dynamicType.set('connected');
      await fixture.whenStable();

      typeAttr = await pageModel.getTypeAttribute('dynamic-group');
      expect(typeAttr).toBe('connected');
    });

    test('should update data-sm-size when size input changes', async () => {
      fixture.componentInstance.dynamicSize.set('small');
      await fixture.whenStable();

      let sizeAttr = await pageModel.getSizeAttribute('dynamic-group');
      expect(sizeAttr).toBe('small');

      fixture.componentInstance.dynamicSize.set('large');
      await fixture.whenStable();

      sizeAttr = await pageModel.getSizeAttribute('dynamic-group');
      expect(sizeAttr).toBe('large');
    });
  });

  describe('template rendering', () => {
    test('should render ng-content', async () => {
      const content = await pageModel.getContentText('content-group');

      expect(content).toContain('Test Content');
    });

    test('should project multiple elements', async () => {
      const buttons = await pageModel.getAllButtons('multi-content-group');

      expect(buttons.length).toBe(3);
    });
  });
});

@Component({
  template: `
    <simply-mat-button-group data-testid="default-group">
      Default Group
    </simply-mat-button-group>

    <simply-mat-button-group 
      data-testid="type-group"
      [type]="'standard'">
      Type Group
    </simply-mat-button-group>

    <simply-mat-button-group 
      data-testid="size-xsmall-group"
      [size]="'xsmall'">
      XSmall Group
    </simply-mat-button-group>

    <simply-mat-button-group 
      data-testid="size-small-group"
      [size]="'small'">
      Small Group
    </simply-mat-button-group>

    <simply-mat-button-group 
      data-testid="size-medium-group"
      [size]="'medium'">
      Medium Group
    </simply-mat-button-group>

    <simply-mat-button-group 
      data-testid="size-large-group"
      [size]="'large'">
      Large Group
    </simply-mat-button-group>

    <simply-mat-button-group 
      data-testid="size-xlarge-group"
      [size]="'xlarge'">
      XLarge Group
    </simply-mat-button-group>

    <simply-mat-button-group 
      data-testid="shape-round-group"
      [defaultButtonShape]="'round'">
      Round Shape Group
    </simply-mat-button-group>

    <simply-mat-button-group 
      data-testid="shape-square-group"
      [defaultButtonShape]="'square'">
      Square Shape Group
    </simply-mat-button-group>

    <simply-mat-button-group 
      data-testid="disable-animations-group"
      [disableWidthAnimations]="true">
      Disable Animations Group
    </simply-mat-button-group>

    <simply-mat-button-group 
      data-testid="dynamic-group"
      [type]="dynamicType()"
      [size]="dynamicSize()"
      [defaultButtonShape]="dynamicShape()"
      [disableWidthAnimations]="dynamicDisableAnimations()"
      [disabled]="dynamicDisabled()"
      [softDisabled]="dynamicSoftDisabled()"
      [readonly]="dynamicReadonly()">
      Dynamic Group
    </simply-mat-button-group>

    <simply-mat-button-group 
      data-testid="disabled-true-group"
      [disabled]="true">
      Disabled Group
    </simply-mat-button-group>

    <simply-mat-button-group 
      data-testid="soft-disabled-true-group"
      [softDisabled]="true">
      Soft Disabled Group
    </simply-mat-button-group>

    <simply-mat-button-group 
      data-testid="readonly-true-group"
      [readonly]="true">
      Readonly Group
    </simply-mat-button-group>

    <simply-mat-button-group data-testid="content-group">
      Test Content
    </simply-mat-button-group>

    <simply-mat-button-group data-testid="multi-content-group">
      <button>Button 1</button>
      <button>Button 2</button>
      <button>Button 3</button>
    </simply-mat-button-group>
  `,
  imports: [SimplyMatButtonGroupBase],
})
class ButtonGroupTestComponent {
  dynamicType = signal<ButtonGroupType>('standard');
  dynamicSize = signal<ButtonGroupSize>('small');
  dynamicShape = signal<ButtonGroupDefaultShape>('round');
  dynamicDisableAnimations = signal(false);
  dynamicDisabled = signal(false);
  dynamicSoftDisabled = signal(false);
  dynamicReadonly = signal(false);
}

class ButtonGroupBasePage {
  constructor(public fixture: ComponentFixture<ButtonGroupTestComponent>) {}

  getComponent(testId: string): SimplyMatButtonGroupBase | null {
    const element = page.getByTestId(testId).query();
    if (!element) return null;
    const allComponents = this.fixture.debugElement.queryAll(By.directive(SimplyMatButtonGroupBase));
    const debugElement = allComponents.find((el) => el.nativeElement === element);
    if (!debugElement) return null;
    try {
      return debugElement.injector.get(SimplyMatButtonGroupBase, null);
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

  async getContentText(testId: string): Promise<string> {
    const element = page.getByTestId(testId).query();
    return element?.textContent || '';
  }

  async getAllButtons(testId: string): Promise<Element[]> {
    const element = page.getByTestId(testId).query();
    if (!element) return [];
    return Array.from(element.querySelectorAll('button'));
  }
}

