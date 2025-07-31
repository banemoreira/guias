import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

const camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 13;

const scene = new THREE.Scene();
let bee;
let mixer;
const loader = new GLTFLoader();
loader.load('/demon_bee_full_texture.glb',
    function (gltf) {
        bee = gltf.scene;
        
        // Scale the bee model to be 10 times smaller
        bee.scale.set(0.10, 0.10, 0.10);
        
        // Initially hide the bee
        bee.visible = false;
        
        scene.add(bee);

        mixer = new THREE.AnimationMixer(bee);
        mixer.clipAction(gltf.animations[1]).play();
        modelMove();
    },
    function (xhr) {},
    function (error) {}
);
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);


const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
    if(mixer) mixer.update(0.015);
};
reRender3D();

const modelMove = () => {
    const slides = document.querySelectorAll('.slide');
    const slide3 = slides[2]; // third slide (index 2)
    
    if (slide3) {
        const rect = slide3.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if slide 3 is visible
        if (rect.top <= windowHeight && rect.bottom >= 0) {
            // Show and animate the bee when slide 3 is visible
            bee.visible = true;
            gsap.to(bee.position, {
                x: 0,
                y: -1, // Position at bottom of the page
                z: 0,
                duration: 2,
                ease: "power2.out"
            });
            gsap.to(bee.rotation, {
                x: 0,
                y: Math.PI * 2,
                z: 0,
                duration: 6,
                ease: "power1.inOut"
            });
        } else {
            // Hide the bee when slide 3 is not visible
            bee.visible = false;
        }
    }
}

// Add click interaction for rotation
let isRotating = false;
renderer.domElement.addEventListener('click', (event) => {
    if (bee && bee.visible && !isRotating) {
        isRotating = true;
        
        // Get current rotation and add a full 360 degree rotation
        const currentY = bee.rotation.y;
        gsap.to(bee.rotation, {
            y: currentY + Math.PI * 1.5,
            duration: 3,
            ease: "power2.inOut",
            onComplete: () => {
                isRotating = false;
            }
        });
        
        // Add a little bounce animation too
        gsap.to(bee.position, {
            y: bee.position.y + 0.5,
            duration: 0.3,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        });
    }
});

window.addEventListener('scroll', () => {
    if (bee) {
        modelMove();
    }
})
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})