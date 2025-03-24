
window.onload = function() {

    document.getElementById("main-title").addEventListener("click", () => {
        if (!_NO_SLIDESHOW) {
            self.location = "./index.html"
        } else {
            self.location = "../index.html"
        }
    })

    function sendContact(subject,message,email) {
        let form = document.createElement("form");
    
        form.method = "post";
        form.action = "";
    
        let keys = ["subject","message","email"];
        let valoo = [subject,  message,  email];
    
        keys.forEach((value,index) => {
            let formElement = document.createElement("input");
            formElement.name = value;
            formElement.type = "text";
            formElement.value = valoo[index];
    
            form.appendChild(formElement);
        })
    
        let formElement = document.createElement("input");
        formElement.name = "type";
        formElement.type = "text";
        formElement.value = "contact";
    
        form.appendChild(formElement);
    
        document.body.appendChild(form);
    
        let request = new XMLHttpRequest();

        if (!_NO_SLIDESHOW) {
            request.open("post","./send_request/index.php",true);
        } else {
            request.open("post","../send_request/index.php",true);
        }
        
    
        request.onload = () => {
            if (request.responseText.includes("success")) {
                self.location = "../confirmation/index.html?email=" + encodeURI(email) + "&message=success"; 
            } else {
                self.location = "../confirmation/index.html?message=failure&error=" + request.responseText; 
            }
        }
        request.onerror = (errorr) => {
            self.location = "../confirmation/index.html?message=failure&error=" + "SEND_ERROR";
            //console.log(errorr)
        }
    
        request.send(new FormData(form));
    
    }


    document.getElementById("contact-maria").addEventListener("submit",function(e) {
        e.preventDefault();

        let subject = document.getElementById("subject").value;
        let body = document.getElementById("body").value;
        let email = document.getElementById("email").value;

        if (subject != "" && subject != null && subject != undefined && body != "" && body != null && body != undefined && email != "" && email != null && email != undefined && email.includes("@")) {
            sendContact(document.getElementById("subject").value,document.getElementById("body").value,document.getElementById("email").value);
        } else {
            self.location = "../confirmation/index.html?message=failure&error=" + "FORM_INCOMPLETE";
        }

        return false;
    })


    shared_data.windowLoaded = true;
    var mobile_nav_open = false;
    document.getElementById("navBar").style.transition = "width 1s";
    document.getElementById("mobileBtn").onclick = function() {
        if (mobile_nav_open == false) {
            document.getElementById("navBar").style.display = "block";
            document.getElementById("navBar").style.pointerEvents = "initial";
            setTimeout(function() {
                var buttons_to_edit = Array(...document.getElementsByClassName("navBtn"));
                buttons_to_edit.forEach(function(value) {
                    //console.log(value)
                    //console.log(buttons_to_edit)
                    value.style.opacity = 1;
                })
                document.getElementById("navBar").style.width = "100%";
                document.getElementById("navBar").style.left = "0px";
            mobile_nav_open = true;
            },10);
        } else {
            var buttons_to_edit = Array(...document.getElementsByClassName("navBtn"));
            document.getElementById("navBar").style.pointerEvents = "none";
            buttons_to_edit.forEach(function(value) {
                value.style.opacity = 0;
            })
            document.getElementById("navBar").style.width = "0%";
            setTimeout(function() {
                document.getElementById("navBar").style.display = "none";

            },1000)
            mobile_nav_open = false;
        }
    }
    if (!_NO_SLIDESHOW) {
        //console.log("running")
        var imageArray = [];
        for (var i = 0; i <= 12; i++) {
            imageArray.push("s-image-" + i + ".jpg");
        }
        var slide = new slideshowManager(imageArray)
        slide.addImages().to("slideshow")

        function scroll_slideshow() {
            if ((Date.now() - slide.data.prevTime) >= 10) {
                slide.update();
                slide.data.prevTime = Date.now();
            }
            window.requestAnimationFrame(scroll_slideshow);
        }

        var numberLoadedImgs = 0;
        for (const img of imageArray) {
            document.getElementById(img).onload = function() {
                numberLoadedImgs++;
                if (numberLoadedImgs == imageArray.length) {
                    window.requestAnimationFrame(scroll_slideshow);
                }
            }
        }
    }
    //wipe.wipeForward();
    
}
