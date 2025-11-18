# Carousel

## Overview

Carousels contain visual items such as images or videos, with optional label text.
They display items that scroll horizontally and may include dynamic sizing and motion effects.

**Layouts:**

* Multi-browse
* Uncontained
* Hero
* Full-screen

Layouts can be **start-aligned** or **center-aligned.**
Item visuals have a **parallax effect** when scrolled, and items **change size** as they move through the carousel.

---

## Structure

* **Container:** Scrollable region that holds carousel items and optional headers or actions.
* **Carousel items:** Contain visual content, such as images or videos, and optional labels.
* **Show all button (optional):** Provides access to a vertically scrolling list of all items.

---

## Behavior

### Carousel item dynamic widths

* All carousel items adapt dynamically to the container’s width.
* **Large items:** Have a customizable maximum width that optimally fits the available space.
* **Small items:** Minimum width of **40dp** and maximum width of **56dp**.
* Items change size as they move through the carousel layout.

---

### Multi-browse layout

Shows at least one large, one medium, and one small carousel item.
Padding is applied on both sides of the container.

| Attribute                | Value                |
|--------------------------|----------------------|
| Alignment                | Vertically centered  |
| Leading/trailing padding | 16dp                 |
| Top/bottom padding       | 8dp                  |
| Padding between elements | 8dp                  |
| Large item width         | Dynamic, or user-set |
| Medium item width        | Dynamic              |
| Small item width         | 40–56dp, dynamic     |
| Item corner radius       | 28dp                 |

---

### Uncontained layout

Shows items that scroll to the edge of the container.
Items bleed over the side padding when scrolling.

| Attribute                | Value               |
|--------------------------|---------------------|
| Alignment                | Vertically centered |
| Leading padding          | 16dp                |
| Top/bottom padding       | 8dp                 |
| Padding between elements | 8dp                 |
| Item corner radius       | 28dp                |

---

### Hero layout

Shows at least one large item and one small item.
Padding is applied on both sides of the container.

| Attribute                | Value               |
|--------------------------|---------------------|
| Alignment                | Vertically centered |
| Leading/trailing padding | 16dp                |
| Top/bottom padding       | 8dp                 |
| Padding between elements | 8dp                 |
| Large item width         | Dynamic             |
| Small item width         | 40–56dp, dynamic    |
| Item corner radius       | 28dp                |

---

### Center-aligned hero layout

Shows at least one large item and two small items.
Padding is applied on both sides of the container.

| Attribute                | Value               |
|--------------------------|---------------------|
| Alignment                | Vertically centered |
| Leading/trailing padding | 16dp                |
| Top/bottom padding       | 8dp                 |
| Padding between elements | 8dp                 |
| Large item width         | Dynamic             |
| Small item width         | 40–56dp, dynamic    |
| Item corner radius       | 28dp                |

---

### Full-screen layout

Shows a single edge-to-edge large item that fills the window.

| Attribute                | Value    |
|--------------------------|----------|
| Alignment                | Centered |
| Leading/trailing padding | 0dp      |
| Top/bottom padding       | 0dp      |
| Padding between elements | 16dp     |

---

## Accessibility

People using assistive technology should be able to:

* Navigate to the carousel container.
* Navigate between different carousel items.
* Activate a carousel item.
* Skip over the carousel entirely.

**Scrolling pages:**

* On vertically scrolling pages, carousels must provide an accessible way to view all items without horizontal scrolling.

  * Material recommends adding a **Show all** button below the carousel that opens a vertically scrolling page containing all items.
  * Carousels without headers should include this **Show all** button, which uses **4dp padding.**
  * If a carousel has a header, an **arrow icon button** can be used instead. Place the arrow icon next to or within the same row as the header.
  * The header should also appear on the page containing all carousel items.

**Focus behavior:**

* When navigating to a carousel, initial focus should land on the **first carousel item.**
* Use **Tab** or arrow keys to move between carousel items.
* Use **Up/Down arrow keys** to leave the carousel and move focus to the next page element, such as the **Show all** button.

**Keyboard interactions:**

* **Tab or Arrow keys:** Move to previous or next carousel item.
* **Space or Enter:** Activate the focused carousel item.

**Roles and labels:**

* The carousel container has the **container** role.
* Each carousel announces its **current item position** and **total number of items.**

---

## Reduced Motion

When **reduced motion** settings are enabled:

* The parallax effect is removed.
* Carousel items remain the same size and no longer expand as they come into view.
* Carousels should reach the window edges to prevent clipping.
* In **hero carousels**, the small carousel item remains partially visible on screen.

---
