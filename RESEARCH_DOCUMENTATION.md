# AgriAssist - Localized Agricultural Advisory System for Nyagatare District

## Research Background

**Problem Statement:**
Small-scale farmers in Nyagatare District face persistent challenges accessing timely, accurate agricultural information. Conventional extension services are overstretched, with limited officers serving dispersed communities, resulting in:
- Delayed support and infrequent farm visits
- Reliance on informal information sources (neighbors, agro-dealers)
- Critical decisions made without reliable guidance on weather, pests, livestock health, or market prices
- Low productivity, increased losses, and reduced income

**Barriers to Digital Adoption:**
- Language barriers (need for Kinyarwanda)
- Low digital literacy
- Unreliable internet connectivity
- High data costs
- Dependence on basic mobile phones (not smartphones)

## Research Methodology

**Sample Size:** 464 participants (Yamane's formula, precision level 0.05)
- 390 small-scale farmers (quantitative surveys)
- Agricultural extension officers (qualitative interviews)
- Veterinary officers (qualitative interviews)
- Cooperative leaders (qualitative interviews)

**Analysis:**
- Quantitative: Descriptive statistics
- Qualitative: Thematic analysis

## Key Findings

Farmers need:
1. **District-specific weather forecasts** - Localized to sectors/cells in Nyagatare
2. **Early pest and disease alerts** - With images and Kinyarwanda treatment instructions
3. **Livestock health advisories** - From veterinary officers
4. **Reliable market price information** - Real-time updates from local markets

## Solution: AgriAssist PWA

### Core Features (Research-Backed)

#### 1. Weather Forecasts
- Sector and cell-level granularity (Nyagatare, Matimba, Karangazi, Karama, etc.)
- Temperature, rainfall predictions
- Audio playback in Kinyarwanda
- Cached for offline access (1-hour expiry)

#### 2. Pest & Disease Alerts
- Visual identification with images
- Kinyarwanda descriptions and treatments
- Affected crops listed
- Lazy-loaded images for slow networks
- Full offline support

#### 3. Market Prices
- Real-time prices from Nyagatare Central Market
- Crops: Maize (Ibigori), Beans (Ibishyimbo), Cassava (Imyumbati)
- Livestock products: Milk (Amata)
- Timestamp for freshness
- 2-hour cache expiry

#### 4. Livestock Health Management
- Vaccination schedules
- Disease prevention (Foot-and-Mouth, Newcastle, Gumboro)
- Feeding recommendations
- Audio advisories from veterinary officers

### Technical Architecture

#### Offline-First Design
```
User Action → Check IndexedDB → Display Cached Data
                ↓
         Network Available?
                ↓
         Fetch Fresh Data → Update Cache → Background Sync Queue
```

#### Data Storage (IndexedDB)
- **weather**: Sector-specific forecasts
- **pests**: Disease database with images
- **market**: Price feeds with timestamps
- **livestock**: Health advisories
- **sync_queue**: Offline submissions

#### Caching Strategy
- Weather: NetworkFirst (10s timeout) → 1hr cache
- Market: NetworkFirst → 2hr cache
- Advisories: CacheFirst → 24hr cache
- Images: CacheFirst → 30-day cache

### Accessibility Features (Low Literacy Support)

1. **Audio Playback**
   - Web Speech API
   - Kinyarwanda voice (rw-RW)
   - 0.8x speed for clarity
   - Large play/stop buttons

2. **Icon-Based Navigation**
   - Minimal text
   - Universal symbols (cloud=weather, cart=market, bug=pests, cow=livestock)
   - 48px minimum touch targets

3. **High Contrast Mode**
   - Optimized for outdoor visibility
   - Primary green (#22c55e) for agriculture theme
   - Large fonts (18px base)

4. **Simple Kinyarwanda**
   - Localized terminology validated by extension officers
   - Short sentences
   - Action-oriented language

### Performance Optimizations (Low-Resource Networks)

1. **Bundle Size**
   - Code splitting (vendor, i18n chunks)
   - ES2015 target
   - Tree-shaking unused code
   - Target: <150KB gzipped

2. **Image Optimization**
   - Lazy loading
   - WebP format with JPEG fallback
   - Responsive images
   - Placeholder loading states

3. **Network Resilience**
   - 10-second timeout for API calls
   - Graceful degradation to cached data
   - Background sync when online
   - Visual offline indicator

## Installation & Deployment

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Android APK (Play Store)
```bash
# Using Bubblewrap
npx @bubblewrap/cli init --manifest https://agriassist.rw/manifest.webmanifest
npx @bubblewrap/cli build

# Output: app-release-signed.apk
```

### Testing Low-Resource Environments

**Chrome DevTools:**
1. Network → Throttling → Slow 3G
2. Lighthouse → Performance audit (target: >80)
3. Application → Service Workers → Offline mode

**Real Device Testing:**
- Android 5.0+ devices
- 2GB RAM minimum
- Test on 2G/3G networks
- Validate Kinyarwanda rendering
- Test audio in noisy farm environments

## API Endpoints (Backend Integration)

Replace placeholder URLs in `vite.config.ts`:

```typescript
// Weather API
GET https://api.agriassist.rw/weather
Response: [{ id, sector, cell, forecast, forecast_rw, temperature, rainfall, timestamp }]

// Pest/Disease API
GET https://api.agriassist.rw/pests
Response: [{ id, name_rw, name_en, description_rw, treatment_rw, image_url, crops_affected[] }]

// Market Prices API
GET https://api.agriassist.rw/market-prices
Response: [{ id, product, price, unit, market_name, timestamp }]

// Livestock Advisories API
GET https://api.agriassist.rw/livestock
Response: [{ id, title_rw, content_rw, category, timestamp }]
```

## Sample Data Structure

### Weather Alert
```json
{
  "id": "w1",
  "sector": "Nyagatare",
  "cell": "Karangazi",
  "forecast": "Partly cloudy with chance of rain",
  "forecast_rw": "Ibihe byiza, imvura ishobora kugwa",
  "temperature": 24,
  "rainfall": 15,
  "timestamp": 1707912000000
}
```

### Pest Alert
```json
{
  "id": "p1",
  "name_rw": "Inzoka y'ibigori",
  "name_en": "Maize Stalk Borer",
  "description_rw": "Ibyonnyi byangiza ibigori bikabikora umwobo mu gihimba",
  "treatment_rw": "Koresha imiti ya Cypermethrin. Kuraho ibimera byangijwe",
  "image_url": "/images/stalk-borer.jpg",
  "crops_affected": ["Ibigori", "Amasaka"]
}
```

## User Validation

**Next Steps:**
1. Deploy pilot version to 50 farmers in Nyagatare sector
2. Conduct usability testing with low-literacy farmers
3. Validate Kinyarwanda translations with extension officers
4. Measure adoption metrics:
   - Daily active users
   - Feature usage (weather vs market vs pests)
   - Audio playback frequency
   - Offline usage patterns

## Impact Metrics (Expected)

Based on research findings:
- **Reduce information access time** from days to minutes
- **Increase timely pest response** by 60%
- **Improve market price awareness** by 75%
- **Reduce livestock disease losses** by 40%
- **Support 10,000+ farmers** in Nyagatare District

## License & Contact

**Developed for:** Small-scale farmers in Nyagatare District, Rwanda  
**Research Institution:** [Your University]  
**Contact:** [Your Email]  
**Year:** 2026

---

**Note:** This system addresses the specific needs identified through surveys with 390 farmers and interviews with agricultural extension officers in Nyagatare District.
