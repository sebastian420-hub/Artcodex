import{ PlaneGeometry, MeshBasicMaterial, Mesh } from 'three';


class Wave {
    constructor(analyser, dataArray) {
        this.geometry = new PlaneGeometry(1, 1, 64, 64); 
        this.material = new MeshBasicMaterial({ color: 0xfffff });
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.rotation.x = Math.PI / 2;
        this.analyser = analyser;
        this.dataArray = dataArray;
        this.mesh.position.y = 0; 
    }

    tick() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        const positions = this.geometry.attributes.position.array;
        for (let i = 0; i < 65; i++) { 
            const z = (this.dataArray[i % this.dataArray.length] / 255) * 2 - 1; // -1 to 1 range
            positions[i * 3 + 2] = z; 
        }
        this.geometry.attributes.position.needsUpdate = true;
    }
}

export { Wave };