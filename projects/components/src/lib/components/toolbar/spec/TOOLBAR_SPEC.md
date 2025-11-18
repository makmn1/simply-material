# Toolbar

## Overview

Toolbars organize a set of controls that provide access to key actions and tools within a view.
They can display a wide variety of controls, including **buttons**, **icon buttons**, and **text fields**, and can be paired with **FABs** to emphasize important actions.

Toolbars should **not** appear at the same time as a **navigation bar**.

**Types:**

* **Docked toolbar**
* **Floating toolbar**

**Color styles:**
Use the **vibrant color style** for greater emphasis.

---

## Structure

* **Container**
* **Placed components** (such as buttons, icon buttons, and text fields)

---

## Configurations

* **Standard toolbar**
* **Vibrant toolbar**
* **Vertical floating toolbar**
* **Floating toolbar with FAB**

---

## Flexibility & Slots

A toolbar functions as a **container with multiple configurable slots.**
Each slot can hold a different element.
Common elements include:

* Icon buttons
* Buttons
* Text fields

---

## Accessibility

People using assistive technology should be able to:

* Navigate to and activate any toolbar actions.
* Select a destination from a menu.
* Activate a back button.
* Maintain access to toolbar controls when content is scrolled or collapsed.

**Initial focus:**

* Focus lands on the **first interactive element** in the toolbar.
* Use **Tab** to move sequentially through all actions.

**Keyboard navigation:**

| Key               | Action                                |
|-------------------|---------------------------------------|
| **Tab / Arrows**  | Navigate between interactive elements |
| **Space / Enter** | Activate the focused element          |

**Labeling elements:**

* On web, the **toolbar container** should have the **“toolbar” role.**
* All interactive elements inside the toolbar should follow their respective **accessibility guidelines.**

---
