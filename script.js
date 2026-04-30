/* ═══════════════════════════════════════════════
   BANDI JAYANTH PORTFOLIO — script.js
   Three.js 3D Background + All Interactions
   ═══════════════════════════════════════════════ */

/* ─── THREE.JS 3D PARTICLE FIELD ─── */
(function initThree() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  /* ─── Floating Particles ─── */
  const particleCount = 320;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const palette = [
    new THREE.Color(0x00d4ff),  // cyan
    new THREE.Color(0x7c3aed),  // violet
    new THREE.Color(0x10b981),  // emerald
    new THREE.Color(0xf59e0b),  // amber
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pMat = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ─── Floating Wireframe Torus ─── */
  const torusGeo = new THREE.TorusGeometry(8, 0.08, 16, 120);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: false, transparent: true, opacity: 0.06 });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(18, 4, -10);
  scene.add(torus);

  /* ─── Icosahedron wireframe ─── */
  const icoGeo = new THREE.IcosahedronGeometry(4, 1);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.08 });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(-20, -5, -8);
  scene.add(ico);

  /* ─── Small floating cubes ─── */
  const cubeGroup = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const cg = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const cm = new THREE.MeshBasicMaterial({
      color: palette[i % palette.length],
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const cube = new THREE.Mesh(cg, cm);
    cube.position.set(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 20
    );
    cube.userData.speed = (Math.random() * 0.006) + 0.003;
    cube.userData.rotAxis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
    cubeGroup.add(cube);
  }
  scene.add(cubeGroup);

  /* ─── Mouse Parallax ─── */
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ─── Resize ─── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ─── Animate ─── */
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    const t = frame * 0.004;

    // Slow drift on particles
    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.02;

    // Camera parallax
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    // Torus spin
    torus.rotation.x += 0.003;
    torus.rotation.z += 0.002;

    // Ico spin
    ico.rotation.y += 0.004;
    ico.rotation.x += 0.002;

    // Small cubes
    cubeGroup.children.forEach(c => {
      c.rotateOnAxis(c.userData.rotAxis, c.userData.speed);
    });

    renderer.render(scene, camera);
  }
  animate();
})();


/* ─── HAMBURGER MENU ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = navLinks.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
  }));
}


/* ─── SCROLL REVEAL ─── */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${i * 0.06}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(el => revealObserver.observe(el));


/* ─── NAV ACTIVE STATE ─── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
}, { passive: true });


/* ─── 3D CARD TILT EFFECT ─── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    const rotX  = dy * -8;
    const rotY  = dx * 8;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    card.style.transition = 'transform 0.5s ease';
  });
});


/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ─── TYPEWRITER EFFECT (Hero subtitle) ─── */
(function typewriter() {
  const roles = [
    'Software Consultant @ Encora',
    'Full-Stack Engineer (.NET + React)',
    'AI/ML Researcher (YOLOv8)',
    'Azure Developer Associate',
  ];
  const el = document.querySelector('.hero-subtitle');
  if (!el) return;

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const baseText = '';

  function tick() {
    const current = roles[roleIdx];
    const display = deleting ? current.slice(0, charIdx--) : current.slice(0, charIdx++);
    el.textContent = display;

    if (!deleting && charIdx > current.length) {
      deleting = true;
      setTimeout(tick, 1800);
      return;
    }
    if (deleting && charIdx < 0) {
      deleting = false;
      charIdx = 0;
      roleIdx = (roleIdx + 1) % roles.length;
    }
    setTimeout(tick, deleting ? 32 : 58);
  }

  // Start after initial animation
  setTimeout(tick, 1200);
})();


/* ─── COUNTER ANIMATION ─── */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      if (text.includes('%')) animateCounter(el, parseInt(text), '%');
      else if (text.includes('K+')) animateCounter(el, parseInt(text) * 1000, '+');
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));