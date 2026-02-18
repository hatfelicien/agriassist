# AgriAssist - Testing Guide for Low-Resource Environments

## Testing Objectives

Validate that AgriAssist works effectively for small-scale farmers in Nyagatare District with:
- Basic Android phones (2GB RAM)
- Slow 2G/3G networks
- Intermittent connectivity
- Low digital literacy
- Outdoor usage conditions

## 1. Network Condition Testing

### Chrome DevTools Simulation

```bash
# Start dev server
npm run dev

# Open Chrome DevTools (F12)
# Network tab → Throttling → Custom
```

**Test Profiles:**

| Profile | Download | Upload | Latency | Packet Loss |
|---------|----------|--------|---------|-------------|
| Slow 3G | 400 Kbps | 400 Kbps | 400ms | 0% |
| Fast 3G | 1.6 Mbps | 750 Kbps | 150ms | 0% |
| 2G | 250 Kbps | 50 Kbps | 800ms | 2% |
| Offline | 0 Kbps | 0 Kbps | - | 100% |

**Test Scenarios:**
1. Load app on Slow 3G → Should display cached content within 3s
2. Navigate between sections offline → Should work seamlessly
3. Submit query offline → Should queue for background sync
4. Go online after offline → Should sync automatically

### Real Network Testing

**Location:** Rural Nyagatare (Karangazi, Karama cells)

**Test Cases:**
- [ ] Load app in area with weak signal
- [ ] Switch between 2G/3G/4G
- [ ] Test during peak hours (8am-10am, 5pm-7pm)
- [ ] Verify offline indicator appears correctly
- [ ] Check data usage (should be <500KB per session)

## 2. Device Compatibility Testing

### Minimum Spec Device
- **Model:** Samsung Galaxy J2 or equivalent
- **RAM:** 2GB
- **Android:** 5.0 (Lollipop)
- **Screen:** 4.5" (480x800)
- **Storage:** 8GB

### Test Matrix

| Device | Android | RAM | Screen | Status |
|--------|---------|-----|--------|--------|
| Samsung J2 | 5.0 | 2GB | 4.5" | ✓ |
| Tecno Spark | 7.0 | 2GB | 5.0" | ✓ |
| Infinix Hot | 10.0 | 3GB | 6.0" | ✓ |
| Generic | 12.0 | 4GB | 6.5" | ✓ |

**Performance Targets:**
- First Contentful Paint: <3s on 3G
- Time to Interactive: <5s on 3G
- Lighthouse Performance Score: >80
- App size: <10MB

## 3. Usability Testing with Farmers

### Participant Profile
- Age: 25-65 years
- Education: Primary to secondary
- Digital literacy: Low to medium
- Language: Kinyarwanda (primary)
- Farming experience: 5+ years

### Test Protocol

**Session Duration:** 30 minutes per farmer

**Tasks:**
1. Open app and navigate to home screen (2 min)
2. Find today's weather forecast for their sector (3 min)
3. Listen to weather forecast using audio button (2 min)
4. Navigate to pest alerts and identify maize stalk borer (5 min)
5. Check current market price for maize (3 min)
6. Find livestock health advisory (3 min)
7. Switch language from Kinyarwanda to English (2 min)
8. Use app offline (turn off data) (5 min)

**Success Metrics:**
- Task completion rate: >80%
- Time on task: Within 2x expected time
- Error rate: <20%
- Satisfaction score: >4/5

**Observation Points:**
- Do farmers understand icons without text?
- Can they find audio buttons easily?
- Do they notice offline indicator?
- Are touch targets large enough?
- Is text readable in sunlight?

### Interview Questions (Post-Test)

1. **Ease of Use:**
   - "Ni byoroshye gukoresha porogaramu?" (Is the app easy to use?)
   - "Ni iki cyagoye?" (What was difficult?)

2. **Content Relevance:**
   - "Amakuru yakugiriye akamaro?" (Was the information useful?)
   - "Ni ayahe makuru ukeneye?" (What information do you need?)

3. **Language:**
   - "Ikinyarwanda cyakoreshejwe kirasobanutse?" (Is the Kinyarwanda clear?)
   - "Hari amagambo atumvikana?" (Are there confusing words?)

4. **Audio Feature:**
   - "Ijwi ryumvikana neza?" (Is the audio clear?)
   - "Umuvuduko w'ijwi urakwiye?" (Is the speed appropriate?)

5. **Offline Usage:**
   - "Wakoresheje porogaramu nta interineti?" (Did you use it offline?)
   - "Byagenze bite?" (How did it work?)

## 4. Accessibility Testing

### Low Literacy Support

**Test Cases:**
- [ ] Can user navigate using only icons?
- [ ] Are audio buttons prominent and discoverable?
- [ ] Does audio play at appropriate speed (0.8x)?
- [ ] Can user complete tasks without reading text?

### Visual Accessibility

**Outdoor Visibility Test:**
- Test in direct sunlight (12pm-2pm)
- Verify contrast ratio: >4.5:1 for normal text
- Check icon visibility in bright conditions
- Test high contrast mode

**Touch Target Test:**
- Minimum size: 48x48px (3rem)
- Spacing between targets: 8px minimum
- Test with gloves (farmers wear gloves)
- Verify no accidental taps

### Audio Quality Test

**Environments:**
- Quiet indoor (baseline)
- Outdoor with wind
- Near livestock (noisy)
- In market (crowded)

**Metrics:**
- Intelligibility: >90% word recognition
- Volume: Adjustable, loud enough for outdoor
- Clarity: No distortion at max volume

## 5. Content Validation

### Kinyarwanda Translation Review

**Validators:**
- Agricultural extension officers (3)
- Veterinary officers (2)
- Cooperative leaders (2)
- Farmers (5)

**Review Checklist:**
- [ ] Technical terms accurate (pest names, diseases)
- [ ] Instructions clear and actionable
- [ ] Tone appropriate for target audience
- [ ] No offensive or confusing phrases
- [ ] Consistent terminology across sections

### Agricultural Accuracy

**Weather Forecasts:**
- Verify sector/cell names correct
- Check temperature ranges realistic
- Validate rainfall predictions

**Pest Alerts:**
- Confirm pest identification accurate
- Verify treatment recommendations safe
- Check affected crops list complete

**Market Prices:**
- Validate prices match actual markets
- Verify units correct (kg, liter)
- Check timestamps recent (<24 hours)

**Livestock Advisories:**
- Confirm veterinary recommendations
- Verify vaccination schedules
- Check disease symptoms accurate

## 6. Performance Testing

### Lighthouse Audit

```bash
npm run build
npm run preview

# Run Lighthouse in Chrome DevTools
# Target scores:
# - Performance: >80
# - Accessibility: >90
# - Best Practices: >90
# - SEO: >80
# - PWA: 100
```

### Bundle Size Analysis

```bash
npm run build

# Check dist folder size
# Target: <10MB total
# - JS: <500KB gzipped
# - CSS: <50KB gzipped
# - Images: <2MB total
```

### Load Time Testing

| Network | First Load | Cached Load | Offline Load |
|---------|------------|-------------|--------------|
| 4G | <2s | <1s | <1s |
| 3G | <5s | <2s | <1s |
| 2G | <10s | <3s | <1s |

## 7. Security Testing

### Data Privacy
- [ ] No personal data collected without consent
- [ ] Data stored locally (IndexedDB)
- [ ] No third-party tracking
- [ ] HTTPS enforced
- [ ] No sensitive data in logs

### Service Worker Security
- [ ] Service worker scope limited
- [ ] Cache versioning implemented
- [ ] No sensitive data cached
- [ ] Proper CORS headers

## 8. Field Testing Checklist

**Pre-Deployment (Pilot with 50 farmers):**
- [ ] Test in 5 different sectors of Nyagatare
- [ ] Include farmers with varying literacy levels
- [ ] Test during different times of day
- [ ] Verify offline usage patterns
- [ ] Collect feedback via interviews

**Metrics to Track:**
- Daily active users
- Session duration
- Feature usage (weather vs market vs pests)
- Audio playback frequency
- Offline usage percentage
- Error rates
- User retention (7-day, 30-day)

**Success Criteria:**
- 70% of farmers use app weekly
- 80% task completion rate
- <5% error rate
- >4/5 satisfaction score
- 50% use offline mode

## 9. Bug Reporting Template

```
Title: [Brief description]

Environment:
- Device: [Model]
- Android version: [X.X]
- Network: [2G/3G/4G/Offline]
- App version: [X.X.X]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshots:
[Attach if available]

Severity:
[ ] Critical (app crashes)
[ ] High (feature broken)
[ ] Medium (usability issue)
[ ] Low (cosmetic)
```

## 10. Continuous Testing

**Weekly:**
- Monitor crash reports
- Review user feedback
- Check API response times
- Validate data freshness

**Monthly:**
- Conduct user interviews (10 farmers)
- Update content based on feedback
- Performance regression testing
- Security audit

**Quarterly:**
- Full usability study (30 farmers)
- Device compatibility review
- Feature usage analysis
- Impact assessment
