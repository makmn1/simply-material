# Tooltip Usage Guide

## Styling the Tooltip
This tooltip content component is created following Material Design standards and guidelines.
If needed, you can customize the styles (container color, width, font) via overriding the component tokens.

## Configuration
There are two types of tooltips: plain and rich. The tooltip content is provided via an `ng-template`, and the type is explicitly set using the `tooltipType` input.

### Basic Usage

To use a tooltip, you need to:
1. Create an `ng-template` with your tooltip content wrapped in `<sm-tooltip-content>`
2. Bind the template to the `tooltip` input
3. Set the `tooltipType` to either `'plain'` or `'rich'`
4. Import `SimplyMatTooltipContentComponent` in your component

**Plain Tooltip Example:**
```angular20html
<ng-template #plainTooltipTpl>
  <sm-tooltip-content>
    <span>This is a plain tooltip</span>
  </sm-tooltip-content>
</ng-template>
<button sm-tooltip [tooltip]="plainTooltipTpl" [tooltipType]="'plain'">
  Hover me
</button>
```

**Rich Tooltip Example:**
```angular20html
<ng-template #richTooltipTpl>
  <sm-tooltip-content>
    <div>Tooltip Heading</div>
    <div>Supporting text with more details</div>
    <button>Action Button</button>
  </sm-tooltip-content>
</ng-template>
<button sm-tooltip [tooltip]="richTooltipTpl" [tooltipType]="'rich'">
  Hover me
</button>
```

**Note:** The `<sm-tooltip-content>` component is required and provides the proper styling and `data-sm-type` attribute based on the tooltip type. Make sure to import `SimplyMatTooltipContentComponent` in your component's imports array.

### Advanced Configuration

You can further customize basic configuration by passing in a `config` input of type `TooltipConfig`.
This allows you to customize the tooltips:
- position (default `'below'` for rich tooltips, and `'above'` for plain tooltips)
  - Options: `'above'`, `'below'`, `'left'`, `'right'`, or `null` to use defaults
- showDelay (milliseconds, default 0)
- hideDelay (milliseconds, default 1500 [per Material Guidelines](https://m3.material.io/components/tooltips/guidelines#b0386365-fe47-4e46-b4e0-e8f62ae55395))
- persistStrategy (default `'on-hover'`)
  - `'on-hover'`: Tooltip hides when mouse leaves the host element
  - `'on-hover-with-tooltip'`: Tooltip stays visible when hovering over the tooltip itself
- trigger (default `'default'`)
  - `'default'`: Tooltip opens on hover, focus, or click (for rich tooltips)
  - `'manual'`: Tooltip can only be opened programmatically via `open()` method
- overlayConfig (see below)
- positionOffset (the offset in pixels added between the host element and the tooltip)
  - Default: 4px for plain tooltips, 8px for rich tooltips

**Configuration Example:**
```typescript
import {TooltipConfig} from "@simply-material/components";

tooltipConfig: TooltipConfig = {
  position: 'below',
  showDelay: 100,
  hideDelay: 2000,
  persistStrategy: 'on-hover-with-tooltip',
  trigger: 'default',
  positionOffset: 12
};
```

**Manual Trigger Mode Example:**
When using `trigger: 'manual'`, the tooltip can only be opened programmatically and will ignore hover, focus, and click events:

```typescript
manualTooltipConfig: TooltipConfig = {
  trigger: 'manual'
};
```

```angular20html
<ng-template #manualTooltipTpl>
  <sm-tooltip-content>
    <span>This tooltip can only be opened programmatically</span>
  </sm-tooltip-content>
</ng-template>
<button 
  sm-tooltip 
  [tooltip]="manualTooltipTpl" 
  [tooltipType]="'plain'" 
  [config]="manualTooltipConfig"
  #manualTooltip="smTooltip">
  Manual Tooltip
</button>
<button (click)="manualTooltip.open()">Open Tooltip</button>
<button (click)="manualTooltip.close()">Close Tooltip</button>
```

```angular20html
<ng-template #tooltipTpl>
  <sm-tooltip-content>
    <span>Custom configured tooltip</span>
  </sm-tooltip-content>
</ng-template>
<button 
  sm-tooltip 
  [tooltip]="tooltipTpl" 
  [tooltipType]="'plain'" 
  [config]="tooltipConfig">
  Hover me
</button>
```

### Customizing the Overlay
You can provide your own OverlayConfig via the `overlayConfig` option in the `config` input.

We provide the following configuration. Note that you'll need to set any of these to `null` (or replace them with your own values) if you want to remove them.
- positionStrategy:
  - flexibleConnectedTo: your host element
  - withFlexibleDimensions: false (if not set to false, bounding box becomes too big and goes off center)
  - withPositions: a default set of positions [following Material Guidelines](https://m3.material.io/components/tooltips/guidelines#2e9525cb-8222-48f4-a401-2612e6b31228) with fallback positions
  - withViewportMargin: 8
  - withTransformOriginOn: '[role="tooltip"]' (applied to the tooltip container)
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

### Programmatic Control

To access a directive, you can use a template reference variable.
The directive exports itself as `smTooltip` so you can get it by:

```angular20html
<ng-template #myTooltipTpl>
  <sm-tooltip-content>
    <span>Tooltip content</span>
  </sm-tooltip-content>
</ng-template>
<button 
  sm-tooltip 
  [tooltip]="myTooltipTpl" 
  [tooltipType]="'plain'" 
  #myTooltipName="smTooltip">
  My Button
</button>
```

This assigns the directive to the name `myTooltipName` which you can reference
in the template elsewhere. You can also use it in your component via the `viewChild` signal:

```typescript
import {viewChild} from "@angular/core";
import {SimplyMatTooltip} from "@simply-material/components";

tooltipDirective = viewChild<SimplyMatTooltip>("myTooltipName")
```

You can then programmatically control the tooltip:

```typescript
// Open the tooltip
this.tooltipDirective()?.open();

// Close the tooltip
this.tooltipDirective()?.close();
```
