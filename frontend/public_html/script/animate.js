let scene, camera, renderer;
let balls = [];
let direction = 1;
let maxBalls = 15;

// Iniciar la animación
function startAnimation() {
    // Configurar la escena
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();

    const containerSize = 800;
    renderer.setSize(containerSize, containerSize);
    document.getElementById('animationContainer').appendChild(renderer.domElement);

    const container = document.getElementById('animationContainer');
    container.style.width = `${containerSize}px`;
    container.style.height = `${containerSize}px`;
    container.style.margin = '0 auto';
    container.style.display = 'block';

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    addBall();

    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    animate();
}

function addBall() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(Math.random() * 4 - 2, Math.random() * 2 - 1, Math.random() * 4 - 2);
    sphere.velocityY = (Math.random() * 0.02 + 0.01) * direction;

    balls.push(sphere);
    scene.add(sphere);
}

function mergeBalls() {
    const mergedGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const mergedMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const mergedSphere = new THREE.Mesh(mergedGeometry, mergedMaterial);

    mergedSphere.position.set(0, 0, 0);
    balls.forEach(ball => scene.remove(ball));
    balls = [mergedSphere];
    scene.add(mergedSphere);

    setTimeout(() => {
        balls = [];
        addBall(); 
    }, 1000);
}

function animate() {
    requestAnimationFrame(animate);

    balls.forEach(ball => {
        ball.position.y += ball.velocityY;
        if (ball.position.y > 2 || ball.position.y < -2) {
            ball.velocityY *= -1; // Rebote
            if (balls.length < maxBalls) {
                addBall(); 
            } else {
                mergeBalls();
            }
        }
    });

    renderer.render(scene, camera);
}
window.addEventListener('load', startAnimation);

startAnimation();