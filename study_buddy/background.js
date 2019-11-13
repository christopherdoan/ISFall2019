//the chrome extensions event handler: constantly listens for browser events
  chrome.webRequest.onBeforeRequest.addListener(
    function() {
        return {cancel: true,};
    },
    {
        urls: ["https://*.twitter.com/*",]
    },
    ["blocking"]
);