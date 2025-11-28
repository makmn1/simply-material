import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader, parallel} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {beforeEach, describe, expect, test} from 'vitest';
import {FabBase} from '../fab-base';
import {FabBaseHarness} from './fab-base-harness';
import {FabColor, FabSize} from '../fab-base.types';

describe('FabBaseHarness', () => {
  let fixture: ComponentFixture<FabBaseHarnessTest>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    fixture = TestBed.createComponent(FabBaseHarnessTest);
    fixture.detectChanges();
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  test('should load all FAB base harnesses', async () => {
    const fabs = await loader.getAllHarnesses(FabBaseHarness);
    expect(fabs.length).toBe(14);
  });

  test('should load FAB base with exact text', async () => {
    const fabs = await loader.getAllHarnesses(FabBaseHarness.with({text: 'Primary FAB'}));
    expect(fabs.length).toBe(1);
    expect(await fabs[0].getText()).toBe('Primary FAB');
  });

  test('should load FAB base with regex text match', async () => {
    const fabs = await loader.getAllHarnesses(FabBaseHarness.with({text: /primary/i}));
    expect(fabs.length).toBe(2);
    expect(await fabs[0].getText()).toBe('Primary FAB');
    expect(await fabs[1].getText()).toBe('Primary tonal FAB');
  });

  test('should filter by disabled state', async () => {
    const enabledFabs = await loader.getAllHarnesses(FabBaseHarness.with({disabled: false}));
    const disabledFabs = await loader.getAllHarnesses(FabBaseHarness.with({disabled: true}));
    expect(enabledFabs.length).toBe(12);
    expect(disabledFabs.length).toBe(2);
  });

  test('should get disabled state', async () => {
    const disabledFabs = await loader.getAllHarnesses(
      FabBaseHarness.with({text: /disabled/i}),
    );

    expect(disabledFabs.length).toBe(2);
    expect(await disabledFabs[0].isDisabled()).toBe(true);
    expect(await disabledFabs[1].isDisabled()).toBe(true);
  });

  test('should get FAB base text', async () => {
    const [firstFab, secondFab] = await loader.getAllHarnesses(FabBaseHarness);
    expect(await firstFab.getText()).toBe('Primary FAB');
    expect(await secondFab.getText()).toBe('Secondary FAB');
  });

  test('should focus and blur a FAB base', async () => {
    const fab = await loader.getHarness(FabBaseHarness.with({text: 'Primary FAB'}));
    expect(await fab.isFocused()).toBe(false);
    await fab.focus();
    expect(await fab.isFocused()).toBe(true);
    await fab.blur();
    expect(await fab.isFocused()).toBe(false);
  });

  test('should click a FAB base', async () => {
    const fab = await loader.getHarness(FabBaseHarness.with({text: 'Primary FAB'}));
    await fab.click();

    expect(fixture.componentInstance.clicked()).toBe(true);
  });

  test('should get the color of the FAB base', async () => {
    const fabs = await loader.getAllHarnesses(FabBaseHarness);
    const colors = await parallel(() => fabs.map(fab => fab.getColor()));

    expect(colors).toEqual([
      'primary',
      'secondary',
      'tertiary',
      'primary',
      'primary',
      'primary',
      'primary',
      'primary',
      'primary',
      'primary',
      'primary',
      'primary',
      'primary',
      'primary',
    ]);
  });

  test('should get the size of the FAB base', async () => {
    const fabs = await loader.getAllHarnesses(FabBaseHarness);
    const sizes = await parallel(() => fabs.map(fab => fab.getSize()));

    expect(sizes.length).toBe(14);
    expect(sizes.filter(s => s === 'small').length).toBe(12);
    expect(sizes.filter(s => s === 'medium').length).toBe(1);
    expect(sizes.filter(s => s === 'large').length).toBe(1);
  });

  test('should get whether FAB base is tonal', async () => {
    const tonalFab = await loader.getHarness(
      FabBaseHarness.with({text: 'Primary tonal FAB'}),
    );
    const nonTonalFab = await loader.getHarness(
      FabBaseHarness.with({text: 'Primary FAB'}),
    );

    expect(await tonalFab.isTonal()).toBe(true);
    expect(await nonTonalFab.isTonal()).toBe(false);
  });

  test('should get aria-label', async () => {
    const fab = await loader.getHarness(
      FabBaseHarness.with({text: 'Aria label FAB'}),
    );
    expect(await fab.getAriaLabel()).toBe('Add item');
  });

  test('should get aria-labelledby', async () => {
    const fab = await loader.getHarness(
      FabBaseHarness.with({text: 'Aria labelledby FAB'}),
    );
    expect(await fab.getAriaLabelledby()).toBe('label-id');
  });

  test('should filter by color', async () => {
    const primaryFabs = await loader.getAllHarnesses(FabBaseHarness.with({color: 'primary'}));
    const secondaryFabs = await loader.getAllHarnesses(FabBaseHarness.with({color: 'secondary'}));
    const tertiaryFabs = await loader.getAllHarnesses(FabBaseHarness.with({color: 'tertiary'}));

    expect(primaryFabs.length).toBe(12);
    expect(secondaryFabs.length).toBe(1);
    expect(tertiaryFabs.length).toBe(1);
  });

  test('should filter by size', async () => {
    const smallFabs = await loader.getAllHarnesses(FabBaseHarness.with({size: 'small'}));
    const mediumFabs = await loader.getAllHarnesses(FabBaseHarness.with({size: 'medium'}));
    const largeFabs = await loader.getAllHarnesses(FabBaseHarness.with({size: 'large'}));

    expect(smallFabs.length).toBe(12);
    expect(mediumFabs.length).toBe(1);
    expect(largeFabs.length).toBe(1);
  });

  test('should filter by tonal state', async () => {
    const tonalFabs = await loader.getAllHarnesses(FabBaseHarness.with({tonal: true}));
    const nonTonalFabs = await loader.getAllHarnesses(FabBaseHarness.with({tonal: false}));

    expect(tonalFabs.length).toBe(1);
    expect(nonTonalFabs.length).toBe(13);
  });

  test('should filter by ariaLabel', async () => {
    const fabs = await loader.getAllHarnesses(
      FabBaseHarness.with({ariaLabel: 'Add item'}),
    );
    expect(fabs.length).toBe(1);
    expect(await fabs[0].getText()).toBe('Aria label FAB');
  });

  test('should filter by ariaLabelledby', async () => {
    const fabs = await loader.getAllHarnesses(
      FabBaseHarness.with({ariaLabelledby: 'label-id'}),
    );
    expect(fabs.length).toBe(1);
    expect(await fabs[0].getText()).toBe('Aria labelledby FAB');
  });

  test('should filter by multiple criteria', async () => {
    const fabs = await loader.getAllHarnesses(
      FabBaseHarness.with({
        color: 'primary',
        size: 'medium',
        tonal: false,
      }),
    );
    expect(fabs.length).toBe(1);
    expect(await fabs[0].getText()).toBe('Medium FAB');
  });

  test('should handle dynamic property updates', async () => {
    const fab = await loader.getHarness(
      FabBaseHarness.with({selector: '#dynamic-fab'}),
    );

    expect(await fab.getColor()).toBe('primary');
    expect(await fab.getSize()).toBe('small');
    expect(await fab.isTonal()).toBe(false);

    fixture.componentInstance.dynamicColor.set('secondary');
    fixture.componentInstance.dynamicSize.set('large');
    fixture.componentInstance.dynamicTonal.set(true);
    await fixture.whenStable();

    expect(await fab.getColor()).toBe('secondary');
    expect(await fab.getSize()).toBe('large');
    expect(await fab.isTonal()).toBe(true);
  });
});

@Component({
  template: `
    <button simplyMatFabBase color="primary" (click)="clicked.set(true)">
      Primary FAB
    </button>
    <button simplyMatFabBase color="secondary">
      Secondary FAB
    </button>
    <button simplyMatFabBase color="tertiary">
      Tertiary FAB
    </button>
    <button simplyMatFabBase color="primary" [tonal]="true">
      Primary tonal FAB
    </button>
    <button simplyMatFabBase color="primary" size="small">
      Small FAB
    </button>
    <button simplyMatFabBase color="primary" size="medium">
      Medium FAB
    </button>
    <button simplyMatFabBase color="primary" size="large">
      Large FAB
    </button>
    <button simplyMatFabBase color="primary" [disabled]="true">
      Disabled FAB
    </button>
    <button simplyMatFabBase color="primary" disabled>
      Disabled FAB 2
    </button>
    <button simplyMatFabBase color="primary" [ariaLabel]="'Add item'">
      Aria label FAB
    </button>
    <button simplyMatFabBase color="primary" [ariaLabelledby]="'label-id'">
      Aria labelledby FAB
    </button>
    <span id="label-id">Add</span>
    <button
      id="dynamic-fab"
      simplyMatFabBase
      [color]="dynamicColor()"
      [size]="dynamicSize()"
      [tonal]="dynamicTonal()">
      Dynamic FAB
    </button>
    <button simplyMatFabBase color="primary">
      Another FAB
    </button>
    <button simplyMatFabBase color="primary">
      Yet another FAB
    </button>
  `,
  imports: [FabBase],
})
class FabBaseHarnessTest {
  clicked = signal(false);
  dynamicColor = signal<FabColor>('primary');
  dynamicSize = signal<FabSize>('small');
  dynamicTonal = signal<boolean>(false);
}

