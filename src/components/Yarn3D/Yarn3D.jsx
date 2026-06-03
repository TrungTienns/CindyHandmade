import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function YarnBall3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    // transparent background — no scene.background set

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0.6, 5.2);
    camera.lookAt(0, 0, 0);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));

    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.2);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0ff, 0.6);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    // ── Yarn Ball Group ──────────────────────────────────────────
    const yarnGroup = new THREE.Group();
    scene.add(yarnGroup);

    // Core sphere (white wool)
    const coreGeo = new THREE.SphereGeometry(1, 64, 64);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf8f5f0,
      roughness: 0.92,
      metalness: 0.0,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.castShadow = true;
    core.receiveShadow = true;
    yarnGroup.add(core);

    // Slightly tinted strand materials for depth
    const strandMats = [
      new THREE.MeshStandardMaterial({ color: 0xf0ece6, roughness: 0.95, metalness: 0.0 }),
      new THREE.MeshStandardMaterial({ color: 0xe8e4de, roughness: 0.9, metalness: 0.0 }),
      new THREE.MeshStandardMaterial({ color: 0xfbf8f4, roughness: 0.88, metalness: 0.0 }),
    ];

    function spherePt(theta, phi, r = 1.022) {
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }

    function addStrand(points, mat, radius = 0.042) {
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.TubeGeometry(curve, 120, radius, 7, false);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      yarnGroup.add(mesh);
    }

    // Diagonal winding strands (like real yarn)
    const windingDefs = [
      { t0: 0.0,  phi0: 0.25, phi1: Math.PI * 0.75, turns: 3.8, mat: 0 },
      { t0: 0.7,  phi0: 0.35, phi1: Math.PI * 0.82, turns: 3.2, mat: 1 },
      { t0: 1.4,  phi0: 0.18, phi1: Math.PI * 0.88, turns: 4.3, mat: 2 },
      { t0: 2.1,  phi0: 0.42, phi1: Math.PI * 0.70, turns: 3.6, mat: 0 },
      { t0: 2.8,  phi0: 0.28, phi1: Math.PI * 0.80, turns: 4.0, mat: 1 },
      { t0: 0.35, phi0: 0.55, phi1: Math.PI * 0.92, turns: 2.9, mat: 2 },
      { t0: 1.05, phi0: 0.22, phi1: Math.PI * 0.76, turns: 4.5, mat: 0 },
      { t0: 1.75, phi0: 0.48, phi1: Math.PI * 0.68, turns: 3.4, mat: 1 },
      { t0: 2.45, phi0: 0.32, phi1: Math.PI * 0.84, turns: 3.9, mat: 2 },
    ];

    windingDefs.forEach(d => {
      const pts = [];
      for (let i = 0; i <= 100; i++) {
        const s = i / 100;
        const phi = d.phi0 + (d.phi1 - d.phi0) * s;
        const theta = d.t0 + s * Math.PI * 2 * d.turns;
        pts.push(spherePt(theta, phi));
      }
      addStrand(pts, strandMats[d.mat], 0.040);
    });

    // Horizontal wrap strands (bands around the ball)
    for (let i = 0; i < 7; i++) {
      const phi = 0.3 + i * 0.38;
      const r = 1.026 + (i % 3) * 0.006;
      const pts = [];
      const segs = 80;
      for (let j = 0; j <= segs; j++) {
        const theta = (j / segs) * Math.PI * 2 + i * 0.5;
        pts.push(spherePt(theta, phi, r));
      }
      const curve = new THREE.CatmullRomCurve3(pts, true);
      const geo = new THREE.TubeGeometry(curve, 100, 0.036, 7, true);
      const mesh = new THREE.Mesh(geo, strandMats[i % 3]);
      mesh.castShadow = true;
      yarnGroup.add(mesh);
    }

    // ── Knitting Needles ─────────────────────────────────────────
    function buildNeedle() {
      const g = new THREE.Group();

      // Shaft
      const shaftGeo = new THREE.CylinderGeometry(0.042, 0.042, 4.2, 18);
      const shaftMat = new THREE.MeshStandardMaterial({
        color: 0xd4a843,
        roughness: 0.25,
        metalness: 0.65,
      });
      g.add(new THREE.Mesh(shaftGeo, shaftMat));

      // Grip bands (darker gold)
      const bandMat = new THREE.MeshStandardMaterial({ color: 0xb88a28, roughness: 0.3, metalness: 0.6 });
      for (let i = 0; i < 8; i++) {
        const bandGeo = new THREE.TorusGeometry(0.044, 0.013, 7, 22);
        const band = new THREE.Mesh(bandGeo, bandMat);
        band.position.y = -1.2 + i * 0.35;
        band.rotation.x = Math.PI / 2;
        g.add(band);
      }

      // Tip (tapered point)
      const tipGeo = new THREE.ConeGeometry(0.042, 0.32, 16);
      const tipMat = new THREE.MeshStandardMaterial({ color: 0xe8c060, roughness: 0.15, metalness: 0.8 });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.y = -2.26;
      tip.rotation.z = Math.PI;
      g.add(tip);

      // Decorative top cap
      const capGeo = new THREE.SphereGeometry(0.13, 16, 16);
      const capMat = new THREE.MeshStandardMaterial({ color: 0xf0d080, roughness: 0.2, metalness: 0.5 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 2.14;
      g.add(cap);

      // Ring below cap
      const ringGeo = new THREE.TorusGeometry(0.085, 0.02, 8, 22);
      const ring = new THREE.Mesh(ringGeo, bandMat);
      ring.position.y = 1.96;
      ring.rotation.x = Math.PI / 2;
      g.add(ring);

      return g;
    }

    // Needle 1: upper-left, piercing slightly
    const needle1 = buildNeedle();
    needle1.position.set(-0.45, 0.35, 0.7);
    needle1.rotation.set(0.18, 0.08, -0.60);
    scene.add(needle1);

    // Needle 2: lower-right, crossing
    const needle2 = buildNeedle();
    needle2.position.set(0.38, 0.15, 0.65);
    needle2.rotation.set(-0.12, 0.12, 0.58);
    scene.add(needle2);

    // ── Orbit Controls (manual) ──────────────────────────────────
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let rotY = 0, rotX = 0.1;

    const onDown = e => {
      isDragging = true;
      prevX = e.clientX ?? e.touches?.[0].clientX;
      prevY = e.clientY ?? e.touches?.[0].clientY;
    };
    const onUp = () => { isDragging = false; };
    const onMove = e => {
      if (!isDragging) return;
      const cx = e.clientX ?? e.touches?.[0].clientX;
      const cy = e.clientY ?? e.touches?.[0].clientY;
      rotY += (cx - prevX) * 0.007;
      rotX += (cy - prevY) * 0.005;
      rotX = Math.max(-0.9, Math.min(0.9, rotX));
      prevX = cx; prevY = cy;
    };

    container.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    container.addEventListener('touchstart', onDown);
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchmove', onMove);

    // ── Animation Loop ────────────────────────────────────────────
    let t = 0;
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.007;
      if (!isDragging) rotY += 0.003;

      const bob = Math.sin(t * 0.6) * 0.035;

      yarnGroup.rotation.y = rotY;
      yarnGroup.rotation.x = rotX;
      yarnGroup.position.y = bob;

      needle1.rotation.set(0.18 + rotX, 0.08, -0.60);
      needle1.rotation.y = 0.08 + rotY * 0.15;
      needle1.position.y = 0.35 + bob;

      needle2.rotation.set(-0.12 + rotX, 0.12, 0.58);
      needle2.rotation.y = 0.12 + rotY * 0.15;
      needle2.position.y = 0.15 + bob;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onDown);
      container.removeEventListener('touchstart', onDown);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '360px', background: 'transparent' }}>
      <div
        ref={mountRef}
        style={{ width: '100%', height: '100%', minHeight: '360px', cursor: 'grab', background: 'transparent' }}
      />
    </div>
  );
}