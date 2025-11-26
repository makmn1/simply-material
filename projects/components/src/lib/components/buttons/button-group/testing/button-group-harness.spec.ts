import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, test, expect, beforeEach} from 'vitest';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {SimplyMatButtonGroup} from '../button-group';
import {SimplyMatButtonGroupSelection} from '../button-group-selection';
import {SimplyMatButton} from '../../button/button';
import {SimplyMatButtonOption} from '../../button/button-option';
import {SimplyMatIconButton} from '../../icon-button/icon-button';
import {SimplyMatIconButtonOption} from '../../icon-button/icon-button-option';
import {SimplyMatButtonGroupHarness} from './button-group-harness';
import {SimplyMatButtonGroupSelectionHarness} from './button-group-selection-harness';
import {ButtonGroupType, ButtonGroupSize} from './button-group-harness-filters';
import {loadButtonShapeMorphTestCssVars} from '../../core/button-shape-morph/button-shape-morph-test-helpers';
import {Option} from '@angular/aria/listbox';

describe('SimplyMatButtonGroupHarness', () => {
  describe('basic functionality', () => {
    let fixture: ComponentFixture<ButtonGroupTestComponent>;
    let loader: HarnessLoader;
    let page: ButtonGroupPage;

    beforeEach(async () => {
      loadButtonShapeMorphTestCssVars();

      fixture = TestBed.createComponent(ButtonGroupTestComponent);
      loader = TestbedHarnessEnvironment.loader(fixture);
      page = new ButtonGroupPage(fixture);
      fixture.detectChanges();
    });

    test('should load harness for button group', async () => {
      const harnesses = await loader.getAllHarnesses(SimplyMatButtonGroupHarness);
      expect(harnesses.length).toBe(4);
    });

    test('should get button group type', async () => {
      const standardGroup = await page.getStandardGroup();
      const connectedGroup = await page.getConnectedGroup();

      expect(await standardGroup.getType()).toBe('standard');
      expect(await connectedGroup.getType()).toBe('connected');
    });

    test('should get button group size', async () => {
      const smallGroup = await page.getSmallGroup();
      const largeGroup = await page.getLargeGroup();

      expect(await smallGroup.getSize()).toBe('small');
      expect(await largeGroup.getSize()).toBe('large');
    });

    test('should get all buttons in group', async () => {
      const group = await page.getStandardGroup();
      const buttons = await group.getButtons();

      expect(buttons.length).toBe(3);
    });

    test('should get all icon buttons in group', async () => {
      const group = await page.getMixedGroup();
      const iconButtons = await group.getIconButtons();

      expect(iconButtons.length).toBe(2);
    });

    test('should get all buttons (regular and icon) in group', async () => {
      const group = await page.getMixedGroup();
      const allButtons = await group.getAllButtons();

      expect(allButtons.length).toBe(4);
    });

    test('should filter button groups by type', async () => {
      const standardGroups = await loader.getAllHarnesses(
        SimplyMatButtonGroupHarness.with({type: 'standard'})
      );
      const connectedGroups = await loader.getAllHarnesses(
        SimplyMatButtonGroupHarness.with({type: 'connected'})
      );

      expect(standardGroups.length).toBe(3);
      expect(connectedGroups.length).toBe(1);
    });

    test('should filter button groups by size', async () => {
      const smallGroups = await loader.getAllHarnesses(
        SimplyMatButtonGroupHarness.with({size: 'small'})
      );
      const largeGroups = await loader.getAllHarnesses(
        SimplyMatButtonGroupHarness.with({size: 'large'})
      );

      expect(smallGroups.length).toBe(3);
      expect(largeGroups.length).toBe(1);
    });

    test('should interact with buttons in group', async () => {
      const group = await page.getStandardGroup();
      const buttons = await group.getButtons();
      const firstButton = buttons[0];

      await firstButton.click();
      await fixture.whenStable();

      expect(fixture.componentInstance.clickCount()).toBe(1);
    });
  });

  describe('dynamic properties', () => {
    let fixture: ComponentFixture<DynamicButtonGroupComponent>;
    let loader: HarnessLoader;

    beforeEach(async () => {
      fixture = TestBed.createComponent(DynamicButtonGroupComponent);
      loader = TestbedHarnessEnvironment.loader(fixture);
      fixture.detectChanges();
    });

    test('should get updated type', async () => {
      const harness = await loader.getHarness(SimplyMatButtonGroupHarness);

      expect(await harness.getType()).toBe('standard');

      fixture.componentInstance.type.set('connected');
      fixture.detectChanges();

      expect(await harness.getType()).toBe('connected');
    });

    test('should get updated size', async () => {
      const harness = await loader.getHarness(SimplyMatButtonGroupHarness);

      expect(await harness.getSize()).toBe('small');

      fixture.componentInstance.size.set('xlarge');
      fixture.detectChanges();

      expect(await harness.getSize()).toBe('xlarge');
    });
  });
});

describe('SimplyMatButtonGroupSelectionHarness', () => {
  describe('basic functionality', () => {
    let fixture: ComponentFixture<ButtonGroupSelectionTestComponent>;
    let loader: HarnessLoader;
    let page: ButtonGroupSelectionPage;

    beforeEach(async () => {
      fixture = TestBed.createComponent(ButtonGroupSelectionTestComponent);
      loader = TestbedHarnessEnvironment.loader(fixture);
      page = new ButtonGroupSelectionPage(fixture);
      fixture.detectChanges();
    });

    test('should load harness for button group selection', async () => {
      const harnesses = await loader.getAllHarnesses(SimplyMatButtonGroupSelectionHarness);
      expect(harnesses.length).toBe(3);
    });

    test('should detect single selection mode', async () => {
      const singleGroup = await page.getSingleSelectionGroup();
      expect(await singleGroup.isMultiSelection()).toBe(false);
    });

    test('should detect multi selection mode', async () => {
      const multiGroup = await page.getMultiSelectionGroup();
      expect(await multiGroup.isMultiSelection()).toBe(true);
    });

    test('should get orientation', async () => {
      const horizontalGroup = await page.getHorizontalGroup();
      expect(await horizontalGroup.getOrientation()).toBe('horizontal');
    });

    test('should get selected buttons', async () => {
      const group = await page.getSingleSelectionGroup();

      let selectedButtons = await group.getSelectedButtons();
      expect(selectedButtons.length).toBe(0);

      await group.selectButtonByIndex(1);
      await fixture.whenStable();

      selectedButtons = await group.getSelectedButtons();
      expect(selectedButtons.length).toBe(1);
    });

    test('should select button by index', async () => {
      const group = await page.getSingleSelectionGroup();

      await group.selectButtonByIndex(0);
      await fixture.whenStable();

      const selectedButtons = await group.getSelectedButtons();
      expect(selectedButtons.length).toBe(1);
      expect(await selectedButtons[0].getText()).toContain('Option 1');
    });

    test('should select button by text', async () => {
      const group = await page.getSingleSelectionGroup();

      await group.selectButtonByText('Option 2');
      await fixture.whenStable();

      const selectedButtons = await group.getSelectedButtons();
      expect(selectedButtons.length).toBe(1);
      expect(await selectedButtons[0].getText()).toContain('Option 2');
    });

    test('should handle multiple selections in multi mode', async () => {
      const group = await page.getMultiSelectionGroup();

      await group.selectButtonByIndex(0);
      await fixture.whenStable();
      await group.selectButtonByIndex(2);
      await fixture.whenStable();

      const selectedButtons = await group.getSelectedButtons();
      expect(selectedButtons.length).toBe(2);
    });

    test('should deselect button in multi mode', async () => {
      const group = await page.getMultiSelectionGroup();

      await group.selectButtonByIndex(0);
      await fixture.whenStable();
      await group.selectButtonByIndex(1);
      await fixture.whenStable();

      let selectedButtons = await group.getSelectedButtons();
      expect(selectedButtons.length).toBe(2);

      await group.deselectButtonByIndex(0);
      await fixture.whenStable();

      selectedButtons = await group.getSelectedButtons();
      expect(selectedButtons.length).toBe(1);
    });

    test('should throw error when deselecting in single mode', async () => {
      const group = await page.getSingleSelectionGroup();

      await expect(group.deselectButtonByIndex(0)).rejects.toThrow('Cannot deselect in single-selection mode');
    });

    test('should throw error for out of bounds index', async () => {
      const group = await page.getSingleSelectionGroup();

      await expect(group.selectButtonByIndex(99)).rejects.toThrow('out of bounds');
    });

    test('should throw error when button text not found', async () => {
      const group = await page.getSingleSelectionGroup();

      await expect(group.selectButtonByText('Nonexistent')).rejects.toThrow('not found');
    });

    test('should deselect button by text in multi mode', async () => {
      const group = await page.getMultiSelectionGroup();

      await group.selectButtonByText('Option A');
      await fixture.whenStable();
      await group.selectButtonByText('Option B');
      await fixture.whenStable();

      let selectedButtons = await group.getSelectedButtons();
      expect(selectedButtons.length).toBe(2);

      await group.deselectButtonByText('Option A');
      await fixture.whenStable();

      selectedButtons = await group.getSelectedButtons();
      expect(selectedButtons.length).toBe(1);
      expect(await selectedButtons[0].getText()).toContain('Option B');
    });

    test('should check disabled state', async () => {
      const group = await page.getSingleSelectionGroup();

      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(await group.isDisabled()).toBe(true);

      fixture.componentInstance.disabled.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(await group.isDisabled()).toBe(false);
    });

    test('should check readonly state', async () => {
      fixture.componentInstance.readonly.set(true);
      fixture.detectChanges();

      const group = await page.getMultiSelectionGroup();
      expect(await group.isReadonly()).toBe(true);

      fixture.componentInstance.readonly.set(false);
      fixture.detectChanges();

      expect(await group.isReadonly()).toBe(false);
    });

    test('should inherit button group properties', async () => {
      const group = await page.getSingleSelectionGroup();

      expect(await group.getType()).toBe('standard');
      expect(await group.getSize()).toBe('small');
    });
  });

  describe('with mixed button types', () => {
    let fixture: ComponentFixture<MixedButtonSelectionComponent>;
    let loader: HarnessLoader;

    beforeEach(async () => {
      fixture = TestBed.createComponent(MixedButtonSelectionComponent);
      loader = TestbedHarnessEnvironment.loader(fixture);
      fixture.detectChanges();
    });

    test('should handle selection with mixed button types', async () => {
      const harness = await loader.getHarness(SimplyMatButtonGroupSelectionHarness);

      const allButtons = await harness.getAllButtons();
      expect(allButtons.length).toBe(4);

      await harness.selectButtonByIndex(0);
      await fixture.whenStable();
      await harness.selectButtonByIndex(2);
      await fixture.whenStable();

      const selectedButtons = await harness.getSelectedButtons();
      expect(selectedButtons.length).toBe(2);
    });
  });
});


@Component({
  template: `
    <!-- Standard button group -->
    <simply-mat-button-group data-testid="standard-group" type="standard" size="small">
      <button simplyMatButton (click)="incrementClick()">Button 1</button>
      <button simplyMatButton (click)="incrementClick()">Button 2</button>
      <button simplyMatButton (click)="incrementClick()">Button 3</button>
    </simply-mat-button-group>

    <!-- Connected button group -->
    <simply-mat-button-group data-testid="connected-group" type="connected" size="small">
      <button simplyMatButton>Connect 1</button>
      <button simplyMatButton>Connect 2</button>
    </simply-mat-button-group>

    <!-- Large button group -->
    <simply-mat-button-group data-testid="large-group" type="standard" size="large">
      <button simplyMatButton>Large 1</button>
      <button simplyMatButton>Large 2</button>
    </simply-mat-button-group>

    <!-- Mixed button types -->
    <simply-mat-button-group data-testid="mixed-group" type="standard" size="small">
      <button simplyMatButton>Regular 1</button>
      <button simplyMatIconButton>Icon 1</button>
      <button simplyMatButton>Regular 2</button>
      <button simplyMatIconButton>Icon 2</button>
    </simply-mat-button-group>
  `,
  imports: [SimplyMatButtonGroup, SimplyMatButton, SimplyMatIconButton],
})
class ButtonGroupTestComponent {
  clickCount = signal(0);

  incrementClick() {
    this.clickCount.update(count => count + 1);
  }
}

@Component({
  template: `
    <simply-mat-button-group
      [type]="type()"
      [size]="size()">
      <button simplyMatButton>Dynamic Button</button>
    </simply-mat-button-group>
  `,
  imports: [SimplyMatButtonGroup, SimplyMatButton],
})
class DynamicButtonGroupComponent {
  type = signal<ButtonGroupType>('standard');
  size = signal<ButtonGroupSize>('small');
}

@Component({
  template: `
    <!-- Single selection group -->
    <simply-mat-button-group-selection
      data-testid="single-group"
      orientation="horizontal"
      [disabled]="disabled()">
      <button simplyMatButton ngOption [value]="1">Option 1</button>
      <button simplyMatButton ngOption [value]="2">Option 2</button>
      <button simplyMatButton ngOption [value]="3">Option 3</button>
    </simply-mat-button-group-selection>

    <!-- Multi selection group -->
    <simply-mat-button-group-selection
      data-testid="multi-group"
      orientation="horizontal"
      [multi]="true"
      selectionMode="explicit"
      [readonly]="readonly()"> <!-- TODO: Read only shouldn't allow select. When we fix this, update the tests -->
      <button simplyMatButton ngOption [value]="'a'">Option A</button>
      <button simplyMatButton ngOption [value]="'b'">Option B</button>
      <button simplyMatButton ngOption [value]="'c'">Option C</button>
    </simply-mat-button-group-selection>

    <!-- Horizontal orientation (explicit) -->
    <simply-mat-button-group-selection
      data-testid="horizontal-group"
      orientation="horizontal">
      <button simplyMatButton ngOption [value]="'x'">X</button>
      <button simplyMatButton ngOption [value]="'y'">Y</button>
    </simply-mat-button-group-selection>
  `,
  imports: [SimplyMatButtonGroupSelection, SimplyMatButtonOption, Option],
})
class ButtonGroupSelectionTestComponent {
  disabled = signal(false);
  readonly = signal(false);
}

@Component({
  template: `
    <simply-mat-button-group-selection
      orientation="horizontal"
      selectionMode="explicit"
      [multi]="true">
      <button simplyMatButton ngOption [value]="1">Regular 1</button>
      <button simplyMatIconButton ngOption [value]="2">Icon 1</button>
      <button simplyMatButton ngOption [value]="3">Regular 2</button>
      <button simplyMatIconButton ngOption [value]="4">Icon 2</button>
    </simply-mat-button-group-selection>
  `,
  imports: [SimplyMatButtonGroupSelection, SimplyMatButtonOption, SimplyMatIconButtonOption, Option],
})
class MixedButtonSelectionComponent {}


class ButtonGroupPage {
  constructor(protected fixture: ComponentFixture<ButtonGroupTestComponent>) {}

  async getStandardGroup(): Promise<SimplyMatButtonGroupHarness> {
    const loader = TestbedHarnessEnvironment.loader(this.fixture);
    return loader.getHarness(
      SimplyMatButtonGroupHarness.with({selector: '[data-testid="standard-group"]'})
    );
  }

  async getConnectedGroup(): Promise<SimplyMatButtonGroupHarness> {
    const loader = TestbedHarnessEnvironment.loader(this.fixture);
    return loader.getHarness(
      SimplyMatButtonGroupHarness.with({selector: '[data-testid="connected-group"]'})
    );
  }

  async getSmallGroup(): Promise<SimplyMatButtonGroupHarness> {
    const loader = TestbedHarnessEnvironment.loader(this.fixture);
    return loader.getHarness(
      SimplyMatButtonGroupHarness.with({selector: '[data-testid="standard-group"]'})
    );
  }

  async getLargeGroup(): Promise<SimplyMatButtonGroupHarness> {
    const loader = TestbedHarnessEnvironment.loader(this.fixture);
    return loader.getHarness(
      SimplyMatButtonGroupHarness.with({selector: '[data-testid="large-group"]'})
    );
  }

  async getMixedGroup(): Promise<SimplyMatButtonGroupHarness> {
    const loader = TestbedHarnessEnvironment.loader(this.fixture);
    return loader.getHarness(
      SimplyMatButtonGroupHarness.with({selector: '[data-testid="mixed-group"]'})
    );
  }
}

class ButtonGroupSelectionPage {
  constructor(protected fixture: ComponentFixture<ButtonGroupSelectionTestComponent>) {}

  async getSingleSelectionGroup(): Promise<SimplyMatButtonGroupSelectionHarness> {
    const loader = TestbedHarnessEnvironment.loader(this.fixture);
    return loader.getHarness(
      SimplyMatButtonGroupSelectionHarness.with({selector: '[data-testid="single-group"]'})
    );
  }

  async getMultiSelectionGroup(): Promise<SimplyMatButtonGroupSelectionHarness> {
    const loader = TestbedHarnessEnvironment.loader(this.fixture);
    return loader.getHarness(
      SimplyMatButtonGroupSelectionHarness.with({selector: '[data-testid="multi-group"]'})
    );
  }

  async getHorizontalGroup(): Promise<SimplyMatButtonGroupSelectionHarness> {
    const loader = TestbedHarnessEnvironment.loader(this.fixture);
    return loader.getHarness(
      SimplyMatButtonGroupSelectionHarness.with({selector: '[data-testid="horizontal-group"]'})
    );
  }
}

