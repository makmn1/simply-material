import {InjectionToken, Signal} from '@angular/core';
import {ButtonShapeMorph} from './button-shape-morph';
import {ButtonGroupType} from '../../button-group/button-group-base';

export type MorphConfig = {
  buttonShapeMorphRole: 'button' | 'icon',
  buttonGroupType: Signal<ButtonGroupType> | undefined,
  buttonSize: Signal<string>,
  buttonShape: Signal<string>,
  togglable: Signal<boolean>,
  isSelected: Signal<boolean>,
  disableWidthAnimations: Signal<boolean> | (() => boolean)
};

export interface ButtonShapeMorphConfig {
  morphConfig: MorphConfig
  registerShapeMorphHost: (host: ButtonShapeMorph) => void
}

export const BUTTON_SHAPE_MORPH_ROLE = new InjectionToken<ButtonShapeMorphConfig>('BUTTON_SHAPE_MORPH_ROLE');
