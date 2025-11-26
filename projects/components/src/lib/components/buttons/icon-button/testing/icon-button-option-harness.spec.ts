import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {beforeEach, describe, expect, test} from 'vitest';
import {SimplyMatIconButtonOption} from '../icon-button-option';
import {SimplyMatIconButtonOptionHarness} from './icon-button-option-harness';
import {SimplyMatIconButton} from '../icon-button';

describe('SimplyMatIconButtonOptionHarness', () => {
  let fixture: ComponentFixture<IconButtonOptionHarnessTest>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    fixture = TestBed.createComponent(IconButtonOptionHarnessTest);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  test('should load icon button-option harnesses by selector', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatIconButtonOptionHarness);
    expect(buttons.length).toBe(2);
  });

  test('should only find icon buttons with ngOption attribute (ignores buttons without ngOption)', async () => {
    const optionButtons = await loader.getAllHarnesses(SimplyMatIconButtonOptionHarness);
    const allButtonTexts = await Promise.all(optionButtons.map(btn => btn.getText()));

    expect(allButtonTexts).toEqual(['Icon option', 'Another icon option']);
    expect(allButtonTexts).not.toContain('Not an option button');
  });

  test('should inherit getWidth() method from parent harness', async () => {
    const button = await loader.getHarness(
      SimplyMatIconButtonOptionHarness.with({text: 'Icon option'}),
    );
    expect(await button.getWidth()).toBe('narrow');
  });
});

@Component({
  template: `
    <button simplyMatIconButton variant="filled" ngOption width="narrow">
      Icon option
    </button>

    <button simplyMatIconButton variant="tonal" ngOption>
      Another icon option
    </button>

    <button simplyMatIconButton variant="outlined">
      Not an option button
    </button>
  `,
  imports: [SimplyMatIconButtonOption, SimplyMatIconButton],
})
class IconButtonOptionHarnessTest {}
