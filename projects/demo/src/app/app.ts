import { Component, signal } from '@angular/core';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { IconButtonDemoComponent } from './icon-button-demo/icon-button-demo.component';
import { TooltipDemoComponent } from './tooltip-demo/tooltip-demo.component';

@Component({
  selector: 'app-root',
  imports: [ButtonDemoComponent, IconButtonDemoComponent, TooltipDemoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('demo');
  protected readonly selectedDemo = signal<'button' | 'icon-button' | 'tooltip'>('button');

  protected readonly demos = [
    { value: 'button', label: 'Button Demo' },
    { value: 'icon-button', label: 'Icon Button Demo' },
    { value: 'tooltip', label: 'Tooltip Demo' },
  ] as const;
}
