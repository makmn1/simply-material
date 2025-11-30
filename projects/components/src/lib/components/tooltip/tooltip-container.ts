import {
  ChangeDetectionStrategy,
  Component, inject, Injector,
  input, model, output, TemplateRef,
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'sm-tooltip-container',
  templateUrl: './tooltip-container.html',
  styleUrls: ['./tooltip-container.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: {
    'class': 'sm-tooltip-container',
    'role': 'tooltip',
  },
})
export class TooltipContainerComponent {
  public type = input<'plain' | 'rich'>('plain');
  public open = model<boolean>(true);
  public closingAnimationComplete = output<void>();

  public contentTemplate = input<TemplateRef<unknown> | null>(null);

  private readonly injector = inject(Injector);

  readonly contentInjector: Injector = Injector.create({
    providers: [
      { provide: TooltipContainerComponent, useValue: this },
    ],
    parent: this.injector,
  });

  onAnimationEnd() {
    if (!this.open()) {
      this.closingAnimationComplete.emit();
    }
  }
}
