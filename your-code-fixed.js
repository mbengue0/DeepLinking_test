// ✅ COPY-PASTE THIS - Fixed version of your exact code
// This removes the auto-redirect and fixes the button to work properly

// Your function that returns the HTML response
function yourPaymentHandler(status, redirectDetails) {
  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Payment Status</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <style>
      body { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
          text-align: center; 
          padding: 0; 
          margin: 0;
          background-color: #132439; 
          color: white; 
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
      }
      .content { 
          max-width: 360px; 
          margin: 20px; 
          background: #1e3a5f; 
          padding: 40px 30px; 
          border-radius: 24px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.4); 
      }
      h1 { margin: 0 0 15px; font-size: 24px; font-weight: 700; color: #fff; }
      p { margin: 0 0 30px; line-height: 1.6; color: #94a3b8; font-size: 16px; }
      .btn { 
          display: block; 
          width: 100%;
          box-sizing: border-box;
          background-color: #fca311; 
          color: #132439; 
          padding: 18px; 
          text-decoration: none; 
          border-radius: 16px; 
          font-weight: 800; 
          font-size: 18px; 
          transition: transform 0.1s, opacity 0.2s; 
          box-shadow: 0 4px 12px rgba(252, 163, 17, 0.3);
          border: none;
          cursor: pointer;
      }
      .btn:active { transform: scale(0.98); opacity: 0.9; }
      .icon { font-size: 64px; margin-bottom: 24px; display: block; }
    </style>
  </head>
  <body>
    <div class="content">
      <span class="icon">${status === 'success' ? '🎉' : (status === 'cancelled' ? '🛑' : '⚠️')}</span>
      <h1>${status === 'success' ? 'Payment Confirmed!' : (status === 'cancelled' ? 'Payment Cancelled' : 'Payment Issue')}</h1>
      <p>${status === 'success' ? 'Your wallet balance has been updated.' : 'You can return to the app safe and sound.'}</p>
      
      <!-- ✅ CHANGED: Use button with onclick instead of <a> tag -->
      <button onclick="returnToApp()" class="btn">Return to App</button>
    </div>
    <script>
      // ✅ FIXED: Direct user interaction - this works!
      function returnToApp() {
        const deepLink = "${redirectDetails}";
        
        // Direct assignment works when triggered by user click
        window.location.href = deepLink;
        
        // Optional: Detect if app opened (for Expo Go / WebView)
        let appOpened = false;
        
        document.addEventListener('visibilitychange', function() {
          if (document.hidden) appOpened = true;
        });
        
        window.addEventListener('blur', function() {
          appOpened = true;
        });
        
        // Fallback after 2 seconds if app didn't open
        setTimeout(function() {
          if (!appOpened && document.visibilityState === 'visible') {
            console.log('App may not have opened');
            // You could show a message or redirect to app store here
          }
        }, 2000);
      }
      
      // ❌ REMOVED: This doesn't work - browsers block it
      // setTimeout(() => {
      //   window.location.replace("${redirectDetails}");
      // }, 1000);
    </script>
  </body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

// ⚠️ IMPORTANT FOR EXPO GO:
// If testing with Expo Go, your redirectDetails should be:
// "exp://localhost:8081/--/payment/success"
// NOT "myapp://payment/success"

