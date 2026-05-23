function drawPicture() {
    // Set the color (r, g, b, a) — this one is red
    gl.uniform4f(u_FragColor, 0.4, 0.15, 0.0, 1.0);

    // Draw a triangle by passing 6 values: x1,y1, x2,y2, x3,y3
    // Coordinates are in WebGL space: range -1.0 to 1.0
    
    // body:
    drawTriangle([-0.6, 0.4,  0.6, 0.4,  0.6, -0.2]);
    drawTriangle([-0.6, -0.2,  -0.6, 0.4,  0.6, -0.2]);

    // face background
    gl.uniform4f(u_FragColor, 0.5, 0.3, 0.1, 1.0);
    drawTriangle([-0.65, 0.45,  -0.25, 0.45,  -0.25, 0.0]);
    drawTriangle([-0.65, 0.45,  -0.65, 0.0,  -0.25, 0.0]);

    // M
    // gl.uniform4f(u_FragColor, 0.3, 0.14, 0.0, 1.0);
    gl.uniform4f(u_FragColor, 0.2, 0.12, 0.0, 1.0);
    drawTriangle([-0.65, 0.45,  -0.6, 0.4,  -0.65, 0.0]);
    drawTriangle([-0.25, 0.45,  -0.3, 0.4,  -0.25, 0.0]);
    drawTriangle([-0.65, 0.45,  -0.65, 0.35,  -0.445, 0.25]);
    drawTriangle([-0.25, 0.45,  -0.455, 0.25,  -0.25, 0.35]);

    // face features
    drawTriangle([-0.5, 0.18, -0.4, 0.18, -0.45, 0.13]);
    gl.uniform4f(u_FragColor, 0.45, 0.2, 0.1, 1.0);
    // eyes
    drawTriangle([-0.5, 0.26, -0.6, 0.26, -0.55, 0.2]);
    drawTriangle([-0.3, 0.26, -0.4, 0.26, -0.35, 0.2]);
    // mouth
    drawTriangle([-0.55, 0.04, -0.35, 0.04, -0.45, 0.09]);
    // nose
    gl.uniform4f(u_FragColor, 0.1, 0.1, 0.1, 1.0);
    drawTriangle([-0.5, 0.18, -0.4, 0.18, -0.45, 0.13]);
    // ears
    gl.uniform4f(u_FragColor, 0.5, 0.3, 0.1, 1.0);

    drawTriangle([-0.65, 0.42,  -0.55, 0.45,  -0.65, 0.55]);
    drawTriangle([-0.25, 0.42,  -0.35, 0.45,  -0.25, 0.55]);

    // Y
    gl.uniform4f(u_FragColor, 0.2, 0.12, 0.0, 1.0);
    drawTriangle([0.4, 0.4,  0.8, 0.4,  0.6, 0.15]);
    drawTriangle([0.5, -0.2,  0.6, -0.2,  0.6, 0.15]);
    gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0);
    drawTriangle([0.45, 0.4,  0.75, 0.4,  0.6, 0.25]);

    
    // front feet - 0.15 wide
    gl.uniform4f(u_FragColor, 0.5, 0.3, 0.1, 1.0);
    drawTriangle([-0.6, -0.2, -0.45, -0.2, -0.45, -0.35,]);
    drawTriangle([-0.2, -0.2, -0.35, -0.2, -0.2, -0.35,]);

    gl.uniform4f(u_FragColor, 0.45, 0.2, 0.1, 1.0);
    drawTriangle([-0.6, -0.2, -0.65, -0.35, -0.45, -0.35,]);
    drawTriangle([-0.35, -0.2, -0.4, -0.35, -0.2, -0.35,]);

    // back feet
    gl.uniform4f(u_FragColor, 0.5, 0.3, 0.1, 1.0);
    drawTriangle([0.2, -0.2, 0.35, -0.2, 0.35, -0.35,]);
    drawTriangle([0.6, -0.2, 0.45, -0.2, 0.6, -0.35,]);
    
    gl.uniform4f(u_FragColor, 0.45, 0.2, 0.1, 1.0);
    drawTriangle([0.2, -0.2, 0.15, -0.35, 0.35, -0.35,]);
    drawTriangle([0.45, -0.2, 0.4, -0.35, 0.6, -0.35,]);
}