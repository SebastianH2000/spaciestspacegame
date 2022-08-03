var fps = 50;
var fpsInv = 1000/fps;
var lastPage = new Vector(0,0);


function mainLoop() {
    let win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0],
        pageX = win.innerWidth || docElem.clientWidth || body.clientWidth,
        pageY = win.innerHeight || docElem.clientHeight || body.clientHeight;
    if (lastPage.x !== pageX || lastPage.y !== pageY) {
        scaleWindow();
    }

    let cornerX = 0-(canX/screenScale)/2;
    let cornerY = 0-(canY/screenScale)/2;

    ctx.fillStyle = "black";
    ctx.fillRect(cornerX, cornerY, canX/screenScale, canY/screenScale);

    ctx.fillStyle = 'white';
    ctx.fillRect(mousePos.x-5,mousePos.y-30,10,60);
    ctx.fillRect(mousePos.x-30,mousePos.y-5,60,10);

    ctx.msImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    rotateByImage(ctx,document.getElementById("spaceship"),-60,-60,120,120,180-mousePos.heading(),false,false);

    lastPage.x = pageX;
    lastPage.y = pageY;
}

setInterval("mainLoop()",fpsInv);