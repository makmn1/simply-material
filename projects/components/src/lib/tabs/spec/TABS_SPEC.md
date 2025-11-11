# Tabs

## Overview

Tabs organize content into **helpful categories** and allow users to quickly navigate between them.
There are two types of tabs:

* **Primary tabs**
* **Secondary tabs**

Tabs can **horizontally scroll**, allowing the UI to include as many tabs as needed.
Tabs should be placed next to each other as **peers**.

---

## Structure

### Primary Tabs

* **Container**
* **Badge (optional)**
* **Icon (optional)**
* **Label**
* **Divider**
* **Active indicator**

### Secondary Tabs

* **Container**
* **Badge (optional)**
* **Label**
* **Divider**
* **Active indicator**

---

## Accessibility

Users should be able to:

* Perform actions or navigate to a new destination using assistive technology.
* Select an action or destination from an off-screen tab using assistive technology.
* Maintain access to primary actions even when the content is scrolled.

**Initial focus:**

* When navigating using arrow keys or Tab within a tab menu, the **active indicator** appears on the first interactive tab to show selection.
* The user can then move through all available interactive elements until the tab menu is complete.

**Keyboard navigation:**

| Key               | Action                                                   |
| ----------------- | -------------------------------------------------------- |
| **Arrow**         | Moves focus to the next available navigation destination |
| **Space / Enter** | Activates the focused navigation destination             |
| **Arrow**         | Allows navigation through menu items                     |

**Labeling elements:**

* When visible UI text is ambiguous or missing, accessibility labels should provide additional descriptive context.

  * Example: An icon-only tab that visually represents a “video camera” should include an accessibility label clarifying the intent, such as “Video.”

---

## Interaction & Style

**Scrollable tabs:**

* Used when the number of tabs exceeds the screen width.
* Best suited for **touch interfaces**.
* Users can:

  * **Swipe** left or right to move through tabs.
  * Use **arrow keys** or **Tab** to navigate through tabs.
  * Use **Space** or **Enter** to select a tab.
* Tabs should **not loop infinitely**, as this may trap users navigating linearly with a screen reader.
* Horizontal scrolling tabs meet accessibility requirements by expanding in width to accommodate label text without affecting the overall layout.

---
