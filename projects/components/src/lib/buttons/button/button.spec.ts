import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmButtonComponent } from './button';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { ShapeMorph } from '../../../services/shape-morph';
import { MinimalCircularBorderRadius } from '../../../services/minimal-circular-border-radius';

import {
  createMockShapeMorph,
  createMockMinimalCircularBorderRadius,
} from '../../../testing/test-helpers';

describe('SmButton', () => {
  let component: SmButtonComponent;
  let fixture: ComponentFixture<SmButtonComponent>;
  let minimalServiceMocks: ReturnType<typeof createMockMinimalCircularBorderRadius>;

  beforeEach(async () => {
    minimalServiceMocks = createMockMinimalCircularBorderRadius();

    await TestBed.configureTestingModule({
      imports: [SmButtonComponent],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: ShapeMorph,
          useValue: createMockShapeMorph(),
        },
        {
          provide: MinimalCircularBorderRadius,
          useValue: minimalServiceMocks.service,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SmButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Component Tests', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.variant()).toBe('filled');
      expect(component.size()).toBe('small');
      expect(component.shape()).toBe('round');
    });
  });

  describe('Input Properties', () => {
    it('should set data-variant attribute for filled variant', () => {
      fixture.componentRef.setInput('variant', 'filled');
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.getAttribute('data-variant')).toBe('filled');
    });

    it('should set data-variant attribute for outlined variant', () => {
      fixture.componentRef.setInput('variant', 'outlined');
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.getAttribute('data-variant')).toBe('outlined');
    });

    it('should set data-size attribute', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.getAttribute('data-size')).toBe('small');
    });

    it('should set data-shape attribute for round shape', () => {
      fixture.componentRef.setInput('shape', 'round');
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.getAttribute('data-shape')).toBe('round');
    });

    it('should set data-shape attribute for square shape', () => {
      fixture.componentRef.setInput('shape', 'square');
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.getAttribute('data-shape')).toBe('square');
    });
  });

  describe('Directive Integration', () => {
    it('should configure ButtonShapeMorph CSS vars correctly', () => {
      const directive = component.buttonShapeMorph;

      expect(directive.buttonShapeMorphCssVars).toBeTruthy();
      expect(directive.buttonShapeMorphCssVars?.pressedMorph('small')).toBe(
        '--md-comp-button-small-shape-pressed-morph',
      );
      expect(directive.buttonShapeMorphCssVars?.restingShapeMorph('small', 'round')).toBe(
        '--md-comp-button-small-shape-round',
      );
      expect(directive.buttonShapeMorphCssVars?.selectedShape('small', 'round')).toBe(
        '--md-comp-button-small-selected-container-shape-round',
      );
    });
  });

  describe('Ripple Directive Integration', () => {
    it('should pass ripple inputs to SmRippleDirective', () => {
      fixture.componentRef.setInput('rippleOpacity', 0.5);
      fixture.componentRef.setInput('rippleDuration', 300);
      fixture.componentRef.setInput('rippleEasing', 'ease-in-out');
      fixture.componentRef.setInput('rippleColor', 'rgba(255,0,0,0.5)');
      fixture.detectChanges();

      // Verify inputs are accepted (component should not throw)
      expect(component).toBeTruthy();
    });
  });
});
