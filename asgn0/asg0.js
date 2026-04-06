// asg0.js

var canvas = document.getElementById('cnv1');
var ctx = canvas.getContext('2d');

function main() {
    // Retrieve <canvas> element                                  <- (1)
    // var canvas = document.getElementById('cnv1');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Get the rendering context for 2DCG                          <- (2)
    // var ctx = canvas.getContext('2d');

    // Draw a blue rectangle                                       <- (3)
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

    drawVector(v1, "red")
}

// instantiate a vector v1
let v1 = new Vector3([2.25, 2.25, 0.0]);
let v2 = new Vector3([2.25, 2.25, 0.0]);

function drawVector(v, color){
    // let v1 = document.getElementById("name").value;
    // console.log(v1);

    let cx = canvas.width / 2;
    let cy = canvas.height / 2;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + v.elements[0] * 20, cy - v.elements[1] * 20);
    ctx.stroke();
}

function handleDrawEvent(){
    // v1:
    let x = parseFloat(document.getElementById("x").value);
    let y = parseFloat(document.getElementById("y").value);

    // console.log(v1);
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let v1 = new Vector3([x, y, 0.0]);
    drawVector(v1, "red");

    // v2:
    let x2 = parseFloat(document.getElementById("x2").value);
    let y2 = parseFloat(document.getElementById("y2").value);

    let v2 = new Vector3([x2, y2, 0.0]);
    drawVector(v2, "blue");
}

function angleBetween(v1, v2) {
    let dot = Vector3.dot(v1, v2);
    let mag1 = v1.magnitude();
    let mag2 = v2.magnitude();

    if (mag1 === 0 || mag2 === 0) {
        console.log("Error: cannot compute angle with zero vector");
        return 0;
    }

    let cosAlpha = dot / (mag1 * mag2);

    // clamp to [-1, 1] to avoid floating point errors in acos
    cosAlpha = Math.max(-1, Math.min(1, cosAlpha));

    let alpha = Math.acos(cosAlpha); // result in radians
    return alpha * (180 / Math.PI); // convert to degrees
}

function areaTriangle(v1, v2) {
    let cross = Vector3.cross(v1, v2);
    return cross.magnitude() / 2;
}

function handleDrawOperationEvent(){
    // v1:
    let x = parseFloat(document.getElementById("x").value);
    let y = parseFloat(document.getElementById("y").value);

    // console.log(v1);
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let v1 = new Vector3([x, y, 0.0]);
    drawVector(v1, "red");

    // v2:
    let x2 = parseFloat(document.getElementById("x2").value);
    let y2 = parseFloat(document.getElementById("y2").value);

    let v2 = new Vector3([x2, y2, 0.0]);
    drawVector(v2, "blue");

    // operations:
    let scaleNum = parseFloat(document.getElementById("scalar").value);

    let getOp = document.getElementById("op").value;
    if (getOp === "Add"){
        // console.log("getOp value:", getOp);
        let v3 = new Vector3();
        v3.set(v1);
        v3.add(v2);
        drawVector(v3, "green");
    } else if (getOp === "Subtract"){
        let v3 = new Vector3();
        v3.set(v1);
        v3.sub(v2);
        drawVector(v3, "green");
    } else if (getOp === "Multiply"){
        let v3 = new Vector3();
        v3.set(v1);
        let v4 = new Vector3();
        v4.set(v2);
        v3.mul(scaleNum);
        v4.mul(scaleNum);
        drawVector(v3, "green");
        drawVector(v4, "green");
    } else if (getOp === "Divide"){
        let v3 = new Vector3();
        v3.set(v1);
        let v4 = new Vector3();
        v4.set(v2);
        v3.div(scaleNum);
        v4.div(scaleNum);
        drawVector(v3, "green");
        drawVector(v4, "green");
    } else if (getOp === "Magnitude"){
        // console.log("magnitude branch reached");
        let v1mag = v1.magnitude()
        let v2mag = v2.magnitude()
        console.log("Magnitude v1:", v1mag);
        console.log("Magnitude v2:",v2mag);
    } else if (getOp === "Normalize"){
        let v3 = new Vector3();
        v3.set(v1);
        let v4 = new Vector3();
        v4.set(v2);
        v3.normalize();
        v4.normalize();
        drawVector(v3, "green");
        drawVector(v4, "green");
    } else if (getOp === "angleBetween"){
        let ang = angleBetween(v1, v2);
        console.log("Angle: ", ang);
    } else if (getOp === "Area"){
        let area = areaTriangle(v1, v2);
        console.log("Area of the triangle:", area);
    }
}
