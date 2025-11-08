import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader, parallel} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {provideZonelessChangeDetection} from '@angular/core';
import {describe, it, expect, beforeEach, vi} from 'vitest';
import {SmButtonComponent, ButtonVariant} from '../button';
import {SmButtonHarness} from './button-harness';
import {ShapeMorph} from '../../../services/shape-morph';
import {MinimalCircularBorderRadius} from '../../../services/minimal-circular-border-radius';
import {
  createMockShapeMorph,
  createMockMinimalCircularBorderRadius,
} from '../../../testing/test-helpers';

describe('SmButtonHarness', () => {
  let fixture: ComponentFixture<ButtonHarnessTest>;
  let loader: HarnessLoader;
  let shapeMorphSpy: ReturnType<typeof vi.fn>;
  let minimalServiceMocks: ReturnType<typeof createMockMinimalCircularBorderRadius>;

  beforeEach(async () => {
    shapeMorphSpy = vi.fn().mockResolvedValue(undefined);
    minimalServiceMocks = createMockMinimalCircularBorderRadius();

    await TestBed.configureTestingModule({
      imports: [ButtonHarnessTest],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: ShapeMorph,
          useValue: createMockShapeMorph(shapeMorphSpy),
        },
        {
          provide: MinimalCircularBorderRadius,
          useValue: minimalServiceMocks.service,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonHarnessTest);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should load all button harnesses', async () => {
    const buttons = await loader.getAllHarnesses(SmButtonHarness);
    expect(buttons.length).toBe(24);
  });

  it('should load button with exact text', async () => {
    const buttons = await loader.getAllHarnesses(SmButtonHarness.with({text: 'Basic button'}));
    expect(buttons.length).toBe(1);
    expect(await buttons[0].getText()).toBe('Basic button');
  });

  it('should load button with regex label match', async () => {
    const buttons = await loader.getAllHarnesses(SmButtonHarness.with({text: /basic/i}));
    expect(buttons.length).toBe(2);
    expect(await buttons[0].getText()).toBe('Basic button');
    expect(await buttons[1].getText()).toBe('Basic anchor');
  });

  it('should filter by whether a button is disabled', async () => {
    const enabledButtons = await loader.getAllHarnesses(SmButtonHarness.with({disabled: false}));
    const disabledButtons = await loader.getAllHarnesses(SmButtonHarness.with({disabled: true}));
    expect(enabledButtons.length).toBe(22);
    expect(disabledButtons.length).toBe(2);
  });

  it('should get disabled state', async () => {
    const [disabledFilledButton, enabledFilledAnchor] = await loader.getAllHarnesses(
      SmButtonHarness.with({text: /filled/i}),
    );
    const [enabledElevatedButton, disabledElevatedAnchor] = await loader.getAllHarnesses(
      SmButtonHarness.with({text: /elevated/i}),
    );

    expect(await enabledFilledAnchor.isDisabled()).toBe(false);
    expect(await disabledFilledButton.isDisabled()).toBe(true);
    expect(await enabledElevatedButton.isDisabled()).toBe(false);
    expect(await disabledElevatedAnchor.isDisabled()).toBe(true);
  });

  it('should load button with type attribute', async () => {
    const buttons = await loader.getAllHarnesses(SmButtonHarness.with({selector: '#submit'}));
    expect(buttons.length).toBe(1);
    expect(await buttons[0].getText()).toBe('Submit button');
    expect(await buttons[0].getType()).toBe('submit');
  });

  it('should get button text', async () => {
    const [firstButton, secondButton] = await loader.getAllHarnesses(SmButtonHarness);
    expect(await firstButton.getText()).toBe('Basic button');
    expect(await secondButton.getText()).toBe('Filled button');
  });

  it('should focus and blur a button', async () => {
    const button = await loader.getHarness(SmButtonHarness.with({text: 'Basic button'}));
    expect(await button.isFocused()).toBe(false);
    await button.focus();
    expect(await button.isFocused()).toBe(true);
    await button.blur();
    expect(await button.isFocused()).toBe(false);
  });

  // We can't use the test harness click element in Vitest
  // There is a workaround through a Vitest configuration (see https://github.com/vitest-dev/vitest/issues/4685),
  // but as of Angular v20, customizing that configuration for ng test is not supported.
  it('should click a button', async () => {
    const hostElement = fixture.debugElement.nativeElement.querySelector('#basic') as HTMLElement;
    hostElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.clicked()).toBe(true);
  });

  it('should not click a disabled button', async () => {
    const hostElement = fixture.debugElement.nativeElement.querySelector('#flat') as HTMLElement;
    hostElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.clicked()).toBe(false);
  });

  it('should get the variant of the button', async () => {
    const buttons = await loader.getAllHarnesses(SmButtonHarness);
    const variants = await parallel(() => buttons.map(button => button.getVariant()));

    expect(variants).toEqual([
      'text',
      'filled',
      'elevated',
      'outlined',
      'tonal',
      'text',
      'filled',
      'elevated',
      'outlined',
      'tonal',
      'filled',
      'filled',
      'filled',
      'filled',
      'filled',
      'filled',
      'filled',
      'filled',
      'filled',
      'filled',
      'filled',
      'filled',
      'filled',
      'tonal',
    ]);
  });

  it('should get the size of the button', async () => {
    const buttons = await loader.getAllHarnesses(SmButtonHarness);
    const sizes = await parallel(() => buttons.map(button => button.getSize()));

    expect(sizes).toEqual([
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
    ]);
  });

  it('should get the shape of the button', async () => {
    const buttons = await loader.getAllHarnesses(SmButtonHarness);
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
      'round',
      'round',
      'round',
      'round',
      'square',
      'square',
      'square',
      'square',
      'square',
      'round',
      'round',
      'round',
      'round',
    ]);
  });

  it('should filter buttons based on their variant', async () => {
    const button = await loader.getHarness(SmButtonHarness.with({variant: 'filled'}));
    expect(await button.getText()).toBe('Filled button');
  });

  it('should filter buttons based on their size', async () => {
    const button = await loader.getHarness(SmButtonHarness.with({size: 'xsmall'}));
    expect(await button.getText()).toBe('XSmall button');
  });

  it('should filter buttons based on their shape', async () => {
    const buttons = await loader.getAllHarnesses(SmButtonHarness.with({shape: 'square'}));
    expect(buttons.length).toBe(5);
    expect(await buttons[0].getText()).toBe('Square button');
  });

  it('should filter buttons based on toggle state', async () => {
    const toggleButtons = await loader.getAllHarnesses(SmButtonHarness.with({toggle: true}));
    const nonToggleButtons = await loader.getAllHarnesses(SmButtonHarness.with({toggle: false}));
    expect(toggleButtons.length).toBe(2);
    expect(nonToggleButtons.length).toBe(22);
  });

  it('should get toggle state', async () => {
    const toggleButton = await loader.getHarness(SmButtonHarness.with({text: 'Toggle button'}));
    const normalButton = await loader.getHarness(SmButtonHarness.with({text: 'Basic button'}));

    expect(await toggleButton.isToggle()).toBe(true);
    expect(await normalButton.isToggle()).toBe(false);
  });

  it('should filter buttons based on selected state', async () => {
    const selectedButtons = await loader.getAllHarnesses(SmButtonHarness.with({selected: true}));
    const unselectedButtons = await loader.getAllHarnesses(SmButtonHarness.with({selected: false}));
    expect(selectedButtons.length).toBe(1);
    expect(unselectedButtons.length).toBe(23);
  });

  it('should get selected state', async () => {
    const selectedToggleButton = await loader.getHarness(
      SmButtonHarness.with({text: 'Selected toggle'}),
    );
    const unselectedToggleButton = await loader.getHarness(
      SmButtonHarness.with({text: 'Toggle button'}),
    );

    expect(await selectedToggleButton.isSelected()).toBe(true);
    expect(await unselectedToggleButton.isSelected()).toBe(false);
  });

  it('should get the type of native button elements', async () => {
    const submitButton = await loader.getHarness(SmButtonHarness.with({selector: '#submit'}));
    const normalButton = await loader.getHarness(SmButtonHarness.with({text: 'Basic button'}));

    expect(await submitButton.getType()).toBe('submit');
    expect(await normalButton.getType()).toBe('button');
  });

  it('should return null for type on anchor elements', async () => {
    const anchor = await loader.getHarness(SmButtonHarness.with({text: 'Basic anchor'}));
    expect(await anchor.getType()).toBe(null);
  });

  it('should get variant of a button with dynamic variant', async () => {
    const button = await loader.getHarness(
      SmButtonHarness.with({selector: '#dynamic-variant'}),
    );
    expect(await button.getVariant()).toBe('tonal');
    fixture.componentInstance.dynamicVariant.set('filled');
    fixture.detectChanges();
    expect(await button.getVariant()).toBe('filled');
  });
});

@Component({
  template: `
    <button id="basic" type="button" sm-button variant="text" (click)="clicked.set(true)">
      Basic button
    </button>
    <button id="flat" type="button" sm-button variant="filled" [disabled]="true" (click)="clicked.set(true)">
      Filled button
    </button>
    <button id="raised" type="button" sm-button variant="elevated">Elevated button</button>
    <button id="stroked" type="button" sm-button variant="outlined">Outlined button</button>
    <button id="tonal" type="button" sm-button variant="tonal">Tonal button</button>

    <a id="anchor-basic" sm-button variant="text">Basic anchor</a>
    <a id="anchor-flat" sm-button variant="filled">Filled anchor</a>
    <a id="anchor-raised" sm-button variant="elevated" [disabled]="true">Elevated anchor</a>
    <a id="anchor-stroked" sm-button variant="outlined">Outlined anchor</a>
    <a id="anchor-tonal" sm-button variant="tonal">Tonal anchor</a>

    <button id="xsmall" type="button" sm-button variant="filled" [size]="'xsmall'">XSmall button</button>
    <button id="small" type="button" sm-button variant="filled" [size]="'small'">Small button</button>
    <button id="medium" type="button" sm-button variant="filled" [size]="'medium'">Medium button</button>
    <button id="large" type="button" sm-button variant="filled" [size]="'large'">Large button</button>
    <button id="xlarge" type="button" sm-button variant="filled" [size]="'xlarge'">XLarge button</button>

    <button id="square" type="button" sm-button variant="filled" [shape]="'square'">Square button</button>
    <button id="square2" type="button" sm-button variant="filled" [shape]="'square'">Square button 2</button>
    <button id="square3" type="button" sm-button variant="filled" [shape]="'square'">Square button 3</button>
    <button id="square4" type="button" sm-button variant="filled" [shape]="'square'">Square button 4</button>
    <button id="square5" type="button" sm-button variant="filled" [shape]="'square'">Square button 5</button>

    <button id="toggle" type="button" sm-button variant="filled" [toggle]="true">Toggle button</button>
    <button
      id="selected-toggle"
      type="button"
      sm-button
      variant="filled"
      [toggle]="true"
      [selected]="true"
    >
      Selected toggle
    </button>

    <button id="submit" type="submit" sm-button variant="filled">Submit button</button>

    <button
      id="dynamic-variant"
      type="button"
      sm-button
      [variant]="dynamicVariant()"
    >
      Dynamic variant
    </button>
  `,
  imports: [SmButtonComponent],
  standalone: true,
})
class ButtonHarnessTest {
  clicked = signal(false);
  dynamicVariant = signal<ButtonVariant>('tonal');
}

