# Navigation Bar

## Overview

Navigation bars provide access to primary destinations within an app.
They are used in **compact** or **medium** window sizes and contain **3–5 destinations** of equal importance.
Destinations are **consistent across app screens** and do not change dynamically.

---

## Structure

* **Container:** Holds navigation destinations.
* **Navigation item:** Represents a destination, displaying an icon and label.
* **Active indicator:** Visually identifies the selected destination.

---

## Behavior

**Configurations:**

* In **compact windows**, navigation bars display **vertical items**.
* In **medium windows**, navigation bars display **horizontal items**.

**Touch interaction:**

* When a navigation item is tapped:

  * The **active indicator** appears in place, showing selection.
  * A **touch ripple** passes through the indicator.
  * The **icon** switches from **outlined** to **filled**.
  * The **icon color** changes.

**Cursor interaction:**

* When hovered:

  * The **active indicator** appears in a reduced state to show interactivity.
* When clicked (in both active and inactive states):

  * A **ripple** passes through the indicator.
  * The **icon** switches from **outlined** to **filled**.
  * The **icon color** darkens.

---

## Accessibility

People using assistive technology should be able to:

* Move between navigation destinations.
* Select a destination from the set.
* Receive appropriate feedback based on the input type.

**Initial focus:**

* Focus initially lands on the **first navigation item**, the first interactive element in the component.

**Keyboard navigation:**

| Key               | Action                              |
|-------------------|-------------------------------------|
| **Tab**           | Move between navigation items       |
| **Space / Enter** | Selects the focused navigation item |

**Labeling elements:**

* The accessibility label for a navigation item is typically the same as the **destination name.**
* When visible UI text is ambiguous, the accessibility label should be **more descriptive.**

  * Example: A destination labeled “Library” could use a label like “Media Library” to clarify intent.

---
