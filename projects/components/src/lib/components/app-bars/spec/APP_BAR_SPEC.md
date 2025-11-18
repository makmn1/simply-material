# App Bar

## Overview

The app bar focuses on describing the current page and providing one to two essential actions.
It displays labels and page navigation controls at the top of the page.
(Use a toolbar to display page actions.)

**Types:**

* Search app bar
* Small
* Medium flexible
* Large flexible

On scroll, the app bar applies a fill color to separate it from the body content.
It can animate on or off screen together with another bar of controls, such as a row of chips.

---

## Structure

App bars can be customized to include:

* An image or logo
* A subtitle
* A filled icon button

**Search:**
The search app bar can include trailing actions both inside and outside the search bar.
When the search bar is selected, it opens the **search view** component.

**Image:**
An image can be placed in the app bar.
In small app bars, the image can replace the label text.

**Filled trailing icon button:**
Trailing icon buttons can be replaced with a single filled icon button — **primary** or **tonal**, in **default** or **wide** sizes.

**Subtitle:**
Medium flexible and large flexible app bars adjust in height to fit the text contents.
They become taller when a subtitle is visible.

---

## Behavior

* **Color values:** Implemented through design tokens.
* **Color roles:** All app bars share the same color roles.
* **On scroll:**

  * The container color changes to **surface container** when scrolled.
  * The search bar can also change color when scrolled.

**Color states:**

* Flat
* On scroll

---

## Accessibility

People using assistive technology should be able to:

* Understand what page they are currently visiting.
* Take actions or navigate to a new page destination.
* Maintain access to app bar actions when content is scrolled.

**Focus behavior:**

* Initial focus should land on the **leading button**, as it is the first interactive element in the app bar.
* **Tab:** Move focus to the next interactive element.
* **Space or Enter:** Activate the focused element.

**Labels:**

* The accessibility label for a title should match the visible content of the title.
* Add additional context if needed to clarify what page or content is being shown.
* Screen readers announce the UI text followed by the component’s role.
* Label icon buttons according to their accessibility guidelines.

---
