import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {beforeEach, describe, expect, test} from 'vitest';
import {SimplyMatExtendedFab} from '../extended-fab';
import {SimplyMatFab} from '../../fab/fab';
import {SimplyMatExtendedFabHarness} from './extended-fab-harness';

describe('SimplyMatExtendedFabHarness', () => {
  let fixture: ComponentFixture<ExtendedFabHarnessTest>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ExtendedFabHarnessTest);
    fixture.detectChanges();
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  test('should load Extended FAB harnesses by selector', async () => {
    const extendedFabs = await loader.getAllHarnesses(SimplyMatExtendedFabHarness);
    expect(extendedFabs.length).toBe(2);
  });

  test('should only find Extended FAB buttons (ignores FAB and other buttons)', async () => {
    const extendedFabButtons = await loader.getAllHarnesses(SimplyMatExtendedFabHarness);
    const allExtendedFabTexts = await Promise.all(extendedFabButtons.map(fab => fab.getText()));

    expect(allExtendedFabTexts).toEqual(['Extended FAB button', 'Another Extended FAB']);
    expect(allExtendedFabTexts).not.toContain('FAB');
  });

  test('should inherit methods from FabBaseHarness', async () => {
    const extendedFab = await loader.getHarness(
      SimplyMatExtendedFabHarness.with({text: 'Extended FAB button'}),
    );
    expect(await extendedFab.getColor()).toBe('primary');
    expect(await extendedFab.getSize()).toBe('small');
    expect(await extendedFab.isTonal()).toBe(false);
  });
});

@Component({
  template: `
    <button simplyMatExtendedFab color="primary">
      Extended FAB button
    </button>

    <button simplyMatExtendedFab color="secondary">
      Another Extended FAB
    </button>

    <button simplyMatFab color="primary">
      FAB
    </button>
  `,
  imports: [SimplyMatExtendedFab, SimplyMatFab],
})
class ExtendedFabHarnessTest {}

