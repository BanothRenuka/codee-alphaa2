// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a3cff);

// Camera
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / 500,
    0.1,
    1000
);
camera.position.set(0, 2, 6);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, 500);
document.getElementById("viewer").appendChild(renderer.domElement);

// Beam Geometry (FEA Element Representation)
const geometry = new THREE.BoxGeometry(4, 0.4, 0.4);

// Stress color gradient (blue → red)
const material = new THREE.MeshStandardMaterial({
    vertexColors: true
});

// Assign stress colors
const colors = [];
for (let i = 0; i < geometry.attributes.position.count; i++) {
    const x = geometry.attributes.position.getX(i);
    const stressFactor = (x + 2) / 4; // 0 to 1
    colors.push(stressFactor, 0, 1 - stressFactor);
}
geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
);

// Beam Mesh
const beam = new THREE.Mesh(geometry, material);
beam.position.x = 0;
scene.add(beam);

// Fixed Support (Wall)
const supportGeometry = new THREE.BoxGeometry(0.3, 1, 1);
const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const support = new THREE.Mesh(supportGeometry, supportMaterial);
support.position.x = -2.2;
scene.add(support);

// Load Arrow
const arrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(2, 0, 0),
    1,
    0xff0000
);
scene.add(arrow);

// Lighting
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(5, 5, 5);
scene.add(light1);

scene.add(new THREE.AmbientLight(0x404040));

// Animation (Deformation)
let deform = 0;
function animate() {
    requestAnimationFrame(animate);
    deform += 0.002;
    beam.rotation.z = Math.sin(deform) * 0.03; // deformation
    renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / 500;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, 500);
});
