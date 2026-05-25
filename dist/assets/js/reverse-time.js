function initReverseTimeHero() {
  const root = document.getElementById('home-hero');
  const wrap = root?.querySelector('.home-hero__rain');
  const canvas = document.getElementById('reverse-time-canvas');
  if (!root || !wrap || !canvas) return;

  if (typeof THREE === 'undefined') {
    root.classList.add('home-hero--error');
    const msg = document.createElement('p');
    msg.className = 'home-hero__rain-error';
    msg.textContent = 'Не удалось загрузить 3D-библиотеку';
    wrap.appendChild(msg);
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const GLASS_Z = 0;
  const BOUNDS = { yMin: -2.9, yMax: 2.9 };
  let boundsHalfX = 3.4;

  const DEPTH_LAYERS = [
    { z: -0.06, size: 0.02, opacity: 0.5, count: 220, xSway: 0.01, speedMul: 0.9, brightMul: 0.82, pointerMul: 0.7 },
    { z: 0, size: 0.034, opacity: 0.78, count: 220, xSway: 0.018, speedMul: 1, brightMul: 1, pointerMul: 0.85 },
    { z: 0.055, size: 0.052, opacity: 0.95, count: 180, xSway: 0.026, speedMul: 1.08, brightMul: 1.12, pointerMul: 1.05 },
  ];

  const POINTER = { active: false, x: 0, y: 0 };
  const POINTER_RADIUS = 0.95;
  const POINTER_STRENGTH = 0.000055;
  const mouseNdc = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const glassPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -GLASS_Z);
  const planeHit = new THREE.Vector3();

  function updateHorizontalBounds() {
    const w = Math.max(wrap?.clientWidth || 1, 1);
    const h = Math.max(wrap?.clientHeight || 1, 1);
    const aspect = w / h;
    const vFovRad = (camera.fov * Math.PI) / 180;
    const dist = camera.position.z;
    const visibleHeight = 2 * Math.tan(vFovRad / 2) * dist;
    boundsHalfX = (visibleHeight * aspect) / 2 * 1.06;
  }

  function randomPointX() {
    return (Math.random() - 0.5) * boundsHalfX * 2;
  }

  function randomLayerZ(layer) {
    return layer.z + (Math.random() - 0.5) * 0.012;
  }

  function cssColor(name, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    return {
      r: parseInt(n.slice(0, 2), 16) / 255,
      g: parseInt(n.slice(2, 4), 16) / 255,
      b: parseInt(n.slice(4, 6), 16) / 255,
    };
  }

  function readPalette() {
    return {
      accent: hexToRgb(cssColor('--accent', '#9dc7ba')),
      muted: hexToRgb(cssColor('--brand-muted', '#9a9a9a')),
    };
  }

  let palette = readPalette();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
  camera.position.set(0, 0, 5.8);
  camera.lookAt(0, 0, GLASS_Z);

  const glassSheen = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.04,
      depthWrite: false,
    })
  );
  glassSheen.position.z = GLASS_Z - 0.02;
  scene.add(glassSheen);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch (e) {
    root.classList.add('home-hero--error');
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

  const layers = DEPTH_LAYERS.map((cfg) => {
    const points = new Array(cfg.count);
    for (let i = 0; i < cfg.count; i++) {
      points[i] = {
        x: randomPointX(),
        y: BOUNDS.yMin + Math.random() * (BOUNDS.yMax - BOUNDS.yMin),
        z: randomLayerZ(cfg),
        speed: (0.22 + Math.random() * 0.45) * cfg.speedMul,
        phase: Math.random() * Math.PI * 2,
        bright: 0.35 + Math.random() * 0.65,
        vx: 0,
        vy: 0,
      };
    }

    const positions = new Float32Array(cfg.count * 3);
    const colors = new Float32Array(cfg.count * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: cfg.size,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: cfg.opacity,
      depthWrite: false,
    });

    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    return { cfg, points, positions, colors, geometry, material, mesh };
  });

  let elapsed = 0;
  let rafId = 0;
  let lastFrame = 0;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function updatePointerFromEvent(clientX, clientY) {
    const rect = root.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      POINTER.active = false;
      return;
    }

    POINTER.active = true;
    mouseNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseNdc, camera);
    if (raycaster.ray.intersectPlane(glassPlane, planeHit)) {
      POINTER.x = planeHit.x;
      POINTER.y = planeHit.y;
    }
  }

  function applyPointerForce(p, cfg, dt) {
    if (!POINTER.active) return;

    const dx = p.x - POINTER.x;
    const dy = p.y - POINTER.y;
    const distSq = dx * dx + dy * dy;
    const radius = POINTER_RADIUS;
    if (distSq > radius * radius || distSq < 1e-8) return;

    const dist = Math.sqrt(distSq);
    const falloff = 1 - dist / radius;
    const push = POINTER_STRENGTH * falloff * falloff * cfg.pointerMul * dt;

    p.vx += (dx / dist) * push;
    p.vy += (dy / dist) * push;
  }

  function setPointColor(layer, i, bright) {
    const g = lerp(0.55, 0.98, bright) * layer.cfg.brightMul;
    const i3 = i * 3;
    layer.colors[i3] = lerp(palette.muted.r * g, palette.accent.r * 0.85 + 0.15, bright * 0.35);
    layer.colors[i3 + 1] = lerp(palette.muted.g * g, palette.accent.g * 0.85 + 0.15, bright * 0.35);
    layer.colors[i3 + 2] = lerp(palette.muted.b * g, palette.accent.b * 0.85 + 0.15, bright * 0.35);
  }

  function updatePoints(dt, t) {
    for (const layer of layers) {
      const { cfg, points, positions } = layer;

      for (let i = 0; i < cfg.count; i++) {
        const p = points[i];
        if (!reducedMotion) {
          p.y += p.speed * dt * 0.000045;
          if (p.y > BOUNDS.yMax) {
            p.y = BOUNDS.yMin - Math.random() * 0.25;
            p.x = randomPointX();
            p.z = randomLayerZ(cfg);
            p.vx = 0;
            p.vy = 0;
          }

          p.vx *= 0.88;
          p.vy *= 0.88;
          applyPointerForce(p, cfg, dt);
          p.x += p.vx;
          p.y += p.vy;

          const limitX = boundsHalfX * 1.05;
          if (p.x > limitX) p.x = limitX;
          if (p.x < -limitX) p.x = -limitX;
        }

        const sway = Math.sin(t * 0.0009 + p.phase) * cfg.xSway;
        const i3 = i * 3;

        positions[i3] = p.x + sway;
        positions[i3 + 1] = p.y;
        positions[i3 + 2] = p.z;

        setPointColor(layer, i, p.bright);
      }

      layer.geometry.attributes.position.needsUpdate = true;
      layer.geometry.attributes.color.needsUpdate = true;
    }
  }

  function resize() {
    const w = Math.max(wrap?.clientWidth || 1, 1);
    const h = Math.max(wrap?.clientHeight || 1, 1);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    updateHorizontalBounds();
    renderer.setSize(w, h, false);
  }

  function applyThemeColors() {
    palette = readPalette();
    updatePoints(0, elapsed);
  }

  function frame(now) {
    const dt = reducedMotion ? 0 : Math.min(48, now - lastFrame || 0);
    lastFrame = now;
    elapsed += dt;

    updatePoints(dt, elapsed);
    renderer.render(scene, camera);

    if (!reducedMotion) rafId = requestAnimationFrame(frame);
  }

  const themeObserver = new MutationObserver(applyThemeColors);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  resize();
  for (const layer of layers) {
    for (let i = 0; i < layer.cfg.count; i++) {
      layer.points[i].x = randomPointX();
    }
  }
  window.addEventListener('resize', resize);

  const onPointerMove = (e) => updatePointerFromEvent(e.clientX, e.clientY);
  const onPointerLeave = () => {
    POINTER.active = false;
  };

  if (!reducedMotion) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    root.addEventListener('pointerleave', onPointerLeave);
  }

  root.classList.add('is-running');

  updatePoints(0, 0);
  renderer.render(scene, camera);

  if (!reducedMotion) rafId = requestAnimationFrame(frame);

  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', onPointerMove);
    root.removeEventListener('pointerleave', onPointerLeave);
    themeObserver.disconnect();
    for (const layer of layers) {
      layer.geometry.dispose();
      layer.material.dispose();
    }
    glassSheen.geometry.dispose();
    glassSheen.material.dispose();
    renderer.dispose();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReverseTimeHero);
} else {
  initReverseTimeHero();
}
