# Switch

## Overview

Switches let users toggle individual settings on or off.
They should be used instead of radio buttons when items in a list can be **independently controlled**.
Switches are the preferred control for **adjusting settings**, and their **on/off state** should be clearly visible at a glance.

---

## Structure

* **Track**
* **Handle (formerly "thumb")**
* **Icon**

---

## Configurations

* Without icons
* Icon on selected switch
* Icon on selected and unselected switch

---

## Accessibility

People using assistive technology should be able to:

* Navigate to a switch using keyboard or switch input.
* Toggle the switch on and off.
* Receive appropriate feedback based on the input method.

**Initial focus:**

* Focus lands directly on the **switch handle**, as it is the primary interactive element.

**Keyboard navigation:**

| Key               | Action                           |
|-------------------|----------------------------------|
| **Tab**           | Moves focus to the switch handle |
| **Space / Enter** | Toggles the switch on or off     |

**Labeling elements:**

* The accessibility label for a switch should use the **adjacent label text** if implemented correctly.
* Assistive technology (such as a screen reader) will read the **UI text** followed by the **component’s role.**
* When visible UI text is ambiguous, accessibility labels should be **more descriptive.**

  * Example: A switch labeled “Photo album” could use an accessibility label such as “Enable photo album access.”
* When possible, make the **visible label text** descriptive to reduce the need for separate accessibility labels.

---

## Interaction & Style

**Touch:**

* When tapped or dragged, the **handle increases in size** to indicate interaction feedback.

**Cursor:**

* When hovered, the **hover area grows** in both on and off states, signaling interactivity.
* When clicked, the **handle size increases**, providing visual feedback.

---
