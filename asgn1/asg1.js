// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n'+
    'uniform float u_Size;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    // '  gl_PointSize = 10.0;\n' +
    '  gl_PointSize = u_Size;\n' +
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

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
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
    // button events (shape type)
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
    document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
    document.getElementById('clearButton').onclick = function() { g_shapesList = []; renderAllShapes(); };

    document.getElementById('point').onclick = function() { g_selectedType=POINT; };
    document.getElementById('triangle').onclick = function() { g_selectedType=TRIANGLE; };
    document.getElementById('circle').onclick = function() { g_selectedType=CIRCLE; };
    document.getElementById('splash').onclick = function() { g_selectedType=SPLASH; };

    // document.getElementById('painting').onclick = function() { { drawPicture(); renderAllShapes(); }; };

    // sliders events
    document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

    document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
    document.getElementById('segmentSlide').addEventListener('mouseup', function() { g_selectedSegments = this.value; });

    // to show painting when clicked and to hid it when clicked again
    document.getElementById('painting').onclick = function() { g_showPicture = !g_showPicture; renderAllShapes(); };
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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    renderAllShapes();
}

var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

// function click(ev, gl, canvas, a_Position, u_FragColor) {
// simplified:
function click(ev) {
    // call extract/convert func
    let [x,y] = convertCoordinatesEventToGL(ev);

    // meat of the click function:

    // create and store the new point
    // let point = new Point();
    renderAllShapes();

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
    // renderAllShapes();
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

// clear canvas and draw every shape that is supposed to be on the canvas
function renderAllShapes(){
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // var len = g_points.length;
    var len = g_shapesList.length;

    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
    
    // drawPicture();
    if (g_showPicture) { drawPicture(); }
}