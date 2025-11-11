# Slider

## Overview

Sliders allow users to select a value or range from a continuous or discrete set of options.
They should represent the **full range of available values**, and any change in value should take effect **immediately**.

**Types:**

* Standard
* Centered
* Range

**Configurations:**

* **Orientation:** Horizontal or vertical
* **Size:** XS, S, M, L, XL
* **Optional elements:** Inset icon, stops, and value indicator

---

## Structure

* **Value indicator (optional)**
* **Stop indicators (optional)**
* **Active track**
* **Handle**
* **Inactive track**
* **Inset icon (optional)**

---

## Accessibility

People using assistive technology should be able to:

* Navigate to a slider.
* Select a value or range by moving a handle along a track.
* Receive appropriate feedback based on input type.

**Focus and navigation:**

* Initial focus lands on the **slider handle**, which is the primary interactive element.
* The slider’s value can be adjusted using **arrow keys** or other keyboard navigation inputs.

**Keyboard navigation:**

| Key                | Action                                                              |
|--------------------|---------------------------------------------------------------------|
| **Tab**            | Moves focus to the slider handle                                    |
| **Arrows**         | Increases or decreases the value by one value or one stop indicator |
| **Space + Arrows** | Increases or decreases the value by one interval or stop indicator  |
| **Home / End**     | Sets the slider to the first or last value on the track             |

**Labeling elements:**

* The accessibility label for a slider is typically the same as its **adjacent text label.**
* The component should have the **slider role.**
* When UI text is correctly linked, assistive technology (such as a screen reader) will read the **UI text** followed by the **component’s role.**

---

## Interaction & Style

**Touch:**

* When tapped or dragged, the **handle width shrinks**, and the **value appears** to indicate interaction feedback.

**Cursor:**

* When hovered, the **cursor changes** to show interactivity.
* When clicked and dragged, the **handle width shrinks**, and the **value appears.**

---
