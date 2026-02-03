# Deep Link Debugging Guide

## 🔍 Understanding Deep Link Redirect Issues

This repository contains debugging tools and examples to help you understand why deep link redirects fail and how to implement them correctly.

## ❌ Why Your Current Code Fails

### The Problem

```html
<script>
  setTimeout(() => {
    window.location.replace("myapp://payment/success");
  }, 1000);
</script>
```

**This fails because:**

1. **Security Policy**: Modern browsers block automatic redirects to custom URI schemes unless triggered by a **direct user interaction** (click, tap)
2. **setTimeout is NOT user interaction**: Even though it's triggered after user action, the browser considers it "programmatic" and blocks it
3. **In-App Browsers**: Payment providers often use custom browsers (WebView) that have additional restrictions

## 📱 Platform-Specific Behavior

### Android Chrome
- ✅ Direct user clicks work reliably
- ❌ Auto-redirects blocked after ~1-2 seconds
- ✅ Android Intent URLs are more reliable: `intent://path#Intent;scheme=myapp;package=com.app;end`

### iOS Safari
- ✅ Direct user taps work reliably
- ❌ Very strict - even programmatic clicks from setTimeout may fail
- ❌ Auto-redirects almost always blocked
- ⚠️ Universal Links require proper server configuration

### In-App Browsers (WebView/Expo)
- Behavior varies by implementation
- Some payment providers intercept and handle redirects specially
- May require different approaches than standard browsers

## ✅ Best Practices

### 1. Always Use Direct User Interaction

```javascript
// ✅ GOOD: Direct click handler
<button onclick="openApp()">Return to App</button>

function openApp() {
  window.location.href = "myapp://payment/success";
}

// ❌ BAD: Auto-redirect (blocked by browsers)
setTimeout(() => {
  window.location.replace("myapp://payment/success");
}, 1000);
```

### Important: Expo Go Testing

If you're testing with **Expo Go** on iOS:
- Expo Go uses `exp://` scheme, not `myapp://`
- Use: `exp://localhost:8081/--/payment/success`
- WebView in Expo Go may have additional restrictions
- See `expo-go-deeplink-guide.md` for details

### 2. Provide Clear UI

- Show a prominent button immediately
- Don't rely on auto-redirects
- Make it obvious what the user should do

### 3. Implement Fallback

```javascript
function openAppWithFallback() {
  const deepLink = "myapp://payment/success";
  window.location.href = deepLink;
  
  // If app doesn't open, redirect to app store
  setTimeout(() => {
    if (document.visibilityState === 'visible') {
      // App didn't open, redirect to store
      window.location.href = "https://apps.apple.com/app/your-app";
    }
  }, 2000);
}
```

### 4. Use Platform-Specific URLs

**Android Intent URL (More Reliable):**
```
intent://payment/success#Intent;scheme=myapp;package=com.yourapp.package;end
```

**iOS Universal Links (Requires server setup):**
```
https://yourdomain.com/payment/success
```

**Custom URI Scheme (Works on both, but less reliable):**
```
myapp://payment/success
```

### 5. Detect App Installation

```javascript
// Detect if app opened by checking page visibility
let appOpened = false;

window.addEventListener('blur', () => {
  appOpened = true; // User switched apps
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    appOpened = true; // Page hidden, app likely opened
  }
});

// Fallback after timeout
setTimeout(() => {
  if (!appOpened) {
    // Redirect to app store
  }
}, 2000);
```

## 🧪 Testing Tools

### `debug-deeplink.html`
A comprehensive debugging page that:
- Detects your browser/platform
- Tests multiple redirect methods
- Explains why each method works or fails
- Shows recommended solutions

### `payment-return.html`
A production-ready payment return page with:
- Clean UI
- Direct user interaction
- Fallback to app store
- Platform detection

## 🔧 Implementation Checklist

- [ ] Use direct user interaction (button click)
- [ ] Provide clear, visible button
- [ ] Implement fallback for missing app
- [ ] Test on Android Chrome
- [ ] Test on iOS Safari
- [ ] Test in payment provider's in-app browser
- [ ] Handle both custom URI schemes and Universal Links
- [ ] Add analytics to track success/failure rates

## 🚨 Common Mistakes

1. **Auto-redirect without user interaction** - Blocked by browsers
2. **Using setTimeout for redirect** - Not considered user interaction
3. **No fallback** - Users stuck if app not installed
4. **Hidden redirects** - Users don't know what's happening
5. **Not testing in real payment flows** - In-app browsers behave differently

## 📚 Additional Resources

- [Android App Links](https://developer.android.com/training/app-links)
- [iOS Universal Links](https://developer.apple.com/ios/universal-links/)
- [Custom URL Schemes](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app)

## 🎯 Quick Start

1. Open `debug-deeplink.html` in your browser to understand the issues
2. Use `payment-return.html` as a template for your payment return page
3. Update the deep link URLs and app store links
4. Test on real devices in different browsers
5. Implement fallback mechanisms

## 💡 Key Takeaways

1. **User interaction is required** - Browsers block automatic redirects
2. **Show a button** - Don't rely on auto-redirects
3. **Test thoroughly** - Different browsers/platforms behave differently
4. **Provide fallback** - Handle cases where app isn't installed
5. **Use platform-specific URLs** - Android Intent URLs are more reliable

