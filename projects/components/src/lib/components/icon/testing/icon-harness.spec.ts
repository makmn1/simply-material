import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader, parallel} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {beforeEach, describe, expect, test} from 'vitest';
import {SimplyMatIcon} from '../icon';
import {SimplyMatIconHarness} from './icon-harness';

describe('SimplyMatIconHarness', () => {
  let fixture: ComponentFixture<IconHarnessTest>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    fixture = TestBed.createComponent(IconHarnessTest);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  test('should load all icon harnesses', async () => {
    const icons = await loader.getAllHarnesses(SimplyMatIconHarness);
    expect(icons.length).toBe(8);
  });

  test('should filter icons by ariaHidden state', async () => {
    const hiddenIcons = await loader.getAllHarnesses(
      SimplyMatIconHarness.with({ariaHidden: true}),
    );
    const visibleIcons = await loader.getAllHarnesses(
      SimplyMatIconHarness.with({ariaHidden: false}),
    );
    expect(hiddenIcons.length).toBe(4);
    expect(visibleIcons.length).toBe(4);
  });

  test('should get ariaHidden state', async () => {
    const hiddenIcon = await loader.getHarness(
      SimplyMatIconHarness.with({selector: '#default-icon'}),
    );
    const visibleIcon = await loader.getHarness(
      SimplyMatIconHarness.with({selector: '#visible-icon'}),
    );

    expect(await hiddenIcon.getAriaHidden()).toBe(true);
    expect(await visibleIcon.getAriaHidden()).toBe(false);
  });

  test('should filter icons by ariaLabel', async () => {
    const labeledIcons = await loader.getAllHarnesses(
      SimplyMatIconHarness.with({ariaLabel: 'Edit item'}),
    );
    expect(labeledIcons.length).toBe(1);
    expect(await labeledIcons[0].getAriaLabel()).toBe('Edit item');
  });

  test('should filter icons by ariaLabel with regex', async () => {
    const labeledIcons = await loader.getAllHarnesses(
      SimplyMatIconHarness.with({ariaLabel: /edit/i}),
    );
    expect(labeledIcons.length).toBe(2);
  });

  test('should get ariaLabel value', async () => {
    const labeledIcon = await loader.getHarness(
      SimplyMatIconHarness.with({selector: '#labeled-icon'}),
    );
    const unlabeledIcon = await loader.getHarness(
      SimplyMatIconHarness.with({selector: '#visible-icon'}),
    );

    expect(await labeledIcon.getAriaLabel()).toBe('Edit item');
    expect(await unlabeledIcon.getAriaLabel()).toBeNull();
  });

  test('should filter icons by role', async () => {
    const imgRoleIcons = await loader.getAllHarnesses(
      SimplyMatIconHarness.with({role: 'img'}),
    );
    expect(imgRoleIcons.length).toBe(4);
  });

  test('should get role attribute', async () => {
    const imgIcon = await loader.getHarness(
      SimplyMatIconHarness.with({selector: '#visible-icon'}),
    );
    const hiddenIcon = await loader.getHarness(
      SimplyMatIconHarness.with({selector: '#default-icon'}),
    );

    expect(await imgIcon.getRole()).toBe('img');
    expect(await hiddenIcon.getRole()).toBeNull();
  });

  test('should get text content from projected content', async () => {
    const icon = await loader.getHarness(
      SimplyMatIconHarness.with({selector: '#default-icon'}),
    );
    const text = await icon.getText();
    // The text should include the content from the material symbol span
    expect(text).toContain('add');
  });

  test('should handle dynamic ariaHidden changes', async () => {
    const icon = await loader.getHarness(
      SimplyMatIconHarness.with({selector: '#dynamic-icon'}),
    );

    expect(await icon.getAriaHidden()).toBe(true);
    expect(await icon.getRole()).toBeNull();

    fixture.componentInstance.dynamicAriaHidden.set(false);
    await fixture.whenStable();

    expect(await icon.getAriaHidden()).toBe(false);
    expect(await icon.getRole()).toBe('img');
  });

  test('should handle dynamic ariaLabel changes', async () => {
    fixture.componentInstance.dynamicAriaHidden.set(false);
    const icon = await loader.getHarness(
      SimplyMatIconHarness.with({selector: '#dynamic-icon'}),
    );

    fixture.componentInstance.dynamicAriaLabel.set('Dynamic label');
    await fixture.whenStable();

    expect(await icon.getAriaLabel()).toBe('Dynamic label');

    fixture.componentInstance.dynamicAriaLabel.set(null);
    await fixture.whenStable();

    expect(await icon.getAriaLabel()).toBeNull();
  });

  test('should filter by multiple criteria', async () => {
    const icons = await loader.getAllHarnesses(
      SimplyMatIconHarness.with({
        ariaHidden: false,
        role: 'img',
        ariaLabel: 'Edit item',
      }),
    );
    expect(icons.length).toBe(1);
    expect(await icons[0].getAriaLabel()).toBe('Edit item');
  });

  test('should filter by selector', async () => {
    const icon = await loader.getHarness(
      SimplyMatIconHarness.with({selector: '#default-icon'}),
    );
    expect(icon).toBeTruthy();
    expect(await icon.getAriaHidden()).toBe(true);
  });
});

@Component({
  template: `
    <!-- Default icon with ariaHidden true (default) -->
    <simply-mat-icon id="default-icon">
      <span class="material-symbols-rounded">add</span>
    </simply-mat-icon>

    <!-- Icon with ariaHidden false -->
    <simply-mat-icon id="visible-icon" [ariaHidden]="false">
      <span class="material-symbols-rounded">edit</span>
    </simply-mat-icon>

    <!-- Icon with ariaHidden false and ariaLabel -->
    <simply-mat-icon
      id="labeled-icon"
      [ariaHidden]="false"
      [ariaLabel]="'Edit item'">
      <span class="material-symbols-rounded">edit</span>
    </simply-mat-icon>

    <!-- Icon with ariaHidden true and ariaLabel (should be ignored) -->
    <simply-mat-icon
      id="hidden-with-label-icon"
      [ariaHidden]="true"
      [ariaLabel]="'Should be ignored'">
      <span class="material-symbols-rounded">delete</span>
    </simply-mat-icon>

    <!-- Another icon with ariaHidden false -->
    <simply-mat-icon id="visible-icon-2" [ariaHidden]="false">
      <span class="material-symbols-rounded">settings</span>
    </simply-mat-icon>

    <!-- Another labeled icon -->
    <simply-mat-icon
      id="labeled-icon-2"
      [ariaHidden]="false"
      [ariaLabel]="'Edit document'">
      <span class="material-symbols-rounded">edit</span>
    </simply-mat-icon>

    <!-- Icon with different content -->
    <simply-mat-icon id="star-icon">
      <span class="material-symbols-rounded">star</span>
    </simply-mat-icon>

    <!-- Dynamic icon for reactive tests -->
    <simply-mat-icon
      id="dynamic-icon"
      [ariaHidden]="dynamicAriaHidden()"
      [ariaLabel]="dynamicAriaLabel()">
      <span class="material-symbols-rounded">settings</span>
    </simply-mat-icon>
  `,
  imports: [SimplyMatIcon],
})
class IconHarnessTest {
  dynamicAriaHidden = signal<boolean>(true);
  dynamicAriaLabel = signal<string | null>(null);
}

