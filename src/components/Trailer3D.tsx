'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Trailer3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const showFallback = () => {
      requestAnimationFrame(() => {
        setUseFallback(true);
        setIsLoaded(true);
      });
    };

    // --- Scene, Camera, Renderer Setup ---
    const scene = new THREE.Scene();
    
    let currentWidth = container.clientWidth || 550;
    let currentHeight = container.clientHeight || 420;

    const canRenderWebGL = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        return Boolean(
          window.WebGLRenderingContext &&
            (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    })();

    if (!canRenderWebGL) {
      showFallback();
      return;
    }

    // Antialias and alpha for seamless blend into storefront background
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      showFallback();
      return;
    }

    renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2));
    renderer.setSize(currentWidth, currentHeight);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const isMobileView = () => window.matchMedia('(max-width: 1023px)').matches;
    const camera = new THREE.PerspectiveCamera(
      isMobileView() ? 30 : 34,
      currentWidth / currentHeight,
      0.1,
      100
    );
    const applyCameraPose = () => {
      if (isMobileView()) {
        camera.fov = 32;
        camera.position.set(0.55, 2.15, 10.8);
        camera.lookAt(0.35, 1.25, 0);
      } else {
        camera.fov = 34;
        camera.position.set(-0.35, 2.25, 11.2);
        camera.lookAt(-0.55, 1.35, 0);
      }
      camera.updateProjectionMatrix();
    };
    applyCameraPose();

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.45);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
    mainLight.position.set(5, 12, 9);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.bias = -0.0005;
    scene.add(mainLight);

    const blueRimLight = new THREE.DirectionalLight(0x12a4f9, 3.2);
    blueRimLight.position.set(-7, 6, -6);
    scene.add(blueRimLight);

    const frontFillLight = new THREE.DirectionalLight(0xffffff, 2.6);
    frontFillLight.position.set(2, 5, 10);
    scene.add(frontFillLight);

    const lowAccentLight = new THREE.PointLight(0x12a4f9, 1.2, 12);
    lowAccentLight.position.set(2.2, 1.2, 3.2);
    scene.add(lowAccentLight);

    // --- Master Group ---
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0.05, -0.44, 0);
    rootGroup.rotation.y = isMobileView() ? -Math.PI / 2 - 0.08 : Math.PI + 0.34;
    rootGroup.scale.setScalar(isMobileView() ? 0.72 : 0.86);
    scene.add(rootGroup);

    // Ground Contact Shadow (Soft plane shadow)
    const shadowGeo = new THREE.PlaneGeometry(16, 8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(2, 27, 121, 0.45)');
      grad.addColorStop(0.5, 'rgba(2, 27, 121, 0.2)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.02;
    rootGroup.add(shadowMesh);

    // --- Materials Palette ---
    const navyCabMat = new THREE.MeshStandardMaterial({
      color: 0x021b79,
      roughness: 0.22,
      metalness: 0.78,
    });

    const lightBlueMat = new THREE.MeshStandardMaterial({
      color: 0x12a4f9,
      roughness: 0.24,
      metalness: 0.48,
    });

    const trailerBodyMat = new THREE.MeshStandardMaterial({
      color: 0xf7fbff,
      roughness: 0.42,
      metalness: 0.12,
    });

    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.6,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.9,
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f2b48,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8,
    });

    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.9,
      metalness: 0.05,
    });

    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xd6f1ff,
      emissiveIntensity: 2.0,
      roughness: 0.1,
    });

    const taillightMat = new THREE.MeshStandardMaterial({
      color: 0xff1122,
      emissive: 0xff0022,
      emissiveIntensity: 1.2,
      roughness: 0.2,
    });

    const edgeMat = new THREE.LineBasicMaterial({ color: 0x9bdafc, transparent: true, opacity: 0.42 });
    const darkEdgeMat = new THREE.LineBasicMaterial({ color: 0x010d3f, transparent: true, opacity: 0.36 });

    const addEdges = (mesh: THREE.Mesh, material = edgeMat) => {
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), material);
      mesh.add(edges);
      return edges;
    };

    // Helper: Wheel Assembly Generator
    const createWheel = () => {
      const wheelGroup = new THREE.Group();
      // Tire
      const tireGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.32, 24);
      const tire = new THREE.Mesh(tireGeo, rubberMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Rim
      const rimGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.34, 16);
      const rim = new THREE.Mesh(rimGeo, chromeMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      // Hub cap (Navy / Blue)
      const hubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.36, 12);
      const hub = new THREE.Mesh(hubGeo, lightBlueMat);
      hub.rotation.z = Math.PI / 2;
      wheelGroup.add(hub);

      for (let i = 0; i < 6; i++) {
        const spokeGeo = new THREE.BoxGeometry(0.04, 0.03, 0.26);
        const spoke = new THREE.Mesh(spokeGeo, chromeMat);
        spoke.rotation.x = (Math.PI / 6) * i;
        wheelGroup.add(spoke);
      }

      return wheelGroup;
    };

    // Helper: Dual Wheel Assembly Generator (For Trailer & rear truck axle)
    const createDualWheel = (isLeft: boolean) => {
      const dualGroup = new THREE.Group();
      const offset = isLeft ? 0.18 : -0.18;
      
      const w1 = createWheel();
      w1.position.x = 0;
      dualGroup.add(w1);

      const w2 = createWheel();
      w2.position.x = offset;
      dualGroup.add(w2);

      return dualGroup;
    };

    // ==========================================
    // 1. CAVALO MECÂNICO (TRUCK CAB)
    // ==========================================
    const truckGroup = new THREE.Group();
    truckGroup.position.set(3.4, 0, 0);
    rootGroup.add(truckGroup);

    // Truck Chassis
    const truckChassisGeo = new THREE.BoxGeometry(3.6, 0.28, 1.3);
    const truckChassis = new THREE.Mesh(truckChassisGeo, darkChassisMat);
    truckChassis.position.set(0, 0.55, 0);
    truckChassis.castShadow = true;
    truckGroup.add(truckChassis);

    // Fuel Tanks (Cylinders on sides)
    const fuelTankGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.4, 16);
    const tankL = new THREE.Mesh(fuelTankGeo, chromeMat);
    tankL.rotation.x = Math.PI / 2;
    tankL.position.set(-0.2, 0.48, 0.75);
    tankL.castShadow = true;
    truckGroup.add(tankL);

    const tankR = new THREE.Mesh(fuelTankGeo, chromeMat);
    tankR.rotation.x = Math.PI / 2;
    tankR.position.set(-0.2, 0.48, -0.75);
    tankR.castShadow = true;
    truckGroup.add(tankR);

    // Main Cabin Base
    const cabBaseGeo = new THREE.BoxGeometry(2.1, 1.7, 1.9);
    const cabBase = new THREE.Mesh(cabBaseGeo, navyCabMat);
    cabBase.position.set(0.65, 1.6, 0);
    cabBase.castShadow = true;
    cabBase.receiveShadow = true;
    addEdges(cabBase, darkEdgeMat);
    truckGroup.add(cabBase);

    // Aerodynamic Cab Roof Deflector
    const roofDeflectorGeo = new THREE.BoxGeometry(1.6, 0.65, 1.86);
    const roofDeflector = new THREE.Mesh(roofDeflectorGeo, lightBlueMat);
    roofDeflector.position.set(0.45, 2.75, 0);
    roofDeflector.rotation.z = -0.15;
    roofDeflector.castShadow = true;
    addEdges(roofDeflector);
    truckGroup.add(roofDeflector);

    // Windshield (Front glass)
    const windshieldGeo = new THREE.BoxGeometry(0.1, 0.75, 1.76);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(1.71, 1.9, 0);
    windshield.rotation.z = -0.18;
    truckGroup.add(windshield);

    // Side Windows
    const sideWinGeo = new THREE.BoxGeometry(0.9, 0.6, 0.05);
    const sideWinL = new THREE.Mesh(sideWinGeo, glassMat);
    sideWinL.position.set(0.9, 1.9, 0.96);
    truckGroup.add(sideWinL);

    const sideWinR = new THREE.Mesh(sideWinGeo, glassMat);
    sideWinR.position.set(0.9, 1.9, -0.96);
    truckGroup.add(sideWinR);

    // Front Grille
    const grilleGeo = new THREE.BoxGeometry(0.12, 0.85, 1.4);
    const grille = new THREE.Mesh(grilleGeo, darkChassisMat);
    grille.position.set(1.72, 1.05, 0);
    addEdges(grille, darkEdgeMat);
    truckGroup.add(grille);

    // Chrome Grille Accents / Slats
    for (let i = 0; i < 4; i++) {
      const slatGeo = new THREE.BoxGeometry(0.04, 0.06, 1.3);
      const slat = new THREE.Mesh(slatGeo, chromeMat);
      slat.position.set(1.78, 0.8 + i * 0.18, 0);
      truckGroup.add(slat);
    }

    // Bumper & Front Headlights
    const bumperGeo = new THREE.BoxGeometry(0.4, 0.42, 2.05);
    const bumper = new THREE.Mesh(bumperGeo, lightBlueMat);
    bumper.position.set(1.65, 0.55, 0);
    bumper.castShadow = true;
    addEdges(bumper);
    truckGroup.add(bumper);

    const lightGeo = new THREE.BoxGeometry(0.08, 0.18, 0.35);
    const headL = new THREE.Mesh(lightGeo, headlightMat);
    headL.position.set(1.86, 0.55, 0.7);
    truckGroup.add(headL);

    const headR = new THREE.Mesh(lightGeo, headlightMat);
    headR.position.set(1.86, 0.55, -0.7);
    truckGroup.add(headR);

    // Rearview Mirrors
    const mirrorStemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4);
    const mirrorBoxGeo = new THREE.BoxGeometry(0.12, 0.42, 0.15);

    const mirrorL = new THREE.Group();
    const stemL = new THREE.Mesh(mirrorStemGeo, darkChassisMat);
    stemL.rotation.z = Math.PI / 3;
    mirrorL.add(stemL);
    const boxL = new THREE.Mesh(mirrorBoxGeo, navyCabMat);
    boxL.position.set(0.15, 0.15, 0);
    mirrorL.add(boxL);
    mirrorL.position.set(1.4, 1.8, 1.08);
    truckGroup.add(mirrorL);

    const mirrorR = new THREE.Group();
    const stemR = new THREE.Mesh(mirrorStemGeo, darkChassisMat);
    stemR.rotation.z = Math.PI / 3;
    mirrorR.add(stemR);
    const boxR = new THREE.Mesh(mirrorBoxGeo, navyCabMat);
    boxR.position.set(0.15, 0.15, 0);
    mirrorR.add(boxR);
    mirrorR.position.set(1.4, 1.8, -1.08);
    truckGroup.add(mirrorR);

    // 5th Wheel (Coupler Hitch)
    const hitchGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
    const hitch = new THREE.Mesh(hitchGeo, darkChassisMat);
    hitch.position.set(-0.85, 0.74, 0);
    truckGroup.add(hitch);

    const frontLogoGeo = new THREE.BoxGeometry(0.04, 0.16, 0.46);
    const frontLogo = new THREE.Mesh(frontLogoGeo, chromeMat);
    frontLogo.position.set(1.91, 1.22, 0);
    truckGroup.add(frontLogo);

    const visorGeo = new THREE.BoxGeometry(0.08, 0.08, 1.72);
    const visor = new THREE.Mesh(visorGeo, lightBlueMat);
    visor.position.set(1.82, 2.32, 0);
    visor.rotation.z = -0.18;
    truckGroup.add(visor);

    // Truck Wheels (Front Axle & 2 Rear Tandem Axles)
    // Front Axle
    const wFrontL = createWheel();
    wFrontL.position.set(1.1, 0.48, 0.9);
    truckGroup.add(wFrontL);

    const wFrontR = createWheel();
    wFrontR.position.set(1.1, 0.48, -0.9);
    truckGroup.add(wFrontR);

    // Rear Tandem Axle 1
    const wRear1L = createDualWheel(true);
    wRear1L.position.set(-0.45, 0.48, 0.85);
    truckGroup.add(wRear1L);

    const wRear1R = createDualWheel(false);
    wRear1R.position.set(-0.45, 0.48, -0.85);
    truckGroup.add(wRear1R);

    // Rear Tandem Axle 2
    const wRear2L = createDualWheel(true);
    wRear2L.position.set(-1.45, 0.48, 0.85);
    truckGroup.add(wRear2L);

    const wRear2R = createDualWheel(false);
    wRear2R.position.set(-1.45, 0.48, -0.85);
    truckGroup.add(wRear2R);


    // ==========================================
    // 2. CARRETA / SEMIRREBOQUE (TRAILER BODY)
    // ==========================================
    const trailerGroup = new THREE.Group();
    trailerGroup.position.set(2.55, 0, 0);
    rootGroup.add(trailerGroup);

    // Trailer Main Box (Baú / Sider)
    const trailerLength = 7.4;
    const trailerHeight = 2.45;
    const trailerWidth = 2.1;

    const trailerBoxGeo = new THREE.BoxGeometry(trailerLength, trailerHeight, trailerWidth);
    const trailerBox = new THREE.Mesh(trailerBoxGeo, trailerBodyMat);
    trailerBox.position.set(-trailerLength / 2, 2.05, 0);
    trailerBox.castShadow = true;
    trailerBox.receiveShadow = true;
    addEdges(trailerBox);
    trailerGroup.add(trailerBox);

    // Dynamic SP Brand Decal / Texture on trailer sides
    const brandCanvas = document.createElement('canvas');
    brandCanvas.width = 1024;
    brandCanvas.height = 340;
    const bCtx = brandCanvas.getContext('2d');
    if (bCtx) {
      bCtx.fillStyle = '#ffffff';
      bCtx.fillRect(0, 0, 1024, 340);

      bCtx.fillStyle = '#d8f6ff';
      bCtx.fillRect(0, 54, 1024, 16);
      bCtx.fillRect(0, 230, 1024, 42);

      const grad = bCtx.createLinearGradient(0, 0, 1024, 0);
      grad.addColorStop(0, '#021b79');
      grad.addColorStop(0.45, '#12a4f9');
      grad.addColorStop(1, '#021b79');
      bCtx.fillStyle = grad;
      bCtx.fillRect(0, 252, 1024, 22);

      bCtx.fillStyle = '#021b79';
      bCtx.font = '900 58px sans-serif';
      bCtx.fillText('SP LOCAÇÕES', 92, 162);

      bCtx.fillStyle = '#12a4f9';
      bCtx.font = '700 24px sans-serif';
      bCtx.fillText('LOCAÇÃO E SEMINOVOS DE SEMIRREBOQUES', 96, 205);
    }
    const brandTexture = new THREE.CanvasTexture(brandCanvas);
    brandTexture.anisotropy = 8;
    const decalMat = new THREE.MeshStandardMaterial({
      map: brandTexture,
      roughness: 0.35,
      metalness: 0.1,
    });

    // Side Panels with branding
    const sidePanelGeo = new THREE.PlaneGeometry(trailerLength * 0.98, trailerHeight * 0.92);
    
    // Left side
    const panelL = new THREE.Mesh(sidePanelGeo, decalMat);
    panelL.position.set(-trailerLength / 2, 2.05, trailerWidth / 2 + 0.01);
    trailerGroup.add(panelL);

    // Right side (reversed)
    const panelR = new THREE.Mesh(sidePanelGeo, decalMat);
    panelR.position.set(-trailerLength / 2, 2.05, -trailerWidth / 2 - 0.01);
    panelR.rotation.y = Math.PI;
    trailerGroup.add(panelR);

    const topRailGeo = new THREE.BoxGeometry(trailerLength * 0.98, 0.08, 0.06);
    const bottomRailGeo = new THREE.BoxGeometry(trailerLength * 0.98, 0.1, 0.06);
    [-1, 1].forEach((side) => {
      const topRail = new THREE.Mesh(topRailGeo, chromeMat);
      topRail.position.set(-trailerLength / 2, 3.27, side * (trailerWidth / 2 + 0.05));
      trailerGroup.add(topRail);

      const bottomRail = new THREE.Mesh(bottomRailGeo, lightBlueMat);
      bottomRail.position.set(-trailerLength / 2, 0.86, side * (trailerWidth / 2 + 0.06));
      trailerGroup.add(bottomRail);
    });

    const frontPanelGeo = new THREE.BoxGeometry(0.08, trailerHeight * 0.96, trailerWidth * 0.98);
    const frontPanel = new THREE.Mesh(frontPanelGeo, trailerBodyMat);
    frontPanel.position.set(0.04, 2.05, 0);
    frontPanel.castShadow = true;
    addEdges(frontPanel);
    trailerGroup.add(frontPanel);

    // Trailer Under-Chassis & Side Guards (Ciclista / Estribos)
    const chassisBeamGeo = new THREE.BoxGeometry(trailerLength, 0.3, 1.2);
    const chassisBeam = new THREE.Mesh(chassisBeamGeo, darkChassisMat);
    chassisBeam.position.set(-trailerLength / 2, 0.72, 0);
    chassisBeam.castShadow = true;
    trailerGroup.add(chassisBeam);

    // Side Guards (Bolinhas / Protetor lateral)
    const sideGuardGeo = new THREE.BoxGeometry(3.6, 0.15, 0.05);
    const guardL = new THREE.Mesh(sideGuardGeo, lightBlueMat);
    guardL.position.set(-2.8, 0.55, 1.02);
    trailerGroup.add(guardL);

    const guardR = new THREE.Mesh(sideGuardGeo, lightBlueMat);
    guardR.position.set(-2.8, 0.55, -1.02);
    trailerGroup.add(guardR);

    // Landing Gear (Support Legs)
    const legGeo = new THREE.BoxGeometry(0.12, 0.7, 0.12);
    const legL = new THREE.Mesh(legGeo, darkChassisMat);
    legL.position.set(-1.2, 0.45, 0.75);
    trailerGroup.add(legL);

    const legR = new THREE.Mesh(legGeo, darkChassisMat);
    legR.position.set(-1.2, 0.45, -0.75);
    trailerGroup.add(legR);

    // Trailer Tri-Axle (3 Eixos com Rodas Duplas)
    const axlePositions = [-4.6, -5.7, -6.8];
    axlePositions.forEach((xPos) => {
      // Left dual wheels
      const wL = createDualWheel(true);
      wL.position.set(xPos, 0.48, 0.92);
      trailerGroup.add(wL);

      // Right dual wheels
      const wR = createDualWheel(false);
      wR.position.set(xPos, 0.48, -0.92);
      trailerGroup.add(wR);

      // Mudguard / Paralamas
      const mudguardGeo = new THREE.BoxGeometry(0.95, 0.1, 0.5);
      const mudL = new THREE.Mesh(mudguardGeo, darkChassisMat);
      mudL.position.set(xPos, 1.02, 0.95);
      trailerGroup.add(mudL);

      const mudR = new THREE.Mesh(mudguardGeo, darkChassisMat);
      mudR.position.set(xPos, 1.02, -0.95);
      trailerGroup.add(mudR);
    });

    // Rear Taillights
    const rearBumperGeo = new THREE.BoxGeometry(0.1, 0.25, 2.08);
    const rearBumper = new THREE.Mesh(rearBumperGeo, darkChassisMat);
    rearBumper.position.set(-trailerLength - 0.02, 0.6, 0);
    trailerGroup.add(rearBumper);

    const rearLightL = new THREE.Mesh(lightGeo, taillightMat);
    rearLightL.position.set(-trailerLength - 0.08, 0.6, 0.75);
    trailerGroup.add(rearLightL);

    const rearLightR = new THREE.Mesh(lightGeo, taillightMat);
    rearLightR.position.set(-trailerLength - 0.08, 0.6, -0.75);
    trailerGroup.add(rearLightR);

    // ==========================================
    // 3. MOUSE INTERACTION & ANIMATION LOOP
    // ==========================================
    const getBaseAngle = () => (isMobileView() ? -Math.PI / 2 - 0.08 : Math.PI + 0.34);
    let baseAngle = getBaseAngle();
    let targetRotationY = baseAngle;
    let targetRotationX = 0.04;
    let isPointerDown = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (isMobileView()) return;
      // Calculate normalized mouse coords (-1 to 1) from window
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (!isPointerDown) {
        targetRotationY = baseAngle + normX * (isMobileView() ? 0.1 : 0.18);
        targetRotationX = 0.04 - normY * (isMobileView() ? 0.04 : 0.08);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (isMobileView()) return;
      isPointerDown = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isMobileView()) return;
      if (!isPointerDown) return;
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(-0.28, Math.min(0.28, targetRotationX - deltaY * 0.004));
    };

    const onPointerUp = () => {
      isPointerDown = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize Handler with ResizeObserver support
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 550;
      const h = container.clientHeight || 420;
      if (w > 0 && h > 0) {
        baseAngle = getBaseAngle();
        targetRotationY = baseAngle;
        rootGroup.position.x = 0.05;
        rootGroup.scale.setScalar(isMobileView() ? 0.72 : 0.86);
        applyCameraPose();
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }
    };

    window.addEventListener('resize', handleResize);
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(container);
    }

    // Force an initial resize trigger after 50ms to ensure layout has settled
    setTimeout(handleResize, 50);

    // Clock for idle floating and suspension
    const clock = new THREE.Clock();
    let animFrameId: number;
    let didRenderFirstFrame = false;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isMobileView()) {
        targetRotationY = baseAngle;
        targetRotationX = 0.04;
        trailerGroup.rotation.y += (0 - trailerGroup.rotation.y) * 0.08;
      }

      // Smooth Lerp (Damping) for buttery mouse movement
      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.06;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.06;

      // Subtle Idle Floating & Suspension Breathing
      const idleFloat = Math.sin(elapsedTime * 1.5) * 0.04;
      rootGroup.position.y = -0.6 + idleFloat;

      if (!isMobileView()) {
        // Gentle trailer articulation angle (slight bend when turning)
        const turnDelta = targetRotationY - rootGroup.rotation.y;
        trailerGroup.rotation.y = THREE.MathUtils.lerp(trailerGroup.rotation.y, turnDelta * 0.25, 0.05);
      }

      renderer.render(scene, camera);
      if (!didRenderFirstFrame) {
        didRenderFirstFrame = true;
        setIsLoaded(true);
      }
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="trailer-3d-wrapper">
      <div ref={containerRef} className="trailer-3d-canvas">
        {useFallback ? <TrailerFallback /> : null}
      </div>
      {isLoaded ? <span className="trailer-3d-ready" aria-hidden="true" /> : null}
    </div>
  );
}

function TrailerFallback() {
  return (
    <div className="trailer-3d-fallback" aria-label="Ilustração de semirreboque SP Locações">
      <div className="fallback-shadow" />
      <div className="fallback-trailer">
        <div className="fallback-brand">
          <strong>SP LOCAÇÕES</strong>
          <span>SEMIRREBOQUES</span>
        </div>
        <div className="fallback-stripe" />
      </div>
      <div className="fallback-cab">
        <div className="fallback-window" />
        <div className="fallback-grille" />
      </div>
      <div className="fallback-wheel fallback-wheel-1" />
      <div className="fallback-wheel fallback-wheel-2" />
      <div className="fallback-wheel fallback-wheel-3" />
      <div className="fallback-wheel fallback-wheel-4" />
    </div>
  );
}
