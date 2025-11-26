import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {beforeEach, describe, expect, test} from 'vitest';
import {SimplyMatButtonOption} from '../button-option';
import {SimplyMatButton} from '../button';
import {SimplyMatButtonOptionHarness} from './button-option-harness';

describe('SimplyMatButtonOptionHarness', () => {
  let fixture: ComponentFixture<ButtonOptionHarnessTest>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ButtonOptionHarnessTest);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  test('should load button-option harnesses by selector', async () => {
    const buttons = await loader.getAllHarnesses(SimplyMatButtonOptionHarness);
    expect(buttons.length).toBe(2);
  });

  test('should only find buttons with ngOption attribute (ignores regular buttons)', async () => {
    const optionButtons = await loader.getAllHarnesses(SimplyMatButtonOptionHarness);
    const allButtonTexts = await Promise.all(optionButtons.map(btn => btn.getText()));
    
    expect(allButtonTexts).toEqual(['Option button', 'Another option']);
    expect(allButtonTexts).not.toContain('Regular button');
  });

  test('should inherit getVariant() method from parent harness', async () => {
    const button = await loader.getHarness(
      SimplyMatButtonOptionHarness.with({text: 'Option button'}),
    );
    expect(await button.getVariant()).toBe('filled');
  });
});

@Component({
  template: `
    <button simplyMatButton variant="filled" ngOption>
      Option button
    </button>

    <button simplyMatButton variant="elevated" ngOption>
      Another option
    </button>

    <button simplyMatButton variant="tonal">
      Regular button
    </button>
  `,
  imports: [SimplyMatButtonOption, SimplyMatButton],
})
class ButtonOptionHarnessTest {}
