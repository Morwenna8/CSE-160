class Cube{
    // constructor
    constructor(){
        this.type='cube'; // doesn't do anything - just helps us debug
        // this.position = [0.0, 0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 5.0;
        // this.segments = 10;
        this.matrix = new Matrix4();
        this.textureNum = -2;

        // this.normalMatrix = new Matrix4();
    }

    // render() {
    //     var rgba = this.color;
    
    //     gl.uniform1i(u_whichTexture, this.textureNum);
    //     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    //     gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
    //     // Front face (z=0)  — s=x, t=y
    //     // (0,0,0)→(0,0)  (1,0,0)→(1,0)  (1,1,0)→(1,1)  (0,1,0)→(0,1)
    //     drawTriangle3DUV( [0,0,0,  0,1,0,  1,1,0], [0,0,  0,1,  1,1] );
    //     drawTriangle3DUV( [0,0,0,  1,1,0,  1,0,0], [0,0,  1,1,  1,0] ); // ← was [0,0, 0,1, 1,1]
    
    //     // Back face (z=-1) — s=x, t=y
    //     // (0,0,-1)→(0,0)  (1,0,-1)→(1,0)  (1,1,-1)→(1,1)  (0,1,-1)→(0,1)
    //     drawTriangle3DUV( [0,0,-1,  1,0,-1,  1,1,-1], [0,0,  1,0,  1,1] );
    //     drawTriangle3DUV( [0,0,-1,  1,1,-1,  0,1,-1], [0,0,  1,1,  0,1] );
    
    //     gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
    
    //     // Top face (y=1)   — s=x, t=-z
    //     // (0,1,0)→(0,0)  (1,1,0)→(1,0)  (1,1,-1)→(1,1)  (0,1,-1)→(0,1)
    //     drawTriangle3DUV( [0,1,0,  0,1,-1,  1,1,-1], [0,0,  0,1,  1,1] );
    //     drawTriangle3DUV( [0,1,0,  1,1,-1,  1,1, 0], [0,0,  1,1,  1,0] );
    
    //     // Bottom face (y=0) — s=x, t=-z
    //     // (0,0,0)→(0,0)  (1,0,0)→(1,0)  (1,0,-1)→(1,1)  (0,0,-1)→(0,1)
    //     drawTriangle3DUV( [0,0,0,  1,0,-1,  0,0,-1], [0,0,  1,1,  0,1] );
    //     drawTriangle3DUV( [0,0,0,  1,0, 0,  1,0,-1], [0,0,  1,0,  1,1] );
    
    //     // Right face (x=1) — s=-z, t=y
    //     // (1,0,0)→(0,0)  (1,0,-1)→(1,0)  (1,1,-1)→(1,1)  (1,1,0)→(0,1)
    //     drawTriangle3DUV( [1,0,0,  1,1,-1,  1,0,-1], [0,0,  1,1,  1,0] ); // ← was [0,0, 1,1, 0,1]
    //     drawTriangle3DUV( [1,0,0,  1,1, 0,  1,1,-1], [0,0,  0,1,  1,1] );
    
    //     // Left face (x=0)  — s=-z, t=y
    //     // (0,0,0)→(0,0)  (0,0,-1)→(1,0)  (0,1,-1)→(1,1)  (0,1,0)→(0,1)
    //     drawTriangle3DUV( [0,0,0,  0,0,-1,  0,1,-1], [0,0,  1,0,  1,1] );
    //     drawTriangle3DUV( [0,0,0,  0,1,-1,  0,1, 0], [0,0,  1,1,  0,1] );
    // }

    // render this shape
    render() {
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


        // Front of cube
        // //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // drawTriangle3DUV([0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0], [0,0, 1,1, 1,0]);
        // drawTriangle3DUV([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0], [0,0, 0,1, 1,1]);
        // // Back, Top, Bottom, Right, Left

        // // Pass the color of a point to a u_FragColor uniform variable
        // gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        // //gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
        // // Back:
        // drawTriangle3DUV([0.0, 0.0, 1.0,  1.0, 1.0, 1.0,  1.0, 0.0, 1.0], [0,0, 1,1, 1,0]);
        // drawTriangle3DUV([0.0, 0.0, 1.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0], [0,0, 0,1, 1,1]);

        // // Top:
        // drawTriangle3DUV([0.0, 1.0, 0.0,  1.0, 1.0, 1.0,  1.0, 1.0, 0.0], [0,0, 1,1, 1,0]);
        // drawTriangle3DUV([0.0, 1.0, 0.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0], [0,0, 0,1, 1,1]);

        // // Pass the color of a point to a u_FragColor uniform variable
        // //gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
        // // Bottom:
        // drawTriangle3DUV([0.0, 0.0, 0.0,  1.0, 0.0, 1.0,  1.0, 0.0, 0.0], [0,0, 1,1, 1,0]);
        // drawTriangle3DUV([0.0, 0.0, 0.0,  0.0, 0.0, 1.0,  1.0, 0.0, 1.0], [0,0, 0,1, 1,1]);

        // // Pass the color of a point to a u_FragColor uniform variable
        // gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);

        // // Right:
        // drawTriangle3DUV([0.0, 0.0, 1.0,  0.0, 1.0, 0.0,  0.0, 0.0, 0.0], [0,1, 1,0, 0,0]);
        // drawTriangle3DUV([0.0, 0.0, 1.0,  0.0, 1.0, 1.0,  0.0, 1.0, 0.0], [0,1, 1,1, 1,0]);
        // // Pass the color of a point to a u_FragColor uniform variable
        // gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
        // // Left:
        // drawTriangle3DUV([1.0, 0.0, 1.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0], [0,1, 1,0, 0,0]);
        // drawTriangle3DUV([1.0, 0.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 0.0], [0,1, 1,1, 1,0]);

        // front face
        // drawTriangle3DUV( [0,0,0,    0, 1, 0,    1, 1, 0], [0,0,    0, 1,    1, 1] );
        // drawTriangle3DUV( [0,0,0,    1, 1, 0,    1, 0, 0], [0,0,    1, 1,    1, 0] );
        // drawTriangle3DUV( [0,0,0,  1,1,0,  1,0,0], [0,0,  0,1,  1,0] );
        // drawTriangle3DUV( [0,0,0,  0,1,0,  1,1,0], [0,0,  0,1,  1,1] );

        drawTriangle3DUV( [0,0,0,  1,1,0,  1,0,0], [0,0,  1,1,  1,0] );
        drawTriangle3DUV( [0,0,0,  0,1,0,  1,1,0], [0,0,  0,1,  1,1] );
        // // triangle 1: bottom-left, top-left, top-right
        // drawTriangle3DUV( [0,0,0,  0,1,0,  1,1,0], [0,0,  0,1,  1,1] );
        // // triangle 2: bottom-left, top-right, bottom-right  
        // drawTriangle3DUV( [0,0,0,  1,1,0,  1,0,0], [0,0,  1,1,  1,0] );

        // // top face(from youtube video):
        // drawTriangle3DUV( [0,1,0,  0,1,1,  1,1,1], [0,0,  0,1,  1,1] );
        // drawTriangle3DUV( [0,1,0,  1,1,1,  1,1,0], [0,0,  1,1,  1,0] );

        // Back face (z=-1)
        drawTriangle3DUV( [0,0,-1,  1,0,-1,  1,1,-1], [0,0,  1,0,  1,1] );
        drawTriangle3DUV( [0,0,-1,  1,1,-1,  0,1,-1], [0,0,  1,1,  0,1] );

        // pass the color of a point to u_FragColor uniform variable - make the next cube a slightly different color
        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

        // Top face (y=1)
        drawTriangle3DUV( [0,1,0,  0,1,-1,  1,1,-1], [0,0,  0,1,  1,1] );
        drawTriangle3DUV( [0,1,0,  1,1,-1,  1,1, 0], [0,0,  1,1,  1,0] );

        // Bottom face (y=0)
        drawTriangle3DUV( [0,0,0,  1,0,-1,  0,0,-1], [0,0,  1,1,  0,1] );
        drawTriangle3DUV( [0,0,0,  1,0, 0,  1,0,-1], [0,0,  1,0,  1,1] );

        // // Right face (x=1)
        // drawTriangle3DUV( [1,0,0,  1,1,-1,  1,0,-1], [0,0,  1,1,  0,1] );
        // drawTriangle3DUV( [1,0,0,  1,1, 0,  1,1,-1], [0,0,  0,1,  1,1] );

        // Right face (x=1)
        drawTriangle3DUV( [1,0,0,  1,1,0,  1,1,-1], [0,0,  0,1,  1,1] );
        drawTriangle3DUV( [1,0,0,  1,1,-1,  1,0,-1], [0,0,  1,1,  1,0] );
 
        // Left face (x=0)
        drawTriangle3DUV( [0,0,0,  0,0,-1,  0,1,-1], [0,0,  1,0,  1,1] );
        drawTriangle3DUV( [0,0,0,  0,1,-1,  0,1, 0], [0,0,  1,1,  0,1] );

        // // front of cube
        // drawTriangle3D([0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0]);
        // drawTriangle3D([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0]);

    }

    // render this shape FAST!
    renderFast() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var verts = [];
        var uvs   = [];

        // Front face
        verts = verts.concat([0,0,0, 1,1,0, 1,0,0]);  uvs = uvs.concat([0,0, 1,1, 1,0]);
        verts = verts.concat([0,0,0, 0,1,0, 1,1,0]);  uvs = uvs.concat([0,0, 0,1, 1,1]);

        // Back face
        verts = verts.concat([0,0,-1, 1,0,-1, 1,1,-1]);  uvs = uvs.concat([0,0, 1,0, 1,1]);
        verts = verts.concat([0,0,-1, 1,1,-1, 0,1,-1]);  uvs = uvs.concat([0,0, 1,1, 0,1]);

        // Top face
        verts = verts.concat([0,1,0, 0,1,-1, 1,1,-1]);  uvs = uvs.concat([0,0, 0,1, 1,1]);
        verts = verts.concat([0,1,0, 1,1,-1, 1,1, 0]);  uvs = uvs.concat([0,0, 1,1, 1,0]);

        // Bottom face
        verts = verts.concat([0,0,0, 1,0,-1, 0,0,-1]);  uvs = uvs.concat([0,0, 1,1, 0,1]);
        verts = verts.concat([0,0,0, 1,0, 0, 1,0,-1]);  uvs = uvs.concat([0,0, 1,0, 1,1]);

        // Right face
        verts = verts.concat([1,0,0, 1,1,-1, 1,0,-1]);  uvs = uvs.concat([0,0, 1,1, 0,1]);
        verts = verts.concat([1,0,0, 1,1, 0, 1,1,-1]);  uvs = uvs.concat([0,0, 0,1, 1,1]);

        // Left face
        verts = verts.concat([0,0,0, 0,0,-1, 0,1,-1]);  uvs = uvs.concat([0,0, 1,0, 1,1]);
        verts = verts.concat([0,0,0, 0,1,-1, 0,1, 0]);  uvs = uvs.concat([0,0, 1,1, 0,1]);

        drawTriangle3DUV(verts, uvs);
    }
}
