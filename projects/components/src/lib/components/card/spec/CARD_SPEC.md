# Card

## Overview

Cards contain related elements and group information in a flexible layout.
They can include a variety of content such as images, headlines, supporting text, buttons, and lists.
Cards can also contain other components.

**Types:**

* Elevated
* Filled
* Outlined

Cards have flexible layouts and dimensions that adjust based on their contents.

---

## Structure

* **Container:** Defines the card boundary and applies the elevation, fill, or outline style.
* **Content area:** Can include text, images, or interactive elements.
* **Supporting elements:** Optional buttons, icons, or lists that relate to the card’s main content.

---

## Behavior

* **Touch:**

  * When a user taps on a **directly actionable card**, a **touch ripple** appears across the card to provide feedback.
  * **Non-actionable cards** do not display a ripple.

* **Cursor:**

  * When hovered, **directly actionable cards** show a visual cue indicating interactivity.
  * When clicked, they display a ripple for feedback.
  * **Non-actionable cards** do not show hover or click states.

---

## Accessibility

People using assistive technology should be able to:

* Navigate to a card and to the elements contained within it.
* Receive appropriate feedback based on the type of input (touch, cursor, or keyboard).

**Screen readers:**

* The informative contents of a card are announced when navigating to them.
* Images that are purely decorative should be **hidden from screen readers**.
* All actionable elements within a card must be accessible via both **screen reader** and **keyboard focus**.

**Roles:**

* **Directly actionable cards** can use either the **button** or **link** role, depending on context.
* **Non-actionable cards** act as containers and **do not require a role**.

---
