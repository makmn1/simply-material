# Button Group

## Overview

Button groups organize related buttons within a shared container.
There are two types:

* **Standard**
* **Connected**

Button groups apply **shape morphing** when buttons are pressed or selected.
Connected button groups replace the segmented button.
They work with all button sizes: **extra small, small, medium, large, and extra large.**

Button groups support:

* **Single-select**
* **Multi-select**
* **Selection-required**

Configurations for both types include:

* Extra small
* Small
* Medium
* Large
* Extra large
* Single-select and multi-select
* Round and square shapes

Button groups are invisible containers that add padding between buttons and modify button shape. They do not contain buttons by default.

Buttons and icon buttons can be mixed within a group for different scenarios.

---

## Structure

* **Container:** Invisible layout element that provides spacing and shape adjustments between grouped buttons.
* **Buttons:** Contained, tonal, outlined, or icon buttons that form the group.
* **State layer:** Applies shape morph and width change on press or selection, depending on type.

---

## Behavior

### Standard Button Group

* Adds interaction between adjacent buttons when one is **selected** or **activated**.
* Selection temporarily changes:

  * The **width**, **shape**, and **padding** of the selected button.
  * The **width** of adjacent buttons.
* When a **toggle button** is selected:

  * Its shape changes between **square** and **round**.
  * Its color changes according to button specifications.
* When pressed, width and shape adjustments also occur for adjacent buttons.

### Connected Button Group

* Selection or activation affects only the selected button’s **shape**; adjacent buttons remain unchanged.
* Has different shape changes than standard button groups.

**Unselected states:**

* Enabled
* Disabled
* Hovered
* Focused
* Pressed

**Selected states:**

* Enabled
* Hovered
* Focused
* Pressed

---

## Accessibility

People using assistive technology should be able to:

* Navigate to and interact with each button in the group.
* Identify when buttons are selected.

**Focus behavior:**

* The button group container is **not focusable**.
* Initial focus lands on the **first button** in the group.
* Focus moves sequentially through buttons using **Tab**.
* Buttons are selected using **Space** or **Enter**.

The button group container **does not require a label**.

---
