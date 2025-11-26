import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { SimplyMatIconButton, SmTooltipDirective, TooltipPosition, TooltipConfig, RichTooltipConfig, SimplyMatButton } from '@simply-material/components';

@Component({
  selector: 'app-tooltip-demo',
  imports: [SimplyMatIconButton, SmTooltipDirective, SimplyMatButton],
  templateUrl: './tooltip-demo.component.html',
  styleUrls: ['./tooltip-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDemoComponent {
  readonly tooltipPositions: TooltipPosition[] = ['above', 'below', 'left', 'right'];
  selectedPosition = signal<TooltipPosition>('above');

  // Base tooltip configuration
  readonly baseTooltipConfig: TooltipConfig = {
    position: null,
    showDelay: 0,
    hideDelay: 1500,
    persistStrategy: null,
    trigger: 'default',
    overlayConfig: null,
    positionOffset: null,
  };

  // Get tooltip config with selected position
  getTooltipConfig(): TooltipConfig {
    return {
      ...this.baseTooltipConfig,
      position: this.selectedPosition(),
    };
  }

  // Get tooltip config with manual trigger
  getManualTriggerConfig(): TooltipConfig {
    return {
      ...this.baseTooltipConfig,
      trigger: 'manual',
      position: this.selectedPosition(),
    };
  }

  // Get tooltip config with default trigger
  getDefaultTriggerConfig(): TooltipConfig {
    return {
      ...this.baseTooltipConfig,
      trigger: 'default',
      position: this.selectedPosition(),
    };
  }

  // Template references for programmatic tooltips
  programmaticTooltipManual = viewChild<SmTooltipDirective>('programmaticTooltipManual');
  programmaticTooltipDefault = viewChild<SmTooltipDirective>('programmaticTooltipDefault');
  disabledProgrammaticTooltip = viewChild<SmTooltipDirective>('disabledProgrammaticTooltip');

  readonly plainTooltips = [
    'Add to favorites',
    'Settings',
    'Search',
    'Share',
    'More options',
  ];

  readonly richTooltipExample: RichTooltipConfig = {
    subhead: 'Rich Tooltip',
    supportingText: 'This is a rich tooltip demonstrating the position.',
    buttons: [
      { label: 'Action', action: () => console.log('Action clicked') },
    ],
  };

  readonly richTooltips: RichTooltipConfig[] = [
    {
      subhead: 'Rich Tooltip Example',
      supportingText: 'This is a rich tooltip with a subhead and supporting text. It can also include action buttons.',
      buttons: [
        { label: 'Action 1', action: () => console.log('Action 1 clicked') },
        { label: 'Action 2', action: () => console.log('Action 2 clicked') },
      ],
    },
    {
      subhead: 'Feature Description',
      supportingText: 'This tooltip provides additional context about a feature. You can include up to two action buttons.',
      buttons: [
        { label: 'Learn More', action: () => console.log('Learn more clicked') },
      ],
    },
    {
      supportingText: 'This rich tooltip only has supporting text without a subhead.',
      buttons: [
        { label: 'Primary Action', action: () => console.log('Primary action clicked') },
        { label: 'Secondary', action: () => console.log('Secondary action clicked') },
      ],
    },
    {
      subhead: 'Simple Rich Tooltip',
      supportingText: 'This rich tooltip has a subhead and supporting text but no buttons.',
    },
  ];

  onOpenTooltipManual() {
    this.programmaticTooltipManual()?.open();
  }

  onCloseTooltipManual() {
    this.programmaticTooltipManual()?.close();
  }

  onOpenTooltipDefault() {
    this.programmaticTooltipDefault()?.open();
  }

  onCloseTooltipDefault() {
    this.programmaticTooltipDefault()?.close();
  }

  onOpenDisabledTooltip() {
    this.disabledProgrammaticTooltip()?.open();
  }

  onCloseDisabledTooltip() {
    this.disabledProgrammaticTooltip()?.close();
  }
}

