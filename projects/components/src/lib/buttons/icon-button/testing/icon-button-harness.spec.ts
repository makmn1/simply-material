import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader, parallel} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {provideZonelessChangeDetection} from '@angular/core';
import {describe, it, expect, beforeEach, vi} from 'vitest';
import {IconButton, IconButtonVariant} from '../icon-button';
import {SmIconButtonHarness} from './icon-button-harness';
import {ShapeMorph} from '../../../../services/shape-morph';
import {MinimalCircularBorderRadius} from '../../../../services/minimal-circular-border-radius';
import {
  createMockShapeMorph,
  createMockMinimalCircularBorderRadius,
} from '../../../../testing/test-helpers';

describe('SmIconButtonHarness', () => {
  let fixture: ComponentFixture<IconButtonHarnessTest>;
  let loader: HarnessLoader;
  let shapeMorphSpy: ReturnType<typeof vi.fn>;
  let minimalServiceMocks: ReturnType<typeof createMockMinimalCircularBorderRadius>;

  beforeEach(async () => {
    shapeMorphSpy = vi.fn().mockResolvedValue(undefined);
    minimalServiceMocks = createMockMinimalCircularBorderRadius();

    await TestBed.configureTestingModule({
      imports: [IconButtonHarnessTest],
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

    fixture = TestBed.createComponent(IconButtonHarnessTest);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should load all icon button harnesses', async () => {
    const buttons = await loader.getAllHarnesses(SmIconButtonHarness);
    expect(buttons.length).toBe(27);
  });

  it('should filter by whether an icon button is disabled', async () => {
    const enabledButtons = await loader.getAllHarnesses(SmIconButtonHarness.with({disabled: false}));
    const disabledButtons = await loader.getAllHarnesses(SmIconButtonHarness.with({disabled: true}));
    expect(enabledButtons.length).toBe(25);
    expect(disabledButtons.length).toBe(2);
  });

  it('should get disabled state', async () => {
    const disabledFilledButton = await loader.getHarness(SmIconButtonHarness.with({selector: '#disabled-filled'}));
    const enabledFilledAnchor = await loader.getHarness(SmIconButtonHarness.with({selector: '#anchor-filled'}));
    const disabledStandardAnchor = await loader.getHarness(SmIconButtonHarness.with({selector: '#anchor-standard'}));

    expect(await enabledFilledAnchor.isDisabled()).toBe(false);
    expect(await disabledFilledButton.isDisabled()).toBe(true);
    expect(await disabledStandardAnchor.isDisabled()).toBe(true);
  });

  it('should load icon button with type attribute', async () => {
    const buttons = await loader.getAllHarnesses(SmIconButtonHarness.with({selector: '#submit'}));
    expect(buttons.length).toBe(1);
    expect(await buttons[0].getType()).toBe('submit');
  });

  it('should focus and blur an icon button', async () => {
    const button = await loader.getHarness(SmIconButtonHarness.with({selector: '#basic'}));
    expect(await button.isFocused()).toBe(false);
    await button.focus();
    expect(await button.isFocused()).toBe(true);
    await button.blur();
    expect(await button.isFocused()).toBe(false);
  });

  // We can't use the test harness click element in Vitest
  // There is a workaround through a Vitest configuration (see https://github.com/vitest-dev/vitest/issues/4685),
  // but as of Angular v20, customizing that configuration for ng test is not supported.
  it('should click an icon button', async () => {
    const hostElement = fixture.debugElement.nativeElement.querySelector('#basic') as HTMLElement;
    hostElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.clicked()).toBe(true);
  });

  it('should not click a disabled icon button', async () => {
    const hostElement = fixture.debugElement.nativeElement.querySelector('#disabled-filled') as HTMLElement;
    hostElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.clicked()).toBe(false);
  });

  it('should get the variant of the icon button', async () => {
    const buttons = await loader.getAllHarnesses(SmIconButtonHarness);
    const variants = await parallel(() => buttons.map(button => button.getVariant()));

    expect(variants).toEqual([
      'filled',
      'filled',
      'filled',
      'tonal',
      'outlined',
      'filled',
      'filled',
      'tonal',
      'outlined',
      'standard',
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
      'filled',
      'filled',
      'filled',
      'tonal',
    ]);
  });

  it('should get the size of the icon button', async () => {
    const buttons = await loader.getAllHarnesses(SmIconButtonHarness);
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
      'small',
      'small',
      'small',
    ]);
  });

  it('should get the shape of the icon button', async () => {
    const buttons = await loader.getAllHarnesses(SmIconButtonHarness);
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
      'round',
      'round',
      'round',
    ]);
  });

  it('should get the width of the icon button', async () => {
    const buttons = await loader.getAllHarnesses(SmIconButtonHarness);
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
    ]);
  });

  it('should filter icon buttons based on their variant', async () => {
    const button = await loader.getHarness(SmIconButtonHarness.with({variant: 'filled'}));
    expect(await button.getVariant()).toBe('filled');
  });

  it('should filter icon buttons based on their size', async () => {
    const button = await loader.getHarness(SmIconButtonHarness.with({size: 'xsmall'}));
    expect(await button.getSize()).toBe('xsmall');
  });

  it('should filter icon buttons based on their shape', async () => {
    const buttons = await loader.getAllHarnesses(SmIconButtonHarness.with({shape: 'square'}));
    expect(buttons.length).toBe(5);
    expect(await buttons[0].getShape()).toBe('square');
  });

  it('should filter icon buttons based on their width', async () => {
    const narrowButtons = await loader.getAllHarnesses(SmIconButtonHarness.with({width: 'narrow'}));
    const wideButtons = await loader.getAllHarnesses(SmIconButtonHarness.with({width: 'wide'}));
    expect(narrowButtons.length).toBe(1);
    expect(wideButtons.length).toBe(1);
    expect(await narrowButtons[0].getWidth()).toBe('narrow');
    expect(await wideButtons[0].getWidth()).toBe('wide');
  });

  it('should filter icon buttons based on toggle state', async () => {
    const toggleButtons = await loader.getAllHarnesses(SmIconButtonHarness.with({toggle: true}));
    const nonToggleButtons = await loader.getAllHarnesses(SmIconButtonHarness.with({toggle: false}));
    expect(toggleButtons.length).toBe(2);
    expect(nonToggleButtons.length).toBe(25);
  });

  it('should get toggle state', async () => {
    const toggleButton = await loader.getHarness(SmIconButtonHarness.with({selector: '#toggle'}));
    const normalButton = await loader.getHarness(SmIconButtonHarness.with({selector: '#basic'}));

    expect(await toggleButton.isToggle()).toBe(true);
    expect(await normalButton.isToggle()).toBe(false);
  });

  it('should filter icon buttons based on selected state', async () => {
    const selectedButtons = await loader.getAllHarnesses(SmIconButtonHarness.with({selected: true}));
    const unselectedButtons = await loader.getAllHarnesses(SmIconButtonHarness.with({selected: false}));
    expect(selectedButtons.length).toBe(1);
    expect(unselectedButtons.length).toBe(26);
  });

  it('should get selected state', async () => {
    const selectedToggleButton = await loader.getHarness(
      SmIconButtonHarness.with({selector: '#selected-toggle'}),
    );
    const unselectedToggleButton = await loader.getHarness(
      SmIconButtonHarness.with({selector: '#toggle'}),
    );

    expect(await selectedToggleButton.isSelected()).toBe(true);
    expect(await unselectedToggleButton.isSelected()).toBe(false);
  });

  it('should get the type of native button elements', async () => {
    const submitButton = await loader.getHarness(SmIconButtonHarness.with({selector: '#submit'}));
    const normalButton = await loader.getHarness(SmIconButtonHarness.with({selector: '#basic'}));

    expect(await submitButton.getType()).toBe('submit');
    expect(await normalButton.getType()).toBe('button');
  });

  it('should return null for type on anchor elements', async () => {
    const anchor = await loader.getHarness(SmIconButtonHarness.with({selector: '#anchor-basic'}));
    expect(await anchor.getType()).toBe(null);
  });

  it('should get variant of an icon button with dynamic variant', async () => {
    const button = await loader.getHarness(
      SmIconButtonHarness.with({selector: '#dynamic-variant'}),
    );
    expect(await button.getVariant()).toBe('tonal');
    fixture.componentInstance.dynamicVariant.set('filled');
    fixture.detectChanges();
    expect(await button.getVariant()).toBe('filled');
  });
});

@Component({
  template: `
    <button id="basic" type="button" sm-icon-button variant="filled" (click)="clicked.set(true)">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="disabled-filled" type="button" sm-icon-button variant="filled" [disabled]="true" (click)="clicked.set(true)">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="filled" type="button" sm-icon-button variant="filled">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="tonal" type="button" sm-icon-button variant="tonal">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="outlined" type="button" sm-icon-button variant="outlined">
      <span class="material-symbols-rounded">favorite</span>
    </button>

    <a id="anchor-basic" sm-icon-button variant="filled">
      <span class="material-symbols-rounded">favorite</span>
    </a>
    <a id="anchor-filled" sm-icon-button variant="filled">
      <span class="material-symbols-rounded">favorite</span>
    </a>
    <a id="anchor-tonal" sm-icon-button variant="tonal">
      <span class="material-symbols-rounded">favorite</span>
    </a>
    <a id="anchor-outlined" sm-icon-button variant="outlined">
      <span class="material-symbols-rounded">favorite</span>
    </a>
    <a id="anchor-standard" sm-icon-button variant="standard" [disabled]="true">
      <span class="material-symbols-rounded">favorite</span>
    </a>

    <button id="xsmall" type="button" sm-icon-button variant="filled" [size]="'xsmall'">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="small" type="button" sm-icon-button variant="filled" [size]="'small'">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="medium" type="button" sm-icon-button variant="filled" [size]="'medium'">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="large" type="button" sm-icon-button variant="filled" [size]="'large'">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="xlarge" type="button" sm-icon-button variant="filled" [size]="'xlarge'">
      <span class="material-symbols-rounded">favorite</span>
    </button>

    <button id="square" type="button" sm-icon-button variant="filled" [shape]="'square'">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="square2" type="button" sm-icon-button variant="filled" [shape]="'square'">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="square3" type="button" sm-icon-button variant="filled" [shape]="'square'">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="square4" type="button" sm-icon-button variant="filled" [shape]="'square'">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="square5" type="button" sm-icon-button variant="filled" [shape]="'square'">
      <span class="material-symbols-rounded">favorite</span>
    </button>

    <button id="narrow" type="button" sm-icon-button variant="filled" [width]="'narrow'">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="default-width" type="button" sm-icon-button variant="filled" [width]="'default'">
      <span class="material-symbols-rounded">favorite</span>
    </button>
    <button id="wide" type="button" sm-icon-button variant="filled" [width]="'wide'">
      <span class="material-symbols-rounded">favorite</span>
    </button>

    <button id="toggle" type="button" sm-icon-button variant="filled" [toggle]="true">
      <span smIconButtonOutlinedIcon class="material-symbols-outlined">favorite</span>
      <span smIconButtonFilledIcon class="material-symbols-rounded">favorite</span>
    </button>
    <button
      id="selected-toggle"
      type="button"
      sm-icon-button
      variant="filled"
      [toggle]="true"
      [selected]="true"
    >
      <span smIconButtonOutlinedIcon class="material-symbols-outlined">favorite</span>
      <span smIconButtonFilledIcon class="material-symbols-rounded">favorite</span>
    </button>

    <button id="submit" type="submit" sm-icon-button variant="filled">
      <span class="material-symbols-rounded">favorite</span>
    </button>

    <button
      id="dynamic-variant"
      type="button"
      sm-icon-button
      [variant]="dynamicVariant()"
    >
      <span class="material-symbols-rounded">favorite</span>
    </button>
  `,
  imports: [IconButton],
  standalone: true,
})
class IconButtonHarnessTest {
  clicked = signal(false);
  dynamicVariant = signal<IconButtonVariant>('tonal');
}

