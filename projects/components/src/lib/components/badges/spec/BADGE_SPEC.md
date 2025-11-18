# Badge

## Overview

Badges display dynamic information such as counts or status labels.
They can contain **labels** or **numbers** and are used to draw attention to updates or notifications.

**Types:**

* Small
* Large

Badges are anchored inside the icon’s bounding box, positioned at the **upper trailing edge** of the icon.
Content should be limited to **four characters**, including a “+”.
The **default color mapping** should be used.

---

## Structure

* **Container:** Circular or rounded shape placed at the upper trailing edge of an icon.
* **Label:** Displays a short count or text value (up to four characters).

---

## Behavior

* **Interaction and style:**

  * Badges are commonly used within components such as **navigation bars**, **navigation rails**, **app bars**, and **tabs**.
  * When used to indicate an **unread notification**, the badge becomes **hidden** once the item is selected.

---

## Accessibility

People using assistive technology should be able to:

* Understand the dynamic information conveyed by badges, such as counts or labels.
* Address badge announcements by selecting corresponding navigation destinations.

**Labeling:**

* The accessibility label for a badge item is read **after** its navigation destination.
* **Numerical badges** announce their number.
* **Non-numerical badges** announce “New notification.”

---
