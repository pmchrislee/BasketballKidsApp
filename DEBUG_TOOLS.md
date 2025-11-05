# Debug Tools - Basketball Kids App

## Browser Console Commands

When running the app in a web browser, powerful debug tools are automatically available in your browser console.

### Opening Browser Console

- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
- **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
- **Safari**: Enable Developer menu first, then `Cmd+Option+C`

---

## Available Commands

### 1. View Current State

```javascript
debugApp.viewState()
```

**What it does:**
- Shows all saved app data
- Displays points, bets, cart, raffle entries
- Returns the state object

**Example output:**
```javascript
📦 Current saved state: {
  userPoints: 1000,
  userBets: [
    {
      id: 1234567890,
      game: "Warriors vs Lakers",
      bet: "Lakers Win",
      amount: 50,
      status: "active"
    }
  ],
  raffleEntries: 2,
  cart: [],
  completedBets: []
}
```

**When to use:**
- Check if bets are actually saving
- Verify point balance
- Debug missing data issues

---

### 2. Clear All Data

```javascript
debugApp.clearState()
```

**What it does:**
- Deletes all saved data
- Resets app to fresh state
- Requires page refresh to take effect

**Example output:**
```
🗑️ State cleared. Refresh the page to start fresh.
```

**When to use:**
- Start over with clean slate
- Fix corrupted data
- Test first-time user experience
- Remove test data

**⚠️ Warning:** This permanently deletes all your bets, points, and progress!

---

### 3. Reset Points

```javascript
debugApp.resetPoints(5000)
```

**What it does:**
- Sets your point balance to any value
- Keeps all other data intact
- Requires page refresh

**Example usage:**
```javascript
debugApp.resetPoints(10000)  // Give yourself 10,000 points
debugApp.resetPoints(50)     // Test low balance scenarios
debugApp.resetPoints(1000)   // Reset to default
```

**When to use:**
- Test betting with different balances
- Test "insufficient points" errors
- Give yourself more points for testing

---

### 4. View Storage Keys

```javascript
debugApp.viewAllKeys()
```

**What it does:**
- Lists all AsyncStorage keys
- Shows what data is stored
- Useful for debugging storage issues

**Example output:**
```javascript
🔑 All storage keys: ["appState"]
```

**When to use:**
- Verify storage is working
- Check for multiple/duplicate keys
- Debug storage issues

---

### 5. Export State

```javascript
debugApp.exportState()
```

**What it does:**
- Exports entire state as formatted JSON
- Prints to console for copying
- Useful for backups or sharing bug reports

**Example output:**
```javascript
📤 Exported state (copy this):
{
  "userPoints": 1000,
  "userBets": [...],
  "raffleEntries": 2,
  ...
}
```

**When to use:**
- Create backup before testing
- Share state for bug reports
- Document specific scenarios
- Transfer state between browsers

---

## Common Debugging Scenarios

### Scenario 1: "My bet disappeared!"

```javascript
// 1. Check if bet is in saved state
debugApp.viewState()

// Look for your bet in the userBets array
// If it's not there, the bet didn't save

// 2. Check browser console for errors
// Look for lines like:
//   📝 Placing bet: {...}
//   ✅ Bet placed successfully
//   💾 State saved successfully

// 3. If bet is there but not showing:
//   - Refresh the page
//   - Check you're on "Active" tab (not "Completed")
//   - Try clearing state and starting over
```

### Scenario 2: "Raffle entry not working"

```javascript
// 1. Check current raffle entries
debugApp.viewState()
// Look at raffleEntries value

// 2. Check requirements:
//   - Need 500+ points
//   - Max 5 entries
//   - Can't enter if expired

// 3. Check console for logs:
//   🎫 Adding raffle entry
//   ✅ Raffle entry added

// 4. If stuck, reset:
debugApp.clearState()
// Then refresh page
```

### Scenario 3: "Points not saving"

```javascript
// 1. Place a bet
// 2. Immediately check state
debugApp.viewState()
// Points should be reduced

// 3. Refresh page
// 4. Check state again
debugApp.viewState()
// Points should still be reduced

// If points reset to 1000:
// - Check console for save errors
// - Try different browser
// - Check if cookies/storage enabled
```

### Scenario 4: "I want to test with lots of points"

```javascript
// Give yourself 100,000 points
debugApp.resetPoints(100000)

// Refresh page
location.reload()

// Now you can bet freely without running out
```

### Scenario 5: "Need to start completely fresh"

```javascript
// Nuclear option - wipe everything
debugApp.clearState()
location.reload()

// You'll start with:
// - 1000 points
// - No bets
// - No cart items
// - No raffle entries
// - No shipping info
```

---

## Understanding Console Logs

### Betting Flow Logs

When you place a bet, you should see:

```
📝 Placing bet: {game: "Warriors vs Lakers", amount: 50, ...}
📊 Current state before bet: {userPoints: 1000, activeBets: 0}
✅ Bet placed successfully
💾 State saved successfully: {userPoints: 950, userBets: [...]}
```

**What each means:**
- 📝 Bet object being created
- 📊 Snapshot of state before changes
- ✅ Bet successfully added to state
- 💾 State persisted to storage

**Red flags:**
- ❌ Error messages in red
- Missing ✅ or 💾 logs
- "undefined" or "null" in logs

---

### Raffle Flow Logs

When entering raffle:

```
🎫 Adding raffle entry
📊 Current raffle entries: 1
✅ Raffle entry added
💾 State saved successfully
```

---

### App Startup Logs

When page loads:

```
🔄 Loading state from storage...
✅ Loaded saved state: {userPoints: 950, userBets: [1], ...}
```

Or if first time:

```
🔄 Loading state from storage...
ℹ️ No saved state found, using defaults
```

---

## Advanced: Manual State Import

If you have a backup JSON and want to restore it:

```javascript
// 1. Copy your backup state object
const myBackup = {
  userPoints: 5000,
  userBets: [],
  raffleEntries: 0,
  cart: [],
  shippingInfo: {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
  },
  completedBets: []
};

// 2. Import AsyncStorage
import('@react-native-async-storage/async-storage').then(module => {
  const AsyncStorage = module.default;

  // 3. Save your backup
  AsyncStorage.setItem('appState', JSON.stringify(myBackup))
    .then(() => {
      console.log('✅ State restored! Refresh the page.');
    });
});

// 4. Refresh page
location.reload();
```

---

## Tips & Best Practices

### Before Major Testing

```javascript
// Create a backup
const backup = await debugApp.exportState();
// Copy the output JSON somewhere safe
```

### Testing Error States

```javascript
// Test with low points
debugApp.resetPoints(10);
location.reload();
// Now try to place 50-point bet - should see error

// Test with no points
debugApp.resetPoints(0);
location.reload();
// Everything should be disabled
```

### Simulating Long-Time User

```javascript
// Get current state
debugApp.viewState();

// Manually edit in console:
import('@react-native-async-storage/async-storage').then(module => {
  const AsyncStorage = module.default;
  AsyncStorage.getItem('appState').then(state => {
    const data = JSON.parse(state);

    // Add lots of completed bets
    data.completedBets = [
      /* ... many bet objects ... */
    ];

    // High points
    data.userPoints = 50000;

    // Multiple raffle entries
    data.raffleEntries = 5;

    AsyncStorage.setItem('appState', JSON.stringify(data));
    location.reload();
  });
});
```

---

## Platform Differences

### Web Browser
- ✅ All debug tools work
- Uses localStorage under the hood
- Persists between sessions
- Cleared when clearing browser data

### iOS Simulator
- ⚠️ Debug tools available but harder to access
- Need to use Safari Web Inspector
- Connect to simulator from Safari > Develop menu

### Android Emulator
- ⚠️ Debug tools available via Chrome DevTools
- Need to enable remote debugging
- chrome://inspect in Chrome

### Physical Device (Expo Go)
- ❌ Browser console not easily accessible
- Use React Native Debugger instead
- Or use Expo dev menu → Debug Remote JS

---

## Troubleshooting the Debug Tools

### "debugApp is not defined"

**Problem:** Debug tools didn't load

**Solution:**
```javascript
// Manually import
import('./utils/debugHelper').then(module => {
  window.debugApp = module.debugUtils;
  console.log('Debug tools loaded!');
});
```

### "AsyncStorage is not defined"

**Problem:** Running outside React Native environment

**Solution:**
- Only works in app context
- Make sure app is running
- Try in Expo web version

---

## Quick Reference Card

```javascript
// View everything
debugApp.viewState()

// Start fresh
debugApp.clearState()
location.reload()

// Get rich
debugApp.resetPoints(999999)
location.reload()

// Backup
const backup = await debugApp.exportState()

// See storage
debugApp.viewAllKeys()
```

Print this and keep by your desk! 📋
