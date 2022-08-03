var bigSide = 'x';
var sideOffset = 0;
var scaleFactor = 0;

function scaleWindow() {
    document.body.style.transform = "scale(1)";
    let win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0],
        x = win.innerWidth || docElem.clientWidth || body.clientWidth,
        y = win.innerHeight || docElem.clientHeight || body.clientHeight;
    document.body.style.transform = "scale(" + Math.min(x / canX, y / canY) + ")";
    document.body.style.height = y + "px";
    scaleFactor = Math.min(x / canX, y / canY);

    /*if (x/canX < y/canY) {
      document.body.style.margin = (((y - (canY*scaleFactor))/2) + "px 0px 0px 0px");
    }
    else {
      document.body.style.margin = (((y - (canY*scaleFactor))/2) + "px 0px 0px 0px");
    }*/
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(can.width / 2, can.height / 2);
    ctx.scale(1 * screenScale, 1 * screenScale);
    canObj = can.getBoundingClientRect();
    if (x / canX > y / canY) {
        bigSide = 'x';
        //sideOffset = ((x*scaleFactor) - canX * scaleFactor)*scaleFactor;
        sideOffset = canObj.left / scaleFactor;
        //sideOffset = x-((canX/2)*scaleFactor);
        //sideOffset = 178;
    }
    else {
        bigSide = 'y';
        //sideOffset = y-(canY*scaleFactor);
        sideOffset = canObj.top / scaleFactor;
    }
}
window.onload = function () {
    scaleWindow();
}




var mousePos = new Vector(0,0);
//mouse input
(function () {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        if (bigSide === 'x') {
            mousePos.x = (event.pageX / screenScale) / scaleFactor - ((canX / 2)/screenScale) - (sideOffset/screenScale);
            mousePos.y = (event.pageY / screenScale) / scaleFactor - ((canY / 2)/screenScale);
            /*mouseX = (event.pageX * screenScale) / scaleFactor - (canX / 2) - sideOffset;
            mouseY = (event.pageY * screenScale) / scaleFactor - (canY / 2);*/
        }
        else {
            mousePos.x = (event.pageX / screenScale) / scaleFactor - ((canX / 2)/screenScale);
            mousePos.y = (event.pageY / screenScale) / scaleFactor - ((canY / 2)/screenScale) - (sideOffset/screenScale);
            /*mouseX = (event.pageX / screenScale) / scaleFactor - (canX / 2);
            mouseY = ((event.pageY / screenScale) / scaleFactor - (canY / 2)) - sideOffset;*/
        }
    }
})();

//keyboard input
var map = {}; // You could also use an array
//wsad
map[87] = false;
map[83] = false;
map[65] = false;
map[68] = false;

//^v<>
map[38] = false;
map[40] = false;
map[37] = false;
map[39] = false;

map[32] = false;

onkeydown = onkeyup = function(e){
  e = e || event; // to deal with IE
  map[e.keyCode] = e.type == 'keydown';
  /* insert conditional here */
}