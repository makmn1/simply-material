# Buttons

This spec is taken from the **Buttons** section on the [Material Design website](https://m3.material.io/components/buttons/overview).
We include relevant information here needed for the development of the component.
For the full details, visit the Material Design website.

Spec reviewed: October 2025

## Overview
- Two types: default and toggle
- Can contain an optional leading icon
- Five color options: elevated, filled, tonal, outlined, and text
- Five size recommendations: extra small, small, medium, large, and extra large
- Two shape options: round and square
- Keep labels concise and use sentence case

## Spec
### Types
The following table shows the different button types and their support between M3 and M3 Expressive.

| Type               | Original M3 | M3 Expressive |
|--------------------|-------------|---------------|
| Default            | Available   | Available     |
| Toggle (selection) | --          | Available     |

### Configurations
The following table shows the different configuration options and their support between M3 and M3 Expressive.
Note that a button can have only one configuration option from each category at any point
between size, shape, and color.

| Category              | Configuration                                         | Original M3 | M3 Expressive        |
|-----------------------|-------------------------------------------------------|-------------|----------------------|
| Size                  | Small (default)                                       | Available   | Available            |
| Size                  | Extra small, Medium, Large, Extra large               | --          | Available            |
| Shape                 | Round (default)                                       | Available   | Available            |
| Shape                 | Square                                                | --          | Available            |
| Color                 | Elevated, filled (default), tonal, outlined, standard | Available   | Available            |
| Small button padding  | 24dp                                                  | Available   | Deprecated. Use 16dp |
| Small button padding  | 16dp                                                  | --          | Available            |


### Tokens & specs
Refer to the BUTTON_TOKENS.md file in this directory for a full list of tokens 

### Anatomy
A button is made up of a container that contains:
- Label text
- Icon (optional)

The icon is positioned to the left by default, but should be positioned to the right in right-to-left locales

### Color
Color is implemented through tokens. See the Tokens & specs section above.

### States
States are implemented through tokens. See the Tokens & specs section above.
Buttons have five states that they can be in: 
- Enabled
- Disabled
- Hovered
- Focused
- Pressed

Based on their state, the appropriate styles should be applied based on the token set for that component.
For toggle buttons, they have another set of states:
- Unselected
- Selected

The combination of the toggle state and the interaction state creates a unique style based on the tokens applied.

### Shape Morph

#### Pressed state
> When pressed, buttons can morph to become more square. Both round and square buttons should have the same pressed shape.

> The corner radius value differs for each button size.

Refer to the tokens to get the correct corner radius based on the current state.

#### When selected
> In addition to changing shape when pressed, toggle buttons also change the resting shape from round (unselected) to square (selected).

> If the resting unselected shape is square, the selected shape should be round.

#### Measurements 
Refer to the Token & specs section above for the button measurements.
