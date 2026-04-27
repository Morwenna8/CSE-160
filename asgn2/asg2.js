// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n'+
    // 'uniform float u_Size;\n' +
    'uniform mat4 u_ModelMatrix;\n'+
    'uniform mat4 u_GlobalRotateMatrix;\n'+
    'void main() {\n' +
    '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

// global variables:
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let g_globalAngle = 0;
let g_globalYAngle = 0;
// mouse control
let g_mouseX = 0;
let g_mouseY = 0;
// joints
let g_walkAnimation = false;
let g_walkAngle = 0;
let g_neckBobAngle = 0;
let g_tailAngle = 0;
// neck angles:
let g_neckAngle = 0;
let g_neck1Angle = 0;
let g_neck2Angle = 0;
let g_neck3Angle = 0;
// horn party time!
let g_hornAnimation = false;
let g_hornStartTime = 0;
let g_hornAngle = 0;
let g_hornColorT = 0;

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesTOGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix){
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }
    
    // get the storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix){
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    // set an initial value for this matrix to identity
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const SPLASH = 3

// global vars related to UI:
let g_selectedColor = [1.0, 1.0, 1.0, 1.0]
let g_selectedSize = 5;
g_selectedType=POINT;
let g_selectedSegments = 10;
let g_showPicture = false;

// set up actions for the html ui elements
function addActionsForHtmlUI(){
    // on and off buttons
    //walking
    document.getElementById('animateWalkOn').onclick = function() { g_walkAnimation=true; };
    document.getElementById('animateWalkOff').onclick = function() { g_walkAnimation=false; };
    
    // camera angle
    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderScene(); });
    document.getElementById('angleSlideY').addEventListener('mousemove', function() { g_globalYAngle = this.value; renderScene(); });

    canvas.addEventListener('mousemove', function(ev) {
        // only rotate when mouse button is held down
        if (ev.buttons == 1) {
            g_mouseX = (ev.clientX - canvas.width/2) / (canvas.width/2) * 180;
            g_mouseY = (ev.clientY - canvas.height/2) / (canvas.height/2) * 180;
            renderScene();
        }
    });

    document.getElementById('walkSlide').addEventListener('mousemove', function() {
        g_walkAngle    = this.value;
        g_neckBobAngle = this.value * 0.3;
        g_tailAngle    = this.value * 1.0;
        renderScene();
    });

    // joint angles
    // document.getElementById('walkSlide').addEventListener('mousemove', function() { g_walkAngle = this.value; renderScene(); });

    document.getElementById('neckBotSlide').addEventListener('mousemove', function() { g_neck1Angle = parseFloat(this.value); renderScene(); });
    document.getElementById('neckMidSlide').addEventListener('mousemove', function() { g_neck2Angle = parseFloat(this.value); renderScene(); });
    document.getElementById('neckTopSlide').addEventListener('mousemove', function() { g_neck3Angle = parseFloat(this.value); renderScene(); });
}

function main() {
    // set up canvas and gl vars
    setupWebGL();

    // set up GLSL shader programs and connect GLSL vars
    connectVariablesTOGLSL();

    // set up actions for the html ui elements
    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    // canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position, u_FragColor) };
    // simplified: 
    canvas.onmousedown = click;
    // if button is held down, draw on mouse move
    canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } }

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.2, 0.0, 1.0);

    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // render
    // renderScene();
    requestAnimationFrame(tick);
}

var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

// function click(ev, gl, canvas, a_Position, u_FragColor) {
// simplified:
function click(ev) {
    // call extract/convert func
    if (ev.shiftKey) {
        g_hornAnimation = true;
        g_hornStartTime = g_seconds;
        return;
    }

    let [x,y] = convertCoordinatesEventToGL(ev);

    // meat of the click function:

    // create and store the new point
    // let point = new Point();
    renderScene();

    let point;
    if (g_selectedType==POINT){
        point = new Point();
    } else if (g_selectedType==TRIANGLE){
        point = new Triangle();
    } else if (g_selectedType==CIRCLE){
        point = new Circle();
        point.segments = g_selectedSegments;
    } else {
        point = new Splash();
    }

    point.position=[x,y];
    point.color=g_selectedColor.slice();
    point.size=g_selectedSize;
    g_shapesList.push(point);

    // clear canvas and draw all shapes
    // renderScene();
}

// extract the event click and return it in webGL coordinates
function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
    
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    
    return([x,y]);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick(){
    // print debig info
    g_seconds = performance.now()/1000.0-g_startTime;
    // console.log(g_seconds);

    // update angles
    updateAnimationAngles();

    // draw everything
    renderScene();

    // tell the browser to update again when it has time
    requestAnimationFrame(tick);
}

function updateAnimationAngles(){
    // if walk animation on then animate entire body
    if (g_walkAnimation) {
        g_walkAngle    = (20 * Math.sin(2 * g_seconds));
        g_neckBobAngle = (5 * Math.sin(4 * g_seconds));
        g_tailAngle    = (20 * Math.sin(2 * g_seconds));
    }

    if (g_hornAnimation) {
        g_hornAngle  = g_seconds * -200;   // spin speed in degrees/sec
        g_hornColorT = g_seconds;         // color cycling
    
        // stop after 10 seconds
        if (g_seconds - g_hornStartTime > 10.0) {
            g_hornAnimation = false;
            g_hornAngle  = 0;
            g_hornColorT = 0;
        }
    }
}

// // clear canvas and draw every shape that is supposed to be on the canvas
// function renderScene(){
//     var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
//     gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

//     // Clear <canvas>
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//     gl.clear(gl.COLOR_BUFFER_BIT);

//     // // render each shape in a list
//     // // var len = g_points.length;
//     // var len = g_shapesList.length;
//     // for(var i = 0; i < len; i++) {
//     //     g_shapesList[i].render();
//     // }

//     // test triangle
//     // drawTriangle3D( [-1.0, 0.0, 0.0,   -0.5, -1.0, 0.0,   0.0, 0.0, 0.0] );
    
// }

function renderScene() {
    var startTime = performance.now();

    // ── Global rotation (camera angle slider) ──
    // var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    var globalRotMat = new Matrix4()
        .rotate(g_globalAngle, 0, -1, 0)   // slider
        .rotate(g_globalYAngle, 1, 0, 0)   // slider
        .rotate(-g_mouseX, 0, 1, 0)        // mouse left/right → Y rotation
        .rotate(-g_mouseY, 1, 0, 0);       // mouse up/down → X rotation
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // ─────────────────────────────────────────────
    //  BODY
    // ─────────────────────────────────────────────
    var body = new Cube();
    body.color = [0.9, 0.65, 0.13, 1.0];
    body.matrix.translate(-0.25, -0.22, 0.25);
    body.matrix.scale(0.5, 0.35, 0.75);
    body.render();

    // ─────────────────────────────────────────────
    //  NECK
    // ─────────────────────────────────────────────
    // // ── NECK PARENT (invisible pivot point at neck3's base) ──
    // var neckParent = new Matrix4();
    // neckParent.translate(-0.12, -0.1, -0.28);   // pivot at neck3's world origin
    // // neckParent.rotate(g_neckAngle, 1, 0, 0);    // ALL neck segments rotate here
    // neckParent.rotate(g_neckAngle + g_neckBobAngle, 1, 0, 0);  // was just g_neckAngle
    // neckParent.translate(0.12, 0.1, 0.28);      // undo the pivot translation

    // // ── NECK3 (bottom) — original transforms, just pre-multiplied by parent ──
    // var neck3 = new Cube();
    // neck3.color = [0.81, 0.59, 0.12, 1.0];
    // neck3.matrix.set(neckParent);
    // neck3.matrix.translate(-0.12, -0.1, -0.28);
    // neck3.matrix.rotate(-28, 1, 0, 0);
    // neck3.matrix.scale(0.24, 0.36, 0.24);
    // neck3.render();

    // // ── NECK2 (mid) ──
    // var neck2 = new Cube();
    // neck2.color = [0.80, 0.58, 0.10, 1.0];
    // neck2.matrix.set(neckParent);
    // neck2.matrix.translate(-0.09, 0.1, -0.44);
    // neck2.matrix.rotate(-12, 1, 0, 0);
    // neck2.matrix.scale(0.18, 0.3, 0.18);
    // neck2.render();

    // // ── NECK (top) ──
    // var neck = new Cube();
    // neck.color = [0.80, 0.58, 0.10, 1.0];
    // neck.matrix.set(neckParent);
    // neck.matrix.translate(-0.07, 0.25, -0.5);   // ORIGINAL unchanged
    // neck.matrix.rotate(-6, 1, 0, 0);             // ORIGINAL unchanged
    // neck.matrix.scale(0.14, 0.45, 0.14);         // ORIGINAL unchanged
    // neck.render();


    // // ─────────────────────────────────────────────
    // //  HEAD
    // // ─────────────────────────────────────────────
    // var head = new Cube();
    // head.color = [0.85, 0.65, 0.13, 1.0];
    // head.matrix.set(neckParent);
    // head.color = [0.85, 0.65, 0.13, 1.0];
    // head.matrix.translate(-0.1, 0.62, -0.55);
    // head.matrix.scale(0.20, 0.14, 0.18);
    // head.render();

    // // nose
    // var snout = new Cube();
    // snout.color = [0.75, 0.55, 0.10, 1.0];
    // snout.matrix.set(neckParent);
    // snout.matrix.translate(-0.07, 0.62, -0.73);   // z toward viewer
    // snout.matrix.scale(0.14, 0.10, 0.10);
    // snout.render();

    // // ─────────────────────────────────────────────
    // //  ITTY BITTY HORNS
    // // ─────────────────────────────────────────────
    // var hornL = new Cylinder();
    // hornL.color = [0.55, 0.27, 0.07, 1.0];
    // hornL.matrix.set(neckParent);
    // hornL.matrix.translate(-0.06, 0.76, -0.6);
    // hornL.matrix.scale(0.04, 0.10, 0.04);
    // hornL.render();

    // var hornR = new Cylinder();
    // hornR.color = [0.55, 0.27, 0.07, 1.0];
    // hornR.matrix.set(neckParent);
    // hornR.matrix.translate(0.06, 0.76, -0.6);
    // hornR.matrix.scale(0.04, 0.10, 0.04);
    // hornR.render();

    // fun animation idea: have sparks come out of them or have them twirl away and change color!

    // ─────────────────────────────────────────────
    //  NECK
    // ─────────────────────────────────────────────

    // ── LEVEL 1 PARENT: forward/back bob + neck1 sideways, pivots at neck3's base ──
    var neckParent = new Matrix4();
    neckParent.translate(-0.12, -0.1, -0.28);
    neckParent.rotate(g_neckAngle + g_neckBobAngle, 1, 0, 0);
    neckParent.rotate(g_neck1Angle, 0, 1, 0);          // 1st level sideways
    neckParent.translate(0.12, 0.1, 0.28);

    // ── LEVEL 2 PARENT: pivots at neck2's base ──
    var neck2Parent = new Matrix4(neckParent);
    neck2Parent.translate(-0.09, 0.1, -0.44);           // neck2's world position
    neck2Parent.rotate(g_neck2Angle, 0, 1, 0);          // 2nd level sideways
    neck2Parent.translate(0.09, -0.1, 0.44);            // undo

    // ── LEVEL 3 PARENT: pivots at neck top's base ──
    var neck3Parent = new Matrix4(neck2Parent);
    neck3Parent.translate(-0.07, 0.25, -0.5);           // neck top's world position
    neck3Parent.rotate(g_neck3Angle, 0, 1, 0);          // 3rd level sideways
    neck3Parent.translate(0.07, -0.25, 0.5);            // undo

    // ── NECK3 (bottom) — uses level 1 parent ──
    var neck3 = new Cube();
    neck3.color = [0.81, 0.59, 0.12, 1.0];
    neck3.matrix.set(neckParent);
    neck3.matrix.translate(-0.12, -0.1, -0.28);
    neck3.matrix.rotate(-28, 1, 0, 0);
    neck3.matrix.scale(0.24, 0.36, 0.24);
    neck3.render();

    // ── NECK2 (mid) — uses level 2 parent ──
    var neck2 = new Cube();
    neck2.color = [0.80, 0.58, 0.10, 1.0];
    neck2.matrix.set(neck2Parent);
    neck2.matrix.translate(-0.09, 0.1, -0.44);
    neck2.matrix.rotate(-12, 1, 0, 0);
    neck2.matrix.scale(0.18, 0.3, 0.18);
    neck2.render();

    // ── NECK (top) — uses level 3 parent ──
    var neck = new Cube();
    neck.color = [0.80, 0.58, 0.10, 1.0];
    neck.matrix.set(neck3Parent);
    neck.matrix.translate(-0.07, 0.25, -0.5);
    neck.matrix.rotate(-6, 1, 0, 0);
    neck.matrix.scale(0.14, 0.45, 0.14);
    neck.render();

    // ─────────────────────────────────────────────
    //  HEAD — uses level 3 parent (moves with top neck)
    // ─────────────────────────────────────────────
    var head = new Cube();
    head.color = [0.85, 0.65, 0.13, 1.0];
    head.matrix.set(neck3Parent);
    head.matrix.translate(-0.1, 0.62, -0.55);
    head.matrix.scale(0.20, 0.14, 0.18);
    head.render();

    // SNOUT!
    var snout = new Cube();
    snout.color = [0.75, 0.55, 0.10, 1.0];
    snout.matrix.set(neck3Parent);
    snout.matrix.translate(-0.07, 0.635, -0.65);
    snout.matrix.scale(0.14, 0.10, 0.18);
    snout.render();

    // // ─────────────────────────────────────────────
    // //  ITTY BITTY HORNS — uses level 3 parent
    // // ─────────────────────────────────────────────
    // var hornL = new Cylinder();
    // hornL.color = [0.55, 0.27, 0.07, 1.0];
    // hornL.matrix.set(neck3Parent);
    // hornL.matrix.translate(-0.06, 0.76, -0.6);
    // hornL.matrix.scale(0.04, 0.10, 0.04);
    // hornL.render();

    // var hornR = new Cylinder();
    // hornR.color = [0.55, 0.27, 0.07, 1.0];
    // hornR.matrix.set(neck3Parent);
    // hornR.matrix.translate(0.06, 0.76, -0.6);
    // hornR.matrix.scale(0.04, 0.10, 0.04);
    // hornR.render();

    // ─────────────────────────────────────────────
    //  ITTY BITTY HORNS (PARTY VERSION!)
    // ─────────────────────────────────────────────

    // rainbow color cycles through hue using sine waves on RGB
    var hornR = 0.5 + 0.5 * Math.sin(g_hornColorT * 3.0);
    var hornG = 0.5 + 0.5 * Math.sin(g_hornColorT * 3.0 + 2.094);  // +120 degrees
    var hornB = 0.5 + 0.5 * Math.sin(g_hornColorT * 3.0 + 4.189);  // +240 degrees
    var hornColor = g_hornAnimation
        ? [hornR, hornG, hornB, 1.0]
        : [0.55, 0.27, 0.07, 1.0];   // original brown when not animating

    // left horn
    var hornL = new Cylinder();
    hornL.color = hornColor;
    hornL.matrix.set(neck3Parent);
    hornL.matrix.translate(-0.06, 0.76, -0.6);       // move to horn BASE position
    hornL.matrix.rotate(g_hornAngle, 0, 1, 0);        // spin around Y at base
    hornL.matrix.rotate(g_hornAnimation ? 30 : 0, 0, 0, 1);  // tilt so tip draws a circle
    hornL.matrix.scale(0.04, 0.10, 0.04);             // ORIGINAL scale unchanged
    hornL.render();

    // right horn — offset phase by 180 so they spin opposite each other
    var hornRt = new Cylinder();
    hornRt.color = hornColor;
    hornRt.matrix.set(neck3Parent);
    hornRt.matrix.translate(0.06, 0.76, -0.6);        // move to horn BASE position
    hornRt.matrix.rotate(-g_hornAngle + 180, 0, 1, 0); // 180 offset = opposite phase
    hornRt.matrix.rotate(g_hornAnimation ? 30 : 0, 0, 0, 1);
    hornRt.matrix.scale(0.04, 0.10, 0.04);            // ORIGINAL scale unchanged
    hornRt.render();

    // ─────────────────────────────────────────────
    //  TAIL
    // ─────────────────────────────────────────────
    var tailconnector = new Cylinder();
    tailconnector.color = [0.55, 0.27, 0.07, 1.0];
    tailconnector.matrix.translate(0, 0, 0.28);
    tailconnector.matrix.scale(0.05, 0.05, 0.1);
    tailconnector.render();


    var tailBase = new Matrix4();
    tailBase.translate(0, -0.07, 0.3);
    tailBase.rotate(g_tailAngle, 0, 0, 1);

    // segment 1 (base)
    var tail1 = new Cylinder();
    tail1.color = [0.55, 0.27, 0.07, 1.0];
    tail1.matrix.set(tailBase);
    var tail1Coords = new Matrix4(tail1.matrix);
    tail1.matrix.scale(0.05, 0.12, 0.05);
    tail1.render();

    // segment 2
    var tail2 = new Cylinder();
    tail2.color = [0.52, 0.25, 0.06, 1.0];
    tail2.matrix = new Matrix4(tail1Coords);
    tail2.matrix.translate(0, -0.12, 0);
    tail2.matrix.rotate(g_tailAngle * 0.3, 0, 0, 1);
    var tail2Coords = new Matrix4(tail2.matrix);
    tail2.matrix.scale(0.045, 0.11, 0.045);
    tail2.render();

    // segment 3
    var tail3 = new Cylinder();
    tail3.color = [0.50, 0.23, 0.05, 1.0];
    tail3.matrix = new Matrix4(tail2Coords);
    tail3.matrix.translate(0, -0.11, 0);
    tail3.matrix.rotate(g_tailAngle * 0.3, 0, 0, 1);
    var tail3Coords = new Matrix4(tail3.matrix);
    tail3.matrix.scale(0.04, 0.10, 0.04);
    tail3.render();

    // segment 4
    var tail4 = new Cylinder();
    tail4.color = [0.45, 0.20, 0.04, 1.0];
    tail4.matrix = new Matrix4(tail3Coords);
    tail4.matrix.translate(0, -0.10, 0);
    tail4.matrix.rotate(g_tailAngle * 0.3, 0, 0, 1);
    var tail4Coords = new Matrix4(tail4.matrix);
    tail4.matrix.scale(0.035, 0.09, 0.035);
    tail4.render();

    // segment 5 (tuft!)
    var tail5 = new Cylinder();
    tail5.color = [0.25, 0.10, 0.02, 1.0];
    tail5.matrix = new Matrix4(tail4Coords);
    tail5.matrix.translate(0, -0.09, 0);
    tail5.matrix.rotate(g_tailAngle * 0.3, 0, 0, 1);
    tail5.matrix.scale(0.04, 0.07, 0.04);
    tail5.render();

    // ─────────────────────────────────────────────
    //  LEGS
    // ─────────────────────────────────────────────
    function drawLeg(pivotX, pivotY, pivotZ, swingAngle, color, isFront) {
        // ── UPPER LEG ──
        var upper = new Cube();
        upper.color = color;
        upper.matrix.translate(pivotX, pivotY, pivotZ);
        upper.matrix.rotate(swingAngle, 1, 0, 0);
        var kneeCoords = new Matrix4(upper.matrix);
        upper.matrix.scale(0.1, 0.29, 0.1);
        upper.matrix.translate(-0.5, -1.0, -0.2);
        upper.render();
    
        // ── LOWER LEG ──
        var lower = new Cube();
        lower.color = [color[0]*0.85, color[1]*0.85, color[2]*0.85, color[3]];
        lower.matrix = new Matrix4(kneeCoords);
        lower.matrix.translate(0, -0.28, 0);
        var kneeBend = isFront
            ? Math.max(0, -swingAngle) * 0.8
            : Math.max(0,  swingAngle) * 0.8;
        lower.matrix.rotate(kneeBend, 1, 0, 0);
        var hoofCoords = new Matrix4(lower.matrix);
        lower.matrix.scale(0.07, 0.24, 0.07);
        lower.matrix.translate(-0.5, -1.0, -0.5);
        lower.render();
    
        // ── HOOF ──
        // counter-rotate to keep hoof angled naturally with the stride
        // when leg swings forward, toe tips up; when swinging back, toe pushes down
        var hoofTilt = -swingAngle * 0.4 - kneeBend * 0.3;
    
        var hoof = new Cube();
        hoof.color = [0.20, 0.10, 0.02, 1.0];
        hoof.matrix = new Matrix4(hoofCoords);
        hoof.matrix.translate(0, -0.28, 0.05);
        hoof.matrix.rotate(hoofTilt, 1, 0, 0);   // natural foot angle
        hoof.matrix.scale(0.11, 0.07, 0.15);
        hoof.matrix.translate(-0.5, 0, -0.5);
        hoof.render();
    }

    var legColor = [0.80, 0.60, 0.12, 1.0];

    drawLeg(-0.1, -0.10, 0.18,  g_walkAngle, legColor, true);   // front-left
    drawLeg( 0.1, -0.10, -0.28, -g_walkAngle, legColor, false);  // back-right
    drawLeg( 0.1, -0.10, 0.18, -g_walkAngle, legColor, true);   // front-right
    drawLeg(-0.1, -0.10, -0.28,  g_walkAngle, legColor, false);  // back-left

    var duration = performance.now() - startTime;
    sendTextToHTML('fps: ' + Math.floor(10000/duration)/10, "object");
}

function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if (!htmlID) {
        console.log('Failed to get ' + htmlID + ' from HTML');
        return;
    }
    htmlElm.innerHTML = text;
}