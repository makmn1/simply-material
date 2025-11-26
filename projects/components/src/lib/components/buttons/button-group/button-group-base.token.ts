import {InjectionToken, Signal} from '@angular/core';

export type BaseConfig = {
  groupDisabled: Signal<boolean>,
  groupSoftDisabled: Signal<boolean>,
  groupReadonly: Signal<boolean>,
};

export interface ButtonGroupBaseConfig {
  baseConfig: BaseConfig
}

export const BUTTON_GROUP_BASE_CONFIG = new InjectionToken<ButtonGroupBaseConfig>('BUTTON_GROUP_BASE_CONFIG');
