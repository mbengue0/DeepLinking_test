# Expo Go Deep Link Testing Guide

## 🚨 Important: Expo Go Limitations

When testing with **Expo Go** on iOS, there are specific considerations:

### 1. Deep Link Scheme in Expo Go

Expo Go uses a different deep link scheme than your production app:
- **Expo Go**: `exp://` or `expo://`
- **Your App**: `myapp://`

### 2. Testing Deep Links in Expo Go

For Expo Go, you need to use:
```
exp://localhost:8081/--/payment/success
```

Or if using Expo's deep linking:
```
exp://192.168.x.x:8081/--/payment/success
```

### 3. WebView Behavior in Expo Go

Expo Go uses a WebView (via `expo-web-browser` or similar). WebViews have stricter security:
- ✅ Direct user clicks work
- ❌ Auto-redirects are blocked
- ⚠️ Some WebView implementations handle deep links differently

## 🔧 Solution for Your Code

### Option 1: Use Button Click (Recommended)

```javascript
// ✅ This works in Expo Go WebView
<button onclick="returnToApp()">Return to App</button>

function returnToApp() {
  window.location.href = "exp://localhost:8081/--/payment/success";
}
```

### Option 2: Use Expo Linking API (Better for Expo)

Instead of returning HTML, handle the redirect in your Expo app:

```javascript
// In your Expo app
import * as Linking from 'expo-linking';

// Listen for deep links
Linking.addEventListener('url', handleDeepLink);

// Or get initial URL
const url = await Linking.getInitialURL();
```

### Option 3: Use expo-web-browser

```javascript
import * as WebBrowser from 'expo-web-browser';

// Open URL in browser, then handle return
const result = await WebBrowser.openBrowserAsync('https://payment-provider.com');
// Handle result and redirect back
```

## 🧪 Testing Checklist

- [ ] Test button click in Expo Go WebView
- [ ] Verify deep link scheme matches Expo Go format
- [ ] Test on real device (not just simulator)
- [ ] Check if WebView allows deep links (some block them)
- [ ] Test fallback behavior if app doesn't open

## ⚠️ Common Issues

1. **Wrong Scheme**: Using `myapp://` instead of `exp://` in Expo Go
2. **WebView Blocking**: Some WebViews block all custom schemes
3. **Auto-redirect Blocked**: Even in WebView, setTimeout redirects fail
4. **Path Format**: Expo Go requires `--/` in the path

## 💡 Production vs Development

- **Development (Expo Go)**: Use `exp://` scheme
- **Production**: Use your custom `myapp://` scheme
- Consider environment-based configuration:

```javascript
const isExpoGo = __DEV__ && Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
const deepLinkScheme = isExpoGo 
  ? 'exp://localhost:8081/--' 
  : 'myapp://';
```

