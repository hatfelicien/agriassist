# AgriAssist - Play Store Deployment Guide

## Prerequisites

1. **Google Play Console Account** ($25 one-time fee)
2. **Signed APK** (generated via Bubblewrap)
3. **App Assets:**
   - Feature graphic (1024x500)
   - Screenshots (phone & tablet)
   - App icon (512x512)
   - Privacy policy URL

## Step 1: Build Production APK

```bash
# Build optimized production bundle
npm run build

# Test production build locally
npm run preview

# Initialize Bubblewrap (first time only)
npx @bubblewrap/cli init --manifest https://agriassist.rw/manifest.webmanifest

# Answer prompts:
# - App name: AgriAssist
# - Package name: rw.agriassist.app
# - Host: agriassist.rw
# - Start URL: /
# - Theme color: #22c55e
# - Background color: #ffffff
# - Icon URL: https://agriassist.rw/icons/icon-512x512.png
# - Maskable icon: https://agriassist.rw/icons/icon-512x512.png

# Build signed APK
npx @bubblewrap/cli build

# Output: app-release-signed.apk (in twa-project folder)
```

## Step 2: Prepare App Store Assets

### Feature Graphic (1024x500)
Create promotional banner highlighting:
- "Agricultural Advisory for Nyagatare Farmers"
- Kinyarwanda text: "Ubufasha bw'Ubuhinzi"
- Green theme (#22c55e)
- Icons: weather, crops, livestock, market

### Screenshots (Minimum 2, Maximum 8)
Capture from real device:
1. Home screen with icon navigation
2. Weather forecast (Kinyarwanda)
3. Pest alert with image
4. Market prices
5. Livestock advisory with audio button
6. Offline indicator

### App Description

**Short Description (80 chars):**
```
Agricultural information for Nyagatare farmers - weather, pests, market prices
```

**Full Description:**
```
AgriAssist delivers real-time agricultural information to small-scale farmers in Nyagatare District, Rwanda.

KEY FEATURES:
✓ District-specific weather forecasts (by sector and cell)
✓ Early pest and disease alerts with treatment instructions
✓ Real-time market prices from Nyagatare markets
✓ Livestock health management advisories
✓ Works offline - no internet required after first load
✓ Audio support in Kinyarwanda for low-literacy farmers
✓ Simple icon-based navigation

DESIGNED FOR FARMERS:
- All content in Kinyarwanda and English
- Large buttons for easy touch
- Audio playback of all advisories
- Minimal data usage
- Works on basic Android phones

INFORMATION SOURCES:
- Rwanda Meteorology Agency (weather)
- Ministry of Agriculture extension officers
- Veterinary officers (livestock health)
- Nyagatare market price feeds

OFFLINE FIRST:
AgriAssist stores all information locally on your phone. You can access weather forecasts, pest alerts, and market prices even without internet connection.

TARGET USERS:
Small-scale farmers growing maize, beans, cassava, and raising livestock in Nyagatare District.

RESEARCH-BACKED:
Developed based on surveys with 390 farmers and interviews with agricultural extension officers in Nyagatare District.
```

## Step 3: Play Console Configuration

### App Details
- **App name:** AgriAssist
- **Short description:** (see above)
- **Full description:** (see above)
- **Category:** Education > Educational
- **Tags:** agriculture, farming, rwanda, weather, market prices
- **Contact email:** [your-email]
- **Privacy policy:** https://agriassist.rw/privacy

### Content Rating
Answer questionnaire:
- Target audience: Everyone
- Contains ads: No
- In-app purchases: No
- User-generated content: No

### Pricing & Distribution
- **Price:** Free
- **Countries:** Rwanda (primary), East Africa (optional)
- **Device categories:** Phone, Tablet
- **Android version:** 5.0 and up (API level 21+)

### Store Listing
Upload:
- Feature graphic (1024x500)
- Phone screenshots (minimum 2)
- App icon (512x512)
- Privacy policy URL

## Step 4: Upload APK

1. Go to **Release > Production**
2. Click **Create new release**
3. Upload `app-release-signed.apk`
4. Add release notes:

```
Version 1.0.0 - Initial Release

Features:
- Weather forecasts for Nyagatare sectors
- Pest and disease alerts with images
- Market prices from Nyagatare markets
- Livestock health advisories
- Offline support
- Kinyarwanda and English languages
- Audio playback for all content
```

5. Click **Review release**
6. Click **Start rollout to Production**

## Step 5: Post-Launch

### Monitor Metrics
- Installs per day
- Uninstall rate
- Crash reports
- User reviews
- Active users

### Update Strategy
- Monthly content updates (weather, pests, prices)
- Quarterly feature releases
- Bug fixes within 48 hours

### User Support
- WhatsApp support line for farmers
- Extension officer training sessions
- Cooperative leader demonstrations

## Testing Checklist Before Launch

- [ ] Test on Android 5.0, 7.0, 10.0, 12.0
- [ ] Test on 2GB RAM device
- [ ] Test on Slow 3G network
- [ ] Verify offline functionality
- [ ] Test Kinyarwanda audio playback
- [ ] Verify all icons display correctly
- [ ] Test background sync when online
- [ ] Check app size (<10MB)
- [ ] Validate privacy policy compliance
- [ ] Test on devices with small screens (4.5")

## Privacy Policy Requirements

Must include:
- Data collected: Location (sector/cell), language preference
- Data storage: Local device only (IndexedDB)
- No personal information collected
- No third-party data sharing
- Offline-first architecture
- Contact information for data requests

## Troubleshooting

**APK Build Fails:**
```bash
# Clean and rebuild
rm -rf twa-project
npx @bubblewrap/cli init --manifest https://agriassist.rw/manifest.webmanifest
npx @bubblewrap/cli build
```

**Play Console Rejection:**
- Ensure privacy policy is accessible
- Add content rating questionnaire
- Verify all screenshots are clear
- Check APK signature is valid

**Large APK Size:**
- Remove unused dependencies
- Optimize images (WebP format)
- Enable code splitting
- Use ProGuard for minification

## Support Resources

- **Bubblewrap Docs:** https://github.com/GoogleChromeLabs/bubblewrap
- **Play Console Help:** https://support.google.com/googleplay/android-developer
- **PWA Best Practices:** https://web.dev/pwa-checklist/
