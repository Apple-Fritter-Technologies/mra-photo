const ELEM_CLASSNAMES = "fade";
const RIGHT_IDENTIFIER = "right_fade";
const LEFT_IDENTIFIER = "right_fade";
var _initiated = false;
document.onscroll = fadeElements;
function initiate() {
    if (shared_data.windowLoaded == true) {
        const elems = document.getElementsByClassName("fade");
        //console.log(elems.length)
        for (var i=0; i < elems.length; i++) {
            //console.log("initiating #" + elems[i].id);
            var elem = elems[i];
            var rect = elem.getBoundingClientRect();
            //console.log(rect);
            if (rect.top <= (window.innerHeight - 50)) {
                elem.style.opacity = 1;
                if (window.innerWidth >= 1000) {
                    if (elem.classList.contains(RIGHT_IDENTIFIER)) {
                        elem.style.right = "0px";
                    } else {
                        elem.style.left = "0px";
                    }
                    //console.log("SHOWING ELEMENT #" + elem.id);
                } else {
                    elem.style.bottom = "0px";
                }
            } else {
                elem.style.opacity = 0;
                if (window.innerWidth >= 1000) {
                    if (elem.classList.contains(RIGHT_IDENTIFIER)) {
                        elem.style.left = "-30px";
                    } else {
                        elem.style.left = "30px";
                    }
                    //console.log("HIDING ELEMENT #" + elem.id);
                } else {
                    elem.style.bottom = "-50px";
                }

            }
        }
        _initiated = true;
        document.body.onscroll = fadeElements;
    } else {
        setTimeout(initiate,100);
    }
}
function fadeElements(e) {
    if (_initiated = true) {
        const elems = document.getElementsByClassName("fade");
        //console.log("fadeElements() ran")
        for (var i=0; i < elems.length; i++) {
            var elem = elems[i];
            var rect = elem.getBoundingClientRect();
            if (rect.top <= (window.innerHeight - 100)) {
                elem.style.left = "0px";
                elem.style.bottom = "0px";
                elem.style.opacity = 1;
                //console.log("FADING #" + elem.id);
            }
        }
    }
    if (document.getElementById("section-title-holder")) {
        //console.log("e is", e)
        document.getElementById("section-title-holder").style.backgroundPosition = "0px " + document.getElementById("main-area").scrollTop*0.5 + "px";
    }
}
initiate();