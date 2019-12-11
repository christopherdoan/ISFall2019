//the chrome extensions event handler: constantly listens for browser events

//-----------------------SETUP AND INITIALIZE VARIABLES ----------------------------------------------------

//initialize variables for the countdown timer in the popup
let date = Date.now();
let countdownMaxInMin = 60;
let countdownMaxInSec = countdownMaxInMin * 60;
let countdownMaxInMS = countdownMaxInSec * 1000;
let wait;

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({})],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});

// in chrome.storage.local set some variables for timer
chrome.storage.local.set({
  date: date,
  isPaused: false,
  countdownMaxInMin: countdownMaxInMin,
  reset: false,
  next: 0
});


// list to hold blocked websites
var webs = ["https://*.'chrisdoan/*"];

// set urls in chrome storage to the above list
chrome.storage.sync.set({'urls': webs}, function() {});

chrome.storage.onChanged.addListener(function() {
  chrome.storage.sync.get(['urls', 'enable'], function(result) {
    var webs = result.urls;
    webs = result.urls;
    chrome.webRequest.onBeforeRequest.addListener(function() {
      console.log('this is an instance of the blocker')
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

  clearAndCreateAlarm(countdownMaxInMin,countdownMaxInMin);

//----------------------- LISTENER TO DETECT POPUP TIMER EXPIRING  ----------------------------------------------------


// Add a listener for when the alarm is up. When the alarm is up, create a window with break.html.
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == 'eyeRestAlarm' + date) {
    let nextAlarmTime = alarm.scheduledTime + countdownMaxInMS;
    chrome.storage.local.set({'next': nextAlarmTime});
    chrome.storage.local.set({'reset': true});
    clearAlarm();
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

//-----------------------THIS ALLOWS EXTENSION TO ACT/BE ACTIVE ON ANY PAGE  ----------------------------------------------------

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {urlContains: 'http'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });


