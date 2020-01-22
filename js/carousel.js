import * as THREE from '../lib/three.module.js';
import { BufferGeometryUtils } from '../lib/BufferGeometryUtils.js';

class Carousel {
    constructor(x, z, world) {
        const beamGeometry = new THREE.BoxBufferGeometry(6.0, 0.4, 0.4);
        const beamMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0.768, 0.780, 0.780),
            roughness: 0.2,
            metalness: 1.0
        });

        const beamsGeometry = BufferGeometryUtils.mergeBufferGeometries([
            beamGeometry.clone().translate(3.0, 0, 0),
            beamGeometry.clone().translate(3.0, 0, 0).rotateY(60 * Math.PI / 180),
            beamGeometry.clone().translate(3.0, 0, 0).rotateY(120 * Math.PI / 180),
            beamGeometry.clone().translate(3.0, 0, 0).rotateY(180 * Math.PI / 180),
            beamGeometry.clone().translate(3.0, 0, 0).rotateY(240 * Math.PI / 180),
            beamGeometry.clone().translate(3.0, 0, 0).rotateY(300 * Math.PI / 180)
        ]);
        beamsGeometry.computeBoundingSphere();

        this._root = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), beamMaterial);
        this._root.position.x = x;
        this._root.position.y = 1;
        this._root.position.z = z;
        this._root.castShadow = true;

        this._beamsRoot = new THREE.Mesh(beamsGeometry, beamMaterial);
        this._beamsRoot.castShadow = true;
        this._root.add(this._beamsRoot);

        this._world = world;
        this._world.addObjectToScene(this._root);
    }

    update(delta) {
        this._beamsRoot.rotation.y += 1 * delta;
    }
};

export { Carousel };