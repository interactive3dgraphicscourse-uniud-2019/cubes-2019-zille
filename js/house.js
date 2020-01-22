import * as THREE from '../lib/three.module.js';
import { createWall, createRoof } from './tools.js'

class House {
    constructor(x, z, rotation, width, height, depth, world, material) {
        const materialToUse = material || "bricks";
        this._world = world;

        this._frontWall = createWall(width, height - 1, true, this._world.boxPlanes, this._world.genericMaterial, materialToUse);
        this._frontWall.position.z = depth - 1;

        this._backWall = createWall(width, height - 1, false, this._world.boxPlanes, this._world.genericMaterial, materialToUse);

        this._leftWall = createWall(depth - 2, height - 1, false, this._world.boxPlanes, this._world.genericMaterial, materialToUse);
        this._leftWall.position.z = 1;
        this._leftWall.rotation.y = -90 * Math.PI / 180;

        this._rightWall = createWall(depth - 2, height - 1, false, this._world.boxPlanes, this._world.genericMaterial, materialToUse);
        this._rightWall.position.x = width - 1;
        this._rightWall.position.z = 1;
        this._rightWall.rotation.y = -90 * Math.PI / 180;

        this._roof = createRoof(width, depth, this._world.boxPlanes, this._world.genericMaterial, materialToUse);
        this._roof.position.y = height - 1;

        this._root = new THREE.Object3D();
        this._root.add(this._frontWall);
        this._root.add(this._backWall);
        this._root.add(this._leftWall);
        this._root.add(this._rightWall);
        this._root.add(this._roof);
        this._root.position.x = x;
        this._root.position.y = 1;
        this._root.position.z = z;
        this._root.rotation.y = rotation * Math.PI / 180;

        this._world.addObjectToScene(this._root);
    }

    get position() {
        return this._root.position;
    }

    get rotation() {
        return this._root.rotation;
    }
};

export { House };