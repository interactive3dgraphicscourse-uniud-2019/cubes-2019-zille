import * as THREE from '../lib/three.module.js';
import { Water } from '../lib/Water.js';
import { BufferGeometryUtils } from '../lib/BufferGeometryUtils.js';
import { getHeightData, addBoxGeometry } from './tools.js'

class Terrain {
    constructor(world) {
        this._heightData = null;
        this._world = world;
    }

    initialize(onProgress, onComplete) {
        const img = new Image();
        img.src = "textures/heightmap_collina.png";
        img.onload = () => {
            onProgress("Loading heightmap...", 0);
            this._heightData = getHeightData(img, 1, (progress) => { onProgress("Loading heightmap...", progress); });

            const terrainGeometries = [];
            const matrix = new THREE.Matrix4();
            const xOffset = this._heightData.length / 2;

            let riverMinX =  99999;
            let riverMaxX = -99999;
            let riverMinZ =  99999;
            let riverMaxZ = -99999;

            const addCube = (x, y, z, material) => {
                matrix.makeTranslation(x, y, z);
                addBoxGeometry(terrainGeometries, this._world.boxPlanes, material, matrix);
            }

            const addRiverPlane = (x, z) => {
                riverMinX = Math.min(riverMinX, x);
                riverMaxX = Math.max(riverMaxX, x);
                riverMinZ = Math.min(riverMinZ, z);
                riverMaxZ = Math.max(riverMaxZ, z);
            }

            const addMissingCubes = (targetHeight, offset, x, z) => {
                if (offset > 0) {
                    while (offset-- > 1) {
                        addCube(x, targetHeight + offset - 128, z, "dirt");
                    }
                }
                else {
                    while (offset++ < -1) {
                        addCube(x, targetHeight + offset - 128, z, "dirt");
                    }
                }
            }

            onProgress("Creating terrain...", 0);
            for (let row = 0; row < this._heightData.length; row++) {
                const dataRow = this._heightData[row];
                const zOffset = dataRow.length / 2;

                for (let col = dataRow.length - 1; col >= 0; col--) {
                    const heightInfo = dataRow[col];
                    let height = heightInfo.value;

                    let handleRiver = true;
                    if (this._world.pointIsOnPath(new THREE.Vector3(col - xOffset, 0, row - zOffset))) {
                        height = 127;
                        handleRiver = false;
                    }

                    const actualHeight = height - 128;

                    addCube(col - zOffset, actualHeight, row - zOffset, actualHeight < 0 ? "dirt" : "dirtGrass");

                    if (handleRiver && actualHeight < 0) {
                        addRiverPlane(col - xOffset, row - zOffset);
                    }

                    const nextRow = row + 1;
                    const nextCol = col + 1;

                    const nextRowHeight = nextRow < this._heightData.length ? this._heightData[nextRow][col].value : height;
                    const nextColHeight = nextCol < dataRow.length ? this._heightData[row][nextCol].value : height;

                    const nextRowHeightDiff = nextRowHeight - height;
                    const nextColHeightDiff = nextColHeight - height;

                    if (nextRowHeightDiff < -1) {
                        addMissingCubes(height, nextRowHeightDiff, col - xOffset, row - zOffset);
                    }
                    else if (nextRowHeightDiff > 1) {
                        addMissingCubes(height, nextRowHeightDiff, col - xOffset, nextRow - zOffset);
                    }

                    if (nextColHeightDiff < -1) {
                        addMissingCubes(height, nextColHeightDiff, col - xOffset, row - zOffset);
                    }
                    else if (nextColHeightDiff > 1) {
                        addMissingCubes(height, nextColHeightDiff, nextCol - xOffset, row - zOffset);
                    }
                }

                onProgress("Creating terrain...", row / this._heightData.length);
            }

            const terrainGeometry = BufferGeometryUtils.mergeBufferGeometries(terrainGeometries);
            terrainGeometry.computeBoundingSphere();

            const terrainMesh = new THREE.Mesh(terrainGeometry, this._world.genericMaterial);
            terrainMesh.castShadow = true;
            terrainMesh.receiveShadow = true;
            this._world.addObjectToScene(terrainMesh);

            if (riverMinX != 99999 && riverMaxX != -99999 && riverMinZ != 99999 && riverMaxZ != -99999) {
                riverMaxX += 1;
                riverMaxZ += 1;
                const riverWidth = Math.abs(riverMinX - riverMaxX);
                const riverLength = Math.abs(riverMinZ - riverMaxZ);
                var riverGeometry = new THREE.PlaneBufferGeometry(riverWidth, riverLength);
                const river = new Water(riverGeometry, {
                    color: 0xAADCFF,
                    scale: 3,
                    flowDirection: new THREE.Vector2(0, 1),
                    textureWidth: 1024,
                    textureHeight: 1024
                });

                river.position.x = riverMinX + Math.floor(riverWidth / 2);
                river.position.y = 0.1;
                river.position.z = riverMinZ + Math.floor(riverLength / 2) - 0.5;
                river.rotation.x = Math.PI * -0.5;
                this._world.addObjectToScene(river);
            }
            
            onComplete();
        }
    }
};

export { Terrain };