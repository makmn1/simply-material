import { Component, signal, TemplateRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { describe, test, expect, beforeEach } from 'vitest';
import { SimplyMatTooltipContentComponent } from './tooltip-content.component';
import { TooltipContainerComponent } from './tooltip-container';

describe('SimplyMatTooltipContentComponent', () => {
  let fixture: ComponentFixture<TooltipContentTestComponent>;
  let testPage: TooltipContentPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipContentTestComponent, OverlayModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipContentTestComponent);
    testPage = new TooltipContentPage(fixture);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  test('should create', () => {
    const component = testPage.getComponent('plain-content');
    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(SimplyMatTooltipContentComponent);
  });

  test('should set data-sm-type="plain" when container type is plain', async () => {
    const element = testPage.getContentElement('plain-content');
    expect(element).toBeTruthy();
    expect(element?.getAttribute('data-sm-type')).toBe('plain');
  });

  test('should set data-sm-type="rich" when container type is rich', async () => {
    const element = testPage.getContentElement('rich-content');
    expect(element).toBeTruthy();
    expect(element?.getAttribute('data-sm-type')).toBe('rich');
  });

  test('should update data-sm-type when container type changes', async () => {
    const element = testPage.getContentElement('dynamic-content');
    expect(element).toBeTruthy();
    expect(element?.getAttribute('data-sm-type')).toBe('plain');

    const testComponent = fixture.componentInstance;
    testComponent.dynamicType.set('rich');
    await fixture.whenStable();

    expect(element?.getAttribute('data-sm-type')).toBe('rich');

    testComponent.dynamicType.set('plain');
    await fixture.whenStable();

    expect(element?.getAttribute('data-sm-type')).toBe('plain');
  });
});

// Test Component

@Component({
  selector: 'tooltip-content-test',
  template: `
    <ng-template #plainTemplate>
      <sm-tooltip-content id="plain-content">
        Plain content
      </sm-tooltip-content>
    </ng-template>

    <ng-template #richTemplate>
      <sm-tooltip-content id="rich-content">
        Rich content
      </sm-tooltip-content>
    </ng-template>

    <ng-template #dynamicTemplate>
      <sm-tooltip-content id="dynamic-content">
        Dynamic content
      </sm-tooltip-content>
    </ng-template>

    <sm-tooltip-container [type]="'plain'" [open]="true" [contentTemplate]="plainTemplate">
    </sm-tooltip-container>

    <sm-tooltip-container [type]="'rich'" [open]="true" [contentTemplate]="richTemplate">
    </sm-tooltip-container>

    <sm-tooltip-container [type]="dynamicType()" [open]="true" [contentTemplate]="dynamicTemplate">
    </sm-tooltip-container>
  `,
  imports: [
    SimplyMatTooltipContentComponent,
    TooltipContainerComponent,
  ],
})
class TooltipContentTestComponent {
  plainTemplate = viewChild.required<TemplateRef<unknown>>('plainTemplate');
  richTemplate = viewChild.required<TemplateRef<unknown>>('richTemplate');
  dynamicTemplate = viewChild.required<TemplateRef<unknown>>('dynamicTemplate');
  dynamicType = signal<'plain' | 'rich'>('plain');
}

// Page Object Model

class TooltipContentPage {
  constructor(private fixture: ComponentFixture<TooltipContentTestComponent>) {}

  getComponent(testId: string): SimplyMatTooltipContentComponent | null {
    const element = this.getContentElement(testId);
    if (!element) return null;

    const debugElement = this.fixture.debugElement.query(
      (el) => el.nativeElement === element
    );
    return debugElement?.injector.get(SimplyMatTooltipContentComponent) || null;
  }

  getContentElement(testId: string): HTMLElement | null {
    return this.fixture.nativeElement.querySelector(`#${testId}`);
  }
}

