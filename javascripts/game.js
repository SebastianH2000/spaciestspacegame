/*var fps = 50;
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

setInterval("mainLoop()",fpsInv);*/



// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body, 
    engine: engine
});

engine.world.gravity.y = 0;

function toBijective(x) {
    if (x > 0) {
        return x * 2 - 1;
    }
    else {
        return Math.abs(x) * 2;
    }
}

function fromBijective(x) {
    if (x % 2 === 1) {
        return (x + 1) / 2;
    }
    else {
        return x / -2;
    }
}

boxSize = 20;

var WorldArr = [];
var WorldSetup = [{x: 0, y: 0, type: 1}, {x: 0, y: 1, type: 1}, {x: 0, y: 2, type: 1}, {x: 0, y: 3, type: 1}, {x: 0, y: 4, type: 1}, {x: 1, y: 0, type: 2}, {x: -1, y: 0, type: 2}, {x: 2, y: 0, type: 2}, {x: -2, y: 0, type: 2}, {x: 2, y: -1, type: 2}, {x: -2, y: -1, type: 2}, {x: 1, y: 1, type: 2}, {x: -1, y: 1, type: 2}];

for (let i = 0; i < WorldSetup.length; i++) {
    if (WorldArr[toBijective(WorldSetup[i].x)] === undefined) {
        WorldArr[toBijective(WorldSetup[i].x)] = new Array(toBijective(WorldSetup[i].y));
    }
    WorldArr[toBijective(WorldSetup[i].x)][toBijective(WorldSetup[i].y)] = {type: WorldSetup[i].type, box: {}, generated: false};
}

var boxArr = [];
var constraintArr = [];

for (let i = 0; i < WorldArr.length; i++) {
    for (let j = 0; j < WorldArr[i].length; j++) {
        if (WorldArr[i][j] !== undefined) {
            let thisBox = WorldArr[i][j];
            let upBox = 0;
            let rightBox = 0;
            if (fromBijective(i) <= Math.abs(fromBijective(WorldArr[i].length))) {
                upBox = WorldArr[i][toBijective(fromBijective(j)+1)];
            }
            else {
                upBox = false;
            }
            if (fromBijective(i) <= (WorldArr.length-3)/2) {
                rightBox = WorldArr[toBijective(fromBijective(i)+1)][j];
            }
            if (thisBox.type === 1 || thisBox.type === 2) {
                if (!WorldArr[i][j].generated) {
                    WorldArr[i][j].box = Bodies.rectangle(fromBijective(i)*boxSize+400,fromBijective(j)*boxSize+200,boxSize,boxSize);
                    WorldArr[i][j].generated = true;
                }
                if (upBox !== false && upBox !== undefined) {
                    if (upBox.type === 1 || upBox.type === 2) {
                        if (!WorldArr[i][toBijective(fromBijective(j)+1)].generated) {
                        WorldArr[i][toBijective(fromBijective(j)+1)].box = Bodies.rectangle(fromBijective(i)*boxSize+400,(fromBijective(j)+1)*boxSize+200,boxSize,boxSize);
                        WorldArr[i][toBijective(fromBijective(j)+1)].generated = true;
                        }
                        constraintArr.push(Matter.Constraint.create({
                            bodyA: WorldArr[i][j].box,
                            pointA: {x: 0, y: boxSize/2},
                            bodyB: WorldArr[i][toBijective(fromBijective(j)+1)].box,
                            pointB: {x: 0, y: 0-boxSize/2},
                            length: 0,
                            stiffness: 0.75,
                        }));
                    }
                }
                if (rightBox !== false && rightBox !== undefined) {
                    if (rightBox.type === 1 || rightBox.type === 2) {
                        if (!WorldArr[toBijective(fromBijective(i)+1)][j].generated) {
                            WorldArr[toBijective(fromBijective(i)+1)][j].box = Bodies.rectangle((fromBijective(i)+1)*boxSize+400,(fromBijective(j))*boxSize+200,boxSize,boxSize);
                            WorldArr[toBijective(fromBijective(i)+1)][j].generated = true;
                        }
                        constraintArr.push(Matter.Constraint.create({
                            bodyA: WorldArr[i][j].box,
                            pointA: {x: boxSize/2, y: 0},
                            bodyB: WorldArr[toBijective(fromBijective(i)+1)][j].box,
                            pointB: {x: 0-boxSize/2, y: 0},
                            length: 0,
                            stiffness: 0.75,
                        }));
                    }
                }
            }
            boxArr.push(WorldArr[i][j].box);
        }
    }
}

/*constraintArr.push(Matter.Constraint.create({
    bodyA: WorldArr[0][0].box,
    pointA: {x: 0, y: 0},
    bodyB: WorldArr[toBijective(fromBijective(0)+1)][0].box,
    pointB: {x: 0, y: 0},
    length: 100,
    stiffness: 0.8,
    damping: 1
}));*/

var spaceship1 = Matter.Composite.create();
Composite.add(spaceship1,boxArr);
Composite.add(spaceship1,constraintArr);


/*var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(480, 200, 80, 80);
var boxC = Bodies.rectangle(560,200, 80, 80);
var boxD = Bodies.rectangle(560,280, 80, 80);
var boxBondAB = Matter.Constraint.create({
    bodyA: boxA,
    pointA: {x: 40, y: 0},
    bodyB: boxB,
    pointB: {x: -40, y: 0},
    length: 0,
    stiffness: 0.8,
    damping: 1
});
var boxBondBC = Matter.Constraint.create({
    bodyA: boxB,
    pointA: {x: 40, y: 0},
    bodyB: boxC,
    pointB: {x: -40, y: 0},
    length: 0,
    stiffness: 0.8,
    damping: 1
});
var boxBondCD = Matter.Constraint.create({
    bodyA: boxC,
    pointA: {x: 0, y: 40},
    bodyB: boxD,
    pointB: {x: 0, y: -40},
    length: 0,
    stiffness: 0.8,
    damping: 1
});

var spaceship1 = Matter.Composite.create();
Composite.add(spaceship1,[boxA,boxB,boxC,boxD,boxBondAB,boxBondBC,boxBondCD]);

// create two boxes and a ground
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
Composite.add(engine.world, [spaceship1, ground]);*/

Composite.add(engine.world, spaceship1);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

setInterval(() => {
    Matter.Body.applyForce(boxArr[0], {x: WorldArr[0][0].box.position.x, y: WorldArr[0][0].box.position.y+40}, {x: Math.cos(WorldArr[0][0].box.angle) * 0.001, y: Math.sin(WorldArr[0][0].box.angle+Math.PI/2) * 0.0001});
}, 10);