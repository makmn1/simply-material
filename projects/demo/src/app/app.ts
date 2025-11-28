import { Component, signal } from '@angular/core';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { IconButtonDemoComponent } from './icon-button-demo/icon-button-demo.component';
import { TooltipDemoComponent } from './tooltip-demo/tooltip-demo.component';
import {ButtonGroupDemo} from './button-group-demo/button-group-demo';
import {ButtonGroupIconDemo} from './button-group-icon-demo/button-group-icon-demo';
import {ButtonGroupSelectionDemo} from './button-group-selection-demo/button-group-selection-demo';
import {FabDemoComponent} from './fab-demo/fab-demo.component';

@Component({
  selector: 'app-root',
  imports: [ButtonDemoComponent, IconButtonDemoComponent, TooltipDemoComponent, ButtonGroupDemo, ButtonGroupIconDemo, ButtonGroupSelectionDemo, FabDemoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('demo');
  protected readonly selectedDemo = signal<
    'button' | 'icon-button' | 'tooltip' | 'button-group' | 'button-group-icon' | 'button-group-selection' | 'fab'
  >('fab');

  protected readonly demos = [
    { value: 'fab', label: 'FAB Demo' },
    { value: 'button-group-selection', label: 'Button Group Selection Demo' },
    { value: 'button-group', label: 'Button Group Demo' },
    { value: 'button-group-icon', label: 'Button Group Icon Demo' },
    { value: 'button', label: 'Button Demo' },
    { value: 'icon-button', label: 'Icon Button Demo' },
    { value: 'tooltip', label: 'Tooltip Demo' },
  ] as const;
}
