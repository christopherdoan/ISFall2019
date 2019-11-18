function message(val){
    $(".message").text(val);
  }
  
    //handle update
    $("#urlbutton").click(function(){
        chrome.storage.sync.get('urls', function(result) { 
            var update = result.urls;
            update = update.concat('https://*.'+ $("#urlinput").val()+'.com/*' )  
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