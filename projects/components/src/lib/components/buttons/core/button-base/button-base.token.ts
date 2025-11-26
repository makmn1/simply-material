import {InjectionToken, Signal, WritableSignal} from '@angular/core';

export type BaseConfig<Shape> = {
  buttonShapeMorphRole: 'button' | 'icon',
  buttonVariant: Signal<string>,
  buttonSize: Signal<string | undefined>,
  buttonShape: Signal<Shape | undefined>,
  defaultButtonShape: Shape,
  buttonDisabled: Signal<boolean | undefined>,
  buttonSoftDisabled: Signal<boolean | undefined>,
  buttonReadonly: Signal<boolean | undefined>,
  togglable: Signal<boolean>,
  isSelected: WritableSignal<boolean>
};

export interface ButtonBaseConfig {
  baseConfig: BaseConfig<string>
}

export const BUTTON_BASE_CONFIG = new InjectionToken<ButtonBaseConfig>('BUTTON_BASE_CONFIG');
