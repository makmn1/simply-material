import { ButtonGroupType } from "../../button-group/button-group-base";
import {MorphConfig} from "./button-shape-morph-type.token";

function resolveGroupType(morphConfig: MorphConfig): ButtonGroupType {
  const groupTypeSignal = morphConfig.buttonGroupType;
  return groupTypeSignal ? groupTypeSignal() : 'standard';
}

export function pressedMorph(
  morphConfig: MorphConfig,
): string {
  const size: string = morphConfig.buttonSize();
  const groupType = resolveGroupType(morphConfig);

  if (morphConfig.buttonShapeMorphRole === 'button') {
    return buttonPressedMorph(size, groupType);
  } else if (morphConfig.buttonShapeMorphRole === 'icon') {
    return iconButtonPressedMorph(size, groupType);
  } else {
    throw new Error(`Unknown button shape morph type: ${morphConfig}`);
  }
}

export function restingShapeMorph(
  morphConfig: MorphConfig,
): string {
  const size: string = morphConfig.buttonSize();
  const shape: string = morphConfig.buttonShape();
  const groupType = resolveGroupType(morphConfig);

  if (morphConfig.buttonShapeMorphRole === 'button') {
    return buttonRestingShapeMorph(size, shape, groupType);
  } else if (morphConfig.buttonShapeMorphRole === 'icon') {
    return iconButtonRestingShapeMorph(size, shape, groupType);
  } else {
    throw new Error(`Unknown button shape morph type: ${morphConfig}`);
  }
}

export function selectedShape(
  morphConfig: MorphConfig,
): string {
  const size: string = morphConfig.buttonSize();
  const shape: string = morphConfig.buttonShape();
  const groupType = resolveGroupType(morphConfig);

  if (morphConfig.buttonShapeMorphRole === 'button') {
    return buttonSelectedShape(size, shape, groupType);
  } else if (morphConfig.buttonShapeMorphRole === 'icon') {
    return iconButtonSelectedShape(size, shape, groupType);
  } else {
    throw new Error(`Unknown button shape morph type: ${morphConfig}`);
  }
}

export function springDamping(
  morphConfig: MorphConfig,
): string {
  const size: string = morphConfig.buttonSize();

  if (morphConfig.buttonShapeMorphRole === 'button') {
    return buttonSpringDamping(size);
  } else if (morphConfig.buttonShapeMorphRole === 'icon') {
    return iconButtonSpringDamping(size);
  } else {
    throw new Error(`Unknown button shape morph type: ${morphConfig}`);
  }
}

export function springStiffness(
  morphConfig: MorphConfig,
): string {
  const size: string = morphConfig.buttonSize();

  if (morphConfig.buttonShapeMorphRole === 'button') {
    return buttonSpringStiffness(size);
  } else if (morphConfig.buttonShapeMorphRole === 'icon') {
    return iconButtonSpringStiffness(size);
  } else {
    throw new Error(`Unknown button shape morph type: ${morphConfig}`);
  }
}

function returnByGroupTypeOrThrow(
  standardOrDefaultToken: string,
  connectedToken: string,
  groupType: ButtonGroupType = 'standard'
) {
  if (groupType === 'standard' || !groupType) {
    return standardOrDefaultToken;
  } else if (groupType === 'connected') {
    return connectedToken;
  } else {
    throw new Error(`Unexpected button group type: ${groupType}`);
  }
}

function buttonPressedMorph(
  size: string,
  groupType: ButtonGroupType = 'standard'
) {
  return returnByGroupTypeOrThrow(
    `--md-comp-button-${size}-shape-pressed-morph`,
    `--sm-comp-button-connected-${size}-shape-pressed-morph`,
    groupType
  );
}

function buttonRestingShapeMorph(
  size: string,
  shape: string,
  groupType: ButtonGroupType = 'standard'
) {
  return returnByGroupTypeOrThrow(
    `--md-comp-button-${size}-shape-${shape}`,
    `--sm-comp-button-connected-${size}-shape-${shape}`,
    groupType
  );
}

function buttonSelectedShape(
  size: string,
  shape: string,
  groupType: ButtonGroupType = 'standard'
) {
  return returnByGroupTypeOrThrow(
    `--md-comp-button-${size}-selected-container-shape-${shape}`,
    `--sm-comp-button-connected-${size}-selected-container-shape-${shape}`,
    groupType
  );
}

function buttonSpringDamping(size: string) {
  return `--md-comp-button-${size}-shape-spring-animation-damping`;
}

function buttonSpringStiffness(size: string) {
  return `--md-comp-button-${size}-shape-spring-animation-stiffness`;
}

function iconButtonPressedMorph(
  size: string,
  groupType: ButtonGroupType = 'standard'
) {
  return returnByGroupTypeOrThrow(
    `--md-comp-icon-button-${size}-shape-pressed-morph`,
    `--sm-comp-icon-button-connected-${size}-shape-pressed-morph`,
    groupType
  );
}

function iconButtonRestingShapeMorph(
  size: string,
  shape: string,
  groupType: ButtonGroupType = 'standard'
) {
  return returnByGroupTypeOrThrow(
    `--md-comp-icon-button-${size}-container-shape-${shape}`,
    `--sm-comp-icon-button-connected-${size}-shape-${shape}`,
    groupType
  );
}

function iconButtonSelectedShape(
  size: string,
  shape: string,
  groupType: ButtonGroupType = 'standard'
) {
  return returnByGroupTypeOrThrow(
    `--md-comp-icon-button-${size}-selected-container-shape-${shape}`,
    `--sm-comp-icon-button-connected-${size}-selected-container-shape-${shape}`,
    groupType
  );
}

function iconButtonSpringDamping(size: string) {
  return `--md-comp-icon-button-${size}-shape-spring-animation-damping`;
}

function iconButtonSpringStiffness(size: string) {
  return `--md-comp-icon-button-${size}-shape-spring-animation-stiffness`;
}
