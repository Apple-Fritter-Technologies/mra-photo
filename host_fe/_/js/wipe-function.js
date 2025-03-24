function wait(seconds) {
    return {
        then: function(rf) {
            setTimeout(rf,seconds*1000);
        }
    }
}
var wipe = {
    wipeForward: function() {
        document.getElementById("wipe").style.left = window.innerWidth + "px";
        document.getElementById("wipe").style.width = "0px";
        wait(1).then(function() {
            document.getElementById("wipe").style.transition = "none";
            wait(0.1).then(function() {
                document.getElementById("wipe").style.left = "0px";
                wait(0.1).then(function() {
                    document.getElementById("wipe").style.transition = "left 0.5s, width 0.5s";
                })
            })
        })
        
    },
    wipeFill: function() {
        document.getElementById("wipe").style.left = "0px";
        document.getElementById("wipe").style.width = "100%";
    },
}
function relocate(urls) {
    //wipe.wipeFill()
    //wait(0.5).then(function() {
        self.location = urls;
    //})
}