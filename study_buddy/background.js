//the chrome extensions event handler: constantly listens for browser events
var webs = ["https://*.chrisdoan.com/*"];

chrome.storage.sync.set({'urls': webs}, function() {
    console.log('Value is set to ' + webs);
  });

  chrome.storage.onChanged.addListener(function() {
    chrome.storage.sync.get('urls', function(result) {
    var webs = result.urls
    chrome.webRequest.onBeforeRequest.addListener(function() {
      return {redirectUrl: chrome.runtime.getURL("blocked.html")};
      },
      {
      urls: webs,
      types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
      },
      ["blocking"]
  );
    });
});

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {urlContains: 'http'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });


