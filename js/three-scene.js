// 3D Experience Engine using Three.js
// Features: 3D Waterfalls with particle physics, 3D Swimming Pool with ripple animation, 3D Buffalos in 50-acre sanctuary, and 100-acre master plan.

class Estate3DExperience {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();
    this.animationFrameId = null;

    // Interactive elements & state
    this.currentMode = "overview"; // 'overview', 'waterfall-pool', 'buffalos', 'flowers'
    this.timeOfDay = "day"; // 'day', 'sunset', 'night'
    this.targetCameraPos = new THREE.Vector3(120, 95, 140);
    this.targetLookAt = new THREE.Vector3(0, 0, 0);

    // 3D object references
    this.waterfallParticles = null;
    this.waterfallMist = null;
    this.poolWater = null;
    this.buffalos = [];
    this.directionalLight = null;
    this.ambientLight = null;
    this.nightLamps = [];
    this.interactivePins = [];

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 550;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd9edf7);
    this.scene.fog = new THREE.FogExp2(0xd9edf7, 0.0025);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.set(130, 100, 150);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    if (window.THREE && THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2.05; // prevent going below ground
      this.controls.minDistance = 20;
      this.controls.maxDistance = 350;
      this.controls.target.set(0, 5, 0);
    }

    // 5. Lighting
    this.setupLighting();

    // 6. Build the 100-Acre World
    this.buildTerrain();
    this.buildRoads();
    this.buildCentralFarmhouse();
    this.buildSwimmingPool();
    this.buildWaterfalls();
    this.buildBuffaloSanctuary();
    this.buildPoultryFarm();
    this.buildFlowerFields();
    this.buildGrassFodderPasture();
    this.buildSecurityEntrance();
    this.buildPerimeterFenceAndTrees();

    // 7. Event Listeners
    window.addEventListener("resize", () => this.onWindowResize());

    // 8. Animation Loop
    this.animate();
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    this.directionalLight.position.set(90, 140, 60);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 10;
    this.directionalLight.shadow.camera.far = 400;
    const d = 140;
    this.directionalLight.shadow.camera.left = -d;
    this.directionalLight.shadow.camera.right = d;
    this.directionalLight.shadow.camera.top = d;
    this.directionalLight.shadow.camera.bottom = -d;
    this.directionalLight.shadow.bias = -0.0005;
    this.scene.add(this.directionalLight);

    // Warm bounce light
    const hemiLight = new THREE.HemisphereLight(0x7ec850, 0x3d7031, 0.4);
    this.scene.add(hemiLight);
  }

  buildTerrain() {
    // 100-Acre Ground Plane (representing the vast landscape)
    const groundGeo = new THREE.PlaneGeometry(280, 280, 64, 64);
    
    // Add subtle undulations
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      // Gentle slope towards edges
      const dist = Math.sqrt(vx * vx + vy * vy);
      let z = Math.sin(vx * 0.05) * Math.cos(vy * 0.05) * 1.5;
      if (dist > 100) z -= (dist - 100) * 0.05;
      pos.setZ(i, z);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x3a6927,
      roughness: 0.85,
      metalness: 0.05
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  buildRoads() {
    // Paved neat roads crisscrossing the 100 acres
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x333339,
      roughness: 0.6,
      metalness: 0.1
    });

    // Circular boulevard around the central farmhouse
    const ringGeo = new THREE.RingGeometry(38, 44, 48);
    const ring = new THREE.Mesh(ringGeo, roadMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    ring.receiveShadow = true;
    this.scene.add(ring);

    // North-South Main Highway / Avenue
    const roadGeo1 = new THREE.PlaneGeometry(10, 240);
    const road1 = new THREE.Mesh(roadGeo1, roadMat);
    road1.rotation.x = -Math.PI / 2;
    road1.position.set(0, 0.06, 0);
    road1.receiveShadow = true;
    this.scene.add(road1);

    // East-West Connecting Road
    const roadGeo2 = new THREE.PlaneGeometry(240, 10);
    const road2 = new THREE.Mesh(roadGeo2, roadMat);
    road2.rotation.x = -Math.PI / 2;
    road2.position.set(0, 0.06, 0);
    road2.receiveShadow = true;
    this.scene.add(road2);

    // Road markings (white dashed line)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = -100; i <= 100; i += 12) {
      if (Math.abs(i) < 25) continue; // skip intersection
      const markGeo = new THREE.PlaneGeometry(0.8, 5);
      const mark = new THREE.Mesh(markGeo, lineMat);
      mark.rotation.x = -Math.PI / 2;
      mark.position.set(0, 0.08, i);
      this.scene.add(mark);

      const markH = new THREE.Mesh(markGeo, lineMat);
      markH.rotation.x = -Math.PI / 2;
      markH.rotation.z = Math.PI / 2;
      markH.position.set(i, 0.08, 0);
      this.scene.add(markH);
    }

    // Street lights along the roads
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xffeedd, emissive: 0xffcc77, emissiveIntensity: 0.2 });

    const lampPositions = [
      [-18, 0, -25], [18, 0, -25], [-18, 0, 25], [18, 0, 25],
      [-50, 0, -8], [50, 0, -8], [-8, 0, -50], [-8, 0, 50],
      [8, 0, -80], [8, 0, 80], [-80, 0, 8], [80, 0, 8]
    ];

    lampPositions.forEach(([x, y, z]) => {
      const poleGeo = new THREE.CylinderGeometry(0.2, 0.3, 6, 8);
      const pole = new THREE.Mesh(poleGeo, lampMat);
      pole.position.set(x, 3, z);
      pole.castShadow = true;
      this.scene.add(pole);

      const headGeo = new THREE.SphereGeometry(0.6, 12, 12);
      const head = new THREE.Mesh(headGeo, bulbMat);
      head.position.set(x, 6, z);
      this.scene.add(head);

      // Night light point
      const pLight = new THREE.PointLight(0xffdd99, 0, 25);
      pLight.position.set(x, 5.8, z);
      this.scene.add(pLight);
      this.nightLamps.push({ light: pLight, bulb: bulbMat });
    });
  }

  buildCentralFarmhouse() {
    const estateGroup = new THREE.Group();
    estateGroup.position.set(0, 0, 0);

    // Villa base platform (stone terrace)
    const baseGeo = new THREE.BoxGeometry(36, 1.2, 28);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xe5e1d8, roughness: 0.4 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.6;
    base.receiveShadow = true;
    base.castShadow = true;
    estateGroup.add(base);

    // Main 2-story luxury contemporary villa
    const mainBuildingGeo = new THREE.BoxGeometry(22, 8, 14);
    const villaMat = new THREE.MeshStandardMaterial({ color: 0xfaf9f6, roughness: 0.3 });
    const mainBuilding = new THREE.Mesh(mainBuildingGeo, villaMat);
    mainBuilding.position.set(0, 5.2, -3);
    mainBuilding.castShadow = true;
    mainBuilding.receiveShadow = true;
    estateGroup.add(mainBuilding);

    // Upper Penthouse / Terrace Suite
    const upperGeo = new THREE.BoxGeometry(16, 5, 10);
    const upper = new THREE.Mesh(upperGeo, villaMat);
    upper.position.set(2, 11.5, -3);
    upper.castShadow = true;
    upper.receiveShadow = true;
    estateGroup.add(upper);

    // Flat roof overhangs (modern architecture)
    const roofOverhangGeo = new THREE.BoxGeometry(24, 0.5, 16);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.5 });
    const roof = new THREE.Mesh(roofOverhangGeo, roofMat);
    roof.position.set(0, 9.4, -3);
    estateGroup.add(roof);

    const roofTopGeo = new THREE.BoxGeometry(18, 0.5, 12);
    const roofTop = new THREE.Mesh(roofTopGeo, roofMat);
    roofTop.position.set(2, 14.2, -3);
    estateGroup.add(roofTop);

    // Glass Panoramic Windows (luxury dark cyan/reflective tint)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x64b5f6,
      transmission: 0.6,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      metalness: 0.3
    });

    const frontGlassGeo = new THREE.BoxGeometry(18, 5.5, 0.4);
    const frontGlass = new THREE.Mesh(frontGlassGeo, glassMat);
    frontGlass.position.set(0, 4.8, 4.2);
    estateGroup.add(frontGlass);

    const upperGlassGeo = new THREE.BoxGeometry(14, 3.8, 0.4);
    const upperGlass = new THREE.Mesh(upperGlassGeo, glassMat);
    upperGlass.position.set(2, 11.2, 2.2);
    estateGroup.add(upperGlass);

    // Wooden pergola & outdoor lounge deck
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.6 });
    for (let i = -7; i <= 7; i += 2) {
      const beamGeo = new THREE.BoxGeometry(0.3, 0.4, 7);
      const beam = new THREE.Mesh(beamGeo, woodMat);
      beam.position.set(i, 6, 7.5);
      beam.castShadow = true;
      estateGroup.add(beam);
    }

    // Pergola pillars
    [-7, 7].forEach(px => {
      const pillarGeo = new THREE.CylinderGeometry(0.25, 0.25, 5, 8);
      const pillar = new THREE.Mesh(pillarGeo, woodMat);
      pillar.position.set(px, 3.5, 10.5);
      pillar.castShadow = true;
      estateGroup.add(pillar);
    });

    this.scene.add(estateGroup);
  }

  buildSwimmingPool() {
    const poolGroup = new THREE.Group();
    // Placed directly in front of the central farmhouse
    poolGroup.position.set(0, 0, 14);

    // Pool Deck (marble / travertine surround)
    const deckGeo = new THREE.BoxGeometry(26, 0.8, 16);
    const deckMat = new THREE.MeshStandardMaterial({ color: 0xded8ce, roughness: 0.4 });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.y = 0.4;
    deck.receiveShadow = true;
    poolGroup.add(deck);

    // Pool basin (recessed blue tiles)
    const poolBasinGeo = new THREE.BoxGeometry(20, 1.8, 10);
    const basinMat = new THREE.MeshStandardMaterial({ color: 0x00838f, roughness: 0.2 });
    const basin = new THREE.Mesh(poolBasinGeo, basinMat);
    basin.position.set(0, -0.2, 0);
    poolGroup.add(basin);

    // Pool Water Surface with custom animated shader / material
    const waterGeo = new THREE.PlaneGeometry(19.6, 9.6, 32, 16);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x00e5ff,
      emissive: 0x003344,
      emissiveIntensity: 0.2,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.85,
      reflectivity: 0.9
    });
    this.poolWater = new THREE.Mesh(waterGeo, waterMat);
    this.poolWater.rotation.x = -Math.PI / 2;
    this.poolWater.position.set(0, 0.65, 0);
    poolGroup.add(this.poolWater);

    // Underwater Pool Glow
    const poolGlow = new THREE.PointLight(0x00ffff, 0.8, 15);
    poolGlow.position.set(0, 0.2, 0);
    poolGroup.add(poolGlow);

    // Sun Loungers by the pool
    const loungerMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const cushionMat = new THREE.MeshStandardMaterial({ color: 0xe67e22 });
    for (let i = -7; i <= 7; i += 4.5) {
      const loungerGeo = new THREE.BoxGeometry(1.8, 0.4, 4);
      const lounger = new THREE.Mesh(loungerGeo, loungerMat);
      lounger.position.set(i, 0.9, 6.5);
      lounger.castShadow = true;
      poolGroup.add(lounger);

      const cushionGeo = new THREE.BoxGeometry(1.6, 0.15, 3.8);
      const cushion = new THREE.Mesh(cushionGeo, cushionMat);
      cushion.position.set(i, 1.15, 6.5);
      poolGroup.add(cushion);

      // Umbrella
      const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.5);
      const pole = new THREE.Mesh(poleGeo, loungerMat);
      pole.position.set(i + 1, 2.5, 7.5);
      poolGroup.add(pole);

      const coneGeo = new THREE.ConeGeometry(1.8, 0.8, 8);
      const umbrella = new THREE.Mesh(coneGeo, cushionMat);
      umbrella.position.set(i + 1, 4, 7.5);
      umbrella.castShadow = true;
      poolGroup.add(umbrella);
    }

    this.scene.add(poolGroup);
  }

  buildWaterfalls() {
    const waterfallGroup = new THREE.Group();
    // Located beside the farmhouse and swimming pool
    waterfallGroup.position.set(-20, 0, 10);

    // Natural multi-tiered rock cliff formation
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x5a554d,
      roughness: 0.95,
      metalness: 0.1
    });

    const rock1Geo = new THREE.DodecahedronGeometry(7, 1);
    const rock1 = new THREE.Mesh(rock1Geo, rockMat);
    rock1.position.set(0, 5, 0);
    rock1.scale.set(1.4, 1.8, 1.2);
    rock1.castShadow = true;
    rock1.receiveShadow = true;
    waterfallGroup.add(rock1);

    const rock2Geo = new THREE.DodecahedronGeometry(5, 1);
    const rock2 = new THREE.Mesh(rock2Geo, rockMat);
    rock2.position.set(3, 4, -4);
    rock2.scale.set(1.2, 1.5, 1.1);
    rock2.castShadow = true;
    waterfallGroup.add(rock2);

    const rock3Geo = new THREE.DodecahedronGeometry(4, 1);
    const rock3 = new THREE.Mesh(rock3Geo, rockMat);
    rock3.position.set(-4, 3, 3);
    rock3.scale.set(1.1, 1.2, 1.3);
    rock3.castShadow = true;
    waterfallGroup.add(rock3);

    // Plunge pool at the bottom
    const plungeGeo = new THREE.CylinderGeometry(5.5, 6, 1.2, 16);
    const plungeMat = new THREE.MeshStandardMaterial({ color: 0x006064, roughness: 0.1 });
    const plunge = new THREE.Mesh(plungeGeo, plungeMat);
    plunge.position.set(2, 0.5, 4);
    waterfallGroup.add(plunge);

    // Cascading Water Surface Curtains (layered translucent meshes)
    const streamGeo = new THREE.PlaneGeometry(3.8, 9, 8, 16);
    const streamMat = new THREE.MeshPhysicalMaterial({
      color: 0x80deea,
      emissive: 0x004d40,
      transmission: 0.7,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1
    });
    const streamMesh = new THREE.Mesh(streamGeo, streamMat);
    streamMesh.position.set(1.8, 5.5, 2.5);
    streamMesh.rotation.y = 0.4;
    waterfallGroup.add(streamMesh);

    // Dynamic 3D Particle Waterfall System (1,500 active falling water droplets)
    const particleCount = 1200;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Start near top of the cliff
      positions[i * 3] = (Math.random() - 0.5) * 3 + 1.5;
      positions[i * 3 + 1] = Math.random() * 9 + 1; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2 + 2;
      velocities[i] = 0.2 + Math.random() * 0.25;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.waterfallVelocities = velocities;

    const pMat = new THREE.PointsMaterial({
      color: 0xe0f7fa,
      size: 0.45,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.waterfallParticles = new THREE.Points(pGeo, pMat);
    waterfallGroup.add(this.waterfallParticles);

    // Waterfall Mist / Splash Foam at the plunge base
    const mistCount = 300;
    const mGeo = new THREE.BufferGeometry();
    const mPos = new Float32Array(mistCount * 3);
    for (let i = 0; i < mistCount; i++) {
      mPos[i * 3] = (Math.random() - 0.5) * 6 + 2;
      mPos[i * 3 + 1] = Math.random() * 2 + 0.6;
      mPos[i * 3 + 2] = (Math.random() - 0.5) * 6 + 4;
    }
    mGeo.setAttribute("position", new THREE.BufferAttribute(mPos, 3));
    const mMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    this.waterfallMist = new THREE.Points(mGeo, mMat);
    waterfallGroup.add(this.waterfallMist);

    // Tropical vegetation around the waterfall (palms, ferns)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 1.5;
      const tx = Math.cos(angle) * 7;
      const tz = Math.sin(angle) * 7;
      this.createPalmTree(waterfallGroup, tx, 0, tz, 1.2);
    }

    this.scene.add(waterfallGroup);
  }

  buildBuffaloSanctuary() {
    // 50-Acre High-Tech Buffalo Sanctuary & Dairy Estate
    const sanctuaryGroup = new THREE.Group();
    sanctuaryGroup.position.set(-75, 0, -45);

    // 1. Lush Organic Fenced Pasture Ground with rich soil variation
    const pastureGeo = new THREE.PlaneGeometry(110, 90, 32, 32);
    const pastureMat = new THREE.MeshStandardMaterial({
      color: 0x3e6826,
      roughness: 0.85,
      metalness: 0.05
    });
    const pasture = new THREE.Mesh(pastureGeo, pastureMat);
    pasture.rotation.x = -Math.PI / 2;
    pasture.position.y = 0.04;
    pasture.receiveShadow = true;
    sanctuaryGroup.add(pasture);

    // 2. Natural Buffalo Bathing Lake & Mud Wallowing Pond (Organic VFX Water Body)
    const pondShape = new THREE.Shape();
    pondShape.moveTo(-15, -10);
    pondShape.bezierCurveTo(-25, 5, -20, 20, 0, 18);
    pondShape.bezierCurveTo(18, 16, 26, 8, 22, -6);
    pondShape.bezierCurveTo(18, -18, -5, -22, -15, -10);

    const pondGeo = new THREE.ShapeGeometry(pondShape);
    const pondMat = new THREE.MeshStandardMaterial({
      color: 0x1a4850,
      roughness: 0.15,
      metalness: 0.8,
      transparent: true,
      opacity: 0.88
    });
    this.buffaloLakeWater = new THREE.Mesh(pondGeo, pondMat);
    this.buffaloLakeWater.rotation.x = -Math.PI / 2;
    this.buffaloLakeWater.position.set(-8, 0.08, -8);
    sanctuaryGroup.add(this.buffaloLakeWater);

    // Pond Stone & Pebble Perimeter
    const pondBorderMat = new THREE.MeshStandardMaterial({ color: 0x5a564c, roughness: 0.9 });
    for (let angle = 0; angle < Math.PI * 2; angle += 0.25) {
      const r = 16 + Math.sin(angle * 3) * 3;
      const rockX = -8 + Math.cos(angle) * r;
      const rockZ = -8 + Math.sin(angle) * (r * 0.75);
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.8 + Math.random() * 0.6),
        pondBorderMat
      );
      rock.position.set(rockX, 0.3, rockZ);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      sanctuaryGroup.add(rock);
    }

    // 3. Modern High-Tech Cattle Shelters with Automated Aeration Mist Fans
    const shedFrameMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.7 });
    const roofSheetMat = new THREE.MeshStandardMaterial({ color: 0x2e3b43, roughness: 0.4 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.8, roughness: 0.2 });

    for (let row = 0; row < 3; row++) {
      const shedZ = 16 + row * 16;
      
      // Shed roof with industrial ventilation ridge
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(46, 0.7, 12),
        roofSheetMat
      );
      roof.position.set(2, 6.2, shedZ);
      roof.castShadow = true;
      sanctuaryGroup.add(roof);

      // Support steel columns
      for (let px = -20; px <= 24; px += 11) {
        for (let pz = -5; pz <= 5; pz += 10) {
          const post = new THREE.Mesh(
            new THREE.CylinderGeometry(0.22, 0.22, 6, 8),
            shedFrameMat
          );
          post.position.set(px, 3, shedZ + pz);
          post.castShadow = true;
          sanctuaryGroup.add(post);
        }
      }

      // Automated Cooling Mist Duct & Mist Nozzles along shed ceiling
      const mistPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 44),
        steelMat
      );
      mistPipe.rotation.z = Math.PI / 2;
      mistPipe.position.set(2, 5.8, shedZ);
      sanctuaryGroup.add(mistPipe);

      // Water Trough with fresh clean drinking water
      const trough = new THREE.Mesh(
        new THREE.BoxGeometry(38, 1, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x00695c, roughness: 0.3 })
      );
      trough.position.set(2, 0.5, shedZ);
      sanctuaryGroup.add(trough);
    }

    // 4. Procedural Cooling Mist VFX Particles emitting over the shelters
    const mistCount = 200;
    const mistGeo = new THREE.BufferGeometry();
    const mistPositions = new Float32Array(mistCount * 3);
    for (let i = 0; i < mistCount; i++) {
      mistPositions[i * 3] = (Math.random() - 0.5) * 44;
      mistPositions[i * 3 + 1] = 2.0 + Math.random() * 3.5;
      mistPositions[i * 3 + 2] = 10 + Math.random() * 35;
    }
    mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPositions, 3));
    const mistMat = new THREE.PointsMaterial({
      color: 0xe0f7fa,
      size: 1.2,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.buffaloMistParticles = new THREE.Points(mistGeo, mistMat);
    sanctuaryGroup.add(this.buffaloMistParticles);

    // 5. Ambient Atmospheric Fireflies & Pollen Motes in the Pasture
    const fireflyCount = 120;
    const fireflyGeo = new THREE.BufferGeometry();
    const fireflyPositions = new Float32Array(fireflyCount * 3);
    for (let i = 0; i < fireflyCount; i++) {
      fireflyPositions[i * 3] = (Math.random() - 0.5) * 95;
      fireflyPositions[i * 3 + 1] = 0.5 + Math.random() * 4.5;
      fireflyPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    fireflyGeo.setAttribute("position", new THREE.BufferAttribute(fireflyPositions, 3));
    const fireflyMat = new THREE.PointsMaterial({
      color: 0xffd54f,
      size: 0.9,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    this.buffaloFireflies = new THREE.Points(fireflyGeo, fireflyMat);
    sanctuaryGroup.add(this.buffaloFireflies);

    // 6. High-Fidelity 3D Anatomical Indian Murrah & Jafrabadi Buffalos
    const buffaloColor = 0x141414; // Glossy deep charcoal black hide
    const hornColor = 0x4a4a4a;
    const snoutColor = 0x232020;

    // Create 32 buffalos (some in lake cooling off, some in pasture, some in aerated sheds)
    for (let i = 0; i < 32; i++) {
      const buffalo = new THREE.Group();
      
      let bx, bz, inLake = false;
      if (i < 5) {
        // Buffalos wallowing in cooling lake!
        bx = -12 + (Math.random() - 0.5) * 14;
        bz = -8 + (Math.random() - 0.5) * 12;
        inLake = true;
      } else if (i < 15) {
        // Under the aerated mist sheds
        bx = -15 + Math.random() * 32;
        bz = 16 + (i % 3) * 15 + (Math.random() - 0.5) * 4;
      } else {
        // Open lush green pasture
        bx = (Math.random() - 0.5) * 88;
        bz = (Math.random() - 0.5) * 72;
      }

      buffalo.position.set(bx, inLake ? -0.4 : 0, bz);
      buffalo.rotation.y = Math.random() * Math.PI * 2;
      const scale = 0.9 + Math.random() * 0.3;
      buffalo.scale.set(scale, scale, scale);

      // Hide material with specular sheen (characteristic of healthy well-cared Murrah buffalo)
      const bMat = new THREE.MeshStandardMaterial({
        color: buffaloColor,
        roughness: 0.38,
        metalness: 0.15
      });

      // Muscular Torso (Barrel Ribcage)
      const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(1.05, 0.95, 3.8, 12),
        bMat
      );
      torso.rotation.z = Math.PI / 2;
      torso.position.set(0, 2.2, 0);
      torso.castShadow = true;
      buffalo.add(torso);

      // Prominent Shoulder Hump (Wither)
      const hump = new THREE.Mesh(
        new THREE.SphereGeometry(0.85, 8, 8),
        bMat
      );
      hump.scale.set(1.1, 0.75, 0.9);
      hump.position.set(0.8, 3.0, 0);
      hump.castShadow = true;
      buffalo.add(hump);

      // Hindquarters / Flank
      const flank = new THREE.Mesh(
        new THREE.SphereGeometry(0.92, 8, 8),
        bMat
      );
      flank.position.set(-1.4, 2.2, 0);
      flank.castShadow = true;
      buffalo.add(flank);

      // Head & Neck Group (Bobbing / Grazing Animation Rig)
      const headGroup = new THREE.Group();
      headGroup.position.set(2.1, 2.5, 0);

      // Thick Muscular Neck
      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.85, 1.4, 8),
        bMat
      );
      neck.rotation.z = -0.55;
      neck.position.set(-0.35, 0.15, 0);
      headGroup.add(neck);

      // Head Skull
      const skull = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 1.15, 1.05),
        bMat
      );
      skull.position.set(0.6, 0.1, 0);
      skull.castShadow = true;
      headGroup.add(skull);

      // Snout & Wide Wet Muzzle
      const muzzle = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.7, 0.85),
        new THREE.MeshStandardMaterial({ color: snoutColor, roughness: 0.5 })
      );
      muzzle.position.set(1.45, -0.15, 0);
      headGroup.add(muzzle);

      // Nostrils
      [-0.2, 0.2].forEach(nz => {
        const nostril = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0x050505 })
        );
        nostril.position.set(1.9, -0.15, nz);
        headGroup.add(nostril);
      });

      // Eyes
      [-0.45, 0.45].forEach(ez => {
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 6, 6),
          new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 })
        );
        eye.position.set(0.9, 0.4, ez);
        headGroup.add(eye);
      });

      // Ears (Perked & twitching)
      const earGeo = new THREE.BoxGeometry(0.55, 0.2, 0.15);
      [-0.6, 0.6].forEach(ez => {
        const ear = new THREE.Mesh(earGeo, bMat);
        ear.position.set(0.3, 0.45, ez);
        ear.rotation.y = ez > 0 ? 0.35 : -0.35;
        ear.rotation.z = -0.2;
        headGroup.add(ear);
      });

      // Iconic Curled Murrah / Jafrabadi Buffalo Horns
      const hornMat = new THREE.MeshStandardMaterial({ color: hornColor, roughness: 0.45, metalness: 0.2 });
      [-0.65, 0.65].forEach(hz => {
        const horn = new THREE.Mesh(
          new THREE.TorusGeometry(0.65, 0.14, 8, 16, Math.PI * 0.95),
          hornMat
        );
        horn.position.set(0.4, 0.65, hz);
        horn.rotation.x = hz > 0 ? 0.45 : -0.45;
        horn.rotation.y = Math.PI / 2;
        headGroup.add(horn);
      });

      buffalo.add(headGroup);

      // 4 Powerful Stepping Legs
      const legGeo = new THREE.CylinderGeometry(0.24, 0.2, 2.0, 8);
      const legMeshes = [];
      [
        [-1.3, -0.65, 1], [-1.3, 0.65, 2],
        [1.2, -0.65, 3], [1.2, 0.65, 4]
      ].forEach(([lx, lz, id]) => {
        const leg = new THREE.Mesh(legGeo, bMat);
        leg.position.set(lx, 1.0, lz);
        leg.castShadow = true;
        buffalo.add(leg);
        legMeshes.push({ mesh: leg, id: id, baseZ: lz, baseX: lx });
      });

      // Swishing Tail with Tuft
      const tail = new THREE.Group();
      tail.position.set(-1.8, 2.3, 0);
      const tailShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.09, 1.7, 6),
        bMat
      );
      tailShaft.position.set(0, -0.85, 0);
      tail.add(tailShaft);
      const tailTuft = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.5, 6),
        new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 })
      );
      tailTuft.position.set(0, -1.8, 0);
      tail.add(tailTuft);
      tail.rotation.z = 0.35;
      buffalo.add(tail);

      sanctuaryGroup.add(buffalo);

      // Store animation references
      this.buffalos.push({
        group: buffalo,
        headGroup: headGroup,
        tail: tail,
        legs: legMeshes,
        inLake: inLake,
        grazingPhase: Math.random() * Math.PI * 2,
        tailPhase: Math.random() * Math.PI * 2,
        speed: 0.7 + Math.random() * 0.9
      });
    }

    // Wooden Paddock Fence along sanctuary perimeter
    this.createFence(sanctuaryGroup, -50, 50, -40, 40);

    this.scene.add(sanctuaryGroup);
  }

  buildPoultryFarm() {
    // 10 Acres Free-Range Poultry Farm & Avian Sheds (North-East sector)
    const poultryGroup = new THREE.Group();
    poultryGroup.position.set(70, 0, -45);

    // Pasture
    const groundGeo = new THREE.PlaneGeometry(55, 60);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x558b2f, roughness: 0.85 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.04;
    poultryGroup.add(ground);

    // 2 Long bio-secure modern poultry sheds
    const shedMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.5 }); // Red roof

    [-12, 12].forEach(sz => {
      const shedGeo = new THREE.BoxGeometry(38, 4.5, 12);
      const shed = new THREE.Mesh(shedGeo, shedMat);
      shed.position.set(0, 2.25, sz);
      shed.castShadow = true;
      poultryGroup.add(shed);

      // Peaked roof
      const roofGeo = new THREE.BoxGeometry(40, 1.5, 14);
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(0, 5, sz);
      roof.castShadow = true;
      poultryGroup.add(roof);

      // Ventilation fans
      const fanGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 12);
      const fanMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
      for (let fx = -14; fx <= 14; fx += 7) {
        const fan = new THREE.Mesh(fanGeo, fanMat);
        fan.position.set(fx, 3.2, sz + 6.1);
        fan.rotation.x = Math.PI / 2;
        poultryGroup.add(fan);
      }
    });

    // Scattered free-range chickens / hens (stylized white and brown points)
    const henGeo = new THREE.SphereGeometry(0.35, 6, 6);
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const brownMat = new THREE.MeshStandardMaterial({ color: 0xd84315 });

    for (let i = 0; i < 40; i++) {
      const hen = new THREE.Mesh(henGeo, Math.random() > 0.4 ? whiteMat : brownMat);
      hen.position.set(
        (Math.random() - 0.5) * 45,
        0.35,
        (Math.random() - 0.5) * 50
      );
      hen.scale.set(1, 1.2, 1.4);
      poultryGroup.add(hen);
    }

    this.scene.add(poultryGroup);
  }

  buildFlowerFields() {
    // 25+ Acres Cultivating Different Types of Flowers (South & South-East sectors)
    const flowerGroup = new THREE.Group();
    flowerGroup.position.set(45, 0, 55);

    // Flower bed strips of distinct colors (Marigold yellow, Lavender purple, Crimson Rose, Sunflower gold)
    const palettes = [
      { color: 0xffb300, name: "Marigold Gold" },
      { color: 0x8e24aa, name: "Lavender Velvet" },
      { color: 0xe53935, name: "Crimson Rose" },
      { color: 0xfdd835, name: "Sunburst Yellow" },
      { color: 0xd81b60, name: "Pink Orchid" }
    ];

    const stripWidth = 14;
    palettes.forEach((palette, idx) => {
      const zOffset = (idx - 2) * 16;
      
      // Bed earth
      const bedGeo = new THREE.BoxGeometry(65, 0.3, stripWidth);
      const bedMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });
      const bed = new THREE.Mesh(bedGeo, bedMat);
      bed.position.set(0, 0.15, zOffset);
      flowerGroup.add(bed);

      // Instanced flower blossoms
      const flowerCount = 180;
      const blossomGeo = new THREE.DodecahedronGeometry(0.45, 0);
      const blossomMat = new THREE.MeshStandardMaterial({
        color: palette.color,
        roughness: 0.3,
        emissive: palette.color,
        emissiveIntensity: 0.15
      });

      const instancedFlowers = new THREE.InstancedMesh(blossomGeo, blossomMat, flowerCount);
      const dummy = new THREE.Object3D();

      for (let i = 0; i < flowerCount; i++) {
        const fx = (Math.random() - 0.5) * 62;
        const fz = zOffset + (Math.random() - 0.5) * (stripWidth - 2);
        const fy = 0.5 + Math.random() * 0.6;

        dummy.position.set(fx, fy, fz);
        const s = 0.8 + Math.random() * 0.6;
        dummy.scale.set(s, s, s);
        dummy.rotation.set(Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3);
        dummy.updateMatrix();

        instancedFlowers.setMatrixAt(i, dummy.matrix);
      }

      instancedFlowers.instanceMatrix.needsUpdate = true;
      instancedFlowers.castShadow = true;
      flowerGroup.add(instancedFlowers);
    });

    // Gazebo in the flower fields for visitors and photoshoots
    const gazeboMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const gazeboRoofMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.4 });

    const gazeboBaseGeo = new THREE.CylinderGeometry(4, 4.2, 0.6, 8);
    const gazeboBase = new THREE.Mesh(gazeboBaseGeo, gazeboMat);
    gazeboBase.position.set(25, 0.3, 0);
    flowerGroup.add(gazeboBase);

    const gazeboRoofGeo = new THREE.ConeGeometry(5, 3, 8);
    const gazeboRoof = new THREE.Mesh(gazeboRoofGeo, gazeboRoofMat);
    gazeboRoof.position.set(25, 5, 0);
    gazeboRoof.castShadow = true;
    flowerGroup.add(gazeboRoof);

    this.scene.add(flowerGroup);
  }

  buildGrassFodderPasture() {
    // 10 Acres Grass Fodder Cultivation for the 500 Buffalos (South-West sector)
    const grassGroup = new THREE.Group();
    grassGroup.position.set(-65, 0, 50);

    const pastureGeo = new THREE.PlaneGeometry(65, 65);
    const pastureMat = new THREE.MeshStandardMaterial({
      color: 0x2e7d32, // Lush vibrant emerald green
      roughness: 0.8
    });
    const pasture = new THREE.Mesh(pastureGeo, pastureMat);
    pasture.rotation.x = -Math.PI / 2;
    pasture.position.y = 0.04;
    pasture.receiveShadow = true;
    grassGroup.add(pasture);

    // Micro-sprinkler irrigation line
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x455a64 });
    const pipeGeo = new THREE.CylinderGeometry(0.12, 0.12, 55);
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.x = Math.PI / 2;
    pipe.position.set(0, 0.4, 0);
    grassGroup.add(pipe);

    // Sprinkler nozzles
    for (let sz = -20; sz <= 20; sz += 10) {
      const nozzleGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
      const nozzle = new THREE.Mesh(nozzleGeo, pipeMat);
      nozzle.position.set(0, 0.8, sz);
      grassGroup.add(nozzle);
    }

    this.scene.add(grassGroup);
  }

  buildSecurityEntrance() {
    // 24/7 Security Gatehouse at the Southern perimeter of the 100-acre estate
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, 115);

    // Guardhouse cabin
    const cabinGeo = new THREE.BoxGeometry(6, 4, 5);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(8, 2, 0);
    cabin.castShadow = true;
    gateGroup.add(cabin);

    // Boom barrier / security gate
    const gatePostGeo = new THREE.BoxGeometry(0.8, 3, 0.8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0xf57f17 });
    const post = new THREE.Mesh(gatePostGeo, postMat);
    post.position.set(3, 1.5, 0);
    gateGroup.add(post);

    const barrierGeo = new THREE.BoxGeometry(7, 0.3, 0.2);
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f });
    const barrier = new THREE.Mesh(barrierGeo, barrierMat);
    barrier.position.set(-0.5, 1.8, 0);
    gateGroup.add(barrier);

    // Entrance Signboard: "HITEC 100 ACRES AGRI-ESTATE"
    const signGeo = new THREE.BoxGeometry(14, 2.5, 0.4);
    const signMat = new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.3 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 6, 0);
    gateGroup.add(sign);

    this.scene.add(gateGroup);
  }

  buildPerimeterFenceAndTrees() {
    // Perimeter boundary wall and lush Indian Teak, Neem, and Royal Palm trees
    const treeGroup = new THREE.Group();

    // Border trees around the 100-acre perimeter
    const perimeterPositions = [];
    const size = 120;
    for (let p = -size; p <= size; p += 16) {
      perimeterPositions.push([p, -size]);
      perimeterPositions.push([p, size]);
      perimeterPositions.push([-size, p]);
      perimeterPositions.push([size, p]);
    }

    perimeterPositions.forEach(([tx, tz]) => {
      // Don't place tree in entrance road
      if (Math.abs(tx) < 10 && tz > 100) return;
      this.createTree(treeGroup, tx + (Math.random() - 0.5) * 4, 0, tz + (Math.random() - 0.5) * 4);
    });

    // Landscaping trees around the central farmhouse
    const gardenTreePos = [
      [-14, -18], [14, -18], [-22, 0], [22, 0],
      [-16, 22], [16, 22], [28, 12], [-28, 12]
    ];
    gardenTreePos.forEach(([gx, gz]) => {
      this.createTree(treeGroup, gx, 0, gz, 1.1);
    });

    this.scene.add(treeGroup);
  }

  createTree(parent, x, y, z, scale = 1.0) {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.6 });

    const trunkGeo = new THREE.CylinderGeometry(0.35 * scale, 0.5 * scale, 4 * scale, 8);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, 2 * scale, z);
    trunk.castShadow = true;
    parent.add(trunk);

    const foliageGeo = new THREE.DodecahedronGeometry(2.5 * scale, 1);
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.set(x, 5 * scale, z);
    foliage.castShadow = true;
    parent.add(foliage);
  }

  createPalmTree(parent, x, y, z, scale = 1.0) {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x43a047, roughness: 0.4 });

    const trunkGeo = new THREE.CylinderGeometry(0.2 * scale, 0.4 * scale, 7 * scale, 8);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, 3.5 * scale, z);
    trunk.rotation.z = (Math.random() - 0.5) * 0.15;
    trunk.castShadow = true;
    parent.add(trunk);

    // Palm fronds
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const frondGeo = new THREE.ConeGeometry(0.7 * scale, 3.5 * scale, 4);
      const frond = new THREE.Mesh(frondGeo, leafMat);
      frond.position.set(x + Math.cos(angle) * 1.5 * scale, 7 * scale, z + Math.sin(angle) * 1.5 * scale);
      frond.rotation.x = Math.sin(angle) * 0.9;
      frond.rotation.z = -Math.cos(angle) * 0.9;
      parent.add(frond);
    }
  }

  createFence(parent, x1, x2, z1, z2) {
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.8 });
    const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 2);

    for (let x = x1; x <= x2; x += 5) {
      const p1 = new THREE.Mesh(postGeo, fenceMat);
      p1.position.set(x, 1, z1);
      parent.add(p1);

      const p2 = new THREE.Mesh(postGeo, fenceMat);
      p2.position.set(x, 1, z2);
      parent.add(p2);
    }

    for (let z = z1; z <= z2; z += 5) {
      const p3 = new THREE.Mesh(postGeo, fenceMat);
      p3.position.set(x1, 1, z);
      parent.add(p3);

      const p4 = new THREE.Mesh(postGeo, fenceMat);
      p4.position.set(x2, 1, z);
      parent.add(p4);
    }
  }

  // Camera View Transitions
  setCameraMode(mode) {
    this.currentMode = mode;
    switch (mode) {
      case "waterfall-pool":
        this.targetCameraPos.set(-18, 12, 34);
        this.targetLookAt.set(-10, 4, 12);
        break;
      case "buffalos":
        this.targetCameraPos.set(-75, 18, -12);
        this.targetLookAt.set(-75, 4, -45);
        break;
      case "farmhouse":
        this.targetCameraPos.set(0, 18, 42);
        this.targetLookAt.set(0, 6, 0);
        break;
      case "flowers":
        this.targetCameraPos.set(45, 16, 25);
        this.targetLookAt.set(45, 3, 55);
        break;
      case "overview":
      default:
        this.targetCameraPos.set(130, 105, 140);
        this.targetLookAt.set(0, 4, 0);
        break;
    }
  }

  // Day / Sunset / Night Atmosphere
  setTimeOfDay(time) {
    this.timeOfDay = time;
    if (time === "night") {
      this.scene.background = new THREE.Color(0x0a1128);
      this.scene.fog.color = new THREE.Color(0x0a1128);
      this.directionalLight.color = new THREE.Color(0x4a69bd);
      this.directionalLight.intensity = 0.3;
      this.ambientLight.intensity = 0.25;
      this.nightLamps.forEach(lamp => {
        lamp.light.intensity = 1.8;
      });
    } else if (time === "sunset") {
      this.scene.background = new THREE.Color(0xff7043);
      this.scene.fog.color = new THREE.Color(0xffab91);
      this.directionalLight.color = new THREE.Color(0xffa726);
      this.directionalLight.intensity = 1.4;
      this.directionalLight.position.set(160, 40, 40);
      this.ambientLight.intensity = 0.6;
      this.nightLamps.forEach(lamp => {
        lamp.light.intensity = 0.8;
      });
    } else {
      // Day
      this.scene.background = new THREE.Color(0xd9edf7);
      this.scene.fog.color = new THREE.Color(0xd9edf7);
      this.directionalLight.color = new THREE.Color(0xfff5e6);
      this.directionalLight.intensity = 1.2;
      this.directionalLight.position.set(90, 140, 60);
      this.ambientLight.intensity = 0.7;
      this.nightLamps.forEach(lamp => {
        lamp.light.intensity = 0;
      });
    }
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Smooth Camera Interpolation towards target
    if (this.controls) {
      this.camera.position.lerp(this.targetCameraPos, 0.04);
      this.controls.target.lerp(this.targetLookAt, 0.04);
      this.controls.update();
    }

    // 2. Animate Waterfall Particles (Gravity + Splash)
    if (this.waterfallParticles) {
      const positions = this.waterfallParticles.geometry.attributes.position.array;
      const count = positions.length / 3;
      for (let i = 0; i < count; i++) {
        // Fall down y
        positions[i * 3 + 1] -= this.waterfallVelocities[i];
        
        // Slight outward spread as it falls
        positions[i * 3 + 2] += 0.015;

        // Reset to top when it reaches plunge pool
        if (positions[i * 3 + 1] <= 0.6) {
          positions[i * 3] = (Math.random() - 0.5) * 3 + 1.5;
          positions[i * 3 + 1] = 9 + Math.random() * 0.8;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5 + 1.8;
        }
      }
      this.waterfallParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Animate Waterfall Mist Puff
    if (this.waterfallMist) {
      const mPos = this.waterfallMist.geometry.attributes.position.array;
      for (let i = 0; i < mPos.length / 3; i++) {
        mPos[i * 3 + 1] += 0.015; // float upward
        if (mPos[i * 3 + 1] > 3.0) {
          mPos[i * 3 + 1] = 0.6;
        }
      }
      this.waterfallMist.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Animate Swimming Pool Ripples
    if (this.poolWater) {
      this.poolWater.material.opacity = 0.82 + Math.sin(elapsedTime * 2.5) * 0.06;
      this.poolWater.rotation.z = Math.sin(elapsedTime * 0.5) * 0.005;
    }

    // 5. Animate Buffalo Bathing Lake Ripples & Depth Shimmer
    if (this.buffaloLakeWater) {
      this.buffaloLakeWater.material.opacity = 0.85 + Math.sin(elapsedTime * 2.0) * 0.08;
      this.buffaloLakeWater.rotation.z = Math.sin(elapsedTime * 0.4) * 0.006;
    }

    // 6. Animate Buffalo Sanctuary Shed Mist Particles
    if (this.buffaloMistParticles) {
      const mistArr = this.buffaloMistParticles.geometry.attributes.position.array;
      for (let i = 0; i < mistArr.length / 3; i++) {
        mistArr[i * 3 + 1] += 0.012; // slow gentle rise
        mistArr[i * 3] += Math.sin(elapsedTime + i) * 0.008; // horizontal wafting
        if (mistArr[i * 3 + 1] > 5.5) {
          mistArr[i * 3 + 1] = 2.0;
        }
      }
      this.buffaloMistParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 7. Animate Buffalo Pasture Fireflies / Atmospheric Spores
    if (this.buffaloFireflies) {
      const flyArr = this.buffaloFireflies.geometry.attributes.position.array;
      for (let i = 0; i < flyArr.length / 3; i++) {
        flyArr[i * 3 + 1] += Math.sin(elapsedTime * 1.5 + i) * 0.01;
        flyArr[i * 3] += Math.cos(elapsedTime * 0.8 + i) * 0.008;
      }
      this.buffaloFireflies.geometry.attributes.position.needsUpdate = true;
    }

    // 8. Animate 3D Anatomical Buffalos (Grazing, Head turns, Tail swishing, Leg shifts)
    this.buffalos.forEach(buffalo => {
      buffalo.grazingPhase += delta * buffalo.speed;
      buffalo.tailPhase += delta * (buffalo.speed * 1.8);

      // Head grazing bobbing & natural looking around
      const headAngle = Math.sin(buffalo.grazingPhase) * 0.18;
      buffalo.headGroup.rotation.x = headAngle + 0.12;
      buffalo.headGroup.rotation.y = Math.cos(buffalo.grazingPhase * 0.6) * 0.12;

      // Tail swishing physics (swishing left/right)
      if (buffalo.tail) {
        buffalo.tail.rotation.z = 0.35 + Math.sin(buffalo.tailPhase) * 0.22;
        buffalo.tail.rotation.y = Math.cos(buffalo.tailPhase) * 0.28;
      }

      // Leg stepping / weight shifting
      if (buffalo.legs && !buffalo.inLake) {
        buffalo.legs.forEach(legObj => {
          const shift = Math.sin(buffalo.grazingPhase + legObj.id * 1.5) * 0.04;
          legObj.mesh.position.y = 1.0 + Math.max(0, shift);
        });
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

window.Estate3DExperience = Estate3DExperience;
