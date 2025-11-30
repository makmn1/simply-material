import {ChangeDetectionStrategy, Component, signal, viewChild} from '@angular/core';
import {
  SimplyMatIconButton,
  SimplyMatTooltip,
  TooltipPosition,
  TooltipConfig,
  SimplyMatButton, SimplyMatTooltipContentComponent,
} from '@simply-material/components';

type RichTooltipDemoConfig = {
  subhead?: string;
  supportingText: string;
  buttons?: {label: string; action: () => void}[];
};

@Component({
  selector: 'app-tooltip-demo',
  imports: [SimplyMatIconButton, SimplyMatTooltip, SimplyMatButton, SimplyMatTooltipContentComponent],
  templateUrl: './tooltip-demo.component.html',
  styleUrls: ['./tooltip-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDemoComponent {
  readonly tooltipPositions: TooltipPosition[] = ['above', 'below', 'start', 'end'];
  selectedPosition = signal<TooltipPosition>('above');

  readonly baseTooltipConfig: TooltipConfig = {
    position: null,
    showDelay: 0,
    hideDelay: 1500,
    persistStrategy: null,
    trigger: 'default',
    overlayConfig: null,
    positionOffset: null,
  };

  getTooltipConfig(): TooltipConfig {
    return {
      ...this.baseTooltipConfig,
      position: this.selectedPosition(),
    };
  }

  getManualTriggerConfig(): TooltipConfig {
    return {
      ...this.baseTooltipConfig,
      trigger: 'manual',
      position: this.selectedPosition(),
    };
  }

  getDefaultTriggerConfig(): TooltipConfig {
    return {
      ...this.baseTooltipConfig,
      trigger: 'default',
      position: this.selectedPosition(),
    };
  }

  // Template references for programmatic tooltips
  programmaticTooltipManual = viewChild<SimplyMatTooltip>('programmaticTooltipManual');
  programmaticTooltipDefault = viewChild<SimplyMatTooltip>('programmaticTooltipDefault');
  disabledProgrammaticTooltip = viewChild<SimplyMatTooltip>('disabledProgrammaticTooltip');

  readonly plainTooltips = [
    'Add to favorites',
    'Settings',
    'Search',
    'Share',
    'More options',
  ];

  readonly richTooltips: RichTooltipDemoConfig[] = [
    {
      subhead: 'Rich Tooltip Example',
      supportingText:
        'This is a rich tooltip with a subhead and supporting text. It can also include action buttons.',
      buttons: [
        {label: 'Action 1', action: () => console.log('Action 1 clicked')},
        {label: 'Action 2', action: () => console.log('Action 2 clicked')},
      ],
    },
    {
      subhead: 'Feature Description',
      supportingText:
        'This tooltip provides additional context about a feature. You can include up to two action buttons.',
      buttons: [{label: 'Learn More', action: () => console.log('Learn more clicked')}],
    },
    {
      supportingText: 'This rich tooltip only has supporting text without a subhead.',
      buttons: [
        {label: 'Primary Action', action: () => console.log('Primary action clicked')},
        {label: 'Secondary', action: () => console.log('Secondary action clicked')},
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
