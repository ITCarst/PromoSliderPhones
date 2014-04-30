(function promoSlider(){
    "use strict";
    var that = {};
	//configs for the slider
    var sliderConf = {
        min : 1, //minimum number of images
        max : 5, //maximum number of images
        current : 1, //start image position
        currPos : 0, //custom attribute that stores current TranslateX position of each image
        imageTapStartX : 0, //get the tap start x
        imageTapEndX : 0, //tap start x end
        imageTapDistanceX : 0, //keeps the value between touch start and end
        coverFlowContainerElement : null, //the main id of the slider
        bullets : null, //the bullets holder
		moveDistance: 322 //the move distance of each image
    };
    that.init = function () {
        that.promoSlider();
    };
    /*
    * Init Promo Slider
    */
    that.promoSlider = function() {
        //assign to the elem the slider holder
		sliderConf.coverFlowContainerElement = document.getElementById("m-horzListing");
		//set moving position for the images
        that.addAttributesToElems();
    };
    /*
    * for each child in the slider add current position attr for moveing later based on the cp
    */
    that.addAttributesToElems = function() {
        var moveDist = 0;
		//start counting from 1 and not 0
        for ( var x = 1; x < sliderConf.max + 1; x++ ) {
            moveDist += sliderConf.moveDistance;
            var elems = document.getElementById("horz" + x);
            elems.setAttribute('cp', moveDist);
        }
        //the bullet for the current image add the class current
        sliderConf.bullets = document.getElementsByClassName('bullet');
        sliderConf.bullets[0].className = 'bullet current';
        that.addEventsToImageHolders();
    };
    /*
     *   for all images in the slider add event listener touch start and end
     *   that will handle the touch not swipe on the given image
     */
    that.addEventsToImageHolders = function () {
        var imageHolders = sliderConf.coverFlowContainerElement.getElementsByClassName("horzListing"), i, imgLen;
        for ( i = 0, imgLen = imageHolders.length; i < imgLen; i++ ) {
            imageHolders[i].addEventListener("touchstart", that.handleImageTapStart, false);
            //if it;s chrome running on android instead of touchend event replace it with touchcancel
            //touch end on android chrome has a different behavior then the rest of the browsers
            if ( (navigator.platform.match('Linux armv7l') && navigator.userAgent.match('Chrome')) )
            {
                //works on default android 4.2.2
                //doesn't work on chrome
                imageHolders[i].addEventListener("touchend", that.handleImageTapEnd,false); //nexus 7 needs the touchend to go to detail page
                //works on chrome
               imageHolders[i].addEventListener("touchcancel", that.handleImageTapEnd,false); //nexus 7 needs the touchend to go to detail page
            } else {
                imageHolders[i].addEventListener("touchend", that.handleImageTapEnd,false);
            }
        }
    };
    //get the touch start position
    that.handleImageTapStart = function(event) {
        sliderConf.imageTapStartX = event.changedTouches[0].pageX;
    };
	//handle the tap end on the image
    that.handleImageTapEnd = function(event) {
        sliderConf.imageTapEndX = event.changedTouches[0].pageX;
        sliderConf.imageTapDistanceX = sliderConf.imageTapEndX - sliderConf.imageTapStartX;
        //if the tapped distance it's smaller then 0 move right otherwize left
        if ( sliderConf.imageTapDistanceX < 0) {
            that.moveRightOne();
        } else if (sliderConf.imageTapDistanceX > 0) {
            that.moveLeftOne();
        }else { 
			//the same image has been clicked
			//add onclick event to the element to redirect to the giving link
            console.log('link to elem here');
        }
    };
    //move the slider to left
    that.moveLeftOne = function() {
        if ( sliderConf.current > sliderConf.min) {
            sliderConf.current--;
            if ( sliderConf.current === 1 ) {
                sliderConf.currPos = 0;
            } else {
                sliderConf.currPos = document.getElementById("horz" + ( sliderConf.current - 1)).getAttribute("cp");
            }
            for ( var i = 1; i <= sliderConf.max; i++) {
                if ( i == sliderConf.current ) {
                    sliderConf.bullets[sliderConf.current -1 ].className = 'bullet current';
                } else {
                    sliderConf.bullets[sliderConf.current].className = 'bullet';
                }
            }
            sliderConf.coverFlowContainerElement.style.webkitTransform = "translateX(-" + sliderConf.currPos + "px)";
        }
    };
    //move the images in the slider to right
    that.moveRightOne = function() {
        if ( sliderConf.current < sliderConf.max ) {
            if ( sliderConf.current === 1 ) {
                sliderConf.currPos = document.getElementById("horz1").getAttribute("cp");
            } else {
                sliderConf.currPos = document.getElementById("horz" + sliderConf.current).getAttribute("cp");
            }
            sliderConf.current++;
            for ( var i = 1; i <= sliderConf.max; i++) {
                if ( i == ( sliderConf.current - 1 ) ) {
                    sliderConf.bullets[i].className = 'bullet current';
                } else {
                    sliderConf.bullets[sliderConf.current-2].className = 'bullet';
                }
            }
            sliderConf.coverFlowContainerElement.style.webkitTransform = "translateX(-" + sliderConf.currPos + "px)";
        }
    };
    /* The default behavior of the browser is to scroll when you swipe. This line is to prevent scrolling */
    that.disablePageScroll = function() {
        document.ontouchmove = function(event) {
            event.preventDefault();
        }
    };
	window.promoSlider = that.init();
})();