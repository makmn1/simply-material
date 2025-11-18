# Navigation Rail

## Overview

Navigation rails provide access to primary destinations within an app.
They are used in **medium**, **expanded**, **large**, and **extra-large** window sizes.

A navigation rail can contain **3–7 destinations** and an **optional FAB**.
The rail should always appear in the **same position** across all app screens.

---

## Types

* **Collapsed navigation rail**
* **Expanded navigation rail**

---

## Configurations

* **Expanded layout: standard**
* **Expanded layout: modal**

---

## Structure

Collapsed and expanded navigation rails can include the following elements:

* **Container**
* **Menu (optional)**
* **FAB or Extended FAB (optional)**
* **Icon**
* **Active indicator**
* **Label text**
* **Large badge (optional)**
* **Large badge label (optional)**
* **Small badge (optional)**

---

## Accessibility

People using assistive technology should be able to:

* Navigate between navigation destinations.
* Select a particular destination from the set.
* Receive appropriate feedback based on the input type.

**Initial focus:**

* Focus lands on the **first interactive element**, which may be the **menu**, **FAB**, or **first navigation item**.
* From the FAB or menu, **Tab** moves focus to the navigation items.
* **Tab** or **Arrow keys** then move focus between navigation items.

**Keyboard navigation:**

| Key               | Action                                |
|-------------------|---------------------------------------|
| **Tab / Arrows**  | Navigate between interactive elements |
| **Space / Enter** | Selects an interactive element        |

**Labeling elements:**

* The accessibility label for a navigation item is typically the same as its **adjacent text label.**
* When visible text is ambiguous, accessibility labels should be **more descriptive.**

  * Example: A navigation item labeled “Recent” might use a label like “Recent files” to clarify its purpose.

---
