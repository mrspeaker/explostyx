(function (THREE) {

  'use strict';

  let width;
  let height;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 0.75, 0.1, 30);
  const r = new THREE.WebGLRenderer({antialias: true});
  const dom = r.domElement;
  document.body.appendChild(dom);
  dom.style.position = 'absolute';
  dom.style.top = dom.style.left = 0;

  const resize = () => {
    height = window.innerHeight;
    width = window.innerWidth;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    r.setSize(width, height);
  };
  window.addEventListener('resize', resize, false);
  resize();

  let mouse = { x: width * 0.5, y: height * 0.5 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, false);
  window.addEventListener('mouseout', () => {
    mouse.x = width * 0.5;
    mouse.y = height * 0.5;
  }, false);

  const geometry = new THREE.BoxGeometry(0.1, 1, 0.1);
  const material = new THREE.MeshLambertMaterial({
    color: 0xf0f0a6,
    shading: THREE.FlatShading
  });

  const cubes = [true]
    .reduce((ac, e) => {
      while (ac.length < 650) { ac.push(e); }
      return ac;
    },[])
    //.fill(true)
    .map((c, n) => {
      const x = Math.cos(n) * 3.5;
      const y = Math.sin(n) * 2;
      return [x, y, -11];
    })
    .map(function (pos, i) {
      const cube = new THREE.Mesh(geometry, material);
      const {rotation, position} = cube;
      position.set(...pos);
      rotation.y = rotation.x = Math.random() * (Math.PI * 2) * i;

      cube.userData = {
        rotSpeed: (1 + (Math.random())) * 0.05,
        vel: new THREE.Vector3(),
        dir: new THREE.Vector3(),
        maxVel: 0.1 + (Math.random() * 0.4),
        fric: 0.992 + (Math.random() * 0.005)
      };

      return cube;
    })
    .map(function (c) {
      scene.add(c);
      return c;
    });

  camera.position.z = 2.9;

  const forePoint = new THREE.PointLight(0xffe5ef, 1.4, 12);
  forePoint.position.set(0, 0, 2.9);
  const mainColor = new THREE.DirectionalLight(0xffc5af, 0.5);
  mainColor.position.set(0, 1, 1);

  scene.add(forePoint);
  scene.add(mainColor);
  scene.add(new THREE.AmbientLight(0x242420));
  scene.fog = new THREE.Fog(0x06000a, 10, 16);

  const mouseVec = new THREE.Vector3();
  const pos = new THREE.Vector3();

  (function tick () {

    // Mouse handling
    mouseVec.set((mouse.x / width) * 2 - 1, -(mouse.y / height) * 2 + 1, 0.5);
    mouseVec.unproject(camera);
    const mouseDir = mouseVec.sub(camera.position).normalize();
    const distance = -camera.position.z / mouseDir.z + 12;
    pos.addVectors(camera.position, mouseDir.multiplyScalar(distance));

    // Move cubes
    cubes.forEach(cube => {

      const { rotation, position, userData } = cube;
      const { dir, vel, rotSpeed, maxVel, fric } = userData;
      const dt = Date.now() / 5000;

      // Rotation
      rotation.x += rotSpeed * (Math.sin(dt));
      rotation.y += rotSpeed * (Math.cos(dt));
      rotation.z += rotSpeed * (Math.cos(dt));

      // Velocity
      dir.subVectors(pos, position).normalize().multiplyScalar(0.01);
      vel.add(dir).clampScalar(-maxVel, maxVel);
      position.add(vel);

      // Friction
      vel.multiplyScalar(fric);

    });

    r.render(scene, camera);
    requestAnimationFrame(tick);

  }());

}(window.THREE));
