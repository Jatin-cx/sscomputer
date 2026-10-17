/* ==========================================================================
   SMART SOFT COMPUTERS - 2026 THREE.JS 3D ENGINE & APP INTERACTIONS
   ========================================================================== */

/* Format Currency in Indian Rupee format */
function formatCurrency(num) {
  return "Rs. " + Number(num).toLocaleString('en-IN');
}

/* ========================================================================
   1. THREE.JS PROCEDURAL 3D INTERACTIVE LAPTOP & MATRIX STAGE
   ======================================================================== */
let scene, camera, renderer, laptopGroup, laptopScreenMesh, screenCanvas, screenCtx, screenTexture;
let isDragging = false;
let prevMousePos = { x: 0, y: 0 };
let targetRotation = { x: 0.25, y: -0.45 };
let currentRotation = { x: 0.25, y: -0.45 };

function initThreeHero() {
  const container = document.getElementById("hero-three-canvas-wrap");
  if (!container || typeof THREE === "undefined") return;

  const width = container.clientWidth;
  const height = container.clientHeight || 500;

  // 1. Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 1.2, 5.2);

  // 2. WebGL Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // 3. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  // Electric Violet Key Light
  const violetPointLight = new THREE.PointLight(0x7C3AED, 3.5, 12);
  violetPointLight.position.set(2.5, 3, 2.5);
  scene.add(violetPointLight);

  // Neon Cyan Fill Light
  const cyanPointLight = new THREE.PointLight(0x06B6D4, 2.5, 10);
  cyanPointLight.position.set(-3, 2, -1);
  scene.add(cyanPointLight);

  // Hot Pink Rim Light
  const pinkPointLight = new THREE.PointLight(0xFF2D78, 1.8, 8);
  pinkPointLight.position.set(0, -1.5, 3);
  scene.add(pinkPointLight);

  // Top Soft Key Light
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(0, 5, 4);
  scene.add(dirLight);

  // 4. Laptop Procedural 3D Model
  laptopGroup = new THREE.Group();

  // Materials
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x100E1A,  // violet-dark
    metalness: 0.85,
    roughness: 0.25
  });

  const keyboardMat = new THREE.MeshStandardMaterial({
    color: 0x09080F,  // deep void
    metalness: 0.6,
    roughness: 0.5
  });

  const violetGlowMat = new THREE.MeshBasicMaterial({
    color: 0x7C3AED  // Electric Violet
  });

  // Base Bottom Deck
  const baseGeom = new THREE.BoxGeometry(2.8, 0.09, 1.9);
  const baseMesh = new THREE.Mesh(baseGeom, chassisMat);
  baseMesh.position.y = -0.045;
  laptopGroup.add(baseMesh);

  // Trackpad
  const trackpadGeom = new THREE.BoxGeometry(0.85, 0.005, 0.58);
  const trackpadMat = new THREE.MeshStandardMaterial({ color: 0x16102A, roughness: 0.4 });
  const trackpadMesh = new THREE.Mesh(trackpadGeom, trackpadMat);
  trackpadMesh.position.set(0, 0.005, 0.55);
  laptopGroup.add(trackpadMesh);

  // Keyboard Deck Recess
  const kbDeckGeom = new THREE.BoxGeometry(2.5, 0.005, 1.05);
  const kbDeckMesh = new THREE.Mesh(kbDeckGeom, keyboardMat);
  kbDeckMesh.position.set(0, 0.005, -0.25);
  laptopGroup.add(kbDeckMesh);

  // Keyboard Individual Key Rows Grid
  for (let r = 0; r < 5; r++) {
    const keyRowGeom = new THREE.BoxGeometry(2.35, 0.015, 0.16);
    const keyMesh = new THREE.Mesh(keyRowGeom, new THREE.MeshStandardMaterial({ color: 0x130F20, roughness: 0.6 }));
    keyMesh.position.set(0, 0.012, -0.65 + r * 0.2);
    laptopGroup.add(keyMesh);
  }

  // Glowing Base Front Edge Accent (Violet glow strip)
  const baseAccentGeom = new THREE.BoxGeometry(2.82, 0.012, 0.012);
  const baseAccentMesh = new THREE.Mesh(baseAccentGeom, violetGlowMat);
  baseAccentMesh.position.set(0, -0.03, 0.95);
  laptopGroup.add(baseAccentMesh);

  // Screen Lid Group (hinged at z = -0.95)
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 0, -0.95);

  // Screen Back Lid
  const lidGeom = new THREE.BoxGeometry(2.8, 1.85, 0.07);
  const lidMesh = new THREE.Mesh(lidGeom, chassisMat);
  lidMesh.position.set(0, 0.925, 0);
  lidGroup.add(lidMesh);

  // Dynamic Animated Canvas for Laptop Display
  screenCanvas = document.createElement("canvas");
  screenCanvas.width = 1024;
  screenCanvas.height = 680;
  screenCtx = screenCanvas.getContext("2d");
  screenTexture = new THREE.CanvasTexture(screenCanvas);

  const screenGeom = new THREE.PlaneGeometry(2.65, 1.7);
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
  laptopScreenMesh = new THREE.Mesh(screenGeom, screenMat);
  laptopScreenMesh.position.set(0, 0.925, 0.038);
  lidGroup.add(laptopScreenMesh);

  // Set Lid Open Angle (around 110 degrees)
  lidGroup.rotation.x = 0.28;
  laptopGroup.add(lidGroup);

  // Floating Cyber Particles
  const particleCount = 140;
  const particleGeom = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 8;
    particlePositions[i + 1] = (Math.random() - 0.5) * 5 + 0.5;
    particlePositions[i + 2] = (Math.random() - 0.5) * 6;
  }
  particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xA78BFA,  // violet-light
    size: 0.04,
    transparent: true,
    opacity: 0.65
  });
  const particles = new THREE.Points(particleGeom, particleMat);
  scene.add(particles);

  scene.add(laptopGroup);

  // 5. User Drag & Gyro Interaction
  const dom = renderer.domElement;
  dom.addEventListener("mousedown", (e) => {
    isDragging = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      targetRotation.y += deltaX * 0.008;
      targetRotation.x += deltaY * 0.008;
      targetRotation.x = Math.max(-0.2, Math.min(0.65, targetRotation.x));
      prevMousePos = { x: e.clientX, y: e.clientY };
    }
  });

  // Touch Support for Mobile (Instagram browser)
  dom.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  dom.addEventListener("touchmove", (e) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;
      targetRotation.y += deltaX * 0.009;
      targetRotation.x += deltaY * 0.009;
      targetRotation.x = Math.max(-0.2, Math.min(0.65, targetRotation.x));
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  // Resize Handler
  window.addEventListener("resize", () => {
    const newW = container.clientWidth;
    const newH = container.clientHeight || 500;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  });

  // Animation Loop
  let frameCount = 0;
  function animate() {
    requestAnimationFrame(animate);
    frameCount++;

    // Smooth rotation interpolation
    if (!isDragging) {
      targetRotation.y += 0.004; // subtle continuous idle spin
    }
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

    laptopGroup.rotation.x = currentRotation.x;
    laptopGroup.rotation.y = currentRotation.y;
    laptopGroup.position.y = Math.sin(frameCount * 0.03) * 0.08; // gentle float

    // Animate Laptop Screen Content
    if (frameCount % 3 === 0) {
      updateScreenTexture(frameCount);
    }

    // Particle drift
    particles.rotation.y += 0.0008;

    renderer.render(scene, camera);
  }
  animate();
}

/* Update the Dynamic 3D Laptop Display Screen with Cyber Graphics */
function updateScreenTexture(tick) {
  if (!screenCtx) return;
  const w = screenCanvas.width;
  const h = screenCanvas.height;

  // Background gradient (deep void violet)
  const grad = screenCtx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#060411");
  grad.addColorStop(1, "#020209");
  screenCtx.fillStyle = grad;
  screenCtx.fillRect(0, 0, w, h);

  // Neon Grid lines on screen (violet tint)
  screenCtx.strokeStyle = "rgba(124, 58, 237, 0.10)";
  screenCtx.lineWidth = 1;
  const step = 45;
  for (let x = 0; x < w; x += step) {
    screenCtx.beginPath();
    screenCtx.moveTo(x, 0);
    screenCtx.lineTo(x, h);
    screenCtx.stroke();
  }
  for (let y = 0; y < h; y += step) {
    screenCtx.beginPath();
    screenCtx.moveTo(0, y);
    screenCtx.lineTo(w, y);
    screenCtx.stroke();
  }

  // OS Header bar (violet tint)
  screenCtx.fillStyle = "rgba(124, 58, 237, 0.18)";
  screenCtx.fillRect(30, 30, w - 60, 48);
  screenCtx.fillStyle = "#A78BFA";
  screenCtx.font = "bold 22px 'JetBrains Mono', monospace";
  screenCtx.fillText("SMART SOFT COMPUTERS • 2026 BENCHMARK ENGINE v4.2", 50, 62);

  // Status indicator (emerald green — keep brand)
  screenCtx.fillStyle = "#10b981";
  screenCtx.beginPath();
  screenCtx.arc(w - 70, 54, 8, 0, Math.PI * 2);
  screenCtx.fill();

  // Cyber Sine Wave — violet primary + cyan secondary
  screenCtx.strokeStyle = "#A78BFA";
  screenCtx.lineWidth = 3;
  screenCtx.beginPath();
  for (let i = 40; i < w - 40; i += 4) {
    const waveY = h * 0.45 + Math.sin(i * 0.02 + tick * 0.05) * 45 + Math.cos(i * 0.01 - tick * 0.03) * 25;
    if (i === 40) screenCtx.moveTo(i, waveY);
    else screenCtx.lineTo(i, waveY);
  }
  screenCtx.stroke();

  // Cyan secondary wave
  screenCtx.strokeStyle = "rgba(6, 182, 212, 0.45)";
  screenCtx.lineWidth = 1.5;
  screenCtx.beginPath();
  for (let i = 40; i < w - 40; i += 4) {
    const waveY = h * 0.45 + Math.sin(i * 0.015 + tick * 0.04 + 1.2) * 30 + Math.cos(i * 0.012 - tick * 0.025) * 18;
    if (i === 40) screenCtx.moveTo(i, waveY);
    else screenCtx.lineTo(i, waveY);
  }
  screenCtx.stroke();

  // Benchmark Live Telemetry Cards on Laptop Screen
  screenCtx.fillStyle = "rgba(255, 255, 255, 0.04)";
  screenCtx.fillRect(50, h * 0.65, 280, 160);
  screenCtx.fillRect(360, h * 0.65, 280, 160);
  screenCtx.fillRect(670, h * 0.65, 300, 160);

  screenCtx.strokeStyle = "rgba(124, 58, 237, 0.35)";
  screenCtx.strokeRect(50, h * 0.65, 280, 160);
  screenCtx.strokeStyle = "rgba(6, 182, 212, 0.35)";
  screenCtx.strokeRect(360, h * 0.65, 280, 160);
  screenCtx.strokeStyle = "rgba(255, 45, 120, 0.35)";
  screenCtx.strokeRect(670, h * 0.65, 300, 160);

  screenCtx.fillStyle = "#ffffff";
  screenCtx.font = "bold 20px 'Inter', sans-serif";
  screenCtx.fillText("CPU PERFORMANCE", 70, h * 0.65 + 40);
  screenCtx.fillStyle = "#A78BFA";
  screenCtx.font = "bold 32px 'JetBrains Mono', monospace";
  screenCtx.fillText("14-CORE MAX", 70, h * 0.65 + 85);
  screenCtx.font = "16px 'JetBrains Mono', monospace";
  screenCtx.fillStyle = "#9ca3af";
  screenCtx.fillText("STATUS: 100% STRESS PASSED", 70, h * 0.65 + 125);

  screenCtx.fillStyle = "#ffffff";
  screenCtx.font = "bold 20px 'Inter', sans-serif";
  screenCtx.fillText("BATTERY HEALTH", 380, h * 0.65 + 40);
  screenCtx.fillStyle = "#67E8F9";
  screenCtx.font = "bold 32px 'JetBrains Mono', monospace";
  screenCtx.fillText("96% CAPACITY", 380, h * 0.65 + 85);
  screenCtx.font = "16px 'JetBrains Mono', monospace";
  screenCtx.fillStyle = "#9ca3af";
  screenCtx.fillText("UP TO 16 HRS REAL RUNTIME", 380, h * 0.65 + 125);

  screenCtx.fillStyle = "#ffffff";
  screenCtx.font = "bold 20px 'Inter', sans-serif";
  screenCtx.fillText("SHOP WARRANTY", 690, h * 0.65 + 40);
  screenCtx.fillStyle = "#FF6FA8";
  screenCtx.font = "bold 32px 'JetBrains Mono', monospace";
  screenCtx.fillText("VERIFIED STORE", 690, h * 0.65 + 85);
  screenCtx.font = "16px 'JetBrains Mono', monospace";
  screenCtx.fillStyle = "#9ca3af";
  screenCtx.fillText("TEST BEFORE YOU BUY", 690, h * 0.65 + 125);

  screenTexture.needsUpdate = true;
}

/* ========================================================================
   2. DOM CONFIGURATION BINDINGS
   ======================================================================== */
function applyShopConfig() {
  const footerShopName = document.getElementById("footer-shop-name");
  if (footerShopName) footerShopName.textContent = SHOP_CONFIG.shopName;
  const navShopName = document.getElementById("nav-shop-name");
  if (navShopName) navShopName.textContent = "SSC";
  document.title = `${SHOP_CONFIG.shopName} | 2026 Verified Laptops Experience Store`;

  const heroTagline = document.getElementById("hero-tagline");
  const footerTagline = document.getElementById("footer-tagline");
  if (heroTagline) heroTagline.textContent = SHOP_CONFIG.tagline;
  if (footerTagline) footerTagline.textContent = SHOP_CONFIG.tagline;

  // Phone buttons
  const callButtons = [
    document.getElementById("nav-call-btn"),
    document.getElementById("hero-call-btn"),
    document.getElementById("store-call-btn"),
    document.getElementById("footer-phone-link")
  ];
  callButtons.forEach(btn => {
    if (btn) btn.href = `tel:${SHOP_CONFIG.phoneRaw}`;
  });

  const infoPhone = document.getElementById("info-phone");
  const footerPhoneDisplay = document.getElementById("footer-phone-display");
  if (infoPhone) {
    infoPhone.textContent = SHOP_CONFIG.phoneDisplay;
    infoPhone.href = `tel:${SHOP_CONFIG.phoneRaw}`;
  }
  if (footerPhoneDisplay) footerPhoneDisplay.textContent = SHOP_CONFIG.phoneDisplay;

  // WhatsApp buttons
  const defaultWaMsg = encodeURIComponent(`Hello ${SHOP_CONFIG.shopName}! I'm looking at your 2026 laptop catalog on Instagram. Can you share in-stock models?`);
  const heroWaUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${defaultWaMsg}`;
  
  const navWaBtn = document.getElementById("nav-wa-btn");
  const heroWaBtn = document.getElementById("hero-wa-btn");
  const storeWaBtn = document.getElementById("store-wa-btn");
  if (navWaBtn) navWaBtn.href = heroWaUrl;
  if (heroWaBtn) heroWaBtn.href = heroWaUrl;
  if (storeWaBtn) storeWaBtn.href = heroWaUrl;

  // Store Address & Hours
  const storeAddress = document.getElementById("store-address");
  const storeMapLink = document.getElementById("store-map-link");
  const storeHours = document.getElementById("store-hours");
  if (storeAddress) storeAddress.textContent = SHOP_CONFIG.address;
  if (storeMapLink) storeMapLink.href = SHOP_CONFIG.mapUrl;
  if (storeHours) {
    storeHours.innerHTML = SHOP_CONFIG.openingHours.replace("|", "<br><span style='color:var(--text-muted); font-size:0.85rem;'>") + "</span>";
  }

  // Instagram
  const footerInstagram = document.getElementById("footer-instagram");
  if (footerInstagram) footerInstagram.href = SHOP_CONFIG.instagramLink;

  // Year
  const currentYear = document.getElementById("current-year");
  if (currentYear) currentYear.textContent = new Date().getFullYear();
}

/* ========================================================================
   3. 2026 3D CARD TILT ON MOUSEMOVE
   ======================================================================== */
function bindCardTiltEffect(card) {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale3d(1.01, 1.01, 1.01)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)`;
  });
}

/* ========================================================================
   4. RENDER LAPTOP CATALOG TILES
   ======================================================================== */
const laptopsGrid = document.getElementById("cyber-laptops-grid");
const countDisplay = document.getElementById("catalog-count-pill");

const searchInput = document.getElementById("search-input");
const brandSelect = document.getElementById("filter-brand");
const conditionSelect = document.getElementById("filter-condition");
const ramSelect = document.getElementById("filter-ram");
const priceSortSelect = document.getElementById("filter-price-sort");
const resetBtn = document.getElementById("btn-reset-filters");

function populateBrandOptions() {
  if (!brandSelect) return;
  const brands = Array.from(new Set(LAPTOPS_DATA.map(item => item.brand))).sort();
  brands.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    brandSelect.appendChild(opt);
  });
}

function renderLaptopCards(items) {
  if (!laptopsGrid) return;
  laptopsGrid.innerHTML = "";
  if (countDisplay) {
    countDisplay.textContent = `Showing ${items.length} of ${LAPTOPS_DATA.length} Verified Laptops`;
  }

  if (items.length === 0) {
    laptopsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px dashed var(--border-subtle);">
        <h3 style="font-size: 1.4rem; color: #fff; margin-bottom: 0.5rem;">No machines match this configuration</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try clearing your search or checking all brands.</p>
        <button class="btn-cyber-primary" onclick="resetFilters()">View All Laptops</button>
      </div>
    `;
    return;
  }

  items.forEach(laptop => {
    const card = document.createElement("div");
    card.className = "cyber-card";
    
    let badgeClass = "badge-mint";
    if (laptop.condition === "New") badgeClass = "badge-new";
    if (laptop.condition === "Used") badgeClass = "badge-lease";

    card.innerHTML = `
      <div class="card-media-stage">
        <img class="card-product-img" src="${laptop.image}" alt="${laptop.name}" loading="lazy">
        <div class="card-floating-tags">
          <span class="cyber-badge ${badgeClass}">${laptop.conditionBadge || laptop.condition}</span>
          <span class="cyber-badge badge-stock-in">
            <span class="beacon-dot" style="width:6px; height:6px;"></span>
            In Store
          </span>
        </div>
      </div>

      <div class="card-content">
        <div class="card-category-row">
          <span class="card-cat-name">${laptop.brand} • ${laptop.category || "Laptop"}</span>
          <span class="card-urgent-note">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path></svg>
            ${laptop.urgentTag || "Verified"}
          </span>
        </div>

        <h3 class="card-title">${laptop.name}</h3>

        <div class="specs-hologram-deck">
          <div class="spec-holo-cell">
            <span class="spec-holo-label">Processor</span>
            <span class="spec-holo-val" title="${laptop.cpu}">${laptop.cpu}</span>
          </div>
          <div class="spec-holo-cell">
            <span class="spec-holo-label">Memory</span>
            <span class="spec-holo-val">${laptop.ram}</span>
          </div>
          <div class="spec-holo-cell">
            <span class="spec-holo-label">Storage</span>
            <span class="spec-holo-val">${laptop.storage}</span>
          </div>
          <div class="spec-holo-cell">
            <span class="spec-holo-label">Display</span>
            <span class="spec-holo-val">${laptop.screen}</span>
          </div>
        </div>

        <div class="benchmark-row">
          <span class="bm-label">Benchmark:</span>
          <div class="bm-bar-track">
            <div class="bm-bar-fill" style="width: ${laptop.benchmarkScore || 90}%;"></div>
          </div>
          <span class="bm-score">${laptop.benchmarkScore || 90}/100</span>
        </div>

        <div class="card-bottom-tray">
          <div class="card-pricing-block">
            ${laptop.originalPrice ? `<span class="card-orig-price">${formatCurrency(laptop.originalPrice)}</span>` : ''}
            <span class="card-price-glow">${formatCurrency(laptop.price)}</span>
          </div>

          <div class="btn-inspect-pill">
            <span>Inspect Laptop</span>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    `;

    bindCardTiltEffect(card);
    card.addEventListener("click", () => openDetailModal(laptop));
    laptopsGrid.appendChild(card);
  });

  // Animate new cards in after render
  setTimeout(animateCatalogCards, 60);
}

function applyCatalogFilters() {
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const brand = brandSelect ? brandSelect.value : "ALL";
  const cond = conditionSelect ? conditionSelect.value : "ALL";
  const ram = ramSelect ? ramSelect.value : "ALL";
  const sort = priceSortSelect ? priceSortSelect.value : "ALL";

  let results = LAPTOPS_DATA.filter(laptop => {
    const text = `${laptop.name} ${laptop.brand} ${laptop.cpu} ${laptop.ram} ${laptop.storage} ${laptop.gpu} ${laptop.category}`.toLowerCase();
    if (query && !text.includes(query)) return false;
    if (brand !== "ALL" && laptop.brand !== brand) return false;
    if (cond !== "ALL" && laptop.condition !== cond) return false;
    if (ram !== "ALL") {
      const targetRam = parseInt(ram, 10);
      if (laptop.ramSizeGb !== targetRam) return false;
    }
    return true;
  });

  if (sort === "LOW") {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === "HIGH") {
    results.sort((a, b) => b.price - a.price);
  }

  renderLaptopCards(results);
}

function resetFilters() {
  if (searchInput) searchInput.value = "";
  if (brandSelect) brandSelect.value = "ALL";
  if (conditionSelect) conditionSelect.value = "ALL";
  if (ramSelect) ramSelect.value = "ALL";
  if (priceSortSelect) priceSortSelect.value = "ALL";
  applyCatalogFilters();
}

if (searchInput) searchInput.addEventListener("input", applyCatalogFilters);
if (brandSelect) brandSelect.addEventListener("change", applyCatalogFilters);
if (conditionSelect) conditionSelect.addEventListener("change", applyCatalogFilters);
if (ramSelect) ramSelect.addEventListener("change", applyCatalogFilters);
if (priceSortSelect) priceSortSelect.addEventListener("change", applyCatalogFilters);
if (resetBtn) resetBtn.addEventListener("click", resetFilters);

/* ========================================================================
   5. DETAIL MODAL (CYBER DECK INSPECTOR)
   ======================================================================== */
const modal = document.getElementById("laptop-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalOrigPrice = document.getElementById("modal-orig-price");
const modalDiscountPill = document.getElementById("modal-discount-pill");
const modalConditionTag = document.getElementById("modal-condition-tag");
const modalSpecsMatrix = document.getElementById("modal-specs-matrix");
const modalCallAction = document.getElementById("modal-call-action");
const modalWaAction = document.getElementById("modal-wa-action");
const modalPerkText = document.getElementById("modal-perk-text");

function openDetailModal(laptop) {
  if (!modal) return;
  if (modalImg) modalImg.src = laptop.image;
  if (modalTitle) modalTitle.textContent = laptop.name;
  if (modalPrice) modalPrice.textContent = formatCurrency(laptop.price);
  if (modalOrigPrice) modalOrigPrice.textContent = laptop.originalPrice ? formatCurrency(laptop.originalPrice) : "";
  if (modalDiscountPill) {
    modalDiscountPill.textContent = laptop.discountPercent ? `Save ${laptop.discountPercent}% OFF MRP` : "Certified Price";
  }

  if (modalConditionTag) {
    modalConditionTag.textContent = laptop.conditionGrade || laptop.condition;
  }

  const specRows = [
    { k: "Processor (CPU)", v: laptop.cpu },
    { k: "RAM / Memory", v: laptop.ram },
    { k: "Solid State Storage", v: laptop.storage },
    { k: "Graphics Accelerator", v: laptop.gpu },
    { k: "Display & Color", v: laptop.screen },
    { k: "Battery Health", v: `${laptop.batteryHealth} • ${laptop.batteryBackup}` },
    { k: "Operating System", v: laptop.os },
    { k: "Warranty & Guarantee", v: laptop.warranty },
    { k: "Included In Box", v: laptop.boxContents }
  ];

  if (modalSpecsMatrix) {
    modalSpecsMatrix.innerHTML = specRows.map(r => `
      <div class="modal-spec-cell">
        <span class="k">${r.k}</span>
        <span class="v">${r.v}</span>
      </div>
    `).join("");
  }

  if (modalPerkText) {
    modalPerkText.textContent = `Includes ${laptop.warranty}. Bring your old laptop for instant exchange evaluation or test drive this machine with a cup of chai in our store.`;
  }

  if (modalCallAction) {
    modalCallAction.href = `tel:${SHOP_CONFIG.phoneRaw}`;
  }

  if (modalWaAction) {
    const msg = encodeURIComponent(
      `Hello ${SHOP_CONFIG.shopName}! I saw your 2026 showcase listing for "${laptop.name}" at ${formatCurrency(laptop.price)}.\n\n` +
      `Specs: ${laptop.cpu} | ${laptop.ram} | ${laptop.storage}\n` +
      `Condition: ${laptop.conditionGrade || laptop.condition}\n\n` +
      `Can you share a quick 1-minute video of this laptop on WhatsApp? I would like to buy / visit the shop.`
    );
    modalWaAction.href = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${msg}`;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeDetailModal() {
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeDetailModal);
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeDetailModal();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && modal.classList.contains("active")) {
    closeDetailModal();
  }
});

/* ========================================================================
   6. ANIMATE CATALOG CARDS (called after render)
   ======================================================================== */
function animateCatalogCards() {
  if (typeof gsap === "undefined") {
    document.querySelectorAll(".cyber-card").forEach(el => {
      el.style.opacity = "1"; el.style.transform = "none";
    });
    return;
  }
  gsap.to(".cyber-card", {
    opacity: 1, y: 0, duration: 0.55, stagger: 0.09,
    ease: "power3.out", delay: 0.05
  });
}

/* ========================================================================
   7. PREMIUM EFFECTS — LOADER · LENIS · CURSOR · PROGRESS · MAGNETIC
   ======================================================================== */

/* ── Page Loader ── */
function runPageLoader() {
  const loader = document.getElementById("page-loader");
  const bar    = document.getElementById("loader-bar");
  const status = document.getElementById("loader-status");
  if (!loader) return;
  const steps = [
    { pct: 18,  msg: "Initializing 3D Engine..." },
    { pct: 42,  msg: "Loading Inventory..." },
    { pct: 68,  msg: "Calibrating Display..." },
    { pct: 90,  msg: "Almost Ready..." },
    { pct: 100, msg: "Welcome! 🚀" }
  ];
  let i = 0;
  const tick = setInterval(() => {
    if (i >= steps.length) { clearInterval(tick); return; }
    const step = steps[i++];
    if (bar)    bar.style.width      = step.pct + "%";
    if (status) status.textContent   = step.msg;
    if (step.pct === 100) {
      clearInterval(tick);
      setTimeout(hideLoader, 380);
    }
  }, 310);

  function hideLoader() {
    gsap.to(loader, {
      opacity: 0, duration: 0.7, ease: "power2.inOut",
      onComplete: () => {
        loader.style.display = "none";
        runHeroEntrance();
        setTimeout(initMagneticButtons, 300);
      }
    });
  }
}

/* ── Lenis Smooth Scroll ── */
function initLenis() {
  if (typeof Lenis === "undefined") return;
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  if (typeof ScrollTrigger !== "undefined") {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

/* ── Custom Cursor ── */
function initCursor() {
  const ring = document.getElementById("cursor-ring");
  const dot  = document.getElementById("cursor-dot");
  if (!ring || !dot) return;
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
    ring.style.display = "none"; dot.style.display = "none"; return;
  }
  let mx = -300, my = -300, rx = -300, ry = -300;
  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll("a, button, .cyber-card, input, select").forEach(el => {
    el.addEventListener("mouseenter", () => ring.classList.add("on-hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("on-hover"));
  });
}

/* ── Scroll Progress Bar ── */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + "%";
  }, { passive: true });
}

/* ── Magnetic Buttons ── */
function initMagneticButtons() {
  if (typeof gsap === "undefined") return;
  document.querySelectorAll(".btn-cyber-primary, .btn-cyber-wa").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      gsap.to(btn, { x: dx * 0.3, y: dy * 0.3, duration: 0.35, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ── Hero Word-by-Word Entrance ── */
function runHeroEntrance() {
  if (typeof gsap === "undefined") return;

  const title = document.querySelector(".hero-glitch-title");
  if (title) {
    gsap.set(title, { opacity: 1 });
    const nodes = Array.from(title.childNodes);
    const frag  = document.createDocumentFragment();
    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const outer = document.createElement("span");
            outer.className = "word-split";
            const inner = document.createElement("span");
            inner.className = "word-inner";
            inner.textContent = part;
            outer.appendChild(inner);
            frag.appendChild(outer);
          }
        });
      } else {
        const outer = document.createElement("span");
        outer.className = "word-split";
        const inner = document.createElement("span");
        inner.className = "word-inner";
        inner.appendChild(node.cloneNode(true));
        outer.appendChild(inner);
        frag.appendChild(outer);
      }
    });
    title.innerHTML = "";
    title.appendChild(frag);
    gsap.set(".hero-glitch-title .word-inner", { y: "115%" });
  }

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  if (title) tl.to(".hero-glitch-title .word-inner", { y: 0, duration: 1.05, stagger: 0.1 });
  tl.to(".gsap-fade", { opacity: 1, y: 0, duration: 0.75, stagger: 0.13, ease: "power3.out" }, "-=0.6");
}

/* ── ScrollTrigger Animations ── */
function initScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  // Why-buy tiles stagger in
  gsap.to(".why-cyber-tile", {
    opacity: 1, y: 0, duration: 0.75, stagger: 0.15, ease: "power3.out",
    scrollTrigger: { trigger: ".why-features-grid", start: "top 82%" }
  });

  // Store super card
  gsap.from(".store-super-card", {
    opacity: 0, y: 55, duration: 1.1, ease: "power3.out",
    scrollTrigger: { trigger: ".store-super-card", start: "top 85%" }
  });

  // Section headings
  gsap.utils.toArray(".catalog-title").forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 40, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });
}

/* ── Mobile Navigation Drawer ── */
function initMobileNav() {
  const toggleBtn = document.getElementById("mobile-nav-toggle");
  const drawer = document.getElementById("mobile-nav-drawer");
  if (!toggleBtn || !drawer) return;

  function toggleMenu(forceClose) {
    const isOpen = drawer.classList.contains("active");
    if (forceClose === true || isOpen) {
      drawer.classList.remove("active");
      toggleBtn.classList.remove("active");
      toggleBtn.setAttribute("aria-expanded", "false");
    } else {
      drawer.classList.add("active");
      toggleBtn.classList.add("active");
      toggleBtn.setAttribute("aria-expanded", "true");
    }
  }

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when tapping a drawer link
  drawer.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      toggleMenu(true);
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleMenu(true);
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleMenu(true);
    }
  });
}

/* ========================================================================
   8. INIT ON PAGE LOAD
   ======================================================================== */
window.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  applyShopConfig();
  populateBrandOptions();
  renderLaptopCards(LAPTOPS_DATA);
  initThreeHero();

  initMobileNav();
  initScrollProgress();
  initCursor();
  initScrollAnimations();

  if (typeof gsap !== "undefined") {
    initLenis();
    runPageLoader();
  } else {
    // GSAP not loaded — show everything immediately
    document.querySelectorAll(".gsap-fade, .why-cyber-tile, .cyber-card").forEach(el => {
      el.style.opacity = "1"; el.style.transform = "none";
    });
  }

  // Safety net: unhide everything after 5s if anything goes wrong
  setTimeout(() => {
    const loader = document.getElementById("page-loader");
    if (loader && loader.style.display !== "none") loader.style.display = "none";
    document.querySelectorAll(".gsap-fade, .why-cyber-tile, .cyber-card").forEach(el => {
      el.style.opacity = "1"; el.style.transform = "translateY(0)";
    });
  }, 5000);
});
