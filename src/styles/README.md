# ZUS Brand Colors

This directory contains the ZUS brand color definitions based on the official ZUS Brand Guidelines.

## Color Palette

The following colors are defined according to the ZUS Brand Guidelines:

1. **Yellow** - RGB(255, 179, 79) - `#FFB34F` - Primary accent color
2. **Green** - RGB(0, 153, 63) - `#00993F` - Success, positive actions
3. **Gray** - RGB(190, 195, 206) - `#BEC3CE` - Neutral, secondary text
4. **Blue** - RGB(63, 132, 210) - `#3F84D2` - Information, links
5. **Navy** - RGB(0, 65, 110) - `#00416E` - Primary brand color
6. **Red** - RGB(240, 94, 94) - `#F05E5E` - Errors, warnings
7. **Black** - RGB(0, 0, 0) - `#000000` - Text, high contrast

## Usage

### CSS Variables

The colors are available as CSS custom properties:

```css
/* Direct ZUS colors */
background-color: var(--zus-navy);
color: var(--zus-yellow);

/* Semantic colors */
background-color: var(--color-primary);
color: var(--color-secondary);
```

### CSS Classes

Use predefined utility classes:

```html
<!-- Background colors -->
<div class="bg-primary">Primary background</div>
<div class="zus-bg-navy">ZUS Navy background</div>

<!-- Text colors -->
<p class="text-success">Success message</p>
<p class="zus-text-green">Green text</p>

<!-- Border colors -->
<div class="border-accent border-2">Accent border</div>
```

### JavaScript/TypeScript

Import colors for programmatic use:

```typescript
import { zusColors, semanticColors, chartColors } from '@/styles/colors';

// Use in Chart.js
const chartConfig = {
  backgroundColor: chartColors,
  borderColor: zusColors.navy,
};

// Use with opacity
import { withOpacity } from '@/styles/colors';
const transparentNavy = withOpacity(zusColors.navy, 0.5);
```

## Semantic Mapping

- **Primary**: Navy (main brand color)
- **Secondary**: Yellow (accent color)
- **Accent**: Blue (interactive elements)
- **Success**: Green (positive feedback)
- **Warning**: Yellow (caution)
- **Error**: Red (negative feedback)
- **Neutral**: Gray (secondary information)

## Files

- `zus-colors.css` - CSS custom properties and utility classes
- `colors.ts` - TypeScript/JavaScript color definitions
- `README.md` - This documentation file

## Examples

### Button Styles
```css
.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-medium);
}
```

### Chart Usage
```typescript
import { chartColorsHex } from '@/styles/colors';

const chartData = {
  datasets: [{
    backgroundColor: chartColorsHex,
    // ... other config
  }]
};
```

### Conditional Styling
```typescript
import { semanticColors } from '@/styles/colors';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return semanticColors.success;
    case 'error': return semanticColors.error;
    case 'warning': return semanticColors.warning;
    default: return semanticColors.neutral;
  }
};
```
