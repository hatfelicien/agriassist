# AgriAssist - Agricultural Advisory PWA for Nyagatare District

## Overview
Mobile-first PWA for small-scale farmers with offline-first architecture, Kinyarwanda language support, and audio accessibility.

## Architecture

### Offline-First Strategy
- **Service Worker**: Workbox with NetworkFirst for dynamic data, CacheFirst for static assets
- **IndexedDB**: Local storage for weather, market prices, advisories, livestock data
- **Background Sync**: Queue offline submissions, sync when connectivity returns

### Key Features
1. **Kinyarwanda/English i18n** - react-i18next with localStorage persistence
2. **Audio Support** - Web Speech API for text-to-speech advisories
3. **Icon-Based Navigation** - Large touch targets (48px minimum)
4. **Offline Indicator** - Real-time connection status
5. **Data Caching** - Weather (1hr), Market (2hr), Advisories (24hr)

## Installation

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

## PWA Deployment

### Generate Icons
Use [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator):
```bash
npx pwa-asset-generator logo.png public/icons --background "#22c55e" --maskable
```

### Build Android APK
Use [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap):
```bash
npx @bubblewrap/cli init --manifest https://yourdomain.com/manifest.webmanifest
npx @bubblewrap/cli build
```

## Testing Low-Resource Environments

### Chrome DevTools
1. Network tab → Throttling → Slow 3G
2. Lighthouse → Performance audit
3. Application → Service Workers → Offline checkbox

### Real Device Testing
- Test on Android 5.0+ devices
- Verify Kinyarwanda font rendering
- Test audio in noisy environments
- Validate touch targets on small screens

## Data Structure

### Weather Alerts
```typescript
{
  id: string;
  sector: string;
  cell: string;
  forecast: string;
  temperature: number;
  rainfall: number;
  timestamp: number;
}
```

### Pest/Disease Database
```typescript
{
  id: string;
  name_rw: string;
  description_rw: string;
  treatment_rw: string;
  image_url: string;
  crops_affected: string[];
}
```

### Market Prices
```typescript
{
  id: string;
  product: string;
  price: number;
  unit: string;
  market_name: string;
  timestamp: number;
}
```

## Performance Optimizations
- Code splitting (vendor, i18n chunks)
- Lazy loading images
- ES2015 target for modern browsers
- Minimal bundle size (~150KB gzipped)

## Accessibility
- WCAG 2.1 AA compliant
- 48px minimum touch targets
- High contrast mode
- Screen reader compatible
- Audio alternatives for text

## API Integration
Replace placeholder URLs in `vite.config.ts`:
- `https://api.agriassist.rw/weather`
- `https://api.agriassist.rw/market-prices`
- `https://api.agriassist.rw/advisories`
