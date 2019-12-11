//-----------------------JS FOR COLLAPSIBLE MENU IN POPUP  ----------------------------------------------------

// Get our content id = collapsible
var coll = document.getElementsByClassName("collapsible");
var i;

//collapses the content when button clicked
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

//-----------------------TIMER POPUP FUNCTIONS AND VARS  ----------------------------------------------------

//Initialize vars and get counter and switch for button
let date = Date.now();
let counterElement = document.getElementById('counter');
let switchButton = document.getElementById('switch');
let switchClasses = switchButton.classList;
let countdownInterval;
let count;

//Helper function to convert sec to min to get 185 seconds to 3:05 minutes etc
let secToMin = function(timeInSec) {
  let sec = timeInSec%60;
  let min = (timeInSec-sec)/60;
  if (sec < 10) {
    sec = '0' + sec;
  }
  return min + ':' + sec;
}

// This will get the next alarm time from storage, calculate that time minus the current time, convert to seconds, then set the popup to that time.
let updateCountdown = function() {
  chrome.storage.local.get('nextAlarmTime', function(data) {
    // This sort of prevents the race condition by choosing between
    // 0 and the actual count. We basically want to prevent the popup
    // from ever displaying a negative number.
    count = Math.max(0, Math.ceil((data.nextAlarmTime - Date.now())/1000));
    counterElement.innerHTML = secToMin(count);
  });
};


// Check if isPaused. If not, call the update countdown function immediately then update the countdown every 0.1s
chrome.storage.local.get(['isPaused', 'next', 'reset','countdownMaxInMin'], function(data) {
    if(data.reset){
      chrome.storage.local.set({nextAlarmTime: data.next});
      chrome.storage.local.set({reset: false});
      clearAndCreateAlarm(0.1, data.countdownMaxInMin);
      
    }
  if (!data.isPaused) {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 100);
    isNotPausedDisplay();
  } else {
    chrome.storage.local.get('pausedCount', function(data) {
      counterElement.innerHTML = secToMin(data.pausedCount);
    });
    isPausedDisplay();
  }
});

//-----------------------TIMER BUTTON POPUP FUNCTIONS AND VARS  ----------------------------------------------------

// helper to switch button text
let isNotPausedDisplay = function() {
  switchClasses.add('is-not-paused');
  switchClasses.remove('is-paused');
  switchButton.innerHTML = 'Stop';
};

// helper to switch button text
let isPausedDisplay = function() {
  switchClasses.add('is-paused');
  switchClasses.remove('is-not-paused');
  switchButton.innerHTML = 'Start';
};

// If the switch is set on, continue counting down. If the switch is set to off, clear the existing alarm.
switchButton.onclick = function() {
  if (!switchClasses.contains('is-not-paused')) {
    // If isPaused = false, create the new alarm here.
    isNotPausedDisplay();
    chrome.storage.local.set({ isPaused: false });
    chrome.storage.local.get(['pausedCount','countdownMaxInMin'], function(data) {
      clearAndCreateAlarm(data.pausedCount/60, data.countdownMaxInMin);
    });
    countdownInterval = setInterval(updateCountdown, 100);
  } else {
    // If isPaused = true, store the existing count to pass back to background.js, clear the existing alarm by using the date in storage.
    isPausedDisplay();
    chrome.storage.local.set({
      isPaused: true,
      pausedCount: count
    });
    clearInterval(countdownInterval);
    clearAlarm();
  }
}

//----------------------- ADD WEBSITE TO BLOCK FORM JS  ----------------------------------------------------
  
    //handle update
    $("#urlbutton").click(function(){
        chrome.storage.sync.get('urls', function(result) { 
            var update = result.urls;
            update = update.concat('https://*.'+ $("#urlinput").val()+'/*' ) 
            console.log(update[update.length-1])
            chrome.storage.sync.set({'urls': update}, function() {
                // Notify that we saved.
                console.log("update!")
          });
        }); 
    });
  
    //allow update when enter is pressed
    $('input').keypress(function (e) {
      if (e.which == 13) {
        $(".urlbutton").click();
        return false;
      }
    });

    // ------------------------------ NOT SURE IF NECESSARY BUT ALLOWS EXTENSION TO TAKE ACTION/BE ACTIVE ON ANY WEBSITE ----------------------------
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {urlContains: 'http'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });