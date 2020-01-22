import * as THREE from '../lib/three.module.js';
import { BufferGeometryUtils } from '../lib/BufferGeometryUtils.js';
import { addBoxGeometry } from './tools.js'

const PathSectionDirection = {
    NORTH: new THREE.Vector3(0, 0, -1),
    SOUTH: new THREE.Vector3(0, 0, 1),
    EAST: new THREE.Vector3(1, 0, 0),
    WEST: new THREE.Vector3(-1, 0, 0),
}

class PathSection {
    constructor(x, z, length, direction) {

        if (direction !== PathSectionDirection.NORTH && direction !== PathSectionDirection.SOUTH && direction !== PathSectionDirection.EAST && direction !== PathSectionDirection.WEST) {
            console.error("Invalid path irection provided");
            direction = PathSectionDirection.SOUTH;
        }

        if (length <= 0) {
            console.error("Invalid path length provided");
            length = 1;
        }

        this._direction = direction;
        this._length = length;
        this._start = new THREE.Vector3(x, 0, z);
        this._end = this._start.clone().add(this._direction.clone().multiplyScalar(this._length - 1));
    }

    generateMesh(parentPath, geometries, isFirst, world) {
        const matrix = new THREE.Matrix4();
        const lengthToUse = this._length;

        for (let i = isFirst ? 0 : 1; i < lengthToUse; i++) {
            const position = this._start.clone().add(this._direction.clone().multiplyScalar(i));
            matrix.makeTranslation(position.x, position.y, position.z);

            const positionToTest = position.clone().add(parentPath.position);
            if (!world.pointIsOnPath(positionToTest, parentPath)) {
                addBoxGeometry(geometries, world.boxPlanes, "cobblestone", matrix);
            }
        }
    }

    pointIsOnSection(point) {
        const localPoint = point.clone().sub(this._start);
        const pointDirection = localPoint.clone().normalize();

        const distance = localPoint.length();
        const dotResult = pointDirection.dot(this._direction);

        if (distance <= 0.001 || (dotResult == 1.0 && distance < this._length)) {
            return true;
        }

        return false;
    }

    nextPoint(point) {
        const result = point.clone().add(this._direction);
        if (!this.pointIsOnSection(result)) {
            return null;
        }
        return result;
    }

    previousPoint(point) {
        const result = point.clone().add(this._direction.clone().negate());
        if (!this.pointIsOnSection(result)) {
            return null;
        }
        return result;
    }

    get start() {
        return this._start.clone();
    }

    get end() {
        return this._end.clone();
    }

    get endForNextSection() {
        return this._start.clone().add(this._direction.clone().multiplyScalar(this._length - 1));
    }
}

class Path {
    constructor(x, z, length, direction, world, supportsAbitant) {
        this._world = world;
        this._mesh = null;
        this._position = new THREE.Vector3(x, 0, z);
        this._supportsAbitant = supportsAbitant;

        this._sections = [];
        this._sections.push(new PathSection(0, 0, length, direction));
    }

    addSection(length, direction) {
        const lastSection = this._sections[this._sections.length - 1];
        const lastSectionEnd = lastSection.endForNextSection;
        this._sections.push(new PathSection(lastSectionEnd.x, lastSectionEnd.z, length, direction));
    }

    generateMesh() {
        const pathGeometries = [];
        for (let i = 0; i < this._sections.length; i++) {
            this._sections[i].generateMesh(this, pathGeometries, i == 0, this._world);
        }

        if (pathGeometries.length > 0) {
            const pathGeometry = BufferGeometryUtils.mergeBufferGeometries(pathGeometries);
            pathGeometry.computeBoundingSphere();

            this._mesh = new THREE.Mesh(pathGeometry, this._world.genericMaterial);
            this._mesh.receiveShadow = true;
            this._mesh.position.x = this._position.x;
            this._mesh.position.y = this._position.y;
            this._mesh.position.z = this._position.z;

            this._world.addObjectToScene(this._mesh);
        }
    }

    pointIsOnPath(point) {
        const localPoint = point.clone();
        localPoint.y = 0;
        localPoint.sub(this._position);

        for (let i = 0; i < this._sections.length; i++) {
            if (this._sections[i].pointIsOnSection(localPoint)) {
                return true;
            }
        }

        return false;
    }

    nextCornerOfPath(startPoint) {
        const localPoint = startPoint.clone();
        localPoint.y = 0;
        localPoint.sub(this._position);

        for (let i = 0; i < this._sections.length; i++) {
            const nextPoint = this._sections[i].nextPoint(localPoint);
            if (nextPoint) {
                const result = this._sections[i].end;
                result.add(this._position);
                result.y = startPoint.y;
                return result;
            }
        }

        return null;
    }

    previousCornerOfPath(startPoint) {
        const localPoint = startPoint.clone();
        localPoint.y = 0;
        localPoint.sub(this._position);

        for (let i = this._sections.length - 1; i >= 0; i--) {
            const prevPoint = this._sections[i].previousPoint(localPoint);
            if (prevPoint) {
                const result = this._sections[i].start;
                result.add(this._position);
                result.y = startPoint.y;
                return result;
            }
        }

        return null;
    }

    get position() {
        return this._position.clone();
    }

    get start() {
        return this._sections[0].start.clone().add(this._position);
    }

    get end() {
        return this._sections[this._sections.length - 1].end.clone().add(this._position);
    }

    get supportsAbitant() {
        return this._supportsAbitant;
    }
}

export { Path, PathSection, PathSectionDirection };