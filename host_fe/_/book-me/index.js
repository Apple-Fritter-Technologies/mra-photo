//let's work

window.addEventListener("load", function() {
    document.getElementById("submit").addEventListener("click",function(e) {
        e.preventDefault;
    
    
        let email = document.getElementById("u-email").value;
        let first = document.getElementById("first_name").value;
        let last = document.getElementById("last_name").value;
        let home = document.getElementById("address").value;
        let phone = document.getElementById("phone").value;
        let pack = document.getElementById("package").value;
        let location = document.getElementById("location").value;
        let date = document.getElementById("date").value;
    
        //if (subject != "" && subject != null && subject != undefined && body != "" && body != null && body != undefined && email != "" && email != null && email != undefined && email.includes("@")) {
            sendRequest(first,last,email,home,phone,pack,location,date);
        //} else {
        //    alert("issue");
    //}
    
        
    })
    document.getElementById("package").addEventListener("click", function() {
        let pick_package_window = window.open("../investment/index.html?choosepackage=true","_blank");

        window.addEventListener("message", function(m) {
            let message = m.data;

            document.getElementById("package").value = message;
            populate(message);

            console.log(message);

            pick_package_window.close();

            console.log("Received message!")
        })
    })

    const urlstuff = window.location.search;
    let urlParams = new URLSearchParams(urlstuff);

    if (urlParams.has("package")) {
        document.getElementById("package").value = urlParams.get("package");
        populate(urlParams.get("package"));
    } else {
    }
})

function populate(package) {
    let chosenPackage = findPackageWithName(package);

    document.getElementById("package-information-container").value = "$" + chosenPackage.cost + " | " + chosenPackage.duration + " " + chosenPackage.durationType.toLowerCase() + " | " + chosenPackage.explanation;
}


/*
    
                FIELDS

        email_type      type            The type of email. `contact` for contact, `request` for request.
        first_name      fname
        last_name       lname
        email           email
        home_address    home
        phone_number    phone
        package_name    package
        location_idea   location
        proposed_date   date

        subject         subject
        message         message
        email           email



*/


function sendRequest(first_name,last_name,email,home_address,phone_number,package_name,location_idea,proposed_date) {
    let form = document.createElement("form");

    form.method = "post";
    form.action = "";
    form.style.display = "none";

    let keys = ["fname","lname","email","home","phone","package","location","date"];
    let valoo = [first_name,last_name,email,home_address,phone_number,package_name,location_idea,proposed_date];

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
    formElement.value = "request";

    form.appendChild(formElement);

    document.body.appendChild(form);

    let request = new XMLHttpRequest();

   
    request.open("post","../send_request/index.php",true);
    

    request.onload = () => {
        if (request.responseText.includes("success")) {
            self.location = "../confirmation/index.html?first=" + first_name + "&last=" + last_name + "&message=success"; 
        } else {
            self.location = "../confirmation/index.html?first=" + first_name + "&last=" + last_name + "&message=failure&error=" + request.responseText; 
        }
    }
    request.onerror = (errorr) => {
        self.location = "../confirmation/index.html?first=" + first_name + "&last=" + last_name + "&message=failure&error=" + errorr;
    }

    request.send(new FormData(form));

}


