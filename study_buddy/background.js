//the chrome extensions event handler: constantly listens for browser events
let date = Date.now();
let countdownMaxInMin = 0.1;
let countdownMaxInSec = countdownMaxInMin * 60;
let countdownMaxInMS = countdownMaxInSec * 1000;

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({})],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});

chrome.storage.local.set({
  date: date,
  isPaused: false,
  countdownMaxInMin: countdownMaxInMin
});

clearAndCreateAlarm(countdownMaxInMin,countdownMaxInMin);


var webs = ["https://*.reddit.com/*"];

chrome.storage.sync.set({'urls': webs}, function() {
    console.log('Value is set to ' + webs);
  });


    chrome.storage.onChanged.addListener(function() {
      chrome.storage.sync.get(['urls', 'enable'], function(result) {
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

// Add a listener for when the alarm is up.
// When the alarm is up, create a window with timer.html.
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == 'eyeRestAlarm' + date) {
    let nextAlarmTime = alarm.scheduledTime + countdownMaxInMS;
    chrome.storage.local.set({nextAlarmTime: nextAlarmTime});
    chrome.windows.create({
      type: 'popup',
      url: 'break.html',
      left: 5,
      top: 100,
      focused: true
    });
  } else {
    chrome.alarms.getAll(function(data) {
      data.forEach(function(alarm) {
        if (alarm.name != 'eyeRestAlarm' + date) {
          chrome.alarms.clear(alarm.name);
        }
      });
    });
  }
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


