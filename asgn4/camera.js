class Camera {
    constructor() {
        this.eye = new Vector3([0, 0, 2]);
        this.at  = new Vector3([0, 0, -1]);
        this.up  = new Vector3([0, 1, 0]);
        this.fov = 60;
        this.speed = 0.2;
        this.panSpeed = 5; // degrees
    }

    moveForward() {
        let dir = this._forward();
        this.eye.elements[0] += dir.elements[0] * this.speed;
        this.eye.elements[1] += dir.elements[1] * this.speed;
        this.eye.elements[2] += dir.elements[2] * this.speed;
        this.at.elements[0]  += dir.elements[0] * this.speed;
        this.at.elements[1]  += dir.elements[1] * this.speed;
        this.at.elements[2]  += dir.elements[2] * this.speed;
    }

    moveBackwards() {
        let dir = this._forward();
        this.eye.elements[0] -= dir.elements[0] * this.speed;
        this.eye.elements[1] -= dir.elements[1] * this.speed;
        this.eye.elements[2] -= dir.elements[2] * this.speed;
        this.at.elements[0]  -= dir.elements[0] * this.speed;
        this.at.elements[1]  -= dir.elements[1] * this.speed;
        this.at.elements[2]  -= dir.elements[2] * this.speed;
    }

    moveLeft() {
        let left = this._left();
        this.eye.elements[0] += left.elements[0] * this.speed;
        this.eye.elements[2] += left.elements[2] * this.speed;
        this.at.elements[0]  += left.elements[0] * this.speed;
        this.at.elements[2]  += left.elements[2] * this.speed;
    }

    moveRight() {
        let left = this._left();
        this.eye.elements[0] -= left.elements[0] * this.speed;
        this.eye.elements[2] -= left.elements[2] * this.speed;
        this.at.elements[0]  -= left.elements[0] * this.speed;
        this.at.elements[2]  -= left.elements[2] * this.speed;
    }

    panLeft() {
        this._pan(this.panSpeed);
    }

    panRight() {
        this._pan(-this.panSpeed);
    }

    // ── helpers ──────────────────────────────────

    _forward() {
        let fx = this.at.elements[0] - this.eye.elements[0];
        let fy = this.at.elements[1] - this.eye.elements[1];
        let fz = this.at.elements[2] - this.eye.elements[2];
        let len = Math.sqrt(fx*fx + fy*fy + fz*fz);
        return new Vector3([fx/len, fy/len, fz/len]);
    }
    
    _left() {
        let f = this._forward();
        let ux = this.up.elements[0];
        let uy = this.up.elements[1];
        let uz = this.up.elements[2];
        let fx = f.elements[0];
        let fy = f.elements[1];
        let fz = f.elements[2];
    
        // cross product: up × forward
        let lx = uy*fz - uz*fy;
        let ly = uz*fx - ux*fz;
        let lz = ux*fy - uy*fx;
    
        let len = Math.sqrt(lx*lx + ly*ly + lz*lz);
        return new Vector3([lx/len, ly/len, lz/len]);
    }
    
    _pan(angleDeg) {
        let dx = this.at.elements[0] - this.eye.elements[0];
        let dy = this.at.elements[1] - this.eye.elements[1];
        let dz = this.at.elements[2] - this.eye.elements[2];
    
        let rot = new Matrix4();
        rot.setRotate(angleDeg, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    
        let rotated = rot.multiplyVector3(new Vector3([dx, dy, dz]));
        this.at.elements[0] = this.eye.elements[0] + rotated.elements[0];
        this.at.elements[1] = this.eye.elements[1] + rotated.elements[1];
        this.at.elements[2] = this.eye.elements[2] + rotated.elements[2];
    }
}