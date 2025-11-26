type Sizes = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
type Shapes = 'round' | 'square';

const SIZES: Sizes[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
const SHAPES: Shapes[] = ['round', 'square'];

/**
 * Provide deterministic test values for all shape-related CSS variables that
 * the ButtonShapeMorph logic might read via the token helpers in
 * button-shape-morph-css-vars.ts.
 *
 * We set them on :root so they're visible via getComputedStyle(...) and
 * inherited by any element in the test DOM.
 */
export function loadButtonShapeMorphTestCssVars(doc: Document = document): void {
  const rootStyle = doc.documentElement.style;

  // Simple mapping of size+shape -> border radius in rem, so we can assert
  // against it later. Values are arbitrary but deterministic.
  const radiusValues: Record<Sizes, Record<Shapes, string>> = {
    xsmall: { round: '0.25rem', square: '0rem' },
    small:  { round: '0.5rem',  square: '0rem' },
    medium: { round: '0.75rem', square: '0rem' },
    large:  { round: '1rem',    square: '0rem' },
    xlarge: { round: '1.25rem', square: '0rem' },
  };

  for (const size of SIZES) {
    for (const shape of SHAPES) {
      const value = radiusValues[size][shape];

      // Button resting shape tokens
      rootStyle.setProperty(`--md-comp-button-${size}-shape-${shape}`, value);
      rootStyle.setProperty(`--sm-comp-button-connected-${size}-shape-${shape}`, value);

      // Selected shape tokens
      rootStyle.setProperty(
        `--md-comp-button-${size}-selected-container-shape-${shape}`,
        value,
      );
      rootStyle.setProperty(
        `--sm-comp-button-connected-${size}-selected-container-shape-${shape}`,
        value,
      );

      // Icon button resting shape tokens
      rootStyle.setProperty(
        `--md-comp-icon-button-${size}-container-shape-${shape}`,
        value,
      );
      rootStyle.setProperty(
        `--sm-comp-icon-button-connected-${size}-shape-${shape}`,
        value,
      );
      rootStyle.setProperty(
        `--md-comp-icon-button-${size}-selected-container-shape-${shape}`,
        value,
      );
      rootStyle.setProperty(
        `--sm-comp-icon-button-connected-${size}-selected-container-shape-${shape}`,
        value,
      );
    }

    // Pressed morph tokens – also set to something deterministic in rem.
    const pressedValue = radiusValues[size].round;
    rootStyle.setProperty(
      `--md-comp-button-${size}-shape-pressed-morph`,
      pressedValue,
    );
    rootStyle.setProperty(
      `--sm-comp-button-connected-${size}-shape-pressed-morph`,
      pressedValue,
    );
    rootStyle.setProperty(
      `--md-comp-icon-button-${size}-shape-pressed-morph`,
      pressedValue,
    );
    rootStyle.setProperty(
      `--sm-comp-icon-button-connected-${size}-shape-pressed-morph`,
      pressedValue,
    );
  }
}
