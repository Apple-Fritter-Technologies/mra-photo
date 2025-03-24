window.addEventListener("load", () => {
    function appendImage(container, original) {
        let newImage = document.createElement("img");

        newImage.src = "../images/images-fullsize/portfolio-" + Math.floor(Math.random()*94+1) + ".jpg";
        newImage.classList.add("portfolio-image");
        newImage.style.opacity = 0;

        container.append(newImage);
        container.append(original);

        setTimeout(() => newImage.style.opacity = 1, 100);
    }
    if (window.innerWidth < 700) {
        document.getElementById("c2").parentNode.parentNode.removeChild(document.getElementById("c2").parentNode);
        document.getElementById("c3").parentNode.parentNode.removeChild(document.getElementById("c3").parentNode);
    }
    let NEEDMORES = document.getElementsByClassName("flag");
    console.log("SCROLL")
    for (let i = 0; i < NEEDMORES.length; i++) {
        let rect = NEEDMORES[i].getBoundingClientRect();
        if (rect.top < (window.innerHeight - 100)) {
            let column_in_question = NEEDMORES[i].parentNode;
            let original = NEEDMORES[i];
            NEEDMORES[i].parentNode.removeChild(NEEDMORES[i]);
            appendImage(column_in_question,original);
        }
    }
    document.getElementById("main-area").addEventListener("scroll", () => {
        let NEEDMORES = document.getElementsByClassName("flag");
        console.log("SCROLL")
        for (let i = 0; i < NEEDMORES.length; i++) {
            let rect = NEEDMORES[i].getBoundingClientRect();
            if (rect.top < (window.innerHeight - 100)) {
                let column_in_question = NEEDMORES[i].parentNode;
                let original = NEEDMORES[i];
                NEEDMORES[i].parentNode.removeChild(NEEDMORES[i]);
                appendImage(column_in_question,original);
            }
        }
    })
})