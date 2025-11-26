import { TestBed } from '@angular/core/testing';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { SpringAnimate, SpringAnimateOptions, SpringAnimateProperty } from './spring-animate';

describe('SpringAnimate', () => {
  let service: SpringAnimate;
  let testElement: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(SpringAnimate);
    testElement = document.createElement('div');
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    if (testElement && testElement.parentNode) {
      testElement.parentNode.removeChild(testElement);
    }
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Service Injection & Setup', () => {
    test('should be created', () => {
      expect(service).toBeTruthy();
      expect(service).toBeInstanceOf(SpringAnimate);
    });
  });

  describe('Input Validation', () => {
    const validProperties: SpringAnimateProperty[] = [
      { property: 'width', from: '0px', to: '100px' },
    ];
    const validOptions: SpringAnimateOptions = {
      stiffness: 100,
      damping: 0.5,
    };

    test('should throw error when stiffness is NaN', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          ...validOptions,
          stiffness: NaN,
        });
      }).toThrow('springAnimate: stiffness must be a finite number');
    });

    test('should throw error when stiffness is Infinity', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          ...validOptions,
          stiffness: Infinity,
        });
      }).toThrow('springAnimate: stiffness must be a finite number');
    });

    test('should throw error when stiffness is -Infinity', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          ...validOptions,
          stiffness: -Infinity,
        });
      }).toThrow('springAnimate: stiffness must be a finite number');
    });

    test('should throw error when stiffness is null', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          ...validOptions,
          stiffness: null as any,
        });
      }).toThrow('springAnimate: stiffness must be a finite number');
    });

    test('should throw error when stiffness is undefined', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          ...validOptions,
          stiffness: undefined as any,
        });
      }).toThrow('springAnimate: stiffness must be a finite number');
    });

    test('should throw error when stiffness is a string', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          ...validOptions,
          stiffness: '100' as any,
        });
      }).toThrow('springAnimate: stiffness must be a finite number');
    });

    test('should throw error when damping is NaN', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          ...validOptions,
          damping: NaN,
        });
      }).toThrow('springAnimate: damping must be a finite number');
    });

    test('should throw error when damping is Infinity', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          ...validOptions,
          damping: Infinity,
        });
      }).toThrow('springAnimate: damping must be a finite number');
    });

    test('should throw error when damping is -Infinity', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          ...validOptions,
          damping: -Infinity,
        });
      }).toThrow('springAnimate: damping must be a finite number');
    });

    test('should throw error when damping is null', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          ...validOptions,
          damping: null as any,
        });
      }).toThrow('springAnimate: damping must be a finite number');
    });

    test('should throw error when damping is undefined', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          ...validOptions,
          damping: undefined as any,
        });
      }).toThrow('springAnimate: damping must be a finite number');
    });

    test('should throw error when damping is a string', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          ...validOptions,
          damping: '0.5' as any,
        });
      }).toThrow('springAnimate: damping must be a finite number');
    });

    test('should accept valid finite numbers', () => {
      expect(() => {
        service.animate(testElement, validProperties, validOptions);
      }).not.toThrow();
    });

    test('should accept zero values', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          stiffness: 0,
          damping: 0,
        });
      }).not.toThrow();
    });

    test('should accept negative values', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          stiffness: -100,
          damping: -0.5,
        });
      }).not.toThrow();
    });

    test('should accept very large values', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          stiffness: 1e10,
          damping: 1e5,
        });
      }).not.toThrow();
    });

    test('should accept very small values', () => {
      expect(() => {
        service.animate(testElement, validProperties, {
          stiffness: 1e-10,
          damping: 1e-5,
        });
      }).not.toThrow();
    });
  });

  describe('Animation Execution', () => {
    test('should return AnimationPlaybackControlsWithThen', () => {
      const properties: SpringAnimateProperty[] = [
        { property: 'width', from: '0px', to: '100px' },
      ];
      const options: SpringAnimateOptions = {
        stiffness: 100,
        damping: 0.5,
      };

      const controls = service.animate(testElement, properties, options);
      expect(controls).toBeDefined();
      expect(controls).toHaveProperty('then');
      expect(controls).toHaveProperty('finished');
      expect(controls).toHaveProperty('cancel');
      expect(controls).toHaveProperty('pause');
      expect(controls).toHaveProperty('play');
    });

    test('should build keyframes correctly for single property', () => {
      const properties: SpringAnimateProperty[] = [
        { property: 'width', from: '0px', to: '100px' },
      ];
      const options: SpringAnimateOptions = {
        stiffness: 100,
        damping: 0.5,
      };

      const controls = service.animate(testElement, properties, options);
      expect(controls).toBeDefined();
    });

    test('should build keyframes correctly for multiple properties', () => {
      const properties: SpringAnimateProperty[] = [
        { property: 'width', from: '0px', to: '100px' },
        { property: 'height', from: '0px', to: '200px' }
      ];
      const options: SpringAnimateOptions = {
        stiffness: 100,
        damping: 0.5,
      };

      const controls = service.animate(testElement, properties, options);
      expect(controls).toBeDefined();
    });

    test('should handle transform properties', () => {
      const properties: SpringAnimateProperty[] = [
        { property: 'transform', from: 'translateX(0px)', to: 'translateX(100px)' },
      ];
      const options: SpringAnimateOptions = {
        stiffness: 100,
        damping: 0.5,
      };

      const controls = service.animate(testElement, properties, options);
      expect(controls).toBeDefined();
    });

    test('should handle various CSS units', () => {
      const properties: SpringAnimateProperty[] = [
        { property: 'width', from: '0px', to: '100px' },
        { property: 'margin', from: '0rem', to: '1rem' },
        { property: 'padding', from: '0%', to: '10%' },
      ];
      const options: SpringAnimateOptions = {
        stiffness: 100,
        damping: 0.5,
      };

      const controls = service.animate(testElement, properties, options);
      expect(controls).toBeDefined();
    });
  });

  describe('Spring Physics Calculations', () => {
    test('should default mass to 1 when not provided', () => {
      const properties: SpringAnimateProperty[] = [
        { property: 'width', from: '0px', to: '100px' },
      ];
      const options: SpringAnimateOptions = {
        stiffness: 100,
        damping: 0.5,
      };

      const controls = service.animate(testElement, properties, options);
      expect(controls).toBeDefined();
    });

    test('should use custom mass value when provided', () => {
      const properties: SpringAnimateProperty[] = [
        { property: 'width', from: '0px', to: '100px' },
      ];
      const options: SpringAnimateOptions = {
        stiffness: 100,
        damping: 0.5,
        mass: 2,
      };

      const controls = service.animate(testElement, properties, options);
      expect(controls).toBeDefined();
    });

    test('should calculate damping correctly with different damping values', () => {
      const properties: SpringAnimateProperty[] = [
        { property: 'width', from: '0px', to: '100px' },
      ];

      const controls1 = service.animate(testElement, properties, {
        stiffness: 100,
        damping: 0.5,
        mass: 1,
      });
      expect(controls1).toBeDefined();

      const controls2 = service.animate(testElement, properties, {
        stiffness: 100,
        damping: 1.0,
        mass: 1,
      });
      expect(controls2).toBeDefined();

      const controls3 = service.animate(testElement, properties, {
        stiffness: 100,
        damping: 0.1,
        mass: 1,
      });
      expect(controls3).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty properties array', () => {
      const properties: SpringAnimateProperty[] = [];
      const options: SpringAnimateOptions = {
        stiffness: 100,
        damping: 0.5,
      };

      const controls = service.animate(testElement, properties, options);
      expect(controls).toBeDefined();
    });

    test('should handle single property', () => {
      const properties: SpringAnimateProperty[] = [
        { property: 'width', from: '0px', to: '100px' },
      ];
      const options: SpringAnimateOptions = {
        stiffness: 100,
        damping: 0.5,
      };

      const controls = service.animate(testElement, properties, options);
      expect(controls).toBeDefined();
    });

    test('should handle multiple properties', () => {
      const properties: SpringAnimateProperty[] = [
        { property: 'width', from: '0px', to: '100px' },
        { property: 'height', from: '0px', to: '200px' },
        { property: 'transform', from: 'scale(1)', to: 'scale(2)' },
      ];
      const options: SpringAnimateOptions = {
        stiffness: 100,
        damping: 0.5,
      };

      const controls = service.animate(testElement, properties, options);
      expect(controls).toBeDefined();
    });
  });
});

