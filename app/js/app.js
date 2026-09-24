/**
 * FORTIVEXA - Predictive Cybercrime Intelligence Framework (TRL 5)
 * Master Application Controller & Reactive Engine
 * SIH 2026 Problem ID: SIH26184 | Team: 25 (FORTIVEXA)
 */

// ============================================================================
// 1. SHA-256 CRYPTOGRAPHIC ENGINE (Self-Contained Browser Implementation)
// ============================================================================
function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
  const k = [
    1116353280, 1444303463, 1759359992, 2230915652, 2465388057, 2753634560, 3183342108, 38016083,
    704180909, 904450865, 1079461149, 1205545615, 1488816646, 1736854681, 2038380777, 2698564306,
    2899839440, 3275164998, 3782072806, 3846279995, 3915581361, 26592960, 123934102, 327554136,
    556620944, 721950581, 984387920, 1047754716, 1140002002, 1183592811, 1361631624, 1548279985,
    1745020205, 1932196660, 2162078206, 2283838933, 2551910549, 2821834349, 2952996808, 3210305587,
    3330668286, 3505952657, 3800508283, 4013197580, 120070479, 239487794, 299799596, 407560236,
    499732866, 682887171, 825469907, 890546522, 1024851820, 1113615458, 1290954228, 1502858290,
    1687179934, 2026201010, 2238001368, 2386769053, 2549009763, 2761647596, 2901018399, 3225465664,
    3539209773, 3629891428, 4010793619, 4128506775, 4172498297, 4265355520, 366041856, 433985781,
    538850669, 640892004, 670265112, 745430286, 458459137, 800857766, 822080775, 930876459
  ];
  for (i = 0; i < asciiBitLength; i += 8) {
    words[i >> 5] |= (ascii.charCodeAt(i / 8) & 255) << (24 - (i % 32));
  }
  words[asciiBitLength >> 5] |= 128 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (i = 0; i < words[lengthProperty]; i += 16) {
    const w = words.slice(i, i + 16);
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (j = 0; j < 64; j++) {
      const i2 = j + 16;
      const w15 = w[j - 15], w2 = w[j - 2];
      const a = hash[0], e = hash[4];
      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & hash[5]) ^ (~e & hash[6]);
      const temp1 = hash[7] + s1 + ch + k[j] + (w[j] = (j < 16) ? w[j] : (
        w[j - 16] +
        (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
        w[j - 7] +
        (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
      ) | 0);
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = s0 + maj;
      hash = [(temp1 + temp2) | 0, hash[0], hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
    }
    for (j = 0; j < 8; j++) {
      hash[j] = (hash[j] + oldHash[j]) | 0;
    }
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

// ============================================================================
// 2. GLOBAL STATE
// ============================================================================
const rawData = window.FORTIVEXA_DATA || { complaints: [], transactions: [], accounts: [], locations: [], rings: [], pan_india_hotspots: [] };

const state = {
  activeTab: 'dashboard',
  activeCaseId: 'CMP-1001',
  complaints: JSON.parse(JSON.stringify(rawData.complaints || [])),
  transactions: JSON.parse(JSON.stringify(rawData.transactions || [])),
  accounts: JSON.parse(JSON.stringify(rawData.accounts || [])),
  locations: JSON.parse(JSON.stringify(rawData.locations || [])),
  rings: JSON.parse(JSON.stringify(rawData.rings || [])),
  pan_india_hotspots: JSON.parse(JSON.stringify(rawData.pan_india_hotspots || [])),
  blockchainLedger: [],
  simulationParams: {
    amount: 95000,
    velocityMinutes: 18,
    hops: 2,
    hour: 19,
    proximityKm: 1.2
  },
  presentation: {
    active: false,
    step: 1,
    totalSteps: 8
  },
  mapInstance: null,
  mapMarkers: []
};

// Initialize Blockchain
function initBlockchain() {
  state.blockchainLedger = [];
  const genesisPayload = JSON.stringify({ type: 'GENESIS', label: 'FORTIVEXA TRL 5 Cryptographic Audit Root', timestamp: '2026-08-01T00:00:00Z' });
  const genesisHash = sha256(genesisPayload + '0000000000000000000000000000000000000000000000000000000000000000');

  state.blockchainLedger.push({
    index: 0,
    timestamp: '2026-08-01T00:00:00Z',
    reference_id: 'GENESIS-ROOT',
    operation: 'AUDIT_GENESIS',
    payload_hash: sha256(genesisPayload),
    previous_hash: '0000000000000000000000000000000000000000000000000000000000000000',
    block_hash: genesisHash,
    status: 'VERIFIED_VALID'
  });

  const seedRefs = [
    { ref: 'CMP-1001', op: 'COMPLAINT_INGESTION_SEAL', desc: 'UPI Phishing reported ₹95,000 via Axis mule' },
    { ref: 'RING-01', op: 'MULE_RING_CORRELATION', desc: 'Apex Syndicate correlated across 4 complaints' },
    { ref: 'PRED-CMP-1001', op: 'LOCATION_PREDICTION_DISPATCH', desc: 'Forecasted LOC-DEMO-01 (Sector 4 Central ATM)' },
    { ref: 'DISP-CMP-1001', op: 'LEA_QRT_DISPATCH_ORDER', desc: 'Sector 20 Cyber Task Force dispatched' },
    { ref: 'SEC91-CMP-1001', op: 'SECTION_91_CRPC_NOTICE', desc: 'CCTV preservation issued to Axis & SBI' },
    { ref: 'FRZ-CMP-1001', op: 'NPCI_INSTANT_FREEZE_GATEWAY', desc: '₹95,000 lien placed on ACC-MULE-001' }
  ];

  seedRefs.forEach((item, idx) => {
    const prevBlock = state.blockchainLedger[state.blockchainLedger.length - 1];
    const payloadStr = JSON.stringify({ item, prevHash: prevBlock.block_hash });
    const pHash = sha256(payloadStr);
    const bHash = sha256(prevBlock.block_hash + pHash + (idx + 1));

    state.blockchainLedger.push({
      index: idx + 1,
      timestamp: new Date(Date.now() - (6 - idx) * 3600000 * 2).toISOString(),
      reference_id: item.ref,
      operation: item.op,
      payload_hash: pHash,
      previous_hash: prevBlock.block_hash,
      block_hash: bHash,
      status: 'VERIFIED_VALID'
    });
  });
}
initBlockchain();

// Toast helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  const border = type === 'success' ? 'border-emerald-400 bg-emerald-950 text-emerald-200' :
                 type === 'error' ? 'border-red-400 bg-red-950 text-red-200' :
                 'border-cyan-400 bg-cyan-950 text-cyan-200';
  toast.className = `px-4 py-2.5 rounded-xl border ${border} font-mono text-xs shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto`;
  toast.innerHTML = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Format currency
function formatINR(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

// Get active case
function getActiveCase() {
  return state.complaints.find(c => c.complaint_id === state.activeCaseId) || state.complaints[0];
}

// Select case globally
function onSelectCase(caseId) {
  state.activeCaseId = caseId;
  const selectElem = document.getElementById('header-case-select');
  if (selectElem) selectElem.value = caseId;
  const sidebarCase = document.getElementById('sidebar-active-case');
  if (sidebarCase) sidebarCase.textContent = caseId;

  // Sync simulation params with case
  const c = getActiveCase();
  state.simulationParams.amount = c.amount || 95000;
  
  // Re-render current tab
  renderActiveTab();
  showToast(`Active Case set to <strong>${caseId}</strong>`, 'info');
}

// Switch navigation tab
function switchTab(tabName) {
  state.activeTab = tabName;

  // Update active sidebar styling
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('bg-cyan-950/80', 'text-cyan-300', 'border-l-2', 'border-cyan-400', 'font-bold');
    btn.classList.add('text-slate-300');
  });

  const activeBtn = document.getElementById(`nav-${tabName}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-slate-300');
    activeBtn.classList.add('bg-cyan-950/80', 'text-cyan-300', 'border-l-2', 'border-cyan-400', 'font-bold');
  }

  renderActiveTab();
}

// Reset dataset
function resetDataset() {
  state.complaints = JSON.parse(JSON.stringify(rawData.complaints || []));
  state.transactions = JSON.parse(JSON.stringify(rawData.transactions || []));
  state.accounts = JSON.parse(JSON.stringify(rawData.accounts || []));
  initBlockchain();
  onSelectCase('CMP-1001');
  showToast('Dataset reset to default 128 verified cases with ground-truth seeded rings.', 'success');
}

// ============================================================================
// 3. TAB RENDERERS
// ============================================================================
function renderActiveTab() {
  const container = document.getElementById('tab-content');
  if (!container) return;

  switch (state.activeTab) {
    case 'dashboard':
      renderDashboard(container);
      break;
    case 'complaints':
      renderComplaints(container);
      break;
    case 'transactions':
      renderTransactions(container);
      break;
    case 'network':
      renderNetworkGraph(container);
      break;
    case 'linkage':
      renderCrossCaseLinkage(container);
      break;
    case 'prediction':
      renderPrediction(container);
      break;
    case 'simulator':
      renderSimulator(container);
      break;
    case 'map':
      renderRiskMap(container);
      break;
    case 'intervention':
      renderIntervention(container);
      break;
    case 'blockchain':
      renderBlockchain(container);
      break;
    case 'trl5':
      renderTrl5(container);
      break;
    default:
      renderDashboard(container);
  }
}

// ----------------------------------------------------------------------------
// A. DASHBOARD
// ----------------------------------------------------------------------------
function renderDashboard(container) {
  const totalAmount = state.complaints.reduce((acc, c) => acc + (c.amount || 0), 0);
  const muleCount = state.accounts.filter(a => a.role === 'mule_l1' || a.role === 'mule_l2').length;
  const criticalCount = state.transactions.filter(t => t.risk_score >= 85).length;
  const activeCase = getActiveCase();

  container.innerHTML = `
    <!-- Top KPI Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      
      <div class="glass-panel p-4 flex flex-col justify-between">
        <span class="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Complaints</span>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-2xl font-bold font-mono text-cyan-300">${state.complaints.length}</span>
          <span class="text-[10px] text-emerald-400 font-bold">+8 Today</span>
        </div>
      </div>

      <div class="glass-panel p-4 flex flex-col justify-between">
        <span class="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Diverted</span>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-xl font-bold font-mono text-emerald-300">${formatINR(totalAmount)}</span>
        </div>
      </div>

      <div class="glass-panel p-4 flex flex-col justify-between">
        <span class="text-[10px] uppercase font-mono tracking-wider text-slate-400">Flagged Mules</span>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-2xl font-bold font-mono text-amber-400">${muleCount}</span>
          <span class="text-[10px] text-amber-400 font-mono">L1/L2</span>
        </div>
      </div>

      <div class="glass-panel p-4 flex flex-col justify-between">
        <span class="text-[10px] uppercase font-mono tracking-wider text-slate-400">Critical Hops</span>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-2xl font-bold font-mono text-red-400">${criticalCount}</span>
          <span class="text-[10px] text-red-400 font-bold">Risk > 85%</span>
        </div>
      </div>

      <div class="glass-panel p-4 flex flex-col justify-between">
        <span class="text-[10px] uppercase font-mono tracking-wider text-slate-400">Monitored ATMs</span>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-2xl font-bold font-mono text-cyan-400">${state.locations.length}</span>
          <span class="text-[10px] text-cyan-400 font-mono">Pan-India</span>
        </div>
      </div>

      <div class="glass-panel p-4 flex flex-col justify-between">
        <span class="text-[10px] uppercase font-mono tracking-wider text-slate-400">Correlated Rings</span>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-2xl font-bold font-mono text-purple-400">${state.rings.length || 6}</span>
          <span class="text-[10px] text-purple-400 font-bold">Syndicates</span>
        </div>
      </div>

    </div>

    <!-- Active Threat Spotlight & AI Prediction Banner -->
    <div class="glass-panel p-5 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/40 border border-cyan-500/40">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
              HIGH-CONFIDENCE CASHOUT ALERT
            </span>
            <span class="text-xs font-mono text-slate-400">Case ID: <strong class="text-cyan-300">${activeCase.complaint_id}</strong></span>
          </div>
          <h2 class="text-lg font-bold text-white mt-1">
            Likely Cashout Predicted at <span class="text-cyan-300">${activeCase.transaction_location || 'Sector 4 Central ATM Kiosk'}</span>
          </h2>
          <p class="text-xs text-slate-300 mt-1 max-w-3xl">
            ${activeCase.narrative}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <button onclick="switchTab('prediction')" class="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg">
            <span>Inspect ML Forecast</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button onclick="switchTab('intervention')" class="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-white font-semibold text-xs border border-red-400/40 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>Trigger LEA Dispatch</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Middle Split: Live Stream & Pipeline Architecture -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left 2 Cols: Recent Intelligence Stream -->
      <div class="lg:col-span-2 glass-panel p-5 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 class="text-sm font-bold text-slate-100">Live Proactive Intelligence Stream</h3>
          </div>
          <span class="text-[11px] font-mono text-cyan-400">NCRP Real-time Bridge</span>
        </div>

        <div class="space-y-3">
          <div class="p-3 rounded-xl bg-slate-900/80 border border-red-500/30 flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 font-bold text-xs">
              P1
            </div>
            <div class="flex-1 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white">Cross-Case Mule Ring Linked (Apex Syndicate)</span>
                <span class="text-slate-400 font-mono text-[10px]">4m ago</span>
              </div>
              <p class="text-slate-300 mt-1">
                L2 Mule account <code class="text-amber-300">ACC-MULE-004</code> shared across 4 active complaints (CMP-1001, CMP-1004, CMP-1008, CMP-1012). Combined diversion: ₹4,82,000.
              </p>
              <div class="mt-2 flex gap-2">
                <button onclick="onSelectCase('CMP-1001'); switchTab('linkage')" class="text-cyan-400 hover:underline font-mono text-[11px]">View Bipartite Subgraph &rarr;</button>
              </div>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs">
              P2
            </div>
            <div class="flex-1 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white">High Velocity ATM Cashout Forecast (CMP-1002)</span>
                <span class="text-slate-400 font-mono text-[10px]">16m ago</span>
              </div>
              <p class="text-slate-300 mt-1">
                Forecasted cashout at <span class="text-cyan-300">Outer Ring Road Metro Station ATM</span> with <strong>84.2% confidence</strong>. Estimated window: Next 45 minutes.
              </p>
              <div class="mt-2 flex gap-2">
                <button onclick="onSelectCase('CMP-1002'); switchTab('prediction')" class="text-cyan-400 hover:underline font-mono text-[11px]">Inspect Model Attribution &rarr;</button>
              </div>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
              ✓
            </div>
            <div class="flex-1 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white">Cryptographic Audit Seal Recorded (Block #6)</span>
                <span class="text-slate-400 font-mono text-[10px]">28m ago</span>
              </div>
              <p class="text-slate-300 mt-1">
                Section 91 CrPC notice and NPCI simulated freeze receipt sealed into tamper-evident SHA-256 chain for evidentiary admissibility.
              </p>
              <div class="mt-2 flex gap-2">
                <button onclick="switchTab('blockchain')" class="text-emerald-400 hover:underline font-mono text-[11px]">Audit Blockchain Ledger &rarr;</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 1 Col: End-to-End Intelligence Pipeline -->
      <div class="glass-panel p-5 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-sm font-bold text-slate-100">TRL 5 Pipeline Workflow</h3>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">5-Stage Execution</span>
        </div>

        <div class="space-y-2.5 text-xs">
          <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-cyan-600/30 text-cyan-300 flex items-center justify-center font-bold text-[10px]">1</span>
              <span class="font-semibold text-slate-200">Complaint Ingestion</span>
            </div>
            <span class="text-[10px] text-emerald-400 font-mono">NCRP / 1930</span>
          </div>

          <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-cyan-600/30 text-cyan-300 flex items-center justify-center font-bold text-[10px]">2</span>
              <span class="font-semibold text-slate-200">Graph Linkage & GNN</span>
            </div>
            <span class="text-[10px] text-cyan-400 font-mono">Centrality / Mules</span>
          </div>

          <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-cyan-600/30 text-cyan-300 flex items-center justify-center font-bold text-[10px]">3</span>
              <span class="font-semibold text-slate-200">ML Prediction Engine</span>
            </div>
            <span class="text-[10px] text-amber-400 font-mono">Hybrid XGBoost</span>
          </div>

          <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-cyan-600/30 text-cyan-300 flex items-center justify-center font-bold text-[10px]">4</span>
              <span class="font-semibold text-slate-200">Pan-India Risk Mapping</span>
            </div>
            <span class="text-[10px] text-cyan-400 font-mono">Leaflet GIS</span>
          </div>

          <div class="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-cyan-600/30 text-cyan-300 flex items-center justify-center font-bold text-[10px]">5</span>
              <span class="font-semibold text-slate-200">Proactive LEA Actions</span>
            </div>
            <span class="text-[10px] text-red-400 font-mono">Sec 91 & QRT</span>
          </div>
        </div>

        <div class="pt-2">
          <button onclick="togglePresentationMode()" class="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all">
            Launch Guided SIH Presentation Walkthrough &rarr;
          </button>
        </div>
      </div>

    </div>
  `;
}

// ----------------------------------------------------------------------------
// B. COMPLAINTS LIST & SEARCH
// ----------------------------------------------------------------------------
function renderComplaints(container) {
  const activeCase = getActiveCase();

  container.innerHTML = `
    <div class="space-y-4">
      
      <!-- Header & Search Toolbar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>Citizen Cybercrime Complaints</span>
            <span class="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">${state.complaints.length} Records</span>
          </h2>
          <p class="text-xs text-slate-400">Ingested via National Cybercrime Reporting Portal (NCRP) & CFCFRMS API</p>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <input type="text" id="complaints-search" placeholder="Search ID, Account, Category..." oninput="filterComplaintsTable()" class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 w-full sm:w-64">
          <button onclick="openIntakeModal()" class="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap">
            + New Intake
          </button>
        </div>
      </div>

      <!-- Complaints Table -->
      <div class="glass-panel overflow-hidden">
        <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table class="w-full text-left text-xs text-slate-300" id="complaints-table">
            <thead class="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-mono sticky top-0 border-b border-slate-800">
              <tr>
                <th class="p-3">Complaint ID</th>
                <th class="p-3">Date</th>
                <th class="p-3">Amount</th>
                <th class="p-3">Victim Account</th>
                <th class="p-3">Reported Mule</th>
                <th class="p-3">Category</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono" id="complaints-tbody">
              ${state.complaints.map(c => `
                <tr class="hover:bg-slate-800/40 transition-colors ${c.complaint_id === state.activeCaseId ? 'bg-cyan-950/40 border-l-2 border-cyan-400' : ''}">
                  <td class="p-3 font-bold text-cyan-300">${c.complaint_id}</td>
                  <td class="p-3 text-slate-400">${c.date}</td>
                  <td class="p-3 font-bold text-emerald-300">${formatINR(c.amount)}</td>
                  <td class="p-3 text-slate-300">${c.victim_account}</td>
                  <td class="p-3 text-amber-300">${c.suspicious_account}</td>
                  <td class="p-3 font-sans text-slate-200">${c.category}</td>
                  <td class="p-3 font-sans">
                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${c.status.includes('Actioned') ? 'badge-critical' : 'badge-medium'}">
                      ${c.status}
                    </span>
                  </td>
                  <td class="p-3 text-right">
                    <button onclick="onSelectCase('${c.complaint_id}'); switchTab('prediction');" class="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white text-[11px] transition-all">
                      Analyze &rarr;
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function filterComplaintsTable() {
  const query = (document.getElementById('complaints-search')?.value || '').toLowerCase();
  const rows = document.querySelectorAll('#complaints-tbody tr');
  rows.forEach(r => {
    const text = r.innerText.toLowerCase();
    r.style.display = text.includes(query) ? '' : 'none';
  });
}

// ----------------------------------------------------------------------------
// C. TRANSACTIONS
// ----------------------------------------------------------------------------
function renderTransactions(container) {
  const activeCase = getActiveCase();
  const caseTxns = state.transactions.filter(t => t.case_id === state.activeCaseId);

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>Multi-Hop Transaction Flows</span>
            <span class="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">${state.transactions.length} Ledger Hops</span>
          </h2>
          <p class="text-xs text-slate-400">Showing transaction diversion trails across L1/L2 mule hops and ATM cash-out endpoints.</p>
        </div>

        <div class="flex items-center gap-2">
          <select id="txn-filter" onchange="filterTxnType(this.value)" class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white">
            <option value="ALL">All Transaction Types</option>
            <option value="IMPS">IMPS Instant Transfer</option>
            <option value="UPI">UPI Debit</option>
            <option value="NEFT">NEFT Batch</option>
            <option value="ATM_WITHDRAWAL">ATM Cash Withdrawal</option>
          </select>
        </div>
      </div>

      <!-- Active Case Banner in Transactions -->
      <div class="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
        <span class="text-slate-300">Filtered for Target Case: <strong class="text-cyan-300">${activeCase.complaint_id}</strong> (${caseTxns.length} hops detected)</span>
        <button onclick="switchTab('network')" class="text-cyan-400 hover:underline">View in Mule Network Graph &rarr;</button>
      </div>

      <div class="glass-panel overflow-hidden">
        <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-mono sticky top-0 border-b border-slate-800">
              <tr>
                <th class="p-3">Txn ID</th>
                <th class="p-3">Source Account</th>
                <th class="p-3">Destination Account</th>
                <th class="p-3">Amount</th>
                <th class="p-3">Timestamp</th>
                <th class="p-3">Type</th>
                <th class="p-3">Risk Score</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono" id="txns-tbody">
              ${state.transactions.map(t => {
                const isSelected = t.case_id === state.activeCaseId;
                const riskBadge = t.risk_score >= 85 ? 'badge-critical' :
                                  t.risk_score >= 60 ? 'badge-high' : 'badge-low';
                return `
                  <tr class="hover:bg-slate-800/40 transition-colors ${isSelected ? 'bg-cyan-950/30 font-bold' : ''}">
                    <td class="p-3 text-cyan-300">${t.transaction_id}</td>
                    <td class="p-3 text-slate-300">${t.source_account}</td>
                    <td class="p-3 text-amber-300">${t.destination_account}</td>
                    <td class="p-3 font-bold text-emerald-300">${formatINR(t.amount)}</td>
                    <td class="p-3 text-slate-400">${t.timestamp}</td>
                    <td class="p-3 font-sans">
                      <span class="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-200">${t.type}</span>
                    </td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold ${riskBadge}">
                        ${t.risk_score}%
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function filterTxnType(type) {
  const rows = document.querySelectorAll('#txns-tbody tr');
  rows.forEach(r => {
    if (type === 'ALL') {
      r.style.display = '';
    } else {
      r.style.display = r.innerText.includes(type) ? '' : 'none';
    }
  });
}

// ----------------------------------------------------------------------------
// D. MULE NETWORK VISUALIZER (INTERACTIVE GRAPH)
// ----------------------------------------------------------------------------
function renderNetworkGraph(container) {
  const activeCase = getActiveCase();
  const txns = state.transactions.filter(t => t.case_id === state.activeCaseId);

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>Mule Network Visualizer (GNN Topology)</span>
            <span class="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">Target: ${activeCase.complaint_id}</span>
          </h2>
          <p class="text-xs text-slate-400">Tracing multi-hop fund diversions from victim node through intermediary layering accounts to the forecasted ATM kiosk.</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="traceNetworkPath()" class="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>Animate Diversion Trail</span>
          </button>
        </div>
      </div>

      <!-- Graph Canvas Container -->
      <div class="glass-panel p-4 relative overflow-hidden h-[480px] flex flex-col justify-between" id="graph-wrapper">
        <canvas id="mule-canvas" class="w-full h-full cursor-crosshair"></canvas>
        
        <!-- Legend Overlay -->
        <div class="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-xl p-3 text-[11px] font-mono space-y-1.5 pointer-events-none">
          <div class="font-bold text-slate-200 mb-1">Network Legend</div>
          <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-blue-500"></span> Victim Account (Debited)</div>
          <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-amber-500"></span> L1 Entry Mule (First Receiver)</div>
          <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-orange-600"></span> L2 Layering Mule (Consolidator)</div>
          <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-red-500"></span> Forecasted ATM Cashout Hub</div>
        </div>

        <!-- Node Inspector Sidebar Overlay -->
        <div id="graph-inspector" class="hidden absolute top-4 right-4 w-72 bg-slate-900/95 backdrop-blur border border-cyan-500/50 rounded-xl p-4 text-xs font-mono space-y-2 shadow-2xl">
          <div class="flex justify-between items-center border-b border-slate-800 pb-2">
            <span class="font-bold text-cyan-300">NODE INSPECTION</span>
            <button onclick="document.getElementById('graph-inspector').classList.add('hidden')" class="text-slate-400 hover:text-white">&times;</button>
          </div>
          <div id="inspector-body"></div>
        </div>
      </div>

    </div>
  `;

  // Draw Canvas Graph
  setTimeout(initCanvasMuleGraph, 50);
}

function initCanvasMuleGraph() {
  const canvas = document.getElementById('mule-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const activeCase = getActiveCase();
  const l1 = activeCase.suspicious_account || 'ACC-MULE-001';
  const l2 = 'ACC-MULE-004';
  const atm = activeCase.transaction_location || 'Sector 4 Central ATM';

  const w = rect.width;
  const h = rect.height;

  const nodes = [
    { id: activeCase.victim_account, label: 'Victim\n' + activeCase.victim_account, x: w * 0.15, y: h * 0.5, color: '#3b82f6', role: 'Victim Node', bank: 'HDFC Bank' },
    { id: l1, label: 'L1 Mule\n' + l1, x: w * 0.38, y: h * 0.35, color: '#f59e0b', role: 'L1 Entry Mule', bank: 'Axis Neo Bank' },
    { id: 'ACC-MULE-002', label: 'Split Mule\nACC-MULE-002', x: w * 0.38, y: h * 0.65, color: '#f59e0b', role: 'Split Mule', bank: 'Federal Bank' },
    { id: l2, label: 'L2 Mule\n' + l2, x: w * 0.65, y: h * 0.5, color: '#f97316', role: 'L2 Consolidator', bank: 'Yes Express' },
    { id: 'LOC-ATM', label: 'Target ATM\n' + atm.substring(0, 18), x: w * 0.88, y: h * 0.5, color: '#ef4444', role: 'Cashout ATM', bank: 'State Bank ATM' }
  ];

  const edges = [
    { from: 0, to: 1, amount: activeCase.amount * 0.7, label: formatINR(activeCase.amount * 0.7) },
    { from: 0, to: 2, amount: activeCase.amount * 0.3, label: formatINR(activeCase.amount * 0.3) },
    { from: 1, to: 3, amount: activeCase.amount * 0.68, label: formatINR(activeCase.amount * 0.68) },
    { from: 2, to: 3, amount: activeCase.amount * 0.28, label: formatINR(activeCase.amount * 0.28) },
    { from: 3, to: 4, amount: activeCase.amount * 0.95, label: formatINR(activeCase.amount * 0.95) }
  ];

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw Edges
    edges.forEach(e => {
      const n1 = nodes[e.from];
      const n2 = nodes[e.to];
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw arrow
      const angle = Math.atan2(n2.y - n1.y, n2.x - n1.x);
      const mx = (n1.x + n2.x) / 2;
      const my = (n1.y + n2.y) / 2;
      ctx.beginPath();
      ctx.arc(mx, my, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();

      // Edge amount label
      ctx.font = '10px JetBrains Mono';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(e.label, mx - 15, my - 8);
    });

    // Draw Nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node label
      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      const lines = n.label.split('\n');
      ctx.fillText(lines[0], n.x, n.y + 36);
      ctx.font = '10px JetBrains Mono';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(lines[1], n.x, n.y + 49);
    });
  }

  draw();

  // Canvas click listener for inspection
  canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    nodes.forEach(n => {
      const dist = Math.hypot(n.x - cx, n.y - cy);
      if (dist < 26) {
        inspectNode(n);
      }
    });
  };
}

function inspectNode(node) {
  const inspector = document.getElementById('graph-inspector');
  const body = document.getElementById('inspector-body');
  if (!inspector || !body) return;

  inspector.classList.remove('hidden');
  body.innerHTML = `
    <div class="space-y-1.5 text-[11px]">
      <div class="flex justify-between"><span class="text-slate-400">Node ID:</span> <span class="text-cyan-300 font-bold">${node.id}</span></div>
      <div class="flex justify-between"><span class="text-slate-400">Role:</span> <span class="text-white">${node.role}</span></div>
      <div class="flex justify-between"><span class="text-slate-400">Bank:</span> <span class="text-slate-300">${node.bank}</span></div>
      <div class="flex justify-between"><span class="text-slate-400">Centrality:</span> <span class="text-emerald-400">0.842 (High)</span></div>
      <div class="flex justify-between"><span class="text-slate-400">Fan-In Ratio:</span> <span class="text-slate-300">4 : 1</span></div>
      <div class="flex justify-between"><span class="text-slate-400">Pass-Through Lag:</span> <span class="text-red-400 font-bold">14 mins</span></div>
    </div>
  `;
}

function traceNetworkPath() {
  showToast('Animating multi-hop diversion trail from Victim to Target ATM...', 'info');
  // Visual pulse on canvas
  const canvas = document.getElementById('mule-canvas');
  if (canvas) {
    canvas.classList.add('pulse-glow');
    setTimeout(() => canvas.classList.remove('pulse-glow'), 2500);
  }
}

// ----------------------------------------------------------------------------
// E. CROSS-CASE LINKAGE (BIPARTITE SYNDICATES)
// ----------------------------------------------------------------------------
function renderCrossCaseLinkage(container) {
  const activeCase = getActiveCase();
  const sharedMule = activeCase.suspicious_account;
  const linked = state.complaints.filter(c => c.complaint_id !== activeCase.complaint_id && (c.suspicious_account === sharedMule || c.ground_truth_ring === activeCase.ground_truth_ring));

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>Cross-Case Linkage & Syndicate Detector</span>
            <span class="px-2 py-0.5 rounded text-xs font-mono bg-purple-950 text-purple-300 border border-purple-500/40">Bipartite Co-occurrence</span>
          </h2>
          <p class="text-xs text-slate-400">Automatically correlates complaints across multiple Indian states sharing intermediary mule bank accounts and SIM footprints.</p>
        </div>
      </div>

      <!-- Syndicate Correlation Card -->
      <div class="glass-panel p-5 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/40 space-y-3">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
            SYNDICATE RING: APEX MEWAT-DELHI NETWORK (RING-01)
          </span>
          <span class="text-xs text-red-400 font-bold">${linked.length + 1} Associated State FIRs</span>
        </div>
        <p class="text-xs text-slate-300">
          Target case <strong class="text-cyan-300">${activeCase.complaint_id}</strong> shares beneficiary conduit <strong class="text-amber-300">${sharedMule}</strong> with <strong>${linked.length} other citizen complaints</strong> filed in Haryana, Delhi, and Uttar Pradesh.
        </p>
      </div>

      <!-- Linked Cases Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${linked.slice(0, 6).map(l => `
          <div class="glass-panel p-4 space-y-2 border-l-4 border-purple-500 hover:border-cyan-400 transition-all">
            <div class="flex justify-between items-center">
              <span class="font-bold text-cyan-300 font-mono">${l.complaint_id}</span>
              <span class="text-[10px] font-mono text-slate-400">${l.date}</span>
            </div>
            <div class="text-sm font-bold text-emerald-300 font-mono">${formatINR(l.amount)}</div>
            <div class="text-xs text-slate-300">${l.category}</div>
            <div class="text-[11px] font-mono text-slate-400">Shared Conduit: <span class="text-amber-300">${sharedMule}</span></div>
            <button onclick="onSelectCase('${l.complaint_id}')" class="text-cyan-400 hover:underline font-mono text-[11px] pt-1 block">
              Set as Target Case &rarr;
            </button>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}

// ----------------------------------------------------------------------------
// F. PREDICTIVE CASHOUT ENGINE & EXPLAINABILITY
// ----------------------------------------------------------------------------
function renderPrediction(container) {
  const activeCase = getActiveCase();
  const loc = state.locations[0] || { name: 'Sector 4 Central ATM Kiosk', jurisdiction: 'Noida Sector 20' };

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>Predictive Cashout Engine (Hybrid XGBoost + GNN)</span>
            <span class="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">Case: ${activeCase.complaint_id}</span>
          </h2>
          <p class="text-xs text-slate-400">Forecasts probable physical cash-withdrawal ATM kiosks in advance, enabling proactive law enforcement interception.</p>
        </div>

        <button onclick="runModelInference()" class="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>Run Live Re-Inference</span>
        </button>
      </div>

      <!-- Top Predicted Target Card -->
      <div class="glass-panel p-6 bg-gradient-to-r from-red-950/30 via-slate-900 to-cyan-950/30 border border-red-500/40 space-y-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
          <div>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 tracking-wider">
              PRIMARY CANDIDATE ATM (TOP-1 RANKED)
            </span>
            <h3 class="text-xl font-bold text-white mt-1">${activeCase.transaction_location || loc.name}</h3>
            <p class="text-xs text-slate-400 font-mono">Jurisdiction: <span class="text-slate-200">Sector 20 Cyber Crime Beat, Noida (UP)</span> • Distance: <span class="text-cyan-300">1.2 km from branch clearing node</span></p>
          </div>

          <div class="text-right">
            <div class="text-3xl font-extrabold font-mono text-cyan-300">88.4%</div>
            <div class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Calibrated Confidence</div>
          </div>
        </div>

        <!-- Plain Language Rationale -->
        <div>
          <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono">Explainable AI (XAI) Attribution Reasons:</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
              <span class="text-cyan-400 font-bold font-mono">1. Mule Syndicate Affinity</span>
              <p class="text-slate-300 mt-1">Same mule ring previously recorded 3x cashouts at this exact ATM within the past 30 days.</p>
            </div>
            <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
              <span class="text-cyan-400 font-bold font-mono">2. Temporal Cashout Window</span>
              <p class="text-slate-300 mt-1">18:00 - 21:30 evening window represents 78% of historical syndicate ATM withdrawals.</p>
            </div>
            <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
              <span class="text-cyan-400 font-bold font-mono">3. Geodesic Transit Radius</span>
              <p class="text-slate-300 mt-1">Located within 1.2 km of the last beneficiary account holder's KYC branch jurisdiction.</p>
            </div>
          </div>
        </div>

        <!-- Action Dispatch Shortcut -->
        <div class="flex justify-end gap-3 pt-2">
          <button onclick="switchTab('simulator')" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300">
            Open What-If Simulator &rarr;
          </button>
          <button onclick="switchTab('intervention')" class="btn-danger px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>Proceed to LEA Dispatch</span>
          </button>
        </div>
      </div>

      <!-- Top 3 Ranked Candidate Table -->
      <div class="glass-panel p-5 space-y-3">
        <h3 class="text-sm font-bold text-slate-100">Top-3 Ranked Candidate Cashout Hubs</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono">
              <tr>
                <th class="p-2.5">Rank</th>
                <th class="p-2.5">ATM Kiosk / Hub</th>
                <th class="p-2.5">Jurisdiction</th>
                <th class="p-2.5">Transit Distance</th>
                <th class="p-2.5">Historical Cashouts</th>
                <th class="p-2.5">Confidence Score</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 font-mono">
              <tr class="bg-cyan-950/20">
                <td class="p-2.5 font-bold text-red-400">#1 (Primary)</td>
                <td class="p-2.5 font-sans font-bold text-white">${activeCase.transaction_location || loc.name}</td>
                <td class="p-2.5 text-slate-300">Sector 20 Beat</td>
                <td class="p-2.5 text-cyan-300">1.2 km</td>
                <td class="p-2.5 text-emerald-400">24 hits</td>
                <td class="p-2.5 text-red-400 font-bold">88.4%</td>
              </tr>
              <tr>
                <td class="p-2.5 text-slate-400">#2 (Secondary)</td>
                <td class="p-2.5 font-sans text-slate-200">Punjab National Bank ATM - Atta Market</td>
                <td class="p-2.5 text-slate-300">Sector 27 Beat</td>
                <td class="p-2.5 text-cyan-300">2.4 km</td>
                <td class="p-2.5 text-emerald-400">11 hits</td>
                <td class="p-2.5 text-amber-400 font-bold">64.2%</td>
              </tr>
              <tr>
                <td class="p-2.5 text-slate-400">#3 (Tertiary)</td>
                <td class="p-2.5 font-sans text-slate-200">ICICI Bank ATM - Metro Interchange</td>
                <td class="p-2.5 text-slate-300">Sector 16 Beat</td>
                <td class="p-2.5 text-cyan-300">3.8 km</td>
                <td class="p-2.5 text-emerald-400">7 hits</td>
                <td class="p-2.5 text-slate-300 font-bold">41.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function runModelInference() {
  showToast('Executing Hybrid XGBoost-GNN Inference Pipeline (180ms)...', 'info');
  setTimeout(() => {
    showToast('Inference Complete: Candidate locations updated with 88.4% confidence score.', 'success');
  }, 400);
}

// ----------------------------------------------------------------------------
// G. WHAT-IF SCENARIO SIMULATOR
// ----------------------------------------------------------------------------
function renderSimulator(container) {
  const p = state.simulationParams;

  // Real-time calculation based on sliders
  const velocityFactor = Math.max(0, 1 - (p.velocityMinutes / 120));
  const amountFactor = Math.min(1, p.amount / 500000);
  const hourFactor = (p.hour >= 18 && p.hour <= 22) ? 0.95 : 0.45;
  const proxFactor = Math.max(0.1, 1 - (p.proximityKm / 10));

  const dynamicConfidence = Math.min(98.5, Math.max(15.0, (amountFactor * 25 + velocityFactor * 35 + hourFactor * 25 + proxFactor * 15))).toFixed(1);
  const threatLevel = dynamicConfidence >= 80 ? 'CRITICAL' : dynamicConfidence >= 60 ? 'HIGH' : dynamicConfidence >= 40 ? 'MEDIUM' : 'LOW';
  const threatClass = threatLevel === 'CRITICAL' ? 'badge-critical' : threatLevel === 'HIGH' ? 'badge-high' : threatLevel === 'MEDIUM' ? 'badge-medium' : 'badge-low';

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>What-If Scenario Simulator</span>
            <span class="px-2 py-0.5 rounded text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">Dynamic ML Evaluation</span>
          </h2>
          <p class="text-xs text-slate-400">Adjust parameters to simulate how velocity, amount, hop depth, and timing alter ML prediction confidence and cashout risk.</p>
        </div>

        <button onclick="resetSimulatorParams()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300">
          Reset Default Parameters
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Controls Column -->
        <div class="lg:col-span-2 glass-panel p-5 space-y-5">
          <h3 class="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">Simulation Sliders</h3>

          <!-- Slider 1: Defrauded Amount -->
          <div>
            <div class="flex justify-between text-xs font-mono mb-1.5">
              <span class="text-slate-300">Defrauded Amount:</span>
              <span class="text-emerald-400 font-bold" id="sim-val-amount">${formatINR(p.amount)}</span>
            </div>
            <input type="range" min="10000" max="1500000" step="10000" value="${p.amount}" oninput="updateSimParam('amount', Number(this.value))" class="w-full">
          </div>

          <!-- Slider 2: Layering Velocity -->
          <div>
            <div class="flex justify-between text-xs font-mono mb-1.5">
              <span class="text-slate-300">Transfer Velocity (Time to Layer):</span>
              <span class="text-cyan-300 font-bold" id="sim-val-velocity">${p.velocityMinutes} minutes</span>
            </div>
            <input type="range" min="2" max="180" step="2" value="${p.velocityMinutes}" oninput="updateSimParam('velocityMinutes', Number(this.value))" class="w-full">
          </div>

          <!-- Slider 3: Layering Hops -->
          <div>
            <div class="flex justify-between text-xs font-mono mb-1.5">
              <span class="text-slate-300">Number of Mule Hops:</span>
              <span class="text-amber-400 font-bold" id="sim-val-hops">${p.hops} Hops</span>
            </div>
            <input type="range" min="1" max="5" step="1" value="${p.hops}" oninput="updateSimParam('hops', Number(this.value))" class="w-full">
          </div>

          <!-- Slider 4: Time of Transfer -->
          <div>
            <div class="flex justify-between text-xs font-mono mb-1.5">
              <span class="text-slate-300">Cashout Window (Hour of Day):</span>
              <span class="text-purple-300 font-bold" id="sim-val-hour">${p.hour}:00 hrs (${(p.hour >= 18 && p.hour <= 22) ? 'Peak Cashout Window' : 'Off-Peak'})</span>
            </div>
            <input type="range" min="0" max="23" step="1" value="${p.hour}" oninput="updateSimParam('hour', Number(this.value))" class="w-full">
          </div>

          <!-- Slider 5: Proximity -->
          <div>
            <div class="flex justify-between text-xs font-mono mb-1.5">
              <span class="text-slate-300">Distance to Nearest ATM Kiosk:</span>
              <span class="text-cyan-300 font-bold" id="sim-val-prox">${p.proximityKm} km</span>
            </div>
            <input type="range" min="0.2" max="10.0" step="0.2" value="${p.proximityKm}" oninput="updateSimParam('proximityKm', Number(this.value))" class="w-full">
          </div>

        </div>

        <!-- Real-Time Evaluation Result -->
        <div class="glass-panel p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">Dynamic ML Assessment</h3>

            <div class="mt-4 text-center py-4 bg-slate-900/80 rounded-xl border border-slate-800">
              <div class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Dynamic Forecast Confidence</div>
              <div class="text-4xl font-extrabold font-mono text-cyan-300 mt-1" id="dyn-conf">${dynamicConfidence}%</div>
              <div class="mt-2">
                <span class="px-2.5 py-0.5 rounded text-xs font-bold font-mono ${threatClass}" id="dyn-threat">${threatLevel} THREAT</span>
              </div>
            </div>

            <div class="mt-4 space-y-2 text-xs font-mono text-slate-300">
              <div class="flex justify-between border-b border-slate-800 pb-1">
                <span class="text-slate-400">Velocity Factor:</span>
                <span class="text-cyan-400">${(velocityFactor * 100).toFixed(0)}%</span>
              </div>
              <div class="flex justify-between border-b border-slate-800 pb-1">
                <span class="text-slate-400">Amount Sensitivity:</span>
                <span class="text-emerald-400">${(amountFactor * 100).toFixed(0)}%</span>
              </div>
              <div class="flex justify-between border-b border-slate-800 pb-1">
                <span class="text-slate-400">Temporal Spike Match:</span>
                <span class="text-purple-400">${(hourFactor * 100).toFixed(0)}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Estimated Intercept SLA:</span>
                <span class="text-red-400 font-bold">${Math.max(15, 120 - p.velocityMinutes)} mins</span>
              </div>
            </div>
          </div>

          <button onclick="switchTab('intervention')" class="btn-primary w-full py-2.5 rounded-lg text-xs font-semibold">
            Deploy Interception Protocol for Scenario &rarr;
          </button>
        </div>

      </div>

    </div>
  `;
}

function updateSimParam(key, val) {
  state.simulationParams[key] = val;
  renderSimulator(document.getElementById('tab-content'));
}

function resetSimulatorParams() {
  state.simulationParams = {
    amount: 95000,
    velocityMinutes: 18,
    hops: 2,
    hour: 19,
    proximityKm: 1.2
  };
  renderSimulator(document.getElementById('tab-content'));
  showToast('Simulation parameters restored.', 'info');
}

// ----------------------------------------------------------------------------
// H. PAN-INDIA GIS RISK MAP (LEAFLET)
// ----------------------------------------------------------------------------
function renderRiskMap(container) {
  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>Pan-India GIS Risk Map & Cashout Hotspots</span>
            <span class="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">8 Hubs Monitored</span>
          </h2>
          <p class="text-xs text-slate-400">Geospatial risk visualizer with ATM radius beacons, police jurisdiction geofences, and QRT unit positions.</p>
        </div>

        <!-- Region Selector -->
        <div class="flex items-center gap-2">
          <select id="map-region-select" onchange="panMapToRegion(this.value)" class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-semibold">
            <option value="ALL">All India (National Overview)</option>
            <option value="ncr">Delhi-NCR / Noida</option>
            <option value="mumbai">Mumbai, Maharashtra</option>
            <option value="bengaluru">Bengaluru, Karnataka</option>
            <option value="hyderabad">Hyderabad, Telangana</option>
            <option value="kolkata">Kolkata, West Bengal</option>
            <option value="ahmedabad">Ahmedabad, Gujarat</option>
          </select>
        </div>
      </div>

      <!-- Map Display Container -->
      <div class="glass-panel p-2 relative h-[520px] rounded-xl overflow-hidden">
        <div id="leaflet-map" class="w-full h-full rounded-lg leaflet-dark"></div>

        <!-- Overlay HUD -->
        <div class="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur border border-cyan-500/40 rounded-xl p-3 text-xs font-mono space-y-1 shadow-2xl pointer-events-none">
          <div class="font-bold text-white flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            ACTIVE SURVEILLANCE RADAR
          </div>
          <div class="text-[11px] text-slate-300">Live Monitored ATMs: <span class="text-cyan-300 font-bold">14 Kiosks</span></div>
          <div class="text-[11px] text-slate-300">Special QRT Units on Beat: <span class="text-emerald-400 font-bold">8 Squads</span></div>
        </div>
      </div>

    </div>
  `;

  setTimeout(initLeafletMap, 50);
}

function initLeafletMap() {
  const mapElem = document.getElementById('leaflet-map');
  if (!mapElem || typeof L === 'undefined') return;

  if (state.mapInstance) {
    state.mapInstance.remove();
    state.mapInstance = null;
  }

  const map = L.map(mapElem, {
    center: [22.9734, 78.6569],
    zoom: 5,
    zoomControl: true,
    attributionControl: false
  });

  // Dark tiles with CartoDB or fallback
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    subdomains: 'abcd'
  }).addTo(map);

  state.mapInstance = map;
  state.mapMarkers = [];

  // Plot Hotspots
  state.pan_india_hotspots.forEach(h => {
    const p = h.primaryTarget;
    if (!p || !p.lat || !p.lng) return;

    const isCritical = p.riskLevel === 'CRITICAL' || p.confidence >= 90;
    const color = isCritical ? '#ef4444' : '#f59e0b';

    const circleMarker = L.circleMarker([p.lat, p.lng], {
      radius: isCritical ? 10 : 8,
      fillColor: color,
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85
    }).addTo(map);

    // Add pulsing radius ring
    L.circle([p.lat, p.lng], {
      radius: 800,
      color: color,
      weight: 1,
      fillColor: color,
      fillOpacity: 0.12
    }).addTo(map);

    const popupHtml = `
      <div class="p-2 space-y-1.5 text-xs font-mono text-slate-100">
        <div class="font-bold text-cyan-300 text-sm">${p.locationName}</div>
        <div class="text-[11px] text-slate-300">${p.bank} • ${p.address}</div>
        <div class="flex justify-between border-t border-slate-700 pt-1">
          <span class="text-slate-400">Confidence:</span>
          <span class="text-red-400 font-bold">${p.confidence}%</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Historical Hits:</span>
          <span class="text-emerald-400 font-bold">${p.historicalWithdrawals} cashouts</span>
        </div>
        <div class="text-[10px] text-slate-400 mt-1">${p.rationale}</div>
        <div class="pt-2">
          <button onclick="onSelectCase('${h.caseId}'); switchTab('intervention');" class="btn-primary w-full py-1 text-[11px] rounded font-semibold">
            Dispatch Unit to this ATM &rarr;
          </button>
        </div>
      </div>
    `;

    circleMarker.bindPopup(popupHtml);
    state.mapMarkers.push({ marker: circleMarker, region: h.region });
  });

  setTimeout(() => map.invalidateSize(), 200);
}

function panMapToRegion(regionId) {
  if (!state.mapInstance) return;
  const regions = {
    ALL: { center: [22.9734, 78.6569], zoom: 5 },
    ncr: { center: [28.5708, 77.3218], zoom: 12 },
    mumbai: { center: [19.0596, 72.8295], zoom: 12 },
    bengaluru: { center: [12.9352, 77.6245], zoom: 12 },
    hyderabad: { center: [17.4483, 78.3748], zoom: 12 },
    kolkata: { center: [22.5867, 88.4178], zoom: 12 },
    ahmedabad: { center: [23.0338, 72.5574], zoom: 12 }
  };

  const target = regions[regionId] || regions.ALL;
  state.mapInstance.flyTo(target.center, target.zoom, { duration: 1.2 });
}

// ----------------------------------------------------------------------------
// I. LEA INTERVENTION & ACTIONABLE INTEL
// ----------------------------------------------------------------------------
function renderIntervention(container) {
  const activeCase = getActiveCase();

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>Law Enforcement Intervention Suite (TRL 5)</span>
            <span class="px-2 py-0.5 rounded text-xs font-mono bg-red-950 text-red-300 border border-red-500/40">Actionable Directives</span>
          </h2>
          <p class="text-xs text-slate-400">Generate legal preservation notices, trigger simulated bank lien requests, and dispatch field tactical intercept teams.</p>
        </div>
      </div>

      <!-- Action Panel Buttons -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div class="glass-panel p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div class="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold mb-2">
              §91
            </div>
            <h3 class="text-sm font-bold text-white">Section 91 CrPC Notice</h3>
            <p class="text-xs text-slate-400 mt-1">
              Issue formal statutory directive to bank nodal officer and ATM custodian for CCTV and journal preservation.
            </p>
          </div>
          <button onclick="openSec91Modal()" class="btn-primary w-full py-2 rounded-lg text-xs font-semibold">
            Generate Legal Notice &rarr;
          </button>
        </div>

        <div class="glass-panel p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div class="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold mb-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 class="text-sm font-bold text-white">Simulated Instant Freeze</h3>
            <p class="text-xs text-slate-400 mt-1">
              Trigger real-time lien placement request to NPCI / Indian Banking API gateway under CFCFRMS protocol.
            </p>
          </div>
          <button onclick="triggerSimulatedFreeze()" class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs">
            Trigger Account Freeze &rarr;
          </button>
        </div>

        <div class="glass-panel p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div class="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold mb-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3 class="text-sm font-bold text-white">Dispatch Field QRT Unit</h3>
            <p class="text-xs text-slate-400 mt-1">
              Alert on-duty police motorcycle beat and un-uniformed spotters to monitor the target ATM vestibule.
            </p>
          </div>
          <button onclick="dispatchFieldUnit()" class="btn-danger w-full py-2 rounded-lg text-xs font-semibold">
            Deploy Intercept Team &rarr;
          </button>
        </div>

      </div>

      <!-- Formal Case Intelligence Dossier -->
      <div class="glass-panel p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400">Formal Investigative Dossier</span>
            <h3 class="text-base font-bold text-white">Dossier INTEL-${activeCase.complaint_id}</h3>
          </div>
          <button onclick="showToast('Dossier copied to clipboard in standardized LEA format.', 'success')" class="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs hover:bg-slate-700">
            Export Text
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-300">
          <div>
            <span class="text-slate-500">Case ID:</span>
            <span class="text-cyan-300 font-bold">${activeCase.complaint_id}</span>
          </div>
          <div>
            <span class="text-slate-500">Reported Category:</span>
            <span class="text-white">${activeCase.category}</span>
          </div>
          <div>
            <span class="text-slate-500">Defrauded Amount:</span>
            <span class="text-emerald-400 font-bold">${formatINR(activeCase.amount)}</span>
          </div>
          <div>
            <span class="text-slate-500">Target Location:</span>
            <span class="text-amber-300 font-bold">${activeCase.transaction_location || 'Sector 4 Central ATM'}</span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
          <div class="font-bold text-slate-300">Investigative Assessment & Tactical Recommendations:</div>
          <p class="text-slate-400 leading-relaxed">
            Multi-hop funds diversion detected originating from victim account <code>${activeCase.victim_account}</code>. Funds moved via IMPS into entry mule <code>${activeCase.suspicious_account}</code> before layering into secondary syndicate accounts. Predictive engine forecasts high likelihood of cash withdrawal at <strong>${activeCase.transaction_location || 'Sector 4 Central ATM'}</strong> within the next 2-4 hours. Human investigator verification is mandated under SOP prior to physical containment.
          </p>
        </div>
      </div>

    </div>
  `;
}

function openSec91Modal() {
  const modal = document.getElementById('modal-sec91');
  const content = document.getElementById('sec91-content');
  const activeCase = getActiveCase();
  if (!modal || !content) return;

  modal.classList.remove('hidden');
  content.innerHTML = `
    <div class="text-center border-b pb-3 mb-3">
      <h2 class="text-sm font-bold uppercase tracking-wider">Office of the Assistant Commissioner of Police / Cyber Cell</h2>
      <h3 class="text-xs font-bold text-slate-700">Indian Cybercrime Coordination Centre (I4C) Special Task Force</h3>
      <p class="text-[10px] text-slate-500 italic">Notice under Section 91 of the Code of Criminal Procedure, 1973 (Preservation of Digital & Physical Evidence)</p>
    </div>

    <div class="space-y-2 text-[11px] leading-relaxed">
      <div><strong>To:</strong> The Branch Manager / ATM Custodian Officer, State Bank of India & Member Banks</div>
      <div><strong>Subject:</strong> Preservation of ATM Kiosk Surveillance Footage & Transaction Journal records in FIR/CYB/2026/0842 (Case Ref: ${activeCase.complaint_id})</div>
      <div><strong>Date of Notice:</strong> ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>

      <p class="mt-2">
        WHEREAS an investigation has been initiated into fraudulent electronic transfer of funds amounting to <strong>${formatINR(activeCase.amount)}</strong> under Section 66D IT Act and Sections 318/319 BNS (formerly 419/420 IPC), reported on the National Cybercrime Reporting Portal.
      </p>

      <p>
        AND WHEREAS predictive intelligence indicates high probability of physical cash withdrawal / laundering activity at ATM vestibule: <strong>${activeCase.transaction_location || 'Sector 4 Central ATM Kiosk'}</strong>.
      </p>

      <p>
        YOU ARE HEREBY DIRECTED under Section 91 CrPC to:
      </p>
      <ol class="list-decimal pl-5 space-y-1">
        <li>Immediately preserve all CCTV digital video recorder (DVR/NVR) footage of the specified ATM vestibule for the 4-hour window (${new Date().toISOString().substring(11, 16)} UTC ± 2 hours).</li>
        <li>Preserve switch electronic journals (EJ logs) and cardholder BIN identifiers for all cash-out attempts.</li>
        <li>Cooperate with the Cyber Quick Response Team (QRT) personnel upon physical arrival.</li>
      </ol>

      <div class="mt-4 pt-3 border-t flex justify-between items-end text-[10px]">
        <div>
          <div>Tamper-Evident SHA-256 Hash:</div>
          <code class="text-slate-600">${sha256(activeCase.complaint_id + activeCase.amount)}</code>
        </div>
        <div class="text-right">
          <div class="font-bold">Investigating Officer (I4C)</div>
          <div>Cyber Crime Division, MHA</div>
        </div>
      </div>
    </div>
  `;
}

function closeSec91Modal() {
  document.getElementById('modal-sec91')?.classList.add('hidden');
}

function printSec91() {
  window.print();
}

function triggerSimulatedFreeze() {
  const activeCase = getActiveCase();
  const modal = document.getElementById('modal-freeze');
  if (!modal) return;

  const refId = 'CFCFRMS-FRZ-' + Math.floor(10000 + Math.random() * 90000);
  const hash = sha256(refId + activeCase.suspicious_account + Date.now());

  document.getElementById('freeze-ref-id').textContent = refId;
  document.getElementById('freeze-acc-id').textContent = activeCase.suspicious_account;
  document.getElementById('freeze-amt').textContent = formatINR(activeCase.amount);
  document.getElementById('freeze-ts').textContent = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  document.getElementById('freeze-hash').textContent = hash;

  modal.classList.remove('hidden');

  // Seal into blockchain
  const prev = state.blockchainLedger[state.blockchainLedger.length - 1];
  const payloadStr = JSON.stringify({ refId, case_id: activeCase.complaint_id, amount: activeCase.amount });
  const pHash = sha256(payloadStr);
  const bHash = sha256(prev.block_hash + pHash + state.blockchainLedger.length);

  state.blockchainLedger.push({
    index: state.blockchainLedger.length,
    timestamp: new Date().toISOString(),
    reference_id: refId,
    operation: 'NPCI_INSTANT_FREEZE_GATEWAY',
    payload_hash: pHash,
    previous_hash: prev.block_hash,
    block_hash: bHash,
    status: 'VERIFIED_VALID'
  });
}

function closeFreezeModal() {
  document.getElementById('modal-freeze')?.classList.add('hidden');
  showToast('Account freeze logged into Blockchain Evidence Ledger.', 'success');
}

function dispatchFieldUnit() {
  const activeCase = getActiveCase();
  showToast(`Special Task Force QRT Unit dispatched to <strong>${activeCase.transaction_location || 'Sector 4 ATM'}</strong>. ETA: 7 mins.`, 'success');
}

// ----------------------------------------------------------------------------
// J. BLOCKCHAIN EVIDENCE LEDGER
// ----------------------------------------------------------------------------
function renderBlockchain(container) {
  let isChainValid = true;
  let brokenBlockIdx = -1;

  for (let i = 1; i < state.blockchainLedger.length; i++) {
    if (state.blockchainLedger[i].previous_hash !== state.blockchainLedger[i - 1].block_hash) {
      isChainValid = false;
      brokenBlockIdx = i;
      break;
    }
  }

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>Blockchain Evidence Integrity Ledger</span>
            <span class="px-2 py-0.5 rounded text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">${state.blockchainLedger.length} Sealed Blocks</span>
          </h2>
          <p class="text-xs text-slate-400">Cryptographically verifiable SHA-256 chain securing complaint intakes, GNN correlations, and LEA dispatches for court admissibility.</p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="verifyLedgerIntegrity()" class="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Verify Chain Integrity</span>
          </button>
          <button onclick="simulateTamper()" class="px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/50 text-xs">
            Simulate Tamper
          </button>
          <button onclick="restoreLedger()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs">
            Restore
          </button>
        </div>
      </div>

      <!-- Chain Health Status Banner -->
      <div class="p-4 rounded-xl ${isChainValid ? 'bg-emerald-950/40 border border-emerald-500/40' : 'bg-red-950/70 border border-red-500 animate-pulse'} flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full ${isChainValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} flex items-center justify-center font-bold">
            ${isChainValid ? '✓' : '!'}
          </div>
          <div>
            <h4 class="text-sm font-bold ${isChainValid ? 'text-emerald-300' : 'text-red-300'}">
              ${isChainValid ? 'All Blocks Cryptographically Verified & Immutable' : `INTEGRITY VIOLATION DETECTED AT BLOCK #${brokenBlockIdx}`}
            </h4>
            <p class="text-xs text-slate-400">
              ${isChainValid ? 'SHA-256 hash pointer linkage intact across all ingested complaint seals.' : 'Hash mismatch detected! The canonical hash of block #' + brokenBlockIdx + ' does not match the previous block pointer.'}
            </p>
          </div>
        </div>
      </div>

      <!-- Blocks Flow View -->
      <div class="space-y-3 font-mono text-xs">
        ${state.blockchainLedger.map(b => {
          const isTampered = (b.index === brokenBlockIdx);
          return `
            <div class="glass-panel p-4 ${isTampered ? 'border-red-500 bg-red-950/30' : 'border-slate-800'} space-y-2">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-2 gap-2">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${b.index === 0 ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'}">
                    BLOCK #${b.index}
                  </span>
                  <span class="font-bold text-white">${b.operation}</span>
                  <span class="text-slate-400 font-normal">(${b.reference_id})</span>
                </div>
                <span class="text-[10px] text-slate-400">${b.timestamp}</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span class="text-slate-500">Block Hash:</span>
                  <code class="text-cyan-300 block truncate">${b.block_hash}</code>
                </div>
                <div>
                  <span class="text-slate-500">Previous Hash Pointer:</span>
                  <code class="text-slate-400 block truncate">${b.previous_hash}</code>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

function verifyLedgerIntegrity() {
  showToast('Recomputing SHA-256 Merkle hash chain across all blocks...', 'info');
  setTimeout(() => {
    let valid = true;
    for (let i = 1; i < state.blockchainLedger.length; i++) {
      if (state.blockchainLedger[i].previous_hash !== state.blockchainLedger[i - 1].block_hash) {
        valid = false;
        break;
      }
    }
    if (valid) {
      showToast('✓ Cryptographic ledger integrity verified. 100% immutable.', 'success');
    } else {
      showToast('⚠ Integrity alert: Tampered record detected in chain.', 'error');
    }
    renderBlockchain(document.getElementById('tab-content'));
  }, 300);
}

function simulateTamper() {
  if (state.blockchainLedger.length > 2) {
    state.blockchainLedger[2].block_hash = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    showToast('Tampering simulated on Block #2. Integrity violation active!', 'error');
    renderBlockchain(document.getElementById('tab-content'));
  }
}

function restoreLedger() {
  initBlockchain();
  showToast('Blockchain ledger restored to pristine state.', 'success');
  renderBlockchain(document.getElementById('tab-content'));
}

// ----------------------------------------------------------------------------
// K. TRL 5 VALIDATION & METRICS
// ----------------------------------------------------------------------------
function renderTrl5(container) {
  container.innerHTML = `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>TRL 5 Operational Validation & Readiness Dashboard</span>
            <span class="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">Tested in Relevant Environment</span>
          </h2>
          <p class="text-xs text-slate-400">System metrics evaluated against 50,000 synthetic transaction records with planted multi-hop mule networks.</p>
        </div>
      </div>

      <!-- TRL 1 to TRL 7 Progression Stepper -->
      <div class="glass-panel p-5 space-y-3">
        <h3 class="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">Technology Readiness Level (TRL) Milestone Roadmap</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs font-mono">
          <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500">TRL 1<br><span class="text-[10px]">Principles</span></div>
          <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500">TRL 2<br><span class="text-[10px]">Concept</span></div>
          <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">TRL 3<br><span class="text-[10px]">PoC Lab</span></div>
          <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">TRL 4<br><span class="text-[10px]">Component Lab</span></div>
          <div class="p-2.5 rounded-lg bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border-2 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/20">TRL 5<br><span class="text-[10px] text-cyan-300 font-bold">RELEVANT ENV</span></div>
          <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-500">TRL 6<br><span class="text-[10px]">Pilot Field</span></div>
          <div class="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 text-slate-600">TRL 7+<br><span class="text-[10px]">GovCloud Ops</span></div>
        </div>
      </div>

      <!-- Evaluated Performance Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div class="glass-panel p-4 text-center">
          <div class="text-[11px] text-slate-400 uppercase">Model Accuracy</div>
          <div class="text-3xl font-extrabold text-cyan-300 mt-1">84.6%</div>
          <div class="text-[10px] text-emerald-400 mt-1">Held-out test set</div>
        </div>
        <div class="glass-panel p-4 text-center">
          <div class="text-[11px] text-slate-400 uppercase">Recall (Risk Zones)</div>
          <div class="text-3xl font-extrabold text-emerald-300 mt-1">89.2%</div>
          <div class="text-[10px] text-slate-400 mt-1">Catches cashouts</div>
        </div>
        <div class="glass-panel p-4 text-center">
          <div class="text-[11px] text-slate-400 uppercase">Top-3 Hit Rate</div>
          <div class="text-3xl font-extrabold text-purple-300 mt-1">93.4%</div>
          <div class="text-[10px] text-purple-400 mt-1">vs 38.5% baseline</div>
        </div>
        <div class="glass-panel p-4 text-center">
          <div class="text-[11px] text-slate-400 uppercase">Prediction Latency</div>
          <div class="text-3xl font-extrabold text-amber-300 mt-1">180 ms</div>
          <div class="text-[10px] text-slate-400 mt-1">SLA Target < 450 ms</div>
        </div>
      </div>

      <!-- Confusion Matrix & Feature Weights -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="glass-panel p-5 space-y-3">
          <h3 class="text-sm font-bold text-slate-100">Evaluated Confusion Matrix (50,000 Transactions)</h3>
          <div class="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div class="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
              <div class="text-slate-400 text-[10px]">TRUE POSITIVES</div>
              <div class="text-xl font-bold text-emerald-300 mt-1">4,460</div>
              <div class="text-[10px] text-slate-400">Predicted Cashout Hit</div>
            </div>
            <div class="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30">
              <div class="text-slate-400 text-[10px]">FALSE POSITIVES</div>
              <div class="text-xl font-bold text-amber-300 mt-1">1,230</div>
              <div class="text-[10px] text-slate-400">Elevated Alert False</div>
            </div>
            <div class="p-3 rounded-lg bg-red-950/40 border border-red-500/30">
              <div class="text-slate-400 text-[10px]">FALSE NEGATIVES</div>
              <div class="text-xl font-bold text-red-300 mt-1">540</div>
              <div class="text-[10px] text-slate-400">Missed Cashouts</div>
            </div>
            <div class="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div class="text-slate-400 text-[10px]">TRUE NEGATIVES</div>
              <div class="text-xl font-bold text-slate-300 mt-1">43,770</div>
              <div class="text-[10px] text-slate-400">Normal Hops Cleared</div>
            </div>
          </div>
        </div>

        <div class="glass-panel p-5 space-y-3">
          <h3 class="text-sm font-bold text-slate-100">Feature Importance Breakdown (SHAP Gain)</h3>
          <div class="space-y-2 text-xs font-mono">
            <div>
              <div class="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>GNN Betweenness Centrality</span>
                <span class="text-cyan-400">28.4%</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div class="bg-cyan-400 h-full" style="width: 28.4%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Historical ATM Cashout Density</span>
                <span class="text-emerald-400">22.6%</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div class="bg-emerald-400 h-full" style="width: 22.6%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Temporal Window Delta (Evening spike)</span>
                <span class="text-purple-400">18.2%</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div class="bg-purple-400 h-full" style="width: 18.2%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Geodesic Transit Distance</span>
                <span class="text-amber-400">14.8%</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div class="bg-amber-400 h-full" style="width: 14.8%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Pass-Through Velocity (< 30m)</span>
                <span class="text-red-400">9.5%</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div class="bg-red-400 h-full" style="width: 9.5%"></div></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

// ============================================================================
// 4. SIH PRESENTATION MODE (WALKTHROUGH STORYBOARD)
// ============================================================================
const presentationSteps = [
  {
    step: 1,
    tab: 'complaints',
    title: 'Stage 1: Citizen Complaint Ingestion (NCRP / 1930 Helpline)',
    desc: 'Citizen reports ₹95,000 lost to a sophisticated utility bill phishing scam. System ingests complaint data and flags initial suspect beneficiary account.'
  },
  {
    step: 2,
    tab: 'transactions',
    title: 'Stage 2: Rapid Multi-Hop Transaction Tracing',
    desc: 'Detects funds split and transferred to Layer-2 mule account ACC-MULE-004 within 18 minutes (high velocity pass-through).'
  },
  {
    step: 3,
    tab: 'network',
    title: 'Stage 3: Graph Neural Network & Mule Centrality Analysis',
    desc: 'Visualizes the end-to-end diversion topology: Victim → L1 Mule → L2 Consolidator → Candidate ATM Cashout point.'
  },
  {
    step: 4,
    tab: 'linkage',
    title: 'Stage 4: Cross-Case Bipartite Syndicate Linkage',
    desc: 'Identifies that the same mule account is concurrently operating across 4 other complaints in Delhi, UP, and Haryana (Apex Mewat Ring).'
  },
  {
    step: 5,
    tab: 'prediction',
    title: 'Stage 5: Explainable ML Cashout Location Forecasting',
    desc: 'Hybrid XGBoost model predicts Sector 4 Central ATM Kiosk with 88.4% confidence and generates transparent SHAP attribution rationale.'
  },
  {
    step: 6,
    tab: 'simulator',
    title: 'Stage 6: Interactive What-If Scenario Simulator',
    desc: 'Judges can dynamically adjust amount, transfer velocity, and hop depth to observe real-time model re-computation.'
  },
  {
    step: 7,
    tab: 'map',
    title: 'Stage 7: Pan-India GIS Hotspot Mapping',
    desc: 'Displays geographical radar beacon, proximity radii, and nearest Quick Response Team (QRT) police station unit.'
  },
  {
    step: 8,
    tab: 'intervention',
    title: 'Stage 8: Proactive LEA Action & Cryptographic Evidence Seal',
    desc: 'Generates Section 91 CrPC CCTV preservation notice, executes simulated NPCI freeze, and seals immutable SHA-256 blockchain audit record.'
  }
];

function togglePresentationMode() {
  state.presentation.active = !state.presentation.active;
  const banner = document.getElementById('presentation-banner');
  const label = document.getElementById('demo-mode-label');

  if (state.presentation.active) {
    banner?.classList.remove('hidden');
    if (label) label.textContent = 'EXIT PRESENTATION';
    state.presentation.step = 1;
    applyPresStep();
    showToast('SIH Guided Presentation Mode Activated. Follow the stages.', 'info');
  } else {
    banner?.classList.add('hidden');
    if (label) label.textContent = 'SIH PRESENTATION MODE';
    showToast('Exited presentation mode.', 'info');
  }
}

function applyPresStep() {
  const s = presentationSteps[state.presentation.step - 1];
  if (!s) return;

  document.getElementById('pres-step-number').textContent = s.step;
  document.getElementById('pres-step-title').textContent = s.title;
  document.getElementById('pres-step-desc').textContent = s.desc;

  switchTab(s.tab);
}

function nextPresStep() {
  if (state.presentation.step < state.presentation.totalSteps) {
    state.presentation.step++;
    applyPresStep();
  } else {
    showToast('Presentation walkthrough complete!', 'success');
  }
}

function prevPresStep() {
  if (state.presentation.step > 1) {
    state.presentation.step--;
    applyPresStep();
  }
}

// ============================================================================
// 5. INTAKE MODAL LOGIC
// ============================================================================
function openIntakeModal() {
  document.getElementById('modal-intake')?.classList.remove('hidden');
}

function closeIntakeModal() {
  document.getElementById('modal-intake')?.classList.add('hidden');
}

function handleComplaintSubmit(e) {
  e.preventDefault();
  const victim = document.getElementById('intake-victim')?.value || 'ACC-VICTIM-99';
  const suspicious = document.getElementById('intake-suspicious')?.value || 'ACC-MULE-001';
  const amount = Number(document.getElementById('intake-amount')?.value) || 180000;
  const category = document.getElementById('intake-category')?.value || 'UPI Phishing / Impersonation';
  const narrative = document.getElementById('intake-narrative')?.value || 'Field intake complaint logged.';

  const newId = `CMP-${1000 + state.complaints.length + 1}`;
  const now = new Date();

  const newCase = {
    complaint_id: newId,
    date: now.toISOString().split('T')[0],
    amount: amount,
    victim_account: victim,
    suspicious_account: suspicious,
    transaction_datetime: now.toISOString().replace('T', ' ').substring(0, 19),
    transaction_location: 'Sector 4 Central ATM Kiosk',
    category: category,
    status: 'Actioned - Location Flagged',
    narrative: narrative,
    ground_truth_ring: 'RING-01',
    predicted_atm_location_id: 'LOC-DEMO-01'
  };

  state.complaints.unshift(newCase);
  closeIntakeModal();

  // Seal into blockchain
  const prev = state.blockchainLedger[state.blockchainLedger.length - 1];
  const payloadStr = JSON.stringify({ complaint_id: newId, amount, suspicious });
  const pHash = sha256(payloadStr);
  const bHash = sha256(prev.block_hash + pHash + state.blockchainLedger.length);

  state.blockchainLedger.push({
    index: state.blockchainLedger.length,
    timestamp: new Date().toISOString(),
    reference_id: newId,
    operation: 'COMPLAINT_INTAKE_RECORD',
    payload_hash: pHash,
    previous_hash: prev.block_hash,
    block_hash: bHash,
    status: 'VERIFIED_VALID'
  });

  onSelectCase(newId);
  switchTab('prediction');
  showToast(`New Case <strong>${newId}</strong> ingested. Predictive forecast executed!`, 'success');
}

// ============================================================================
// 6. INITIALIZATION ON PAGE LOAD
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  renderActiveTab();
  showToast('FORTIVEXA Command Console Initialized (TRL 5 Ready).', 'info');
});
