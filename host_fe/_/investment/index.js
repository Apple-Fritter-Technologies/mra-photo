/*var selected_panel = "family";
function switchPanelTo(panel) {
    if (selected_panel != panel) {
        document.getElementById(selected_panel + "-packages").style.display = "none";
        document.getElementById(panel + "-packages").style.display = "block";

        document.getElementById(selected_panel).classList.toggle("packages-SELECTED");
        document.getElementById(panel).classList.toggle("packages-SELECTED");

        selected_panel = panel;
    }
}*/

function select(package) {
    const urlstuff = window.location.search;
    let urlParams = new URLSearchParams(urlstuff);

    if (urlParams.has("choosepackage")) {
        window.opener.postMessage(package,"*");
        console.log("Sent Message!")
    } else {
        self.location = "../book-me/index.html?package=" + package;
    }
}
