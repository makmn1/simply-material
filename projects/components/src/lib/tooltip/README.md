# Tooltip Usage Guide

## Styling the Tooltip
This tooltip content component is created following Material Design standards and guidelines.
If needed, you can customize the styles (container color, width, font) via overriding the component tokens.

## Configuration
There are two types of tooltips: plain and rich. A plain tooltip is simply a single line of text.
A rich tooltip has a few parts: a heading, supporting text, and optional actions.

If you provide a string to the `tooltip` input, a plain tooltip will be created. If you provide a `RichTooltipConfig` object,
a rich tooltip will be created.

You can further customize basic configuration by passing in a `config` input of type `TooltipConfig`.
This allows you to customize the tooltips:
- position (default below-right / below-left for rich tooltips, and above / below for plain tooltips)
- showDelay (milliseconds, default 0)
- hideDelay (milliseconds, default 1500 [per Material Guidelines](https://m3.material.io/components/tooltips/guidelines#b0386365-fe47-4e46-b4e0-e8f62ae55395))
- persistStrategy (default `on-hover-with-tooltip` if a rich tooltip with buttons, otherwise `on-hover`)
- overlayConfig (see below)
- positionOffset (the offset in pixels added between the host element and the tooltip)

### Customizing the Overlay
You can provide your own OverlayConfig via the `overlayConfig` option in the `config` input.

We provide the following configuration. Note that you'll need to set any of these to `null` (or replace them with your own values) if you want to remove them.
- positionStrategy:
  - flexibleConnectedTo: your host element
  - withFlexibleDimensions: false (if not set to false, bounding box becomes too big and goes off center)
  - withPositions: a default set of positions [following Material Guidelines](https://m3.material.io/components/tooltips/guidelines#2e9525cb-8222-48f4-a401-2612e6b31228) with fallback positions
  - withViewportMargin: 8
  - withTransformOriginOn: '[role="tooltip"]'
  - Note that replacing the position strategy will replace all these properties
- scrollStrategy: close
- maxWidth: Follows the [Material Guideline spec](https://m3.material.io/components/tooltips/specs#c07b16fe-be21-490b-815b-20c16246ee8f) for max width
- hasBackdrop: false
- disposeOnNavigation: true

## Accessing the Directive

The Tooltip directive exposes the Tooltip `overlayRef` which allows
you to view the current instance of the Angular CDK's overlay being used.
Accessing this allows you to further customize the overlay, adding event listeners
if a user clicks outside the overlay, adding a backdrop, etc. For a full list
of actions the Angular CDK overlay provides, [visit the docs](https://material.angular.dev/cdk/overlay/api).

To access a directive, you can use a template reference variable.
The directive exports itself as `smTooltip` so you can get it by:

```angular20html
<button sm-tooltip tooltip="Tooltip" #myTooltipName="smTooltip">
  My Button
</button>
```

This assigns the element to the name `myTooltipName` which you can reference
in the template elsewhere. You can also use it in your component via the `viewChild` signal:

```typescript
import {ElementRef, viewChild} from "@angular/core";

tooltipDirective = viewChild<ElementRef>("myTooltipName")
```
