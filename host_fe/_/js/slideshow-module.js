var shared_data = {
    windowLoaded:false,
}

class slideshowManager {
    constructor (array) {
        this.array = array;
    }
    data = {
        prevTime: Date.now(),
        amountMoved: 0,
        slideshowHolderId:"",
    }
    addImages() {
        var arr_to_use = this.array;
        return {
            to: function(elementId) {
                this.data.slideshowHolderId = elementId;
                //console.log(arr_to_use)
                for (const image of arr_to_use) {
                    var jsVersionOfImage = new Image();
                    jsVersionOfImage.src = "./images/images-slideshow/" + image;
                    //jsVersionOfImage.onload = function() {
                    var imgElemToAdd = document.createElement("img")
                    imgElemToAdd.src = jsVersionOfImage.src;
                    imgElemToAdd.className = "slideshow-item";
                    imgElemToAdd.id = image;
                    document.getElementById(elementId).appendChild(imgElemToAdd);
                    //}
                }
            }.bind(this)
        }
    }
    update() {
        if (this.data.amountMoved < (document.getElementById(this.array[0]).clientWidth+10)) {/*not scooched enough*/
            this.data.amountMoved += 0.25;//actually 0.25
            document.getElementById(this.array[0]).style.marginLeft = (-1 * (this.data.amountMoved)) + "px";
            for (const image of this.array) {
                document.getElementById(image).style.display = "block";
            }
            
        } else {
            //switch images
            var firstImage = this.array[0]
            this.array.shift();
            this.array.push(firstImage)
            document.getElementById(firstImage).parentElement.removeChild(document.getElementById(firstImage));
            var jsVersionOfImage = new Image();
            jsVersionOfImage.src = "./images/images-slideshow/" + firstImage;
            var imgElemToAdd = document.createElement("img")
            imgElemToAdd.src = jsVersionOfImage.src;
            imgElemToAdd.className = "slideshow-item";
            imgElemToAdd.id = firstImage;
            document.getElementById(this.data.slideshowHolderId).appendChild(imgElemToAdd);
            this.data.amountMoved = 0;
        }
    }
}