import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {describe, beforeEach, test, expect} from 'vitest';
import {SmTooltipDirective} from '../tooltip';
import {RichTooltipConfig} from '../tooltip-content.component';
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

  test('should get rich tooltip subhead', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#rich'}));
    
    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);
    
    expect(await tooltip.getSubhead()).toBe('Rich Tooltip');
  });

  test('should return null for subhead when not present', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#rich-no-subhead'}));
    
    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);
    
    expect(await tooltip.getSubhead()).toBe(null);
  });

  test('should get rich tooltip supporting text', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#rich'}));
    
    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);
    
    expect(await tooltip.getSupportingText()).toBe('This is supporting text for the rich tooltip');
  });

  test('should get button labels from rich tooltip', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#rich'}));
    
    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);
    
    const buttons = await tooltip.getButtons();
    expect(buttons).toEqual(['Action 1', 'Action 2']);
  });

  test('should return empty array when getting buttons from closed tooltip', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#rich'}));
    
    const buttons = await tooltip.getButtons();
    expect(buttons).toEqual([]);
  });

  test('should click button by index', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#rich'}));
    
    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);
    
    expect(fixture.componentInstance.button1Clicked()).toBe(false);
    
    await tooltip.clickButton(0);
    await fixture.whenStable();
    
    expect(fixture.componentInstance.button1Clicked()).toBe(true);
  });

  test('should click button by label', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#rich'}));
    
    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);
    
    expect(fixture.componentInstance.button2Clicked()).toBe(false);
    
    await tooltip.clickButton('Action 2');
    await fixture.whenStable();
    
    expect(fixture.componentInstance.button2Clicked()).toBe(true);
  });

  test('should throw error when clicking button on closed tooltip', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#rich'}));
    
    await expect(tooltip.clickButton(0)).rejects.toThrow('Cannot click button when tooltip is closed');
  });

  test('should throw error when clicking button with invalid index', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#rich'}));
    
    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);
    
    await expect(tooltip.clickButton(10)).rejects.toThrow('Button index 10 is out of bounds');
  });

  test('should throw error when clicking button with non-existent label', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#rich'}));
    
    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);
    
    await expect(tooltip.clickButton('Non-existent')).rejects.toThrow('Button with label "Non-existent" not found');
  });

  test('should handle rich tooltip without subhead', async () => {
    const tooltip = await loader.getHarness(SmTooltipHarness.with({selector: '#rich-no-subhead'}));
    
    await tooltip.show();
    await expect.poll(async () => await tooltip.isOpen()).toBe(true);
    
    expect(await tooltip.getSubhead()).toBe(null);
    expect(await tooltip.getSupportingText()).toBe('Supporting text without subhead');
  });
});

@Component({
  selector: 'tooltip-harness-test',
  template: `
    <button 
      id="plain"
      sm-tooltip
      [tooltip]="'This is a plain tooltip'"
      [config]="testConfig"
    >
      Plain Tooltip
    </button>

    <button 
      id="rich"
      sm-tooltip
      [tooltip]="richConfig()"
      [config]="testConfig"
    >
      Rich Tooltip
    </button>

    <button 
      id="rich-no-subhead"
      sm-tooltip
      [tooltip]="richConfigNoSubhead()"
      [config]="testConfig"
    >
      Rich Tooltip No Subhead
    </button>

    <button 
      id="disabled"
      sm-tooltip
      [tooltip]="'Disabled tooltip'"
      [config]="testConfig"
      disabled
    >
      Disabled Tooltip
    </button>
  `,
  imports: [SmTooltipDirective],
})
class TooltipHarnessTest {
  testConfig = {
    showDelay: 0,
    hideDelay: 100
  };
  button1Clicked = signal(false);
  button2Clicked = signal(false);

  richConfig = signal<RichTooltipConfig>({
    subhead: 'Rich Tooltip',
    supportingText: 'This is supporting text for the rich tooltip',
    buttons: [
      {
        label: 'Action 1',
        action: () => this.button1Clicked.set(true)
      },
      {
        label: 'Action 2',
        action: () => this.button2Clicked.set(true)
      }
    ]
  });

  richConfigNoSubhead = signal<RichTooltipConfig>({
    supportingText: 'Supporting text without subhead'
  });
}

