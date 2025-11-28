import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {beforeEach, describe, expect, test} from 'vitest';
import {SimplyMatFab} from '../fab';
import {SimplyMatExtendedFab} from '../../extended-fab/extended-fab';
import {SimplyMatFabHarness} from './fab-harness';

describe('SimplyMatFabHarness', () => {
  let fixture: ComponentFixture<FabHarnessTest>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    fixture = TestBed.createComponent(FabHarnessTest);
    fixture.detectChanges();
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  test('should load FAB harnesses by selector', async () => {
    const fabs = await loader.getAllHarnesses(SimplyMatFabHarness);
    expect(fabs.length).toBe(2);
  });

  test('should only find FAB buttons (ignores extended FAB and other buttons)', async () => {
    const fabButtons = await loader.getAllHarnesses(SimplyMatFabHarness);
    const allFabTexts = await Promise.all(fabButtons.map(fab => fab.getText()));

    expect(allFabTexts).toEqual(['FAB button', 'Another FAB']);
    expect(allFabTexts).not.toContain('Extended FAB');
  });

  test('should inherit methods from FabBaseHarness', async () => {
    const fab = await loader.getHarness(
      SimplyMatFabHarness.with({text: 'FAB button'}),
    );
    expect(await fab.getColor()).toBe('primary');
    expect(await fab.getSize()).toBe('small');
    expect(await fab.isTonal()).toBe(false);
  });
});

@Component({
  template: `
    <button simplyMatFab color="primary">
      FAB button
    </button>

    <button simplyMatFab color="secondary">
      Another FAB
    </button>

    <button simplyMatExtendedFab color="primary">
      Extended FAB
    </button>
  `,
  imports: [SimplyMatFab, SimplyMatExtendedFab],
})
class FabHarnessTest {}

