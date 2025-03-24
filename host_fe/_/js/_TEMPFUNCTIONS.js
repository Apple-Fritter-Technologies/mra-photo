var colors = [["rgb(217, 201, 186)","rgb(180, 158, 139)"],["rgb(217, 208, 203)","rgb(188, 166, 154)"],["rgb(243, 216, 216)","rgb(205, 172, 172)"],["rgb(233, 225, 214)","rgb(210, 196, 178)"]];
var traverser = 1;

function TEMP_changebackground() {
    /*var footerSections = document.getElementsByClassName("footer-section");
    for (var i = 0; i < footerSections.length; i++) {
        footerSections[i].style.backgroundColor = colors[traverser][0];
    }
    document.getElementById("first-micro-footer").style.backgroundColor = colors[traverser][1];
    document.getElementById("footer").style.backgroundColor = colors[traverser][0];
    document.getElementById("about-me-text").innerHTML = "Maria is a natural light, lifestyle photographer in the Metro Detroit area. STYLE: " + traverser;
    if (traverser == (colors.length - 1)) {
        traverser = 0;
    } else {
        traverser++;
    }*/
    var color = document.getElementById("TEMP_COLOR_PICKER").value;
    document.getElementById("footer").style.backgroundColor = color;
    var footerSections = document.getElementsByClassName("footer-section");
    for (var i = 0; i < footerSections.length; i++) {
        footerSections[i].style.backgroundColor = color;
    }
    
}