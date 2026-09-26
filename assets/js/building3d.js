/**
 * LUXORA REALTY - Realistic 3D Architectural Models Suite
 * 1. Primary Luxury Skyscraper (1024x1024 Viewport with Three.js)
 * 2. Secondary Spatial 3D Penthouse Duplex Blueprint Hologram
 */

// ============================================================================
// 1. PRIMARY LUXURY SKYSCRAPER 3D VIEWER
// ============================================================================
class Building3DViewer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.container = this.canvas.parentElement;
    this.isRotating = true;
    this.currentMode = 'dusk';

    this.initScene();
    this.createLighting();
    this.buildRealisticTower();
    this.setupControls();
    this.bindEvents();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFDFBF7);
    this.scene.fog = new THREE.FogExp2(0xFDFBF7, 0.012);

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    this.camera.position.set(26, 20, 32);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
      this.controls.minDistance = 16;
      this.controls.maxDistance = 65;
      this.controls.target.set(0, 12, 0);
    }
  }

  createLighting() {
    this.ambientLight = new THREE.AmbientLight(0xFFF8EB, 1.3);
    this.scene.add(this.ambientLight);

    // Warm Sun - Metallic Champagne Glow
    this.sunLight = new THREE.DirectionalLight(0xFCE7B3, 2.4);
    this.sunLight.position.set(32, 48, 28);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.bias = -0.0004;
    this.scene.add(this.sunLight);

    // Soft Creamy Sage Rim Light
    this.rimLight = new THREE.DirectionalLight(0xD8E8DC, 0.95);
    this.rimLight.position.set(-28, 22, -22);
    this.scene.add(this.rimLight);

    // Interior Warm Core Lights
    const glow1 = new THREE.PointLight(0xFFBF54, 1.8, 32);
    glow1.position.set(0, 14, 0);
    this.scene.add(glow1);

    const glow2 = new THREE.PointLight(0xFFE8AB, 2.0, 28);
    glow2.position.set(0, 26, 0);
    this.scene.add(glow2);
  }

  buildRealisticTower() {
    this.towerGroup = new THREE.Group();

    // Materials
    const goldFinsMat = new THREE.MeshStandardMaterial({
      color: 0xC5A059,
      metalness: 0.88,
      roughness: 0.22,
      emissive: 0x382806,
      emissiveIntensity: 0.18
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0x82662B,
      metalness: 0.92,
      roughness: 0.32
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xEDF5F0,
      metalness: 0.08,
      roughness: 0.08,
      transmission: 0.82,
      thickness: 1.4,
      transparent: true,
      opacity: 0.9,
      reflectivity: 0.92
    });

    const coreLitMat = new THREE.MeshStandardMaterial({
      color: 0xFFF3D6,
      emissive: 0xF7D070,
      emissiveIntensity: 0.38,
      roughness: 0.45
    });

    const marblePlinthMat = new THREE.MeshStandardMaterial({
      color: 0xF4EFE6,
      roughness: 0.35,
      metalness: 0.04
    });

    const sageGardenMat = new THREE.MeshStandardMaterial({
      color: 0x4A6B56,
      roughness: 0.75,
      metalness: 0.04
    });

    // Base Stepped Plinth
    const plinth1 = new THREE.Mesh(new THREE.CylinderGeometry(17, 18, 1.2, 54), marblePlinthMat);
    plinth1.position.y = -0.6;
    plinth1.receiveShadow = true;
    this.towerGroup.add(plinth1);

    const plinth2 = new THREE.Mesh(new THREE.CylinderGeometry(14, 15, 0.6, 54), marblePlinthMat);
    plinth2.position.y = 0.3;
    plinth2.receiveShadow = true;
    this.towerGroup.add(plinth2);

    // Grand Entrance Lobby & Double Height Porte-Cochere
    const lobby = new THREE.Mesh(new THREE.BoxGeometry(11.5, 3.8, 9.5), goldFinsMat);
    lobby.position.y = 2.2;
    lobby.castShadow = true;
    this.towerGroup.add(lobby);

    const lobbyGlass = new THREE.Mesh(new THREE.BoxGeometry(11.7, 2.8, 4.5), glassMat);
    lobbyGlass.position.y = 1.9;
    this.towerGroup.add(lobbyGlass);

    // Podium Sky Garden
    const gardenPodium = new THREE.Mesh(new THREE.BoxGeometry(12.2, 0.45, 10.2), sageGardenMat);
    gardenPodium.position.y = 4.3;
    this.towerGroup.add(gardenPodium);

    // Manicured Conical Trees on Podium
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const x = Math.cos(angle) * 7.8;
      const z = Math.sin(angle) * 6.8;
      const tree = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2.0, 8), sageGardenMat);
      tree.position.set(x, 1.2, z);
      tree.castShadow = true;
      this.towerGroup.add(tree);
    }

    // Main Tower Bodies
    const floorCount = 22;
    const floorHeight = 1.08;

    // Glowing core
    const core = new THREE.Mesh(new THREE.BoxGeometry(4.6, floorCount * floorHeight, 4.6), coreLitMat);
    core.position.y = 4.5 + (floorCount * floorHeight) / 2;
    this.towerGroup.add(core);

    for (let i = 0; i < floorCount; i++) {
      const yPos = 4.5 + i * floorHeight;
      const floorGroup = new THREE.Group();
      floorGroup.position.y = yPos;

      const factor = 1 - Math.pow(i / floorCount, 1.9) * 0.28;
      const w = 7.4 * factor;
      const d = 6.4 * factor;

      // Slab with Gold Rim
      const slab = new THREE.Mesh(new THREE.BoxGeometry(w, 0.16, d), goldFinsMat);
      slab.castShadow = true;
      slab.receiveShadow = true;
      floorGroup.add(slab);

      // Panoramic Glass Facade
      const glass = new THREE.Mesh(new THREE.BoxGeometry(w - 0.22, floorHeight - 0.16, d - 0.22), glassMat);
      glass.position.y = floorHeight / 2;
      floorGroup.add(glass);

      // Architectural Mullions
      const mullionMat = (i % 2 === 0) ? goldFinsMat : bronzeMat;
      const finA = new THREE.Mesh(new THREE.BoxGeometry(0.12, floorHeight, 0.45), mullionMat);
      finA.position.set(-w / 2 + 0.1, floorHeight / 2, d / 2 - 0.2);
      floorGroup.add(finA);

      const finB = new THREE.Mesh(new THREE.BoxGeometry(0.12, floorHeight, 0.45), mullionMat);
      finB.position.set(w / 2 - 0.1, floorHeight / 2, d / 2 - 0.2);
      floorGroup.add(finB);

      // Cantilevered Terraces on Levels 7, 14, 20
      if (i === 7 || i === 14 || i === 20) {
        const terrace = new THREE.Mesh(new THREE.BoxGeometry(w + 1.4, 0.2, 2.4), goldFinsMat);
        terrace.position.set(0, 0, d / 2 + 1.0);
        floorGroup.add(terrace);

        const greenery = new THREE.Mesh(new THREE.BoxGeometry(w + 1.0, 0.15, 2.0), sageGardenMat);
        greenery.position.set(0, 0.12, d / 2 + 1.0);
        floorGroup.add(greenery);
      }

      this.towerGroup.add(floorGroup);
    }

    // Crown & Penthouse Sky Deck (Levels 23–26)
    const crownY = 4.5 + floorCount * floorHeight;

    const skyDuplex = new THREE.Mesh(new THREE.BoxGeometry(5.4, 3.2, 4.6), glassMat);
    skyDuplex.position.y = crownY + 1.6;
    this.towerGroup.add(skyDuplex);

    const crownCap = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.4, 5.0), goldFinsMat);
    crownCap.position.y = crownY + 3.4;
    this.towerGroup.add(crownCap);

    // Architectural Spire
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.55, 6.5, 16), goldFinsMat);
    spire.position.y = crownY + 6.8;
    spire.castShadow = true;
    this.towerGroup.add(spire);

    // Beacon
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), new THREE.MeshBasicMaterial({ color: 0xFFE082 }));
    beacon.position.y = crownY + 10.2;
    this.towerGroup.add(beacon);

    this.scene.add(this.towerGroup);
  }

  setupControls() {
    const rotateBtn = document.getElementById('btn-3d-rotate');
    const duskBtn = document.getElementById('btn-3d-dusk');
    const dayBtn = document.getElementById('btn-3d-day');
    const pentBtn = document.getElementById('btn-3d-penthouse');

    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        this.isRotating = !this.isRotating;
        rotateBtn.classList.toggle('active', this.isRotating);
        rotateBtn.innerHTML = this.isRotating ? '<span>⏸</span> Pause' : '<span>▶</span> Auto Orbit';
      });
    }

    if (duskBtn) {
      duskBtn.addEventListener('click', () => {
        this.setLightingMode('dusk');
        duskBtn.classList.add('active');
        if (dayBtn) dayBtn.classList.remove('active');
      });
    }

    if (dayBtn) {
      dayBtn.addEventListener('click', () => {
        this.setLightingMode('day');
        dayBtn.classList.add('active');
        if (duskBtn) duskBtn.classList.remove('active');
      });
    }

    if (pentBtn) {
      pentBtn.addEventListener('click', () => {
        this.focusPenthouse();
      });
    }
  }

  setLightingMode(mode) {
    if (mode === 'day') {
      this.scene.background = new THREE.Color(0xFBF9F4);
      this.scene.fog.color = new THREE.Color(0xFBF9F4);
      this.sunLight.color.setHex(0xFFF6DE);
      this.sunLight.intensity = 2.4;
      this.ambientLight.intensity = 1.4;
      this.updateLevelDisplay('Daylight View', 'Signature Sunlit Elevation & Green Podium Gardens');
    } else {
      this.scene.background = new THREE.Color(0xF4EFE5);
      this.scene.fog.color = new THREE.Color(0xF4EFE5);
      this.sunLight.color.setHex(0xF5BA6E);
      this.sunLight.intensity = 2.0;
      this.ambientLight.intensity = 1.0;
      this.updateLevelDisplay('Golden Dusk Aura', 'Warm Ambient Lighting & Metallic Gold Shimmer');
    }
  }

  focusPenthouse() {
    if (!this.controls) return;
    const targetY = 27;
    const startTime = Date.now();
    const duration = 1200;
    const startY = this.controls.target.y;

    const animateFocus = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

      this.controls.target.y = startY + (targetY - startY) * ease;
      this.controls.update();

      if (progress < 1) {
        requestAnimationFrame(animateFocus);
      } else {
        this.updateLevelDisplay('Ultra-Luxury Penthouse & Sky Villa Suite', 'Levels 23–26 | 9,800 Sq.Ft | Private Sky Pool & Terrace');
      }
    };
    animateFocus();
  }

  updateLevelDisplay(title, meta) {
    const titleEl = document.getElementById('3d-level-title');
    const metaEl = document.getElementById('3d-level-meta');
    if (titleEl) titleEl.innerText = title;
    if (metaEl) metaEl.innerText = meta;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.isRotating && this.towerGroup) {
      this.towerGroup.rotation.y += 0.0032;
    }

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// ============================================================================
// 2. SECONDARY 3D ARCHITECTURAL ELEMENT: SKY VILLA SPATIAL BLUEPRINT
// ============================================================================
class SpatialBlueprint3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.container = this.canvas.parentElement;
    this.init();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x191E1B);

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 500);
    this.camera.position.set(14, 12, 16);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 1.2;
      this.controls.target.set(0, 1, 0);
    }

    // Ambient & Directional
    const amb = new THREE.AmbientLight(0xFFFFFF, 0.9);
    this.scene.add(amb);

    const dir = new THREE.DirectionalLight(0xEBD8A9, 1.8);
    dir.position.set(10, 20, 10);
    this.scene.add(dir);

    // Build Blueprint Wireframe Floorplate
    this.modelGroup = new THREE.Group();

    // Base Grid
    const grid = new THREE.GridHelper(16, 16, 0xC5A059, 0x334037);
    grid.position.y = -0.05;
    this.modelGroup.add(grid);

    // Glass & Gold Materials
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x222C25,
      metalness: 0.5,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xE8D39E,
      wireframe: true
    });

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xC5A059,
      metalness: 0.8,
      roughness: 0.25
    });

    // Main Penthouse Living Salon Plate
    const mainSlab = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 8), floorMat);
    this.modelGroup.add(mainSlab);

    const wireSlab = new THREE.Mesh(new THREE.BoxGeometry(10.05, 0.22, 8.05), wireMat);
    this.modelGroup.add(wireSlab);

    // Master Presidential Suite Zone
    const masterSuite = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.2, 3.8), new THREE.MeshPhysicalMaterial({
      color: 0xC5A059,
      transparent: true,
      opacity: 0.35,
      metalness: 0.2
    }));
    masterSuite.position.set(-2.4, 1.1, -1.8);
    this.modelGroup.add(masterSuite);

    // Grand Double-Height Salon & Dining
    const grandSalon = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.4, 5.0), new THREE.MeshPhysicalMaterial({
      color: 0x4A6B56,
      transparent: true,
      opacity: 0.38,
      metalness: 0.2
    }));
    grandSalon.position.set(2.4, 1.7, -1.0);
    this.modelGroup.add(grandSalon);

    // Private Heated Plunge Pool
    const pool = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.6, 2.0), new THREE.MeshStandardMaterial({
      color: 0x3DA58A,
      roughness: 0.1,
      metalness: 0.3
    }));
    pool.position.set(2.4, 0.3, 2.6);
    this.modelGroup.add(pool);

    // Gold Perimeter Columns
    for (let x = -4.5; x <= 4.5; x += 4.5) {
      for (let z = -3.5; z <= 3.5; z += 3.5) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.6, 12), wallMat);
        col.position.set(x, 1.8, z);
        this.modelGroup.add(col);
      }
    }

    this.scene.add(this.modelGroup);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Auto-initialize
window.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined') {
    window.luxora3D = new Building3DViewer('building-three-canvas');
    window.luxoraSpatial = new SpatialBlueprint3D('spatial-three-canvas');
  }
});
