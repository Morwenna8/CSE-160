// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n'+
    'attribute vec2 a_UV;\n'+
    'attribute vec3 a_Normal;\n'+

    'varying vec2 v_UV;\n'+
    'varying vec3 v_Normal;\n'+
    'varying vec4 v_VertPos;\n'+

    // 'uniform float u_Size;\n' +
    'uniform mat4 u_ModelMatrix;\n'+
    'uniform mat4 u_GlobalRotateMatrix;\n'+
    'uniform mat4 u_ViewMatrix;\n'+
    'uniform mat4 u_ProjectionMatrix;\n'+

    // 'uniform mat4 u_SkyViewMatrix;\n'+
    'void main() {\n' +
    '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
    '  v_UV = a_UV;\n' + // we have to do this because if a_UV isn't used here, it gets thrown away by the compiler
    '  v_Normal = a_Normal;\n' +

    '  v_VertPos = u_ModelMatrix * a_Position;\n' +
    '}\n';

// // Fragment shader program
// var FSHADER_SOURCE =
//   'precision mediump float;\n' +
//   'varying vec2 v_UV;\n'+
//   'varying vec3 v_Normal;\n'+
//   'uniform vec4 u_FragColor;\n' +
//   'uniform sampler2D u_Sampler0;\n' +
//   'uniform sampler2D u_Sampler1;\n' +
//   'uniform sampler2D u_Sampler2;\n' +
//   'uniform int u_whichTexture;\n' +

//   'uniform vec3 u_lightPos;\n' +
//   'uniform vec3 u_cameraPos;\n' +
//   'varying vec4 v_VertPos;\n'+
//   'uniform bool u_specular;\n' +
//   'uniform bool u_lightOn;\n' +
//   'uniform vec3 u_spotDir;\n' +
//   'uniform float u_spotCutoff;\n' +
//   'uniform vec3 u_spotPos;\n' +
//   'uniform bool u_spotlightOn;\n' +

//   'void main() {\n' +
//   '  if (u_whichTexture == -3) {\n' +
//   '    gl_FragColor = vec4((v_Normal + 1.0 )/ 2.0, 1.0);\n' + // use normal

//   '  } else if (u_whichTexture == -2) {\n' +
//   '    gl_FragColor = u_FragColor;\n' + // use color

//   '  } else if (u_whichTexture == -1) {\n' +
//   '    gl_FragColor = vec4(v_UV, 1.0, 1.0);\n' + // use UV debug color

//   '  } else if (u_whichTexture == 0) {\n' +
//   '    gl_FragColor = texture2D(u_Sampler0, v_UV);\n' + // use texture0 - sky

//   '  } else if (u_whichTexture == 1) {\n' +
//   '    gl_FragColor = texture2D(u_Sampler1, v_UV);\n' + // use texture1 - jupiter

//   '  } else if (u_whichTexture == 2) {\n' +
//   '    gl_FragColor = texture2D(u_Sampler2, v_UV);\n' + // use texture1 - paisley

//   '  } else {\n' +
//   '    gl_FragColor = vec4(1, 0.2, 0.2, 1);\n' + // error, put redish
//   '  }\n' +

// //   '  vec3 lightVector = vec3(v_VertPos)-u_lightPos;\n' +
//   '  vec3 lightVector = u_lightPos - vec3(v_VertPos);\n' +
//   '  float r = length(lightVector);\n' +

// // red / green distance visualization
// //   '  if (r < 1.0) {\n' +
// //   '    gl_FragColor = vec4(1,0,0,1);\n' +
// //   '  } else if (r < 2.0) {\n' +
// //   '    gl_FragColor = vec4(0,1,0,1);\n' +
// //   '  }\n' +

// // light falloff visualization 1/r^2
// //   '  gl_FragColor = vec4(vec3(gl_FragColor) / (r * r), 1);\n' +

// // N dot L
//   '  vec3 L = normalize(lightVector);\n' +
//   '  vec3 N = normalize(v_Normal);\n' +
//   '  float nDotL = max(dot(N,L), 0.0);\n' +

//   // relfection
//   '  vec3 R = reflect(-L, N);\n' +

//   // eye
//   '  vec3 E = normalize(u_cameraPos - vec3(v_VertPos));\n' +

//   // specular
// //   '  float specular = pow(max(dot(E,R), 0.0), 10.0);\n' +
//   '  float specular = pow(max(dot(E,R), 0.0), 64.0) * 0.8;\n' +

// //   '  float spotEffect = 0.0;\n' +
// //   '  vec3 spotDir = normalize(u_spotDir);\n' +
// //   '  vec3 toFrag = normalize(vec3(v_VertPos) - u_spotPos);\n' +
// //   '  float spotDot = dot(toFrag, spotDir);\n' +
// //   '  if (spotDot > u_spotCutoff) {\n' +
// //   '    float intensity = (spotDot - u_spotCutoff) / (1.0 - u_spotCutoff);\n' +
// //   '    spotEffect = intensity;\n' +
// //   '  }\n' +
// //   '  vec3 diffuse = vec3(1.0, 1.0, 0.9) * vec3(gl_FragColor) * nDotL * spotEffect * 0.7;\n' +


// //   '  if (u_spotlightOn) {\n' +
// //   '    float spotEffect = 0.0;\n' +
// //   '    vec3 spotDir = normalize(u_spotDir);\n' +
// //   '    vec3 toFrag = normalize(vec3(v_VertPos) - u_spotPos);\n' +
// //   '    float spotDot = dot(toFrag, spotDir);\n' +
// //   '    if (spotDot > u_spotCutoff) {\n' +
// //   '      float intensity = (spotDot - u_spotCutoff) / (1.0 - u_spotCutoff);\n' +
// //   '      spotEffect = intensity;\n' +
// //   '    }\n' +
// //   '    vec3 diffuse = vec3(1.0, 1.0, 0.9) * vec3(gl_FragColor) * nDotL * spotEffect * 0.7;\n' +
// //   '  }\n' +

//   '  float spotEffect = 0.0;\n' +
//   '  if (u_spotlightOn) {\n' +
//     '    vec3 spotDir = normalize(u_spotDir);\n' +
//     '    vec3 toFrag = normalize(vec3(v_VertPos) - u_spotPos);\n' +
//     '    float spotDot = dot(toFrag, spotDir);\n' +
//     '    if (spotDot > u_spotCutoff) {\n' +
//     '      float intensity = (spotDot - u_spotCutoff) / (1.0 - u_spotCutoff);\n' +
//     '      spotEffect = intensity;\n' +
//     '    }\n' +
//     '  } else {\n' +
//     '    spotEffect = 1.0;\n' +  // spotlight off = full diffuse as normal
//   '  }\n' +
//     // '  vec3 diffuse = vec3(1.0, 1.0, 0.9) * vec3(gl_FragColor) * nDotL * spotEffect * 0.7;\n' +
//     // '  vec3 ambient = vec3(gl_FragColor) * 0.4;\n' +



// //   '  vec3 diffuse = vec3(gl_FragColor) * nDotL;\n' +
// //   '  vec3 diffuse = vec3(1, 1, 0.9) * vec3(gl_FragColor) * nDotL * 0.7;\n' +
// //   '  vec3 ambient = vec3(gl_FragColor) * 0.4;\n' +
// //   '  vec3 diffuse = vec3(1, 1, 0.9) * vec3(gl_FragColor) * nDotL * spotEffect * 2.0;\n' +
// //   '  vec3 ambient = vec3(gl_FragColor) * 0.2;\n' +

// // //   '  if (u_specular) {\n' +
// // //   '    gl_FragColor = vec4(specular + diffuse + ambient, 1.0);\n' +
// // //   '  } else {\n' +
// // //   '    gl_FragColor = vec4(diffuse + ambient, 1.0);\n' +
// // //   '  }\n' +

// // //   '  if (u_lightOn) {\n' +
// // //     '  if (u_whichTexture == 0) {\n' +
// // //     '    gl_FragColor = vec4(specular + diffuse + ambient, 1.0);\n' +
// // //     '  } else {\n' +
// // //     '    gl_FragColor = vec4(diffuse + ambient, 1.0);\n' +
// // //     '  }\n' +
// // //   '  }\n' +
// // //   '  if (u_lightOn) {\n' +
// // //   '    if (u_specular) {\n' +
// // //   '      gl_FragColor = vec4(specular + diffuse + ambient, 1.0);\n' +
// // //   '    } else {\n' +
// // //   '      gl_FragColor = vec4(diffuse + ambient, 1.0);\n' +
// // //   '    }\n' +
// // //   '  }\n' +
// //   '  if (u_lightOn || u_spotlightOn) {\n' +
// //   '    if (u_specular && u_lightOn) {\n' +
// //   '      gl_FragColor = vec4(specular + diffuse + ambient, 1.0);\n' +
// //   '    } else {\n' +
// //   '      gl_FragColor = vec4(diffuse + ambient, 1.0);\n' +
// //   '    }\n' +
// //   '  }\n' +

//   '  vec3 diffuse = vec3(1, 1, 0.9) * vec3(gl_FragColor) * nDotL * 0.7;\n' +
//   '  vec3 spotDiffuse = vec3(1, 1, 0.9) * vec3(gl_FragColor) * nDotL * spotEffect * 1.0;\n' +
//   '  vec3 ambient = vec3(gl_FragColor) * 0.2;\n' +

//   '  if (u_lightOn || u_spotlightOn) {\n' +
//   '    vec3 totalDiffuse = vec3(0.0, 0.0, 0.0);\n' +
//   '    if (u_lightOn) {\n' +
//   '      totalDiffuse += diffuse;\n' +
//   '    }\n' +
//   '    if (u_spotlightOn) {\n' +
//   '      totalDiffuse += spotDiffuse;\n' +
//   '    }\n' +
//   '    if (u_specular && u_lightOn) {\n' +
//   '      gl_FragColor = vec4(specular + totalDiffuse + ambient, 1.0);\n' +
//   '    } else {\n' +
//   '      gl_FragColor = vec4(totalDiffuse + ambient, 1.0);\n' +
//   '    }\n' +
//   '  }\n' +

//   '}\n';

var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n'+
  'varying vec3 v_Normal;\n'+
  'uniform vec4 u_FragColor;\n' +
  'uniform sampler2D u_Sampler0;\n' +
  'uniform sampler2D u_Sampler1;\n' +
  'uniform sampler2D u_Sampler2;\n' +
  'uniform int u_whichTexture;\n' +

  'uniform vec3 u_lightPos;\n' +
  'uniform vec3 u_cameraPos;\n' +
  'varying vec4 v_VertPos;\n'+
  'uniform bool u_specular;\n' +
  'uniform bool u_lightOn;\n' +
  'uniform vec3 u_spotDir;\n' +
  'uniform float u_spotCutoff;\n' +
  'uniform vec3 u_spotPos;\n' +
  'uniform bool u_spotlightOn;\n' +

  'void main() {\n' +
  '  if (u_whichTexture == -3) {\n' +
  '    gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);\n' +
  '  } else if (u_whichTexture == -2) {\n' +
  '    gl_FragColor = u_FragColor;\n' +
  '  } else if (u_whichTexture == -1) {\n' +
  '    gl_FragColor = vec4(v_UV, 1.0, 1.0);\n' +
  '  } else if (u_whichTexture == 0) {\n' +
  '    gl_FragColor = texture2D(u_Sampler0, v_UV);\n' +
  '  } else if (u_whichTexture == 1) {\n' +
  '    gl_FragColor = texture2D(u_Sampler1, v_UV);\n' +
  '  } else if (u_whichTexture == 2) {\n' +
  '    gl_FragColor = texture2D(u_Sampler2, v_UV);\n' +
  '  } else {\n' +
  '    gl_FragColor = vec4(1, 0.2, 0.2, 1);\n' +
  '  }\n' +

  // ── POINT LIGHT direction & N·L ──
  '  vec3 lightVector = u_lightPos - vec3(v_VertPos);\n' +
  '  float r = length(lightVector);\n' +
  '  vec3 L = normalize(lightVector);\n' +
  '  vec3 N = normalize(v_Normal);\n' +
  '  float nDotL = max(dot(N, L), 0.0);\n' +

  // ── SPOTLIGHT direction & its own N·L ──
  '  vec3 spotLightVector = u_spotPos - vec3(v_VertPos);\n' +
  '  vec3 L_spot = normalize(spotLightVector);\n' +
  '  float nDotL_spot = max(dot(N, L_spot), 0.0);\n' +

  // ── REFLECTION & SPECULAR (based on point light) ──
  '  vec3 R = reflect(-L, N);\n' +
  '  vec3 E = normalize(u_cameraPos - vec3(v_VertPos));\n' +
  '  float specular = pow(max(dot(E, R), 0.0), 64.0) * 0.8;\n' +

  // ── SPOTLIGHT CONE EFFECT ──
  '  float spotEffect = 0.0;\n' +
  '  if (u_spotlightOn) {\n' +
  '    vec3 spotDir = normalize(u_spotDir);\n' +
  '    vec3 toFrag = normalize(vec3(v_VertPos) - u_spotPos);\n' +
  '    float spotDot = dot(toFrag, spotDir);\n' +
  '    if (spotDot > u_spotCutoff) {\n' +
  '      float intensity = (spotDot - u_spotCutoff) / (1.0 - u_spotCutoff);\n' +
  '      spotEffect = intensity;\n' +
  '    }\n' +
  '  } else {\n' +
  '    spotEffect = 1.0;\n' +
  '  }\n' +

  // ── DIFFUSE TERMS (each light uses its own N·L) ──
  '  vec3 diffuse     = vec3(1, 1, 0.9) * vec3(gl_FragColor) * nDotL       * 0.7;\n' +
  '  vec3 spotDiffuse = vec3(1, 1, 0.9) * vec3(gl_FragColor) * nDotL_spot  * spotEffect * 1.0;\n' +
  '  vec3 ambient     = vec3(gl_FragColor) * 0.2;\n' +

  // ── COMBINE ──
  '  if (u_lightOn || u_spotlightOn) {\n' +
  '    vec3 totalDiffuse = vec3(0.0, 0.0, 0.0);\n' +
  '    if (u_lightOn) {\n' +
  '      totalDiffuse += diffuse;\n' +
  '    }\n' +
  '    if (u_spotlightOn) {\n' +
  '      totalDiffuse += spotDiffuse;\n' +
  '    }\n' +
  '    if (u_specular && u_lightOn) {\n' +
  '      gl_FragColor = vec4(specular + totalDiffuse + ambient, 1.0);\n' +
  '    } else {\n' +
  '      gl_FragColor = vec4(totalDiffuse + ambient, 1.0);\n' +
  '    }\n' +
  '  }\n' +

  '}\n';

// global variables:
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_specular;
let u_lightOn;
let u_spotDir;
let u_spotCutoff;
// let u_SkyViewMatrix;

// global angles:
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

let g_spotlightOn = true;
let u_spotlightOn;
let g_lightManual = false;

// cloud globals
// let g_clouds = [];
// const NUM_CLOUDS = 8;
// const CLOUD_Y = 0.5; // eye level height
// let g_allCloudsFound = false;
// let g_shimmerTime = 0;
// let g_shimmerStart = -1;
// let g_shimmerActive = false;

// add/delete clouds:
// user placed blocks - 32x32 grid storing stack height at each cell
// let g_blockMap = [];
// for (let i = 0; i < 32; i++) {
//     g_blockMap.push(new Array(32).fill(0));
// }

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

    // console.log(gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

}

function connectVariablesTOGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // var vShader = gl.createShader(gl.VERTEX_SHADER);
    // gl.shaderSource(vShader, VSHADER_SOURCE);
    // gl.compileShader(vShader);
    // console.log('Vertex shader log:', gl.getShaderInfoLog(vShader));

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    // Get the storage location of a_Normal
    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return;
    }

    // Get the storage location of the u_whichTexture
    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_whichTexture');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_lightPos
    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if (!u_lightPos) {
        console.log('Failed to get the storage location of u_lightPos');
        return;
    }

    // Get the storage location of u_lightOn
    u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
    if (!u_lightOn) {
        console.log('Failed to get the storage location of u_lightOn');
        return;
    }

    // Get the storage location of u_cameraPos
    u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    if (!u_cameraPos) {
        console.log('Failed to get the storage location of u_cameraPos');
        return;
    }

    // Get the storage location of u_specular
    u_specular = gl.getUniformLocation(gl.program, 'u_specular');
    if (!u_specular) {
        console.log('Failed to get the storage location of u_specular');
        return;
    }

    u_spotDir = gl.getUniformLocation(gl.program, 'u_spotDir');
    u_spotCutoff = gl.getUniformLocation(gl.program, 'u_spotCutoff');
    u_spotPos = gl.getUniformLocation(gl.program, 'u_spotPos');
    u_spotlightOn = gl.getUniformLocation(gl.program, 'u_spotlightOn');

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

    // Get the storage location of the u_ViewMatrix
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    // Get the storage location of the u_ProjectionMatrix
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }
    
    // Get the storage location of the u_Sampler0
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler1');
        return;
    }

    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
        console.log('Failed to get the storage location of u_Sampler2');
        return;
    }

    // set an initial value for this matrix to identity
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

    // Get the storage location of the u_ViewMatrix
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    // // Get the storage location of the u_SkyViewMatrix
    // u_SkyViewMatrix = gl.getUniformLocation(gl.program, 'u_SkyViewMatrix');
    // if (!u_SkyViewMatrix) {
    //     console.log('Failed to get the storage location of u_SkyViewMatrix');
    //     return;
    // }
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

// for lighting
let g_normalOn = false;
let g_lightPos = [0, 0.75, 0]
// g_lightPos[0] = Math.cos(g_seconds);
// g_lightPos[2] = Math.sin(g_seconds);
let g_lightOn = true;

// set up actions for the html ui elements
function addActionsForHtmlUI(){
    // normals on and off
    document.getElementById('normalOn').onclick = function() { g_normalOn=true; };
    document.getElementById('normalOff').onclick = function() { g_normalOn=false; };

    // light on and off
    document.getElementById('lightOn').onclick = function() { g_lightOn=true; };
    document.getElementById('lightOff').onclick = function() { g_lightOn=false; };

    document.getElementById('spotlightOn').onclick  = function() { g_spotlightOn = true; };
    document.getElementById('spotlightOff').onclick = function() { g_spotlightOn = false; };
    
    document.getElementById('lightSlideX').addEventListener('input', function() {
        g_lightManual = true;
        g_lightPos[0] = this.value/100;
        renderScene();
    });

    // light slides
    // document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) { g_lightPos[0] = this.value/100; renderScene();} });
    // document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) { g_lightPos[1] = this.value/100; renderScene();} });
    // document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) { g_lightPos[2] = this.value/100; renderScene();} });

    // document.getElementById('lightSlideX').addEventListener('input', function() { g_lightPos[0] = this.value/100; renderScene(); });
    document.getElementById('lightSlideY').addEventListener('input', function() { g_lightPos[1] = this.value/100; renderScene(); });
    document.getElementById('lightSlideZ').addEventListener('input', function() { g_lightPos[2] = this.value/100; renderScene(); });

    // walking on and off
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

function initTextures(gl, n){
    // Create an image object on the gpu (the func tells gl to do that)
    var image0 = new Image();
    if (!image0) {
        console.log('Failed to create the image object');
        return false;
    }
    // Register the event handler to be called on loading an image
    // image.onload = function(){ sendImageToTEXTURE0(gl, n, texture, u_Sampler0, image); };
    image0.onload = function(){ sendImageToTEXTURE0(image0); };
    // Tell the browser to load an image
    image0.src = 'sky2.jpeg';

    // texture 1 - ground/whatever
    var image1 = new Image();
    if (!image0) {
        console.log('Failed to create the image object');
        return false;
    }
    image1.onload = function(){ sendImageToTEXTURE1(image1); };
    image1.src = 'jup_160.jpg';  // ← your second image here

    // texture 2 - paisley
    var image2 = new Image();
    image2.onload = function(){ sendImageToTEXTURE2(image2); };
    image2.src = 'paisley_160.jpg';

    return true;
}

// can replicate this function to add more textures later:
function sendImageToTEXTURE0(image){
    console.log('u_Sampler0:', u_Sampler0); // should not be null
    // Create a texture object
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    // flip the image's y-axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // Enable the texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);  // add
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);  // add
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);

    console.log('u_Sampler0:', u_Sampler0); // should not be null

    console.log('finished sendImageToTEXTURE0');
}

function sendImageToTEXTURE1(image) {
    var texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler1, 1);
}

function sendImageToTEXTURE2(image) {
    var texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler2, 2);
}

// function initClouds() {
//     for (let i = 0; i < NUM_CLOUDS; i++) {
//         g_clouds.push({
//             x: (Math.random() - 0.5) * 7,
//             z: (Math.random() - 0.5) * 7,
//             angle: Math.random() * 360,
//             turnTimer: 2 + Math.random() * 3,
//             speed: 0.001 + Math.random() * 0.001,
//             color: [1.0, 1.0, 1.0, 1.0],   // start white
//             touched: false
//         });
//     }
// }

// function updateClouds() {
//     let bound = 4.0;

//     for (let c of g_clouds) {
//         // count down to next turn
//         c.turnTimer -= c.speed;
//         if (c.turnTimer <= 0) {
//             c.angle = Math.random() * 360;
//             c.turnTimer = 2 + Math.random() * 3;
//         }

//         // move in current direction
//         let rad = c.angle * Math.PI / 180;
//         let nextX = c.x + Math.cos(rad) * c.speed * 2;
//         let nextZ = c.z + Math.sin(rad) * c.speed * 2;

//         // bounce off walls
//         if (nextX < -bound || nextX > bound) {
//             c.angle = 180 - c.angle;
//             rad = c.angle * Math.PI / 180;
//             nextX = c.x + Math.cos(rad) * c.speed * 5;
//             nextZ = c.z + Math.sin(rad) * c.speed * 5;
//         }
//         if (nextZ < -bound || nextZ > bound) {
//             c.angle = -c.angle;
//             rad = c.angle * Math.PI / 180;
//             nextX = c.x + Math.cos(rad) * c.speed * 5;
//             nextZ = c.z + Math.sin(rad) * c.speed * 5;
//         }

//         c.x = nextX;
//         c.z = nextZ;

//         // collision check with camera eye
//         let dx = camera.eye.elements[0] - c.x;
//         let dz = camera.eye.elements[2] - c.z;
//         let dist = Math.sqrt(dx*dx + dz*dz);

//         if (dist < 0.4) {
//             // pick a new random color on touch
//             if (!c.touched) {
//                 c.color = [Math.random(), Math.random(), Math.random(), 1.0];
//                 c.touched = true;
//             }
//         } else {
//             c.touched = false;
//         }
//     }
//     checkAllCloudsFound();
// }

// function checkAllCloudsFound() {
//     if (g_shimmerActive) return; // shimmer already running, don't retrigger
    
//     let allTouched = g_clouds.every(c => 
//         c.color[0] != 1.0 || c.color[1] != 1.0 || c.color[2] != 1.0
//     );
//     if (allTouched) {
//         g_shimmerActive = true;
//         g_shimmerStart = g_seconds;
//     }
// }

function worldToMap(wx, wz) {
    // inverse of: translate(x-16) * scale(0.3)
    let mx = Math.floor(wx / 0.3 + 16);
    let mz = Math.floor(wz / 0.3 + 16);
    return [mx, mz];
}

function getBlockInFront() {
    // get the forward direction from camera
    let fx = camera.at.elements[0] - camera.eye.elements[0];
    let fz = camera.at.elements[2] - camera.eye.elements[2];
    let len = Math.sqrt(fx*fx + fz*fz);
    fx /= len;
    fz /= len;

    // step one block ahead of the camera
    let targetX = camera.eye.elements[0] + fx * 0.3 * 2;
    let targetZ = camera.eye.elements[2] + fz * 0.3 * 2;

    let [mx, mz] = worldToMap(targetX, targetZ);

    // clamp to valid range, avoid border walls
    mx = Math.max(1, Math.min(30, mx));
    mz = Math.max(1, Math.min(30, mz));

    return [mx, mz];
}

function placeBlock() {
    let [mx, mz] = getBlockInFront();
    if (g_blockMap[mx][mz] < 5) { // max stack height of 5
        g_blockMap[mx][mz]++;
        console.log('placed block at', mx, mz, 'height:', g_blockMap[mx][mz]);
    }
}

function deleteBlock() {
    let [mx, mz] = getBlockInFront();
    if (g_blockMap[mx][mz] > 0) {
        g_blockMap[mx][mz]--;
        console.log('removed block at', mx, mz, 'height:', g_blockMap[mx][mz]);
    }
}

async function main() {
    // set up canvas and gl vars
    setupWebGL();

    // set up GLSL shader programs and connect GLSL vars
    connectVariablesTOGLSL();

    // set up actions for the html ui elements
    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    // canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position, u_FragColor) };
    // simplified: 
    // canvas.onmousedown = click;
    // // if button is held down, draw on mouse move
    // canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } }

    // instantiate camera
    camera = new Camera();
    // initClouds();

    document.onkeydown = keydown;

    initTextures();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.2, 0.0, 1.0);

    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // render
    // renderScene();
    requestAnimationFrame(tick);
    // g_objMesh = await loadOBJ('yourmodel.obj');
    g_objMesh = await loadOBJ('QuickMapleOptimized.obj');
    console.log(g_objMesh); // should show { buf: WebGLBuffer, count: 1234 }
    if (g_objMesh && g_objMesh.count > 0) {
        gl.uniform1i(u_specular, false);
        var m = new Matrix4();
        m.translate(0, -0.5, -1);
        m.scale(0.001, 0.001, 0.001);
        drawOBJ(g_objMesh, m, [0.2, 0.5, 0.1, 1.0]);  // green color, no texture
    }
}

var g_shapesList = [];

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
    
    // update clouds
    // updateClouds();

    // if (g_shimmerActive) {
    //     if (g_seconds - g_shimmerStart < 10.0) {
    //         g_shimmerTime += 0.05;
    //     } else {
    //         g_shimmerTime   = 0;
    //         g_shimmerActive = false; // shimmer done
    //         g_shimmerStart  = -1;
    //         // reset clouds back to white so player can do it again
    //         for (let c of g_clouds) {
    //             c.color   = [1.0, 1.0, 1.0, 1.0];
    //             c.touched = false;
    //         }
    //     }
    // }

    // tell the browser to update again when it has time
    requestAnimationFrame(tick);
}

// function tick() {
//     g_seconds = performance.now()/1000.0 - g_startTime;
//     updateAnimationAngles();
//     updateClouds();

//     if (g_shimmerActive) {
//         if (g_seconds - g_shimmerStart < 5.0) {
//             g_shimmerTime += 0.05;
//         } else {
//             g_shimmerTime   = 0;
//             g_shimmerActive = false; // shimmer done
//             g_shimmerStart  = -1;
//             // reset clouds back to white so player can do it again
//             for (let c of g_clouds) {
//                 c.color   = [1.0, 1.0, 1.0, 1.0];
//                 c.touched = false;
//             }
//         }
//     }

//     renderScene();
//     requestAnimationFrame(tick);
// }

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

    // for lighting - makes it move back and forth
    // but this can be changed to be like a sun
    // g_lightPos[0] = Math.cos(g_seconds);
    if (!g_lightManual) {
        g_lightPos[0] = Math.cos(g_seconds);
    }
}

// function keydown(ev) {
//     if (ev.keyCode == 83) { // w - forward
//         g_eye[2] += 0.2;
//     }
//     if (ev.keyCode == 87) { // s - backward
//         g_eye[2] -= 0.2;
//     }
//     if (ev.keyCode == 68) { // d - right
//         g_eye[0] += 0.2;
//     }
//     if (ev.keyCode == 65) { // s - left
//         g_eye[0] -= 0.2;
//     }
//     renderScene();
//     console.log(ev.keyCode);
// }

function keydown(ev) {
    switch(ev.keyCode) {
        case 87: camera.moveForward();   break; // W
        case 83: camera.moveBackwards(); break; // S
        case 65: camera.moveLeft();      break; // A
        case 68: camera.moveRight();     break; // D
        case 81: camera.panLeft();       break; // Q - pan left
        case 69: camera.panRight();      break; // E - pan right
        case 80: placeBlock();           break; // F - place
        case 79: deleteBlock();          break; // R - remove
    }
    renderScene();
}

// // replace the following with camera.js stuff:
// var g_eye=[0,0,2];
// var g_at=[0,0,-100];
// var g_up=[0,1,0];
var camera;

// var g_map = [
//     [1, 1, 1, 1, 1, 1, 1, 1],
//     [1, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 1, 1, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 1, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 1],
// ];

// 32 x 32
var g_map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// // can make more walls/ bigger - end of vid 3.10
// function drawMap() {
//     for (x=0; x<8; x++){
//         for (y=0; y<8; y++){
//             // console.log(x,y);
//             if (g_map[x][y] == 1){
//                 var toDraw = new Cube();
//                 toDraw.color = [1, 1, 1, 1];
//                 toDraw.matrix.translate(x-4, -0.75, y-4);
//                 toDraw.render();
//             }
//         }
//     }
// }

// function drawMap() {
//     for (x=0; x<32; x++){
//         for (y=0; y<32; y++){
//             // console.log(x,y);
//             if (x == 0 || x == 31 || y == 0 || y == 31) {
//                 var toDraw = new Cube();
//                 toDraw.color = [0.8, 1, 1, 1];
//                 toDraw.matrix.translate(0, -0.65, 0);
//                 toDraw.matrix.scale(0.3, 0.3, 0.3);
//                 toDraw.matrix.translate(x-16, 0, y-16);
//                 // toDraw.render();
//                 toDraw.renderFast();
//             }
//         }
//     }
// }

// function drawMap() {
//     for (let x = 0; x < 32; x++) {
//         for (let y = 0; y < 32; y++) {
//             if (x == 0 || x == 31 || y == 0 || y == 31) {

//                 // base layer - always draw
//                 drawCloudBlock(x, 0, y, 1.0);

//                 // second layer - most blocks
//                 if ((x + y) % 2 == 0 || x == 0 || x == 31 || y == 0 || y == 31) {
//                     drawCloudBlock(x, 1, y, 0.97);
//                 }

//                 // third layer - checkerboard pattern
//                 if ((x * y) % 3 == 0) {
//                     drawCloudBlock(x, 2, y, 0.94);
//                 }

//                 // fourth layer - sparse
//                 if ((x + y * 2) % 5 == 0) {
//                     drawCloudBlock(x, 3, y, 0.91);
//                 }

//                 // fifth layer - very sparse peaks
//                 if ((x * 3 + y) % 7 == 0) {
//                     drawCloudBlock(x, 4, y, 0.88);
//                 }

//                 // offset blocks to fill gaps and look fluffy
//                 if (x % 2 == 0) {
//                     drawCloudBlockOffset(x, 1, y,  0.15, 0, 0,    0.95);
//                     drawCloudBlockOffset(x, 2, y,  0.15, 0, 0.15, 0.92);
//                 }
//                 if (y % 2 == 0) {
//                     drawCloudBlockOffset(x, 1, y,  0, 0, 0.15,    0.95);
//                     drawCloudBlockOffset(x, 2, y, -0.15, 0, 0.15, 0.92);
//                 }
//                 if ((x + y) % 3 == 0) {
//                     drawCloudBlockOffset(x, 3, y,  0.1, 0, 0.1,   0.90);
//                 }
//             }
//         }
//     }
// }

// function getShimmerColor(brightness, x, layer, y) {
//     if (!g_shimmerActive) {
//         return [brightness, brightness, brightness, 1];
//     }

//     // each block gets a slightly different phase so they shimmer independently
//     let phase = (x * 3 + layer * 7 + y * 5) * 0.3;
//     let shimmer = 0.5 + 0.5 * Math.sin(g_shimmerTime * 3.0 + phase);

//     // rainbow shimmer using offset sine waves
//     let r = brightness * (0.6 + 0.4 * Math.sin(g_shimmerTime * 2.0 + phase));
//     let g = brightness * (0.6 + 0.4 * Math.sin(g_shimmerTime * 2.0 + phase + 2.094));
//     let b = brightness * (0.6 + 0.4 * Math.sin(g_shimmerTime * 2.0 + phase + 4.189));

//     return [r, g, b, 1];
// }

// function drawCloudBlock(x, layer, y, brightness) {
//     var color = getShimmerColor(brightness, x, layer, y);
//     var toDraw = new Cube();
//     toDraw.color = color;
//     toDraw.matrix.translate(0, -0.65 + layer * 0.3, 0);
//     toDraw.matrix.scale(0.3, 0.3, 0.3);
//     toDraw.matrix.translate(x - 16, 0, y - 16);
//     toDraw.renderFast();
// }

// function drawCloudBlockOffset(x, layer, y, ox, oy, oz, brightness) {
//     var color = getShimmerColor(brightness, x, layer, y);
//     var toDraw = new Cube();
//     toDraw.color = color;
//     toDraw.matrix.translate(ox, -0.65 + layer * 0.3 + oy, oz);
//     toDraw.matrix.scale(0.25, 0.25, 0.25);
//     toDraw.matrix.translate(x - 16, 0, y - 16);
//     toDraw.renderFast();
// }

// could add collision detection by keeping track of where your eye level is at
// and you know in your map where there's supposed to be a cube or not
// and thwn you hit the forward key, don't go there

let g_objMesh = null;

// async function loadOBJ(url) {
//     const text = await (await fetch(url)).text();
//     const verts = [], normals = [], out = [];

//     for (const line of text.split('\n')) {
//         const p = line.trim().split(/\s+/);
//         if (p[0] === 'v')  verts.push([+p[1], +p[2], +p[3]]);
//         if (p[0] === 'vn') normals.push([+p[1], +p[2], +p[3]]);
//         if (p[0] === 'f') {
//             const face = p.slice(1).map(x => x.split('/').map(Number));
//             for (let i = 1; i < face.length - 1; i++) {
//                 for (const v of [face[0], face[i], face[i+1]]) {
//                     out.push(...verts[v[0]-1], ...normals[v[2]-1] || [0,1,0]);
//                 }
//             }
//         }
//     }

//     const buf = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, buf);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(out), gl.STATIC_DRAW);
//     return { buf, count: out.length / 6 };
// }

// function drawOBJ(mesh, matrix, color) {
//     gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
//     gl.uniform1i(u_whichTexture, -2);
//     gl.uniform4f(u_FragColor, ...color);

//     gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buf);
//     gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 24, 0);
//     gl.enableVertexAttribArray(a_Position);
//     gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 24, 12);
//     gl.enableVertexAttribArray(a_Normal);

//     // dummy UV so the shader doesn't break
//     gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 24, 0);

//     gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
// }

async function loadOBJ(url) {
    const text = await (await fetch(url)).text();
    const verts = [], normals = [], uvs = [], out = [];

    for (const line of text.split('\n')) {
        const p = line.trim().split(/\s+/);
        if (p[0] === 'v')  verts.push([+p[1], +p[2], +p[3]]);
        if (p[0] === 'vn') normals.push([+p[1], +p[2], +p[3]]);
        if (p[0] === 'vt') uvs.push([+p[1], +p[2]]);
        if (p[0] === 'f') {
            const face = p.slice(1).map(x => x.split('/').map(n => n === '' ? undefined : Number(n)));
            for (let i = 1; i < face.length - 1; i++) {
                for (const v of [face[0], face[i], face[i+1]]) {
                    const pos = verts[v[0]-1] || [0,0,0];
                    const uv  = (v[1] !== undefined) ? (uvs[v[1]-1] || [0,0]) : [0,0];
                    const nor = (v[2] !== undefined) ? (normals[v[2]-1] || [0,1,0]) : [0,1,0];
                    out.push(...pos, ...uv, ...nor); // 3+2+3 = 8 floats
                }
            }
        }
    }

    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,minZ=Infinity,maxZ=-Infinity;
    for (let i = 0; i < out.length; i += 8) {
        minX=Math.min(minX,out[i]);   maxX=Math.max(maxX,out[i]);
        minY=Math.min(minY,out[i+1]); maxY=Math.max(maxY,out[i+1]);
        minZ=Math.min(minZ,out[i+2]); maxZ=Math.max(maxZ,out[i+2]);
    }
    console.log('OBJ bounds X:', minX, maxX, 'Y:', minY, maxY, 'Z:', minZ, maxZ);
    console.log('OBJ vertex count:', out.length / 8);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(out), gl.STATIC_DRAW);
    return { buf, count: out.length / 8 }; // 8 floats per vertex
}

function drawOBJ(mesh, matrix, color) {
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
    gl.uniform1i(u_whichTexture, -2);
    gl.uniform4f(u_FragColor, ...color);

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buf);
    // stride = 8 floats * 4 bytes = 32
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 32, 12);  // offset 12 bytes
    gl.enableVertexAttribArray(a_UV);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 32, 20); // offset 20 bytes
    gl.enableVertexAttribArray(a_Normal);

    gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
}

function renderScene() {
    var startTime = performance.now();

    var projMat = new Matrix4();
    projMat.setPerspective(70, canvas.width/canvas.height, 1, 100);
    // projMat.setPerspective(70, canvas.width/canvas.height, 0.1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    // var viewMat = new Matrix4();
    // viewMat.setLookAt(0,0,2,   0,0,-100,  0,1,0);
    // viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
    // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(
        camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
        camera.at.elements[0],  camera.at.elements[1],  camera.at.elements[2],
        camera.up.elements[0],  camera.up.elements[1],  camera.up.elements[2]
    );
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    // gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projectionMatrix.elements);
    // gl.uniformMatrix4fv(u_ViewMatrix,       false, camera.viewMatrix.elements);

    // ── Global rotation (camera angle slider) ──
    // var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);

    var globalRotMat = new Matrix4()
        .rotate(g_globalAngle, 0, -1, 0)   // slider
        .rotate(g_globalYAngle, 1, 0, 0)   // slider
        .rotate(g_mouseX, 0, 1, 0)        // mouse left/right → Y rotation
        .rotate(g_mouseY, 1, 0, 0);       // mouse up/down → X rotation
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // drawMap();

    // pass light and camera position to GLSL
    gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    gl.uniform3f(u_cameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);

    // pass the light status
    gl.uniform1i(u_lightOn, g_lightOn);

    // ─────────────────────────────────────────────
    //  OBJ - TREE
    // ─────────────────────────────────────────────

    // if (g_objMesh) {
    //     gl.uniform1i(u_specular, true);
    //     var m = new Matrix4();
    //     m.translate(0, 0, -1);
    //     m.scale(0.5, 0.5, 0.5);
    //     drawOBJ(g_objMesh, m, [0.6, 0.8, 1.0, 1.0]);
    // }
    if (g_objMesh) {
        gl.uniform1i(u_specular, true);
        var m = new Matrix4();
        m.translate(-1.2, -0.665, -1.5);        // same Y as your ground plane
        m.scale(0.007, 0.007, 0.007);      // 144 * 0.007 ≈ 1.0 unit tall
        m.translate(-0, -0, -0);           // model base is already near Y=0, so no extra offset needed
        drawOBJ(g_objMesh, m, [0.3, 0.6, 0.15, 1.0]);
    }

    // ─────────────────────────────────────────────
    //  SPOTLIGHT
    // ─────────────────────────────────────────────
    // // Points straight down; adjust [x, y, z] to aim it anywhere
    // gl.uniform3f(u_spotDir, 0.0, -1.0, 0.0);

    // // cos(30°) ≈ 0.866 — smaller = wider cone, larger = narrower
    // gl.uniform1f(u_spotCutoff, 0.866);
    gl.uniform3f(u_spotPos, 0.0, 3.0, 0.0);

    // aim straight down at origin
    let sdx = 0.0;
    let sdy = -1.0;
    let sdz = 0.0;
    let sdLen = Math.sqrt(sdx*sdx + sdy*sdy + sdz*sdz);
    gl.uniform3f(u_spotDir, sdx/sdLen, sdy/sdLen, sdz/sdLen);

    // wide cone so it covers the whole scene
    gl.uniform1f(u_spotCutoff, 0.5); // ~60° cone

    gl.uniform1i(u_spotlightOn, g_spotlightOn);

    // ─────────────────────────────────────────────
    //  LIGHT
    // ─────────────────────────────────────────────

    var light = new Cube();
    light.color = [2, 2, 0, 1];
    light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    light.matrix.scale(-0.1, -0.1, -0.1);
    light.matrix.translate(-0.5, -0.5,-0.5);
    light.render();

    // ─────────────────────────────────────────────
    //  SPHERE
    // ─────────────────────────────────────────────
    gl.uniform1i(u_specular, true);
    var sphere = new Sphere();
    sphere.color = [1, 0, 0, 1];
    sphere.textureNum = 2;
    if (g_normalOn) sphere.textureNum = -3;
    sphere.matrix.scale(0.5, 0.5, 0.5);
    sphere.matrix.translate(2, 0.5, -1);
    sphere.render();

    // ─────────────────────────────────────────────
    //  GROUND
    // ─────────────────────────────────────────────
    gl.uniform1i(u_specular, false);

    var ground = new Cube();
    ground.color = [0.1, 0.4, 0.2, 1.0];
    ground.textureNum = -2;
    ground.matrix.translate(0, -0.665, 9.65);
    ground.matrix.scale(10, 0, 10);
    ground.matrix.translate(-0.5, 0, -0.5);
    ground.render();

    // ─────────────────────────────────────────────
    //  SKY
    // ─────────────────────────────────────────────

    var sky = new Cube();
    sky.color = [1.0, 0.0, 0.0, 1.0];
    sky.textureNum = 1;
    if (g_normalOn) sky.textureNum = -3;
    // sky.color[0, 1, 1, 1];
    sky.matrix.scale(-5, -5, -5);
    sky.matrix.translate(-0.5,-0.75,0.5);
    sky.render();

    // // ─────────────────────────────────────────────
    // //  CLOUDS
    // // ─────────────────────────────────────────────
    // function drawClouds() {
    //     for (let c of g_clouds) {
    //         var cloud = new Cube();
    //         cloud.color = c.color;
    //         cloud.matrix.translate(c.x - 0.15, CLOUD_Y, c.z - 0.15);
    //         cloud.matrix.scale(0.3, 0.15, 0.3);
    //         cloud.render();
    
    //         // second block offset to make it look cloudier
    //         var cloud2 = new Cube();
    //         cloud2.color = c.color;
    //         cloud2.matrix.translate(c.x - 0.1, CLOUD_Y + 0.12, c.z - 0.1);
    //         cloud2.matrix.scale(0.2, 0.12, 0.2);
    //         cloud2.render();
    //     }
    // }

    // // ─────────────────────────────────────────────
    // //  PLACE CLOUDS
    // // ─────────────────────────────────────────────
    // function drawPlacedBlocks() {
    //     for (let x = 0; x < 32; x++) {
    //         for (let z = 0; z < 32; z++) {
    //             let height = g_blockMap[x][z];
    //             for (let layer = 0; layer < height; layer++) {
    //                 drawCloudBlock(x, layer, z, 0.95);
    
    //                 // offset blocks for fluffy look, same as walls
    //                 if (x % 2 == 0) {
    //                     drawCloudBlockOffset(x, layer, z,  0.15, 0,  0,    0.92);
    //                     drawCloudBlockOffset(x, layer, z,  0.15, 0,  0.15, 0.90);
    //                 }
    //                 if (z % 2 == 0) {
    //                     drawCloudBlockOffset(x, layer, z,  0,    0,  0.15, 0.92);
    //                     drawCloudBlockOffset(x, layer, z, -0.15, 0,  0.15, 0.90);
    //                 }
    //             }
    //         }
    //     }
    // }

    // ─────────────────────────────────────────────
    //  BODY
    // ─────────────────────────────────────────────
    gl.uniform1i(u_specular, true);

    var body = new Cube();
    body.textureNum = -2;
    body.color = [0.9, 0.65, 0.13, 1.0];
    // body.textureNum = -1;
    if (g_normalOn) body.textureNum = -3;
    body.matrix.translate(-0.25, -0.22, 0.25);
    body.matrix.scale(0.5, 0.35, 0.75);
    body.render();

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

    // call drawClouds:
    // drawClouds();

    // draw blocks placed by user
    // drawPlacedBlocks();

    var duration = performance.now() - startTime;
    sendTextToHTML('fps: ' + Math.floor(10000/duration)/10, "object");

    // if (g_allCloudsFound) {
    //     sendTextToHTML('✨ All clouds found! ✨', 'object2'); // ← needs a second html element
    // } else {
    //     let remaining = g_clouds.filter(c => c.color[0] == 1.0 && c.color[1] == 1.0 && c.color[2] == 1.0).length;
    //     sendTextToHTML('Clouds remaining: ' + remaining, 'object2');
    // }
}

function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if (!htmlID) {
        console.log('Failed to get ' + htmlID + ' from HTML');
        return;
    }
    htmlElm.innerHTML = text;
}