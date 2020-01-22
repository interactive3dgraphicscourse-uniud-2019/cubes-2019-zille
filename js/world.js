import * as THREE from '../lib/three.module.js';
import Stats from '../lib/stats.module.js';
import { EXRLoader } from '../lib/EXRLoader.js';
import { OrbitControls } from '../lib/OrbitControls.js';
import { Terrain } from './terrain.js';
import { createBoxPlanes } from './tools.js'
import { House } from './house.js';
import { Path, PathSectionDirection } from './path.js';
import { Abitant } from './abitant.js';
import { Carousel } from './carousel.js';

class World {
    constructor() {
        this._clock = null;

        this._scene = null;
        this._camera = null;

        this._stats = null;
        this._renderer = null;
        this._controls = null;

        this._genericMaterial = null;
        this._boxPlanes = [];

        this._terrain = null;
        this._carousel = null;
        this._houses = [];
        this._paths = [];
        this._abitants = [];
    }

    initialize(enableStats, onProgress, onComplete) {

        // Create the WebGL renderer
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setClearColor(0xf0f0f0);
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.outputEncoding = THREE.LinearEncoding;
        this._renderer.physicallyCorrectLights = true;
        this._renderer.shadowMap.enabled = true;
        document.body.appendChild(this._renderer.domElement);

        // Create the stats widget if requested
        if (enableStats) {
            this._stats = new Stats();
            this._stats.domElement.style.position = 'absolute';
            this._stats.domElement.style.top = '0px';
            document.body.appendChild(this._stats.domElement);
        }

        this._clock = new THREE.Clock();
        this._scene = new THREE.Scene();

        const pmremGenerator = new THREE.PMREMGenerator(this._renderer);
        pmremGenerator.compileEquirectangularShader();

        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._camera.position.set(0, 8, 55);
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));

        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.autoRotate = true;

        // Setup the box planes used by all the boxes generated and used inside the scene
        this._boxPlanes = createBoxPlanes();

        // Setup the material used for all the boxes inside the scene
        const textureLoader = new THREE.TextureLoader();
        const texture_complete_basecolor = textureLoader.load('textures/complete_basecolor.jpg');
        const texture_complete_normal = textureLoader.load('textures/complete_normal.jpg');
        const texture_complete_roughness = textureLoader.load('textures/complete_roughness.jpg')
        this._genericMaterial = new THREE.MeshStandardMaterial({
            map: texture_complete_basecolor,
            normalMap: texture_complete_normal,
            roughnessMap: texture_complete_roughness
        });

        const dirLight = new THREE.DirectionalLight();
        dirLight.intensity = 1.0; // 1 lux
        dirLight.position.set(-1, 1.75, 1);
        dirLight.position.multiplyScalar(50);
        dirLight.castShadow = true;
        dirLight.shadow.camera.left = -85;
        dirLight.shadow.camera.right = 85;
        dirLight.shadow.camera.top = 85;
        dirLight.shadow.camera.bottom = -85;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        this.addObjectToScene(dirLight);

        const hemiLight = new THREE.HemisphereLight();
        hemiLight.intensity = 1.0; // 1 lux
        hemiLight.position.set(0, 50, 0);
        this.addObjectToScene(hemiLight);

        onProgress("Creating houses...", 0);
        {
            this._houses.push(new House(-25, -55, 0, 7, 3, 5, this)); // A
            this._houses.push(new House(-10, -45, -90, 10, 5, 7, this, "plaster")); // B
            this._houses.push(new House(-5, -20, -90, 12, 3, 7, this)); // C
            this._houses.push(new House(-22, 10, 90, 7, 3, 3, this)); // D
            this._houses.push(new House(-25, 35, 90, 8, 10, 8, this, "plaster")); // E
            this._houses.push(new House(-3, -30, 0, 7, 3, 5, this)); // F
            this._houses.push(new House(10, 0, 180, 5, 4, 5, this, "plaster")); // G
            this._houses.push(new House(50, 5, -90, 8, 4, 4, this)); // H
            this._houses.push(new House(30, 5, 90, 5, 4, 4, this)); // I
            this._houses.push(new House(40, 20, 180, 5, 3, 4, this, "plaster")); // J
            this._houses.push(new House(0, 20, -90, 8, 4, 4, this)); // K
            this._houses.push(new House(-7, 55, 180, 10, 7, 4, this)); // L
        }
        onProgress("Creating houses...", 1);

        {
            this._carousel = new Carousel(-5, 5, this);
        }

        onProgress("Creating paths...", 0);
        {
            const pathAD = new Path(-22, -51, 31, PathSectionDirection.SOUTH, this, true);
            pathAD.addSection(7, PathSectionDirection.EAST);
            pathAD.addSection(29, PathSectionDirection.SOUTH);
            pathAD.addSection(5, PathSectionDirection.WEST);
            pathAD.generateMesh();
            this._paths.push(pathAD);

            const pathBE = new Path(-16, -40, 7, PathSectionDirection.WEST, this, true);
            pathBE.addSection(20, PathSectionDirection.SOUTH);
            pathBE.addSection(7, PathSectionDirection.EAST);
            pathBE.addSection(35, PathSectionDirection.SOUTH);
            pathBE.addSection(2, PathSectionDirection.EAST);
            pathBE.addSection(33, PathSectionDirection.SOUTH);
            pathBE.addSection(4, PathSectionDirection.EAST);
            pathBE.addSection(8, PathSectionDirection.SOUTH);
            pathBE.generateMesh();
            this._paths.push(pathBE);

            const pathDF = new Path(-20, 7, 5, PathSectionDirection.EAST, this, true);
            pathDF.addSection(32, PathSectionDirection.NORTH);
            pathDF.addSection(17, PathSectionDirection.EAST);
            pathDF.addSection(3, PathSectionDirection.NORTH);
            pathDF.generateMesh();
            this._paths.push(pathDF);

            const pathKC = new Path(-3, 24, 13, PathSectionDirection.WEST, this, true);
            pathKC.addSection(12, PathSectionDirection.NORTH);
            pathKC.addSection(2, PathSectionDirection.WEST);
            pathKC.addSection(28, PathSectionDirection.NORTH);
            pathKC.addSection(6, PathSectionDirection.EAST);
            pathKC.generateMesh();
            this._paths.push(pathKC);

            const pathCE = new Path(-11, -14, 6, PathSectionDirection.WEST, this, true);
            pathCE.addSection(28, PathSectionDirection.SOUTH);
            pathCE.addSection(2, PathSectionDirection.EAST);
            pathCE.addSection(19, PathSectionDirection.SOUTH);
            pathCE.addSection(4, PathSectionDirection.WEST);
            pathCE.generateMesh();
            this._paths.push(pathCE);

            const pathGF = new Path(8, -5, 10, PathSectionDirection.NORTH, this, true);
            pathGF.addSection(9, PathSectionDirection.WEST);
            pathGF.addSection(13, PathSectionDirection.NORTH);
            pathGF.generateMesh();
            this._paths.push(pathGF);

            const pathFH = new Path(0, -26, 13, PathSectionDirection.SOUTH, this, true);
            pathFH.addSection(9, PathSectionDirection.EAST);
            pathFH.addSection(4, PathSectionDirection.SOUTH);
            pathFH.addSection(14, PathSectionDirection.EAST);
            pathFH.addSection(6, PathSectionDirection.SOUTH);
            pathFH.addSection(16, PathSectionDirection.EAST);
            pathFH.addSection(16, PathSectionDirection.SOUTH);
            pathFH.addSection(12, PathSectionDirection.EAST);
            pathFH.generateMesh();
            this._paths.push(pathFH);

            const pathJI = new Path(38, 17, 9, PathSectionDirection.NORTH, this, true);
            pathJI.addSection(3, PathSectionDirection.WEST);
            pathJI.addSection(7, PathSectionDirection.NORTH);
            pathJI.addSection(4, PathSectionDirection.WEST);
            pathJI.generateMesh();
            this._paths.push(pathJI);

            const pathCarousel = new Path(-15, 5, 5, PathSectionDirection.EAST, this, false);
            pathCarousel.addSection(7, PathSectionDirection.SOUTH);
            pathCarousel.addSection(13, PathSectionDirection.EAST);
            pathCarousel.addSection(13, PathSectionDirection.NORTH);
            pathCarousel.addSection(13, PathSectionDirection.WEST);
            pathCarousel.addSection(6, PathSectionDirection.SOUTH);
            pathCarousel.generateMesh();
            this._paths.push(pathCarousel);
        }
        onProgress("Creating paths...", 1);

        onProgress("Creating abitants...", 0);
        {
            for (let i = 0; i < this._paths.length; i++) {
                if (this._paths[i].supportsAbitant) {
                    this._abitants.push(new Abitant(this, this._paths[i]));
                }
            }
        }
        onProgress("Creating abitants...", 1);

        this._terrain = new Terrain(this);
        this._terrain.initialize(onProgress, () => {
            THREE.DefaultLoadingManager.onLoad = function () {
                pmremGenerator.dispose();
            };

            new EXRLoader()
                .setDataType(THREE.FloatType)
                .load('textures/cloud_layers_1k.exr', (texture) => {
                    this._scene.environment = pmremGenerator.fromEquirectangular(texture).texture;
                    texture.dispose();

                    onProgress("Finalizing scene...", 0);
                    setTimeout(() => {
                        onProgress("Finalizing scene...", 1);
                        onComplete();
                    }, 1000);
                });
        });
    }

    update() {
        requestAnimationFrame(() => { this.update(); });
        this._controls.update();
        this._stats.update();

        var delta = this._clock.getDelta();

        if (this._carousel != null) {
            this._carousel.update(delta);
        }

        for (let i = 0; i < this._abitants.length; i++) {
            this._abitants[i].update(delta);
        }

        this.render();
    }

    render() {
        this._renderer.render(this._scene, this._camera);
    }

    start() {
        this.update();
    }

    addObjectToScene(object) {
        this._scene.add(object);
    }

    pointIsOnPath(point, pathToSkip) {
        for (let i = 0; i < this._paths.length; i++) {
            if (pathToSkip && this._paths[i] == pathToSkip) {
                continue;
            }

            if (this._paths[i].pointIsOnPath(point)) {
                return true;
            }
        }
        return false;
    }

    get genericMaterial() {
        return this._genericMaterial;
    }

    get boxPlanes() {
        return this._boxPlanes;
    }
}

export { World };