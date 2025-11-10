# Button Tokens
These button tokens were taken from tables under the Button [Token & specs](https://m3.material.io/components/buttons/specs) section.
This section has a dropdown with 11 options:
- "Button" representing the tokens for the default button (at the time of writing, this matches the filled button tokens)
- 5 options for the different button colors (e.g. elevated, filled, etc.)
- 5 options for the different button sizes

Each option produces a different list of tokens. Those tokens are grouped and listed below.

The table also has another dropdown for choosing the theme, motion scheme, and contrast.
However, it doesn't look like the top-level token values change when changing the theme, motion scheme, or contrast.
Rather, it changes the underlying values for those tokens. For example:

- In the Default, Standard, Light combo, the **Button container color** maps to `md.sys.color.primary` which maps to `md.ref.palette.primary40`
- In the Default, Standard, Dark combo, the **Button container color** maps to `md.sys.color.primary` which maps to `md.ref.palette.primary80`
- Both still map to `md.sys.color.primary`

So even though the spec page doesn't explicitly state it, we'll assume all combos refer to the same top level value unless proven otherwise.

## Default Button Tokens

Currently, this is the same as the filled button tokens.

### Button - Color - Default Enabled

| Name                                         | Value                                         |
|----------------------------------------------|-----------------------------------------------|
| Button container color                       | `md.sys.color.primary`                        |
| Button container color - toggle (unselected) | `md.sys.color.surface-container`              |
| Button container color - toggle (selected)   | `md.sys.color.primary`                        |
| Button shadow color                          | `md.sys.color.shadow`                         |
| Button elevation                             | `md.sys.elevation.level0`                     |
| Button label color                           | `md.sys.color.on-primary`                     |
| Button label color - toggle (unselected)     | `md.sys.color.on-surface-variant`             |
| Button label color - toggle (selected)       | `md.sys.color.on-primary`                     |
| Button icon color                            | `md.sys.color.on-primary`                     |
| Button icon color - toggle (unselected)      | `md.sys.color.on-surface-variant`             |
| Button icon color - toggle (selected)        | `md.sys.color.on-primary`                     |
| Button container height                      | `40dp`                                        |
| Button label size                            | `md.sys.typescale.label-large`                |
| Button label size (Font name)                | `md.sys.typescale.label-large.font`           |
| Button label size (Font weight)              | `md.sys.typescale.label-large.weight`         |
| Button label size (Font size)                | `md.sys.typescale.label-large.size`           |
| Button label size (Line height)              | `md.sys.typescale.label-large.line-height`    |
| Button label size (Font tracking)            | `md.sys.typescale.label-large.tracking`       |
| Button icon size                             | `20dp`                                        |
| Button shape round                           | `md.sys.shape.corner.full`                    |
| Button shape square                          | `md.sys.shape.corner.medium`                  |
| Button leading space                         | `24dp`                                        |
| Button between icon label space              | `8dp`                                         |
| Button trailing space                        | `24dp`                                        |
| Button shape pressed morph                   | `md.sys.shape.corner.small`                   |
| Button shape spring animation damping        | `md.sys.motion.spring.fast.spatial.damping`   |
| Button shape spring animation stiffness      | `md.sys.motion.spring.fast.spatial.stiffness` |
| Button selected container shape round        | `md.sys.shape.corner.medium`                  |
| Button selected container shape square       | `md.sys.shape.corner.full`                    |
| Button focus ring indicator color            | `md.sys.color.secondary`                      |
| Button focus ring indicator thickness        | `md.sys.state.focus-indicator.thickness`      |
| Button focus ring outline offset             | `md.sys.state.focus-indicator.outer-offset`   |

### Button - Color - Default Disabled

| Name                                | Value                     |
|-------------------------------------|---------------------------|
| Button disabled container color     | `md.sys.color.on-surface` |
| Button disabled container opacity   | `0.1`                     |
| Button disabled container elevation | `md.sys.elevation.level0` |
| Button disabled label color         | `md.sys.color.on-surface` |
| Button disabled label opacity       | `0.38`                    |
| Button disabled icon color          | `md.sys.color.on-surface` |
| Button disabled icon opacity        | `0.38`                    |

### Button - Color - Default Hovered

Note: **Button hovered container elevation** is omitted because it's no longer part of the design spec

| Name                                                             | Value                                    |
|------------------------------------------------------------------|------------------------------------------|
| Button hovered container state layer color                       | `md.sys.color.on-primary`                |
| Button hovered container state layer color - toggle (unselected) | `md.sys.color.on-surface-variant`        |
| Button hovered container state layer color - toggle (selected)   | `md.sys.color.on-primary`                |
| Button hovered container state layer opacity                     | `md.sys.state.hover.state-layer-opacity` |
| Button hovered label color                                       | `md.sys.color.on-primary`                |
| Button hovered label color - toggle (unselected)                 | `md.sys.color.on-surface-variant`        |
| Button hovered label color - toggle (selected)                   | `md.sys.color.on-primary`                |
| Button hovered icon color                                        | `md.sys.color.on-primary`                |
| Button hovered icon color - toggle (unselected)                  | `md.sys.color.on-surface-variant`        |
| Button hovered icon color - toggle (selected)                    | `md.sys.color.on-primary`                |

### Button - Color - Default Focused

| Name                                                             | Value                                    |
|------------------------------------------------------------------|------------------------------------------|
| Button focused container state layer color                       | `md.sys.color.on-primary`                |
| Button focused container state layer color - toggle (unselected) | `md.sys.color.on-surface-variant`        |
| Button focused container state layer color - toggle (selected)   | `md.sys.color.on-primary`                |
| Button focused container state layer opacity                     | `md.sys.state.focus.state-layer-opacity` |
| Button focused container state layer elevation                   | `md.sys.elevation.level0`                |
| Button focused label color                                       | `md.sys.color.on-primary`                |
| Button focused label color - toggle (unselected)                 | `md.sys.color.on-surface-variant`        |
| Button focused label color - toggle (selected)                   | `md.sys.color.on-primary`                |
| Button focused icon color                                        | `md.sys.color.on-primary`                |
| Button focused icon color - toggle (unselected)                  | `md.sys.color.on-surface-variant`        |
| Button focused icon color - toggle (selected)                    | `md.sys.color.on-primary`                |

### Button - Color - Default Pressed

| Name                                                             | Value                                      |
|------------------------------------------------------------------|--------------------------------------------|
| Button pressed container state layer color                       | `md.sys.color.on-primary`                  |
| Button pressed container state layer color - toggle (unselected) | `md.sys.color.on-surface-variant`          |
| Button pressed container state layer color - toggle (selected)   | `md.sys.color.on-primary`                  |
| Button pressed container state layer opacity                     | `md.sys.state.pressed.state-layer-opacity` |
| Button pressed container state layer elevation                   | `md.sys.elevation.level0`                  |
| Button pressed label color                                       | `md.sys.color.on-primary`                  |
| Button pressed label color - toggle (unselected)                 | `md.sys.color.on-surface-variant`          |
| Button pressed label color - toggle (selected)                   | `md.sys.color.on-primary`                  |
| Button pressed icon color                                        | `md.sys.color.on-primary`                  |
| Button pressed icon color - toggle (unselected)                  | `md.sys.color.on-surface-variant`          |
| Button pressed icon color - toggle (selected)                    | `md.sys.color.on-primary`                  |

## Filled Button Tokens

### Button - Color - Filled Enabled

| Name                                                | Value                             |
|-----------------------------------------------------|-----------------------------------|
| Button filled container color                       | `md.sys.color.primary`            |
| Button filled container color - toggle (selected)   | `md.sys.color.primary`            |
| Button filled container color - toggle (unselected) | `md.sys.color.surface-container`  |
| Button filled shadow color                          | `md.sys.color.shadow`             |
| Button filled elevation                             | `md.sys.elevation.level0`         |
| Button filled label color                           | `md.sys.color.on-primary`         |
| Button filled label color - toggle (unselected)     | `md.sys.color.on-surface-variant` |
| Button filled label color - toggle (selected)       | `md.sys.color.on-primary`         |
| Button filled icon color                            | `md.sys.color.on-primary`         |
| Button filled icon color - toggle (unselected)      | `md.sys.color.on-surface-variant` |
| Button filled icon color - toggle (selected)        | `md.sys.color.on-primary`         |

### Button - Color - Filled Disabled

| Name                                        | Value                     |
|---------------------------------------------|---------------------------|
| Button filled disabled container color      | `md.sys.color.on-surface` |
| Button filled disabled container opacity    | `0.1`                     |
| Button filled disabled container elevation	 | `md.sys.elevation.level0` |
| Button filled disabled label color          | `md.sys.color.on-surface` |
| Button filled disabled label opacity        | `0.38`                    |
| Button filled disabled icon color           | `md.sys.color.on-surface` |
| Button filled disabled icon opacity         | `0.38`                    |

### Button - Color - Filled Hovered
Note: **Button filled hovered container elevation** is no longer part of the design spec and therefore omitted here

| Name                                                                    | Value                                    |
|-------------------------------------------------------------------------|------------------------------------------|
| Button filled hovered container state layer color                       | `md.sys.color.on-primary`                |
| Button filled hovered container state layer color - toggle (unselected) | `md.sys.color.on-surface-variant`        |
| Button filled hovered container state layer color - toggle (selected)   | `md.sys.color.on-primary`                |
| Button filled hovered container state layer opacity                     | `md.sys.state.hover.state-layer-opacity` |
| Button filled hovered label color                                       | `md.sys.color.on-primary`                |
| Button filled hovered label color - toggle (unselected)                 | `md.sys.color.on-surface-variant`        |
| Button filled hovered label color - toggle (selected)                   | `md.sys.color.on-primary`                |
| Button filled hovered icon color                                        | `md.sys.color.on-primary`                |
| Button filled hovered icon color - toggle (unselected)                  | `md.sys.color.on-surface-variant`        |
| Button filled hovered icon color - toggle (selected)                    | `md.sys.color.on-primary`                |

### Button - Color - Filled Focused

| Name                                                                    | Value                                    |
|-------------------------------------------------------------------------|------------------------------------------|
| Button filled focused container state layer color                       | `md.sys.color.on-primary`                |
| Button filled focused container state layer color - toggle (unselected) | `md.sys.color.on-surface-variant`        |
| Button filled focused container state layer color - toggle (selected)   | `md.sys.color.on-primary`                |
| Button filled focused container state layer opacity                     | `md.sys.state.focus.state-layer-opacity` |
| Button filled focused container state layer elevation                   | `md.sys.elevation.level0`                |
| Button filled focused label color                                       | `md.sys.color.on-primary`                |
| Button filled focused label color - toggle (unselected)                 | `md.sys.color.on-surface-variant`        |
| Button filled focused label color - toggle (selected)                   | `md.sys.color.on-primary`                |
| Button filled focused icon color                                        | `md.sys.color.on-primary`                |
| Button filled focused icon color - toggle (unselected)                  | `md.sys.color.on-surface-variant`        |
| Button filled focused icon color - toggle (selected)                    | `md.sys.color.on-primary`                |

### Button - Color - Filled Pressed

| Name                                                                    | Value                                      |
|-------------------------------------------------------------------------|--------------------------------------------|
| Button filled pressed container state layer color                       | `md.sys.color.on-primary`                  |
| Button filled pressed container state layer color - toggle (unselected) | `md.sys.color.on-surface-variant`          |
| Button filled pressed container state layer color - toggle (selected)   | `md.sys.color.on-primary`                  |
| Button filled pressed container state layer opacity                     | `md.sys.state.pressed.state-layer-opacity` |
| Button filled pressed container state layer elevation                   | `md.sys.elevation.level0`                  |
| Button filled pressed label color                                       | `md.sys.color.on-primary`                  |
| Button filled pressed label color - toggle (unselected)                 | `md.sys.color.on-surface-variant`          |
| Button filled pressed label color - toggle (selected)                   | `md.sys.color.on-primary`                  |
| Button filled pressed icon color                                        | `md.sys.color.on-primary`                  |
| Button filled pressed icon color - toggle (unselected)                  | `md.sys.color.on-surface-variant`          |
| Button filled pressed icon color - toggle (selected)                    | `md.sys.color.on-primary`                  |

## Elevated Button Tokens

### Button - Color - Elevated Enabled

| Name                                                  | Value                                |
|-------------------------------------------------------|--------------------------------------|
| Button elevated container color                       | `md.sys.color.surface-container-low` |
| Button elevated container color - toggle (unselected) | `md.sys.color.surface-container-low` |
| Button elevated container color - toggle (selected)   | `md.sys.color.primary`               |
| Button elevated shadow color                          | `md.sys.color.shadow`                |
| Button elevated elevation                             | `md.sys.elevation.level1`            |
| Button elevated label color                           | `md.sys.color.primary`               |
| Button elevated label color - toggle (unselected)     | `md.sys.color.primary`               |
| Button elevated label color - toggle (selected)       | `md.sys.color.on-primary`            |
| Button elevated icon color                            | `md.sys.color.primary`               |
| Button elevated icon color - toggle (unselected)      | `md.sys.color.primary`               |
| Button elevated icon color - toggle (selected)        | `md.sys.color.on-primary`            |

### Button - Color - Elevated Disabled

| Name                                         | Value                     |
|----------------------------------------------|---------------------------|
| Button elevated disabled container color     | `md.sys.color.on-surface` |
| Button elevated disabled container opacity   | `0.1`                     |
| Button elevated disabled container elevation | `md.sys.elevation.level0` |
| Button elevated disabled label color         | `md.sys.color.on-surface` |
| Button elevated disabled label opacity       | `0.38`                    |
| Button elevated disabled icon color          | `md.sys.color.on-surface` |
| Button elevated disabled icon opacity        | `0.38`                    |

### Button - Color - Elevated Hovered
Note: **Button elevated hovered container elevation** is no longer part of the design spec and therefore omitted here

| Name                                                                      | Value                                    |
|---------------------------------------------------------------------------|------------------------------------------|
| Button elevated hovered container state layer color                       | `md.sys.color.primary`                   |
| Button elevated hovered container state layer color - toggle (unselected) | `md.sys.color.primary`                   |
| Button elevated hovered container state layer color - toggle (selected)   | `md.sys.color.on-primary`                |
| Button elevated hovered container state layer opacity                     | `md.sys.state.hover.state-layer-opacity` |
| Button elevated hovered label color                                       | `md.sys.color.primary`                   |
| Button elevated hovered label color - toggle (unselected)                 | `md.sys.color.primary`                   |
| Button elevated hovered label color - toggle (selected)                   | `md.sys.color.on-primary`                |
| Button elevated hovered icon color                                        | `md.sys.color.primary`                   |
| Button elevated hovered icon color - toggle (unselected)                  | `md.sys.color.primary`                   |
| Button elevated hovered icon color - toggle (selected)                    | `md.sys.color.on-primary`                |

### Button - Color - Elevated Focused
| Name                                                                      | Value                                    |
|---------------------------------------------------------------------------|------------------------------------------|
| Button elevated focused container state layer color                       | `md.sys.color.primary`                   |
| Button elevated focused container state layer color - toggle (unselected) | `md.sys.color.primary`                   |
| Button elevated focused container state layer color - toggle (selected)   | `md.sys.color.on-primary`                |
| Button elevated focused container state layer opacity                     | `md.sys.state.focus.state-layer-opacity` |
| Button elevated focused container state layer elevation                   | `md.sys.elevation.level1`                |
| Button elevated focused label color                                       | `md.sys.color.primary`                   |
| Button elevated focused label color - toggle (unselected)                 | `md.sys.color.primary`                   |
| Button elevated focused label color - toggle (selected)                   | `md.sys.color.on-primary`                |
| Button elevated focused icon color                                        | `md.sys.color.primary`                   |
| Button elevated focused icon color - toggle (unselected)                  | `md.sys.color.primary`                   |
| Button elevated focused icon color - toggle (selected)                    | `md.sys.color.on-primary`                |

### Button - Color - Elevated Pressed
| Name                                                                      | Value                                      |
|---------------------------------------------------------------------------|--------------------------------------------|
| Button elevated pressed container state layer color                       | `md.sys.color.primary`                     |
| Button elevated pressed container state layer color - toggle (unselected) | `md.sys.color.primary`                     |
| Button elevated pressed container state layer color - toggle (selected)   | `md.sys.color.on-primary`                  |
| Button elevated pressed container state layer opacity                     | `md.sys.state.pressed.state-layer-opacity` |
| Button elevated pressed container state layer elevation                   | `md.sys.elevation.level1`                  |
| Button elevated pressed label color                                       | `md.sys.color.primary`                     |
| Button elevated pressed label color - toggle (unselected)                 | `md.sys.color.primary`                     |
| Button elevated pressed label color - toggle (selected)                   | `md.sys.color.on-primary`                  |
| Button elevated pressed icon color                                        | `md.sys.color.primary`                     |
| Button elevated pressed icon color - toggle (unselected)                  | `md.sys.color.primary`                     |
| Button elevated pressed icon color - toggle (selected)                    | `md.sys.color.on-primary`                  |

## Tonal Button Tokens

### Button - Color - Tonal Enabled

| Name                                               | Value                                 |
|----------------------------------------------------|---------------------------------------|
| Button tonal container color                       | `md.sys.color.secondary-container`    |
| Button tonal container color - toggle (unselected) | `md.sys.color.secondary-container`    |
| Button tonal container color - toggle (selected)   | `md.sys.color.secondary`              |
| Button tonal shadow color                          | `md.sys.color.shadow`                 |
| Button tonal elevation                             | `md.sys.elevation.level0`             |
| Button tonal label color                           | `md.sys.color.on-secondary-container` |
| Button tonal label color - toggle (unselected)     | `md.sys.color.on-secondary-container` |
| Button tonal label color - toggle (selected)       | `md.sys.color.on-secondary`           |
| Button tonal icon color                            | `md.sys.color.on-secondary-container` |
| Button tonal icon color - toggle (unselected)      | `md.sys.color.on-secondary-container` |
| Button tonal icon color - toggle (selected)        | `md.sys.color.on-secondary`           |

### Button - Color - Tonal Disabled

| Name                                      | Value                     |
|-------------------------------------------|---------------------------|
| Button tonal disabled container color     | `md.sys.color.on-surface` |
| Button tonal disabled container opacity   | `0.1`                     |
| Button tonal disabled container elevation | `md.sys.elevation.level0` |
| Button tonal disabled label color         | `md.sys.color.on-surface` |
| Button tonal disabled label opacity       | `0.38`                    |
| Button tonal disabled icon color          | `md.sys.color.on-surface` |
| Button tonal disabled icon opacity        | `0.38`                    |

### Button - Color - Tonal Hovered
Note: **Button tonal hovered container elevation** is no longer part of the design spec and therefore omitted here

| Name                                                                   | Value                                    |
|------------------------------------------------------------------------|------------------------------------------|
| Button tonal hovered container state layer color                       | `md.sys.color.on-secondary-container`    |
| Button tonal hovered container state layer color - toggle (unselected) | `md.sys.color.on-secondary-container`    |
| Button tonal hovered container state layer color - toggle (selected)   | `md.sys.color.on-secondary`              |
| Button tonal hovered container state layer opacity                     | `md.sys.state.hover.state-layer-opacity` |
| Button tonal hovered label color                                       | `md.sys.color.on-secondary-container`    |
| Button tonal hovered label color - toggle (unselected)                 | `md.sys.color.on-secondary-container`    |
| Button tonal hovered label color - toggle (selected)                   | `md.sys.color.on-secondary`              |
| Button tonal hovered icon color                                        | `md.sys.color.on-secondary-container`    |
| Button tonal hovered icon color - toggle (unselected)                  | `md.sys.color.on-secondary-container`    |
| Button tonal hovered icon color - toggle (selected)                    | `md.sys.color.on-secondary`              |

### Button - Color - Tonal Focused

| Name                                                                   | Value                                    |
|------------------------------------------------------------------------|------------------------------------------|
| Button tonal focused container state layer color                       | `md.sys.color.on-secondary-container`    |
| Button tonal focused container state layer color - toggle (unselected) | `md.sys.color.on-secondary-container`    |
| Button tonal focused container state layer color - toggle (selected)   | `md.sys.color.on-secondary`              |
| Button tonal focused container state layer opacity                     | `md.sys.state.focus.state-layer-opacity` |
| Button tonal focused container state layer elevation                   | `md.sys.elevation.level0`                |
| Button tonal focused label color                                       | `md.sys.color.on-secondary-container`    |
| Button tonal focused label color - toggle (unselected)                 | `md.sys.color.on-secondary-container`    |
| Button tonal focused label color - toggle (selected)                   | `md.sys.color.on-secondary`              |
| Button tonal focused icon color                                        | `md.sys.color.on-secondary-container`    |
| Button tonal focused icon color - toggle (unselected)                  | `md.sys.color.on-secondary-container`    |
| Button tonal focused icon color - toggle (selected)                    | `md.sys.color.on-secondary`              |

### Button - Color - Tonal Pressed

| Name                                                                   | Value                                      |
|------------------------------------------------------------------------|--------------------------------------------|
| Button tonal pressed container state layer color                       | `md.sys.color.on-secondary-container`      |
| Button tonal pressed container state layer color - toggle (unselected) | `md.sys.color.on-secondary-container`      |
| Button tonal pressed container state layer color - toggle (selected)   | `md.sys.color.on-secondary`                |
| Button tonal pressed container state layer opacity                     | `md.sys.state.pressed.state-layer-opacity` |
| Button tonal pressed container state layer elevation                   | `md.sys.elevation.level0`                  |
| Button tonal pressed label color                                       | `md.sys.color.on-secondary-container`      |
| Button tonal pressed label color - toggle (unselected)                 | `md.sys.color.on-secondary-container`      |
| Button tonal pressed label color - toggle (selected)                   | `md.sys.color.on-secondary`                |
| Button tonal pressed icon color                                        | `md.sys.color.on-secondary-container`      |
| Button tonal pressed icon color - toggle (unselected)                  | `md.sys.color.on-secondary-container`      |
| Button tonal pressed icon color - toggle (selected)                    | `md.sys.color.on-secondary`                |

## Outlined Button Tokens

### Button - Color - Outlined Enabled

| Name                                                | Value                             |
|-----------------------------------------------------|-----------------------------------|
| Button outlined outline color                       | `md.sys.color.outline-variant`    |
| Button outlined container color - toggle (selected) | `md.sys.color.inverse-surface`    |
| Button outlined label color                         | `md.sys.color.on-surface-variant` |
| Button outlined label color - toggle (unselected)   | `md.sys.color.on-surface-variant` |
| Button outlined label color - toggle (selected)     | `md.sys.color.inverse-on-surface` |
| Button outlined icon color                          | `md.sys.color.on-surface-variant` |
| Button outlined icon color - toggle (unselected)    | `md.sys.color.on-surface-variant` |
| Button outlined icon color - toggle (selected)      | `md.sys.color.inverse-on-surface` |

### Button - Color - Outlined Disabled

| Name                                                | Value                          |
|-----------------------------------------------------|--------------------------------|
| Button outlined disabled outline color              | `md.sys.color.outline-variant` |
| Button outlined disabled outline color (unselected) | `md.sys.color.outline-variant` |
| Button outlined disabled container color (selected) | `md.sys.color.on-surface`      |
| Button outlined disabled container opacity          | `0.1`                          |
| Button outlined disabled label color                | `md.sys.color.on-surface`      |
| Button outlined disabled label opacity              | `0.38`                         |
| Button outlined disabled icon color                 | `md.sys.color.on-surface`      |
| Button outlined disabled icon opacity               | `0.38`                         |

### Button - Color - Outlined Hovered

| Name                                                            | Value                                    |
|-----------------------------------------------------------------|------------------------------------------|
| Button outlined hovered state layer color                       | `md.sys.color.on-surface-variant`        |
| Button outlined hovered state layer color - toggle (unselected) | `md.sys.color.on-surface-variant`        |
| Button outlined hovered state layer color - toggle (selected)   | `md.sys.color.inverse-on-surface`        |
| Button outlined hovered state layer opacity                     | `md.sys.state.hover.state-layer-opacity` |
| Button outlined hovered outline color                           | `md.sys.color.outline-variant`           |
| Button outlined hovered outline color - toggle (unselected)     | `md.sys.color.outline-variant`           |
| Button outlined hovered label color                             | `md.sys.color.on-surface-variant`        |
| Button outlined hovered label color - toggle (unselected)       | `md.sys.color.on-surface-variant`        |
| Button outlined hovered label color - toggle (selected)         | `md.sys.color.inverse-on-surface`        |
| Button outlined hovered icon color                              | `md.sys.color.on-surface-variant`        |
| Button outlined hovered icon color - toggle (unselected)        | `md.sys.color.on-surface-variant`        |
| Button outlined hovered icon color - toggle (selected)          | `md.sys.color.inverse-on-surface`        |

### Button - Color - Outlined Focused

| Name                                                                      | Value                                    |
|---------------------------------------------------------------------------|------------------------------------------|
| Button outlined focused container state layer color                       | `md.sys.color.on-surface-variant`        |
| Button outlined focused container state layer color - toggle (unselected) | `md.sys.color.on-surface-variant`        |
| Button outlined focused container state layer color - toggle (selected)   | `md.sys.color.inverse-on-surface`        |
| Button outlined focused container state layer opacity                     | `md.sys.state.focus.state-layer-opacity` |
| Button outlined focused outline color                                     | `md.sys.color.outline-variant`           |
| Button outlined focused outline color - toggle (unselected)               | `md.sys.color.outline-variant`           |
| Button outlined focused label color                                       | `md.sys.color.on-surface-variant`        |
| Button outlined focused label color - toggle (unselected)                 | `md.sys.color.on-surface-variant`        |
| Button outlined focused label color - toggle (selected)                   | `md.sys.color.inverse-on-surface`        |
| Button outlined focused icon color                                        | `md.sys.color.on-surface-variant`        |
| Button outlined focused icon color - toggle (unselected)                  | `md.sys.color.on-surface-variant`        |
| Button outlined focused icon color - toggle (selected)                    | `md.sys.color.inverse-on-surface`        |

### Button - Color - Outlined Pressed

| Name                                                                      | Value                                      |
|---------------------------------------------------------------------------|--------------------------------------------|
| Button outlined pressed container state layer color                       | `md.sys.color.on-surface-variant`          |
| Button outlined pressed container state layer color - toggle (unselected) | `md.sys.color.on-surface-variant`          |
| Button outlined pressed container state layer color - toggle (selected)   | `md.sys.color.inverse-on-surface`          |
| Button outlined pressed container state layer opacity                     | `md.sys.state.pressed.state-layer-opacity` |
| Button outlined pressed outline color                                     | `md.sys.color.outline-variant`             |
| Button outlined pressed outline color - toggle (unselected)               | `md.sys.color.outline-variant`             |
| Button outlined pressed label color                                       | `md.sys.color.on-surface-variant`          |
| Button outlined pressed label color - toggle (unselected)                 | `md.sys.color.on-surface-variant`          |
| Button outlined pressed label color - toggle (selected)                   | `md.sys.color.inverse-on-surface`          |
| Button outlined pressed icon color                                        | `md.sys.color.on-surface-variant`          |
| Button outlined pressed icon color - toggle (unselected)                  | `md.sys.color.on-surface-variant`          |
| Button outlined pressed icon color - toggle (selected)                    | `md.sys.color.inverse-on-surface`          |

## Text Button Tokens

### Button - Color - Text Enabled

| Name                    | Value                  |
|-------------------------|------------------------|
| Button text label color | `md.sys.color.primary` |
| Button text icon color  | `md.sys.color.primary` |

### Button - Color - Text Disabled

| Name                                   | Value                     |
|----------------------------------------|---------------------------|
| Button text disabled container color   | `md.sys.color.on-surface` |
| Button text disabled container opacity | `0.1`                     |
| Button text disabled label color       | `md.sys.color.on-surface` |
| Button text disabled label opacity     | `0.38`                    |
| Button text disabled icon color        | `md.sys.color.on-surface` |
| Button text disabled icon opacity      | `0.38`                    |

### Button - Color - Text Hovered

| Name                                    | Value                                    |
|-----------------------------------------|------------------------------------------|
| Button text hovered state layer color   | `md.sys.color.primary`                   |
| Button text hovered state layer opacity | `md.sys.state.hover.state-layer-opacity` |
| Button text hovered label color         | `md.sys.color.primary`                   |
| Button text hovered icon color          | `md.sys.color.primary`                   |

### Button - Color - Text Focused

| Name                                    | Value                                    |
|-----------------------------------------|------------------------------------------|
| Button text focused state layer color   | `md.sys.color.primary`                   |
| Button text focused state layer opacity | `md.sys.state.focus.state-layer-opacity` |
| Button text focused label color         | `md.sys.color.primary`                   |
| Button text focused icon color          | `md.sys.color.primary`                   |

### Button - Color - Text Pressed

| Name                                    | Value                                      |
|-----------------------------------------|--------------------------------------------|
| Button text pressed state layer color   | `md.sys.color.primary`                     |
| Button text pressed state layer opacity | `md.sys.state.pressed.state-layer-opacity` |
| Button text pressed label color         | `md.sys.color.primary`                     |
| Button text pressed icon color          | `md.sys.color.primary`                     |

## Button Size Tokens

### Button - Size - Xsmall

| Name                                           | Value                                         |
|------------------------------------------------|-----------------------------------------------|
| Button xsmall container height                 | `32dp`                                        |
| Button xsmall outline width                    | `1dp`                                         |
| Button xsmall label size                       | `md.sys.typescale.label-large`                |
| Button xsmall label size (Font name)           | `md.sys.typescale.label-large.font`           |
| Button xsmall label size (Font weight)         | `md.sys.typescale.label-large.weight`         |
| Button xsmall label size (Font size)           | `md.sys.typescale.label-large.size`           |
| Button xsmall label size (Line height)         | `md.sys.typescale.label-large.line-height`    |
| Button xsmall label size (Font tracking)       | `md.sys.typescale.label-large.tracking`       |
| Button xsmall icon size                        | `20dp`                                        |
| Button xsmall shape round                      | `md.sys.shape.corner.full`                    |
| Button xsmall shape square                     | `md.sys.shape.corner.medium`                  |
| Button xsmall leading space                    | `12dp`                                        |
| Button xsmall between icon label space         | `8dp`                                         |
| Button xsmall trailing space                   | `12dp`                                        |
| Button xsmall shape pressed morph              | `md.sys.shape.corner.small`                   |
| Button xsmall shape spring animation damping   | `md.sys.motion.spring.fast.spatial.damping`   |
| Button xsmall shape spring animation stiffness | `md.sys.motion.spring.fast.spatial.stiffness` |
| Button xsmall selected container shape round   | `md.sys.shape.corner.medium`                  |
| Button xsmall selected container shape square  | `md.sys.shape.corner.full`                    |

### Button - Size - Small
This is the default button size

| Name                                          | Value                                         |
|-----------------------------------------------|-----------------------------------------------|
| Button small container height                 | `40dp`                                        |
| Button small outline width                    | `1dp`                                         |
| Button small label size (Font name)           | `md.sys.typescale.label-large.font`           |
| Button small label size (Font weight)         | `md.sys.typescale.label-large.weight`         |
| Button small label size (Font size)           | `md.sys.typescale.label-large.size`           |
| Button small label size (Line height)         | `md.sys.typescale.label-large.line-height`    |
| Button small label size (Font tracking)       | `md.sys.typescale.label-large.tracking`       |
| Button small icon size                        | `20dp`                                        |
| Button small shape round                      | `md.sys.shape.corner.full`                    |
| Button small shape square                     | `md.sys.shape.corner.medium`                  |
| Button small leading space                    | `16dp`                                        |
| Button small between icon label space         | `8dp`                                         |
| Button small trailing space                   | `16dp`                                        |
| Button small shape pressed morph              | `md.sys.shape.corner.small`                   |
| Button small shape spring animation damping   | `md.sys.motion.spring.fast.spatial.damping`   |
| Button small shape spring animation stiffness | `md.sys.motion.spring.fast.spatial.stiffness` |
| Button small selected container shape round   | `md.sys.shape.corner.medium`                  |
| Button small selected container shape square  | `md.sys.shape.corner.full`                    |

### Button - Size - Medium

| Name                                           | Value                                         |
|------------------------------------------------|-----------------------------------------------|
| Button medium container height                 | `56dp`                                        |
| Button medium outline width                    | `1dp`                                         |
| Button medium label size                       | `md.sys.typescale.title-medium`               |
| Button medium label size (Font name)           | `md.sys.typescale.title-medium.font`          |
| Button medium label size (Font weight)         | `md.sys.typescale.title-medium.weight`        |
| Button medium label size (Font size)           | `md.sys.typescale.title-medium.size`          |
| Button medium label size (Line height)         | `md.sys.typescale.title-medium.line-height`   |
| Button medium label size (Font tracking)       | `md.sys.typescale.title-medium.tracking`      |
| Button medium icon size                        | `24dp`                                        |
| Button medium shape round                      | `md.sys.shape.corner.full`                    |
| Button medium shape square                     | `md.sys.shape.corner.large`                   |
| Button medium leading space                    | `24dp`                                        |
| Button medium between icon label space         | `8dp`                                         |
| Button medium trailing space                   | `24dp`                                        |
| Button medium shape pressed morph              | `md.sys.shape.corner.medium`                  |
| Button medium shape spring animation damping   | `md.sys.motion.spring.fast.spatial.damping`   |
| Button medium shape spring animation stiffness | `md.sys.motion.spring.fast.spatial.stiffness` |
| Button medium selected container shape round   | `md.sys.shape.corner.large`                   |
| Button medium selected container shape square  | `md.sys.shape.corner.full`                    |

### Button - Size - Large

| Name                                          | Value                                         |
|-----------------------------------------------|-----------------------------------------------|
| Button large container height                 | `96dp`                                        |
| Button large outline width                    | `2dp`                                         |
| Button large label size                       | `md.sys.typescale.headline-small`             |
| Button large label size (Font name)           | `md.sys.typescale.headline-small.font`        |
| Button large label size (Font weight)         | `md.sys.typescale.headline-small.weight`      |
| Button large label size (Font size)           | `md.sys.typescale.headline-small.size`        |
| Button large label size (Line height)         | `md.sys.typescale.headline-small.line-height` |
| Button large label size (Font tracking)       | `md.sys.typescale.headline-small.tracking`    |
| Button large icon size                        | `32dp`                                        |
| Button large shape round                      | `md.sys.shape.corner.full`                    |
| Button large shape square                     | `md.sys.shape.corner.extra-large`             |
| Button large leading space                    | `48dp`                                        |
| Button large between icon label space         | `12dp`                                        |
| Button large trailing space                   | `48dp`                                        |
| Button large shape pressed morph              | `md.sys.shape.corner.large`                   |
| Button large shape spring animation damping   | `md.sys.motion.spring.fast.spatial.damping`   |
| Button large shape spring animation stiffness | `md.sys.motion.spring.fast.spatial.stiffness` |
| Button large selected container shape round   | `md.sys.shape.corner.extra-large`             |
| Button large selected container shape square  | `md.sys.shape.corner.full`                    |

## Button - Size - Xlarge

| Name                                           | Value                                         |
|------------------------------------------------|-----------------------------------------------|
| Button xlarge container height                 | `136dp`                                       |
| Button xlarge outline width                    | `3dp`                                         |
| Button xlarge label size                       | `md.sys.typescale.headline-large`             |
| Button xlarge label size (Font name)           | `md.sys.typescale.headline-large.font`        |
| Button xlarge label size (Font weight)         | `md.sys.typescale.headline-large.weight`      |
| Button xlarge label size (Font size)           | `md.sys.typescale.headline-large.size`        |
| Button xlarge label size (Line height)         | `md.sys.typescale.headline-large.line-height` |
| Button xlarge label size (Font tracking)       | `md.sys.typescale.headline-large.tracking`    |
| Button xlarge icon size                        | `40dp`                                        |
| Button xlarge shape round                      | `md.sys.shape.corner.full`                    |
| Button xlarge shape square                     | `md.sys.shape.corner.extra-large`             |
| Button xlarge leading space                    | `64dp`                                        |
| Button xlarge between icon label space         | `16dp`                                        |
| Button xlarge trailing space                   | `64dp`                                        |
| Button xlarge shape pressed morph              | `md.sys.shape.corner.large`                   |
| Button xlarge shape spring animation damping   | `md.sys.motion.spring.fast.spatial.damping`   |
| Button xlarge shape spring animation stiffness | `md.sys.motion.spring.fast.spatial.stiffness` |
| Button xlarge selected container shape round   | `md.sys.shape.corner.extra-large`             |
| Button xlarge selected container shape square  | `md.sys.shape.corner.full`                    |
