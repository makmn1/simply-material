import { Component, signal } from '@angular/core';
import {ButtonDemoComponent} from './button-demo/button-demo.component';

@Component({
  selector: 'app-root',
  imports: [ButtonDemoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('demo');
}
