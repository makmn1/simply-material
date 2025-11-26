import { TestBed } from '@angular/core/testing';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { page } from 'vitest/browser';
import { ShapeMorph } from './shape-morph';

describe('ShapeMorph', () => {
  let service: ShapeMorph;
  let testElement: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(ShapeMorph);
    testElement = document.createElement('div');
    testElement.setAttribute('data-testid', 'shape-morph-test-element');
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    if (testElement && testElement.parentNode) {
      testElement.parentNode.removeChild(testElement);
    }
  });

  describe('Service Injection & Setup', () => {
    test('should be created', () => {
      expect(service).toBeTruthy();
      expect(service).toBeInstanceOf(ShapeMorph);
    });
  });

  describe('readVar() Method', () => {
    test('should read CSS custom properties correctly', () => {
      testElement.style.setProperty('--test-var', '100');
      const value = service.readVar(testElement, '--test-var');
      expect(value).toBe('100');
    });

    test('should return empty string for non-existent properties', () => {
      const value = service.readVar(testElement, '--non-existent-var');
      expect(value).toBe('');
    });

    test('should trim whitespace from property values', () => {
      testElement.style.setProperty('--test-var', '  100  ');
      const value = service.readVar(testElement, '--test-var');
      expect(value).toBe('100');
    });

    test('should handle numeric values', () => {
      testElement.style.setProperty('--test-var', '0.5');
      const value = service.readVar(testElement, '--test-var');
      expect(value).toBe('0.5');
    });

    test('should handle string values', () => {
      testElement.style.setProperty('--test-var', 'hello world');
      const value = service.readVar(testElement, '--test-var');
      expect(value).toBe('hello world');
    });
  });

  describe('animateBorderRadius() Method', () => {
    test('should return AnimationPlaybackControlsWithThen object', () => {
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      const controls = service.animateBorderRadius(
        testElement,
        '1rem',
        '2rem',
        '--test-damping',
        '--test-stiffness'
      );

      expect(controls).toBeDefined();
    });

    test('should read spring options from CSS custom properties', async () => {
      testElement.style.setProperty('--test-damping', '0.8');
      testElement.style.setProperty('--test-stiffness', '150');

      service.animateBorderRadius(
        testElement,
        '1rem',
        '2rem',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|2rem/),
      });
    });

    test('should use override properties when present', async () => {
      testElement.style.setProperty('--sm-button-group-pressed-spring-damping', '0.9');
      testElement.style.setProperty('--sm-button-group-pressed-spring-stiffness', '200');
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      service.animateBorderRadius(
        testElement,
        '1rem',
        '2rem',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|2rem/),
      });
    });

    test('should fall back to provided style vars when overrides not present', async () => {
      testElement.style.setProperty('--test-damping', '0.6');
      testElement.style.setProperty('--test-stiffness', '120');

      service.animateBorderRadius(
        testElement,
        '1rem',
        '2rem',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|2rem/),
      });
    });

    test('should handle single-value border-radius', async () => {
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      service.animateBorderRadius(
        testElement,
        '1rem',
        '2rem',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|2rem/),
      });
    });

    test('should handle multi-value border-radius', async () => {
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      service.animateBorderRadius(
        testElement,
        '1rem 2rem 3rem 4rem',
        '5rem 6rem 7rem 8rem',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|5rem/),
        borderTopRightRadius: expect.stringMatching(/0\.\d+rem|6rem/),
        borderBottomRightRadius: expect.stringMatching(/0\.\d+rem|7rem/),
        borderBottomLeftRadius: expect.stringMatching(/0\.\d+rem|8rem/),
      });
    });

    test('should handle circular tokens in from/to values', async () => {
      testElement.style.width = '100px';
      testElement.style.height = '100px';
      testElement.style.position = 'absolute';
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      service.animateBorderRadius(
        testElement,
        '9999rem',
        '1rem',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|1rem/),
      });
    });

    test('should handle px values (converts to rem)', async () => {
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      service.animateBorderRadius(
        testElement,
        '16px',
        '32px',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem/),
      });
    });

    test('should handle mixed units', async () => {
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      service.animateBorderRadius(
        testElement,
        '1rem 16px 2rem 32px',
        '3rem 48px 4rem 64px',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|3rem/),
        borderTopRightRadius: expect.stringMatching(/0\.\d+rem/),
        borderBottomRightRadius: expect.stringMatching(/0\.\d+rem|4rem/),
        borderBottomLeftRadius: expect.stringMatching(/0\.\d+rem/),
      });
    });

    test('should handle 2-value border-radius syntax', async () => {
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      service.animateBorderRadius(
        testElement,
        '1rem 2rem',
        '3rem 4rem',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|3rem/),
        borderBottomRightRadius: expect.stringMatching(/0\.\d+rem|4rem/),
      });
    });

    test('should handle 3-value border-radius syntax', async () => {
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      service.animateBorderRadius(
        testElement,
        '1rem 2rem 3rem',
        '4rem 5rem 6rem',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|4rem/),
        borderTopRightRadius: expect.stringMatching(/0\.\d+rem|5rem/),
        borderBottomRightRadius: expect.stringMatching(/0\.\d+rem|6rem/),
      });
    });

    test('should handle empty override properties', async () => {
      testElement.style.setProperty('--sm-button-group-pressed-spring-damping', '');
      testElement.style.setProperty('--sm-button-group-pressed-spring-stiffness', '');
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      service.animateBorderRadius(
        testElement,
        '1rem',
        '2rem',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        borderTopLeftRadius: expect.stringMatching(/0\.\d+rem|2rem/),
      });
    });
  });

  describe('animateWidth() Method', () => {
    test('should return AnimationPlaybackControlsWithThen object', () => {
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      const controls = service.animateWidth(
        testElement,
        '100px',
        '200px',
        '--test-damping',
        '--test-stiffness'
      );

      expect(controls).toBeDefined();
    });

    test('should read spring options from CSS custom properties', async () => {
      testElement.style.setProperty('--test-damping', '0.7');
      testElement.style.setProperty('--test-stiffness', '120');

      service.animateWidth(
        testElement,
        '100px',
        '200px',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        width: "200px",
      });
    });

    test('should use override properties when present', async () => {
      testElement.style.setProperty('--sm-button-group-pressed-spring-damping', '0.9');
      testElement.style.setProperty('--sm-button-group-pressed-spring-stiffness', '200');
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      service.animateWidth(
        testElement,
        '100px',
        '200px',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        width: "200px",
      });
    });

    test('should fall back to provided style vars when overrides not present', async () => {
      testElement.style.setProperty('--test-damping', '0.6');
      testElement.style.setProperty('--test-stiffness', '110');

      service.animateWidth(
        testElement,
        '100px',
        '200px',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        width: "200px",
      });
    });

    test('should animate width property correctly', async () => {
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      service.animateWidth(
        testElement,
        '50px',
        '150px',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        width: "150px",
      });
    });

    test('should handle different width units', async () => {
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      service.animateWidth(
        testElement,
        '10rem',
        '20rem',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        width: "20rem",
      });
    });

    test('should handle empty override properties', async () => {
      testElement.style.setProperty('--sm-button-group-pressed-spring-damping', '');
      testElement.style.setProperty('--sm-button-group-pressed-spring-stiffness', '');
      testElement.style.setProperty('--test-damping', '0.5');
      testElement.style.setProperty('--test-stiffness', '100');

      service.animateWidth(
        testElement,
        '100px',
        '200px',
        '--test-damping',
        '--test-stiffness'
      );

      await expect.element(page.getByTestId('shape-morph-test-element')).toHaveStyle({
        width: "200px",
      });
    });
  });
});

