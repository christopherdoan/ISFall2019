
let secToMin = function(timeInSec) {
    let sec = timeInSec%60;
    let min = (timeInSec-sec)/60;
    if (sec < 10) {
      sec = '0' + sec;
    }
    return min + ':' + sec;
  }

let timerElement = document.getElementById('timer');
let time = 10;

function removeWindow(win) {
  targetWindow = win;
  chrome.windows.remove(targetWindow.id);
}

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