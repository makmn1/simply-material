# Badge Tokens

## Enabled / Container
| Name              | Value                      |
|-------------------|----------------------------|
| Badge color       | `md.sys.color.error`       |
| Badge shape       | `md.sys.shape.corner.full` |
| Badge size        | `6dp`                      |
| Badge large color | `md.sys.color.error`       |
| Badge large shape | `md.sys.shape.corner.full` |
| Badge large size  | `16dp`                     |

## Enabled / Label Text
| Name                               | Value                                      |
|------------------------------------|--------------------------------------------|
| Badge large label text color       | `md.sys.color.on-error`                    |
| Badge large label text font        | `md.sys.typescale.label-small.font`        |
| Badge large label text line height | `md.sys.typescale.label-small.line-height` |
| Badge large label text size        | `md.sys.typescale.label-small.size`        |
| Badge large label text tracking    | `md.sys.typescale.label-small.tracking`    |
| Badge large label text weight      | `md.sys.typescale.label-small.weight`      |

Note: Token `Badge large label text type` is omitted because it's essentially the typography tokens in the table combined into one 

## Unassigned Token Attributes
The spec includes the following attributes in a table, but they don't classify them as tokens.
Since we'll need to add these as styles, we'll create our own tokens to best match what the spec could have named them.
Unlike other component styles, these don't map to any system or reference tokens.

| Name                                                                               | Value |
|------------------------------------------------------------------------------------|-------|
| Badge large max width                                                              | 34dp  |
| Badge small distance from top trailing icon corner to leading badge corner         | 6dp   |
| Badge small distance from top trailing icon corner to bottom trailing badge corner | 6dp   |
| Badge large distance from top trailing icon corner to leading badge corner         | 12dp  |
| Badge large distance from top trailing icon corner to bottom trailing badge corner | 14dp  |

The distance tokens can seem confusing. They are essentially the amount of overlap a badge has on an icon.
For a better understanding, [visit the spec](https://m3.material.io/components/badges/specs) and view the measurement images.
We avoid using the words left and right here since usage there would be flipped if the language direction changes.
Using the words leading and trailing keeps the meaning consistent even if the language direction changes.
