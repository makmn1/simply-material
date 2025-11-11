# Time Picker

## Overview

Time pickers are **modal components** that cover the main content.
They allow users to select **hours**, **minutes**, or **periods of time**.
There are two types of time pickers:

* **Dial**
* **Input**

Time pickers should make it easy to select time by hand, especially on mobile devices.

---

## Structure

### Time Picker Dial

* **Headline**
* **Time selector separator**
* **Container**
* **Period selector container**
* **Period selector label text**
* **Clock dial selector center**
* **Clock dial selector track**
* **Text button**
* **Icon button**
* **Clock dial selector container**
* **Clock dial label text**
* **Clock dial container**
* **Time selector label text**
* **Time selector container**

### Time Picker Input

* **Headline**
* **Time input field separator**
* **Container**
* **Period selector container**
* **Period selector label text**
* **Text button**
* **Icon button**
* **Time input field supporting text**
* **Time input field label text**
* **Time input field container**

---

## Behavior

* **Types:** Dial and input.
* Users can select or enter **hours**, **minutes**, and optionally **seconds** or **milliseconds**.
* Supports multiple formats, including **24-hour** and **AM/PM** views.

**Interaction and style:**

* Time pickers should allow **manual text entry**, not just selection from the dial.
  This improves accessibility for keyboard users.
* On smaller screens, display only the **input selector** when space does not allow for the dial selector.
* The **input selector** can be accessed from the dial selector using the **keyboard icon**.
  This enables multiple input methods and improves accessibility for assistive technology users.

**Keyboard interaction:**

| Key                | Action                                         |
|--------------------|------------------------------------------------|
| **Tab**            | Moves focus to the next non-disabled time slot |
| **Space or Enter** | Activates the focused (non-disabled) time slot |

---

## Accessibility

People using assistive technology should be able to:

* Select or enter hours, minutes, and in some cases seconds or milliseconds.
* Choose between multiple time formats, including 24-hour and AM/PM.
* Enter a time manually through input fields.

**Labeling elements:**

* When input text is properly linked, assistive technology (such as a screen reader) will read the **component’s role first**, followed by the **UI text**.
* The **dial selector** announces the total number of selectable hours, such as
  “Hour 7 of 12.”

---
