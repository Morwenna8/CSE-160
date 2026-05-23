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
    }

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
        // drawTriangle3DUV( [0,0,0,  1,1,0,  1,0,0], [0,0,  1,1,  1,0] );
        // drawTriangle3DUV( [0,0,0,  0,1,0,  1,1,0], [0,0,  0,1,  1,1] );
        drawTriangle3DUVNormal(
            [0,0,0, 1,1,0, 1,0,0],
            [0,0, 1,1, 1,0],
            // [0,0,-1, 0,0,-1, 0,0,-1]
            [0,0,1, 0,0,1, 0,0,1]
        );
        drawTriangle3DUVNormal(
            [0,0,0,  0,1,0,  1,1,0],
            [0,0,  0,1,  1,1],
            // [0,0,-1, 0,0,-1, 0,0,-1]
            [0,0,1, 0,0,1, 0,0,1]
        );

        // Back face (z=-1, normal points -z)
        drawTriangle3DUVNormal(
            [0,0,-1,  1,0,-1,  1,1,-1],
            [0,0,  1,0,  1,1],
            // [0,0,-1,  0,0,-1,  0,0,-1]
            [0,0,1,  0,0,1,  0,0,1]
        );
        drawTriangle3DUVNormal(
            [0,0,-1,  1,1,-1,  0,1,-1],
            [0,0,  1,1,  0,1],
            // [0,0,-1,  0,0,-1,  0,0,-1]
            [0,0,1,  0,0,1,  0,0,1]
        );

        // gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

        // Top face (y=1, normal points +y)
        drawTriangle3DUVNormal(
            [0,1,0,  0,1,-1,  1,1,-1],
            [0,0,  0,1,  1,1],
            [0,1,0,  0,1,0,  0,1,0]
        );
        drawTriangle3DUVNormal(
            [0,1,0,  1,1,-1,  1,1,0],
            [0,0,  1,1,  1,0],
            [0,1,0,  0,1,0,  0,1,0]
        );

        // Bottom face (y=0, normal points -y)
        drawTriangle3DUVNormal(
            [0,0,0,  1,0,-1,  0,0,-1],
            [0,0,  1,1,  0,1],
            [0,-1,0,  0,-1,0,  0,-1,0]
        );
        drawTriangle3DUVNormal(
            [0,0,0,  1,0,0,  1,0,-1],
            [0,0,  1,0,  1,1],
            [0,-1,0,  0,-1,0,  0,-1,0]
        );

        // Right face (x=1, normal points +x)
        drawTriangle3DUVNormal(
            [1,0,0,  1,1,0,  1,1,-1],
            [0,0,  0,1,  1,1],
            [1,0,0,  1,0,0,  1,0,0]
        );
        drawTriangle3DUVNormal(
            [1,0,0,  1,1,-1,  1,0,-1],
            [0,0,  1,1,  1,0],
            [1,0,0,  1,0,0,  1,0,0]
        );

        // Left face (x=0, normal points -x)
        drawTriangle3DUVNormal(
            [0,0,0,  0,0,-1,  0,1,-1],
            [0,0,  1,0,  1,1],
            [-1,0,0,  -1,0,0,  -1,0,0]
        );
        drawTriangle3DUVNormal(
            [0,0,0,  0,1,-1,  0,1,0],
            [0,0,  1,1,  0,1],
            [-1,0,0,  -1,0,0,  -1,0,0]
        );
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
