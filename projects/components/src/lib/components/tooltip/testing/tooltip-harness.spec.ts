import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {describe, beforeEach, test, expect} from 'vitest';
import {SimplyMatTooltip} from '../tooltip';
import {SimplyMatTooltipContentComponent} from '../tooltip-content.component';
import {SmTooltipHarness} from './tooltip-harness';

describe('SmTooltipHarness', () => {
  let fixture: ComponentFixture<TooltipHarnessTest>;
  let loader: HarnessLoader;

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipHarnessTest);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  test('should load all tooltip harnesses', async () => {
    const tooltips = await loader.getAllHarnesses(SmTooltipHarness);
    expect(tooltips.length).toBe(4);
  });

  test('should load tooltip with specific selector', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#plain'}));
    expect(tooltip).toBeDefined();
  });

  test('should show tooltip via interaction methods', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#plain'}));
    expect(await tooltip.isOpen()).toBe(false);

    await tooltip.show();

    await expect.poll(async () => await tooltip.isOpen()).toBe(true);
  });

  test('should hide tooltip via interaction methods', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#plain'}));
    
    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);

    await tooltip.hide();

    await expect.poll(async () => await tooltip.isOpen()).toBe(false);
  });

  test('should open tooltip programmatically', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#plain'}));
    expect(await tooltip.isOpen()).toBe(false);

    await tooltip.open();

    await expect.poll(async () => await tooltip.isOpen()).toBe(true);
  });

  test('should check if tooltip is disabled', async () => {
    const enabled = await loader.getHarness(SmTooltipHarness.with({selector: '#plain'}));
    const disabled = await loader.getHarness(SmTooltipHarness.with({selector: '#disabled'}));

    expect(await enabled.isDisabled()).toBe(false);
    expect(await disabled.isDisabled()).toBe(true);
  });

  test('should get tooltip type for plain tooltip', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#plain'}));

    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);

    expect(await tooltip.getType()).toBe('plain');
  });

  test('should get tooltip type for rich tooltip', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#rich'}));

    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);

    expect(await tooltip.getType()).toBe('rich');
  });

  test('should get plain tooltip text', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#plain'}));

    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);

    expect(await tooltip.getTooltipText()).toBe('This is a plain tooltip');
  });

  test('should return empty string when getting tooltip text while closed', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#plain'}));

    expect(await tooltip.getTooltipText()).toBe('');
  });

  test('should render rich tooltip with template content', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#rich'}));

    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);

    expect(await tooltip.getType()).toBe('rich');
  });
});

@Component({
  selector: 'tooltip-harness-test',
  template: `
    <ng-template #plainTooltipTpl>
      <sm-tooltip-content>
        <span>This is a plain tooltip</span>
      </sm-tooltip-content>
    </ng-template>
    <ng-template #richTooltipTpl>
      <sm-tooltip-content>
        <div>Rich Tooltip Content</div>
      </sm-tooltip-content>
    </ng-template>
    <ng-template #richNoSubheadTpl>
      <sm-tooltip-content>
        <div>Supporting text without subhead</div>
      </sm-tooltip-content>
    </ng-template>
    <ng-template #disabledTooltipTpl>
      <sm-tooltip-content>
        <span>Disabled tooltip</span>
      </sm-tooltip-content>
    </ng-template>

    <button
      id="plain"
      sm-tooltip
      [tooltip]="plainTooltipTpl"
      [tooltipType]="'plain'"
      [config]="testConfig"
    >
      Plain Tooltip
    </button>

    <button
      id="rich"
      sm-tooltip
      [tooltip]="richTooltipTpl"
      [tooltipType]="'rich'"
      [config]="testConfig"
    >
      Rich Tooltip
    </button>

    <button
      id="rich-no-subhead"
      sm-tooltip
      [tooltip]="richNoSubheadTpl"
      [tooltipType]="'rich'"
      [config]="testConfig"
    >
      Rich Tooltip No Subhead
    </button>

    <button
      id="disabled"
      sm-tooltip
      [tooltip]="disabledTooltipTpl"
      [tooltipType]="'plain'"
      [config]="testConfig"
      disabled
    >
      Disabled Tooltip
    </button>
  `,
  imports: [SimplyMatTooltip, SimplyMatTooltipContentComponent],
})
class TooltipHarnessTest {
  testConfig = {
    showDelay: 0,
    hideDelay: 100
  };
}

