import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconButton, IconButtonShape, IconButtonSize, IconButtonVariant } from './icon-button';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { ShapeMorph } from '../../../services/shape-morph';
import { MinimalCircularBorderRadius } from '../../../services/minimal-circular-border-radius';
import {
  mockVarsFor,
  stubComputedStyleForElement,
  stubRect,
  createMockShapeMorph,
  createMockMinimalCircularBorderRadius,
} from '../../../testing/test-helpers';

type ShapeMorphFn = (
  el: HTMLElement,
  from: string,
  to: string,
  dampingStyleVar: string,
  stiffnessStyleVar: string,
) => Promise<void>;

describe('IconButton', () => {
  let component: IconButton;
  let fixture: ComponentFixture<IconButton>;
  let shapeMorphSpy: ReturnType<typeof vi.fn<ShapeMorphFn>>;
  let minimalServiceMocks: ReturnType<typeof createMockMinimalCircularBorderRadius>;

  beforeEach(async () => {
    shapeMorphSpy = vi.fn<ShapeMorphFn>().mockResolvedValue();
    minimalServiceMocks = createMockMinimalCircularBorderRadius();

    await TestBed.configureTestingModule({
      imports: [IconButton],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: ShapeMorph,
          useValue: createMockShapeMorph(shapeMorphSpy),
        },
        {
          provide: MinimalCircularBorderRadius,
          useValue: minimalServiceMocks.service,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IconButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    shapeMorphSpy.mockReset();
  });

  describe('Basic Component Tests', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.variant()).toBe('filled');
      expect(component.size()).toBe('small');
      expect(component.shape()).toBe('round');
      expect(component.width()).toBe('default');
      expect(component.toggle()).toBe(false);
      expect(component.disabled()).toBe(false);
      expect(component.selected()).toBe(false);
    });

    it('should call setIfCircularBorderRadius in ngAfterViewInit', () => {
      // ngAfterViewInit is called during fixture.detectChanges() in beforeEach
      // Reset the spy to count only new calls
      minimalServiceMocks.spies.setIfCircularBorderRadius.mockClear();

      // Create a new component instance to test ngAfterViewInit
      const newFixture = TestBed.createComponent(IconButton);
      newFixture.detectChanges(); // This triggers ngAfterViewInit

      expect(minimalServiceMocks.spies.setIfCircularBorderRadius).toHaveBeenCalledTimes(1);
    });

    it('should set border radius for selected buttons in ngAfterViewInit', () => {
      const element = fixture.nativeElement as HTMLElement;
      stubRect(element, 100, 60);

      // Reset spy since it was called in beforeEach
      shapeMorphSpy.mockClear();

      // Create a new component instance with selected=true
      const newFixture = TestBed.createComponent(IconButton);
      newFixture.componentRef.setInput('toggle', true);
      newFixture.componentRef.setInput('selected', true);
      newFixture.componentRef.setInput('size', 'small');
      newFixture.componentRef.setInput('shape', 'round');

      mockVarsFor(newFixture.nativeElement as HTMLElement, {
        '--md-comp-icon-button-small-selected-container-shape-round': '4px',
      });

      newFixture.detectChanges(); // This triggers ngAfterViewInit

      const newElement = newFixture.nativeElement as HTMLElement;
      expect(newElement.style.borderRadius).toBe('4px');
    });

    it('should handle both selected and circular button in ngAfterViewInit', () => {
      const element = fixture.nativeElement as HTMLElement;
      stubRect(element, 100, 60);
      stubComputedStyleForElement(element, {
        borderRadius: '159984px', // 9999 * 16
      });

      // Reset spies
      minimalServiceMocks.spies.setIfCircularBorderRadius.mockClear();
      shapeMorphSpy.mockClear();

      // Create a new component instance with selected=true and round shape
      const newFixture = TestBed.createComponent(IconButton);
      newFixture.componentRef.setInput('toggle', true);
      newFixture.componentRef.setInput('selected', true);
      newFixture.componentRef.setInput('size', 'small');
      newFixture.componentRef.setInput('shape', 'round');

      const newElement = newFixture.nativeElement as HTMLElement;
      stubRect(newElement, 100, 60);
      stubComputedStyleForElement(newElement, {
        borderRadius: '159984px', // 9999 * 16
      });

      mockVarsFor(newElement, {
        '--md-comp-icon-button-small-selected-container-shape-round': '4px',
      });

      newFixture.detectChanges(); // This triggers ngAfterViewInit

      // Should set border radius for selected button
      expect(newElement.style.borderRadius).toBe('4px');
      // Should also call setIfCircularBorderRadius (though it may not change the value if already set)
      expect(minimalServiceMocks.spies.setIfCircularBorderRadius).toHaveBeenCalled();
    });
  });

  describe('Size Tests', () => {
    const sizes: IconButtonSize[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

    sizes.forEach((size) => {
      it(`should set data-size="${size}" for ${size} size`, () => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        const element = fixture.nativeElement as HTMLElement;
        expect(element.getAttribute('data-size')).toBe(size);
      });
    });
  });

  describe('Variant Tests', () => {
    const variants: IconButtonVariant[] = ['filled', 'tonal', 'outlined', 'standard'];

    variants.forEach((variant) => {
      it(`should set data-variant="${variant}" for ${variant} variant`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        const element = fixture.nativeElement as HTMLElement;
        expect(element.getAttribute('data-variant')).toBe(variant);
      });
    });
  });

  describe('Shape Tests', () => {
    const shapes: IconButtonShape[] = ['round', 'square'];

    shapes.forEach((shape) => {
      it(`should set data-shape="${shape}" for ${shape} shape`, () => {
        fixture.componentRef.setInput('shape', shape);
        fixture.detectChanges();
        const element = fixture.nativeElement as HTMLElement;
        expect(element.getAttribute('data-shape')).toBe(shape);
      });
    });
  });

  describe('Disabled State Tests', () => {
    const variants: IconButtonVariant[] = ['filled', 'tonal', 'outlined', 'standard'];

    variants.forEach((variant) => {
      it(`should prevent click events when disabled for ${variant} variant`, async () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
        const stopPropagationSpy = vi.spyOn(event, 'stopImmediatePropagation');

        await component.onClick(event);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(shapeMorphSpy).not.toHaveBeenCalled();
      });

      it(`should not trigger animations when disabled for ${variant} variant`, async () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const element = fixture.nativeElement as HTMLElement;
        element.click();

        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(shapeMorphSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('Pressed State Tests', () => {
    const variants: IconButtonVariant[] = ['filled', 'tonal', 'outlined', 'standard'];

    variants.forEach((variant) => {
      it(`should trigger shape morph animation on click for ${variant} variant (non-toggle)`, async () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.componentRef.setInput('toggle', false);
        fixture.detectChanges();

        const element = fixture.nativeElement as HTMLElement;

        mockVarsFor(element, {
          [`--md-comp-icon-button-small-container-shape-round`]: '8px',
          [`--md-comp-icon-button-small-shape-pressed-morph`]: '4px',
          [`--md-comp-icon-button-small-shape-spring-animation-damping`]: '20',
          [`--md-comp-icon-button-small-shape-spring-animation-stiffness`]: '150',
        });

        await component.onClick(new MouseEvent('click'));

        // Should be called twice: to pressed shape, then back
        expect(shapeMorphSpy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Toggle Button Tests', () => {
    const variants: IconButtonVariant[] = ['filled', 'tonal', 'outlined', 'standard'];

    variants.forEach((variant) => {
      describe(`Unselected state for ${variant}`, () => {
        it('should set correct attributes when unselected', () => {
          fixture.componentRef.setInput('variant', variant);
          fixture.componentRef.setInput('toggle', true);
          fixture.componentRef.setInput('selected', false);
          fixture.detectChanges();

          const element = fixture.nativeElement as HTMLElement;
          expect(element.getAttribute('data-toggle')).toBe('true');
          expect(element.getAttribute('data-selected')).toBe('false');
          expect(element.getAttribute('aria-pressed')).toBe('false');
        });
      });

      describe(`Selected state for ${variant}`, () => {
        it('should set correct attributes when selected', () => {
          fixture.componentRef.setInput('variant', variant);
          fixture.componentRef.setInput('toggle', true);
          fixture.componentRef.setInput('selected', true);
          fixture.detectChanges();

          const element = fixture.nativeElement as HTMLElement;
          expect(element.getAttribute('data-toggle')).toBe('true');
          expect(element.getAttribute('data-selected')).toBe('true');
          expect(element.getAttribute('aria-pressed')).toBe('true');
        });
      });

      describe(`Toggle interaction for ${variant}`, () => {
        it('should toggle from unselected to selected on click', async () => {
          fixture.componentRef.setInput('variant', variant);
          fixture.componentRef.setInput('toggle', true);
          fixture.componentRef.setInput('selected', false);
          fixture.detectChanges();

          const element = fixture.nativeElement as HTMLElement;

          mockVarsFor(element, {
            [`--md-comp-icon-button-small-container-shape-round`]: '8px',
            [`--md-comp-icon-button-small-selected-container-shape-round`]: '4px',
            [`--md-comp-icon-button-small-shape-spring-animation-damping`]: '20',
            [`--md-comp-icon-button-small-shape-spring-animation-stiffness`]: '150',
          });

          const selectedChangeSpy = vi.fn();
          component.selectedChange.subscribe(selectedChangeSpy);

          await component.onClick(new MouseEvent('click'));

          expect(selectedChangeSpy).toHaveBeenCalledWith(true);
          expect(shapeMorphSpy).toHaveBeenCalledTimes(1);
        });

        it('should toggle from selected to unselected on click', async () => {
          fixture.componentRef.setInput('variant', variant);
          fixture.componentRef.setInput('toggle', true);
          fixture.componentRef.setInput('selected', true);
          fixture.detectChanges();

          const element = fixture.nativeElement as HTMLElement;

          mockVarsFor(element, {
            [`--md-comp-icon-button-small-selected-container-shape-round`]: '4px',
            [`--md-comp-icon-button-small-container-shape-round`]: '8px',
            [`--md-comp-icon-button-small-shape-spring-animation-damping`]: '20',
            [`--md-comp-icon-button-small-shape-spring-animation-stiffness`]: '150',
          });

          const selectedChangeSpy = vi.fn();
          component.selectedChange.subscribe(selectedChangeSpy);

          await component.onClick(new MouseEvent('click'));

          expect(selectedChangeSpy).toHaveBeenCalledWith(false);
          expect(shapeMorphSpy).toHaveBeenCalledTimes(1);
        });

        it('should work in controlled mode', async () => {
          fixture.componentRef.setInput('variant', variant);
          fixture.componentRef.setInput('toggle', true);
          fixture.componentRef.setInput('selected', false);
          fixture.detectChanges();

          const selectedChangeSpy = vi.fn();
          component.selectedChange.subscribe(selectedChangeSpy);

          await component.onClick(new MouseEvent('click'));

          // In controlled mode, it should emit but not change internal state
          expect(selectedChangeSpy).toHaveBeenCalledWith(true);
        });
      });
    });
  });

  describe('Shape Morph Tests', () => {
    describe('Pressed Shape Morph (Non-Toggle Buttons)', () => {
      it('should animate to pressed shape and back for small round button', async () => {
        fixture.componentRef.setInput('size', 'small');
        fixture.componentRef.setInput('shape', 'round');
        fixture.componentRef.setInput('toggle', false);
        fixture.detectChanges();

        // Wait for any shape sync resource to complete
        await fixture.whenStable();
        shapeMorphSpy.mockClear();

        const element = fixture.nativeElement as HTMLElement;

        mockVarsFor(element, {
          '--md-comp-icon-button-small-container-shape-round': '8px',
          '--md-comp-icon-button-small-shape-pressed-morph': '4px',
          '--md-comp-icon-button-small-shape-spring-animation-damping': '20',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness': '150',
        });

        await component.onClick(new MouseEvent('click'));

        expect(shapeMorphSpy).toHaveBeenCalledTimes(2);
        // First call: to pressed shape
        expect(shapeMorphSpy).toHaveBeenNthCalledWith(
          1,
          element,
          '8px',
          '4px',
          '--md-comp-icon-button-small-shape-spring-animation-damping',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness',
        );
        // Second call: back to original
        expect(shapeMorphSpy).toHaveBeenNthCalledWith(
          2,
          element,
          '4px',
          '8px',
          '--md-comp-icon-button-small-shape-spring-animation-damping',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness',
        );
      });

      it('should animate to pressed shape and back for large square button', async () => {
        fixture.componentRef.setInput('size', 'large');
        fixture.componentRef.setInput('shape', 'square');
        fixture.componentRef.setInput('toggle', false);
        fixture.detectChanges();

        // Wait for any shape sync resource to complete
        await fixture.whenStable();
        shapeMorphSpy.mockClear();

        const element = fixture.nativeElement as HTMLElement;

        mockVarsFor(element, {
          '--md-comp-icon-button-large-container-shape-square': '8px',
          '--md-comp-icon-button-large-shape-pressed-morph': '4px',
          '--md-comp-icon-button-large-shape-spring-animation-damping': '20',
          '--md-comp-icon-button-large-shape-spring-animation-stiffness': '150',
        });

        await component.onClick(new MouseEvent('click'));

        expect(shapeMorphSpy).toHaveBeenCalledTimes(2);
        expect(shapeMorphSpy).toHaveBeenNthCalledWith(
          1,
          element,
          '8px',
          '4px',
          '--md-comp-icon-button-large-shape-spring-animation-damping',
          '--md-comp-icon-button-large-shape-spring-animation-stiffness',
        );
        expect(shapeMorphSpy).toHaveBeenNthCalledWith(
          2,
          element,
          '4px',
          '8px',
          '--md-comp-icon-button-large-shape-spring-animation-damping',
          '--md-comp-icon-button-large-shape-spring-animation-stiffness',
        );
      });
    });

    describe('Selected Shape Morph (Toggle Buttons)', () => {
      it('should animate to selected shape for small round toggle button', async () => {
        fixture.componentRef.setInput('size', 'small');
        fixture.componentRef.setInput('shape', 'round');
        fixture.componentRef.setInput('toggle', true);
        fixture.componentRef.setInput('selected', false);
        fixture.detectChanges();

        // Wait for any shape sync resource to complete
        await fixture.whenStable();
        shapeMorphSpy.mockClear();

        const element = fixture.nativeElement as HTMLElement;

        mockVarsFor(element, {
          '--md-comp-icon-button-small-container-shape-round': '8px',
          '--md-comp-icon-button-small-selected-container-shape-round': '4px',
          '--md-comp-icon-button-small-shape-spring-animation-damping': '20',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness': '150',
        });

        await component.onClick(new MouseEvent('click'));

        expect(shapeMorphSpy).toHaveBeenCalledTimes(1);
        expect(shapeMorphSpy).toHaveBeenCalledWith(
          element,
          '8px',
          '4px',
          '--md-comp-icon-button-small-shape-spring-animation-damping',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness',
        );
      });

      it('should animate back to resting shape when unselected for large square toggle button', async () => {
        fixture.componentRef.setInput('size', 'large');
        fixture.componentRef.setInput('shape', 'square');
        fixture.componentRef.setInput('toggle', true);
        fixture.componentRef.setInput('selected', true);
        fixture.detectChanges();

        // Wait for any shape sync resource to complete
        await fixture.whenStable();
        shapeMorphSpy.mockClear();

        const element = fixture.nativeElement as HTMLElement;

        mockVarsFor(element, {
          '--md-comp-icon-button-large-selected-container-shape-square': '4px',
          '--md-comp-icon-button-large-container-shape-square': '8px',
          '--md-comp-icon-button-large-shape-spring-animation-damping': '20',
          '--md-comp-icon-button-large-shape-spring-animation-stiffness': '150',
        });

        await component.onClick(new MouseEvent('click'));

        expect(shapeMorphSpy).toHaveBeenCalledTimes(1);
        expect(shapeMorphSpy).toHaveBeenCalledWith(
          element,
          '4px',
          '8px',
          '--md-comp-icon-button-large-shape-spring-animation-damping',
          '--md-comp-icon-button-large-shape-spring-animation-stiffness',
        );
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('should set aria-pressed for toggle buttons', () => {
      fixture.componentRef.setInput('toggle', true);
      fixture.componentRef.setInput('selected', true);
      fixture.detectChanges();

      const element = fixture.nativeElement as HTMLElement;
      expect(element.getAttribute('aria-pressed')).toBe('true');
    });

    it('should not set aria-pressed for non-toggle buttons', () => {
      fixture.componentRef.setInput('toggle', false);
      fixture.detectChanges();

      const element = fixture.nativeElement as HTMLElement;
      expect(element.getAttribute('aria-pressed')).toBeNull();
    });
  });

  describe('Edge Cases and Integration Tests', () => {
    it('should handle rapid clicks gracefully', async () => {
      fixture.componentRef.setInput('toggle', false);
      fixture.detectChanges();

      const element = fixture.nativeElement as HTMLElement;

      mockVarsFor(element, {
        '--md-comp-icon-button-small-container-shape-round': '8px',
        '--md-comp-icon-button-small-shape-pressed-morph': '4px',
        '--md-comp-icon-button-small-shape-spring-animation-damping': '20',
        '--md-comp-icon-button-small-shape-spring-animation-stiffness': '150',
      });

      // Rapid clicks
      await Promise.all([
        component.onClick(new MouseEvent('click')),
        component.onClick(new MouseEvent('click')),
        component.onClick(new MouseEvent('click')),
      ]);

      // Should handle all clicks (may have multiple animations)
      expect(shapeMorphSpy).toHaveBeenCalled();
    });

    it('should not trigger animations when disabled', async () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const element = fixture.nativeElement as HTMLElement;
      element.click();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(shapeMorphSpy).not.toHaveBeenCalled();
    });
  });

  describe('Shape Synchronization Resource Tests', () => {
    describe('Initial Load Behavior', () => {
      it('should not run resource on initial load for round buttons', () => {
        const element = fixture.nativeElement as HTMLElement;
        stubRect(element, 100, 60);
        stubComputedStyleForElement(element, {
          borderRadius: '159984px', // 9999 * 16
        });

        // Reset spy to ensure we only count calls after initial load
        shapeMorphSpy.mockClear();

        // Create a new component instance with round shape
        const newFixture = TestBed.createComponent(IconButton);
        const newElement = newFixture.nativeElement as HTMLElement;
        stubRect(newElement, 100, 60);
        stubComputedStyleForElement(newElement, {
          borderRadius: '159984px', // 9999 * 16
        });
        newFixture.componentRef.setInput('shape', 'round');
        newFixture.detectChanges(); // This triggers ngAfterViewInit

        // Resource should not run on initial load (only after _viewInitialized is true)
        // Verify that shapeMorph.animateBorderRadius was NOT called
        // This is the key test: the resource should not run during initial load
        expect(shapeMorphSpy).not.toHaveBeenCalled();
      });
    });

    describe('Shape Changes (Non-Selected Buttons)', () => {
      it('should animate when shape changes from round to square', async () => {
        const element = fixture.nativeElement as HTMLElement;
        stubRect(element, 100, 60);

        // Set initial shape to round
        fixture.componentRef.setInput('shape', 'round');
        fixture.detectChanges();

        // Wait for initial load to complete
        await fixture.whenStable();
        shapeMorphSpy.mockClear();

        // Mock CSS variables for the animation
        mockVarsFor(element, {
          '--md-comp-icon-button-small-container-shape-round': '8px',
          '--md-comp-icon-button-small-container-shape-square': '0.5rem',
          '--md-comp-icon-button-small-shape-spring-animation-damping': '20',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness': '150',
        });

        // Change shape to square
        fixture.componentRef.setInput('shape', 'square');
        fixture.detectChanges();

        // Wait for resource to complete
        await fixture.whenStable();

        // Verify animation was called with correct parameters
        expect(shapeMorphSpy).toHaveBeenCalledTimes(1);
        expect(shapeMorphSpy).toHaveBeenCalledWith(
          element,
          '8px', // from: getCurrentBorderRadius with oldShape (round)
          '0.5rem', // to: getCurrentBorderRadius with new shape (square)
          '--md-comp-icon-button-small-shape-spring-animation-damping',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness',
        );
      });

      it('should animate when shape changes from square to round', async () => {
        const element = fixture.nativeElement as HTMLElement;
        stubRect(element, 100, 60);

        // Set initial shape to square
        fixture.componentRef.setInput('shape', 'square');
        fixture.detectChanges();

        // Wait for initial load to complete
        await fixture.whenStable();
        shapeMorphSpy.mockClear();

        // Mock CSS variables and minimal circular border radius
        mockVarsFor(element, {
          '--md-comp-icon-button-small-container-shape-square': '0.5rem',
          '--md-comp-icon-button-small-shape-spring-animation-damping': '20',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness': '150',
        });

        // Change shape to round
        fixture.componentRef.setInput('shape', 'round');
        fixture.detectChanges();

        // Wait for resource to complete
        await fixture.whenStable();

        // Verify animation was called
        expect(shapeMorphSpy).toHaveBeenCalledTimes(1);
        // For round, it should use getMinimalCircularBorderRadius
        const expectedTo = minimalServiceMocks.spies.getMinimalCircularBorderRadius(element);
        expect(shapeMorphSpy).toHaveBeenCalledWith(
          element,
          '0.5rem', // from: getCurrentBorderRadius with oldShape (square)
          expectedTo, // to: getMinimalCircularBorderRadius
          '--md-comp-icon-button-small-shape-spring-animation-damping',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness',
        );
      });
    });

    describe('Shape Changes (Selected Toggle Buttons)', () => {
      it('should animate when shape changes from round to square for selected toggle button', async () => {
        const element = fixture.nativeElement as HTMLElement;
        stubRect(element, 100, 60);

        // Set up as selected toggle button with round shape
        fixture.componentRef.setInput('toggle', true);
        fixture.componentRef.setInput('selected', true);
        fixture.componentRef.setInput('shape', 'round');
        fixture.detectChanges();

        // Wait for initial load to complete
        await fixture.whenStable();
        shapeMorphSpy.mockClear();

        // Mock CSS variables for selected shapes
        mockVarsFor(element, {
          '--md-comp-icon-button-small-selected-container-shape-round': '4px',
          '--md-comp-icon-button-small-selected-container-shape-square': '0.5rem',
          '--md-comp-icon-button-small-shape-spring-animation-damping': '20',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness': '150',
        });

        // Change shape to square
        fixture.componentRef.setInput('shape', 'square');
        fixture.detectChanges();

        // Wait for resource to complete
        await fixture.whenStable();

        // Verify animation was called with correct parameters for selected button
        expect(shapeMorphSpy).toHaveBeenCalledTimes(1);
        expect(shapeMorphSpy).toHaveBeenCalledWith(
          element,
          '4px', // from: getCurrentBorderRadius(isSelected=true, oldShape=round)
          '0.5rem', // to: selectedShapeVar for square
          '--md-comp-icon-button-small-shape-spring-animation-damping',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness',
        );
      });

      it('should animate when shape changes from square to round for selected toggle button', async () => {
        const element = fixture.nativeElement as HTMLElement;
        stubRect(element, 100, 60);

        // Set up as selected toggle button with square shape
        fixture.componentRef.setInput('toggle', true);
        fixture.componentRef.setInput('selected', true);
        fixture.componentRef.setInput('shape', 'square');
        fixture.detectChanges();

        // Wait for initial load to complete
        await fixture.whenStable();
        shapeMorphSpy.mockClear();

        // Mock CSS variables
        mockVarsFor(element, {
          '--md-comp-icon-button-small-selected-container-shape-square': '0.5rem',
          '--md-comp-icon-button-small-selected-container-shape-round': '4px',
          '--md-comp-icon-button-small-shape-spring-animation-damping': '20',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness': '150',
        });

        // Change shape to round
        fixture.componentRef.setInput('shape', 'round');
        fixture.detectChanges();

        // Wait for resource to complete
        await fixture.whenStable();

        // Verify animation was called
        expect(shapeMorphSpy).toHaveBeenCalledTimes(1);
        expect(shapeMorphSpy).toHaveBeenCalledWith(
          element,
          '0.5rem', // from: getCurrentBorderRadius(isSelected=true, oldShape=square)
          '4px', // to: selectedShapeVar for round
          '--md-comp-icon-button-small-shape-spring-animation-damping',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness',
        );
      });
    });
  });

  describe('Shape Border Radius Regression Tests', () => {
    describe('Initial State Tests', () => {
      it('should have empty border radius when shape is square initially', () => {
        fixture.componentRef.setInput('shape', 'square');
        fixture.detectChanges();

        const element = fixture.nativeElement as HTMLElement;
        expect(element.style.borderRadius).toBe('');
      });

      it('should call setIfCircularBorderRadius when shape is round initially', () => {
        // Create a new fixture to test ngAfterViewInit
        const newFixture = TestBed.createComponent(IconButton);
        const element = newFixture.nativeElement as HTMLElement;
        stubRect(element, 100, 60);
        stubComputedStyleForElement(element, {
          borderRadius: '159984px', // 9999 * 16
        });

        // Reset spy to count only new calls
        minimalServiceMocks.spies.setIfCircularBorderRadius.mockClear();

        newFixture.componentRef.setInput('shape', 'round');
        newFixture.detectChanges(); // This triggers ngAfterViewInit

        // ngAfterViewInit should call setIfCircularBorderRadius
        // Note: The mock service may not actually set the border radius, but the spy should be called
        expect(minimalServiceMocks.spies.setIfCircularBorderRadius).toHaveBeenCalled();
      });
    });

    describe('Multiple Shape Changes Test', () => {
      it('should handle multiple shape changes correctly with animations', async () => {
        const element = fixture.nativeElement as HTMLElement;
        stubRect(element, 100, 60);
        stubComputedStyleForElement(element, {
          borderRadius: '159984px', // 9999 * 16
        });

        // Start with round
        fixture.componentRef.setInput('shape', 'round');
        fixture.detectChanges();
        await fixture.whenStable();
        shapeMorphSpy.mockClear();

        mockVarsFor(element, {
          '--md-comp-icon-button-small-container-shape-round': '8px',
          '--md-comp-icon-button-small-container-shape-square': '0.5rem',
          '--md-comp-icon-button-small-shape-spring-animation-damping': '20',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness': '150',
        });

        // Switch to square - should trigger animation
        fixture.componentRef.setInput('shape', 'square');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(shapeMorphSpy).toHaveBeenCalledTimes(1);

        shapeMorphSpy.mockClear();
        mockVarsFor(element, {
          '--md-comp-icon-button-small-container-shape-square': '0.5rem',
          '--md-comp-icon-button-small-shape-spring-animation-damping': '20',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness': '150',
        });

        // Switch back to round - should trigger animation
        fixture.componentRef.setInput('shape', 'round');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(shapeMorphSpy).toHaveBeenCalledTimes(1);

        shapeMorphSpy.mockClear();
        mockVarsFor(element, {
          '--md-comp-icon-button-small-container-shape-round': '8px',
          '--md-comp-icon-button-small-container-shape-square': '0.5rem',
          '--md-comp-icon-button-small-shape-spring-animation-damping': '20',
          '--md-comp-icon-button-small-shape-spring-animation-stiffness': '150',
        });

        // Switch to square again - should trigger animation
        fixture.componentRef.setInput('shape', 'square');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(shapeMorphSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
