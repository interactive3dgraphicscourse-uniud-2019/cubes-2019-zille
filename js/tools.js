import * as THREE from '../lib/three.module.js';
import { BufferGeometryUtils } from '../lib/BufferGeometryUtils.js';

const useSingleBox = true;

const createBoxPlanes = () => {
    const createPlanes = () => {
        const pxGeometry = new THREE.PlaneBufferGeometry(1, 1);
        pxGeometry.rotateY(Math.PI / 2);
        pxGeometry.translate(0.5, 0, 0);
        const nxGeometry = new THREE.PlaneBufferGeometry(1, 1);
        nxGeometry.rotateY(-Math.PI / 2);
        nxGeometry.translate(-0.5, 0, 0);
        const pyGeometry = new THREE.PlaneBufferGeometry(1, 1);
        pyGeometry.rotateX(- Math.PI / 2);
        pyGeometry.translate(0, 0.5, 0);
        const nyGeometry = new THREE.PlaneBufferGeometry(1, 1);
        nyGeometry.rotateX(Math.PI / 2);
        nyGeometry.translate(0, -0.5, 0);
        const pzGeometry = new THREE.PlaneBufferGeometry(1, 1);
        pzGeometry.translate(0, 0, 0.5);
        const nzGeometry = new THREE.PlaneBufferGeometry(1, 1);
        nzGeometry.rotateY(Math.PI);
        nzGeometry.translate(0, 0, -0.5);

        return [pxGeometry, nxGeometry, pyGeometry, nyGeometry, pzGeometry, nzGeometry];
    }

    const result = {};

    // Dirt
    {
        if (useSingleBox) {
            const box = new THREE.BoxBufferGeometry();
            for (let i = 0; i < 6; i++) {
                box.attributes.uv.array[8 * i + 0] =    0 / 3072;
                box.attributes.uv.array[8 * i + 1] = 2048 / 2048;
                box.attributes.uv.array[8 * i + 2] = 1024 / 3072;
                box.attributes.uv.array[8 * i + 3] = 2048 / 2048;
                box.attributes.uv.array[8 * i + 4] =    0 / 3072;
                box.attributes.uv.array[8 * i + 5] = 1024 / 2048;
                box.attributes.uv.array[8 * i + 6] = 1024 / 3072;
                box.attributes.uv.array[8 * i + 7] = 1020 / 2048;
            }

            result.dirt = box;
        }
        else {
            const planes = createPlanes();

            for (let i = 0; i < planes.length; i++) {
                planes[i].attributes.uv.array[0] =    0 / 3072;
                planes[i].attributes.uv.array[1] = 2048 / 2048;
                planes[i].attributes.uv.array[2] = 1024 / 3072;
                planes[i].attributes.uv.array[3] = 2048 / 2048;
                planes[i].attributes.uv.array[4] =    0 / 3072;
                planes[i].attributes.uv.array[5] = 1024 / 2048;
                planes[i].attributes.uv.array[6] = 1024 / 3072;
                planes[i].attributes.uv.array[7] = 1020 / 2048;
            }

            result.dirt = planes;
        }
    }

    // Dirt with grass
    {
        if (useSingleBox) {
            const box = new THREE.BoxBufferGeometry();
            for (let i = 0; i < 6; i++) {

                // Skip positive and negative Y
                if (i == 2 || i == 3) {
                    continue;
                }

                box.attributes.uv.array[8 * i + 0] = 2048 / 3072;
                box.attributes.uv.array[8 * i + 1] = 2048 / 2048;
                box.attributes.uv.array[8 * i + 2] = 3072 / 3072;
                box.attributes.uv.array[8 * i + 3] = 2048 / 2048;
                box.attributes.uv.array[8 * i + 4] = 2048 / 3072;
                box.attributes.uv.array[8 * i + 5] = 1024 / 2048;
                box.attributes.uv.array[8 * i + 6] = 3072 / 3072;
                box.attributes.uv.array[8 * i + 7] = 1024 / 2048;
            }

            box.attributes.uv.array[8 * 2 + 0] = 1024 / 3072;
            box.attributes.uv.array[8 * 2 + 1] = 2048 / 2048;
            box.attributes.uv.array[8 * 2 + 2] = 2048 / 3072;
            box.attributes.uv.array[8 * 2 + 3] = 2048 / 2048;
            box.attributes.uv.array[8 * 2 + 4] = 1024 / 3072;
            box.attributes.uv.array[8 * 2 + 5] = 1024 / 2048;
            box.attributes.uv.array[8 * 2 + 6] = 2048 / 3072;
            box.attributes.uv.array[8 * 2 + 7] = 1024 / 2048;

            box.attributes.uv.array[8 * 3 + 0] =    0 / 3072;
            box.attributes.uv.array[8 * 3 + 1] = 2048 / 2048;
            box.attributes.uv.array[8 * 3 + 2] = 1024 / 3072;
            box.attributes.uv.array[8 * 3 + 3] = 2048 / 2048;
            box.attributes.uv.array[8 * 3 + 4] =    0 / 3072;
            box.attributes.uv.array[8 * 3 + 5] = 1024 / 2048;
            box.attributes.uv.array[8 * 3 + 6] = 1024 / 3072;
            box.attributes.uv.array[8 * 3 + 7] = 1020 / 2048;

            result.dirtGrass = box;
        }
        else {
            const planes = createPlanes();

            for (let i = 0; i < planes.length; i++) {

                // Skip positive and negative Y
                if (i == 2 || i == 3) {
                    continue;
                }
                planes[i].attributes.uv.array[0] = 2048 / 3072;
                planes[i].attributes.uv.array[1] = 2048 / 2048;
                planes[i].attributes.uv.array[2] = 3072 / 3072;
                planes[i].attributes.uv.array[3] = 2048 / 2048;
                planes[i].attributes.uv.array[4] = 2048 / 3072;
                planes[i].attributes.uv.array[5] = 1024 / 2048;
                planes[i].attributes.uv.array[6] = 3072 / 3072;
                planes[i].attributes.uv.array[7] = 1024 / 2048;
            }

            planes[2].attributes.uv.array[0] = 1024 / 3072;
            planes[2].attributes.uv.array[1] = 2048 / 2048;
            planes[2].attributes.uv.array[2] = 2048 / 3072;
            planes[2].attributes.uv.array[3] = 2048 / 2048;
            planes[2].attributes.uv.array[4] = 1024 / 3072;
            planes[2].attributes.uv.array[5] = 1024 / 2048;
            planes[2].attributes.uv.array[6] = 2048 / 3072;
            planes[2].attributes.uv.array[7] = 1024 / 2048;

            planes[3].attributes.uv.array[0] =    0 / 3072;
            planes[3].attributes.uv.array[1] = 2048 / 2048;
            planes[3].attributes.uv.array[2] = 1024 / 3072;
            planes[3].attributes.uv.array[3] = 2048 / 2048;
            planes[3].attributes.uv.array[4] =    0 / 3072;
            planes[3].attributes.uv.array[5] = 1024 / 2048;
            planes[3].attributes.uv.array[6] = 1024 / 3072;
            planes[3].attributes.uv.array[7] = 1020 / 2048;

            result.dirtGrass = planes;
        }
    }

    // Plaster
    {
        if (useSingleBox) {
            const box = new THREE.BoxBufferGeometry();
            for (let i = 0; i < 6; i++) {
                box.attributes.uv.array[8 * i + 0] = 2048 / 3072;
                box.attributes.uv.array[8 * i + 1] = 1024 / 2048;
                box.attributes.uv.array[8 * i + 2] = 3072 / 3072;
                box.attributes.uv.array[8 * i + 3] = 1024 / 2048;
                box.attributes.uv.array[8 * i + 4] = 2048 / 3072;
                box.attributes.uv.array[8 * i + 5] =    0 / 2048;
                box.attributes.uv.array[8 * i + 6] = 3072 / 3072;
                box.attributes.uv.array[8 * i + 7] =    0 / 2048;
            }

            result.plaster = box;
        }
        else {
            const planes = createPlanes();

            for (let i = 0; i < planes.length; i++) {
                planes[i].attributes.uv.array[0] = 2048 / 3072;
                planes[i].attributes.uv.array[1] = 1024 / 2048;
                planes[i].attributes.uv.array[2] = 3072 / 3072;
                planes[i].attributes.uv.array[3] = 1024 / 2048;
                planes[i].attributes.uv.array[4] = 2048 / 3072;
                planes[i].attributes.uv.array[5] =    0 / 2048;
                planes[i].attributes.uv.array[6] = 3072 / 3072;
                planes[i].attributes.uv.array[7] =    0 / 2048;
            }

            result.plaster = planes;
        }
    }

    // Cobblestone
    {
        if (useSingleBox) {
            const box = new THREE.BoxBufferGeometry();
            for (let i = 0; i < 6; i++) {
                box.attributes.uv.array[8 * i + 0] =    0 / 3072;
                box.attributes.uv.array[8 * i + 1] = 1024 / 2048;
                box.attributes.uv.array[8 * i + 2] = 1024 / 3072;
                box.attributes.uv.array[8 * i + 3] = 1024 / 2048;
                box.attributes.uv.array[8 * i + 4] =    0 / 3072;
                box.attributes.uv.array[8 * i + 5] =    0 / 2048;
                box.attributes.uv.array[8 * i + 6] = 1024 / 3072;
                box.attributes.uv.array[8 * i + 7] =    0 / 2048;
            }

            result.cobblestone = box;
        }
        else {
            const planes = createPlanes();

            for (let i = 0; i < planes.length; i++) {
                planes[i].attributes.uv.array[0] = 0.00;
                planes[i].attributes.uv.array[1] = 0.75;
                planes[i].attributes.uv.array[2] = 0.25;
                planes[i].attributes.uv.array[3] = 0.75;
                planes[i].attributes.uv.array[4] = 0.00;
                planes[i].attributes.uv.array[5] = 0.50;
                planes[i].attributes.uv.array[6] = 0.25;
                planes[i].attributes.uv.array[7] = 0.50;
            }

            result.cobblestone = planes;
        }
    }

    // Bricks
    {
        if (useSingleBox) {
            const box = new THREE.BoxBufferGeometry();
            for (let i = 0; i < 6; i++) {
                box.attributes.uv.array[8 * i + 0] = 1024 / 3072;
                box.attributes.uv.array[8 * i + 1] = (1024 / 3) / 2048;
                box.attributes.uv.array[8 * i + 2] = (1024 + (1024 / 3)) / 3072;
                box.attributes.uv.array[8 * i + 3] = (1024 / 3) / 2048;
                box.attributes.uv.array[8 * i + 4] = 1024 / 3072;
                box.attributes.uv.array[8 * i + 5] =    0 / 2048;
                box.attributes.uv.array[8 * i + 6] = (1024 + (1024 / 3)) / 3072;
                box.attributes.uv.array[8 * i + 7] =    0 / 2048;
            }

            result.bricks = box;
        }
        else {
            const planes = createPlanes();

            for (let i = 0; i < planes.length; i++) {
                planes[i].attributes.uv.array[0] = 1024 / 3072;
                planes[i].attributes.uv.array[1] = (1024 / 3) / 2048;
                planes[i].attributes.uv.array[2] = (1024 + (1024 / 3)) / 3072;
                planes[i].attributes.uv.array[3] = (1024 / 3) / 2048;
                planes[i].attributes.uv.array[4] = 1024 / 3072;
                planes[i].attributes.uv.array[5] =    0 / 2048;
                planes[i].attributes.uv.array[6] = (1024 + (1024 / 3)) / 3072;
                planes[i].attributes.uv.array[7] =    0 / 2048;
            }

            result.bricks = planes;
        }
    }

    return result;
}

const addBoxGeometry = (geometries, planes, material, matrix) => {
    if (useSingleBox) {
        geometries.push(planes[material].clone().applyMatrix(matrix));
    }
    else {
        geometries.push(planes[material][0].clone().applyMatrix(matrix));
        geometries.push(planes[material][1].clone().applyMatrix(matrix));
        geometries.push(planes[material][2].clone().applyMatrix(matrix));
        geometries.push(planes[material][3].clone().applyMatrix(matrix));
        geometries.push(planes[material][4].clone().applyMatrix(matrix));
        geometries.push(planes[material][5].clone().applyMatrix(matrix));
    }
}

const createBox = (planes, planesMaterialName, material) => {
    const geometries = [];

    if (useSingleBox) {
        geometries.push(planes[planesMaterialName].clone());
    }
    else {
        geometries.push(planes[planesMaterialName][0].clone());
        geometries.push(planes[planesMaterialName][1].clone());
        geometries.push(planes[planesMaterialName][2].clone());
        geometries.push(planes[planesMaterialName][3].clone());
        geometries.push(planes[planesMaterialName][4].clone());
        geometries.push(planes[planesMaterialName][5].clone());
    }

    const boxGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
    boxGeometry.computeBoundingSphere();

    const boxMesh = new THREE.Mesh(boxGeometry, material);
    boxMesh.receiveShadow = true;
    boxMesh.castShadow = true;
    return boxMesh;
}

const getHeightData = (img, scale, onProgress) => {
    scale = scale || 1;

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');

    context.drawImage(img, 0, 0);

    const imgd = context.getImageData(0, 0, img.width, img.height);
    const pix = imgd.data;

    const data = [];
    for (let row = 0; row < img.height; row++) {
        data.push([]);
        for (let col = 0; col < img.width; col++) {
            const offset = row * img.width * 4 + col * 4;
            const r = pix[offset];
            const g = pix[offset + 1];
            const b = pix[offset + 2];
            const a = pix[offset + 3];

            data[row].push({
                value: scale * (r + g + b) / 3,
                alpha: a
            });
        }

        onProgress(row / img.height);
    }

    return data;
}

const createWall = (width, height, hasDoor, planes, material, materialName) => {
    const wallGeometries = [];
    const matrix = new THREE.Matrix4();
    const doorPosition = hasDoor ? Math.floor(width / 2) : -1;

    for (var w = 0; w < width; w++) {
        for (var h = 0; h < height; h++) {

            if (w == doorPosition && h < 2) {
                continue;
            }

            matrix.makeTranslation(w, h, 0);
            addBoxGeometry(wallGeometries, planes, materialName, matrix);
        }
    }

    const wallGeometry = BufferGeometryUtils.mergeBufferGeometries(wallGeometries);
    wallGeometry.computeBoundingSphere();

    const wallMesh = new THREE.Mesh(wallGeometry, material);
    wallMesh.receiveShadow = true;
    wallMesh.castShadow = true;
    return wallMesh;
}

const createRoof = (width, depth, planes, material, materialName) => {
    const roofGeometries = [];
    const matrix = new THREE.Matrix4();

    for (var w = 0; w < width; w++) {
        for (var d = 0; d < depth; d++) {
            matrix.makeTranslation(w, 0, d);
            addBoxGeometry(roofGeometries, planes, materialName, matrix);
        }
    }

    const roofGeometry = BufferGeometryUtils.mergeBufferGeometries(roofGeometries);
    roofGeometry.computeBoundingSphere();

    const roofMesh = new THREE.Mesh(roofGeometry, material);
    roofMesh.receiveShadow = true;
    roofMesh.castShadow = true;
    return roofMesh;
}

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export {
    createBoxPlanes,
    addBoxGeometry,
    createBox,
    getHeightData,
    createWall,
    createRoof,
    getRandomColor
};