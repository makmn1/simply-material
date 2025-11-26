import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader, parallel} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {beforeEach, describe, expect, test} from 'vitest';
import {SimplyMatButton} from '../button';
import {SimplyMatButtonHarness} from './button-harness';

describe('SimplyMatButtonHarness', () => {
  let fixture: ComponentFixture<ButtonHarnessTest>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ButtonHarnessTest);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  test('should load all button harnesses', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatButtonHarness);
    expect(buttons.length).toBe(22);
  });

  test('should load button with exact text', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatButtonHarness.with({text: 'Filled button'}));
    expect(buttons.length).toBe(1);
    expect(await buttons[0].getText()).toBe('Filled button');
  });

  test('should load button with regex label match', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatButtonHarness.with({text: /filled/i}));
    expect(buttons.length).toBe(3);
    expect(await buttons[0].getText()).toBe('Filled button');
    expect(await buttons[1].getText()).toBe('Filled anchor');
    expect(await buttons[2].getText()).toBe('Filled togglable');
  });

  test('should filter by whether a button is disabled', async () => {
    const enabledButtons = await loader.getAllHarnesses(SimplyMatButtonHarness.with({disabled: false}));
    const disabledButtons = await loader.getAllHarnesses(SimplyMatButtonHarness.with({disabled: true}));
    expect(enabledButtons.length).toBe(20);
    expect(disabledButtons.length).toBe(2);
  });

  test('should get disabled state', async () => {
    const [disabledButton, enabledButton] = await loader.getAllHarnesses(
      SimplyMatButtonHarness.with({text: /filled/i}),
    );

    expect(await disabledButton.isDisabled()).toBe(true);
    expect(await enabledButton.isDisabled()).toBe(false);
  });

  test('should get button text', async () => {
    const [firstButton, secondButton] = await loader.getAllHarnesses(SimplyMatButtonHarness);
    expect(await firstButton.getText()).toBe('Filled button');
    expect(await secondButton.getText()).toBe('Elevated button');
  });

  test('should focus and blur a button', async () => {
    const button = await loader.getHarness(SimplyMatButtonHarness.with({text: 'Elevated button'}));
    expect(await button.isFocused()).toBe(false);
    await button.focus();
    expect(await button.isFocused()).toBe(true);
    await button.blur();
    expect(await button.isFocused()).toBe(false);
  });

  test('should click a button', async () => {
    const button = await loader.getHarness(SimplyMatButtonHarness.with({text: 'Elevated button'}));
    await button.click();

    expect(fixture.componentInstance.clicked()).toBe(true);
  });

  test('should get the variant of the button', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatButtonHarness);
    const variants = await parallel(() => buttons.map(button => button.getVariant()));

    expect(variants).toEqual([
      'filled',
      'elevated',
      'tonal',
      'outlined',
      'text',
      'filled',
      'filled',
      'filled',
      'filled',
      'filled',
      'elevated',
      'elevated',
      'tonal',
      'tonal',
      'outlined',
      'outlined',
      'text',
      'filled',
      'elevated',
      'filled',
      'filled',
      'elevated',
    ]);
  });

  test('should get the size of the button', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatButtonHarness);
    const sizes = await parallel(() => buttons.map(button => button.getSize()));

    expect(sizes).toEqual([
      'small',
      'small',
      'small',
      'small',
      'small',
      'xsmall',
      'small',
      'medium',
      'large',
      'xlarge',
      'small',
      'small',
      'small',
      'small',
      'small',
      'small',
      'small',
      'small',
      'small',
      'small',
      'small',
      'small',
    ]);
  });

  test('should get the shape of the button', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatButtonHarness);
    const shapes = await parallel(() => buttons.map(button => button.getShape()));

    expect(shapes).toEqual([
      'round',
      'round',
      'round',
      'round',
      'round',
      'round',
      'round',
      'round',
      'round',
      'round',
      'round',
      'square',
      'round',
      'round',
      'round',
      'round',
      'round',
      'round',
      'round',
      'round',
      'round',
      'round',
    ]);
  });

  test('should filter buttons based on variant', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatButtonHarness.with({variant: 'tonal'}));
    expect(buttons.length).toBe(3);
    expect(await buttons[0].getText()).toBe('Tonal button');
    expect(await buttons[1].getText()).toBe('Tonal togglable');
    expect(await buttons[2].getText()).toBe('Tonal togglable selected');
  });

  test('should filter buttons based on size', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatButtonHarness.with({size: 'xlarge'}));
    expect(buttons.length).toBe(1);
    expect(await buttons[0].getText()).toBe('XLarge button');
  });

  test('should filter buttons based on shape', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatButtonHarness.with({shape: 'square'}));
    expect(buttons.length).toBe(1);
    expect(await buttons[0].getText()).toBe('Square button');
  });

  test('should get variant of a button with dynamic variant', async () => {
    const button = await loader.getHarness(
      SimplyMatButtonHarness.with({selector: '#dynamic-variant'}),
    );
    expect(await button.getVariant()).toBe('filled');
    fixture.componentInstance.dynamicVariant.set('outlined');
    expect(await button.getVariant()).toBe('outlined');
  });

  test('should check if button is togglable', async () => {
    const togglableButton = await loader.getHarness(
      SimplyMatButtonHarness.with({text: 'Filled togglable'}),
    );
    const normalButton = await loader.getHarness(
      SimplyMatButtonHarness.with({text: 'Elevated button'}),
    );

    expect(await togglableButton.isTogglable()).toBe(true);
    expect(await normalButton.isTogglable()).toBe(false);
  });

  test('should filter by togglable state', async () => {
    const togglableButtons = await loader.getAllHarnesses(
      SimplyMatButtonHarness.with({togglable: true}),
    );
    expect(togglableButtons.length).toBe(6);
  });

  test('should check if togglable button is selected', async () => {
    const unselectedButton = await loader.getHarness(
      SimplyMatButtonHarness.with({text: 'Filled togglable'}),
    );
    const selectedButton = await loader.getHarness(
      SimplyMatButtonHarness.with({text: 'Elevated togglable selected'}),
    );

    expect(await unselectedButton.isSelected()).toBe(false);
    expect(await selectedButton.isSelected()).toBe(true);
  });

  test('should filter by selected state', async () => {
    const selectedButtons = await loader.getAllHarnesses(
      SimplyMatButtonHarness.with({selected: true}),
    );
    expect(selectedButtons.length).toBe(3);
  });

  test('should toggle a togglable button', async () => {
    const button = await loader.getHarness(
      SimplyMatButtonHarness.with({text: 'Filled togglable'}),
    );

    expect(await button.isSelected()).toBe(false);
    await button.toggle();
    expect(await button.isSelected()).toBe(true);
  });

  test('should throw error when toggling non-togglable button', async () => {
    const button = await loader.getHarness(
      SimplyMatButtonHarness.with({text: 'Elevated button'}),
    );

    await expect(button.toggle()).rejects.toThrow('Cannot toggle a non-togglable button');
  });

  test('should handle anchor buttons', async () => {
    const anchorButtons = await loader.getAllHarnesses(
      SimplyMatButtonHarness.with({text: /anchor/i}),
    );
    expect(anchorButtons.length).toBe(2);
    expect(await anchorButtons[0].getText()).toBe('Filled anchor');
    expect(await anchorButtons[1].getText()).toBe('Elevated anchor');
  });

  test('should filter by multiple criteria', async () => {
    const buttons = await loader.getAllHarnesses(
      SimplyMatButtonHarness.with({
        variant: 'filled',
        togglable: true,
        selected: false,
      }),
    );
    expect(buttons.length).toBe(1);
    expect(await buttons[0].getText()).toBe('Filled togglable');
  });
});

@Component({
  template: `
    <button simplyMatButton variant="filled" [disabled]="true" (click)="clicked.set(true)">
      Filled button
    </button>
    <button simplyMatButton variant="elevated" (click)="clicked.set(true)">
      Elevated button
    </button>
    <button simplyMatButton variant="tonal">Tonal button</button>
    <button simplyMatButton variant="outlined">Outlined button</button>
    <button simplyMatButton variant="text">Text button</button>

    <button simplyMatButton variant="filled" size="xsmall">XSmall button</button>
    <button simplyMatButton variant="filled" size="small">Small button</button>
    <button simplyMatButton variant="filled" size="medium">Medium button</button>
    <button simplyMatButton variant="filled" size="large">Large button</button>
    <button simplyMatButton variant="filled" size="xlarge">XLarge button</button>

    <button simplyMatButton variant="elevated" shape="round">Round button</button>
    <button simplyMatButton variant="elevated" shape="square">Square button</button>

    <button simplyMatButton variant="tonal" [togglable]="true">Tonal togglable</button>
    <button simplyMatButton variant="tonal" [togglable]="true" [selected]="true">Tonal togglable selected</button>

    <button simplyMatButton variant="outlined" [togglable]="true">Outlined togglable</button>
    <button simplyMatButton variant="outlined" [togglable]="true" [selected]="true">Outlined togglable selected</button>

    <button simplyMatButton variant="text">Text button</button>

    <a simplyMatButton variant="filled">Filled anchor</a>
    <a simplyMatButton variant="elevated" [disabled]="true">Elevated anchor</a>

    <button
      id="dynamic-variant"
      simplyMatButton
      [variant]="dynamicVariant()">
      Dynamic variant
    </button>

    <button
      simplyMatButton
      variant="filled"
      [togglable]="true">
      Filled togglable
    </button>

    <button
      simplyMatButton
      variant="elevated"
      [togglable]="true"
      [selected]="true">
      Elevated togglable selected
    </button>
  `,
  imports: [SimplyMatButton],
})
class ButtonHarnessTest {
  clicked = signal(false);
  dynamicVariant = signal<'filled' | 'elevated' | 'tonal' | 'outlined' | 'text'>('filled');
}

