
//Helper to convert secs to min
let secToMin = function(timeInSec) {
    let sec = timeInSec%60;
    let min = (timeInSec-sec)/60;
    if (sec < 10) {
      sec = '0' + sec;
    }
    return min + ':' + sec;
  }

// Set timer var to 15 minutes
let timerElement = document.getElementById('timer');
let time = 900;

//Helper to remove window
function removeWindow(win) {
  targetWindow = win;
  chrome.windows.remove(targetWindow.id);
}


//Function to countdown from 15 minutes
let setTime = function() {
  timerElement.innerHTML = secToMin(time) + ' minutes of your break left';
  if (time === 0) {
    chrome.windows.getCurrent(removeWindow);
  }
  time--;
}

setTime();
let timerFunc = setInterval(setTime, 1000);

$(document).ready(function(){
    $('body').on('click', 'a', function(){
      chrome.tabs.create({url: $(this).attr('href')});
      return false;
    });
 });