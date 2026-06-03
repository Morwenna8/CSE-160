import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

function main() {
    const canvas = document.querySelector('#webgl');
    const view1Elem = document.querySelector('#view1');
    const view2Elem = document.querySelector('#view2');
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        alpha: true,
    });
    
    const fov = 75;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 1000;
    const camera1 = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera1.position.set(0, 10, 20);

    camera1.lookAt(0, 0, 0);

    const cameraHelper = new THREE.CameraHelper(camera1);
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    class MinMaxGUIHelper {
        constructor(obj, minProp, maxProp, minDif) {
          this.obj = obj;
          this.minProp = minProp;
          this.maxProp = maxProp;
          this.minDif = minDif;
        }
        get min() {
          return this.obj[this.minProp];
        }
        set min(v) {
          this.obj[this.minProp] = v;
          this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
        }
        get max() {
          return this.obj[this.maxProp];
        }
        set max(v) {
          this.obj[this.maxProp] = v;
          this.min = this.min;  // this will call the min setter
        }
    }

    const gui = new GUI();
	gui.add( camera1, 'fov', 1, 180 );
	const minMaxGUIHelper = new MinMaxGUIHelper( camera1, 'near', 'far', 0.1 );
	gui.add( minMaxGUIHelper, 'min', 0.1, 50, 0.1 ).name( 'near' );
	gui.add( minMaxGUIHelper, 'max', 0.1, 50, 0.1 ).name( 'far' );

    const controls = new OrbitControls(camera1, view1Elem);
    controls.target.set(0, 5, 0);
    controls.update();
    
    // camera2 
    const camera2 = new THREE.PerspectiveCamera(
		60, // fov
		2, // aspect
		0.1, // near
		500, // far
	);
	camera2.position.set( 40, 10, 30 );
	camera2.lookAt( 0, 5, 0 );

	const controls2 = new OrbitControls( camera2, view2Elem );
	controls2.target.set( 0, 5, 0 );
	controls2.update();

    const scene = new THREE.Scene();
	// scene.background = new THREE.Color( 'black' );
	scene.add( cameraHelper );

    // WASD movement
    const keys = {};
    document.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
    document.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

    // LIGHTING
    class ColorGUIHelper {
        constructor(object, prop) {
          this.object = object;
          this.prop = prop;
        }
        get value() {
          return '#' + this.object[this.prop].getHexString();
        }
        set value(hexString) {
          this.object[this.prop].set(hexString);
        }
    }

    const guiLight = new GUI();

    // ambient light
    const colorA = 0xFFFFFF;
    const intensityA = 0.1;
    const lightA = new THREE.AmbientLight(colorA, intensityA);
    scene.add(lightA);

    // ambient light controls
    const folderA = guiLight.addFolder('Ambient Light');
    folderA.addColor(new ColorGUIHelper(lightA, 'color'), 'value').name('color');
    folderA.add(lightA, 'intensity', 0, 5, 0.01);

    // directional light
    const colorD = 0xFFFFFF;
    const intensityD = 1;
    const lightD = new THREE.DirectionalLight(colorD, intensityD);
    lightD.position.set(10, 5, 5);
    lightD.target.position.set(-5, 0, 0);
    scene.add(lightD);
    scene.add(lightD.target);

    // directional light controls
    const folderD = guiLight.addFolder('Directional Light');
    folderD.addColor(new ColorGUIHelper(lightD, 'color'), 'value').name('color');
    folderD.add(lightD, 'intensity', 0, 5, 0.01);
    folderD.add(lightD.target.position, 'x', -180, 180);
    folderD.add(lightD.target.position, 'z', -180, 180);
    folderD.add(lightD.target.position, 'y', -180, 180);

    // point light
    const colorP = 0xFFFFFF;
    const intensityP = 25;
    const lightP = new THREE.PointLight(colorP, intensityP);
    lightP.position.set(0, 6, 2);
    scene.add(lightP);

    // point light controls
    const folderP = guiLight.addFolder('Point Light');
    folderP.addColor(new ColorGUIHelper(lightP, 'color'), 'value').name('color');
    folderP.add(lightP, 'intensity', 0, 250, 1);

    const loader = new THREE.TextureLoader();

    const skyboxTexture = loader.load(
      '360_background.jpg',
      () => {
        skyboxTexture.mapping = THREE.EquirectangularReflectionMapping;
        skyboxTexture.colorSpace = THREE.SRGBColorSpace;
        scene.background = skyboxTexture;
    });

    const skyboxTexture2 = loader.load(
        'after_sunset.jpg',
        () => {
          skyboxTexture2.mapping = THREE.EquirectangularReflectionMapping;
          skyboxTexture2.colorSpace = THREE.SRGBColorSpace;
        //   scene.background = skyboxTexture2;
    });

    // setting up the ground plane
    const planeSize = 40;
    // const loader = new THREE.TextureLoader();
    const planeTexture = loader.load('trippyPattern.jpg');
    planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.wrapT = THREE.RepeatWrapping;
    planeTexture.magFilter = THREE.NearestFilter;
    planeTexture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 20;
    planeTexture.repeat.set(repeats, repeats);

    // plane geometry
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
    map: planeTexture,
    side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);

    // load cats!
    let catRoot = null;
    let catSleepingRoot = null;

    // add cat obj
    {
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        mtlLoader.load('cat/12221_Cat_v1_l3.mtl', (mtl) => {
            mtl.preload();
            objLoader.setMaterials(mtl);
        objLoader.load('cat/12221_Cat_v1_l3.obj', (root) => {
            root.scale.set(0.1, 0.1, 0.1);
            root.rotation.x = -Math.PI / 2;
            root.position.x = 2;
            root.position.z = 1;
            catRoot = root;
            scene.add(root);
        });
        });
    }

    // add cat sleeping obj
    {
        const mtlLoader2 = new MTLLoader();
        const objLoader2 = new OBJLoader();
        mtlLoader2.load('cat_sleeping/model.mtl', (mtl) => {
            mtl.preload();
            objLoader2.setMaterials(mtl);
        objLoader2.load('cat_sleeping/model.obj', (root) => {
            root.scale.set(1, 1, 1);
            root.rotation.x = Math.PI / 1.5;
            root.position.x = 2;
            root.position.z = 1;
            root.position.y = 4.5;

            root.visible = false;  // hide until game is won
            catSleepingRoot = root;
            scene.add(root);
        });
        });
    }

    function loadColorTexture( path ) {
        const texture = loader.load( path );
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }

    const materials = [
        new THREE.MeshBasicMaterial({map: loadColorTexture('waterIce.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('waterIce.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('waterIce.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('waterIce.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('waterIce.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('waterIce.png')}),
    ];

    // const cube = new THREE.Mesh(geometry, materials);
    // scene.add(cube);

    // cube color 
    const color = 0xFFFFFF;
    const intensity = 3;

    // Here is a function that given an element will compute the rectangle of that element that overlaps the canvas. 
    // It will then set the scissor and viewport to that rectangle and return the aspect for that size.
    function setScissorForElement(elem) {
        const canvasRect = canvas.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();
       
        // compute a canvas relative rectangle
        const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
        const left = Math.max(0, elemRect.left - canvasRect.left);
        const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
        const top = Math.max(0, elemRect.top - canvasRect.top);
       
        const width = Math.min(canvasRect.width, right - left);
        const height = Math.min(canvasRect.height, bottom - top);
        
        if (width <= 0 || height <= 0) return 1;
       
        // setup the scissor to only render to that part of the canvas
        const positiveYUpBottom = canvasRect.height - bottom;
        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);
       
        // return the aspect
        return width / height;
      }
    

    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({color});
       
        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);
       
        cube.position.x = x;
       
        return cube;
    }

    // Generate 10 random cubes
    const cubes = [];
    for (let i = 0; i < 10; i++) {
        const x = (Math.random() - 0.5) * 36;
        const z = (Math.random() - 0.5) * 36;
        const cube = new THREE.Mesh(geometry, materials);
        cube.position.set(x, 1, z);
        scene.add(cube);
        cubes.push(cube);
    }

    // // Counter
    // let collected = 0;
    // const counterEl = document.getElementById('object2');
    // counterEl.style.cssText = `
    //     position: fixed; top: 16px; right: 16px; z-index: 100;
    //     background: rgba(0,0,0,0.6); color: white;
    //     padding: 8px 14px; border-radius: 8px;
    //     font-family: sans-serif; font-size: 14px; pointer-events: none;
    // `;
    // counterEl.textContent = 'Cubes collected: 0 / 10';

    let collected = 0;
    const counterEl = document.getElementById('object2');
    counterEl.textContent = 'Cubes collected: 0 / 10';

    // Define tetra geometry and material
    const tetraGeo = new THREE.TetrahedronGeometry();
    const tetraMat = new THREE.MeshPhongMaterial({color: '#9beb81'});

    // Generate 10 random tetrahedrons
    const tetras = [];
    for (let i = 0; i < 10; i++) {
        const x = (Math.random() - 0.5) * 36;
        const z = (Math.random() - 0.5) * 36;
        const tetra = new THREE.Mesh(tetraGeo, tetraMat);
        tetra.position.set(x, 1, z);
        scene.add(tetra);
        tetras.push(tetra);
    }

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Use view1Elem for click since that's the player's viewport
    view1Elem.addEventListener('click', (e) => {
        const rect = view1Elem.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera1);
        const hits = raycaster.intersectObjects(cubes);

        if (hits.length > 0) {
            const hit = hits[0];
            const dist = camera1.position.distanceTo(hit.object.position);
            if (dist < 8) {
                scene.remove(hit.object);
                cubes.splice(cubes.indexOf(hit.object), 1);
                collected++;
                if (collected === 10) {
                    counterEl.textContent = 'Collection complete! The sun can finally take her nap :)';
                    scene.background = skyboxTexture2;
                    sphereMat.color.set(0xffffff);
                    sphereMat.map = loadColorTexture('moon_texture.jpg');
                    sphereMat.needsUpdate = true;
                    if (catRoot) catRoot.visible = false;
                    if (catSleepingRoot) catSleepingRoot.visible = true;
                } else {
                    counterEl.textContent = `Cubes collected: ${collected} / 10`;
                }
            } else {
                const prev = counterEl.textContent;
                counterEl.textContent = `Too far! Get closer. (${collected} / 10)`;
                setTimeout(() => { counterEl.textContent = prev; }, 1500);
            }
        }
    });

    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: '#debe2f'});
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphereMesh);

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time *= 0.001;  // convert to seconds

        // WASD movement
        const moveSpeed = 0.2;
        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();

        camera1.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        right.crossVectors(forward, THREE.Object3D.DEFAULT_UP).normalize();

        if (keys['w']) camera1.position.addScaledVector(forward, moveSpeed);
        if (keys['s']) camera1.position.addScaledVector(forward, -moveSpeed);
        if (keys['a']) camera1.position.addScaledVector(right, -moveSpeed);
        if (keys['d']) camera1.position.addScaledVector(right, moveSpeed);

        if (keys['q'] || keys['e']) {
            const turnSpeed = keys['q'] ? 0.03 : -0.03;
            const offset = new THREE.Vector3().subVectors(controls.target, camera1.position);
            offset.applyQuaternion(
                new THREE.Quaternion().setFromAxisAngle(THREE.Object3D.DEFAULT_UP, turnSpeed)
            );
            controls.target.copy(camera1.position).add(offset);
            controls.update();
        }

        controls.target.addScaledVector(forward, keys['w'] ? moveSpeed : keys['s'] ? -moveSpeed : 0);
        controls.target.addScaledVector(right, keys['a'] ? -moveSpeed : keys['d'] ? moveSpeed : 0);
        
        // spin cubes
        cubes.forEach((cube) => {
            cube.rotation.y = time;
            cube.rotation.x = -time;
        });

        // spin tetras
        tetras.forEach((tetra) => {
            tetra.rotation.y = -time;
            tetra.rotation.x = time;
        });

        resizeRendererToDisplaySize(renderer);
    
        // turn on the scissor
        renderer.setScissorTest(true);
    
        // render the original view
        {
        const aspect = setScissorForElement(view1Elem);
    
        // adjust the camera for this aspect
        camera1.aspect = aspect;
        camera1.updateProjectionMatrix();
        cameraHelper.update();
    
        // don't draw the camera helper in the original view
        cameraHelper.visible = false;
    
        renderer.render(scene, camera1);
        }
    
        // render from the 2nd camera
        {
        const aspect = setScissorForElement(view2Elem);
    
        // adjust the camera for this aspect
        camera2.aspect = aspect;
        camera2.updateProjectionMatrix();
    
        // draw the camera helper in the 2nd view
        cameraHelper.visible = true;
    
        renderer.render(scene, camera2);
        }

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();
