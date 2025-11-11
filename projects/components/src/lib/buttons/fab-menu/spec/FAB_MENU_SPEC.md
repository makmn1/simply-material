# FAB Menu

## Overview

A FAB menu expands from a Floating Action Button (FAB) to show multiple related actions.
It displays **2–6 related actions** floating on screen.

* Only one FAB menu size is used for all FAB sizes.
* The FAB menu is **not used with extended FABs.**
* Available in **primary**, **secondary**, and **tertiary** color sets.

---

## Structure

* **Container:** Floating element that holds the close button and related menu items.
* **Close button:** Replaces the original FAB when the menu opens.
* **Menu items:** 2–6 actions shown vertically or stacked, matching the FAB’s color set.

---

## Behavior

* **Color sets:** Primary, secondary, and tertiary.
* **States:** Visual representations communicate interaction status.

**Close button states (light and dark themes):**

* Enabled
* Hovered
* Focused
* Pressed

**Menu item states (light and dark themes):**

* Enabled
* Hovered
* Focused
* Pressed

When the FAB menu can scroll, menu items should scroll **behind the close button**, which remains visible and accessible at all times.

---

## Accessibility

People using assistive technology should be able to:

* Navigate and interact with the FAB menu.
* Maintain proper focus order when navigating through the menu.

**Focus behavior:**

* When the FAB is selected, the FAB menu opens and initial focus remains on the **close button**, which replaces the original FAB.
* Afterward, focus moves from the **top menu item** to the **bottom**.

**Keyboard interactions:**

* **Tab:** Move to the next interactive element.
* **Space or Enter:** Activate the focused button or item.

**Labeling elements:**

* The **close button** should have the **button** role and the label **“Close.”**
* On **mobile web**, menu items should have the **menu item** role.
* Each **menu item** must have a label that matches its visible UI text.

---
