<?php

    $emailManager = "maria@photographymra.com"; //edit for future email manager (like Maria's email)
    $secondaryEmailManager = "mariarembisz@gmail.com";
    

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
    if (!empty($_POST["type"])) {
        if ($_POST["type"] == "request") {
            if (!empty($_POST["fname"]) && !empty($_POST["lname"]) && !empty($_POST["email"]) && !empty($_POST["home"]) && !empty($_POST["phone"]) && !empty($_POST["package"]) && !empty($_POST["location"]) && !empty($_POST["date"])) {
                $first_name = $_POST["fname"];
                $last_name = $_POST["lname"];
                $email = $_POST["email"];
                $home_address = $_POST["home"];
                $phone_number = $_POST["phone"];
                $package = $_POST["package"];
                $location_idea = $_POST["location"];
                $date = $_POST["date"];

                $from       = "maria@photographymra.com";
                $subject    = "Package request from {$first_name} {$last_name}";
                $body       = "<h1>Request From {$first_name} {$last_name}</h1>
                               <p>Hello Maria,<br>{$first_name} submitted a request for the package <b>{$package}</b>.<br>Their phone number is {$phone_number}.<br>Their home address (for mailing) is {$home_address}. Their proposed location and date are:<br>{$location_idea}<br>{$date}<br><br>You can email them back at {$email}.</p>";

                mail($secondaryEmailManager,$subject,"Hey there. This is a copy of an email sent to your web email, maria@photographymra.com. I'd recommend replying to it and viewing it there." . $body,"From:" . $from . "\r\n" . "Content-Type: text/html; charset=UTF-8\r\n");

                if (mail($emailManager,$subject,$body,"From:" . $from . "\r\n" . "Content-Type: text/html; charset=UTF-8\r\n")) {
                    echo "success";
                } else {
                    echo "error:EMAIL_FAIL";
                };
            } else {
                echo "error:INCOMPLETE_FORM";
            }
        } elseif ($_POST["type"] == "contact") {
            if (!empty($_POST["subject"]) && !empty($_POST["message"]) && !empty($_POST["email"])) {
                $subject = $_POST["subject"];
                $message = $_POST["message"];
                $email = $_POST["email"];

                $from       = "maria@photographymra.com";
                $body       = "<h1>{$subject}</h1>
                               <p>Hello Maria,<br>This is a message {$email} sent you via the website.<br><br>{$message}</p><br<br>You can email them back at <b>{$email}</b>";
                
                mail($secondaryEmailManager,$subject,"Hey there. This is a copy of an email sent to your web email, maria@photographymra.com. I'd recommend replying to it and viewing it there." . $body,"From:" . $from . "\r\n" . "Content-Type: text/html; charset=UTF-8\r\n");

                if (mail($emailManager,$subject,$body,"From:" . $from . "\r\n" . "Content-Type: text/html; charset=UTF-8\r\n")) {
                    echo "success";
                } else {
                    echo "error:EMAIL_FAIL";
                };

            } else {
                echo "error:INCOMPLETE_FORM";
            }
        } else {
            echo "error:UNKNOWN_TYPE";
        }
    } else {
        echo "error:NO_TYPE_PROVIDED";
    }
    
?>