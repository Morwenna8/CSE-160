class Cube{
    // constructor
    constructor(){
        this.type='cube'; // doesn't do anything - just helps us debug
        // this.position = [0.0, 0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 5.0;
        // this.segments = 10;
        this.matrix = new Matrix4();
    }

    // render this shape
    render() {
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // // front of cube
        // drawTriangle3D([0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0]);
        // drawTriangle3D([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0]);

        // // top of cube
        // drawTriangle3D([0.0, 1.0, 0.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0]);
        // drawTriangle3D([0.0, 1.0, 0.0,  1.0, 1.0, 1.0,  1.0, 1.0, 0.0]);

        // other sides of the cube: top, bottom, left, right, back
        
        // Front face (z=0)
        drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
        drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);

        // Back face (z=-1)
        drawTriangle3D([0,0,-1, 1,0,-1, 1,1,-1]);
        drawTriangle3D([0,0,-1, 1,1,-1, 0,1,-1]);
        
        // pass the color of a point to u_FragColor uniform variable - make the next cube a slightly different color
        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3])

        // Top face (y=1)
        drawTriangle3D([0,1,0, 0,1,-1, 1,1,-1]);
        drawTriangle3D([0,1,0, 1,1,-1, 1,1, 0]);

        // Bottom face (y=0)
        drawTriangle3D([0,0,0, 1,0,-1, 0,0,-1]);
        drawTriangle3D([0,0,0, 1,0, 0, 1,0,-1]);

        // Right face (x=1)
        drawTriangle3D([1,0,0, 1,1,-1, 1,0,-1]);
        drawTriangle3D([1,0,0, 1,1, 0, 1,1,-1]);

        // Left face (x=0)
        drawTriangle3D([0,0,0, 0,0,-1, 0,1,-1]);
        drawTriangle3D([0,0,0, 0,1,-1, 0,1, 0]);
    }
}
