import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Overlay, OverlayConfig, OverlayContainer} from '@angular/cdk/overlay';
import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import {SmTooltipDirective, TooltipConfig} from './tooltip';
import {RichTooltipConfig, TooltipContentComponent} from './tooltip-content.component';
import {SimplyMatButton} from '../buttons/button/button';

const defaultTooltipConfig: TooltipConfig = {
  position: null,
  showDelay: 0,
  hideDelay: 1500,
  persistStrategy: null,
  trigger: 'default',
  overlayConfig: null,
  positionOffset: null,
};

@Component({
  template: `
    <button id="plain-tooltip" sm-tooltip [tooltip]="'Plain tooltip text'" [config]="defaultTooltipConfig">Hover me</button>
    <button id="rich-tooltip" sm-tooltip [tooltip]="richConfig" [config]="defaultTooltipConfig">Rich tooltip</button>
    <button id="rich-tooltip-no-buttons" sm-tooltip [tooltip]="richConfigNoButtons" [config]="defaultTooltipConfig">Rich no buttons</button>
    <button id="custom-delay" sm-tooltip [tooltip]="'Delayed tooltip'" [config]="customDelayConfig">Custom delay</button>
    <button id="position-above" sm-tooltip [tooltip]="'Above tooltip'" [config]="positionAboveConfig">Above</button>
    <button id="position-below" sm-tooltip [tooltip]="'Below tooltip'" [config]="positionBelowConfig">Below</button>
    <button id="position-left" sm-tooltip [tooltip]="'Left tooltip'" [config]="positionLeftConfig">Left</button>
    <button id="position-right" sm-tooltip [tooltip]="'Right tooltip'" [config]="positionRightConfig">Right</button>
    <button id="explicit-on-hover" sm-tooltip [tooltip]="richConfig" [config]="explicitOnHoverConfig">Explicit on-hover</button>
    <button id="explicit-on-hover-with-tooltip" sm-tooltip [tooltip]="'Plain text'" [config]="explicitOnHoverWithTooltipConfig">Explicit on-hover-with-tooltip</button>
    <button #programmaticTooltip="smTooltip" id="programmatic-tooltip" sm-tooltip [tooltip]="'Programmatic tooltip'" [config]="defaultTooltipConfig">Programmatic</button>
    <button id="manual-tooltip" sm-tooltip [tooltip]="'Manual tooltip'" [config]="manualTriggerConfig">Manual</button>
    <button id="default-tooltip" sm-tooltip [tooltip]="'Default tooltip'" [config]="defaultTriggerConfig">Default</button>
    <button id="custom-config-tooltip" sm-tooltip [tooltip]="'Custom config tooltip'" [config]="customOverlayConfigValue">Custom Config</button>
    <button id="disabled-button" sm-tooltip [tooltip]="'Disabled tooltip'" [config]="defaultTooltipConfig" disabled>Disabled</button>
    <button #disabledProgrammaticTooltip="smTooltip" id="disabled-programmatic-tooltip" sm-tooltip [tooltip]="'Disabled controlled tooltip'" [config]="defaultTooltipConfig" disabled>Disabled Controlled</button>
    <button id="custom-offset-plain" sm-tooltip [tooltip]="'Custom offset plain'" [config]="customOffsetPlainConfig">Custom Offset Plain</button>
    <button id="custom-offset-rich" sm-tooltip [tooltip]="richConfig" [config]="customOffsetRichConfig">Custom Offset Rich</button>
    <button id="rich-above" sm-tooltip [tooltip]="richConfig" [config]="richAboveConfig">Rich Above</button>
    <div id="no-tooltip">No tooltip</div>
  `,
  imports: [SmTooltipDirective],
})
class TooltipTestComponent {
  defaultTooltipConfig = defaultTooltipConfig;
  customDelayConfig: TooltipConfig = {...defaultTooltipConfig, showDelay: 100, hideDelay: 200};
  positionAboveConfig: TooltipConfig = {...defaultTooltipConfig, position: 'above'};
  positionBelowConfig: TooltipConfig = {...defaultTooltipConfig, position: 'below'};
  positionLeftConfig: TooltipConfig = {...defaultTooltipConfig, position: 'left'};
  positionRightConfig: TooltipConfig = {...defaultTooltipConfig, position: 'right'};
  explicitOnHoverConfig: TooltipConfig = {...defaultTooltipConfig, persistStrategy: 'on-hover'};
  explicitOnHoverWithTooltipConfig: TooltipConfig = {...defaultTooltipConfig, persistStrategy: 'on-hover-with-tooltip'};
  manualTriggerConfig: TooltipConfig = {...defaultTooltipConfig, trigger: 'manual'};
  defaultTriggerConfig: TooltipConfig = {...defaultTooltipConfig, trigger: 'default'};
  customOffsetPlainConfig: TooltipConfig = {...defaultTooltipConfig, positionOffset: 12};
  customOffsetRichConfig: TooltipConfig = {...defaultTooltipConfig, positionOffset: 16};
  richAboveConfig: TooltipConfig = {...defaultTooltipConfig, position: 'above'};

  richConfig: RichTooltipConfig = {
    subhead: 'Rich Tooltip Subhead',
    supportingText: 'This is supporting text for the rich tooltip',
    buttons: [
      {label: 'Action 1', action: () => {}},
      {label: 'Action 2', action: () => {}},
    ],
  };
  richConfigNoButtons: RichTooltipConfig = {
    subhead: 'Rich Tooltip Subhead',
    supportingText: 'This is supporting text for the rich tooltip without buttons',
  };
  customOverlayConfig: OverlayConfig | null = null;

  get customOverlayConfigValue(): TooltipConfig {
    return {...defaultTooltipConfig, overlayConfig: this.customOverlayConfig};
  }
}

describe('SmTooltipDirective', () => {
  let fixture: ComponentFixture<TooltipTestComponent>;
  let overlayContainer: OverlayContainer;
  let testPage: TooltipPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipTestComponent, SmTooltipDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipTestComponent);
    overlayContainer = TestBed.inject(OverlayContainer);
    testPage = new TooltipPage(fixture, overlayContainer);
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture.componentInstance.customOverlayConfig = null;
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Directive Creation', () => {
    test('should create directive on element with sm-tooltip attribute', () => {
      const directive = testPage.getDirective('plain-tooltip');
      expect(directive).toBeTruthy();
    });

    test('should not create directive on element without sm-tooltip', () => {
      const div = fixture.debugElement.query(By.css('#no-tooltip'));
      const directive = div.injector.get(SmTooltipDirective, null);
      expect(directive).toBeNull();
    });
  });

  describe('Tooltip Visibility', () => {
    test('should show tooltip on mouseenter after delay', async () => {
      vi.useFakeTimers();

      await testPage.hover('plain-tooltip');
      expect(testPage.isTooltipVisible()).toBe(false);

      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);
    });

    test('should hide tooltip on mouseleave after delay', async () => {
      vi.useFakeTimers();

      await testPage.hover('plain-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.leave('plain-tooltip');
      expect(testPage.isTooltipVisible()).toBe(true);

      testPage.advanceTime(1500);
      await testPage.waitForTooltipRemoval('plain-tooltip');
      expect(testPage.isTooltipVisible()).toBe(false);
    });

    test('should show tooltip on focus after delay', async () => {
      vi.useFakeTimers();

      await testPage.focus('plain-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);
    });

    test('should hide tooltip on blur after delay', async () => {
      vi.useFakeTimers();

      await testPage.focus('plain-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.blur('plain-tooltip');
      testPage.advanceTime(1500);
      await testPage.waitForTooltipRemoval('plain-tooltip');
      expect(testPage.isTooltipVisible()).toBe(false);
    });

    test('should respect custom show and hide delays', async () => {
      vi.useFakeTimers();

      await testPage.hover('custom-delay');
      testPage.advanceTime(50);
      expect(testPage.isTooltipVisible()).toBe(false);

      testPage.advanceTime(50);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.leave('custom-delay');
      testPage.advanceTime(100);
      expect(testPage.isTooltipVisible()).toBe(true);

      testPage.advanceTime(100);
      await testPage.waitForTooltipRemoval('custom-delay');
      expect(testPage.isTooltipVisible()).toBe(false);
    });

    test('should show rich tooltip on click', async () => {
      vi.useFakeTimers();

      await testPage.click('rich-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);
      expect(testPage.getTooltipType()).toBe('rich');
    });

    test('should cancel hide timeout when hovering back during hide delay', async () => {
      vi.useFakeTimers();

      await testPage.hover('plain-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.leave('plain-tooltip');
      testPage.advanceTime(500);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.hover('plain-tooltip');
      testPage.advanceTime(1500);
      expect(testPage.isTooltipVisible()).toBe(true);
    });
  });

  describe('Tooltip Content Rendering', () => {
    test('should render plain tooltip with correct text and role', async () => {
      vi.useFakeTimers();

      await testPage.hover('plain-tooltip');
      testPage.advanceTime(0);

      expect(testPage.isTooltipVisible()).toBe(true);
      expect(testPage.getTooltipType()).toBe('plain');
      expect(testPage.getTooltipRole()).toBe('tooltip');
      expect(testPage.getTooltipText()).toBe('Plain tooltip text');
    });

    test('should render rich tooltip with subhead, text, and buttons', async () => {
      vi.useFakeTimers();

      await testPage.click('rich-tooltip');
      testPage.advanceTime(0);

      expect(testPage.isTooltipVisible()).toBe(true);
      expect(testPage.getTooltipSubhead()).toBe('Rich Tooltip Subhead');
      expect(testPage.getSupportingText()).toBe('This is supporting text for the rich tooltip');

      const buttons = testPage.getTooltipButtons();
      expect(buttons.length).toBe(2);
      expect(buttons[0]?.textContent?.trim()).toBe('Action 1');
      expect(buttons[1]?.textContent?.trim()).toBe('Action 2');
    });

    test('should call button action on click', async () => {
      vi.useFakeTimers();
      const actionSpy = vi.fn();
      fixture.componentInstance.richConfig.buttons![0].action = actionSpy;

      await testPage.click('rich-tooltip');
      testPage.advanceTime(0);

      await testPage.clickTooltipButton(0);
      expect(actionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tooltip Persistence Strategy', () => {
    test('should hide plain tooltip when leaving host with default on-hover strategy', async () => {
      vi.useFakeTimers();

      await testPage.hover('plain-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.leave('plain-tooltip');
      testPage.advanceTime(1500);
      await testPage.waitForTooltipRemoval('plain-tooltip');
      expect(testPage.isTooltipVisible()).toBe(false);
    });

    test('should keep rich tooltip visible when hovering tooltip with buttons', async () => {
      vi.useFakeTimers();

      await testPage.click('rich-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.click('rich-tooltip');
      await testPage.leave('rich-tooltip');
      await testPage.hoverTooltipContainer();

      testPage.advanceTime(1500);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.leaveTooltipContainer();
      testPage.advanceTime(1500);
      await testPage.waitForTooltipRemoval('rich-tooltip');
      expect(testPage.isTooltipVisible()).toBe(false);
    });

    test('should hide rich tooltip without buttons when leaving host', async () => {
      vi.useFakeTimers();

      await testPage.click('rich-tooltip-no-buttons');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.click('rich-tooltip-no-buttons');
      await testPage.leave('rich-tooltip-no-buttons');

      testPage.advanceTime(1500);
      await testPage.waitForTooltipRemoval('rich-tooltip-no-buttons');
      expect(testPage.isTooltipVisible()).toBe(false);
    });

    test('should respect explicit on-hover strategy override', async () => {
      vi.useFakeTimers();

      await testPage.click('explicit-on-hover');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.click('explicit-on-hover');
      await testPage.leave('explicit-on-hover');
      await testPage.hoverTooltipContainer();

      testPage.advanceTime(1500);
      await testPage.waitForTooltipRemoval('explicit-on-hover');
      expect(testPage.isTooltipVisible()).toBe(false);
    });

    test('should respect explicit on-hover-with-tooltip strategy override', async () => {
      vi.useFakeTimers();

      await testPage.hover('explicit-on-hover-with-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.leave('explicit-on-hover-with-tooltip');
      await testPage.hoverTooltipContainer();

      testPage.advanceTime(1500);
      expect(testPage.isTooltipVisible()).toBe(true);
    });

    test('should cancel hide timeout when hovering tooltip container', async () => {
      vi.useFakeTimers();

      await testPage.click('rich-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.click('rich-tooltip');
      await testPage.leave('rich-tooltip');
      testPage.advanceTime(500);

      await testPage.hoverTooltipContainer();
      testPage.advanceTime(1500);
      expect(testPage.isTooltipVisible()).toBe(true);
    });
  });

  describe('Programmatic Control', () => {
    test('should open tooltip via directive API', async () => {
      vi.useFakeTimers();
      const directive = testPage.getDirective('programmatic-tooltip');

      directive.open();
      fixture.detectChanges();

      expect(testPage.isTooltipVisible()).toBe(true);
    });

    test('should close tooltip via directive API', async () => {
      vi.useFakeTimers();
      const directive = testPage.getDirective('programmatic-tooltip');

      directive.open();
      fixture.detectChanges();
      expect(testPage.isTooltipVisible()).toBe(true);

      directive.close();
      fixture.detectChanges();
      await testPage.waitForTooltipRemoval('programmatic-tooltip');
      expect(testPage.isTooltipVisible()).toBe(false);

      await testPage.hover('programmatic-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);
    });

    test('should ignore user events when programmatically controlled', async () => {
      vi.useFakeTimers();
      const directive = testPage.getDirective('programmatic-tooltip');

      directive.open();
      fixture.detectChanges();
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.leave('programmatic-tooltip');
      testPage.advanceTime(1500);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.blur('programmatic-tooltip');
      testPage.advanceTime(1500);
      expect(testPage.isTooltipVisible()).toBe(true);
    });

    test('should allow programmatic control after normal interaction', async () => {
      vi.useFakeTimers();
      const directive = testPage.getDirective('programmatic-tooltip');

      await testPage.hover('programmatic-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);

      await testPage.leave('programmatic-tooltip');
      testPage.advanceTime(1500);
      await testPage.waitForTooltipRemoval('programmatic-tooltip');
      expect(testPage.isTooltipVisible()).toBe(false);

      directive.open();
      fixture.detectChanges();
      expect(testPage.isTooltipVisible()).toBe(true);
    });
  });

  describe('Trigger Modes', () => {
    test('should not show tooltip on user interaction when trigger is manual', async () => {
      vi.useFakeTimers();

      await testPage.hover('manual-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(false);

      await testPage.focus('manual-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(false);

      await testPage.click('manual-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(false);
    });

    test('should allow programmatic control when trigger is manual', async () => {
      vi.useFakeTimers();
      const directive = testPage.getDirective('manual-tooltip');

      directive.open();
      fixture.detectChanges();
      expect(testPage.isTooltipVisible()).toBe(true);

      directive.close();
      fixture.detectChanges();
      await testPage.waitForTooltipRemoval('manual-tooltip');
      expect(testPage.isTooltipVisible()).toBe(false);
    });

    test('should show tooltip on hover when trigger is default', async () => {
      vi.useFakeTimers();

      await testPage.hover('default-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);
    });

    test('should allow programmatic control when trigger is default', async () => {
      vi.useFakeTimers();
      const directive = testPage.getDirective('default-tooltip');

      directive.open();
      fixture.detectChanges();
      expect(testPage.isTooltipVisible()).toBe(true);

      directive.close();
      fixture.detectChanges();
      await testPage.waitForTooltipRemoval('default-tooltip');
      expect(testPage.isTooltipVisible()).toBe(false);
    });
  });

  describe('Custom Overlay Configuration', () => {
    test('should use default overlay config when not provided', async () => {
      vi.useFakeTimers();

      await testPage.hover('plain-tooltip');
      testPage.advanceTime(0);

      const directive = testPage.getDirective('plain-tooltip');
      const config = directive.overlayRef?.getConfig();

      expect(config).toBeTruthy();
      expect(config!.maxWidth).toBe('14.2857rem');
      expect(config!.hasBackdrop).toBe(false);
      expect(config!.disposeOnNavigation).toBe(true);
    });

    test('should merge custom overlay config with defaults', async () => {
      vi.useFakeTimers();
      fixture.componentInstance.customOverlayConfig = new OverlayConfig({
        panelClass: ['custom-panel-class'],
        hasBackdrop: true,
        maxWidth: '500px',
      });
      fixture.detectChanges();

      await testPage.hover('custom-config-tooltip');
      testPage.advanceTime(0);

      const directive = testPage.getDirective('custom-config-tooltip');
      const config = directive.overlayRef?.getConfig();

      expect(config).toBeTruthy();
      expect(config!.panelClass).toContain('custom-panel-class');
      expect(config!.hasBackdrop).toBe(true);
      expect(config!.maxWidth).toBe('500px');
    });

    test('should use default values for undefined properties in custom config', async () => {
      vi.useFakeTimers();
      fixture.componentInstance.customOverlayConfig = new OverlayConfig({
        panelClass: ['custom-panel-class'],
      });
      fixture.detectChanges();

      await testPage.hover('custom-config-tooltip');
      testPage.advanceTime(0);

      const directive = testPage.getDirective('custom-config-tooltip');
      const config = directive.overlayRef?.getConfig();

      expect(config).toBeTruthy();
      expect(config!.panelClass).toContain('custom-panel-class');
      expect(config!.maxWidth).toBe('14.2857rem');
      expect(config!.hasBackdrop).toBe(false);
    });

    test('should allow custom position strategy override', async () => {
      vi.useFakeTimers();
      const overlayService = TestBed.inject(Overlay);
      const customPositionStrategy = overlayService.position().global().centerHorizontally().centerVertically();

      fixture.componentInstance.customOverlayConfig = new OverlayConfig({
        positionStrategy: customPositionStrategy,
      });
      fixture.detectChanges();

      await testPage.hover('custom-config-tooltip');
      testPage.advanceTime(0);

      const directive = testPage.getDirective('custom-config-tooltip');
      const config = directive.overlayRef?.getConfig();

      expect(config).toBeTruthy();
      expect(config!.positionStrategy).toBe(customPositionStrategy);
    });
  });

  describe('Disabled State', () => {
    test('should not show tooltip on user interaction when disabled', async () => {
      vi.useFakeTimers();

      await testPage.hover('disabled-button');
      testPage.advanceTime(1000);
      expect(testPage.isTooltipVisible()).toBe(false);

      await testPage.focus('disabled-button');
      testPage.advanceTime(1000);
      expect(testPage.isTooltipVisible()).toBe(false);

      await testPage.click('disabled-button');
      testPage.advanceTime(1000);
      expect(testPage.isTooltipVisible()).toBe(false);
    });

    test('should allow programmatic control when disabled', async () => {
      vi.useFakeTimers();
      const directive = testPage.getDirective('disabled-programmatic-tooltip');

      directive.open();
      fixture.detectChanges();
      expect(testPage.isTooltipVisible()).toBe(true);
      expect(testPage.getTooltipText()).toBe('Disabled controlled tooltip');

      directive.close();
      fixture.detectChanges();
      await testPage.waitForTooltipRemoval('disabled-programmatic-tooltip');
      expect(testPage.isTooltipVisible()).toBe(false);
    });
  });

  describe('Tooltip Positioning', () => {
    test('should default to above for plain tooltips', async () => {
      vi.useFakeTimers();

      await testPage.hover('plain-tooltip');
      testPage.advanceTime(0);

      const directive = testPage.getDirective('plain-tooltip');
      const positions = testPage.getPositionStrategy(directive);

      expect(positions).toBeTruthy();
      expect(positions.length).toBeGreaterThan(0);
      expect(positions[0].originY).toBe('top');
      expect(positions[0].overlayY).toBe('bottom');
    });

    test('should default to below for rich tooltips', async () => {
      vi.useFakeTimers();

      await testPage.click('rich-tooltip');
      testPage.advanceTime(0);

      const directive = testPage.getDirective('rich-tooltip');
      const positions = testPage.getPositionStrategy(directive);

      expect(positions).toBeTruthy();
      expect(positions.length).toBeGreaterThan(0);
      expect(positions[0].originY).toBe('bottom');
      expect(positions[0].overlayY).toBe('top');
    });

    test.each([
      { id: 'position-above', position: 'above', originY: 'top', overlayY: 'bottom' },
      { id: 'position-below', position: 'below', originY: 'bottom', overlayY: 'top' },
      { id: 'position-left', position: 'left', originX: 'start', overlayX: 'end' },
      { id: 'position-right', position: 'right', originX: 'end', overlayX: 'start' },
    ])('should position tooltip $position when configured', async ({ id, originY, overlayY, originX, overlayX }) => {
      vi.useFakeTimers();

      await testPage.hover(id);
      testPage.advanceTime(0);

      const directive = testPage.getDirective(id);
      const positions = testPage.getPositionStrategy(directive);

      expect(positions).toBeTruthy();
      expect(positions.length).toBeGreaterThan(0);

      if (originY && overlayY) {
        expect(positions[0].originY).toBe(originY);
        expect(positions[0].overlayY).toBe(overlayY);
      }
      if (originX && overlayX) {
        expect(positions[0].originX).toBe(originX);
        expect(positions[0].overlayX).toBe(overlayX);
      }
    });

    test('should use explicit position override for rich tooltips', async () => {
      vi.useFakeTimers();

      await testPage.click('rich-above');
      testPage.advanceTime(0);

      const directive = testPage.getDirective('rich-above');
      const positions = testPage.getPositionStrategy(directive);

      expect(positions).toBeTruthy();
      expect(positions[0].originY).toBe('top');
      expect(positions[0].overlayY).toBe('bottom');
    });
  });

  describe('Position Offset', () => {
    test('should use default offset of 4 for plain tooltips', async () => {
      vi.useFakeTimers();

      await testPage.hover('plain-tooltip');
      testPage.advanceTime(0);

      const directive = testPage.getDirective('plain-tooltip');
      const offset = testPage.getPositionOffset(directive);

      expect(offset).toBe(4);
    });

    test('should use default offset of 8 for rich tooltips', async () => {
      vi.useFakeTimers();

      await testPage.click('rich-tooltip');
      testPage.advanceTime(0);

      const directive = testPage.getDirective('rich-tooltip');
      const offset = testPage.getPositionOffset(directive);

      expect(offset).toBe(8);
    });

    test('should use custom offset when provided', async () => {
      vi.useFakeTimers();

      await testPage.hover('custom-offset-plain');
      testPage.advanceTime(0);

      const directive = testPage.getDirective('custom-offset-plain');
      const offset = testPage.getPositionOffset(directive);

      expect(offset).toBe(12);
    });

    test('should use custom offset for rich tooltips when provided', async () => {
      vi.useFakeTimers();

      await testPage.click('custom-offset-rich');
      testPage.advanceTime(0);

      const directive = testPage.getDirective('custom-offset-rich');
      const offset = testPage.getPositionOffset(directive);

      expect(offset).toBe(16);
    });
  });

  describe('Cleanup', () => {
    test('should cleanup overlay on directive destruction', async () => {
      vi.useFakeTimers();

      await testPage.hover('plain-tooltip');
      testPage.advanceTime(0);
      expect(testPage.isTooltipVisible()).toBe(true);

      const directive = testPage.getDirective('plain-tooltip');
      directive.ngOnDestroy();
      fixture.detectChanges();

      expect(testPage.isTooltipVisible()).toBe(false);
    });
  });
});

describe('TooltipContentComponent', () => {
  let component: TooltipContentComponent;
  let fixture: ComponentFixture<TooltipContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipContentComponent, SimplyMatButton],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should render plain tooltip with text', () => {
    fixture.componentRef.setInput('type', 'plain');
    fixture.componentRef.setInput('text', 'Test text');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.sm-tooltip-content__plain-container');
    expect(container).toBeTruthy();
    const text = fixture.nativeElement.querySelector('.sm-tooltip-content__plain-text');
    expect(text?.textContent).toBe('Test text');
  });

  test('should render rich tooltip with all content', () => {
    const config: RichTooltipConfig = {
      subhead: 'Subhead',
      supportingText: 'Supporting text',
      buttons: [{label: 'Button 1'}],
    };
    fixture.componentRef.setInput('type', 'rich');
    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.sm-tooltip-content__rich-container');
    expect(container).toBeTruthy();
    const subhead = fixture.nativeElement.querySelector('.sm-tooltip-content__rich-subhead');
    expect(subhead?.textContent).toBe('Subhead');
    const supportingText = fixture.nativeElement.querySelector('.sm-tooltip-content__rich-supporting-text');
    expect(supportingText?.textContent?.trim()).toBe('Supporting text');
  });

  test('should call button action on click', () => {
    const actionSpy = vi.fn();
    const config: RichTooltipConfig = {
      supportingText: 'Text',
      buttons: [{label: 'Button', action: actionSpy}],
    };
    fixture.componentRef.setInput('type', 'rich');
    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.sm-tooltip-content__rich-action-button');
    button?.click();
    expect(actionSpy).toHaveBeenCalledTimes(1);
  });

  test('should have role="tooltip" attribute', () => {
    const element = fixture.nativeElement;
    expect(element.getAttribute('role')).toBe('tooltip');
  });

  test('should emit closingAnimationComplete when animation ends with open=false', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closingAnimationComplete, 'emit');

    component.open.set(false);
    fixture.detectChanges();

    component.onAnimationEnd();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  test('should not emit closingAnimationComplete when animation ends with open=true', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.closingAnimationComplete, 'emit');

    const div = fixture.nativeElement.querySelector('div[role="tooltip"]');
    const animationEndEvent = new Event('animationend', {bubbles: true});
    div?.dispatchEvent(animationEndEvent);
    fixture.detectChanges();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});

class TooltipPage {
  constructor(
    private fixture: ComponentFixture<TooltipTestComponent>,
    private overlayContainer: OverlayContainer
  ) {}

  getHostElement(selector: string): HTMLElement | null {
    return this.fixture.nativeElement.querySelector(`#${selector}`);
  }

  getTooltipElement(): Element | null {
    return this.overlayContainer.getContainerElement().querySelector('sm-tooltip-content');
  }

  async hover(selector: string): Promise<void> {
    const element = this.getHostElement(selector);
    element?.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
    this.fixture.detectChanges();
  }

  async leave(selector: string): Promise<void> {
    const element = this.getHostElement(selector);
    element?.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
    this.fixture.detectChanges();
  }

  async click(selector: string): Promise<void> {
    const element = this.getHostElement(selector);
    element?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    this.fixture.detectChanges();
  }

  async focus(selector: string): Promise<void> {
    const element = this.getHostElement(selector);
    element?.dispatchEvent(new FocusEvent('focus', {bubbles: true}));
    this.fixture.detectChanges();
  }

  async blur(selector: string): Promise<void> {
    const element = this.getHostElement(selector);
    element?.dispatchEvent(new FocusEvent('blur', {bubbles: true}));
    this.fixture.detectChanges();
  }

  async hoverTooltipContainer(): Promise<void> {
    const overlayPane = this.overlayContainer.getContainerElement().querySelector('.cdk-overlay-pane');
    overlayPane?.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
    this.fixture.detectChanges();
  }

  async leaveTooltipContainer(): Promise<void> {
    const overlayPane = this.overlayContainer.getContainerElement().querySelector('.cdk-overlay-pane');
    overlayPane?.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
    this.fixture.detectChanges();
  }

  isTooltipVisible(): boolean {
    return this.getTooltipElement() !== null;
  }

  getTooltipText(): string {
    const tooltip = this.getTooltipElement();
    const text = tooltip?.querySelector('.sm-tooltip-content__plain-text');
    return text?.textContent || '';
  }

  getTooltipSubhead(): string {
    const tooltip = this.getTooltipElement();
    const subhead = tooltip?.querySelector('.sm-tooltip-content__rich-subhead');
    return subhead?.textContent || '';
  }

  getSupportingText(): string {
    const tooltip = this.getTooltipElement();
    const text = tooltip?.querySelector('.sm-tooltip-content__rich-supporting-text');
    return text?.textContent?.trim() || '';
  }

  getTooltipButtons(): Element[] {
    const tooltip = this.getTooltipElement();
    return Array.from(tooltip?.querySelectorAll('.sm-tooltip-content__rich-action-button') || []);
  }

  getTooltipType(): string | null {
    const tooltip = this.getTooltipElement();
    return tooltip?.getAttribute('data-sm-type') || null;
  }

  getTooltipRole(): string | null {
    const tooltip = this.getTooltipElement();
    return tooltip?.getAttribute('role') || null;
  }

  async clickTooltipButton(index: number): Promise<void> {
    const buttons = this.getTooltipButtons();
    const button = buttons[index] as HTMLElement;
    button?.click();
    this.fixture.detectChanges();
  }

  getDirective(selector: string): SmTooltipDirective {
    const button = this.fixture.debugElement.query(By.css(`#${selector}`));
    return button.injector.get(SmTooltipDirective);
  }

  advanceTime(ms: number): void {
    vi.advanceTimersByTime(ms);
    this.fixture.detectChanges();
  }

  async waitForTooltipRemoval(selector?: string): Promise<void> {
    if (selector) {
      const directive = this.getDirective(selector);
      if (directive?.componentRef) {
        directive.componentRef.instance.onAnimationEnd();
        this.fixture.detectChanges();
      }
    } else {
      // Find all directives and trigger animation end on any that have a component ref
      const directives = this.fixture.debugElement.queryAll(By.directive(SmTooltipDirective));
      for (const debugEl of directives) {
        const directive = debugEl.injector.get(SmTooltipDirective);
        if (directive?.componentRef) {
          directive.componentRef.instance.onAnimationEnd();
          this.fixture.detectChanges();
        }
      }
    }
  }

  getPositionStrategy(directive: SmTooltipDirective): any[] {
    const config = directive.overlayRef?.getConfig();
    if (!config) return [];

    const positionStrategy = config.positionStrategy as any;
    return positionStrategy._preferredPositions || positionStrategy._positions || [];
  }

  getPositionOffset(directive: SmTooltipDirective): number {
    const positions = this.getPositionStrategy(directive);
    if (positions.length === 0) return 0;

    const firstPosition = positions[0];
    return Math.abs(firstPosition.offsetY || firstPosition.offsetX || 0);
  }
}
