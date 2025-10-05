# Reset Functionality Documentation

## Overview

The ZUS simulator now includes comprehensive reset functionality that allows users to restart their session from various points in the application. This clears all stored data and returns users to the welcome screen.

## Reset Components

### 1. ResetButton
A full button component for prominent reset actions.

```tsx
import { ResetButton } from '@/components/flow/reset-button'

<ResetButton 
  variant="secondary" 
  size="md"
  className="px-8"
/>
```

### 2. ResetLink
A subtle underlined link for less prominent reset options.

```tsx
import { ResetLink } from '@/components/flow/reset-button'

<ResetLink className="text-xs" />
```

### 3. ResetIconButton
A compact icon-only button for headers and tight spaces.

```tsx
import { ResetIconButton } from '@/components/flow/reset-button'

<ResetIconButton />
```

## Current Implementation

### Locations where reset is available:

1. **Header (Global)** - Icon button in the top navigation
2. **Result Page** - Prominent "Zacznij od nowa" button
3. **Dashboard Page** - "Rozpocznij od nowa" button next to export
4. **Flow Navigation** - Subtle link when not on step 1
5. **Debug Panel** - Quick reset button for development

### Reset Behavior

When a reset is triggered:

1. **Confirmation Dialog** - Shows "Czy na pewno chcesz zacząć od nowa? Wszystkie wprowadzone dane zostaną utracone."
2. **State Clearing** - All Jotai atoms are reset to empty/default values
3. **LocalStorage Cleanup** - All persisted data is removed
4. **Step Reset** - Current step is set back to 1, completed steps cleared
5. **Navigation** - User is redirected to the home page (`/`)

## Customization

### Custom Confirmation Message

```tsx
<ResetButton 
  confirmMessage="Czy na pewno chcesz usunąć wszystkie dane?"
/>
```

### Custom Redirect

```tsx
<ResetButton 
  redirectTo="/custom-page"
/>
```

### Custom Text

```tsx
<ResetButton>
  Wyczyść wszystko
</ResetButton>
```

## Development

### Testing Reset Functionality

1. Navigate through the flow and enter data
2. Check the debug panel (bottom-right) to see state
3. Click any reset button/link
4. Confirm the dialog
5. Verify:
   - All form data is cleared
   - Step is back to 1
   - LocalStorage is empty
   - User is on home page

### Adding Reset to New Pages

```tsx
import { ResetButton } from '@/components/flow/reset-button'

function MyPage() {
  return (
    <div>
      {/* Your content */}
      
      <div className="flex justify-between">
        <button>Some other action</button>
        <ResetButton variant="ghost" size="sm" />
      </div>
    </div>
  )
}
```

## State Management Integration

The reset functionality is deeply integrated with the Jotai state management:

- Uses `useResetAllData()` hook from the store
- Automatically handles all registered atoms
- Maintains consistency with step progression
- Ensures localStorage cleanup

## Future Enhancements

Potential improvements:
- Partial reset (reset only certain sections)
- Export data before reset
- Undo functionality
- Auto-save drafts
- Session recovery after accidental reset
