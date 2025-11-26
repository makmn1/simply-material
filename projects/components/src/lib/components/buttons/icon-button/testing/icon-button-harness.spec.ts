import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader, parallel} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {beforeEach, describe, expect, test} from 'vitest';
import {SimplyMatIconButton} from '../icon-button';
import {SimplyMatIconButtonHarness} from './icon-button-harness';

describe('SimplyMatIconButtonHarness', () => {
  let fixture: ComponentFixture<IconButtonHarnessTest>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    fixture = TestBed.createComponent(IconButtonHarnessTest);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  test('should load all icon button harnesses', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatIconButtonHarness);
    expect(buttons.length).toBe(20);
  });

  test('should load icon button with exact text', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatIconButtonHarness.with({text: 'Filled icon'}));
    expect(buttons.length).toBe(1);
    expect(await buttons[0].getText()).toBe('Filled icon');
  });

  test('should load icon button with regex label match', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatIconButtonHarness.with({text: /filled/i}));
    expect(buttons.length).toBe(2);
  });

  test('should filter by whether an icon button is disabled', async () => {
    const enabledButtons = await loader.getAllHarnesses(SimplyMatIconButtonHarness.with({disabled: false}));
    const disabledButtons = await loader.getAllHarnesses(SimplyMatIconButtonHarness.with({disabled: true}));
    expect(enabledButtons.length).toBe(18);
    expect(disabledButtons.length).toBe(2);
  });

  test('should get disabled state', async () => {
    const [disabledButton, enabledButton] = await loader.getAllHarnesses(
      SimplyMatIconButtonHarness.with({text: /filled/i}),
    );

    expect(await disabledButton.isDisabled()).toBe(true);
    expect(await enabledButton.isDisabled()).toBe(false);
  });

  test('should get icon button text', async () => {
    const [firstButton, secondButton] = await loader.getAllHarnesses(SimplyMatIconButtonHarness);
    expect(await firstButton.getText()).toBe('Filled icon');
    expect(await secondButton.getText()).toBe('Tonal icon');
  });

  test('should focus and blur an icon button', async () => {
    const button = await loader.getHarness(SimplyMatIconButtonHarness.with({text: 'Tonal icon'}));
    expect(await button.isFocused()).toBe(false);
    await button.focus();
    expect(await button.isFocused()).toBe(true);
    await button.blur();
    expect(await button.isFocused()).toBe(false);
  });

  test('should click an icon button', async () => {
    const button = await loader.getHarness(SimplyMatIconButtonHarness.with({text: 'Tonal icon'}));
    await button.click();

    expect(fixture.componentInstance.clicked()).toBe(true);
  });

  test('should get the variant of the icon button', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatIconButtonHarness);
    const variants = await parallel(() => buttons.map(button => button.getVariant()));

    expect(variants).toEqual([
      'filled',
      'tonal',
      'outlined',
      'standard',
      'filled',
      'filled',
      'filled',
      'filled',
      'filled',
      'tonal',
      'tonal',
      'outlined',
      'outlined',
      'standard',
      'standard',
      'filled',
      'tonal',
      'filled',
      'filled',
      'tonal',
    ]);
  });

  test('should get the size of the icon button', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatIconButtonHarness);
    const sizes = await parallel(() => buttons.map(button => button.getSize()));

    expect(sizes).toEqual([
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
    ]);
  });

  test('should get the shape of the icon button', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatIconButtonHarness);
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
    ]);
  });

  test('should get the width of the icon button', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatIconButtonHarness);
    const widths = await parallel(() => buttons.map(button => button.getWidth()));

    expect(widths).toEqual([
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
      'narrow',
      'default',
      'wide',
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
    ]);
  });

  test('should filter icon buttons based on variant', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatIconButtonHarness.with({variant: 'filled'}));
    expect(buttons.length).toBe(9);
  });

  test('should filter icon buttons based on size', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatIconButtonHarness.with({size: 'xlarge'}));
    expect(buttons.length).toBe(1);
    expect(await buttons[0].getText()).toBe('XLarge icon');
  });

  test('should filter icon buttons based on shape', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatIconButtonHarness.with({shape: 'square'}));
    expect(buttons.length).toBe(1);
    expect(await buttons[0].getText()).toBe('Square icon');
  });

  test('should filter icon buttons based on width', async () => {
    const narrowButtons = await loader.getAllHarnesses(SimplyMatIconButtonHarness.with({width: 'narrow'}));
    const wideButtons = await loader.getAllHarnesses(SimplyMatIconButtonHarness.with({width: 'wide'}));
    expect(narrowButtons.length).toBe(1);
    expect(wideButtons.length).toBe(1);
  });

  test('should get variant of an icon button with dynamic variant', async () => {
    const button = await loader.getHarness(
      SimplyMatIconButtonHarness.with({selector: '#dynamic-variant'}),
    );
    expect(await button.getVariant()).toBe('filled');
    fixture.componentInstance.dynamicVariant.set('outlined');
    expect(await button.getVariant()).toBe('outlined');
  });

  test('should check if icon button is togglable', async () => {
    const togglableButtons = await loader.getAllHarnesses(
      SimplyMatIconButtonHarness.with({togglable: true}),
    );
    const normalButton = await loader.getHarness(
      SimplyMatIconButtonHarness.with({text: 'Tonal icon'}),
    );

    expect(await togglableButtons[0].isTogglable()).toBe(true);
    expect(await normalButton.isTogglable()).toBe(false);
  });

  test('should filter by togglable state', async () => {
    const togglableButtons = await loader.getAllHarnesses(
      SimplyMatIconButtonHarness.with({togglable: true}),
    );
    expect(togglableButtons.length).toBe(3);
  });

  test('should check if togglable icon button is selected', async () => {
    const togglableButtons = await loader.getAllHarnesses(
      SimplyMatIconButtonHarness.with({togglable: true}),
    );

    // Find an unselected and a selected togglable button
    let unselectedButton;
    let selectedButton;
    for (const btn of togglableButtons) {
      if (await btn.isSelected()) {
        selectedButton = btn;
      } else if (!unselectedButton) {
        unselectedButton = btn;
      }
    }

    expect(await unselectedButton!.isSelected()).toBe(false);
    expect(await selectedButton!.isSelected()).toBe(true);
  });

  test('should filter by selected state', async () => {
    const selectedButtons = await loader.getAllHarnesses(
      SimplyMatIconButtonHarness.with({selected: true}),
    );
    expect(selectedButtons.length).toBe(1);
  });

  test('should toggle a togglable icon button', async () => {
    const togglableButtons = await loader.getAllHarnesses(
      SimplyMatIconButtonHarness.with({togglable: true, selected: false}),
    );
    const button = togglableButtons[0];

    expect(await button.isSelected()).toBe(false);
    await button.toggle();
    expect(await button.isSelected()).toBe(true);
  });

  test('should throw error when toggling non-togglable icon button', async () => {
    const button = await loader.getHarness(
      SimplyMatIconButtonHarness.with({text: 'Tonal icon'}),
    );

    await expect(button.toggle()).rejects.toThrow('Cannot toggle a non-togglable icon button');
  });

  test('should handle anchor icon buttons', async () => {
    const anchorButtons = await loader.getAllHarnesses(
      SimplyMatIconButtonHarness.with({text: /anchor/i}),
    );
    expect(anchorButtons.length).toBe(2);
  });

  test('should filter by multiple criteria', async () => {
    const buttons = await loader.getAllHarnesses(
      SimplyMatIconButtonHarness.with({
        variant: 'filled',
        size: 'small',
        disabled: false,
      }),
    );
    expect(buttons.length).toBe(4);
  });
});

@Component({
  template: `
    <button simplyMatIconButton variant="filled" [disabled]="true" (click)="clicked.set(true)">
      Filled icon
    </button>
    <button simplyMatIconButton variant="tonal" (click)="clicked.set(true)">
      Tonal icon
    </button>
    <button simplyMatIconButton variant="outlined">Outlined icon</button>
    <button simplyMatIconButton variant="standard">Standard icon</button>

    <button simplyMatIconButton variant="filled" size="xsmall">XSmall icon</button>
    <button simplyMatIconButton variant="filled" size="small">Small icon</button>
    <button simplyMatIconButton variant="filled" size="medium">Medium icon</button>
    <button simplyMatIconButton variant="filled" size="large">Large icon</button>
    <button simplyMatIconButton variant="filled" size="xlarge">XLarge icon</button>

    <button simplyMatIconButton variant="tonal" shape="round">Round icon</button>
    <button simplyMatIconButton variant="tonal" shape="square">Square icon</button>

    <button simplyMatIconButton variant="outlined" width="narrow">Narrow icon</button>
    <button simplyMatIconButton variant="outlined" width="default">Default icon</button>
    <button simplyMatIconButton variant="standard" width="wide">Wide icon</button>

    <button simplyMatIconButton variant="standard" [togglable]="true">Standard togglable</button>

    <a simplyMatIconButton variant="filled">Filled anchor</a>
    <a simplyMatIconButton variant="tonal" [disabled]="true">Tonal anchor</a>

    <button
      id="dynamic-variant"
      simplyMatIconButton
      [variant]="dynamicVariant()">
      Dynamic variant
    </button>

    <button
      simplyMatIconButton
      variant="filled"
      [togglable]="true">
      Filled togglable icon
    </button>

    <button
      simplyMatIconButton
      variant="tonal"
      [togglable]="true"
      [selected]="true">
      Tonal togglable selected
    </button>
  `,
  imports: [SimplyMatIconButton],
})
class IconButtonHarnessTest {
  clicked = signal(false);
  dynamicVariant = signal<'filled' | 'tonal' | 'outlined' | 'standard'>('filled');
}

