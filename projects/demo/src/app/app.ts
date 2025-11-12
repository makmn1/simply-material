import { Component, signal } from '@angular/core';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { IconButtonDemoComponent } from './icon-button-demo/icon-button-demo.component';

@Component({
  selector: 'app-root',
  imports: [ButtonDemoComponent, IconButtonDemoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('demo');
  protected readonly selectedDemo = signal<'button' | 'icon-button'>('button');

  protected readonly demos = [
    { value: 'button', label: 'Button Demo' },
    { value: 'icon-button', label: 'Icon Button Demo' },
  ] as const;
}
