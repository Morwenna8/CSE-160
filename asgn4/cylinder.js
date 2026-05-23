class Cylinder {
    constructor() {
        this.type = 'cylinder';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.segments = 12; // number of sides around the cylinder
    }

    render() {
        var rgba = this.color;
        const n = this.segments;

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Side faces
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        for (let i = 0; i < n; i++) {
            const angle1 = (i / n) * 2 * Math.PI;
            const angle2 = ((i + 1) / n) * 2 * Math.PI;

            const x1 = 0.5 * Math.cos(angle1);
            const z1 = 0.5 * Math.sin(angle1);
            const x2 = 0.5 * Math.cos(angle2);
            const z2 = 0.5 * Math.sin(angle2);

            // Each side slice is a quad (2 triangles)
            // bottom-left, top-right, bottom-right
            drawTriangle3D([x1, 0, z1,  x2, 1, z2,  x2, 0, z2]);
            // bottom-left, top-left, top-right
            drawTriangle3D([x1, 0, z1,  x1, 1, z1,  x2, 1, z2]);
        }

        // Top and bottom caps — slightly darker like your cube's top face
        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
        for (let i = 0; i < n; i++) {
            const angle1 = (i / n) * 2 * Math.PI;
            const angle2 = ((i + 1) / n) * 2 * Math.PI;

            const x1 = 0.5 * Math.cos(angle1);
            const z1 = 0.5 * Math.sin(angle1);
            const x2 = 0.5 * Math.cos(angle2);
            const z2 = 0.5 * Math.sin(angle2);

            // Top cap (y=1) — fan from center
            drawTriangle3D([0, 1, 0,  x1, 1, z1,  x2, 1, z2]);

            // Bottom cap (y=0) — fan from center, winding flipped
            drawTriangle3D([0, 0, 0,  x2, 0, z2,  x1, 0, z1]);
        }
    }
}