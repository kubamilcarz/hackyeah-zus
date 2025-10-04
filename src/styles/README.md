# ZUS Design System

Kompletny system projektowania zgodny z wytycznymi ZUS zawierający kolory, komponenty UI i style.

## Pliki w systemie

- `zus-colors.css` - Kolory ZUS i zmienne CSS
- `zus-design-system.css` - Komponenty UI i style
- `colors.ts` - Definicje kolorów dla JavaScript/TypeScript
- `README.md` - Ta dokumentacja

## Kolory ZUS

Następujące kolory są zdefiniowane zgodnie z Księgą Znaku ZUS:

1. **Navy** - RGB(0, 65, 110) - `#00416E` - Główny kolor marki
2. **Yellow** - RGB(255, 179, 79) - `#FFB34F` - Kolor akcentu
3. **Blue** - RGB(63, 132, 210) - `#3F84D2` - Informacje, linki
4. **Green** - RGB(0, 153, 63) - `#00993F` - Sukces, pozytywne akcje
5. **Red** - RGB(240, 94, 94) - `#F05E5E` - Błędy, ostrzeżenia
6. **Gray** - RGB(190, 195, 206) - `#BEC3CE` - Neutralny, tekst pomocniczy
7. **Black** - RGB(0, 0, 0) - `#000000` - Tekst, wysoki kontrast

## Komponenty UI

### Karty (Cards)
```html
<div class="zus-card">
  <div class="zus-card-header">Nagłówek</div>
  <div class="zus-card-body">Treść</div>
  <div class="zus-card-footer">Stopka</div>
</div>
```

Warianty: `zus-card-primary`, `zus-card-secondary`, `zus-card-accent`, `zus-card-success`, `zus-card-warning`, `zus-card-error`, `zus-card-featured`

### Przyciski
```html
<button class="zus-btn zus-btn-primary">Przycisk główny</button>
<button class="zus-btn zus-btn-secondary">Przycisk pomocniczy</button>
<button class="zus-btn zus-btn-outline">Przycisk obrysowany</button>
```

Rozmiary: `zus-btn-small`, `zus-btn-large`

### Typografia
```html
<h1 class="zus-text-display">Display</h1>
<h1 class="zus-text-h1">Heading 1</h1>
<h2 class="zus-text-h2">Heading 2</h2>
<p class="zus-text-body">Tekst podstawowy</p>
<p class="zus-text-small">Mały tekst</p>
```

### Etykiety (Badges)
```html
<span class="zus-badge zus-badge-primary">Primary</span>
<span class="zus-badge zus-badge-success">Sukces</span>
```

### Alerty
```html
<div class="zus-alert zus-alert-info">
  <div class="zus-alert-title">Tytuł</div>
  Treść alertu
</div>
```

### Formularze
```html
<label class="zus-label">Etykieta</label>
<input class="zus-input" type="text" placeholder="Pole tekstowe">
<select class="zus-select">...</select>
<textarea class="zus-textarea">...</textarea>
```

### Tabele
```html
<table class="zus-table">
  <thead>
    <tr><th>Nagłówek</th></tr>
  </thead>
  <tbody>
    <tr><td>Komórka</td></tr>
  </tbody>
</table>
```

## Komponenty React

System zawiera również kompletny zestaw komponentów React:

```tsx
import {
  ZusCard,
  ZusCardHeader,
  ZusCardBody,
  ZusButton,
  ZusBadge,
  ZusAlert,
  ZusInput,
  ZusHeading,
  ZusText
} from '@/components';

// Przykład użycia
<ZusCard variant="primary">
  <ZusCardHeader>
    <ZusHeading level={2}>Tytuł karty</ZusHeading>
  </ZusCardHeader>
  <ZusCardBody>
    <ZusText>Treść karty</ZusText>
    <ZusButton variant="primary">Akcja</ZusButton>
  </ZusCardBody>
</ZusCard>
```

## Warianty semantyczne

- **Primary**: Navy (główny kolor marki)
- **Secondary**: Yellow (kolor akcentu)
- **Accent**: Blue (elementy interaktywne)
- **Success**: Green (pozytywne informacje)
- **Warning**: Yellow (ostrzeżenia)
- **Error**: Red (błędy)
- **Neutral**: Gray (informacje pomocnicze)

## Wykorzystanie z Chart.js

```typescript
import { chartColorsHex } from '@/styles/colors';

const chartData = {
  datasets: [{
    backgroundColor: chartColorsHex,
    borderColor: chartColorsHex[0],
  }]
};
```

## Demo

Pełne demo wszystkich komponentów znajduje się w `ZusDesignSystemDemo.tsx`.
