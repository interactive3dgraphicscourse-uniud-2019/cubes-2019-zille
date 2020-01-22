import * as THREE from '../lib/three.module.js';
import { getRandomColor } from './tools.js'

class Abitant {
    constructor(world, path) {
        this._world = world;
        this._path = path;

        this._goingForward = true;
        this._currentPosition = this._path.start;
        this._positionToReach = this._path.nextCornerOfPath(this._currentPosition);
        this._bounceTime = 0;

        const boxGeometry = new THREE.BoxBufferGeometry(0.6, 0.6, 0.6);
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(getRandomColor()),
            roughness: 0.5,
            metalness: 0.0
        });
        this._mesh = new THREE.Mesh(boxGeometry, material);

        this._mesh.position.x = this._currentPosition.x;
        this._mesh.position.y = this._currentPosition.y + 0.6;
        this._mesh.position.z = this._currentPosition.z;
        this._mesh.castShadow = true;

        this._bounceSpeed = Math.random() * (7.0 - 4.0) + 4.0;
        this._bounceHeight = Math.random() * (1.5 - 0.5) + 0.5;
        this._movementSpeed = Math.random() * (5.0 - 3.0) + 3.0;

        this._world.addObjectToScene(this._mesh);
    }

    update(delta) {
        if (delta <= 0) {
            return;
        }

        const distance = this._currentPosition.clone().sub(this._positionToReach).length();
        if (Math.abs(distance) < 0.1) {
            this._currentPosition.x = this._positionToReach.x;
            this._currentPosition.y = this._positionToReach.y;
            this._currentPosition.z = this._positionToReach.z;

            if (this._goingForward) {
                this._positionToReach = this._path.nextCornerOfPath(this._positionToReach);
            }
            else {
                this._positionToReach = this._path.previousCornerOfPath(this._positionToReach);
            }
        }

        if (!this._positionToReach) {
            let newStartingPoint = null;

            if (this._goingForward) {
                this._goingForward = false;

                newStartingPoint = this._path.end;

                this._positionToReach = this._path.previousCornerOfPath(newStartingPoint);
            }
            else {
                this._goingForward = true;

                newStartingPoint = this._path.start;

                this._positionToReach = this._path.nextCornerOfPath(newStartingPoint);
            }

            this._currentPosition.x = newStartingPoint.x;
            this._currentPosition.y = newStartingPoint.y;
            this._currentPosition.z = newStartingPoint.z;
        }

        // Movement along the path
        const direction = this._positionToReach.clone().sub(this._currentPosition).normalize();
        this._currentPosition.add(direction.multiplyScalar(delta * this._movementSpeed));

        // Bounce movement
        this._bounceTime += delta;

        // Apply position to the mesh
        this._mesh.position.x = this._currentPosition.x;
        this._mesh.position.y = 0.6 + Math.abs(Math.sin(this._bounceTime * this._bounceSpeed)) * this._bounceHeight;
        this._mesh.position.z = this._currentPosition.z;
    }
}

export { Abitant };