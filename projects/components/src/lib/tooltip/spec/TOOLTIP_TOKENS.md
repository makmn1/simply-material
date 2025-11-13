# Tooltip Tokens
Note: The width container tokens are not officially documented. The names for these tokens are not official. The values, however, were taken
from Jetpack Compose, an official implementation. See the [TooltipDefaults](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Tooltip.kt;drc=943107d5ed0b9734680029f4765ca1c4299a895e;l=489) in the official source code.

## Tooltip - Plain
### Enabled
#### Container
| Name                           | Value                             |
|--------------------------------|-----------------------------------|
| Plain tooltip container color  | `md.sys.color.inverse-surface`    |
| Plain tooltip container shape  | `md.sys.shape.corner.extra-small` |
| Plain tooltip container width  | `200dp`                           |

#### Supporting text
| Name                                      | Value                                     |
|-------------------------------------------|-------------------------------------------|
| Plain tooltip supporting text font        | `md.sys.typescale.body-small.font`        |
| Plain tooltip supporting text line height | `md.sys.typescale.body-small.line-height` |
| Plain tooltip supporting text size        | `md.sys.typescale.body-small.size`        |
| Plain tooltip supporting text weight      | `md.sys.typescale.body-small.weight`      |
| Plain tooltip supporting text tracking    | `md.sys.typescale.body-small.tracking`    |
| Plain tooltip supporting text color       | `md.sys.color.inverse-on-surface`         |

## Tooltip - Rich
### Enabled
#### Container
| Name                                | Value                            |
|-------------------------------------|----------------------------------|
| Rich tooltip container color        | `md.sys.color.surface-container` |
| Rich tooltip container elevation    | `md.sys.elevation.level2`        |
| Rich tooltip container shadow color | `md.sys.color.shadow`            |
| Rich tooltip container shape        | `md.sys.shape.corner.medium`     |
| Rich tooltip container width        | `320dp`                          |

#### Label text
| Name                                       | Value                                      |
|--------------------------------------------|--------------------------------------------|
| Rich tooltip action label text font        | `md.sys.typescale.label-large.font`        |
| Rich tooltip action label text line height | `md.sys.typescale.label-large.line-height` |
| Rich tooltip action label text size        | `md.sys.typescale.label-large.size`        |
| Rich tooltip action label text weight      | `md.sys.typescale.label-large.weight`      |
| Rich tooltip action label text tracking    | `md.sys.typescale.label-large.tracking`    |
| Rich tooltip action label text color       | `md.sys.color.primary`                     |

#### Subhead
| Name                             | Value                                      |
|----------------------------------|--------------------------------------------|
| Rich tooltip subhead font        | `md.sys.typescale.title-small.font`        |
| Rich tooltip subhead line height | `md.sys.typescale.title-small.line-height` |
| Rich tooltip subhead size        | `md.sys.typescale.title-small.size`        |
| Rich tooltip subhead weight      | `md.sys.typescale.title-small.weight`      |
| Rich tooltip subhead tracking    | `md.sys.typescale.title-small.tracking`    |
| Rich tooltip subhead color       | `md.sys.color.on-surface-variant`          |

#### Supporting text
| Name                                     | Value                                      |
|------------------------------------------|--------------------------------------------|
| Rich tooltip supporting text font        | `md.sys.typescale.body-medium.font`        |
| Rich tooltip supporting text line height | `md.sys.typescale.body-medium.line-height` |
| Rich tooltip supporting text size        | `md.sys.typescale.body-medium.size`        |
| Rich tooltip supporting text weight      | `md.sys.typescale.body-medium.weight`      |
| Rich tooltip supporting text tracking    | `md.sys.typescale.body-medium.tracking`    |
| Rich tooltip supporting text color       | `md.sys.color.on-surface-variant`          |

### Hovered
#### Label text
| Name                                       | Value                  |
|--------------------------------------------|------------------------|
| Rich tooltip action hover label text color | `md.sys.color.primary` |

#### State layer
| Name                                          | Value                                    |
|-----------------------------------------------|------------------------------------------|
| Rich tooltip action hover state layer color   | `md.sys.color.primary`                   |
| Rich tooltip action hover state layer opacity | `md.sys.state.hover.state-layer-opacity` |

### Focused
#### Label text
| Name                                       | Value                  |
|--------------------------------------------|------------------------|
| Rich tooltip action focus label text color | `md.sys.color.primary` |

#### State layer
| Name                                          | Value                                    |
|-----------------------------------------------|------------------------------------------|
| Rich tooltip action focus state layer color   | `md.sys.color.primary`                   |
| Rich tooltip action focus state layer opacity | `md.sys.state.focus.state-layer-opacity` |

### Pressed (ripple)
#### Label text
| Name                                         | Value                  |
|----------------------------------------------|------------------------|
| Rich tooltip action pressed label text color | `md.sys.color.primary` |

#### State layer
| Name                                            | Value                                      |
|-------------------------------------------------|--------------------------------------------|
| Rich tooltip action pressed state layer opacity | `md.sys.state.pressed.state-layer-opacity` |
