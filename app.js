const STORAGE_KEY = "ascendia-dashboard-v1";
const SESSION_KEY = "ascendia-session-v1";
const API_TOKEN_KEY = "ascendia-api-token-v1";
const API_USER_KEY = "ascendia-api-user-v1";
const API_BASE_URL = "";

const ranks = [
  { name: "Member", performance: 10, pair: 0, rule: "Awal gabung" },
  { name: "VIP", performance: 15, pair: 0, rule: "APPV 6.000 PV" },
  { name: "Royal Star", performance: 18, pair: 12, rule: "APPV 15.000 PV" },
  { name: "Crown Star", performance: 22, pair: 13, rule: "ATNPV 50.000 PV, 3 kaki Royal Star" },
  { name: "Leader Ambassador", performance: 26, pair: 14, rule: "ATNPV 200.000 PV, 3 kaki Crown Star" },
  { name: "Leader Majestic", performance: 30, pair: 15, rule: "ATNPV 700.000 PV, 3 kaki Leader Ambassador" },
  { name: "Director", performance: 30, pair: 15, rule: "4 kaki Leader Majestic, ATNPV 20.000.000 PV" },
  { name: "Executive Director", performance: 30, pair: 15, rule: "4 Director, ATNPV 70.000.000 PV" }
];

const rankIndex = Object.fromEntries(ranks.map((rank, index) => [rank.name, index]));
const LEGACY_DEFAULT_MONTH = "2026-06";
const MAX_COMPANY_PAYOUT_RATE = 0.55;
const MAX_PAIR_POOL_RATE = 0.075;
const MAX_MEMBER_PAIR_BV = 250000;
const PERFORMANCE_POOL_RATE = 0.30;
const PAIR_DESIGN_POOL_RATE = 0.15;
const LEADERSHIP_POOL_RATE = 0.08;
const MENTORING_POOL_RATE = 0.12;
const SHARING_POOL_RATE = 0.03;
const RENEWAL_MIN_PERSONAL_PV = 500;
const RENEWAL_MONTHS = 12;
const personalBonusTypes = [
  { key: "performance", field: "disableBonusPerformance", label: "Bonus Prestasi" },
  { key: "pair", field: "disableBonusPair", label: "Bonus Pasangan" },
  { key: "leadership", field: "disableBonusLeadership", label: "Bonus Kepemimpinan" },
  { key: "mentoring", field: "disableBonusMentoring", label: "Bonus Bimbingan" },
  { key: "sharing", field: "disableBonusSharing", label: "Sharing Profit" }
];
const indonesiaAreas = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Sumatera Selatan",
  "Bangka Belitung",
  "Bengkulu",
  "Lampung",
  "Banten",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Gorontalo",
  "Sulawesi Tengah",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Maluku",
  "Maluku Utara",
  "Papua",
  "Papua Barat",
  "Papua Selatan",
  "Papua Tengah",
  "Papua Pegunungan",
  "Papua Barat Daya"
];
const branchAreaOptions = ["Semua Indonesia", ...indonesiaAreas];
const adminAreaOptions = ["Pusat", ...branchAreaOptions];
const districtOptionsByArea = {
  "DKI Jakarta": ["Jakarta Pusat", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur", "Jakarta Utara", "Kepulauan Seribu"],
  "Jawa Barat": ["Kota Bandung", "Kabupaten Bandung", "Bandung Barat", "Bekasi", "Bogor", "Cimahi", "Cirebon", "Depok", "Garut", "Karawang", "Sukabumi", "Tasikmalaya"],
  "Jawa Tengah": ["Semarang", "Surakarta", "Magelang", "Pekalongan", "Tegal", "Banyumas", "Cilacap", "Kudus", "Pati", "Purwokerto", "Salatiga"],
  "DI Yogyakarta": ["Kota Yogyakarta", "Sleman", "Bantul", "Gunungkidul", "Kulon Progo"],
  "Jawa Timur": ["Surabaya", "Sidoarjo", "Gresik", "Malang", "Batu", "Kediri", "Madiun", "Mojokerto", "Pasuruan", "Jember", "Banyuwangi"],
  "Banten": ["Tangerang", "Tangerang Selatan", "Kota Serang", "Kabupaten Serang", "Cilegon", "Pandeglang", "Lebak"],
  "Bali": ["Denpasar", "Badung", "Gianyar", "Tabanan", "Buleleng", "Karangasem", "Klungkung", "Bangli", "Jembrana"],
  "Sumatera Utara": ["Medan", "Binjai", "Deli Serdang", "Pematangsiantar", "Tebing Tinggi", "Asahan", "Karo", "Langkat"],
  "Sumatera Barat": ["Padang", "Bukittinggi", "Payakumbuh", "Pariaman", "Solok", "Agam", "Tanah Datar"],
  "Riau": ["Pekanbaru", "Dumai", "Kampar", "Siak", "Bengkalis", "Indragiri Hulu", "Indragiri Hilir"],
  "Kepulauan Riau": ["Batam", "Tanjungpinang", "Bintan", "Karimun", "Lingga", "Natuna"],
  "Sumatera Selatan": ["Palembang", "Prabumulih", "Lubuklinggau", "Pagar Alam", "Banyuasin", "Ogan Ilir", "Musi Banyuasin"],
  "Lampung": ["Bandar Lampung", "Metro", "Lampung Selatan", "Lampung Tengah", "Lampung Timur", "Pringsewu"],
  "Kalimantan Barat": ["Pontianak", "Singkawang", "Kubu Raya", "Sambas", "Ketapang", "Sintang"],
  "Kalimantan Timur": ["Balikpapan", "Samarinda", "Bontang", "Kutai Kartanegara", "Paser", "Berau"],
  "Kalimantan Selatan": ["Banjarmasin", "Banjarbaru", "Banjar", "Barito Kuala", "Tanah Laut", "Tabalong"],
  "Sulawesi Selatan": ["Makassar", "Gowa", "Maros", "Parepare", "Palopo", "Bone", "Bulukumba"],
  "Sulawesi Utara": ["Manado", "Bitung", "Tomohon", "Minahasa", "Minahasa Utara", "Kotamobagu"],
  "Nusa Tenggara Barat": ["Mataram", "Lombok Barat", "Lombok Tengah", "Lombok Timur", "Sumbawa", "Bima"],
  "Nusa Tenggara Timur": ["Kupang", "Ende", "Maumere", "Manggarai", "Labuan Bajo", "Sumba Timur"],
  "Papua": ["Jayapura", "Keerom", "Sarmi", "Mamberamo Raya", "Biak Numfor", "Waropen"]
};
const areaAliases = {
  jakarta: "DKI Jakarta",
  "dki jakarta": "DKI Jakarta",
  bandung: "Jawa Barat",
  "jawa barat": "Jawa Barat",
  surabaya: "Jawa Timur",
  "jawa timur": "Jawa Timur",
  jogja: "DI Yogyakarta",
  yogyakarta: "DI Yogyakarta",
  "di yogyakarta": "DI Yogyakarta"
};

function normalizeAreaName(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (sameText(text, "Pusat")) return "Pusat";
  if (sameText(text, "Semua Indonesia")) return "Semua Indonesia";
  return areaAliases[text.toLowerCase()] || indonesiaAreas.find((area) => sameText(area, text)) || text;
}

function districtOptionsForArea(area, currentValue = "") {
  const province = normalizeAreaName(area);
  const base = districtOptionsByArea[province] || [`Ibu Kota ${province || "Provinsi"}`, "Daerah lainnya"];
  const current = String(currentValue || "").trim();
  return current && !base.some((item) => sameText(item, current)) ? [...base, current] : base;
}

function sameText(left, right) {
  return String(left || "").trim().toLowerCase() === String(right || "").trim().toLowerCase();
}

function currentMonthValue(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function requiredTupoPv(rankName) {
  if (rankName === "Royal Star") return 1000;
  if (rankName === "Crown Star") return 2000;
  if (rankIndex[rankName] >= rankIndex["Leader Ambassador"]) return 3000;
  return 0;
}

function effectiveTupoDone(member, rankName = member.rank) {
  const requiredPv = requiredTupoPv(rankName);
  if (requiredPv <= 0) return true;
  if (Boolean(member.tupoBlocked)) return false;
  const tupoPpv = Number(member.tupoPpv ?? member.ppv ?? 0);
  return Boolean(member.tupoDone) || tupoPpv >= requiredPv;
}

function tupoStatusText(member, rankName = member.rank) {
  if (Boolean(member.tupoBlocked)) return state.activeRole === "member" ? "Belum" : "Ditahan Sistem";
  if (effectiveTupoDone(member, rankName)) return requiredTupoPv(rankName) > 0 ? "Sudah" : "Tidak wajib";
  return "Belum";
}

function tupoRequirementText(rankName) {
  const requiredPv = requiredTupoPv(rankName);
  return requiredPv > 0 ? `${pv(requiredPv)} untuk menerima bonus` : "Tidak wajib TUPO";
}

const defaultState = {
  activeRole: "admin",
  activeId: "ADM-001",
  selectedMonth: currentMonthValue(),
  monthManuallySelected: false,
  dashboardMonth: currentMonthValue(),
  dashboardMonthManuallySelected: false,
  revenuePeriod: "1",
  paymentPeriod: "1",
  adminReportScope: "payment",
  memberBonusScope: "payment",
  companyFundScope: "month",
  stockistPaymentScope: "payment",
  bonusSettings: {
    performance: true,
    pair: true,
    leadership: true,
    mentoring: true,
    sharing: false
  },
  admins: [
    { id: "ADM-001", name: "Admin Pusat Ascendia", email: "pusat@ascendia.id", phone: "0812-1000-0001", area: "Pusat", role: "Admin Pusat", password: "ascendia" },
    { id: "CAB-JKT", name: "Admin Cabang DKI Jakarta", email: "jakarta@ascendia.id", phone: "0812-1000-0020", area: "DKI Jakarta", role: "Admin Cabang", password: "ascendia" },
    { id: "CAB-SBY", name: "Admin Cabang Jawa Timur", email: "jatim@ascendia.id", phone: "0812-1000-0030", area: "Jawa Timur", role: "Admin Cabang", password: "ascendia" }
  ],
  stockists: [
    { id: "STK-JKT01", name: "Stokis Harmoni", area: "DKI Jakarta", district: "Jakarta Pusat", feeRate: 5, password: "ascendia" },
    { id: "STK-BDG01", name: "Stokis Parahyangan", area: "Jawa Barat", district: "Kota Bandung", feeRate: 5, password: "ascendia" },
    { id: "STK-SBY01", name: "Stokis Tunjungan", area: "Jawa Timur", district: "Surabaya", feeRate: 5, password: "ascendia" }
  ],
  periods: {},
  deletedMembers: [],
  deletedItems: [],
  members: [
    { id: "ASC-1001", name: "Nadia Permata", email: "nadia@example.com", phone: "0813-1001-0001", sponsor: "Pusat", parent: null, rank: "Executive Director", joinedAt: "2026-01-04", ppv: 5200, cpv: 184000, tnpv: 9300000, atnpv: 72000000, gpv: 6600000, leftPv: 880000, rightPv: 835000, carry: 24000, carryAge: 1, stockist: "STK-JKT01", password: "ascendia" },
    { id: "ASC-1020", name: "Raka Santoso", email: "raka@example.com", phone: "0813-1020-0001", sponsor: "ASC-1001", parent: "ASC-1001", rank: "Director", joinedAt: "2026-02-12", ppv: 3600, cpv: 98000, tnpv: 4100000, atnpv: 22700000, gpv: 2800000, leftPv: 510000, rightPv: 492000, carry: 12000, carryAge: 2, stockist: "STK-JKT01", password: "ascendia" },
    { id: "ASC-1034", name: "Dewi Kartika", email: "dewi@example.com", phone: "0813-1034-0001", sponsor: "ASC-1001", parent: "ASC-1001", rank: "Leader Majestic", joinedAt: "2026-03-08", ppv: 3300, cpv: 75000, tnpv: 980000, atnpv: 820000, gpv: 610000, leftPv: 190000, rightPv: 168000, carry: 8000, carryAge: 1, stockist: "STK-BDG01", password: "ascendia" },
    { id: "ASC-1051", name: "Hendra Wijaya", email: "hendra@example.com", phone: "0813-1051-0001", sponsor: "ASC-1001", parent: "ASC-1001", rank: "Leader Ambassador", joinedAt: "2026-04-17", ppv: 3100, cpv: 61000, tnpv: 360000, atnpv: 240000, gpv: 190000, leftPv: 84000, rightPv: 72000, carry: 0, carryAge: 0, stockist: "STK-SBY01", password: "ascendia" },
    { id: "ASC-1088", name: "Alya Safira", email: "alya@example.com", phone: "0813-1088-0001", sponsor: "ASC-1020", parent: "ASC-1020", rank: "Crown Star", joinedAt: "2026-05-03", ppv: 2300, cpv: 42000, tnpv: 92000, atnpv: 56000, gpv: 64000, leftPv: 26000, rightPv: 22000, carry: 4000, carryAge: 3, stockist: "STK-JKT01", password: "ascendia" },
    { id: "ASC-1092", name: "Bagus Pratama", email: "bagus@example.com", phone: "0813-1092-0001", sponsor: "ASC-1020", parent: "ASC-1020", rank: "Royal Star", joinedAt: "2026-05-19", ppv: 1200, cpv: 26000, tnpv: 28000, atnpv: 18000, gpv: 0, leftPv: 9000, rightPv: 7000, carry: 0, carryAge: 0, stockist: "STK-BDG01", password: "ascendia" },
    { id: "ASC-1104", name: "Citra Lestari", email: "citra@example.com", phone: "0813-1104-0001", sponsor: "ASC-1034", parent: "ASC-1034", rank: "VIP", joinedAt: "2026-06-06", ppv: 900, cpv: 8400, tnpv: 8400, atnpv: 8400, gpv: 0, leftPv: 2500, rightPv: 1800, carry: 0, carryAge: 0, stockist: "STK-SBY01", password: "ascendia" },
    { id: "ASC-1121", name: "Fajar Akbar", email: "fajar@example.com", phone: "0813-1121-0001", sponsor: "ASC-1034", parent: "ASC-1034", rank: "Member", joinedAt: "2026-06-18", ppv: 450, cpv: 1600, tnpv: 1600, atnpv: 1600, gpv: 0, leftPv: 600, rightPv: 400, carry: 0, carryAge: 0, stockist: "STK-JKT01", password: "ascendia" }
  ],
  announcements: [
    { id: "ANN-001", title: "Reward Royal Star Challenge", date: "2026-06-11", audience: "Semua Member", status: "Aktif", body: "Member yang mencapai Royal Star sebelum tutup buku Periode 2 berhak masuk daftar reward pembinaan bisnis Ascendia." },
    { id: "ANN-002", title: "Kebijakan Tutup Buku Periode 2", date: "2026-06-27", audience: "Tim Operasional dan Stokis", status: "Aktif", body: "Semua data PPV, TNPV, carry over, dan pembayaran via stokis harus selesai diverifikasi sebelum pukul 18.00." },
    { id: "ANN-003", title: "Pengingat Tupo Peringkat", date: "2026-06-21", audience: "Royal Star ke atas", status: "Aktif", body: "Pastikan tupo sesuai peringkat agar hak bonus dan perkembangan jaringan tercatat rapi." }
  ]
};

const navByRole = {
  admin: [
    ["dashboard", "Dashboard", "D"],
    ["members", "Member", "M"],
    ["tupo", "TUPO", "T"],
    ["network", "Struktur", "J"],
    ["placement", "Placement", "P"],
    ["revenue", "Omset", "O"],
    ["bonuses", "Bonus", "B"],
    ["bonusControl", "Kontrol Bonus", "K"],
    ["forfeitures", "Dana Kelola", "H"],
    ["announcements", "Pengumuman", "N"],
    ["rules", "Aturan Bisnis", "R"],
    ["stockists", "Stokis", "$"],
    ["admins", "Admin", "A"],
    ["settings", "Pengaturan", "S"]
  ],
  branch: [
    ["dashboard", "Dashboard", "D"],
    ["stockists", "Stokis Area", "$"],
    ["members", "Member Area", "M"],
    ["tupo", "TUPO Area", "T"],
    ["network", "Struktur", "J"],
    ["placement", "Placement", "P"],
    ["revenue", "Omset", "O"],
    ["bonuses", "Bonus", "B"],
    ["announcements", "Pengumuman", "N"],
    ["rules", "Aturan Bisnis", "R"],
    ["settings", "Pengaturan", "S"]
  ],
  stockist: [
    ["dashboard", "Dashboard", "D"],
    ["payouts", "Komisi", "$"],
    ["stockists", "Profil Stokis", "S"],
    ["members", "Member", "M"],
    ["revenue", "Input Omset", "O"],
    ["bonuses", "Bonus", "B"],
    ["announcements", "Pengumuman", "N"],
    ["rules", "Aturan Bisnis", "R"],
    ["settings", "Pengaturan", "S"]
  ],
  member: [
    ["memberHome", "Perkembangan", "D"],
    ["network", "Jaringan", "J"],
    ["placement", "Placement", "P"],
    ["revenue", "Omset", "O"],
    ["bonuses", "Bonus Saya", "B"],
    ["announcements", "Pengumuman", "N"],
    ["rules", "Aturan Bisnis", "R"],
    ["settings", "Profil", "S"]
  ]
};

let calcMembersContext = null;
let payoutCapCache = null;
let pairPoolCache = null;
let sponsorChildrenCache = new WeakMap();
let memberByIdCache = new WeakMap();
let performanceBonusCache = null;
let leadershipBonusCache = null;
let mentoringBonusCache = null;
let sharingBonusCache = null;
let state = normalizeState(loadState());
let activeView = navByRole[state.activeRole][0][0];
let editTarget = null;
let pendingServerMemberId = "";
let searchTerms = {};
let collapsedNetworkIds = new Set();
let expandedNetworkIds = new Set();
let collapsedPlacementIds = new Set();
let expandedPlacementIds = new Set();
let selectedRows = {
  member: new Set(),
  stockist: new Set(),
  announcement: new Set(),
  admin: new Set()
};
let isAuthenticated = sessionStorage.getItem(SESSION_KEY) === "1";
let apiSession = loadApiSession();
if (typeof location !== "undefined" && location.protocol !== "file:" && isAuthenticated && !apiSession) {
  isAuthenticated = false;
  sessionStorage.removeItem(SESSION_KEY);
}
let serverMembersPage = {
  rows: [],
  cursor: "",
  previousCursors: [],
  nextCursor: null,
  loading: false,
  loadedKey: "",
  error: ""
};
let serverTupoPage = {
  rows: [],
  cursor: "",
  previousCursors: [],
  nextCursor: null,
  loadedKey: "",
  loading: false,
  error: ""
};
let serverRevenuePage = {
  rows: [],
  cursor: "",
  previousCursors: [],
  nextCursor: null,
  loadedKey: "",
  loading: false,
  error: ""
};
let serverMasterPages = {
  stockists: createServerListState(),
  admins: createServerListState(),
  announcements: createServerListState()
};
let serverDashboardSummary = {
  key: "",
  data: null,
  loading: false,
  error: ""
};
let serverBonusRun = {
  loading: false,
  message: "",
  error: ""
};
let serverBonusSettingsState = {
  loaded: false,
  loading: false,
  error: ""
};
let serverBonusPage = createServerListState();
let serverStockistPayouts = {
  key: "",
  rows: [],
  loading: false,
  error: ""
};
let serverCompanyFunds = {
  key: "",
  data: null,
  loading: false,
  error: ""
};
let menuVisibilityState = {
  loaded: false,
  loading: false,
  error: "",
  data: { admin: {}, branch: {}, stockist: {}, member: {}, personal: {} }
};
let serverTreeState = {
  network: createServerTreeState(),
  placement: createServerTreeState()
};

const content = document.querySelector("#content");
const nav = document.querySelector("#nav");
const loginIdInput = document.querySelector("#loginIdInput");
const passwordInput = document.querySelector("#passwordInput");
const loginBox = document.querySelector("#loginBox");
const activeUser = document.querySelector("#activeUser");
const roleLabel = document.querySelector("#roleLabel");
const pageTitle = document.querySelector("#pageTitle");
const dialog = document.querySelector("#editDialog");
const editForm = document.querySelector("#editForm");
const dialogFields = document.querySelector("#dialogFields");
const dialogTitle = document.querySelector("#dialogTitle");
const toast = document.querySelector("#toast");
const exportDataBtn = document.querySelector("#exportDataBtn");
const importDataBtn = document.querySelector("#importDataBtn");
const importDataInput = document.querySelector("#importDataInput");
const resetDataBtn = document.querySelector("#resetDataBtn");
const logoutBtn = document.querySelector("#logoutBtn");
let toastTimer = null;
let searchRenderTimer = null;

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(defaultState);
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return structuredClone(defaultState);
  }
}

function loadApiSession() {
  try {
    const token = sessionStorage.getItem(API_TOKEN_KEY);
    const user = JSON.parse(sessionStorage.getItem(API_USER_KEY) || "null");
    return token && user ? { token, user } : null;
  } catch (error) {
    sessionStorage.removeItem(API_TOKEN_KEY);
    sessionStorage.removeItem(API_USER_KEY);
    return null;
  }
}

function saveApiSession(session) {
  apiSession = session;
  if (!session) {
    sessionStorage.removeItem(API_TOKEN_KEY);
    sessionStorage.removeItem(API_USER_KEY);
    return;
  }
  sessionStorage.setItem(API_TOKEN_KEY, session.token);
  sessionStorage.setItem(API_USER_KEY, JSON.stringify(session.user));
}

function apiConnected() {
  return Boolean(apiSession?.token);
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (apiSession?.token) headers.Authorization = `Bearer ${apiSession.token}`;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.error || `API error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function apiLogin(loginId, password) {
  const result = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ loginId, password })
  });
  return {
    token: result.token,
    user: result.user
  };
}

function apiUserToLocalRole(role) {
  return { admin: "admin", branch: "branch", stockist: "stockist", member: "member" }[role] || "member";
}

function apiMemberToLocal(row) {
  return {
    id: row.id,
    name: row.name || row.id,
    email: row.email || "",
    phone: row.phone || "",
    sponsor: row.sponsor_id || row.sponsorId || "Pusat",
    parent: row.placement_parent_id || row.placementParentId || null,
    rank: row.rank_name || row.rankName || "Member",
    joinedAt: String(row.joined_at || row.joinedAt || currentMonthValue()).slice(0, 10),
    stockist: row.stockist_id || row.stockistId || "",
    active: row.active !== false,
    renewalFailed: Boolean(row.renewal_failed ?? row.renewalFailed),
    ppv: Number(row.ppv || 0),
    cpv: Number(row.appv ?? row.cpv ?? 0),
    tnpv: Number(row.tnpv || 0),
    atnpv: Number(row.atnpv || 0),
    gpv: Number(row.gpv || 0),
    leftPv: Number(row.left_pv || row.leftPv || 0),
    rightPv: Number(row.right_pv || row.rightPv || 0),
    carry: Number(row.carry_pv || row.carry || 0),
    carryAge: Number(row.carry_age || row.carryAge || 0),
    tupoDone: Boolean(row.tupo_done ?? row.tupoDone),
    tupoBlocked: Boolean(row.tupo_blocked ?? row.tupoBlocked),
    tupoPpv: Number(row.ppv || 0),
    disabledBonuses: {
      performance: Boolean(row.disable_bonus_performance ?? row.disableBonusPerformance),
      pair: Boolean(row.disable_bonus_pair ?? row.disableBonusPair),
      leadership: Boolean(row.disable_bonus_leadership ?? row.disableBonusLeadership),
      mentoring: Boolean(row.disable_bonus_mentoring ?? row.disableBonusMentoring),
      sharing: Boolean(row.disable_bonus_sharing ?? row.disableBonusSharing)
    },
    sponsorChildCount: Number(row.sponsor_child_count ?? row.sponsorChildCount ?? row.child_count ?? row.childCount ?? 0),
    placementChildCount: Number(row.placement_child_count ?? row.placementChildCount ?? 0),
    placementSide: row.placement_side || row.placementSide || "",
    password: ""
  };
}

function apiStockistToLocal(row) {
  return {
    id: row.id,
    name: row.name || row.id,
    email: row.email || "",
    phone: row.phone || "",
    area: row.area || "",
    district: row.district || "",
    feeRate: Number(row.fee_rate ?? row.feeRate ?? 5),
    memberCount: Number(row.member_count ?? row.memberCount ?? 0),
    password: ""
  };
}

function apiAdminToLocal(row) {
  return {
    id: row.id,
    name: row.name || row.id,
    email: row.email || "",
    phone: row.phone || "",
    role: row.role || "Admin Cabang",
    area: row.area || "",
    password: ""
  };
}

function apiAnnouncementToLocal(row) {
  return {
    id: row.id,
    title: row.title || row.id,
    body: row.body || "",
    audience: row.audience || "Semua Member",
    status: row.status || "Aktif",
    date: String(row.published_at || row.publishedAt || row.date || currentMonthValue()).slice(0, 10)
  };
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function apiBonusSummaryToLocal(row) {
  const rawSources = Array.isArray(row.sources)
    ? row.sources
    : typeof row.sources === "string"
      ? safeJsonParse(row.sources, [])
      : [];
  return {
    member: {
      id: row.id,
      name: row.name || row.id,
      rank: row.rank_name || row.rankName || "Member",
      stockist: row.stockist_id || row.stockistId || "",
      ppv: Number(row.ppv || 0),
      cpv: Number(row.appv ?? row.cpv ?? 0),
      tnpv: Number(row.tnpv || 0),
      atnpv: Number(row.atnpv || 0),
      gpv: Number(row.gpv || 0),
      paidDone: Boolean(row.paid_done ?? row.paidDone)
    },
    stockistName: row.stockist_name || "",
    bonus: {
      performance: Number(row.performance_rupiah || row.performanceRupiah || 0),
      pair: Number(row.pair_rupiah || row.pairRupiah || 0),
      leadership: Number(row.leadership_rupiah || row.leadershipRupiah || 0),
      mentoring: Number(row.mentoring_rupiah || row.mentoringRupiah || 0),
      sharing: Number(row.sharing_rupiah || row.sharingRupiah || 0),
      rupiah: Number(row.total_rupiah || row.totalRupiah || 0),
      sources: rawSources.map((source) => ({
        type: source.bonusType || source.bonus_type || "",
        generation: source.generation ?? null,
        rupiah: Number(source.rupiah || 0),
        bv: Number(source.bv || 0),
        sourceMemberId: source.sourceMemberId || source.source_member_id || "",
        sourceMemberName: source.sourceMemberName || source.source_member_name || "",
        sourceRank: source.sourceRank || source.source_rank || source.source_rank_name || "",
        note: source.note || ""
      })).filter((source) => source.rupiah > 0)
    }
  };
}

function apiStockistPayoutToLocal(row) {
  return {
    id: row.id,
    name: row.name || row.id,
    area: row.area || "",
    district: row.district || "",
    feeRate: Number(row.fee_rate ?? row.feeRate ?? 0),
    sales: Number(row.sales_rupiah || row.salesRupiah || 0),
    fee: Number(row.fee_rupiah || row.feeRupiah || 0),
    memberBonus: Number(row.member_bonus_rupiah || row.memberBonusRupiah || 0),
    memberCount: Number(row.member_count || row.memberCount || 0),
    payableCount: Number(row.payable_count || row.payableCount || 0),
    paidCount: Number(row.paid_count || row.paidCount || 0),
    transferPaid: String(row.transfer_status || row.transferStatus || "draft") === "paid"
  };
}

function normalizeState(rawState) {
  const normalized = { ...structuredClone(defaultState), ...rawState };
  const hasDashboardMonth = Object.prototype.hasOwnProperty.call(rawState, "dashboardMonth");
  let migratedLegacyDashboardMonth = false;
  if (!rawState.monthManuallySelected && (!rawState.selectedMonth || rawState.selectedMonth === LEGACY_DEFAULT_MONTH)) {
    normalized.selectedMonth = currentMonthValue();
  }
  normalized.monthManuallySelected = Boolean(rawState.monthManuallySelected);
  if (!hasDashboardMonth && rawState.monthManuallySelected && rawState.selectedMonth && rawState.selectedMonth !== currentMonthValue()) {
    normalized.dashboardMonth = rawState.selectedMonth;
    normalized.selectedMonth = currentMonthValue();
    normalized.monthManuallySelected = false;
    migratedLegacyDashboardMonth = true;
  }
  if (!migratedLegacyDashboardMonth && !rawState.dashboardMonthManuallySelected && (!rawState.dashboardMonth || rawState.dashboardMonth === LEGACY_DEFAULT_MONTH)) {
    normalized.dashboardMonth = currentMonthValue();
  }
  normalized.dashboardMonthManuallySelected = Boolean(rawState.dashboardMonthManuallySelected);
  normalized.revenuePeriod = ["1", "2"].includes(String(rawState.revenuePeriod || "")) ? String(rawState.revenuePeriod) : "1";
  normalized.paymentPeriod = ["1", "2"].includes(String(rawState.paymentPeriod || "")) ? String(rawState.paymentPeriod) : "1";
  normalized.adminReportScope = ["payment", "month", "year"].includes(String(rawState.adminReportScope || "")) ? String(rawState.adminReportScope) : "payment";
  normalized.memberBonusScope = ["payment", "month", "year"].includes(String(rawState.memberBonusScope || "")) ? String(rawState.memberBonusScope) : "payment";
  normalized.companyFundScope = ["payment", "month", "year"].includes(String(rawState.companyFundScope || "")) ? String(rawState.companyFundScope) : "month";
  normalized.stockistPaymentScope = ["payment", "month", "year"].includes(String(rawState.stockistPaymentScope || "")) ? String(rawState.stockistPaymentScope) : "payment";
  normalized.bonusSettings = {
    ...defaultState.bonusSettings,
    ...(rawState.bonusSettings || {})
  };
  normalized.admins = (rawState.admins || defaultState.admins).map((admin, index) => ({
    ...defaultState.admins[index % defaultState.admins.length],
    ...admin,
    email: admin.email || defaultState.admins[index % defaultState.admins.length].email,
    phone: admin.phone || defaultState.admins[index % defaultState.admins.length].phone,
    area: normalizeAreaName(admin.area || defaultState.admins[index % defaultState.admins.length].area)
  }));
  normalized.stockists = (rawState.stockists || defaultState.stockists).map((stockist, index) => {
    const fallback = defaultState.stockists[index % defaultState.stockists.length] || {};
    return {
      ...fallback,
      ...stockist,
      id: String(stockist.id || fallback.id || `STK-${index + 1}`).trim(),
      name: stockist.name || fallback.name || `Stokis ${index + 1}`,
      area: normalizeAreaName(stockist.area || fallback.area),
      district: stockist.district || stockist.city || fallback.district || stockist.area || fallback.area || "",
      feeRate: Number(stockist.feeRate ?? fallback.feeRate ?? 5),
      password: stockist.password || fallback.password || "ascendia"
    };
  });
  const usingDefaultMembers = !Array.isArray(rawState.members);
  const sourceMembers = usingDefaultMembers ? defaultState.members : rawState.members;
  normalized.members = sourceMembers.map((member, index) => normalizeMemberRecord(member, index, usingDefaultMembers));
  normalized.periods = normalizePeriods(rawState.periods, normalized.members, normalized.selectedMonth, {
    seedFromMemberPpv: !rawState.periods || Object.keys(rawState.periods || {}).length === 0
  });
  normalized.deletedMembers = Array.isArray(rawState.deletedMembers)
    ? rawState.deletedMembers
      .filter((entry) => entry?.member?.id)
      .map((entry) => ({
        id: String(entry.id || entry.member.id),
        deletedAt: entry.deletedAt || new Date().toISOString(),
        originalIndex: Number.isInteger(entry.originalIndex) ? entry.originalIndex : null,
        member: normalizeMemberRecord(entry.member, 0, false),
        periods: structuredClone(entry.periods || {})
      }))
    : [];
  normalized.deletedItems = Array.isArray(rawState.deletedItems)
    ? rawState.deletedItems
      .filter((entry) => entry?.type && entry?.item?.id)
      .map((entry) => ({
        type: entry.type,
        id: String(entry.id || entry.item.id),
        deletedAt: entry.deletedAt || new Date().toISOString(),
        originalIndex: Number.isInteger(entry.originalIndex) ? entry.originalIndex : null,
        item: structuredClone(entry.item)
      }))
    : [];
  normalized.members.forEach((member) => {
    if (!member.tupoDone) return;
    normalized.periods[normalized.selectedMonth] = normalized.periods[normalized.selectedMonth] || {};
    normalized.periods[normalized.selectedMonth][member.id] = {
      ...(normalized.periods[normalized.selectedMonth][member.id] || {}),
      tupoDone: true
    };
    member.tupoDone = false;
  });
  const liveMemberIds = new Set(normalized.members.map((member) => member.id));
  Object.values(normalized.periods || {}).forEach((period) => {
    Object.keys(period).forEach((memberId) => {
      if (memberId.startsWith("_")) return;
      if (!liveMemberIds.has(memberId)) delete period[memberId];
    });
  });
  normalized.announcements = rawState.announcements || defaultState.announcements;
  normalizeSponsorLinks(normalized.members);
  recomputeMetrics(normalized.members);
  return normalized;
}

function normalizeMemberRecord(member, index, keepSampleDefaults = false) {
  const sample = defaultState.members[index % defaultState.members.length];
  const base = keepSampleDefaults ? sample : blankMemberDefaults();
  const normalized = {
    ...base,
    ...member,
    id: String(member.id || base.id || `MEM-${index + 1}`).trim(),
    name: member.name || base.name || `Member ${index + 1}`,
    email: member.email || base.email || "",
    phone: member.phone || base.phone || "",
    joinedAt: member.joinedAt || base.joinedAt || `${currentMonthValue()}-01`,
    sponsor: member.sponsor || base.sponsor || "Pusat",
    parent: member.parent || base.parent || null,
    stockist: member.stockist || base.stockist || defaultState.stockists[0]?.id || "",
    rank: ranks.some((rank) => rank.name === member.rank) ? member.rank : base.rank || "Member",
    manualRank: Boolean(member.manualRank),
    renewalOverride: ["active", "inactive"].includes(String(member.renewalOverride || "")) ? String(member.renewalOverride) : "",
    bonusDisabled: false,
    disabledBonuses: normalizeDisabledBonuses(member),
    tupoDone: Boolean(member.tupoDone),
    password: member.password || base.password || "ascendia"
  };

  ["ppv", "cpv", "tnpv", "atnpv", "gpv", "leftPv", "rightPv", "carry", "carryAge"].forEach((key) => {
    normalized[key] = Number(normalized[key] || 0);
  });
  return normalized;
}

function blankMemberDefaults() {
  return {
    id: "",
    name: "",
    email: "",
    phone: "",
    sponsor: "Pusat",
    parent: null,
    rank: "Member",
    manualRank: false,
    renewalOverride: "",
    disabledBonuses: {},
    tupoDone: false,
    joinedAt: `${currentMonthValue()}-01`,
    ppv: 0,
    cpv: 0,
    tnpv: 0,
    atnpv: 0,
    gpv: 0,
    leftPv: 0,
    rightPv: 0,
    carry: 0,
    carryAge: 0,
    stockist: defaultState.stockists[0]?.id || "",
    password: "ascendia"
  };
}

function normalizePeriods(rawPeriods, members, fallbackMonth, options = {}) {
  const periods = structuredClone(rawPeriods || {});
  const month = fallbackMonth || defaultState.selectedMonth;
  periods[month] = periods[month] || {};
  if (!options.seedFromMemberPpv) return periods;
  members.forEach((member) => {
    if (!periods[month][member.id] && Number(member.ppv || 0) > 0) {
      periods[month][member.id] = { ppv: Number(member.ppv || 0) };
    }
  });
  return periods;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function canManageSystemData() {
  return isAuthenticated && state.activeRole === "admin";
}

function roleNavItems(role = state.activeRole) {
  const items = navByRole[role] || navByRole.admin;
  const hidden = menuVisibilityState.data?.[role] || {};
  const personalHidden = menuVisibilityState.data?.personal?.[`${role}:${state.activeId}`] || {};
  if (role === "admin") return items;
  const visible = items.filter(([key]) => hidden[key] !== false && personalHidden[key] !== false);
  return visible.length ? visible : items.slice(0, 1);
}

function ensureAllowedActiveView() {
  const items = roleNavItems(state.activeRole);
  if (!items.some(([key]) => key === activeView)) {
    activeView = items[0]?.[0] || "dashboard";
  }
}

function menuVisibleFor(role, key) {
  return (menuVisibilityState.data?.[role] || {})[key] !== false;
}

function personalMenuVisibleFor(role, id, key) {
  if (!role || !id) return true;
  return (menuVisibilityState.data?.personal?.[`${role}:${id}`] || {})[key] !== false;
}

async function loadMenuVisibility() {
  if (!apiConnected() || menuVisibilityState.loaded || menuVisibilityState.loading) return;
  menuVisibilityState.loading = true;
  try {
    const result = await apiRequest("/api/ui-settings");
    menuVisibilityState = {
      loaded: true,
      loading: false,
      error: "",
      data: { admin: {}, branch: {}, stockist: {}, member: {}, personal: {}, ...(result.data || {}) }
    };
  } catch (error) {
    menuVisibilityState = { ...menuVisibilityState, loading: false, error: error.message || "Pengaturan halaman belum bisa dimuat." };
  } finally {
    if (isAuthenticated) render();
  }
}

async function saveMenuVisibility(nextData) {
  await apiRequest("/api/ui-settings/menu-visibility", {
    method: "PATCH",
    body: JSON.stringify(nextData)
  });
  menuVisibilityState = { loaded: true, loading: false, error: "", data: nextData };
}

function exportData() {
  if (!isAuthenticated) {
    showToast("Silakan login sebelum membuat backup.");
    return;
  }
  if (!canManageSystemData()) {
    showToast("Backup data hanya bisa dilakukan akses pusat.");
    return;
  }
  const payload = {
    app: "Ascendia Business Control",
    version: 2,
    exportedAt: new Date().toISOString(),
    data: state
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ascendia-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Backup data berhasil dibuat.", "success");
}

function importData(file) {
  if (!isAuthenticated) {
    showToast("Silakan login sebelum import data.");
    importDataInput.value = "";
    return;
  }
  if (!canManageSystemData()) {
    showToast("Import data hanya bisa dilakukan akses pusat.");
    importDataInput.value = "";
    return;
  }
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      const importedState = parsed.data || parsed;
      if (!Array.isArray(importedState.members) || !Array.isArray(importedState.admins) || !Array.isArray(importedState.stockists)) {
        throw new Error("Format backup tidak valid.");
      }
      state = normalizeState(importedState);
      if (!navByRole[state.activeRole]) state.activeRole = "admin";
      if (!getAccounts(state.activeRole).some((item) => item.id === state.activeId)) {
        state.activeId = getAccounts(state.activeRole)[0]?.id || "ADM-001";
      }
      activeView = navByRole[state.activeRole][0][0];
      clearSelections();
      saveState();
      render();
      showToast("Data backup berhasil diimport.", "success");
    } catch (error) {
      showToast(error.message || "File backup tidak bisa dibaca.");
    } finally {
      importDataInput.value = "";
    }
  });
  reader.readAsText(file);
}

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function pv(value) {
  return new Intl.NumberFormat("id-ID").format(value) + " PV";
}

function parsePvInput(value) {
  const text = String(value || "").trim().toLowerCase().replace(/\s+/g, "").replace(/pv/g, "");
  if (!text) return NaN;
  if (/^\d+(\.\d+)?k$/.test(text)) return Number(text.slice(0, -1)) * 1000;
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(text)) return Number(text.replace(/\./g, "").replace(",", "."));
  if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(text)) return Number(text.replace(/,/g, ""));
  return Number(text.replace(/[^\d.]/g, ""));
}

function bv(value) {
  return money(value * 1000);
}

function html(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function attr(value) {
  return html(value);
}

function showToast(message, type = "error") {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  toastTimer = setTimeout(() => {
    toast.className = "toast";
  }, 4200);
}

function isRootSponsor(value) {
  return String(value || "").trim().toLowerCase() === "pusat";
}

function getAccounts(role) {
  if (role === "admin") return state.admins.filter((item) => item.role === "Admin Pusat");
  if (role === "branch") return state.admins.filter((item) => item.role === "Admin Cabang");
  if (role === "stockist") return state.stockists;
  return state.members.filter((member) => memberRenewalActive(member, currentMonthValue()));
}

function currentUser() {
  if (apiSession?.user && apiSession.user.id === state.activeId) {
    const localRole = apiUserToLocalRole(apiSession.user.role);
    return {
      id: apiSession.user.id,
      name: apiSession.user.name,
      role: roleName(localRole),
      area: apiSession.user.area || "",
      district: apiSession.user.district || "",
      feeRate: Number(apiSession.user.feeRate || 0),
      rank: localRole === "member" ? apiSession.user.rank || "Member" : "",
      stockist: apiSession.user.stockistId || ""
    };
  }
  return getAccounts(state.activeRole).find((item) => item.id === state.activeId) || getAccounts(state.activeRole)[0];
}

function currentMember() {
  if (state.activeRole === "member") return state.members.find((item) => item.id === state.activeId) || state.members[0];
  return state.members[0];
}

function monthSerial(monthValue = currentMonthValue()) {
  const [year, month] = String(monthValue || currentMonthValue()).slice(0, 7).split("-").map(Number);
  return year * 12 + (month || 1) - 1;
}

function monthFromSerial(serial) {
  const year = Math.floor(serial / 12);
  const month = serial % 12 + 1;
  return `${year}-${String(month).padStart(2, "0")}`;
}

function annualRenewalWindow(member, asOfMonth = state.selectedMonth || currentMonthValue()) {
  const joinedMonth = String(member?.joinedAt || currentMonthValue()).slice(0, 7);
  const joinedSerial = monthSerial(joinedMonth);
  const asOfSerial = monthSerial(asOfMonth);
  const ageMonths = asOfSerial - joinedSerial;
  if (ageMonths < RENEWAL_MONTHS) {
    return { due: false, startMonth: joinedMonth, endMonth: asOfMonth, ageMonths, cycle: 0 };
  }
  const completedCycles = Math.floor(ageMonths / RENEWAL_MONTHS);
  const startSerial = joinedSerial + (completedCycles - 1) * RENEWAL_MONTHS;
  const endSerial = startSerial + RENEWAL_MONTHS - 1;
  return {
    due: true,
    startMonth: monthFromSerial(startSerial),
    endMonth: monthFromSerial(endSerial),
    ageMonths,
    cycle: completedCycles
  };
}

function annualPersonalPpv(member, asOfMonth = state.selectedMonth || currentMonthValue()) {
  const window = annualRenewalWindow(member, asOfMonth);
  const start = monthSerial(window.startMonth);
  const end = monthSerial(window.endMonth);
  let total = 0;
  for (let serial = start; serial <= end; serial += 1) {
    total += periodPpv(member.id, monthFromSerial(serial));
  }
  return total;
}

function memberRenewalInfo(member, asOfMonth = state.selectedMonth || currentMonthValue()) {
  if (member?.renewalFailed || member?.active === false) {
    return { due: true, startMonth: asOfMonth, endMonth: asOfMonth, ageMonths: 0, cycle: 0, annualPpv: 0, active: false, autoActive: false, override: "inactive", reason: "Failure of renewal" };
  }
  const override = String(member?.renewalOverride || "");
  const window = annualRenewalWindow(member, asOfMonth);
  const annualPpv = annualPersonalPpv(member, asOfMonth);
  const autoActive = !window.due || annualPpv >= RENEWAL_MIN_PERSONAL_PV;
  const active = override === "active" ? true : override === "inactive" ? false : autoActive;
  const reason = active
    ? override === "active" ? "Aktif" : "Aktif"
    : "Failure of renewal";
  return { ...window, annualPpv, active, autoActive, override, reason };
}

function memberRenewalActive(member, asOfMonth = state.selectedMonth || currentMonthValue()) {
  return memberRenewalInfo(member, asOfMonth).active;
}

function memberDisplayName(member, revealAdmin = false) {
  if (!member) return "";
  if (!memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue()) && !(revealAdmin && state.activeRole === "admin")) return "Failure of renewal";
  return member.name || member.id || "";
}

function memberNameCell(member, revealAdmin = false) {
  const renewal = memberRenewalInfo(member, member._calcMonth || state.selectedMonth || currentMonthValue());
  const visibleName = memberDisplayName(member, revealAdmin);
  const renewalNote = !renewal.active
    ? `<br><span class="muted">Failure of renewal${state.activeRole === "admin" ? ` - ${pv(renewal.annualPpv)}/${pv(RENEWAL_MIN_PERSONAL_PV)} renewal` : ""}</span>`
    : "";
  return `<b>${html(member.id)}</b><br><span class="muted">${html(visibleName)}</span>${renewalNote}`;
}

function renewalStatusText(member) {
  const renewal = memberRenewalInfo(member, member._calcMonth || state.selectedMonth || currentMonthValue());
  if (!renewal.active) return "Failure of renewal";
  if (renewal.override === "active") return "Aktif";
  if (!renewal.due) return "Belum jatuh tempo";
  return "Renewal terpenuhi";
}

function rankRate(member, field) {
  return ranks.find((rank) => rank.name === member.rank)?.[field] || 0;
}

function normalizeDisabledBonuses(member = {}) {
  const raw = member.disabledBonuses || {};
  const legacyAllDisabled = Boolean(member.bonusDisabled);
  return Object.fromEntries(personalBonusTypes.map((type) => [type.key, legacyAllDisabled || Boolean(raw[type.key])]));
}

function personalBonusDisabled(member, key) {
  return Boolean(normalizeDisabledBonuses(member)[key]);
}

function disabledPersonalBonusLabels(member) {
  const disabled = normalizeDisabledBonuses(member);
  return personalBonusTypes.filter((type) => disabled[type.key]).map((type) => type.label);
}

function hasDisabledPersonalBonus(member) {
  return disabledPersonalBonusLabels(member).length > 0;
}

function allPersonalBonusesDisabled(member) {
  const disabled = normalizeDisabledBonuses(member);
  return personalBonusTypes.every((type) => disabled[type.key]);
}

function calcMembers() {
  return calcMembersContext || state.members;
}

function sponsorChildrenMap(members = calcMembers()) {
  if (sponsorChildrenCache.has(members)) return sponsorChildrenCache.get(members);
  const map = new Map();
  members.forEach((member) => {
    const sponsorId = member.sponsor;
    if (!map.has(sponsorId)) map.set(sponsorId, []);
    map.get(sponsorId).push(member);
  });
  sponsorChildrenCache.set(members, map);
  return map;
}

function memberByIdMap(members = calcMembers()) {
  if (memberByIdCache.has(members)) return memberByIdCache.get(members);
  const map = new Map(members.map((member) => [member.id, member]));
  memberByIdCache.set(members, map);
  return map;
}

function sponsorChildren(id, members = calcMembers()) {
  return sponsorChildrenMap(members).get(id) || [];
}

function withCalcMembers(members, work) {
  const previous = calcMembersContext;
  const previousPayoutCapCache = payoutCapCache;
  const previousPairPoolCache = pairPoolCache;
  const previousPerformanceBonusCache = performanceBonusCache;
  const previousLeadershipBonusCache = leadershipBonusCache;
  const previousMentoringBonusCache = mentoringBonusCache;
  const previousSharingBonusCache = sharingBonusCache;
  calcMembersContext = members;
  payoutCapCache = new WeakMap();
  pairPoolCache = new WeakMap();
  performanceBonusCache = new WeakMap();
  leadershipBonusCache = new WeakMap();
  mentoringBonusCache = new WeakMap();
  sharingBonusCache = new WeakMap();
  try {
    return work();
  } finally {
    calcMembersContext = previous;
    payoutCapCache = previousPayoutCapCache;
    pairPoolCache = previousPairPoolCache;
    performanceBonusCache = previousPerformanceBonusCache;
    leadershipBonusCache = previousLeadershipBonusCache;
    mentoringBonusCache = previousMentoringBonusCache;
    sharingBonusCache = previousSharingBonusCache;
  }
}

function calcBonus(member) {
  if (!memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue())) {
    return { performance: 0, pair: 0, leadership: 0, mentoring: 0, sharing: 0, totalBv: 0, rawTotalBv: 0, rupiah: 0, blockedByRenewal: true, payoutCapFactor: 1, cappedByPayout: false };
  }
  if (!effectiveTupoDone(member)) {
    return { performance: 0, pair: 0, leadership: 0, mentoring: 0, sharing: 0, totalBv: 0, rawTotalBv: 0, rupiah: 0, blockedByTupo: true, payoutCapFactor: 1, cappedByPayout: false };
  }
  const raw = calcRawBonusComponents(member);
  const cap = payoutCapInfo();
  return { ...raw, rawTotalBv: raw.totalBv, rupiah: raw.totalBv * 1000, blockedByPersonalBonus: allPersonalBonusesDisabled(member), payoutCapFactor: 1, cappedByPayout: false, payoutCap: cap };
}

function calcRawBonusComponents(member) {
  if (!memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue())) {
    return { performance: 0, pair: 0, leadership: 0, mentoring: 0, sharing: 0, totalBv: 0, disabledPersonalBonuses: disabledPersonalBonusLabels(member) };
  }
  const performance = bonusEnabled("performance") && !personalBonusDisabled(member, "performance") ? calcPerformanceBonus(member) : 0;
  const pair = bonusEnabled("pair") && !personalBonusDisabled(member, "pair") ? calcPairBonus(member) : 0;
  const leadership = bonusEnabled("leadership") && !personalBonusDisabled(member, "leadership") ? calcLeadershipBonus(member) : 0;
  const mentoring = bonusEnabled("mentoring") && !personalBonusDisabled(member, "mentoring") ? calcMentoringBonus(member) : 0;
  const sharing = bonusEnabled("sharing") && !personalBonusDisabled(member, "sharing") ? calcSharingProfitBonus(member) : 0;
  const totalBv = performance + pair + leadership + mentoring + sharing;
  return { performance, pair, leadership, mentoring, sharing, totalBv, disabledPersonalBonuses: disabledPersonalBonusLabels(member) };
}

function bonusEnabled(key) {
  return Boolean((state.bonusSettings || defaultState.bonusSettings)[key]);
}

function rawMemberBonusPoolBv(members = calcMembers()) {
  return members.reduce((sum, member) => {
    if (!effectiveTupoDone(member)) return sum;
    return sum + calcRawBonusComponents(member).totalBv;
  }, 0);
}

function stockistFeeBvForMembers(members = calcMembers()) {
  return members.reduce((sum, member) => {
    const stockist = state.stockists.find((item) => item.id === member.stockist);
    return sum + Math.round(Number(member.ppv || 0) * Number(stockist?.feeRate || 0) / 100);
  }, 0);
}

function calcRawPairBonus(member) {
  if (!bonusEnabled("pair")) return 0;
  if (personalBonusDisabled(member, "pair")) return 0;
  if (!memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue())) return 0;
  if (!effectiveTupoDone(member)) return 0;
  const pairedPv = Math.min(member.pairLeftPv ?? member.leftPv ?? 0, member.pairRightPv ?? member.rightPv ?? 0);
  return Math.min(Math.round(pairedPv * rankRate(member, "pair") / 100), MAX_MEMBER_PAIR_BV);
}

function rawPairBonusPoolBv(members = calcMembers()) {
  return members.reduce((sum, member) => sum + calcRawPairBonus(member), 0);
}

function pairPoolInfo(members = calcMembers()) {
  if (pairPoolCache?.has(members)) return pairPoolCache.get(members);
  const companyTnpv = companyTnpvBv(members);
  const maxPayoutBv = Math.round(companyTnpv * MAX_COMPANY_PAYOUT_RATE);
  const referencePairPoolBv = Math.round(companyTnpv * MAX_PAIR_POOL_RATE);
  const rawPairBonusBv = rawPairBonusPoolBv(members);
  const rawMentoringBonusBv = rawMentoringBonusPoolBv(members, 1);
  const fixedBonusBv = fixedBonusPoolBv(members);
  const stockistFeeBv = stockistFeeBvForMembers(members);
  const fixedPayoutBv = fixedBonusBv + stockistFeeBv;
  const rawPairSystemBv = rawPairBonusBv + rawMentoringBonusBv;
  const rawProjectedPayoutBv = fixedPayoutBv + rawPairSystemBv;
  const availablePairSystemBv = Math.max(0, maxPayoutBv - fixedPayoutBv);
  const pairBonusFactor = 1;
  const maxPairPoolBv = rawPairBonusBv;
  const overPairPoolBv = Math.max(0, rawPairBonusBv - maxPairPoolBv);
  const pairPoolUsage = maxPairPoolBv ? rawPairBonusBv / maxPairPoolBv : rawPairBonusBv > 0 ? Infinity : 0;
  const info = {
    companyTnpv,
    maxPayoutBv,
    referencePairPoolBv,
    maxPairPoolBv,
    rawPairBonusBv,
    rawMentoringBonusBv,
    fixedBonusBv,
    fixedPayoutBv,
    rawPairSystemBv,
    rawProjectedPayoutBv,
    availablePairSystemBv,
    overPairPoolBv,
    pairPoolUsage,
    pairBonusFactor
  };
  if (pairPoolCache) pairPoolCache.set(members, info);
  return info;
}

function fixedBonusPoolBv(members = calcMembers()) {
  return members.reduce((sum, member) => {
    if (!memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue())) return sum;
    if (!effectiveTupoDone(member)) return sum;
    return sum
      + (bonusEnabled("performance") ? calcPerformanceBonus(member) : 0)
      + (bonusEnabled("leadership") ? calcLeadershipBonus(member) : 0)
      + (bonusEnabled("sharing") ? calcSharingProfitBonus(member) : 0);
  }, 0);
}

function payoutCapInfo(members = calcMembers()) {
  if (payoutCapCache?.has(members)) return payoutCapCache.get(members);
  const companyTnpv = companyTnpvBv(members);
  const maxPayoutBv = Math.round(companyTnpv * MAX_COMPANY_PAYOUT_RATE);
  const stockistFeeBv = stockistFeeBvForMembers(members);
  const rawMemberBonusBv = rawMemberBonusPoolBv(members);
  const projectedPayoutBv = rawMemberBonusBv + stockistFeeBv;
  const overPayoutBv = Math.max(0, projectedPayoutBv - maxPayoutBv);
  const info = { companyTnpv, maxPayoutBv, stockistFeeBv, rawMemberBonusBv, projectedPayoutBv, overPayoutBv };
  if (payoutCapCache) payoutCapCache.set(members, info);
  return info;
}

function sharingProfitParticipants(members = calcMembers()) {
  return members
    .filter((member) => memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue()) && effectiveTupoDone(member))
    .map((member) => {
      const weight = member.rank === "Director" ? 2 : member.rank === "Executive Director" ? 1 : 0;
      return { member, weight };
    })
    .filter((item) => item.weight > 0);
}

function sharingProfitPoolBv(members = calcMembers()) {
  return Math.round(companyTnpvBv(members) * 0.03);
}

function companyTnpvBv(members = calcMembers()) {
  const memberIds = new Set(members.map((member) => member.id));
  const roots = members.filter((member) => isRootSponsor(member.sponsor) || !memberIds.has(member.sponsor));
  const companyTnpv = roots.reduce((sum, member) => sum + Number(member.tnpv || 0), 0);
  return companyTnpv || members.reduce((sum, member) => sum + Number(member.ppv || 0), 0);
}

function calcSharingProfitBonus(member) {
  if (!bonusEnabled("sharing")) return 0;
  if (personalBonusDisabled(member, "sharing")) return 0;
  if (!memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue())) return 0;
  const members = calcMembers();
  return sharingProfitBonusMap(members).get(member.id) || 0;
}

function sharingProfitBonusMap(members = calcMembers()) {
  if (sharingBonusCache?.has(members)) return sharingBonusCache.get(members);
  const amounts = new Map(members.map((member) => [member.id, 0]));
  const participants = sharingProfitParticipants(members);
  const totalWeight = participants.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight) {
    const pool = sharingProfitPoolBv(members);
    participants.forEach((participant) => {
      amounts.set(participant.member.id, Math.round(pool * participant.weight / totalWeight));
    });
  }
  if (sharingBonusCache) sharingBonusCache.set(members, amounts);
  return amounts;
}

function calcSharingProfitSources(member, adjustedAmount = calcSharingProfitBonus(member)) {
  if (personalBonusDisabled(member, "sharing")) return [];
  const members = calcMembers();
  const participants = sharingProfitParticipants(members);
  const participant = participants.find((item) => item.member.id === member.id);
  if (!participant) return [];
  const totalWeight = participants.reduce((sum, item) => sum + item.weight, 0);
  const pool = sharingProfitPoolBv(members);
  return [{
    label: "Pool Sharing Profit Perusahaan",
    amount: adjustedAmount,
    note: `Pool 3% dari TNPV Perusahaan ${pv(companyTnpvBv(members))}; bobot ${member.rank} ${participant.weight}/${totalWeight}`
  }];
}

function calcPerformanceBonus(member) {
  if (!bonusEnabled("performance")) return 0;
  if (personalBonusDisabled(member, "performance")) return 0;
  if (!memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue())) return 0;
  const members = calcMembers();
  return performanceBonusMap(members).get(member.id) || 0;
}

function performanceBonusMap(members = calcMembers()) {
  if (performanceBonusCache?.has(members)) return performanceBonusCache.get(members);
  const byId = memberByIdMap(members);
  const amounts = new Map(members.map((member) => [member.id, 0]));

  members.forEach((member) => {
    if (memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue()) && effectiveTupoDone(member)) {
      amounts.set(member.id, Math.round(Number(member.ppv || 0) * rankRate(member, "performance") / 100));
    }
  });

  members.forEach((source) => {
    if (!memberRenewalActive(source, source._calcMonth || state.selectedMonth || currentMonthValue())) return;
    const sourcePpv = Number(source.ppv || 0);
    if (!sourcePpv) return;
    let highestRate = rankRate(source, "performance");
    let sponsorId = source.sponsor;
    const visited = new Set([source.id]);
    while (sponsorId && !isRootSponsor(sponsorId)) {
      const upline = byId.get(sponsorId);
      if (!upline || visited.has(upline.id)) break;
      visited.add(upline.id);
      const uplineRate = rankRate(upline, "performance");
      if (uplineRate > highestRate) {
        if (effectiveTupoDone(upline)) {
          amounts.set(upline.id, (amounts.get(upline.id) || 0) + Math.round(sourcePpv * (uplineRate - highestRate) / 100));
        }
        highestRate = uplineRate;
        if (highestRate >= 30) break;
      }
      sponsorId = upline.sponsor;
    }
  });

  if (performanceBonusCache) performanceBonusCache.set(members, amounts);
  return amounts;
}

function calcPerformanceSources(member) {
  if (!bonusEnabled("performance")) return [];
  if (personalBonusDisabled(member, "performance")) return [];
  if (!memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue())) return [];
  if (!effectiveTupoDone(member)) return [];
  const earnerRate = rankRate(member, "performance");
  if (!earnerRate) return [];
  const sources = [];
  const personalBonus = Math.round(Number(member.ppv || 0) * earnerRate / 100);
  if (personalBonus) sources.push({ label: `${memberDisplayName(member)} - PPV pribadi`, amount: personalBonus, note: `${earnerRate}% dari ${pv(member.ppv || 0)}` });

  const members = calcMembers();
  const walk = (downline, depth, highestPaidRate, visited = new Set([member.id])) => {
    if (visited.has(downline.id)) return;
    visited.add(downline.id);
    const downlineRate = rankRate(downline, "performance");
    if (downlineRate >= earnerRate) {
      sources.push({
        label: `${memberDisplayName(downline)} (${downline.id})`,
        amount: 0,
        note: `G${depth}, jalur prestasi berhenti karena peringkat ${downline.rank} memiliki rate ${downlineRate}%`
      });
      return;
    }
    const pathPaidRate = Math.max(highestPaidRate, downlineRate);
    const appliedRate = Math.max(0, earnerRate - pathPaidRate);
    const amount = Math.round(Number(downline.ppv || 0) * appliedRate / 100);
    if (amount) {
      sources.push({
        label: `${memberDisplayName(downline)} (${downline.id})`,
        amount,
        note: `G${depth}, selisih ${earnerRate}% - rate tertinggi jalur ${pathPaidRate}% = ${appliedRate}% dari ${pv(downline.ppv || 0)}`
      });
    }
    sponsorChildren(downline.id, members)
      .forEach((child) => walk(child, depth + 1, pathPaidRate, new Set(visited)));
  };

  sponsorChildren(member.id, members).forEach((downline) => walk(downline, 1, 0));
  return sources;
}

function calcPairBonus(member) {
  if (!bonusEnabled("pair")) return 0;
  if (personalBonusDisabled(member, "pair")) return 0;
  const rawAmount = calcRawPairBonus(member);
  if (!rawAmount) return 0;
  const { pairBonusFactor } = pairPoolInfo();
  return pairBonusFactor >= 1 ? rawAmount : Math.floor(rawAmount * pairBonusFactor);
}

function calcPairSources(member) {
  if (!bonusEnabled("pair")) return [];
  if (personalBonusDisabled(member, "pair")) return [];
  const amount = calcPairBonus(member);
  if (!amount) return [];
  const leftBasis = member.pairLeftPv ?? member.leftPv ?? 0;
  const rightBasis = member.pairRightPv ?? member.rightPv ?? 0;
  const pairedPv = Math.min(leftBasis, rightBasis);
  const carryNote = Number(member.carryInLeft || 0) || Number(member.carryInRight || 0)
    ? `; termasuk carry masuk kiri ${pv(member.carryInLeft || 0)} kanan ${pv(member.carryInRight || 0)}`
    : "";
  return [{
    label: "Kaki kiri dan kanan",
    amount,
    note: `${rankRate(member, "pair")}% dari kaki terlemah ${pv(pairedPv)} (kiri ${pv(leftBasis)}, kanan ${pv(rightBasis)})${carryNote}`
  }];
}

function allowedLeadershipGenerations(rankName) {
  if (rankIndex[rankName] >= rankIndex["Director"]) return 5;
  if (rankName === "Leader Majestic") return 4;
  if (rankName === "Leader Ambassador") return 2;
  if (rankName === "Crown Star") return 1;
  return 0;
}

function allowedMentoringGenerations(rankName) {
  if (rankIndex[rankName] >= rankIndex["Leader Majestic"]) return 4;
  if (rankName === "Leader Ambassador") return 3;
  if (rankName === "Crown Star") return 2;
  if (rankName === "Royal Star") return 1;
  return 0;
}

function generationMembers(rootId, depth) {
  const members = calcMembers();
  let cursor = [rootId];
  const levels = [];
  const visited = new Set(cursor);
  for (let index = 0; index < depth; index += 1) {
    const next = cursor.flatMap((parentId) => sponsorChildren(parentId, members)).filter((member) => !visited.has(member.id));
    levels.push(next);
    cursor = next.map((member) => member.id);
    cursor.forEach((id) => visited.add(id));
    if (!cursor.length) break;
  }
  return levels;
}

function calcLeadershipBonus(member) {
  if (!bonusEnabled("leadership")) return 0;
  if (personalBonusDisabled(member, "leadership")) return 0;
  if (!memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue())) return 0;
  const members = calcMembers();
  if (leadershipBonusCache) {
    let cache = leadershipBonusCache.get(members);
    if (!cache) {
      cache = new Map();
      leadershipBonusCache.set(members, cache);
    }
    if (cache.has(member.id)) return cache.get(member.id);
  }
  const rates = [3, 1.5, 1.5, 1, 1];
  const amount = generationMembers(member.id, allowedLeadershipGenerations(member.rank)).reduce((sum, level, index) => {
    const sameRankGpv = level
      .filter((downline) => downline.rank === member.rank && memberRenewalActive(downline, downline._calcMonth || state.selectedMonth || currentMonthValue()))
      .reduce((levelSum, downline) => levelSum + Number(downline.gpv || 0), 0);
    return sum + Math.round(sameRankGpv * rates[index] / 100);
  }, 0);
  if (leadershipBonusCache) leadershipBonusCache.get(members)?.set(member.id, amount);
  return amount;
}

function calcLeadershipSources(member) {
  if (!bonusEnabled("leadership")) return [];
  if (personalBonusDisabled(member, "leadership")) return [];
  if (!memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue())) return [];
  const rates = [3, 1.5, 1.5, 1, 1];
  return generationMembers(member.id, allowedLeadershipGenerations(member.rank)).flatMap((level, index) =>
    level
      .filter((downline) => downline.rank === member.rank && memberRenewalActive(downline, downline._calcMonth || state.selectedMonth || currentMonthValue()))
      .map((downline) => ({
        label: `${memberDisplayName(downline)} (${downline.id})`,
        amount: Math.round(Number(downline.gpv || 0) * rates[index] / 100),
        note: `G${index + 1}, peringkat sama, ${rates[index]}% dari GPV ${pv(downline.gpv || 0)}`
      }))
      .filter((source) => source.amount > 0)
  );
}

function calcMentoringBonus(member) {
  if (!bonusEnabled("mentoring") || !bonusEnabled("pair")) return 0;
  if (personalBonusDisabled(member, "mentoring")) return 0;
  if (!memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue())) return 0;
  const { pairBonusFactor } = pairPoolInfo();
  return calcMentoringBonusWithPairFactor(member, pairBonusFactor);
}

function calcPairBonusWithFactor(member, pairBonusFactor) {
  if (!bonusEnabled("pair")) return 0;
  if (personalBonusDisabled(member, "pair")) return 0;
  return calcRawPairBonus(member);
}

function calcMentoringBonusWithPairFactor(member, pairBonusFactor) {
  if (!bonusEnabled("mentoring") || !bonusEnabled("pair")) return 0;
  if (personalBonusDisabled(member, "mentoring")) return 0;
  if (!memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue())) return 0;
  const members = calcMembers();
  if (mentoringBonusCache) {
    let cache = mentoringBonusCache.get(members);
    if (!cache) {
      cache = new Map();
      mentoringBonusCache.set(members, cache);
    }
    const key = `${member.id}:${Math.round(pairBonusFactor * 1000000)}`;
    if (cache.has(key)) return cache.get(key);
  }
  if (!effectiveTupoDone(member)) return 0;
  const depth = allowedMentoringGenerations(member.rank);
  if (!depth) return 0;
  const rates = [5, 3, 2, 2];
  const amount = generationMembers(member.id, depth).reduce((sum, level, index) => {
    const pairBonusFromLevel = level.reduce((levelSum, downline) => levelSum + calcPairBonusWithFactor(downline, pairBonusFactor), 0);
    return sum + Math.round(pairBonusFromLevel * rates[index] / 100);
  }, 0);
  if (mentoringBonusCache) {
    const cache = mentoringBonusCache.get(members);
    cache?.set(`${member.id}:${Math.round(pairBonusFactor * 1000000)}`, amount);
  }
  return amount;
}

function rawMentoringBonusPoolBv(members = calcMembers(), pairBonusFactor = 1) {
  if (!bonusEnabled("mentoring") || !bonusEnabled("pair")) return 0;
  const byId = memberByIdMap(members);
  const rates = [5, 3, 2, 2];
  const buckets = new Map();

  members.forEach((downline) => {
    const pairBonus = calcPairBonusWithFactor(downline, pairBonusFactor);
    if (!pairBonus) return;
    let sponsorId = downline.sponsor;
    for (let generation = 1; generation <= rates.length; generation += 1) {
      const upline = byId.get(sponsorId);
      if (!upline) break;
      if (effectiveTupoDone(upline) && !personalBonusDisabled(upline, "mentoring") && allowedMentoringGenerations(upline.rank) >= generation) {
        const key = `${upline.id}:${generation}`;
        buckets.set(key, (buckets.get(key) || 0) + pairBonus);
      }
      sponsorId = upline.sponsor;
    }
  });

  return [...buckets.entries()].reduce((sum, [key, pairBonusTotal]) => {
    const generation = Number(key.split(":")[1]);
    return sum + Math.round(pairBonusTotal * rates[generation - 1] / 100);
  }, 0);
}

function calcMentoringSources(member) {
  if (!bonusEnabled("mentoring") || !bonusEnabled("pair")) return [];
  if (personalBonusDisabled(member, "mentoring")) return [];
  if (!memberRenewalActive(member, member._calcMonth || state.selectedMonth || currentMonthValue())) return [];
  const depth = allowedMentoringGenerations(member.rank);
  if (!depth) return [];
  const rates = [5, 3, 2, 2];
  return generationMembers(member.id, depth).flatMap((level, index) =>
    level
      .map((downline) => {
        const pairBonus = calcPairBonus(downline);
        return {
          label: `${memberDisplayName(downline)} (${downline.id})`,
          amount: Math.round(pairBonus * rates[index] / 100),
          note: `G${index + 1}, ${rates[index]}% dari bonus pasangan ${bv(pairBonus)}`
        };
      })
      .filter((source) => source.amount > 0)
  );
}

function findLoginAccount(loginId) {
  const id = String(loginId || "").trim();
  if (!id) return null;
  const admin = state.admins.find((item) => sameText(item.id, id));
  if (admin) {
    return {
      role: admin.role === "Admin Cabang" ? "branch" : "admin",
      account: admin
    };
  }
  const stockist = state.stockists.find((item) => sameText(item.id, id));
  if (stockist) return { role: "stockist", account: stockist };
  const member = state.members.find((item) => sameText(item.id, id));
  if (member) return { role: "member", account: member };
  return null;
}

async function login() {
  const loginId = String(loginIdInput.value || "").trim();
  if (!loginId) {
    showToast("Masukkan Login ID.");
    loginIdInput.focus();
    return;
  }
  const password = String(passwordInput.value || "");

  if (typeof fetch === "function" && location.protocol !== "file:") {
    try {
      const session = await apiLogin(loginId, password);
      saveApiSession(session);
      state.activeRole = apiUserToLocalRole(session.user.role);
      state.activeId = session.user.id;
      menuVisibilityState.loaded = false;
      activeView = roleNavItems(state.activeRole)[0][0];
      isAuthenticated = true;
      sessionStorage.setItem(SESSION_KEY, "1");
      resetServerMembersPagination();
      loginIdInput.value = "";
      passwordInput.value = "";
      saveState();
      render();
      showToast("Login berhasil.", "success");
      return;
    } catch (error) {
      if (error.status === 401) {
        showToast("Login ID atau sandi salah.");
        passwordInput.focus();
        return;
      }
      console.warn("Backend login belum tersedia, memakai mode lokal.", error);
    }
  }

  const found = findLoginAccount(loginId);
  const account = found?.account;
  const role = found?.role;
  if (!account || String(passwordInput.value || "") !== String(account.password || "")) {
    showToast("Login ID atau sandi salah.");
    passwordInput.focus();
    return;
  }
  if (role === "member" && !memberRenewalActive(account, currentMonthValue())) {
    showToast("Akun member tidak aktif: Failure of renewal. Hubungi layanan perusahaan.");
    return;
  }
  state.activeRole = role;
  state.activeId = account.id;
  activeView = roleNavItems(state.activeRole)[0][0];
  isAuthenticated = true;
  saveApiSession(null);
  sessionStorage.setItem(SESSION_KEY, "1");
  resetServerMembersPagination();
  loginIdInput.value = "";
  passwordInput.value = "";
  saveState();
  render();
  showToast("Login berhasil.", "success");
}

function logout() {
  isAuthenticated = false;
  saveApiSession(null);
  menuVisibilityState.loaded = false;
  resetServerMembersPagination();
  sessionStorage.removeItem(SESSION_KEY);
  loginIdInput.value = "";
  passwordInput.value = "";
  nav.innerHTML = "";
  render();
  showToast("Sesi sudah ditutup.", "success");
}

function render() {
  const user = currentUser();
  const canManageSystem = canManageSystemData();
  document.body.classList.toggle("is-authenticated", isAuthenticated);
  loginBox.hidden = isAuthenticated;
  exportDataBtn.hidden = !canManageSystem;
  importDataBtn.hidden = !canManageSystem;
  resetDataBtn.hidden = !canManageSystem;
  exportDataBtn.disabled = !canManageSystem;
  importDataBtn.disabled = !canManageSystem;
  resetDataBtn.disabled = !canManageSystem;
  logoutBtn.disabled = !isAuthenticated;
  if (!isAuthenticated) {
    loginBox.hidden = false;
    activeUser.textContent = "Belum login";
    roleLabel.textContent = "Login";
    pageTitle.textContent = "Masuk ke Ascendia";
    nav.innerHTML = "";
    content.innerHTML = `
      <article class="card">
        <h3>Login Akun</h3>
        <p class="muted">Masukkan Login ID dan sandi akun untuk membuka dashboard sesuai akses Anda.</p>
      </article>
    `;
    return;
  }
  if (state.activeRole === "member") {
    const rawMember = state.members.find((item) => item.id === state.activeId);
    if (rawMember && !memberRenewalActive(rawMember, currentMonthValue())) {
      isAuthenticated = false;
      sessionStorage.removeItem(SESSION_KEY);
      loginBox.hidden = false;
      activeUser.textContent = "Belum login";
      roleLabel.textContent = "Login";
      pageTitle.textContent = "Akun Tidak Aktif";
      nav.innerHTML = "";
      content.innerHTML = `<article class="card"><h3>Failure of renewal</h3><p class="muted">Akun member tidak aktif karena renewal tahunan belum terpenuhi. Hubungi layanan perusahaan untuk pemeriksaan status.</p></article>`;
      return;
    }
  }
  loadMenuVisibility();
  ensureAllowedActiveView();
  activeUser.textContent = user ? `${user.name} (${user.id})` : "Belum login";
  roleLabel.textContent = roleName(state.activeRole);
  const navItems = roleNavItems(state.activeRole);
  const activeNav = navItems.find(([key]) => key === activeView) || navItems[0];
  pageTitle.textContent = activeNav[1];
  nav.innerHTML = navItems.map(([key, label, icon]) => `
    <button class="${key === activeView ? "active" : ""}" data-view="${key}">
      <span>${html(icon)}</span><span>${html(label)}</span>
    </button>
  `).join("");
  content.innerHTML = views[activeView] ? views[activeView]() : views.dashboard();
  attachViewEvents();
}

function roleName(role) {
  return { admin: "Admin Pusat", branch: "Admin Cabang", stockist: "Stokis", member: "Member" }[role];
}

function kpiCard(label, value, note) {
  return `<article class="card metric"><span>${html(label)}</span><strong>${html(value)}</strong><span>${html(note)}</span></article>`;
}

function normalizeSearch(value) {
  return String(value ?? "").toLowerCase().trim();
}

function matchesSearch(item, term, extra = []) {
  const query = normalizeSearch(term);
  if (!query) return true;
  return Object.values(item).concat(extra).some((value) => normalizeSearch(value).includes(query));
}

function searchBox(key, placeholder) {
  const value = searchTerms[key] || "";
  return `
    <label class="search-box">
      <span>Cari</span>
      <input data-search="${attr(key)}" value="${attr(value)}" placeholder="${attr(placeholder)}">
    </label>
  `;
}

function controlPanel(title, controls, note = "") {
  return `
    <article class="card compact-toolbar control-panel">
      <div class="toolbar">
        <div>
          <h3>${html(title)}</h3>
          ${note ? `<p class="muted">${html(note)}</p>` : ""}
        </div>
        <div class="toolbar-actions control-fields">
          ${controls.filter(Boolean).join("")}
        </div>
      </div>
    </article>
  `;
}

function monthControl(label = "Bulan & Tahun", field = "selectedMonth") {
  const monthValue = state[field] || state.selectedMonth || currentMonthValue();
  const [year, month] = String(monthValue).slice(0, 7).split("-");
  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const value = String(index + 1).padStart(2, "0");
    const name = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(new Date(2026, index, 1));
    return `<option value="${value}" ${value === month ? "selected" : ""}>${html(name)}</option>`;
  }).join("");
  return `
    <label class="search-box">
      <span>${html(label.includes("Bulan") ? "Bulan" : label)}</span>
      <select data-month-part-field="${attr(field)}">${monthOptions}</select>
    </label>
    <label class="search-box">
      <span>Tahun</span>
      <input type="number" min="2020" max="2100" step="1" data-month-year-field="${attr(field)}" value="${attr(year || selectedYearValue(monthValue))}">
    </label>
  `;
}

function yearControl(label = "Tahun", field = "selectedMonth") {
  const monthValue = state[field] || state.selectedMonth || currentMonthValue();
  return `
    <label class="search-box">
      <span>${html(label)}</span>
      <input type="number" min="2020" max="2100" step="1" data-year-field="${attr(field)}" value="${attr(selectedYearValue(monthValue))}">
    </label>
  `;
}

function paymentPeriodControl(label = "Periode") {
  return `
    <label class="search-box">
      <span>${html(label)}</span>
      <select data-payment-period-field>
        <option value="1" ${paymentPeriodValue() === "1" ? "selected" : ""}>Periode 1 - Tutup buku 11</option>
        <option value="2" ${paymentPeriodValue() === "2" ? "selected" : ""}>Periode 2 - Tutup buku 27</option>
      </select>
    </label>
  `;
}

function adminReportScopeControl(label = "Tampilan") {
  const scope = adminReportScopeValue();
  return `
    <label class="search-box">
      <span>${html(label)}</span>
      <select data-admin-report-scope-field>
        <option value="payment" ${scope === "payment" ? "selected" : ""}>Periode Pembayaran</option>
        <option value="month" ${scope === "month" ? "selected" : ""}>1 Bulan Full</option>
        <option value="year" ${scope === "year" ? "selected" : ""}>1 Tahun</option>
      </select>
    </label>
  `;
}

function memberBonusScopeControl(label = "Tampilan") {
  const scope = memberBonusScopeValue();
  return `
    <label class="search-box">
      <span>${html(label)}</span>
      <select data-member-bonus-scope-field>
        <option value="payment" ${scope === "payment" ? "selected" : ""}>Periode Pembayaran</option>
        <option value="month" ${scope === "month" ? "selected" : ""}>1 Bulan Full</option>
        <option value="year" ${scope === "year" ? "selected" : ""}>1 Tahun</option>
      </select>
    </label>
  `;
}

function companyFundScopeControl(label = "Tampilan") {
  const scope = companyFundScopeValue();
  return `
    <label class="search-box">
      <span>${html(label)}</span>
      <select data-company-fund-scope-field>
        <option value="payment" ${scope === "payment" ? "selected" : ""}>Periode Pembayaran</option>
        <option value="month" ${scope === "month" ? "selected" : ""}>1 Bulan Full</option>
        <option value="year" ${scope === "year" ? "selected" : ""}>1 Tahun</option>
      </select>
    </label>
  `;
}

function stockistPaymentScopeControl(label = "Tampilan") {
  const scope = stockistPaymentScopeValue();
  return `
    <label class="search-box">
      <span>${html(label)}</span>
      <select data-stockist-payment-scope-field>
        <option value="payment" ${scope === "payment" ? "selected" : ""}>Periode Pembayaran</option>
        <option value="month" ${scope === "month" ? "selected" : ""}>1 Bulan Full</option>
        <option value="year" ${scope === "year" ? "selected" : ""}>1 Tahun</option>
      </select>
    </label>
  `;
}

function revenuePeriodControl(label = "Periode") {
  return `
    <label class="search-box">
      <span>${html(label)}</span>
      <select data-revenue-period-field>
        <option value="1" ${revenuePeriodValue() === "1" ? "selected" : ""}>Periode 1 - Tutup buku 11</option>
        <option value="2" ${revenuePeriodValue() === "2" ? "selected" : ""}>Periode 2 - Tutup buku 27</option>
      </select>
    </label>
  `;
}

function monthToolbar(title = "Filter Bulan Omset", field = "selectedMonth") {
  return controlPanel(title, [monthControl("Bulan & Tahun", field)]);
}

function paymentPeriodToolbar(title = "Periode Pembayaran Komisi") {
  return controlPanel(title, [paymentPeriodControl()]);
}

function memberBonusScopeValue(value = state.memberBonusScope) {
  return ["month", "year"].includes(String(value || "")) ? String(value) : "payment";
}

function adminReportScopeValue(value = state.adminReportScope) {
  return ["month", "year"].includes(String(value || "")) ? String(value) : "payment";
}

function adminReportScopeLabel(value = state.adminReportScope) {
  const scope = adminReportScopeValue(value);
  if (scope === "year") return "1 Tahun";
  if (scope === "month") return "1 Bulan Full";
  return "Periode Pembayaran";
}

function adminReportScopeToolbar(title = "Tampilan Admin") {
  return controlPanel(title, [adminReportScopeControl()]);
}

function memberBonusScopeLabel(value = state.memberBonusScope) {
  const scope = memberBonusScopeValue(value);
  if (scope === "year") return "1 Tahun";
  if (scope === "month") return "1 Bulan Full";
  return "Periode Pembayaran";
}

function memberBonusScopeToolbar(title = "Tampilan Bonus Member") {
  return controlPanel(title, [memberBonusScopeControl()]);
}

function companyFundScopeValue(value = state.companyFundScope) {
  return ["payment", "year"].includes(String(value || "")) ? String(value) : "month";
}

function companyFundScopeLabel(value = state.companyFundScope) {
  const scope = companyFundScopeValue(value);
  if (scope === "year") return "1 Tahun";
  if (scope === "payment") return "Periode Pembayaran";
  return "1 Bulan Full";
}

function companyFundScopeToolbar(title = "Tampilan Dana Kelola") {
  return controlPanel(title, [companyFundScopeControl()]);
}

function stockistPaymentScopeValue(value = state.stockistPaymentScope) {
  return ["month", "year"].includes(String(value || "")) ? String(value) : "payment";
}

function stockistPaymentScopeLabel(value = state.stockistPaymentScope) {
  const scope = stockistPaymentScopeValue(value);
  if (scope === "year") return "1 Tahun";
  if (scope === "month") return "1 Bulan Full";
  return "Periode Pembayaran";
}

function stockistPaymentScopeToolbar(title = "Tampilan Stokis") {
  return controlPanel(title, [stockistPaymentScopeControl()]);
}

function revenuePeriodValue(value = state.revenuePeriod) {
  return String(value || "1") === "2" ? "2" : "1";
}

function revenuePeriodLabel(value = state.revenuePeriod) {
  return revenuePeriodValue(value) === "2" ? "Periode 2 - Tutup buku 27" : "Periode 1 - Tutup buku 11";
}

function revenuePeriodKey(value = state.revenuePeriod) {
  return revenuePeriodValue(value) === "2" ? "ppvP2" : "ppvP1";
}

function revenuePeriodToolbar(title = "Periode Omset") {
  return controlPanel(title, [revenuePeriodControl()]);
}

function monthLabel(monthValue = state.selectedMonth) {
  const [year, month] = monthValue.split("-");
  return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(Number(year), Number(month) - 1, 1));
}

function selectedMonthLabel() {
  return monthLabel(state.selectedMonth);
}

function previousMonthValue(monthValue) {
  const [year, month] = String(monthValue || currentMonthValue()).split("-").map(Number);
  const date = new Date(year, month - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function nextMonthValue(monthValue) {
  const [year, month] = String(monthValue || currentMonthValue()).split("-").map(Number);
  const date = new Date(year, month, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function commissionSourcePeriod(paymentMonth = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  if (paymentPeriodValue(paymentPeriod) === "2") {
    return { month: paymentMonth, revenuePeriod: "1" };
  }
  return { month: previousMonthValue(paymentMonth), revenuePeriod: "2" };
}

function commissionSourceLabel(paymentMonth = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  const source = commissionSourcePeriod(paymentMonth, paymentPeriod);
  return `${revenuePeriodLabel(source.revenuePeriod)} ${monthLabel(source.month)}`;
}

function memberInMonth(member, month = state.selectedMonth) {
  if (!member.joinedAt || !month) return true;
  return member.joinedAt.startsWith(month);
}

function memberInSelectedMonth(member) {
  return memberInMonth(member, state.selectedMonth);
}

function monthIsAfterJoin(member) {
  if (!member.joinedAt || !state.selectedMonth) return true;
  return member.joinedAt.slice(0, 7) <= state.selectedMonth;
}

function periodStore(month = state.selectedMonth) {
  state.periods = state.periods || {};
  state.periods[month] = state.periods[month] || {};
  return state.periods[month];
}

function periodPpv(memberId, month = state.selectedMonth) {
  const record = (state.periods || {})[month]?.[memberId] || {};
  if (Object.prototype.hasOwnProperty.call(record, "ppvP1") || Object.prototype.hasOwnProperty.call(record, "ppvP2")) {
    return Number(record.ppvP1 || 0) + Number(record.ppvP2 || 0);
  }
  return Number(record.ppv || 0);
}

function periodPpvForRevenuePeriod(memberId, month = state.selectedMonth, revenuePeriod = state.revenuePeriod) {
  const record = (state.periods || {})[month]?.[memberId] || {};
  if (Object.prototype.hasOwnProperty.call(record, "ppvP1") || Object.prototype.hasOwnProperty.call(record, "ppvP2")) {
    return Number(record[revenuePeriodKey(revenuePeriod)] || 0);
  }
  return revenuePeriodValue(revenuePeriod) === "1" ? Number(record.ppv || 0) : 0;
}

function periodTupoDone(memberId, month = state.selectedMonth) {
  return Boolean((state.periods || {})[month]?.[memberId]?.tupoDone);
}

function periodTupoBlocked(memberId, month = state.selectedMonth) {
  return Boolean((state.periods || {})[month]?.[memberId]?.tupoBlocked);
}

function paymentPeriodValue(value = state.paymentPeriod) {
  return String(value || "1") === "2" ? "2" : "1";
}

function paymentPeriodLabel(value = state.paymentPeriod) {
  return paymentPeriodValue(value) === "2" ? "Periode 2 - Tutup buku 27" : "Periode 1 - Tutup buku 11";
}

function paymentPeriodKey(value = state.paymentPeriod) {
  return paymentPeriodValue(value) === "2" ? "paidDoneP2" : "paidDoneP1";
}

function periodPaymentDone(memberId, month = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  const record = (state.periods || {})[month]?.[memberId] || {};
  const hasSplitStatus = Object.prototype.hasOwnProperty.call(record, "paidDoneP1") || Object.prototype.hasOwnProperty.call(record, "paidDoneP2");
  return hasSplitStatus ? Boolean(record[paymentPeriodKey(paymentPeriod)]) : Boolean(record.paidDone);
}

function stockistFeePaymentStore(month = state.selectedMonth) {
  const store = periodStore(month);
  store._stockistFees = store._stockistFees || {};
  return store._stockistFees;
}

function stockistFeePaymentDone(stockistId, month = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  const store = (state.periods || {})[month]?._stockistFees || {};
  return Boolean(store[stockistId]?.[paymentPeriodKey(paymentPeriod)]);
}

function setStockistFeePaymentDone(stockistId, value, month = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  const store = stockistFeePaymentStore(month);
  store[stockistId] = { ...(store[stockistId] || {}), [paymentPeriodKey(paymentPeriod)]: Boolean(value) };
}

function stockistFeePaymentTargets(scope = stockistPaymentScopeValue(), month = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  if (scope === "year") {
    return dataMonthsForYear(selectedYearValue(month)).flatMap((periodMonth) => [
      { month: periodMonth, paymentPeriod: "2", label: `P2 ${monthLabel(periodMonth)}` },
      { month: nextMonthValue(periodMonth), paymentPeriod: "1", label: `P1 ${monthLabel(nextMonthValue(periodMonth))}` }
    ]);
  }
  if (scope === "month") {
    return [
      { month, paymentPeriod: "2", label: `P2 ${monthLabel(month)}` },
      { month: nextMonthValue(month), paymentPeriod: "1", label: `P1 ${monthLabel(nextMonthValue(month))}` }
    ];
  }
  return [{ month, paymentPeriod: paymentPeriodValue(paymentPeriod), label: paymentPeriodLabel(paymentPeriod) }];
}

function stockistFeePaymentDoneForScope(stockistId, scope = stockistPaymentScopeValue(), month = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  const targets = stockistFeePaymentTargets(scope, month, paymentPeriod);
  return targets.length > 0 && targets.every((target) => stockistFeePaymentDone(stockistId, target.month, target.paymentPeriod));
}

function setStockistFeePaymentDoneForScope(stockistId, checked, scope = stockistPaymentScopeValue(), month = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  stockistFeePaymentTargets(scope, month, paymentPeriod).forEach((target) => {
    setStockistFeePaymentDone(stockistId, checked, target.month, target.paymentPeriod);
  });
}

function accumulatedPpv(memberId, month = state.selectedMonth, joinedAt = "") {
  const joinedMonth = joinedAt ? String(joinedAt).slice(0, 7) : "";
  return Object.entries(state.periods || {}).reduce((sum, [periodMonth, members]) => {
    if (month && periodMonth > month) return sum;
    if (joinedMonth && periodMonth < joinedMonth) return sum;
    return sum + periodPpv(memberId, periodMonth);
  }, 0);
}

function setPeriodPpv(memberId, value, month = state.selectedMonth, revenuePeriod = state.revenuePeriod) {
  const store = periodStore(month);
  const previous = store[memberId] || {};
  const hasSplitPpv = Object.prototype.hasOwnProperty.call(previous, "ppvP1") || Object.prototype.hasOwnProperty.call(previous, "ppvP2");
  const base = hasSplitPpv ? previous : { ...previous, ppvP1: Number(previous.ppv || 0), ppvP2: 0 };
  const next = { ...base, [revenuePeriodKey(revenuePeriod)]: Number(value || 0) };
  next.ppv = Number(next.ppvP1 || 0) + Number(next.ppvP2 || 0);
  store[memberId] = next;
}

function setPeriodTupoDone(memberId, value, month = state.selectedMonth) {
  const store = periodStore(month);
  store[memberId] = { ...(store[memberId] || {}), tupoDone: Boolean(value), tupoBlocked: !value };
}

function clearPeriodTupoOverride(memberId, month = state.selectedMonth) {
  const store = periodStore(month);
  store[memberId] = { ...(store[memberId] || {}), tupoDone: false, tupoBlocked: false };
}

function setPeriodPaymentDone(memberId, value, month = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  const store = periodStore(month);
  store[memberId] = { ...(store[memberId] || {}), [paymentPeriodKey(paymentPeriod)]: Boolean(value) };
}

function periodDataForMember(memberId) {
  return Object.fromEntries(Object.entries(state.periods || {})
    .filter(([, period]) => period && Object.prototype.hasOwnProperty.call(period, memberId))
    .map(([month, period]) => [month, structuredClone(period[memberId])]));
}

function removePeriodDataForMembers(memberIds) {
  const ids = new Set(memberIds.filter(Boolean));
  Object.values(state.periods || {}).forEach((period) => {
    ids.forEach((id) => delete period[id]);
  });
}

function archiveDeletedMembers(memberIds) {
  if (!Array.isArray(state.deletedMembers)) state.deletedMembers = [];
  const ids = new Set(memberIds.filter(Boolean));
  const deletedAt = new Date().toISOString();
  const entries = state.members
    .map((member, index) => ({ member, index }))
    .filter(({ member }) => ids.has(member.id))
    .map(({ member, index }) => ({
      id: member.id,
      deletedAt,
      originalIndex: index,
      member: structuredClone(member),
      periods: periodDataForMember(member.id)
    }));
  if (!entries.length) return;
  const archivedIds = new Set(entries.map((entry) => entry.id));
  state.deletedMembers = [
    ...entries,
    ...state.deletedMembers.filter((entry) => !archivedIds.has(entry.id))
  ].slice(0, 100);
}

function restoreDeletedMember(memberId) {
  const entry = (state.deletedMembers || []).find((item) => item.id === memberId);
  if (!entry) {
    showToast("Data pemulihan member tidak ditemukan.");
    return;
  }
  if (state.members.some((member) => member.id === memberId)) {
    showToast(`ID ${memberId} sudah ada. Ubah ID aktif lebih dulu sebelum memulihkan.`);
    return;
  }
  const restoredMember = structuredClone(entry.member);
  const insertIndex = Number.isInteger(entry.originalIndex)
    ? Math.max(0, Math.min(entry.originalIndex, state.members.length))
    : state.members.length;
  state.members.splice(insertIndex, 0, restoredMember);
  Object.entries(entry.periods || {}).forEach(([month, record]) => {
    const store = periodStore(month);
    store[memberId] = structuredClone(record);
  });
  state.deletedMembers = (state.deletedMembers || []).filter((item) => item.id !== memberId);
  recomputeMetrics();
  syncPersistentMemberProgress(state.selectedMonth);
  clearSelections();
  saveState();
  render();
  showToast(`Member ${memberId} berhasil dipulihkan.`, "success");
}

function deletedItemLabel(type) {
  return {
    stockist: "Stokis",
    announcement: "Pengumuman",
    admin: "Pengelola"
  }[type] || "Data";
}

function archiveDeletedItems(type, ids) {
  if (type === "member") return archiveDeletedMembers(ids);
  if (!Array.isArray(state.deletedItems)) state.deletedItems = [];
  const list = collection(type);
  const selected = new Set(ids.filter(Boolean));
  const deletedAt = new Date().toISOString();
  const entries = list
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => selected.has(item.id))
    .map(({ item, index }) => ({
      type,
      id: item.id,
      deletedAt,
      originalIndex: index,
      item: structuredClone(item)
    }));
  if (!entries.length) return;
  const keys = new Set(entries.map((entry) => `${entry.type}:${entry.id}`));
  state.deletedItems = [
    ...entries,
    ...state.deletedItems.filter((entry) => !keys.has(`${entry.type}:${entry.id}`))
  ].slice(0, 100);
}

function restoreDeletedItem(type, id) {
  if (type === "member") return restoreDeletedMember(id);
  const entry = (state.deletedItems || []).find((item) => item.type === type && item.id === id);
  if (!entry) {
    showToast("Data pemulihan tidak ditemukan.");
    return;
  }
  const list = collection(type);
  if (list.some((item) => item.id === id)) {
    showToast(`ID ${id} sudah ada. Ubah ID aktif lebih dulu sebelum memulihkan.`);
    return;
  }
  const insertIndex = Number.isInteger(entry.originalIndex)
    ? Math.max(0, Math.min(entry.originalIndex, list.length))
    : list.length;
  list.splice(insertIndex, 0, structuredClone(entry.item));
  state.deletedItems = (state.deletedItems || []).filter((item) => !(item.type === type && item.id === id));
  recomputeMetrics();
  clearSelections();
  saveState();
  render();
  showToast(`${deletedItemLabel(type)} ${id} berhasil dipulihkan.`, "success");
}

function computedMembersForMonth(month = state.selectedMonth, sourceMembers = filteredMembers()) {
  const members = sourceMembers
    .filter((member) => !member.joinedAt || !month || member.joinedAt.slice(0, 7) <= month)
    .map((member) => ({
      ...member,
      _calcMonth: month,
      _renewal: memberRenewalInfo(member, month),
      renewalActive: memberRenewalActive(member, month),
      ppv: periodPpv(member.id, month),
      tupoPpv: periodPpv(member.id, month),
      tupoDone: periodTupoDone(member.id, month),
      tupoBlocked: periodTupoBlocked(member.id, month),
      paidDone: periodPaymentDone(member.id, month),
      cpv: accumulatedPpv(member.id, month, member.joinedAt),
      tnpv: 0,
      atnpv: 0,
      gpv: 0,
      leftPv: 0,
      rightPv: 0
    }));
  return recomputeMetrics(members);
}

function computedMembersForRevenuePeriod(month, revenuePeriod, sourceMembers = state.members) {
  const members = computedMembersForMonth(month, sourceMembers)
    .map((member) => ({
      ...member,
      tupoPpv: periodPpv(member.id, month),
      ppv: periodPpvForRevenuePeriod(member.id, month, revenuePeriod)
    }));
  return recomputeMetrics(members);
}

function commissionMembersForPayment(paymentMonth = state.selectedMonth, paymentPeriod = state.paymentPeriod, sourceMembers = state.members) {
  const source = commissionSourcePeriod(paymentMonth, paymentPeriod);
  return computedMembersForRevenuePeriod(source.month, source.revenuePeriod, sourceMembers)
    .map((member) => ({
      ...member,
      paidDone: periodPaymentDone(member.id, paymentMonth, paymentPeriod)
    }));
}

function selectedYearValue(monthValue = state.selectedMonth) {
  return String(monthValue || currentMonthValue()).slice(0, 4);
}

function dataMonthsForYear(year = selectedYearValue()) {
  const months = Object.keys(state.periods || {})
    .filter((month) => month.startsWith(`${year}-`))
    .sort();
  if (state.selectedMonth?.startsWith(`${year}-`) && !months.includes(state.selectedMonth)) months.push(state.selectedMonth);
  return months.sort();
}

function aggregateMemberYearBonus(memberId, year = selectedYearValue()) {
  const months = dataMonthsForYear(year);
  const totals = {
    performance: 0,
    pair: 0,
    leadership: 0,
    mentoring: 0,
    sharing: 0,
    rupiah: 0,
    ppv: 0,
    tnpv: 0,
    paidMonths: 0,
    bonusMonths: 0,
    blockedMonths: 0
  };
  let latestMember = currentMember();
  months.forEach((month) => {
    const members = computedMembersForMonth(month, state.members);
    const member = members.find((item) => item.id === memberId);
    if (!member) return;
    latestMember = member;
    const bonus = withCalcMembers(members, () => calcBonus(member));
    totals.performance += bonus.performance;
    totals.pair += bonus.pair;
    totals.leadership += bonus.leadership;
    totals.mentoring += bonus.mentoring;
    totals.sharing += bonus.sharing;
    totals.rupiah += bonus.rupiah;
    totals.ppv += Number(member.ppv || 0);
    totals.tnpv += Number(member.tnpv || 0);
    if (bonus.rupiah > 0) totals.bonusMonths += 1;
    if (bonus.blockedByTupo) totals.blockedMonths += 1;
    if (periodPaymentDone(memberId, month, "1") || periodPaymentDone(memberId, month, "2")) totals.paidMonths += 1;
  });
  return { months, member: latestMember, totals };
}

function memberBonusReportContext() {
  const scope = memberBonusScopeValue();
  const memberId = currentMember().id;
  if (scope === "year") {
    const year = selectedYearValue();
    const summary = aggregateMemberYearBonus(memberId, year);
    return {
      scope,
      members: [],
      member: summary.member,
      bonus: summary.totals,
      sourceLabel: `1 Tahun ${year}`,
      periodNote: `${summary.months.length} bulan berdata`,
      ppvLabel: "PPV 1 Tahun",
      tnpvLabel: "TNPV Tim 1 Tahun",
      paidStatus: summary.totals.rupiah > 0 ? `${summary.totals.bonusMonths} bulan ada bonus` : "Tidak ada bonus",
      yearly: summary
    };
  }
  if (scope === "month") {
    const members = computedMembersForMonth(state.selectedMonth, state.members);
    const member = members.find((item) => item.id === memberId) || currentMember();
    const bonus = withCalcMembers(members, () => calcBonus(member));
    return {
      scope,
      members,
      member,
      bonus,
      sourceLabel: `1 Bulan Full ${selectedMonthLabel()}`,
      periodNote: "Gabungan Periode 1 + Periode 2",
      ppvLabel: "PPV 1 Bulan",
      tnpvLabel: "TNPV Tim 1 Bulan",
      paidStatus: bonus.rupiah > 0 ? "Estimasi full bulan" : "Tidak ada bonus"
    };
  }
  const members = commissionMembersForPayment(state.selectedMonth, state.paymentPeriod, state.members);
  const member = members.find((item) => item.id === memberId) || currentMember();
  const bonus = withCalcMembers(members, () => calcBonus(member));
  return {
    scope,
    members,
    member,
    bonus,
    sourceLabel: commissionSourceLabel(state.selectedMonth, state.paymentPeriod),
    periodNote: paymentPeriodLabel(),
    ppvLabel: "PPV Sumber",
    tnpvLabel: "TNPV Tim Sumber",
    paidStatus: member.paidDone ? "Sudah dibayar" : bonus.rupiah > 0 ? "Belum dibayar" : "Tidak ada bonus"
  };
}

function monthlyMember(member) {
  if (!monthIsAfterJoin(member)) {
    return { ...member, ppv: 0, tnpv: 0, gpv: 0, leftPv: 0, rightPv: 0 };
  }
  return computedMembersForMonth(state.selectedMonth, state.members).find((item) => item.id === member.id) || { ...member, ppv: 0 };
}

function monthlyMembersList() {
  const visibleIds = new Set(filteredMembers().map((member) => member.id));
  return computedMembersForMonth(state.selectedMonth, state.members).filter((member) => visibleIds.has(member.id));
}

function computedMembersVisibleForRole(month = state.selectedMonth) {
  const members = computedMembersForMonth(month, state.members);
  if (state.activeRole === "stockist") return members.filter((member) => member.stockist === state.activeId);
  if (state.activeRole === "member") return members.filter((member) => member.id === currentMember().id);
  if (state.activeRole === "branch") return members.filter(branchCanAccessMember);
  return members;
}

function syncPersistentMemberProgress(month = state.selectedMonth) {
  const computedById = new Map(computedMembersForMonth(month, state.members).map((member) => [member.id, member]));
  state.members.forEach((member) => {
    const computed = computedById.get(member.id);
    if (!computed) return;
    if (!member.manualRank && (rankIndex[computed.rank] || 0) > (rankIndex[member.rank] || 0)) member.rank = computed.rank;
    member.cpv = Number(computed.cpv || 0);
    member.atnpv = Number(computed.atnpv || 0);
  });
}

function recomputeMetrics(members = state.members) {
  normalizeSponsorLinks(members);
  normalizePlacementCapacity(members);
  sponsorChildrenCache.delete(members);
  memberByIdCache.delete(members);
  const sponsorChildrenOf = (id) => sponsorChildren(id, members);
  const placementChildrenMap = new Map();
  members.forEach((member) => {
    if (!placementChildrenMap.has(member.parent)) placementChildrenMap.set(member.parent, []);
    placementChildrenMap.get(member.parent).push(member);
  });
  const placementChildrenOf = (id) => placementChildrenMap.get(id) || [];
  const normalizedPlacementSide = (member, index) => {
    const text = String(member?.placementSide || member?.side || "").trim().toUpperCase();
    if (["L", "LEFT", "KIRI"].includes(text)) return "L";
    if (["R", "RIGHT", "KANAN"].includes(text)) return "R";
    return index === 0 ? "L" : index === 1 ? "R" : "";
  };
  const placementLegRoots = (id, periodMonth = "") => {
    const children = placementChildrenOf(id).filter((child) => !periodMonth || memberActiveInMonth(child, periodMonth));
    const left = children.filter((child, index) => normalizedPlacementSide(child, index) === "L");
    const right = children.filter((child, index) => normalizedPlacementSide(child, index) === "R");
    return { left, right };
  };
  const sponsorTeamMemo = new Map();
  const placementTeamMemo = new Map();
  const currentCalcMonth = members.find((member) => member._calcMonth)?._calcMonth || "";
  const sponsorTeamPpv = (member, visited = new Set()) => {
    if (!member || visited.has(member.id)) return 0;
    if (sponsorTeamMemo.has(member.id)) return sponsorTeamMemo.get(member.id);
    visited.add(member.id);
    const total = sponsorChildrenOf(member.id).reduce((sum, downline) => sum + Number(downline.ppv || 0) + sponsorTeamPpv(downline, new Set(visited)), 0);
    sponsorTeamMemo.set(member.id, total);
    return total;
  };
  const placementTeamPpv = (member, visited = new Set()) => {
    if (!member || visited.has(member.id)) return 0;
    if (placementTeamMemo.has(member.id)) return placementTeamMemo.get(member.id);
    visited.add(member.id);
    const total = placementChildrenOf(member.id).reduce((sum, downline) => sum + Number(downline.ppv || 0) + placementTeamPpv(downline, new Set(visited)), 0);
    placementTeamMemo.set(member.id, total);
    return total;
  };
  const placementTeamPpvForMonth = (member, periodMonth, visited = new Set()) => {
    if (!member || visited.has(member.id) || !memberActiveInMonth(member, periodMonth)) return 0;
    visited.add(member.id);
    const selfPpv = periodMonth === currentCalcMonth ? Number(member.ppv || 0) : periodPpv(member.id, periodMonth);
    return placementChildrenOf(member.id)
      .filter((downline) => memberActiveInMonth(downline, periodMonth))
      .reduce((sum, downline) => sum + placementTeamPpvForMonth(downline, periodMonth, new Set(visited)), selfPpv);
  };
  const placementLegVolumesForMonth = (member, periodMonth) => {
    const directPlacement = placementLegRoots(member.id, periodMonth);
    return {
      left: directPlacement.left.reduce((sum, child) => sum + placementTeamPpvForMonth(child, periodMonth), 0),
      right: directPlacement.right.reduce((sum, child) => sum + placementTeamPpvForMonth(child, periodMonth), 0)
    };
  };
  const periodMonthsUntil = (month) => Object.keys(state.periods || {})
    .filter((periodMonth) => (!month || periodMonth <= month))
    .sort();
  const memberActiveInMonth = (member, periodMonth) => !member.joinedAt || member.joinedAt.slice(0, 7) <= periodMonth;
  const periodTeamMemo = new Map();
  const periodTeamPpv = (member, periodMonth, visited = new Set()) => {
    if (!member || visited.has(member.id) || !memberActiveInMonth(member, periodMonth)) return 0;
    const key = `${periodMonth}:${member.id}`;
    if (periodTeamMemo.has(key)) return periodTeamMemo.get(key);
    visited.add(member.id);
    const total = sponsorChildrenOf(member.id)
      .filter((downline) => memberActiveInMonth(downline, periodMonth))
      .reduce((sum, downline) => sum + periodPpv(downline.id, periodMonth) + periodTeamPpv(downline, periodMonth, new Set(visited)), 0);
    periodTeamMemo.set(key, total);
    return total;
  };
  const periodTnpv = (member, periodMonth) => {
    if (!memberActiveInMonth(member, periodMonth)) return 0;
    return periodPpv(member.id, periodMonth) + periodTeamPpv(member, periodMonth);
  };
  const accumulatedTnpv = (member, month) => periodMonthsUntil(month)
    .filter((periodMonth) => !member.joinedAt || periodMonth >= member.joinedAt.slice(0, 7))
    .reduce((sum, periodMonth) => sum + periodTnpv(member, periodMonth), 0);
  const openGroupPv = (earner, cursor = earner, visited = new Set([earner.id])) => sponsorChildrenOf(cursor.id).reduce((sum, downline) => {
    if (visited.has(downline.id)) return sum;
    visited.add(downline.id);
    if (rankIndex[downline.rank] >= rankIndex[earner.rank]) return sum;
    return sum + Number(downline.ppv || 0) + openGroupPv(earner, downline, new Set(visited));
  }, 0);
  const gpvFor = (member) => {
    if (rankIndex[member.rank] < rankIndex["Crown Star"]) return 0;
    return Number(member.ppv || 0) + openGroupPv(member);
  };
  const carrySimulationMemo = new Map();
  const consumeTranches = (tranches, amount) => {
    let remaining = amount;
    return tranches
      .sort((left, right) => right.age - left.age)
      .map((tranche) => {
        if (remaining <= 0) return tranche;
        const used = Math.min(tranche.amount, remaining);
        remaining -= used;
        return { ...tranche, amount: tranche.amount - used };
      })
      .filter((tranche) => tranche.amount > 0);
  };
  const placementCarryInfo = (member, month = currentCalcMonth) => {
    if (!currentCalcMonth) {
      const directPlacement = placementLegRoots(member.id);
      const leftPv = directPlacement.left.reduce((sum, child) => sum + Number(child.ppv || 0) + placementTeamPpv(child), 0);
      const rightPv = directPlacement.right.reduce((sum, child) => sum + Number(child.ppv || 0) + placementTeamPpv(child), 0);
      const carry = Math.abs(leftPv - rightPv);
      return {
        leftPv,
        rightPv,
        carry,
        carryAge: carry > 0 ? Math.min(3, Number(member.carryAge || 1)) : 0,
        carrySide: leftPv > rightPv ? "Kiri" : rightPv > leftPv ? "Kanan" : "",
        carryInLeft: 0,
        carryInRight: 0
      };
    }
    if (!month || !memberActiveInMonth(member, month)) {
      return { leftPv: 0, rightPv: 0, carry: 0, carryAge: 0, carrySide: "", carryInLeft: 0, carryInRight: 0 };
    }
    const key = `${member.id}:${month}`;
    if (carrySimulationMemo.has(key)) return carrySimulationMemo.get(key);
    const joinedMonth = member.joinedAt ? member.joinedAt.slice(0, 7) : "";
    const months = periodMonthsUntil(month);
    if (!months.includes(month)) months.push(month);
    const orderedMonths = [...new Set(months)]
      .filter((periodMonth) => periodMonth <= month && (!joinedMonth || periodMonth >= joinedMonth))
      .sort();
    let carryTranches = [];
    let result = { leftPv: 0, rightPv: 0, carry: 0, carryAge: 0, carrySide: "", carryInLeft: 0, carryInRight: 0 };

    orderedMonths.forEach((periodMonth) => {
      carryTranches = carryTranches.filter((tranche) => tranche.age < 3 && tranche.amount > 0);
      const carryInLeft = carryTranches.filter((tranche) => tranche.side === "left").reduce((sum, tranche) => sum + tranche.amount, 0);
      const carryInRight = carryTranches.filter((tranche) => tranche.side === "right").reduce((sum, tranche) => sum + tranche.amount, 0);
      const volumes = placementLegVolumesForMonth(member, periodMonth);
      const displayLeftPv = volumes.left;
      const displayRightPv = volumes.right;
      let leftTranches = carryTranches.filter((tranche) => tranche.side === "left");
      let rightTranches = carryTranches.filter((tranche) => tranche.side === "right");
      if (volumes.left > 0) leftTranches.push({ side: "left", amount: volumes.left, age: 0 });
      if (volumes.right > 0) rightTranches.push({ side: "right", amount: volumes.right, age: 0 });
      const leftTotal = leftTranches.reduce((sum, tranche) => sum + tranche.amount, 0);
      const rightTotal = rightTranches.reduce((sum, tranche) => sum + tranche.amount, 0);
      const pairedPv = Math.min(leftTotal, rightTotal);
      leftTranches = consumeTranches(leftTranches, pairedPv);
      rightTranches = consumeTranches(rightTranches, pairedPv);
      carryTranches = [...leftTranches, ...rightTranches]
        .map((tranche) => ({ ...tranche, age: tranche.age + 1 }))
        .filter((tranche) => tranche.amount > 0);
      const carryLeft = carryTranches.filter((tranche) => tranche.side === "left").reduce((sum, tranche) => sum + tranche.amount, 0);
      const carryRight = carryTranches.filter((tranche) => tranche.side === "right").reduce((sum, tranche) => sum + tranche.amount, 0);
      result = {
        leftPv: displayLeftPv,
        rightPv: displayRightPv,
        pairLeftPv: leftTotal,
        pairRightPv: rightTotal,
        carry: carryLeft + carryRight,
        carryAge: carryTranches.reduce((max, tranche) => Math.max(max, tranche.age), 0),
        carrySide: carryLeft > carryRight ? "Kiri" : carryRight > carryLeft ? "Kanan" : "",
        carryInLeft,
        carryInRight
      };
    });
    carrySimulationMemo.set(key, result);
    return result;
  };

  members.forEach((member) => {
    const directPlacement = placementChildrenOf(member.id);
    const leftRoot = directPlacement[0];
    const rightRoot = directPlacement[1];
    const teamPv = sponsorTeamPpv(member);
    const carryInfo = placementCarryInfo(member);

    member.cpv = Math.max(Number(member.cpv || 0), Number(member.ppv || 0));
    member.tnpv = Number(member.ppv || 0) + teamPv;
    member.atnpv = member._calcMonth ? accumulatedTnpv(member, member._calcMonth) : Math.max(Number(member.atnpv || 0), Number(member.tnpv || 0));
    member.gpv = gpvFor(member);
    member.leftPv = carryInfo.leftPv;
    member.rightPv = carryInfo.rightPv;
    member.pairLeftPv = carryInfo.pairLeftPv ?? carryInfo.leftPv;
    member.pairRightPv = carryInfo.pairRightPv ?? carryInfo.rightPv;
    member.carry = carryInfo.carry;
    member.carryAge = carryInfo.carry > 0 ? Math.min(3, Number(carryInfo.carryAge || 1)) : 0;
    member.carrySide = carryInfo.carrySide;
    member.carryInLeft = carryInfo.carryInLeft;
    member.carryInRight = carryInfo.carryInRight;
  });
  applyAutomaticRanks(members, sponsorChildrenOf);
  members.forEach((member) => {
    member.gpv = gpvFor(member);
  });
  return members;
}

function normalizeSponsorLinks(members = state.members) {
  const byId = Object.fromEntries(members.map((member) => [member.id, member]));
  members.forEach((member) => {
    const sponsor = String(member.sponsor || "").trim();
    if (isRootSponsor(sponsor)) {
      member.sponsor = "Pusat";
    } else if (!sponsor || sponsor === member.id || !byId[sponsor]) {
      member.sponsor = "Pusat";
    } else {
      member.sponsor = sponsor;
    }
  });

  members.forEach((member) => {
    const seen = new Set([member.id]);
    let cursor = member.sponsor;
    while (cursor && !isRootSponsor(cursor)) {
      if (seen.has(cursor)) {
        member.sponsor = "Pusat";
        break;
      }
      seen.add(cursor);
      cursor = byId[cursor]?.sponsor;
    }
  });
}

function normalizePlacementCapacity(members = state.members) {
  const byId = Object.fromEntries(members.map((member) => [member.id, member]));
  members.forEach((member) => {
    if (member.parent && !byId[member.parent]) member.parent = null;
    if (member.parent === member.id) member.parent = null;
  });

  members.forEach((member) => {
    const seen = new Set([member.id]);
    let cursor = member.parent;
    while (cursor) {
      if (seen.has(cursor)) {
        member.parent = null;
        break;
      }
      seen.add(cursor);
      cursor = byId[cursor]?.parent;
    }
  });

  const childrenByParent = new Map();
  members.forEach((member) => {
    if (!childrenByParent.has(member.parent)) childrenByParent.set(member.parent, []);
    childrenByParent.get(member.parent).push(member);
  });
  members.forEach((parent) => {
    const children = childrenByParent.get(parent.id) || [];
    children.slice(2).forEach((overflow) => {
      overflow.parent = findAvailablePlacement(parent.id, overflow.id, members);
    });
  });
}

function findAvailablePlacement(startId, movingId = null, members = state.members) {
  if (!startId) return null;
  const descendantsOfMoving = (id, seen = new Set([id])) => {
    const direct = members
      .filter((member) => member.parent === id && !seen.has(member.id))
      .map((member) => member.id);
    direct.forEach((childId) => seen.add(childId));
    return direct.concat(direct.flatMap((childId) => descendantsOfMoving(childId, new Set(seen))));
  };
  const queue = [startId];
  const visited = new Set([movingId, ...(movingId ? descendantsOfMoving(movingId) : [])].filter(Boolean));
  while (queue.length) {
    const id = queue.shift();
    if (!id || visited.has(id)) continue;
    visited.add(id);
    const children = members.filter((member) => member.parent === id && member.id !== movingId);
    if (children.length < 2) return id;
    queue.push(...children.map((child) => child.id));
  }
  return null;
}

function applyAutomaticRanks(members, childrenOf) {
  const countLegsAtLeast = (member, rankName) => childrenOf(member.id).filter((child) => rankIndex[child.rank] >= rankIndex[rankName]).length;
  const qualifies = (member, rankName) => {
    if (rankName === "VIP") return member.cpv >= 6000;
    if (rankName === "Royal Star") return member.cpv >= 15000;
    if (rankName === "Crown Star") return member.atnpv >= 50000 && countLegsAtLeast(member, "Royal Star") >= 3;
    if (rankName === "Leader Ambassador") return member.atnpv >= 200000 && countLegsAtLeast(member, "Crown Star") >= 3;
    if (rankName === "Leader Majestic") return member.atnpv >= 700000 && countLegsAtLeast(member, "Leader Ambassador") >= 3;
    if (rankName === "Director") return member.atnpv >= 20000000 && countLegsAtLeast(member, "Leader Majestic") >= 4;
    if (rankName === "Executive Director") return member.atnpv >= 70000000 && countLegsAtLeast(member, "Director") >= 4;
    return true;
  };

  for (let pass = 0; pass < ranks.length; pass += 1) {
    members.forEach((member) => {
      if (member.manualRank) return;
      let bestIndex = rankIndex[member.rank] || 0;
      ranks.forEach((rank, index) => {
        if (index > bestIndex && qualifies(member, rank.name)) bestIndex = index;
      });
      member.rank = ranks[bestIndex].name;
    });
  }
}

function adminVisibleMembersForReport(members) {
  return state.activeRole === "branch" ? members.filter(branchCanAccessMember) : members;
}

function adminYearDashboardView(dashboardMonth = state.dashboardMonth || state.selectedMonth || currentMonthValue()) {
  const year = selectedYearValue(dashboardMonth);
  const months = dataMonthsForYear(year);
  const totals = {
    ppv: 0,
    bonus: 0,
    performance: 0,
    pair: 0,
    leadership: 0,
    mentoring: 0,
    sharing: 0,
    stockistFee: 0,
    activeMembers: new Set(),
    newMembers: 0,
    rows: []
  };
  months.forEach((month) => {
    const contextMembers = computedMembersForMonth(month, state.members);
    const members = adminVisibleMembersForReport(contextMembers);
    const monthRows = withCalcMembers(members, () => members.map((member) => ({ member, bonus: calcBonus(member) })));
    const memberIds = new Set(members.map((member) => member.id));
    totals.ppv += members.reduce((sum, member) => sum + Number(member.ppv || 0), 0);
    totals.newMembers += members.filter((member) => memberInMonth(member, month)).length;
    members.filter((member) => Number(member.ppv || 0) > 0).forEach((member) => totals.activeMembers.add(member.id));
    monthRows.forEach(({ member, bonus }) => {
      totals.performance += bonus.performance * 1000;
      totals.pair += bonus.pair * 1000;
      totals.leadership += bonus.leadership * 1000;
      totals.mentoring += bonus.mentoring * 1000;
      totals.sharing += bonus.sharing * 1000;
      totals.bonus += bonus.rupiah;
      if (bonus.rupiah > 0) totals.rows.push({ member, bonus, month });
    });
    const stockists = state.activeRole === "branch"
      ? state.stockists.filter((stockist) => branchCanAccessArea(stockist.area))
      : state.stockists;
    totals.stockistFee += stockists.reduce((sum, stockist) => {
      const sales = contextMembers
        .filter((member) => memberIds.has(member.id) && member.stockist === stockist.id)
        .reduce((subtotal, member) => subtotal + Number(member.ppv || 0) * 1000, 0);
      return sum + sales * Number(stockist.feeRate || 0) / 100;
    }, 0);
  });
  const totalPayout = totals.bonus + totals.stockistFee;
  const companyTnpvRupiah = totals.ppv * 1000;
  const maxPayoutRupiah = companyTnpvRupiah * MAX_COMPANY_PAYOUT_RATE;
  const payoutRatio = companyTnpvRupiah ? Math.round(totalPayout / companyTnpvRupiah * 1000) / 10 : 0;
  const topBonusRows = totals.rows
    .sort((left, right) => right.bonus.rupiah - left.bonus.rupiah)
    .slice(0, 15)
    .map(({ member, bonus, month }) => `
      <tr>
        <td>${memberNameCell(member, true)}</td>
        <td>${rankLabelHtml(member.rank)}<br><span class="muted">${html(monthLabel(month))}</span></td>
        <td class="money">${money(bonus.rupiah)}</td>
        <td>${money(bonus.performance * 1000)}</td>
        <td>${money(bonus.pair * 1000)}</td>
        <td>${money(bonus.leadership * 1000)}</td>
        <td>${money(bonus.mentoring * 1000)}</td>
        <td>${money(bonus.sharing * 1000)}</td>
      </tr>
    `).join("");
  return `
    ${controlPanel("Filter Dashboard Admin", [
      yearControl("Tahun", "dashboardMonth"),
      adminReportScopeControl("Tampilan")
    ], `${months.length} bulan berdata pada tahun ${year}`)}
    <div style="height:16px"></div>
    <div class="grid kpi-grid">
      ${kpiCard("Member Beromset", totals.activeMembers.size, "Unik dalam 1 tahun")}
      ${kpiCard("Member Baru", totals.newMembers, "Total join dalam tahun ini")}
      ${kpiCard(state.activeRole === "branch" ? "Omset Cabang" : "Omset Perusahaan", pv(totals.ppv), "Akumulasi PPV 1 tahun")}
      ${kpiCard("Nilai Omset", money(companyTnpvRupiah), "1 PV = Rp1.000")}
      ${kpiCard("Total Bonus Member", money(totals.bonus), "Prestasi, pasangan, kepemimpinan, bimbingan, sharing")}
      ${kpiCard("Fee Stokis", money(totals.stockistFee), "Akumulasi fee 1 tahun")}
      ${kpiCard("Total Dibayar", money(totalPayout), "Bonus member + fee stokis")}
      ${kpiCard("Rasio Bayar", `${payoutRatio}%`, `Acuan 55%: ${money(maxPayoutRupiah)}`)}
    </div>
    <details class="card detail-card" style="margin-top:16px">
      <summary>Komponen Bonus 1 Tahun</summary>
      <div class="bonus-grid">
        <div class="bonus-row"><span>Bonus Prestasi</span><b>${money(totals.performance)}</b></div>
        <div class="bonus-row"><span>Bonus Pasangan</span><b>${money(totals.pair)}</b></div>
        <div class="bonus-row"><span>Bonus Kepemimpinan</span><b>${money(totals.leadership)}</b></div>
        <div class="bonus-row"><span>Bonus Bimbingan</span><b>${money(totals.mentoring)}</b></div>
        <div class="bonus-row"><span>Sharing Profit</span><b>${money(totals.sharing)}</b></div>
        <div class="bonus-row"><span>Fee Stokis</span><b>${money(totals.stockistFee)}</b></div>
      </div>
    </details>
    <details class="card detail-card" style="margin-top:16px">
      <summary>Penerima Bonus Terbesar 1 Tahun</summary>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Member</th><th>Peringkat / Bulan</th><th>Total Bonus</th><th>Prestasi</th><th>Pasangan</th><th>Kepemimpinan</th><th>Bimbingan</th><th>Sharing</th></tr></thead>
          <tbody>${topBonusRows || `<tr><td colspan="8"><span class="muted">Belum ada bonus pada tahun ini.</span></td></tr>`}</tbody>
        </table>
      </div>
    </details>
  `;
}

function dashboardView() {
  const dashboardMonth = state.dashboardMonth || state.selectedMonth || currentMonthValue();
  if (state.activeRole === "stockist" && apiConnected()) return serverStockistDashboardView();
  if (serverDashboardEnabled()) return serverDashboardView();
  if (state.activeRole === "stockist") return stockistDashboardView(dashboardMonth);
  const reportScope = adminReportScopeValue();
  if (reportScope === "year") return adminYearDashboardView(dashboardMonth);
  const paymentPeriod = paymentPeriodValue();
  const source = commissionSourcePeriod(dashboardMonth, paymentPeriod);
  const reportMonth = reportScope === "month" ? dashboardMonth : source.month;
  const sourceLabel = reportScope === "month" ? `1 Bulan Full ${monthLabel(dashboardMonth)}` : commissionSourceLabel(dashboardMonth, paymentPeriod);
  const allPaymentMembers = reportScope === "month"
    ? computedMembersForMonth(dashboardMonth, state.members)
    : commissionMembersForPayment(dashboardMonth, paymentPeriod, state.members);
  const members = state.activeRole === "branch" ? allPaymentMembers.filter(branchCanAccessMember) : allPaymentMembers;
  const totalPpv = members.reduce((sum, item) => sum + Number(item.ppv || 0), 0);
  const dashboardBonusData = withCalcMembers(members, () => {
    const bonusTotals = members.reduce((totals, item) => {
      const bonus = calcBonus(item);
      const rawPair = calcRawPairBonus(item);
      const pairedPv = bonus.pair > 0 ? Math.min(item.leftPv || 0, item.rightPv || 0) : 0;
      totals.performance += bonus.performance * 1000;
      totals.pair += bonus.pair * 1000;
      totals.rawPair += rawPair * 1000;
      totals.pairPv += pairedPv;
      if (bonus.pair > 0) totals.pairReceivers += 1;
      totals.leadership += bonus.leadership * 1000;
      totals.mentoring += bonus.mentoring * 1000;
      totals.member += bonus.rupiah;
      totals.sharing += bonus.sharing * 1000;
      if (bonus.rupiah > 0) {
        totals.rows.push({ member: item, bonus, rawPair });
      }
      return totals;
    }, { performance: 0, pair: 0, rawPair: 0, pairPv: 0, pairReceivers: 0, leadership: 0, mentoring: 0, sharing: 0, member: 0, rows: [] });
    return {
      bonusTotals,
      payoutCap: payoutCapInfo(members),
      pairPool: pairPoolInfo(members),
      sharingPoolBv: sharingProfitPoolBv(members)
    };
  });
  const { bonusTotals, payoutCap, pairPool, sharingPoolBv } = dashboardBonusData;
  const totalBonus = bonusTotals.member;
  const totalSharingPaid = bonusTotals.sharing;
  const totalNonSharingBonus = bonusTotals.performance + bonusTotals.pair + bonusTotals.leadership + bonusTotals.mentoring;
  const feeStockists = state.activeRole === "stockist"
    ? state.stockists.filter((stockist) => stockist.id === state.activeId)
    : state.activeRole === "branch"
      ? state.stockists.filter((stockist) => branchCanAccessArea(stockist.area))
      : state.stockists;
  const totalStockistFee = feeStockists.reduce((sum, stockist) => {
    const sales = allPaymentMembers
      .filter((member) => member.stockist === stockist.id)
      .reduce((subtotal, member) => subtotal + Number(member.ppv || 0) * 1000, 0);
    return sum + sales * Number(stockist.feeRate || 0) / 100;
  }, 0);
  const totalPayout = totalBonus + totalStockistFee;
  const companyTnpvRupiah = payoutCap.companyTnpv * 1000;
  const maxPayoutRupiah = payoutCap.maxPayoutBv * 1000;
  const maxPairPoolRupiah = pairPool.maxPairPoolBv * 1000;
  const referencePairPoolRupiah = pairPool.referencePairPoolBv * 1000;
  const availablePairSystemRupiah = pairPool.availablePairSystemBv * 1000;
  const rawPairSystemRupiah = pairPool.rawPairSystemBv * 1000;
  const rawProjectedPayoutRupiah = pairPool.rawProjectedPayoutBv * 1000;
  const performanceCapRupiah = companyTnpvRupiah * 0.30;
  const overPairPoolRupiah = pairPool.overPairPoolBv * 1000;
  const pairPoolUsage = Number.isFinite(pairPool.pairPoolUsage) ? `${Math.round(pairPool.pairPoolUsage * 1000) / 10}%` : "Ruang habis";
  const pairPoolFactor = Math.round(pairPool.pairBonusFactor * 1000) / 10;
  const heldPairRupiah = Math.max(0, bonusTotals.rawPair - bonusTotals.pair);
  const overPayoutRupiah = Math.max(0, totalPayout - maxPayoutRupiah);
  const payoutRatio = companyTnpvRupiah ? Math.round(totalPayout / companyTnpvRupiah * 1000) / 10 : 0;
  const ratioText = (value) => `${companyTnpvRupiah ? Math.round(value / companyTnpvRupiah * 1000) / 10 : 0}%`;
  const performanceRatio = companyTnpvRupiah ? Math.round(bonusTotals.performance / companyTnpvRupiah * 1000) / 10 : 0;
  const performanceStatus = bonusTotals.performance > performanceCapRupiah
    ? "Bonus Prestasi melewati 30% TNPV, perlu audit data sponsor/peringkat"
    : "Bonus Prestasi masih dalam batas 30% TNPV";
  const pairVolumeMultiplier = payoutCap.companyTnpv ? Math.round(bonusTotals.pairPv / payoutCap.companyTnpv * 100) / 100 : 0;
  const pairAverageRate = bonusTotals.pairPv ? Math.round((bonusTotals.pair / 1000) / bonusTotals.pairPv * 1000) / 10 : 0;
  const payoutComponents = [
    ["Bonus Prestasi", bonusTotals.performance],
    ["Bonus Pasangan", bonusTotals.pair],
    ["Bonus Kepemimpinan", bonusTotals.leadership],
    ["Bonus Bimbingan", bonusTotals.mentoring],
    ["Sharing Profit", totalSharingPaid],
    ["Fee Stokis", totalStockistFee]
  ].sort((left, right) => right[1] - left[1]);
  const topPayoutComponent = payoutComponents[0] || ["-", 0];
  const pairPayoutAmount = bonusTotals.pair;
  const pairIsMainCause = overPayoutRupiah > 0 && topPayoutComponent[0] === "Bonus Pasangan";
  const pairStatus = bonusTotals.rawPair <= 0
    ? "Tidak ada Bonus Pasangan pada bulan ini"
    : pairIsMainCause
      ? "Bonus Pasangan adalah sumber payout terbesar"
      : "Bonus Pasangan dihitung dari kaki terlemah sesuai rate peringkat";
  const pairVolumeStatus = pairVolumeMultiplier > 1
    ? "PV pasangan lebih besar dari TNPV karena volume dihitung di beberapa upline placement"
    : pairVolumeMultiplier > 0
      ? "PV pasangan masih di bawah atau sama dengan TNPV Perusahaan"
      : "Belum ada PV pasangan terbayar";
  const payoutComponentRows = payoutComponents.map(([label, amount]) => `
    <tr>
      <td>${html(label)}</td>
      <td class="money">${money(amount)}</td>
      <td>${ratioText(amount)}</td>
      <td>${totalPayout ? Math.round(amount / totalPayout * 1000) / 10 : 0}%</td>
    </tr>
  `).join("");
  const topBonusRows = bonusTotals.rows
    .sort((left, right) => right.bonus.rupiah - left.bonus.rupiah)
    .slice(0, 10)
    .map(({ member, bonus }) => `
      <tr>
        <td>${memberNameCell(member, true)}</td>
        <td>${rankLabelHtml(member.rank)}</td>
        <td class="money">${money(bonus.rupiah)}</td>
        <td>${money(bonus.performance * 1000)}</td>
        <td>${money(bonus.pair * 1000)}</td>
        <td>${money(bonus.leadership * 1000)}</td>
        <td>${money(bonus.mentoring * 1000)}</td>
        <td>${money(bonus.sharing * 1000)}</td>
      </tr>
    `).join("");
  const topPairRows = bonusTotals.rows
    .filter(({ bonus }) => bonus.pair > 0)
    .sort((left, right) => right.bonus.pair - left.bonus.pair)
    .slice(0, 10)
    .map(({ member, bonus, rawPair }) => `
      <tr>
        <td>${memberNameCell(member, true)}</td>
        <td>${rankLabelHtml(member.rank)}</td>
        <td>${rankRate(member, "pair")}%</td>
        <td class="money">${money(rawPair * 1000)}</td>
        <td class="money">${money(bonus.pair * 1000)}</td>
        <td>${pv(Math.min(member.leftPv || 0, member.rightPv || 0))}</td>
        <td>${pv(member.leftPv || 0)} / ${pv(member.rightPv || 0)}</td>
      </tr>
    `).join("");
  const topPerformanceRows = bonusTotals.rows
    .filter(({ bonus }) => bonus.performance > 0)
    .sort((left, right) => right.bonus.performance - left.bonus.performance)
    .slice(0, 10)
    .map(({ member, bonus }) => `
      <tr>
        <td>${memberNameCell(member, true)}</td>
        <td>${rankLabelHtml(member.rank)}</td>
        <td>${rankRate(member, "performance")}%</td>
        <td>${pv(member.ppv || 0)}</td>
        <td>${pv(member.tnpv || 0)}</td>
        <td class="money">${money(bonus.performance * 1000)}</td>
        <td>${ratioText(bonus.performance * 1000)}</td>
      </tr>
    `).join("");
  const directorPool = members.filter((item) => rankIndex[item.rank] >= rankIndex["Director"]).length;
  const sharingPool = sharingPoolBv * 1000;
  const newMembers = members.filter((member) => memberInMonth(member, reportMonth)).length;
  const activePpvMembers = members.filter((item) => Number(item.ppv || 0) > 0).length;
  const progressLimit = 200;
  const progressMembers = members.slice(0, progressLimit);
  const hiddenProgressCount = Math.max(0, members.length - progressMembers.length);
  const dashboardRevenueLabel = state.activeRole === "stockist" ? "Omset Stokis" : state.activeRole === "branch" ? "Omset Cabang" : "Omset Perusahaan";
  const dashboardRevenueNote = state.activeRole === "stockist" ? "Total PPV member sumber pembayaran" : state.activeRole === "branch" ? "Total PPV wilayah cabang sumber pembayaran" : "Total PPV sumber pembayaran";
  return `
    ${controlPanel("Filter Dashboard Admin", [
      reportScope === "year" ? yearControl("Tahun", "dashboardMonth") : monthControl("Bulan & Tahun", "dashboardMonth"),
      adminReportScopeControl("Tampilan"),
      reportScope === "payment" ? paymentPeriodControl("Periode Bayar") : ""
    ], `Sumber data: ${sourceLabel}`)}
    <div style="height:16px"></div>
    <div class="grid kpi-grid">
      ${kpiCard("Member Aktif", members.length, `Bergabung sampai ${monthLabel(reportMonth)}`)}
      ${kpiCard("Member Baru", newMembers, `Bergabung pada ${monthLabel(reportMonth)}`)}
      ${kpiCard("Member Beromset", activePpvMembers, `PPV lebih dari 0 di ${sourceLabel}`)}
      ${kpiCard(dashboardRevenueLabel, pv(totalPpv), dashboardRevenueNote)}
      ${kpiCard("Nilai Omset", money(totalPpv * 1000), "Dihitung dari total PPV")}
      ${kpiCard("Total Dibayar", money(totalPayout), "Komisi non sharing + sharing profit + fee stokis")}
      ${kpiCard("Acuan Payout 55%", money(maxPayoutRupiah), `Kontrol dari TNPV Perusahaan ${money(companyTnpvRupiah)}`)}
      ${kpiCard("Rasio Bayar", `${payoutRatio}%`, "Dari TNPV Perusahaan")}
      ${kpiCard("Selisih Acuan", money(overPayoutRupiah), overPayoutRupiah ? "Di atas acuan 55%" : "Masih dalam acuan")}
    </div>
    <details class="card detail-card" style="margin-top:16px">
      <summary>Rincian Total Dibayar</summary>
      <div class="bonus-grid">
        <div class="bonus-row"><span>Komisi non sharing</span><b>${money(totalNonSharingBonus)}</b></div>
        <div class="bonus-row"><span>Sharing profit dibayar</span><b>${money(totalSharingPaid)}</b></div>
        <div class="bonus-row"><span>Fee stokis</span><b>${money(totalStockistFee)}</b></div>
        <div class="bonus-row"><span>Total dibayar</span><b>${money(totalPayout)}</b></div>
        <div class="bonus-row"><span>Acuan 55% dari TNPV Perusahaan</span><b>${money(maxPayoutRupiah)}</b></div>
        <div class="bonus-row"><span>Selisih dari acuan</span><b>${overPayoutRupiah ? money(overPayoutRupiah) : "Tidak ada"}</b></div>
        <div class="bonus-row"><span>Sumber payout terbesar</span><b>${html(topPayoutComponent[0])} - ${money(topPayoutComponent[1])}</b></div>
        <div class="bonus-row"><span>Status Bonus Prestasi</span><b>${html(performanceStatus)}</b></div>
        <div class="bonus-row"><span>Kontribusi Bonus Prestasi</span><b>${performanceRatio}% TNPV</b></div>
        <div class="bonus-row"><span>Status Bonus Pasangan</span><b>${html(pairStatus)}</b></div>
        <div class="bonus-row"><span>Hak Mentah Bonus Pasangan</span><b>${money(bonusTotals.rawPair)}</b></div>
        <div class="bonus-row"><span>Hak Bonus Pasangan</span><b>${money(maxPairPoolRupiah)}</b></div>
        <div class="bonus-row"><span>Bonus Pasangan Dibayar</span><b>${money(bonusTotals.pair)}</b></div>
        <div class="bonus-row"><span>Pasangan Tertahan</span><b>${heldPairRupiah ? money(heldPairRupiah) : "Tidak ada"}</b></div>
        <div class="bonus-row"><span>Acuan Ruang Payout</span><b>${money(availablePairSystemRupiah)}</b></div>
        <div class="bonus-row"><span>Hak Mentah Bonus Pasangan</span><b>${money(rawPairSystemRupiah)}</b></div>
        <div class="bonus-row"><span>Simulasi Payout Jika Pasangan Full</span><b>${money(rawProjectedPayoutRupiah)}</b></div>
        <div class="bonus-row"><span>Acuan Sehat 7,5% TNPV</span><b>${money(referencePairPoolRupiah)}</b></div>
        <div class="bonus-row"><span>Pemakaian Ruang Pasangan</span><b>${pairPoolUsage}</b></div>
        <div class="bonus-row"><span>Faktor Bayar Pasangan</span><b>${pairPoolFactor}%</b></div>
        <div class="bonus-row"><span>Dasar Rumus Pasangan</span><b>Rate rank x kaki terlemah</b></div>
        <div class="bonus-row"><span>Setara Total Dua Kaki</span><b>7,5% saat kiri-kanan seimbang</b></div>
        <div class="bonus-row"><span>PV terpasang pasangan</span><b>${pv(bonusTotals.pairPv)}</b></div>
        <div class="bonus-row"><span>Pengali PV pasangan</span><b>${pairVolumeMultiplier}x TNPV</b></div>
        <div class="bonus-row"><span>Rate rata-rata pasangan</span><b>${pairAverageRate}%</b></div>
      </div>
      <p class="notice">Rasio ${payoutRatio}% dihitung dari Total Dibayar ${money(totalPayout)} dibagi TNPV Perusahaan ${money(companyTnpvRupiah)}. Bonus Pasangan dihitung dari kaki terlemah; 15% kaki lemah setara 7,5% dari total dua kaki yang benar-benar berpasangan.</p>
      <p class="notice">${html(pairVolumeStatus)}. Jika Bonus Pasangan menjadi sumber terbesar, penyebabnya biasanya banyak titik placement yang sama-sama punya kaki kiri dan kanan aktif pada bulan yang sama.</p>
    </details>
    <details class="card detail-card" style="margin-top:16px">
      <summary>Analisis Sumber Payout</summary>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Sumber</th><th>Nominal</th><th>% TNPV Perusahaan</th><th>% Total Dibayar</th></tr></thead>
          <tbody>${payoutComponentRows || `<tr><td colspan="4"><span class="muted">Belum ada payout pada bulan ini.</span></td></tr>`}</tbody>
        </table>
      </div>
      <p class="notice">${overPayoutRupiah ? `Yang melewati acuan adalah gabungan semua komponen payout. Selisihnya ${money(overPayoutRupiah)} di atas acuan 55%. Lihat urutan nominal terbesar di tabel ini untuk sumber utama.` : "Total payout bulan ini belum melewati acuan 55%."}</p>
    </details>
    <details class="card detail-card" style="margin-top:16px">
      <summary>Penerima Bonus Prestasi Terbesar</summary>
      <div class="bonus-grid" style="margin-bottom:12px">
        <div class="bonus-row"><span>Total Bonus Prestasi</span><b>${money(bonusTotals.performance)}</b></div>
        <div class="bonus-row"><span>Kontribusi ke TNPV</span><b>${performanceRatio}%</b></div>
        <div class="bonus-row"><span>Batas desain Bonus Prestasi</span><b>Maksimal 30% TNPV</b></div>
        <div class="bonus-row"><span>Status</span><b>${html(performanceStatus)}</b></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Member</th><th>Peringkat</th><th>Rate</th><th>PPV</th><th>TNPV Tim</th><th>Bonus Prestasi</th><th>% TNPV</th></tr></thead>
          <tbody>${topPerformanceRows || `<tr><td colspan="7"><span class="muted">Belum ada Bonus Prestasi pada bulan ini.</span></td></tr>`}</tbody>
        </table>
      </div>
      <p class="notice">Bonus Prestasi sekarang dihitung sebagai selisih peringkat bertingkat. Jika dalam satu jalur sudah ada VIP 15%, maka upline Director 30% hanya mengambil sisa dari 15% ke 30%, bukan menghitung ulang dari Member 10%.</p>
    </details>
    <details class="card detail-card" style="margin-top:16px">
      <summary>Penerima Bonus Pasangan Terbesar</summary>
      <div class="bonus-grid" style="margin-bottom:12px">
        <div class="bonus-row"><span>Total penerima Bonus Pasangan</span><b>${bonusTotals.pairReceivers} member</b></div>
        <div class="bonus-row"><span>Hak mentah pasangan</span><b>${money(bonusTotals.rawPair)}</b></div>
        <div class="bonus-row"><span>Total Bonus Pasangan Dibayar</span><b>${money(bonusTotals.pair)}</b></div>
        <div class="bonus-row"><span>Ruang bayar pasangan</span><b>${money(maxPairPoolRupiah)}</b></div>
        <div class="bonus-row"><span>Kontribusi ke TNPV</span><b>${ratioText(bonusTotals.pair)}</b></div>
        <div class="bonus-row"><span>Kontribusi ke Total Dibayar</span><b>${totalPayout ? Math.round(bonusTotals.pair / totalPayout * 1000) / 10 : 0}%</b></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Member</th><th>Peringkat</th><th>Rate</th><th>Hak Mentah</th><th>Dibayar</th><th>PV Terpasang</th><th>Kiri / Kanan</th></tr></thead>
          <tbody>${topPairRows || `<tr><td colspan="7"><span class="muted">Belum ada Bonus Pasangan pada bulan ini.</span></td></tr>`}</tbody>
        </table>
      </div>
    </details>
    <details class="card detail-card" style="margin-top:16px">
      <summary>Penerima Bonus Terbesar</summary>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Member</th><th>Peringkat</th><th>Total Bonus</th><th>Prestasi</th><th>Pasangan</th><th>Kepemimpinan</th><th>Bimbingan</th><th>Sharing</th></tr></thead>
          <tbody>${topBonusRows || `<tr><td colspan="8"><span class="muted">Belum ada bonus pada bulan ini.</span></td></tr>`}</tbody>
        </table>
      </div>
    </details>
    <div class="grid two-col" style="margin-top:16px">
      <details class="card detail-card">
        <summary>Aturan Bonus Ascendia</summary>
        <div class="toolbar">
          <span class="pill">Maks pasangan Rp250 juta/bulan</span>
        </div>
        ${bonusRulesHtml()}
      </details>
      <article class="card">
        <h3>Progres Peringkat ${html(sourceLabel)}</h3>
        ${hiddenProgressCount ? `<p class="notice">Menampilkan ${progressMembers.length} dari ${members.length} member agar dashboard tetap responsif. Gunakan halaman Member untuk pencarian detail.</p>` : ""}
        <div class="rank-list">${progressMembers.map(memberProgressHtml).join("")}</div>
      </article>
    </div>
  `;
}

function serverDashboardView() {
  ensureServerDashboardSummary();
  const dashboardMonth = state.dashboardMonth || state.selectedMonth || currentMonthValue();
  const data = serverDashboardSummary.data || {};
  const bonusTotals = data.bonusTotals || {};
  const payoutRatio = Number(data.payoutRatio || 0) * 100;
  const controls = [
    monthControl("Bulan & Tahun", "dashboardMonth"),
    state.activeRole === "stockist" ? "" : adminReportScopeControl("Tampilan")
  ];
  const componentRows = [
    ["Bonus Prestasi", bonusTotals.performance || 0],
    ["Bonus Pasangan", bonusTotals.pair || 0],
    ["Bonus Kepemimpinan", bonusTotals.leadership || 0],
    ["Bonus Bimbingan", bonusTotals.mentoring || 0],
    ["Sharing Profit", bonusTotals.sharing_profit || bonusTotals.sharing || 0],
    ["Fee Stokis", data.stockistFeeRupiah || 0]
  ].map(([label, amount]) => `
    <tr>
      <td>${html(label)}</td>
      <td class="money">${money(amount)}</td>
      <td>${data.revenueRupiah ? Math.round(Number(amount || 0) / Number(data.revenueRupiah || 1) * 1000) / 10 : 0}% dari omset</td>
    </tr>
  `).join("");
  return `
    ${controlPanel("Filter Dashboard", controls, `Ringkasan ${monthLabel(dashboardMonth)}`)}
    <div style="height:16px"></div>
    ${serverDashboardSummary.loading ? `<article class="card"><p class="muted">Memuat dashboard...</p></article>` : serverDashboardSummary.error ? `<article class="card"><p class="muted">${html(serverDashboardSummary.error)}</p></article>` : `
      <div class="grid kpi-grid">
        ${kpiCard("Member Aktif", data.memberCount || 0, `${data.activeMemberCount || 0} member ada PPV`)}
        ${kpiCard("PPV", pv(data.ppv || 0), "Omset pribadi periode ini")}
        ${kpiCard("Nilai Omset", money(data.revenueRupiah || 0), "1 PV = Rp1.000")}
        ${kpiCard("Bonus Member", money(data.memberBonusRupiah || 0), "Hasil tutup buku")}
        ${kpiCard("Fee Stokis", money(data.stockistFeeRupiah || 0), "Estimasi dari PPV x fee stokis")}
        ${kpiCard("Total Dibayar", money(data.totalPayoutRupiah || 0), "Bonus member + fee stokis")}
        ${kpiCard("Rasio Bayar", `${Math.round(payoutRatio * 10) / 10}%`, "Acuan bisnis maksimal 55%")}
        ${kpiCard("Periode", monthLabel(data.periodKey || dashboardMonth), "Data resmi")}
      </div>
      <article class="card" style="margin-top:16px">
        <div class="toolbar">
          <div>
            <h3>Komponen Pembayaran</h3>
            <p class="muted">Bonus muncul setelah proses tutup buku selesai dijalankan.</p>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Komponen</th><th>Nominal</th><th>Rasio</th></tr></thead>
            <tbody>${componentRows}</tbody>
          </table>
        </div>
      </article>
    `}
  `;
}

function serverStockistDashboardView() {
  const scope = stockistPaymentScopeValue();
  if (scope === "year") {
    return `
      ${controlPanel("Filter Dashboard Stokis", [
        yearControl("Tahun"),
        stockistPaymentScopeControl("Tampilan")
      ], "Data resmi")}
      <div style="height:16px"></div>
      <article class="card">
        <h3>Rekap Tahunan Stokis</h3>
        <p class="notice">Gunakan tampilan Periode Bayar atau 1 Bulan Full agar angka stokis mengikuti data resmi perusahaan.</p>
      </article>
    `;
  }
  ensureServerBonusPage();
  ensureServerStockistPayouts(scope);
  const source = serverPaymentSource(scope, state.selectedMonth, state.paymentPeriod);
  const stockist = currentUser() || {};
  const report = serverStockistPayouts.rows.find((row) => row.id === state.activeId) || {
    id: state.activeId,
    name: stockist.name || state.activeId,
    area: stockist.area || "",
    district: stockist.district || "",
    feeRate: stockist.feeRate || 0,
    sales: 0,
    fee: 0,
    memberBonus: 0,
    memberCount: 0,
    payableCount: 0,
    paidCount: 0,
    transferPaid: false
  };
  const bonusRows = serverBonusPage.rows.filter((row) => Number(row.bonus.rupiah || 0) > 0);
  const paidMemberBonus = bonusRows
    .filter((row) => row.member.paidDone)
    .reduce((sum, row) => sum + Number(row.bonus.rupiah || 0), 0);
  const unpaidMemberBonus = Math.max(0, Number(report.memberBonus || 0) - paidMemberBonus);
  const topRows = bonusRows
    .slice()
    .sort((left, right) => Number(right.bonus.rupiah || 0) - Number(left.bonus.rupiah || 0))
    .slice(0, 12)
    .map((row) => `
      <tr>
        <td><b>${html(row.member.id)}</b><br><span class="muted">${html(row.member.name)}</span></td>
        <td>${rankLabelHtml(row.member.rank)}</td>
        <td>${pv(row.member.ppv || 0)}</td>
        <td class="money">${money(row.bonus.rupiah || 0)}</td>
        <td>${row.member.paidDone ? `<span class="pill">Sudah dibayar</span>` : `<span class="muted">Belum dibayar</span>`}</td>
      </tr>
    `).join("");
  const loading = serverBonusPage.loading || serverStockistPayouts.loading;
  const error = serverBonusPage.error || serverStockistPayouts.error;
  return `
    ${controlPanel("Filter Dashboard Stokis", [
      monthControl("Bulan & Tahun"),
      stockistPaymentScopeControl("Tampilan"),
      scope === "payment" ? paymentPeriodControl("Periode Bayar") : ""
    ], `Sumber data: ${source.label}`)}
    <div style="height:16px"></div>
    ${loading ? `<article class="card"><p class="muted">Memuat dashboard stokis...</p></article>` : error ? `<article class="card"><p class="muted">${html(error)}</p></article>` : `
      <div class="grid kpi-grid">
        ${kpiCard("Stokis", report.name || stockist.name || state.activeId, stockistLocationText(report))}
        ${kpiCard("Member Dilayani", report.memberCount || 0, `${report.payableCount || 0} member ada bonus`)}
        ${kpiCard("Omset Member", money(report.sales || 0), "Omset member di stokis ini")}
        ${kpiCard("Fee Stokis", money(report.fee || 0), `${report.feeRate || stockist.feeRate || 0}% dari omset`)}
        ${kpiCard("Dana dari Pusat", report.transferPaid ? "Sudah diterima" : "Belum diterima", "Bonus member + fee stokis")}
        ${kpiCard("Bonus Member", money(report.memberBonus || 0), "Dana yang disalurkan ke member")}
        ${kpiCard("Sudah Dibayar", money(paidMemberBonus), `${report.paidCount || 0}/${report.payableCount || 0} member`)}
        ${kpiCard("Belum Dibayar", money(unpaidMemberBonus), "Masih perlu dicairkan ke member")}
      </div>
      <article class="card" style="margin-top:16px">
        <div class="toolbar">
          <div>
            <h3>Prioritas Pembayaran Member</h3>
            <p class="muted">Checklist pembayaran member dikelola di halaman Komisi.</p>
          </div>
          <div class="toolbar-actions">
            <button class="ghost" data-view="revenue">Input Omset</button>
            <button class="primary" data-view="payouts">Buka Komisi</button>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Member</th><th>Peringkat</th><th>PPV</th><th>Bonus</th><th>Status</th></tr></thead>
            <tbody>${topRows || emptyRow("Belum ada bonus member pada pilihan ini.")}</tbody>
          </table>
        </div>
      </article>
    `}
  `;
}

function stockistDashboardView(dashboardMonth = state.dashboardMonth || state.selectedMonth || currentMonthValue()) {
  const stockist = currentUser();
  const scope = stockistPaymentScopeValue();
  const report = stockistPayoutContext(stockist, scope, dashboardMonth, state.paymentPeriod);
  const topRows = (scope === "payment" ? report.unpaidRows : report.payableRows)
    .sort((left, right) => right.bonus.rupiah - left.bonus.rupiah)
    .slice(0, 12)
    .map((row) => {
      const { member, bonus } = row;
      const status = scope === "year"
        ? `${row.bonusMonths || 0} bulan ada bonus`
        : scope === "month"
          ? "Estimasi full bulan"
          : `<button class="ghost" data-payment-toggle-button="${attr(member.id)}" data-payment-month="${attr(dashboardMonth)}" data-payment-period="${attr(paymentPeriodValue())}">Tandai Dibayar</button>`;
      return `
      <tr>
        <td>${memberNameCell(member)}</td>
        <td>${rankLabelHtml(member.rank)}<br><span class="muted">TUPO ${html(tupoStatusText(member))}</span></td>
        <td>${pv(member.ppv || 0)}</td>
        <td class="money">${money(bonus.rupiah)}</td>
        <td>${status}</td>
      </tr>
    `;
    }).join("");

  return `
    ${controlPanel("Filter Dashboard Stokis", [
      scope === "year" ? yearControl("Tahun", "dashboardMonth") : monthControl("Bulan & Tahun", "dashboardMonth"),
      stockistPaymentScopeControl("Tampilan"),
      scope === "payment" ? paymentPeriodControl("Periode Bayar") : ""
    ], `Sumber data: ${report.sourceLabel}`)}
    <div style="height:16px"></div>
    <div class="grid kpi-grid">
      ${kpiCard("Stokis", stockist.name, stockistLocationText(stockist))}
      ${kpiCard("Member Dilayani", report.members.length, `${report.activeMembers} member beromset`)}
      ${kpiCard("Omset Penjualan", money(report.sales), report.sourceLabel)}
      ${kpiCard("Fee Stokis", money(report.fee), `${stockist.feeRate || 0}% dari omset`)}
      ${kpiCard("Status Dana Pusat", report.transferStatus, "Bonus member + fee stokis")}
      ${kpiCard("Bonus Member", money(report.memberBonus), `${report.payableRows.length} member punya komisi`)}
      ${scope === "payment" ? kpiCard("Sudah Dibayar", money(report.paidMemberBonus), `${report.paidRows.length}/${report.payableRows.length} member - ${paymentPeriodLabel()}`) : kpiCard("Status Bonus", report.paymentStatsLabel, report.periodNote)}
      ${scope === "payment" ? kpiCard("Belum Dibayar", money(report.unpaidMemberBonus), `Prioritas ${paymentPeriodLabel()}`) : kpiCard("Sumber Data", report.sourceLabel, report.periodNote)}
      ${kpiCard("Total Kewajiban", money(report.totalTransfer), "Bonus member + fee stokis")}
    </div>
    <article class="card" style="margin-top:16px">
      <div class="toolbar">
        <h3>${scope === "payment" ? "Prioritas Pembayaran Member" : "Ringkasan Bonus Member"}</h3>
        <div class="toolbar-actions">
          ${scope === "payment" ? `<button class="primary" data-payment-bulk="mark" data-payment-month="${attr(dashboardMonth)}" data-payment-period="${attr(paymentPeriodValue())}" data-payment-ids="${attr(report.payableRows.map((row) => row.member.id).join(","))}" ${report.payableRows.length ? "" : "disabled"}>Ceklis semua dibayar</button>` : ""}
          <button class="ghost" data-view="payouts">Buka Halaman Komisi</button>
        </div>
      </div>
      <p class="notice">Status dana pusat menandai dana dari perusahaan/cabang ke stokis. Bonus member tetap disalurkan stokis ke member melalui checklist pembayaran member.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Member</th><th>Peringkat / TUPO</th><th>PPV</th><th>Bonus</th><th>${scope === "payment" ? "Aksi" : "Status"}</th></tr></thead>
          <tbody>${topRows || `<tr><td colspan="5"><span class="muted">${scope === "payment" ? "Semua pembayaran member sudah diceklis atau belum ada bonus periode ini." : "Belum ada bonus pada tampilan ini."}</span></td></tr>`}</tbody>
        </table>
      </div>
    </article>
  `;
}

function serverMemberHomeView() {
  const scope = memberBonusScopeValue();
  if (scope === "year") {
    return `
      ${controlPanel("Filter Perkembangan Member", [
        yearControl("Tahun"),
        memberBonusScopeControl("Tampilan")
      ], "Data resmi")}
      <div style="height:16px"></div>
      <article class="card">
        <h3>Rekap 1 Tahun</h3>
        <p class="notice">Gunakan tampilan Periode Bayar atau 1 Bulan Full agar angka mengikuti data resmi perusahaan.</p>
      </article>
    `;
  }
  ensureServerDashboardSummary();
  ensureServerBonusPage();
  const source = serverPaymentSource(scope, state.selectedMonth, state.paymentPeriod);
  const data = serverDashboardSummary.data || {};
  const row = serverBonusPage.rows.find((item) => item.member.id === state.activeId) || serverBonusPage.rows[0] || null;
  const user = currentUser() || {};
  const member = row?.member || {
    id: user.id || state.activeId,
    name: user.name || state.activeId,
    rank: user.rank || "Member",
    ppv: data.ppv || 0,
    cpv: data.appv || 0,
    tnpv: data.tnpv || 0,
    atnpv: data.atnpv || 0,
    gpv: data.gpv || 0,
    paidDone: false
  };
  const bonus = row?.bonus || {
    performance: 0,
    pair: 0,
    leadership: 0,
    mentoring: 0,
    sharing: 0,
    rupiah: data.memberBonusRupiah || 0
  };
  const loading = serverDashboardSummary.loading || serverBonusPage.loading;
  const error = serverDashboardSummary.error || serverBonusPage.error;
  const paidStatus = scope === "payment"
    ? member.paidDone ? "Sudah dibayar" : Number(bonus.rupiah || 0) > 0 ? "Belum dibayar" : "Tidak ada bonus"
    : "Ringkasan bulan";
  return `
    ${controlPanel("Filter Perkembangan Member", [
      monthControl("Bulan & Tahun"),
      memberBonusScopeControl("Tampilan"),
      scope === "payment" ? paymentPeriodControl("Periode Bayar") : ""
    ], `Sumber data: ${source.label}`)}
    <div style="height:16px"></div>
    ${loading ? `<article class="card"><p class="muted">Memuat perkembangan member...</p></article>` : error ? `<article class="card"><p class="muted">${html(error)}</p></article>` : `
      <div class="grid kpi-grid">
        ${kpiCard("Peringkat", member.rank || "Member", "Peringkat aktif")}
        ${kpiCard("PPV", pv(data.ppv ?? member.ppv ?? 0), "Belanja pribadi bulan dipilih")}
        ${kpiCard("APPV", pv(data.appv ?? member.cpv ?? 0), "Akumulasi PPV pribadi")}
        ${kpiCard("TNPV", pv(data.tnpv ?? member.tnpv ?? 0), "Omset pribadi dan tim")}
        ${kpiCard("ATNPV", pv(data.atnpv ?? member.atnpv ?? 0), "Akumulasi TNPV")}
        ${kpiCard("Bonus Diterima", money(bonus.rupiah || 0), "Sesuai hasil tutup buku")}
        ${kpiCard("Status", paidStatus, scope === "payment" ? paymentPeriodLabel() : memberBonusScopeLabel())}
        ${kpiCard("Stokis", user.stockist || "-", "Pembayaran melalui stokis")}
      </div>
      <article class="card" style="margin-top:16px">
        <div class="toolbar">
          <div>
            <h3>Rincian Bonus Saya</h3>
            <p class="muted">${html(source.label)}</p>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Bonus</th><th>Nominal</th></tr></thead>
            <tbody>
              ${bonus.performance ? `<tr><td>Bonus Prestasi</td><td class="money">${money(bonus.performance)}</td></tr>` : ""}
              ${bonus.pair ? `<tr><td>Bonus Pasangan</td><td class="money">${money(bonus.pair)}</td></tr>` : ""}
              ${bonus.leadership ? `<tr><td>Bonus Kepemimpinan</td><td class="money">${money(bonus.leadership)}</td></tr>` : ""}
              ${bonus.mentoring ? `<tr><td>Bonus Bimbingan</td><td class="money">${money(bonus.mentoring)}</td></tr>` : ""}
              ${bonus.sharing ? `<tr><td>Sharing Profit</td><td class="money">${money(bonus.sharing)}</td></tr>` : ""}
              ${!Number(bonus.rupiah || 0) ? emptyRow("Belum ada bonus pada pilihan ini.") : ""}
              ${Number(bonus.rupiah || 0) ? `<tr><td><b>Total</b></td><td class="money"><b>${money(bonus.rupiah)}</b></td></tr>` : ""}
            </tbody>
          </table>
        </div>
      </article>
    `}
  `;
}

function memberHomeView() {
  if (apiConnected() && state.activeRole === "member") return serverMemberHomeView();
  const report = memberBonusReportContext();
  const { members, member, bonus } = report;
  const tupoPotential = report.scope === "year" || !bonus.blockedByTupo ? null : withCalcMembers(members, () => forcedTupoBonus(member, members));
  const tupoShortage = Math.max(0, requiredTupoPv(member.rank) - Number(member.tupoPpv ?? member.ppv ?? 0));
  return `
    ${controlPanel("Filter Perkembangan Member", [
      report.scope === "year" ? yearControl("Tahun") : monthControl("Bulan & Tahun"),
      memberBonusScopeControl("Tampilan"),
      report.scope === "payment" ? paymentPeriodControl("Periode Bayar") : ""
    ], `Sumber data: ${report.sourceLabel}`)}
    <div style="height:16px"></div>
    <div class="grid kpi-grid">
      ${kpiCard("Peringkat", member.rank, "Peringkat terkunci, tidak turun")}
      ${kpiCard("TUPO Bonus", tupoStatusText(member), tupoRequirementText(member.rank))}
      ${kpiCard(report.ppvLabel, pv(report.scope === "year" ? bonus.ppv : member.ppv), "Belanja pribadi")}
      ${kpiCard("APPV", pv(member.cpv), "Akumulasi PPV pribadi")}
      ${kpiCard(report.tnpvLabel, pv(report.scope === "year" ? bonus.tnpv : member.tnpv), "PPV pribadi + tim")}
      ${kpiCard("ATNPV Rank", pv(member.atnpv), "Akumulasi TNPV untuk peringkat")}
      ${kpiCard("Estimasi Bonus", money(bonus.rupiah), `Dibayar lewat ${stockistName(member.stockist)}`)}
      ${tupoPotential ? kpiCard("Bonus Jika TUPO", money(tupoPotential.rupiah || 0), tupoShortage > 0 ? `Kurang ${pv(tupoShortage)} TUPO` : "Menunggu ceklis TUPO") : ""}
      ${kpiCard("Status", report.paidStatus, report.scope === "payment" ? paymentPeriodLabel() : memberBonusScopeLabel())}
    </div>
    <div class="grid two-col" style="margin-top:16px">
      <article class="card">
        <h3>Rincian Bonus Saya - ${html(report.sourceLabel)}</h3>
        ${report.scope === "year" ? yearlyBonusBreakdownHtml(report.yearly) : withCalcMembers(members, () => bonusBreakdownHtml(member))}
      </article>
      <article class="card">
        <h3>Status Kaki & Carry Over</h3>
        <div class="bonus-grid">
          <div class="bonus-row"><span>Kaki kiri</span><b>${pv(member.leftPv)}</b></div>
          <div class="bonus-row"><span>Kaki kanan</span><b>${pv(member.rightPv)}</b></div>
          <div class="bonus-row"><span>PV pasangan belum terpasangkan</span><b>${pv(member.carry)}</b></div>
          <div class="bonus-row"><span>Umur carry over</span><b>${member.carryAge} bulan</b></div>
        </div>
        ${member.carryAge >= 3 ? `<p class="notice">Carry over bonus pasangan sudah 3 bulan dan perlu ditutup agar tidak hangus.</p>` : ""}
      </article>
    </div>
  `;
}

function bonusRulesHtml() {
  return `
    <div class="bonus-grid">
      <div class="bonus-row"><span>Bonus Prestasi</span><b>30%</b></div>
      <div class="bonus-row"><span>Bonus Pasangan</span><b>15%</b></div>
      <div class="bonus-row"><span>Bonus Kepemimpinan</span><b>8% / 5 generasi</b></div>
      <div class="bonus-row"><span>Bonus Bimbingan</span><b>12% / 4 generasi</b></div>
      <div class="bonus-row"><span>Sharing Profit</span><b>Pool 3%</b></div>
      <div class="bonus-row"><span>Fee Stokis kerja sama</span><b>5%</b></div>
    </div>
  `;
}

function memberProgressHtml(member) {
  const index = rankIndex[member.rank];
  const percent = Math.round((index / (ranks.length - 1)) * 100);
  return `
    <div class="rank-item">
      <div><b>${html(memberDisplayName(member))}</b><br>${rankLabelHtml(member.rank)}</div>
      <div class="bar"><span style="width:${percent}%"></span></div>
      <b>${percent}%</b>
    </div>
  `;
}

function rankLabelHtml(rankName) {
  return `<span class="rank-text ${rankBadgeClass(rankName)}">${html(rankName)}</span>`;
}

function deletedMembersPanelHtml() {
  if (state.activeRole !== "admin" || !(state.deletedMembers || []).length) return "";
  const rows = state.deletedMembers.map((entry) => `
    <tr>
      <td><b>${html(entry.member.id)}</b><br><span class="muted">${html(entry.member.name || "Member")}</span></td>
      <td>${rankLabelHtml(entry.member.rank || "Member")}<br><span class="muted">${html(stockistName(entry.member.stockist))}</span></td>
      <td>${formatDate(entry.member.joinedAt)}</td>
      <td>${formatDate(entry.deletedAt)}</td>
      <td class="actions"><button class="primary" data-restore-member="${attr(entry.id)}">Pulihkan</button></td>
    </tr>
  `).join("");
  return `
    <details class="card detail-card" style="margin-top:16px">
      <summary>Member Terhapus (${state.deletedMembers.length})</summary>
      <p class="notice">Jika salah hapus member, gunakan tombol Pulihkan. Data periode/omset yang tersimpan ikut dikembalikan.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Member</th><th>Peringkat / Stokis</th><th>Tanggal Gabung</th><th>Tanggal Dihapus</th><th>Aksi</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </details>
  `;
}

function deletedItemsPanelHtml(type, title) {
  const items = (state.deletedItems || []).filter((entry) => entry.type === type);
  if (state.activeRole !== "admin" || !items.length) return "";
  const rows = items.map((entry) => `
    <tr>
      <td><b>${html(entry.item.id)}</b><br><span class="muted">${html(entry.item.name || entry.item.title || deletedItemLabel(type))}</span></td>
      <td>${html(type === "stockist" ? `${entry.item.area || "-"} / ${entry.item.district || "-"}` : type === "announcement" ? entry.item.status || "-" : entry.item.role || "-")}</td>
      <td>${formatDate(entry.deletedAt)}</td>
      <td class="actions"><button class="primary" data-restore-item="${attr(type)}:${attr(entry.id)}">Pulihkan</button></td>
    </tr>
  `).join("");
  return `
    <details class="card detail-card" style="margin-top:16px">
      <summary>${html(title)} Terhapus (${items.length})</summary>
      <p class="notice">Jika salah hapus data, gunakan tombol Pulihkan. Data akan dikembalikan ke posisi semula selama ID belum dipakai lagi.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Data</th><th>Keterangan</th><th>Tanggal Dihapus</th><th>Aksi</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </details>
  `;
}

function serverMembersEnabled() {
  return typeof fetch === "function" && apiConnected() && ["admin", "branch", "stockist"].includes(state.activeRole);
}

function serverTupoEnabled() {
  return typeof fetch === "function" && apiConnected() && ["admin", "branch", "stockist"].includes(state.activeRole);
}

function serverRevenueEnabled() {
  return typeof fetch === "function" && apiConnected() && ["admin", "branch", "stockist", "member"].includes(state.activeRole);
}

function serverTreeEnabled() {
  return typeof fetch === "function" && apiConnected() && ["admin", "branch", "stockist", "member"].includes(state.activeRole);
}

function createServerListState() {
  return {
    rows: [],
    cursor: "",
    previousCursors: [],
    nextCursor: null,
    loading: false,
    loadedKey: "",
    error: ""
  };
}

function createServerTreeState(key = "") {
  return {
    key,
    rootId: "",
    rootLoading: false,
    error: "",
    nodes: new Map(),
    children: new Map(),
    loadingChildren: new Set()
  };
}

function resetServerTree(kind) {
  serverTreeState[kind] = createServerTreeState();
}

function resetServerTrees() {
  resetServerTree("network");
  resetServerTree("placement");
}

function resetServerMembersPagination() {
  serverMembersPage.cursor = "";
  serverMembersPage.previousCursors = [];
  serverMembersPage.loadedKey = "";
}

function resetServerTupoPagination() {
  serverTupoPage.cursor = "";
  serverTupoPage.previousCursors = [];
  serverTupoPage.loadedKey = "";
}

function resetServerRevenuePagination() {
  serverRevenuePage.cursor = "";
  serverRevenuePage.previousCursors = [];
  serverRevenuePage.loadedKey = "";
}

function resetServerListPagination(type) {
  const page = serverMasterPages[type];
  if (!page) return;
  page.cursor = "";
  page.previousCursors = [];
  page.loadedKey = "";
}

function serverMasterConfig(type) {
  return {
    stockists: { endpoint: "/api/stockists", searchKey: "stockists", mapper: apiStockistToLocal, view: "stockists" },
    admins: { endpoint: "/api/admins", searchKey: "admins", mapper: apiAdminToLocal, view: "admins" },
    announcements: { endpoint: "/api/announcements", searchKey: "announcements", mapper: apiAnnouncementToLocal, view: "announcements" }
  }[type];
}

function serverMasterEnabled(type) {
  if (typeof fetch !== "function" || !apiConnected()) return false;
  if (type === "stockists") return ["admin", "branch", "stockist"].includes(state.activeRole);
  if (type === "admins") return state.activeRole === "admin";
  if (type === "announcements") return ["admin", "branch", "stockist", "member"].includes(state.activeRole);
  return false;
}

function serverMasterKey(type) {
  const config = serverMasterConfig(type);
  const page = serverMasterPages[type];
  return [
    type,
    state.activeRole,
    state.activeId,
    searchTerms[config.searchKey] || "",
    page?.cursor || ""
  ].join("|");
}

function ensureServerMasterPage(type) {
  if (!serverMasterEnabled(type)) return;
  const page = serverMasterPages[type];
  const key = serverMasterKey(type);
  if (page.loadedKey === key || page.loading) return;
  page.loading = true;
  page.error = "";
  loadServerMasterPage(type, key);
}

function serverDashboardEnabled() {
  if (typeof fetch !== "function" || !apiConnected()) return false;
  if (state.activeRole === "member") return memberBonusScopeValue() !== "year";
  if (state.activeRole === "stockist") return stockistPaymentScopeValue() !== "year";
  return ["admin", "branch"].includes(state.activeRole) && adminReportScopeValue() !== "year";
}

function serverPaymentSource(scope, month = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  if (scope === "payment") {
    const source = commissionSourcePeriod(month, paymentPeriod);
    return {
      ledgerPeriod: source.month,
      paymentMonth: month,
      paymentPeriod: paymentPeriodValue(paymentPeriod),
      label: commissionSourceLabel(month, paymentPeriod)
    };
  }
  return {
    ledgerPeriod: month,
    paymentMonth: month,
    paymentPeriod: scope === "month" ? "month" : paymentPeriodValue(paymentPeriod),
    label: `1 Bulan Full ${monthLabel(month)}`
  };
}

function serverDashboardKey() {
  const period = ["admin", "branch"].includes(state.activeRole)
    ? state.dashboardMonth || state.selectedMonth || currentMonthValue()
    : state.selectedMonth || currentMonthValue();
  return [
    period,
    state.activeRole,
    state.activeId
  ].join("|");
}

function ensureServerDashboardSummary() {
  if (!serverDashboardEnabled()) return;
  const key = serverDashboardKey();
  if (serverDashboardSummary.key === key || serverDashboardSummary.loading) return;
  serverDashboardSummary.loading = true;
  serverDashboardSummary.error = "";
  loadServerDashboardSummary(key);
}

async function loadServerDashboardSummary(key) {
  try {
    const period = ["admin", "branch"].includes(state.activeRole)
      ? state.dashboardMonth || state.selectedMonth || currentMonthValue()
      : state.selectedMonth || currentMonthValue();
    const result = await apiRequest(`/api/reports/dashboard?period=${encodeURIComponent(period)}`);
    if (serverDashboardKey() !== key) return;
    serverDashboardSummary = { key, data: result, loading: false, error: "" };
  } catch (error) {
    if (serverDashboardKey() !== key) return;
    serverDashboardSummary = { key, data: null, loading: false, error: error.message || "Dashboard belum bisa dimuat." };
    if (error.status === 401) {
      isAuthenticated = false;
      saveApiSession(null);
      sessionStorage.removeItem(SESSION_KEY);
    }
  } finally {
    if (["dashboard", "memberHome"].includes(activeView)) render();
  }
}

async function updateServerBonusSetting(key, active) {
  await apiRequest(`/api/bonus-settings/${encodeURIComponent(key)}`, {
    method: "PATCH",
    body: JSON.stringify({ active })
  });
}

function ensureServerBonusSettings() {
  if (!apiConnected() || state.activeRole !== "admin" || serverBonusSettingsState.loaded || serverBonusSettingsState.loading) return;
  serverBonusSettingsState.loading = true;
  loadServerBonusSettings();
}

async function loadServerBonusSettings() {
  try {
    const result = await apiRequest("/api/bonus-settings");
    const nextSettings = { ...defaultState.bonusSettings, ...(state.bonusSettings || {}) };
    (result.data || []).forEach((row) => {
      nextSettings[row.bonus_type] = Boolean(row.active);
    });
    state.bonusSettings = nextSettings;
    saveState();
    serverBonusSettingsState = { loaded: true, loading: false, error: "" };
  } catch (error) {
    serverBonusSettingsState = { loaded: false, loading: false, error: error.message || "Pengaturan bonus belum bisa dimuat." };
  } finally {
    if (activeView === "bonusControl") render();
  }
}

function serverBonusEnabled() {
  if (!apiConnected() || !["admin", "branch", "stockist", "member"].includes(state.activeRole)) return false;
  if (state.activeRole === "stockist" && ["dashboard", "payouts"].includes(activeView)) return stockistPaymentScopeValue() !== "year";
  if (state.activeRole === "member") return memberBonusScopeValue() !== "year";
  return adminReportScopeValue() !== "year";
}

function serverBonusScope() {
  if (state.activeRole === "stockist" && ["dashboard", "payouts"].includes(activeView)) return stockistPaymentScopeValue();
  return state.activeRole === "member" ? memberBonusScopeValue() : adminReportScopeValue();
}

function serverBonusSearchTerm() {
  if (activeView === "payouts") return searchTerms.payouts || "";
  return activeView === "dashboard" ? "" : searchTerms.bonuses || "";
}

function resetServerBonusPage() {
  serverBonusPage.cursor = "";
  serverBonusPage.previousCursors = [];
  serverBonusPage.loadedKey = "";
}

function serverBonusKey() {
  const scope = serverBonusScope();
  const source = serverPaymentSource(scope, state.selectedMonth, state.paymentPeriod);
  return [
    scope,
    source.ledgerPeriod,
    source.paymentMonth,
    source.paymentPeriod,
    state.activeRole,
    state.activeId,
    serverBonusSearchTerm(),
    serverBonusPage.cursor || ""
  ].join("|");
}

function ensureServerBonusPage() {
  if (!serverBonusEnabled()) return;
  const key = serverBonusKey();
  if (serverBonusPage.loadedKey === key || serverBonusPage.loading) return;
  serverBonusPage.loading = true;
  serverBonusPage.error = "";
  loadServerBonusPage(key);
}

async function loadServerBonusPage(key) {
  try {
    const scope = serverBonusScope();
    const source = serverPaymentSource(scope, state.selectedMonth, state.paymentPeriod);
    const params = new URLSearchParams({
      limit: "50",
      paymentMonth: source.paymentMonth,
      paymentPeriod: source.paymentPeriod
    });
    if (serverBonusPage.cursor) params.set("cursor", serverBonusPage.cursor);
    const searchTerm = serverBonusSearchTerm();
    if (searchTerm) params.set("q", searchTerm);
    const result = await apiRequest(`/api/periods/${encodeURIComponent(source.ledgerPeriod)}/bonus-summary?${params.toString()}`);
    serverBonusPage.rows = (result.data || []).map(apiBonusSummaryToLocal);
    serverBonusPage.nextCursor = result.nextCursor || null;
    serverBonusPage.loadedKey = key;
  } catch (error) {
    serverBonusPage.error = error.message || "Data bonus belum bisa dimuat.";
  } finally {
    serverBonusPage.loading = false;
    if (["bonuses", "payouts", "dashboard", "memberHome"].includes(activeView)) render();
  }
}

function serverStockistPayoutsKey(scope = stockistPaymentScopeValue()) {
  const source = serverPaymentSource(scope, state.selectedMonth, state.paymentPeriod);
  return [scope, source.ledgerPeriod, source.paymentMonth, source.paymentPeriod, state.activeRole, state.activeId].join("|");
}

function serverStockistPayoutsEnabled() {
  return apiConnected() && ["admin", "branch", "stockist"].includes(state.activeRole) && stockistPaymentScopeValue() !== "year";
}

function ensureServerStockistPayouts(scope = stockistPaymentScopeValue()) {
  if (!serverStockistPayoutsEnabled()) return;
  const key = serverStockistPayoutsKey(scope);
  if (serverStockistPayouts.key === key || serverStockistPayouts.loading) return;
  serverStockistPayouts.loading = true;
  serverStockistPayouts.error = "";
  loadServerStockistPayouts(scope, key);
}

async function loadServerStockistPayouts(scope, key) {
  try {
    const source = serverPaymentSource(scope, state.selectedMonth, state.paymentPeriod);
    const params = new URLSearchParams({
      paymentMonth: source.paymentMonth,
      paymentPeriod: source.paymentPeriod
    });
    const result = await apiRequest(`/api/periods/${encodeURIComponent(source.ledgerPeriod)}/stockist-payouts?${params.toString()}`);
    serverStockistPayouts = {
      key,
      rows: (result.data || []).map(apiStockistPayoutToLocal),
      loading: false,
      error: ""
    };
  } catch (error) {
    serverStockistPayouts = { key, rows: [], loading: false, error: error.message || "Data pembayaran stokis belum bisa dimuat." };
  } finally {
    if (["stockists", "payouts", "dashboard"].includes(activeView)) render();
  }
}

function serverCompanyFundsEnabled() {
  return apiConnected() && state.activeRole === "admin" && companyFundScopeValue() !== "year";
}

function serverCompanyFundsKey() {
  return [state.selectedMonth, companyFundScopeValue(), state.paymentPeriod].join("|");
}

function ensureServerCompanyFunds() {
  if (!serverCompanyFundsEnabled()) return;
  const key = serverCompanyFundsKey();
  if (serverCompanyFunds.key === key || serverCompanyFunds.loading) return;
  serverCompanyFunds.loading = true;
  serverCompanyFunds.error = "";
  loadServerCompanyFunds(key);
}

async function loadServerCompanyFunds(key) {
  try {
    const params = new URLSearchParams({
      period: state.selectedMonth || currentMonthValue(),
      paymentMonth: state.selectedMonth || currentMonthValue(),
      paymentPeriod: companyFundScopeValue() === "payment" ? paymentPeriodValue() : companyFundScopeValue()
    });
    const result = await apiRequest(`/api/reports/company-funds?${params.toString()}`);
    serverCompanyFunds = { key, data: result, loading: false, error: "" };
  } catch (error) {
    serverCompanyFunds = { key, data: null, loading: false, error: error.message || "Dana kelola belum bisa dimuat." };
  } finally {
    if (activeView === "forfeitures") render();
  }
}

async function runServerBonusPeriod() {
  if (!apiConnected() || state.activeRole !== "admin") return;
  const period = state.selectedMonth || currentMonthValue();
  if (!confirm(`Jalankan tutup buku bonus untuk ${monthLabel(period)}? Hasil bonus periode ini akan dihitung ulang.`)) return;
  serverBonusRun = { loading: true, message: "", error: "" };
  render();
  try {
    const result = await apiRequest(`/api/periods/${encodeURIComponent(period)}/run-bonus`, { method: "POST" });
    serverBonusRun = {
      loading: false,
      message: `Tutup buku selesai: ${result.memberCount || 0} member diproses.`,
      error: ""
    };
    serverDashboardSummary.key = "";
    resetServerBonusPage();
    serverStockistPayouts.key = "";
    serverCompanyFunds.key = "";
    showToast("Tutup buku selesai.", "success");
  } catch (error) {
    serverBonusRun = { loading: false, message: "", error: error.message || "Tutup buku gagal." };
    showToast(serverBonusRun.error);
  }
  render();
}

async function loadServerMasterPage(type, key) {
  const config = serverMasterConfig(type);
  const page = serverMasterPages[type];
  try {
    const params = new URLSearchParams({ limit: "50" });
    if (page.cursor) params.set("cursor", page.cursor);
    if (searchTerms[config.searchKey]) params.set("q", searchTerms[config.searchKey]);
    const result = await apiRequest(`${config.endpoint}?${params.toString()}`);
    page.rows = (result.data || []).map(config.mapper);
    if (type === "stockists" && page.rows.length) state.stockists = page.rows;
    page.nextCursor = result.nextCursor || null;
    page.loadedKey = key;
  } catch (error) {
    page.error = error.message || "Data belum bisa dimuat.";
    if (error.status === 401) {
      isAuthenticated = false;
      saveApiSession(null);
      sessionStorage.removeItem(SESSION_KEY);
    }
  } finally {
    page.loading = false;
    if (activeView === config.view) render();
  }
}

function serverPagerHtml(type) {
  const page = serverMasterPages[type];
  return `
    <div class="toolbar-actions">
      <button class="ghost" data-server-master-page="${attr(type)}:prev" ${page.previousCursors.length ? "" : "disabled"}>Sebelumnya</button>
      <button class="ghost" data-server-master-page="${attr(type)}:next" ${page.nextCursor ? "" : "disabled"}>Berikutnya</button>
    </div>
  `;
}

function serverMembersKey() {
  return [
    state.selectedMonth,
    state.activeRole,
    state.activeId,
    searchTerms.members || "",
    serverMembersPage.cursor || ""
  ].join("|");
}

function serverTupoKey() {
  return [
    state.selectedMonth,
    state.activeRole,
    state.activeId,
    searchTerms.tupo || "",
    serverTupoPage.cursor || ""
  ].join("|");
}

function serverRevenueKey() {
  return [
    state.selectedMonth,
    state.activeRole,
    state.activeId,
    searchTerms.revenue || "",
    serverRevenuePage.cursor || ""
  ].join("|");
}

function ensureServerMembersPage() {
  if (!serverMembersEnabled()) return;
  const key = serverMembersKey();
  if (serverMembersPage.loadedKey === key || serverMembersPage.loading) return;
  serverMembersPage.loading = true;
  serverMembersPage.error = "";
  loadServerMembersPage(key);
}

function ensureServerTupoPage() {
  if (!serverTupoEnabled()) return;
  const key = serverTupoKey();
  if (serverTupoPage.loadedKey === key || serverTupoPage.loading) return;
  serverTupoPage.loading = true;
  serverTupoPage.error = "";
  loadServerTupoPage(key);
}

function ensureServerRevenuePage() {
  if (!serverRevenueEnabled()) return;
  const key = serverRevenueKey();
  if (serverRevenuePage.loadedKey === key || serverRevenuePage.loading) return;
  serverRevenuePage.loading = true;
  serverRevenuePage.error = "";
  loadServerRevenuePage(key);
}

async function loadServerMembersPage(key) {
  try {
    const params = new URLSearchParams({
      limit: "50",
      period: state.selectedMonth
    });
    if (serverMembersPage.cursor) params.set("cursor", serverMembersPage.cursor);
    if (searchTerms.members) params.set("q", searchTerms.members);
    const result = await apiRequest(`/api/members?${params.toString()}`);
    serverMembersPage.rows = (result.data || []).map(apiMemberToLocal);
    serverMembersPage.nextCursor = result.nextCursor || null;
    serverMembersPage.loadedKey = key;
  } catch (error) {
    serverMembersPage.error = error.message || "Data member belum bisa dimuat.";
    if (error.status === 401) {
      isAuthenticated = false;
      saveApiSession(null);
      sessionStorage.removeItem(SESSION_KEY);
    }
  } finally {
    serverMembersPage.loading = false;
    if (activeView === "members") render();
  }
}

async function loadServerRevenuePage(key) {
  try {
    const params = new URLSearchParams({
      limit: "50",
      period: state.selectedMonth
    });
    if (serverRevenuePage.cursor) params.set("cursor", serverRevenuePage.cursor);
    if (searchTerms.revenue) params.set("q", searchTerms.revenue);
    const result = await apiRequest(`/api/members?${params.toString()}`);
    serverRevenuePage.rows = (result.data || []).map(apiMemberToLocal);
    serverRevenuePage.nextCursor = result.nextCursor || null;
    serverRevenuePage.loadedKey = key;
  } catch (error) {
    serverRevenuePage.error = error.message || "Data omset belum bisa dimuat.";
    if (error.status === 401) {
      isAuthenticated = false;
      saveApiSession(null);
      sessionStorage.removeItem(SESSION_KEY);
    }
  } finally {
    serverRevenuePage.loading = false;
    if (activeView === "revenue") render();
  }
}

async function loadServerTupoPage(key) {
  try {
    const params = new URLSearchParams({
      limit: "50",
      period: state.selectedMonth
    });
    if (serverTupoPage.cursor) params.set("cursor", serverTupoPage.cursor);
    if (searchTerms.tupo) params.set("q", searchTerms.tupo);
    const result = await apiRequest(`/api/members?${params.toString()}`);
    serverTupoPage.rows = (result.data || []).map(apiMemberToLocal);
    serverTupoPage.nextCursor = result.nextCursor || null;
    serverTupoPage.loadedKey = key;
  } catch (error) {
    serverTupoPage.error = error.message || "Data TUPO belum bisa dimuat.";
    if (error.status === 401) {
      isAuthenticated = false;
      saveApiSession(null);
      sessionStorage.removeItem(SESSION_KEY);
    }
  } finally {
    serverTupoPage.loading = false;
    if (activeView === "tupo") render();
  }
}

function serverMembersView() {
  ensureServerMembersPage();
  const memberIds = serverMembersPage.rows.map((member) => member.id);
  const rows = serverMembersPage.rows.map((member) => `
    <tr>
      ${selectionCell("member", member.id)}
      <td>${memberNameCell(member, state.activeRole === "admin")}</td>
      <td>${rankLabelHtml(member.rank)}</td>
      <td>${formatDate(member.joinedAt)}</td>
      <td>${pv(member.ppv)}<br><span class="muted">APPV ${pv(member.cpv)}</span></td>
      <td>${pv(member.tnpv)}<br><span class="muted">ATNPV ${pv(member.atnpv)}</span></td>
      <td>${html(stockistName(member.stockist) !== "-" ? stockistName(member.stockist) : member.stockist || "-")}</td>
      <td class="actions">
        <button class="icon-btn" title="Input PV" data-server-omzet="${attr(member.id)}">O</button>
        <button class="icon-btn" title="Edit" data-server-edit-member="${attr(member.id)}">E</button>
        ${state.activeRole === "admin" ? `<button class="icon-btn" title="${member.renewalFailed || member.active === false ? "Aktifkan" : "Nonaktifkan"}" data-server-member-status="${attr(member.id)}:${member.renewalFailed || member.active === false ? "active" : "inactive"}">${member.renewalFailed || member.active === false ? "A" : "N"}</button>` : ""}
        <button class="icon-btn danger" title="Hapus permanen" data-server-delete-member="${attr(member.id)}">X</button>
      </td>
    </tr>
  `).join("");
  return `
    ${controlPanel("Filter Data Member", [
      monthControl("Bulan & Tahun")
    ], "Data ditampilkan bertahap agar tetap ringan saat jumlah member besar.")}
    <div style="height:16px"></div>
    <article class="card">
      <div class="toolbar">
        <h3>Data Member</h3>
        <div class="toolbar-actions">
          ${searchBox("members", "ID, nama, peringkat")}
          <span class="pill">${serverMembersPage.rows.length} data tampil</span>
          <button class="ghost" data-members-page="prev" ${serverMembersPage.previousCursors.length ? "" : "disabled"}>Sebelumnya</button>
          <button class="primary" data-members-page="next" ${serverMembersPage.nextCursor ? "" : "disabled"}>Berikutnya</button>
          ${bulkActionButton("member", "Hapus Terpilih")}
          ${state.activeRole !== "member" ? `<button class="primary" data-server-add-member>Tambah Member</button>` : ""}
        </div>
      </div>
      ${serverMembersPage.loading ? `<p class="notice">Memuat data member...</p>` : ""}
      ${serverMembersPage.error ? `<p class="notice">${html(serverMembersPage.error)}</p>` : ""}
      <div class="table-wrap">
        <table>
          <thead><tr>${selectionHeader("member", memberIds)}<th>Member</th><th>Peringkat</th><th>Tanggal Gabung</th><th>PPV / APPV</th><th>TNPV / ATNPV</th><th>Stokis</th><th>Aksi</th></tr></thead>
          <tbody>${rows || emptyRow(serverMembersPage.loading ? "Memuat data..." : "Tidak ada data member.")}</tbody>
        </table>
      </div>
      <p class="notice">Tambah, edit, hapus permanen member, peringkat, TUPO, input PV, dan pengaturan bonus personal disimpan langsung ke sistem.</p>
    </article>
  `;
}

function serverTupoView() {
  ensureServerTupoPage();
  const members = serverTupoPage.rows;
  const requiredMembers = members.filter((member) => requiredTupoPv(member.rank) > 0);
  const doneMembers = requiredMembers.filter((member) => effectiveTupoDone(member));
  const blockedManualMembers = requiredMembers.filter((member) => member.tupoBlocked);
  const blockedMembers = requiredMembers.filter((member) => !effectiveTupoDone(member));
  const rows = members.map((member) => {
    const requiredPv = requiredTupoPv(member.rank);
    const checked = effectiveTupoDone(member);
    const status = requiredPv <= 0
      ? "Tidak wajib"
      : member.tupoBlocked
        ? "Ditahan Sistem"
        : checked
        ? "Sudah"
        : "Belum";
    return `
      <tr>
        <td class="select-col">
          <input type="checkbox" data-server-tupo-toggle="${attr(member.id)}" ${checked ? "checked" : ""} ${requiredPv > 0 && canEditAll() ? "" : "disabled"} title="${attr(requiredPv > 0 ? "Ceklis TUPO" : "Tidak wajib TUPO")}">
        </td>
        <td>${memberNameCell(member, state.activeRole === "admin")}</td>
        <td>${rankLabelHtml(member.rank)}<br><span class="muted">${html(member.stockist || "-")}</span></td>
        <td>${pv(member.ppv)}<br><span class="muted">APPV ${pv(member.cpv)}</span></td>
        <td>${requiredPv > 0 ? pv(requiredPv) : "Tidak wajib"}</td>
        <td><span class="pill">${html(status)}</span></td>
      </tr>
    `;
  }).join("");

  return `
    ${controlPanel("Filter TUPO Bulanan", [monthControl("Bulan & Tahun")], "TUPO mengikuti data resmi perusahaan.")}
    <div style="height:16px"></div>
    <div class="grid kpi-grid">
      ${kpiCard("Wajib TUPO", requiredMembers.length, "Royal Star ke atas")}
      ${kpiCard("Sudah TUPO", doneMembers.length, "Memenuhi syarat bonus bulan ini")}
      ${kpiCard("Ditahan Sistem", blockedManualMembers.length, "Status pembayaran bonus ditahan")}
      ${kpiCard("Belum TUPO", blockedMembers.length, "Bonus belum dibayarkan")}
    </div>
    <article class="card" style="margin-top:16px">
      <div class="toolbar">
        <h3>Ceklis TUPO</h3>
        <div class="toolbar-actions">
          ${searchBox("tupo", "ID, nama, peringkat")}
          <span class="pill">${members.length} data tampil</span>
          <button class="ghost" data-server-tupo-page="prev" ${serverTupoPage.previousCursors.length ? "" : "disabled"}>Sebelumnya</button>
          <button class="primary" data-server-tupo-page="next" ${serverTupoPage.nextCursor ? "" : "disabled"}>Berikutnya</button>
        </div>
      </div>
      ${serverTupoPage.loading ? `<p class="notice">Memuat TUPO...</p>` : ""}
      ${serverTupoPage.error ? `<p class="notice">${html(serverTupoPage.error)}</p>` : ""}
      <div class="table-wrap">
        <table>
          <thead><tr><th></th><th>ID</th><th>Peringkat / Stokis</th><th>PPV / APPV</th><th>Syarat TUPO</th><th>Status Bonus</th></tr></thead>
          <tbody>${rows || emptyRow(serverTupoPage.loading ? "Memuat data..." : "Belum ada member aktif.")}</tbody>
        </table>
      </div>
      <p class="notice">Jika halaman ini kosong, berarti belum ada member aktif pada pilihan bulan tersebut.</p>
    </article>
  `;
}

function membersView() {
  if (serverMembersEnabled()) return serverMembersView();
  const fullMonthMembers = monthlyMembersList();
  const periodMembersById = new Map(computedMembersForRevenuePeriod(state.selectedMonth, state.revenuePeriod, state.members).map((member) => [member.id, member]));
  const members = fullMonthMembers.filter((member) => matchesSearch(member, searchTerms.members, [stockistName(member.stockist)]));
  const canAddMember = canEditAll() || state.activeRole === "stockist";
  const memberIds = members.map((member) => member.id);
  const rows = members.map((member) => {
    const periodMember = periodMembersById.get(member.id) || member;
    return `
      <tr>
        ${selectionCell("member", member.id)}
        <td>${memberNameCell(member, state.activeRole === "admin")}</td>
        <td>${rankLabelHtml(member.rank)}<br><span class="muted">TUPO Bonus ${tupoStatusText(member)}${state.activeRole === "admin" ? ` - Renewal ${html(renewalStatusText(member))}` : ""}${state.activeRole === "admin" && member.manualRank ? " - Rank Khusus" : ""}${state.activeRole === "admin" && hasDisabledPersonalBonus(member) ? ` - Nonaktif: ${html(disabledPersonalBonusLabels(member).join(", "))}` : ""}</span></td>
        <td>${formatDate(member.joinedAt)}</td>
        <td>${pv(periodMember.ppv)}<br><span class="muted">${html(revenuePeriodLabel())} / total ${pv(member.ppv)}</span><br><span class="muted">APPV ${pv(member.cpv)}</span></td>
        <td><span class="muted">Tim ${html(revenuePeriodLabel())}</span><br>${pv(periodMember.tnpv)}<br><span class="muted">Total bulan ${pv(member.tnpv)}</span><br><span class="muted">Akumulasi rank ${pv(member.atnpv)}</span></td>
        <td>${html(stockistName(member.stockist))}</td>
        <td class="actions">${actionButtons("member", member.id)}</td>
      </tr>
    `;
  }).join("");
  return `
    ${controlPanel("Filter Data Member", [
      monthControl("Bulan & Tahun"),
      revenuePeriodControl("Periode Omset")
    ], `Menampilkan data ${revenuePeriodLabel()} dan total bulan penuh.`)}
    <div style="height:16px"></div>
    <article class="card">
      <div class="toolbar">
        <h3>Data Member</h3>
        <div class="toolbar-actions">
          ${searchBox("members", "ID, nama, peringkat, stokis")}
          ${bulkActionButton("member")}
          ${state.activeRole === "admin" ? `<button class="ghost" data-seed-custom-test>Tambah Member Test Custom</button>` : ""}
          ${canAddMember ? `<button class="primary" data-add="member">Tambah Member</button>` : `<span class="pill">Mode lihat perkembangan</span>`}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>${selectionHeader("member", memberIds)}<th>ID</th><th>Peringkat</th><th>Tanggal</th><th>PPV / APPV</th><th>Tim / Akumulasi Rank</th><th>Stokis</th><th>Aksi</th></tr></thead>
          <tbody>${rows || emptyRow("Tidak ada member yang cocok.")}</tbody>
        </table>
      </div>
    </article>
    ${deletedMembersPanelHtml()}
  `;
}

function tupoView() {
  if (serverTupoEnabled()) return serverTupoView();
  const members = monthlyMembersList().filter((member) => matchesSearch(member, searchTerms.tupo, [stockistName(member.stockist)]));
  const requiredMembers = members.filter((member) => requiredTupoPv(member.rank) > 0);
  const doneMembers = requiredMembers.filter((member) => effectiveTupoDone(member));
  const blockedManualMembers = requiredMembers.filter((member) => member.tupoBlocked);
  const blockedMembers = requiredMembers.filter((member) => !effectiveTupoDone(member));
  const markIds = requiredMembers.map((member) => member.id);
  const clearIds = requiredMembers
    .filter((member) => member.tupoDone || member.tupoBlocked)
    .map((member) => member.id);
  const rows = members.map((member) => {
    const requiredPv = requiredTupoPv(member.rank);
    const autoDone = requiredPv > 0 && Number(member.ppv || 0) >= requiredPv;
    const manualDone = Boolean(member.tupoDone);
    const manualBlocked = Boolean(member.tupoBlocked);
    const checked = effectiveTupoDone(member);
    const disabled = requiredPv <= 0 || !canEditAll();
    const status = requiredPv <= 0
      ? "Tidak wajib"
      : manualBlocked
        ? "Ditahan Sistem"
        : manualDone || autoDone
        ? "Sudah"
        : "Belum";
    return `
      <tr>
        <td class="select-col">
          <input type="checkbox" data-tupo-toggle="${attr(member.id)}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} title="${attr(disabled ? status : checked ? "Matikan TUPO" : "Ceklis TUPO")}">
        </td>
        <td>${memberNameCell(member, state.activeRole === "admin")}</td>
        <td>${rankLabelHtml(member.rank)}<br><span class="muted">${html(stockistName(member.stockist))}</span></td>
        <td>${pv(member.ppv)}<br><span class="muted">APPV ${pv(member.cpv)}</span></td>
        <td>${requiredPv > 0 ? pv(requiredPv) : "Tidak wajib"}</td>
        <td><span class="pill">${html(status)}</span></td>
      </tr>
    `;
  }).join("");

  return `
    ${controlPanel("Filter TUPO Bulanan", [monthControl("Bulan & Tahun")], "TUPO dihitung dari total PPV satu bulan penuh.")}
    <div style="height:16px"></div>
    <div class="grid kpi-grid">
      ${kpiCard("Wajib TUPO", requiredMembers.length, "Royal Star ke atas")}
      ${kpiCard("Sudah TUPO", doneMembers.length, "Memenuhi syarat bonus bulan ini")}
      ${kpiCard("Ditahan Sistem", blockedManualMembers.length, "Status pembayaran bonus ditahan")}
      ${kpiCard("Belum TUPO", blockedMembers.length, "Bonus belum dibayarkan")}
    </div>
    <article class="card" style="margin-top:16px">
      <div class="toolbar">
        <h3>Ceklis TUPO Bulanan</h3>
        <div class="toolbar-actions">
          ${searchBox("tupo", "ID, nama, peringkat, stokis")}
          ${canEditAll() ? `<button class="primary" data-tupo-bulk="mark" data-tupo-ids="${attr(markIds.join(","))}" ${markIds.length ? "" : "disabled"}>Ceklis semua tampil</button>` : ""}
          ${canEditAll() ? `<button class="ghost" data-tupo-bulk="clear" data-tupo-ids="${attr(clearIds.join(","))}" ${clearIds.length ? "" : "disabled"}>Kosongkan pengaturan</button>` : ""}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th></th><th>ID</th><th>Peringkat / Stokis</th><th>PPV / APPV</th><th>Syarat TUPO</th><th>Status Bonus</th></tr></thead>
          <tbody>${rows || emptyRow("Tidak ada member yang cocok.")}</tbody>
        </table>
      </div>
      <p class="notice">Ceklis TUPO menentukan kelayakan pembayaran bonus bulan tersebut. Jika dikosongkan, status mengikuti kondisi PPV dan pengaturan yang sedang berlaku.</p>
    </article>
  `;
}

function stockistMetricsForScope(stockist, scope = stockistPaymentScopeValue()) {
  const stockistId = stockist.id;
  if (scope === "year") {
    const months = dataMonthsForYear(selectedYearValue());
    return months.reduce((totals, month) => {
      const contextMembers = computedMembersForMonth(month, state.members);
      const stockistMembers = contextMembers.filter((member) => member.stockist === stockistId);
      const sales = stockistMembers.reduce((sum, member) => sum + Number(member.ppv || 0) * 1000, 0);
      return {
        members: totals.members + stockistMembers.length,
        sales: totals.sales + sales,
        fee: totals.fee + sales * Number(stockist.feeRate || 0) / 100,
        memberBonus: totals.memberBonus + stockistMemberBonusRupiahForMembers(stockistMembers, contextMembers),
        paymentStats: totals.paymentStats
      };
    }, { members: 0, sales: 0, fee: 0, memberBonus: 0, paymentStats: { payableCount: 0, paidCount: 0, allPaid: false, status: "Audit tahunan" } });
  }
  if (scope === "month") {
    const contextMembers = computedMembersForMonth(state.selectedMonth, state.members);
    const stockistMembers = contextMembers.filter((member) => member.stockist === stockistId);
    const sales = stockistMembers.reduce((sum, member) => sum + Number(member.ppv || 0) * 1000, 0);
    return {
      members: stockistMembers.length,
      sales,
      fee: sales * Number(stockist.feeRate || 0) / 100,
      memberBonus: stockistMemberBonusRupiahForMembers(stockistMembers, contextMembers),
      paymentStats: { payableCount: 0, paidCount: 0, allPaid: false, status: "Audit bulan full" }
    };
  }
  const contextMembers = commissionMembersForPayment(state.selectedMonth, state.paymentPeriod, state.members);
  const stockistMembers = contextMembers.filter((member) => member.stockist === stockistId);
  const sales = stockistMembers.reduce((sum, member) => sum + Number(member.ppv || 0) * 1000, 0);
  return {
    members: stockistMembers.length,
    sales,
    fee: sales * Number(stockist.feeRate || 0) / 100,
    memberBonus: stockistMemberBonusRupiahForMembers(stockistMembers, contextMembers),
    paymentStats: stockistPaymentStats(stockistId, state.selectedMonth, stockistMembers, contextMembers, state.paymentPeriod)
  };
}

function stockistPayoutContext(stockist = currentUser(), scope = stockistPaymentScopeValue(), month = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  const stockistId = stockist.id;
  const feeRate = Number(stockist.feeRate || 0);
  if (scope === "year") {
    const year = selectedYearValue(month);
    const months = dataMonthsForYear(year);
    const byMember = new Map();
    const activeIds = new Set();
    let sales = 0;
    months.forEach((periodMonth) => {
      const contextMembers = computedMembersForMonth(periodMonth, state.members);
      const stockistMembers = contextMembers.filter((member) => member.stockist === stockistId);
      sales += stockistMembers.reduce((sum, member) => sum + Number(member.ppv || 0) * 1000, 0);
      stockistMembers.forEach((member) => {
        if (Number(member.ppv || 0) > 0) activeIds.add(member.id);
      });
      stockistMemberBonusRows(stockistMembers, contextMembers).forEach(({ member, bonus }) => {
        const current = byMember.get(member.id) || {
          member: { ...member, ppv: 0, paidDone: false },
          bonus: { rupiah: 0 },
          bonusMonths: 0,
          paidMonths: 0
        };
        current.member = { ...member, ppv: Number(current.member.ppv || 0) + Number(member.ppv || 0), paidDone: false };
        current.bonus.rupiah += Number(bonus.rupiah || 0);
        if (Number(bonus.rupiah || 0) > 0) current.bonusMonths += 1;
        if (periodPaymentDone(member.id, periodMonth, "1") || periodPaymentDone(member.id, periodMonth, "2")) current.paidMonths += 1;
        byMember.set(member.id, current);
      });
    });
    const rows = [...byMember.values()];
    const payableRows = rows.filter((row) => row.bonus.rupiah > 0);
    const memberBonus = rows.reduce((sum, row) => sum + row.bonus.rupiah, 0);
    const fee = sales * feeRate / 100;
    const totalTransfer = memberBonus + fee;
    const transferPaid = stockistFeePaymentDoneForScope(stockistId, "year", month, paymentPeriod);
    return {
      scope,
      sourceLabel: `1 Tahun ${year}`,
      periodNote: `${months.length} bulan berdata`,
      members: rows.map((row) => row.member),
      rows,
      payableRows,
      paidRows: [],
      unpaidRows: payableRows,
      sales,
      fee,
      memberBonus,
      paidMemberBonus: 0,
      unpaidMemberBonus: memberBonus,
      totalTransfer,
      transferPaid,
      transferStatus: totalTransfer <= 0 ? "Tidak ada dana" : transferPaid ? "Dana sudah diterima" : "Dana belum diterima",
      activeMembers: activeIds.size,
      paymentStatsLabel: "Ringkasan 1 tahun"
    };
  }
  if (scope === "month") {
    const contextMembers = computedMembersForMonth(month, state.members);
    const members = contextMembers.filter((member) => member.stockist === stockistId);
    const rows = stockistMemberBonusRows(members, contextMembers);
    const payableRows = rows.filter((row) => row.bonus.rupiah > 0);
    const sales = members.reduce((sum, member) => sum + Number(member.ppv || 0) * 1000, 0);
    const memberBonus = rows.reduce((sum, row) => sum + row.bonus.rupiah, 0);
    const fee = sales * feeRate / 100;
    const totalTransfer = memberBonus + fee;
    const transferPaid = stockistFeePaymentDoneForScope(stockistId, "month", month, paymentPeriod);
    return {
      scope,
      sourceLabel: `1 Bulan Full ${monthLabel(month)}`,
      periodNote: "Gabungan Periode 1 + Periode 2",
      members,
      rows,
      payableRows,
      paidRows: [],
      unpaidRows: payableRows,
      sales,
      fee,
      memberBonus,
      paidMemberBonus: 0,
      unpaidMemberBonus: memberBonus,
      totalTransfer,
      transferPaid,
      transferStatus: totalTransfer <= 0 ? "Tidak ada dana" : transferPaid ? "Dana sudah diterima" : "Dana belum diterima",
      activeMembers: members.filter((member) => Number(member.ppv || 0) > 0).length,
      paymentStatsLabel: "Estimasi 1 bulan full"
    };
  }
  const contextMembers = commissionMembersForPayment(month, paymentPeriod, state.members);
  const members = contextMembers.filter((member) => member.stockist === stockistId);
  const rows = stockistMemberBonusRows(members, contextMembers);
  const payableRows = rows.filter((row) => row.bonus.rupiah > 0);
  const paidRows = payableRows.filter((row) => row.member.paidDone);
  const unpaidRows = payableRows.filter((row) => !row.member.paidDone);
  const sales = members.reduce((sum, member) => sum + Number(member.ppv || 0) * 1000, 0);
  const memberBonus = rows.reduce((sum, row) => sum + row.bonus.rupiah, 0);
  const paidMemberBonus = paidRows.reduce((sum, row) => sum + row.bonus.rupiah, 0);
  const unpaidMemberBonus = unpaidRows.reduce((sum, row) => sum + row.bonus.rupiah, 0);
  const fee = sales * feeRate / 100;
  const totalTransfer = memberBonus + fee;
  const transferPaid = stockistFeePaymentDoneForScope(stockistId, "payment", month, paymentPeriod);
  return {
    scope,
    sourceLabel: commissionSourceLabel(month, paymentPeriod),
    periodNote: paymentPeriodLabel(paymentPeriod),
    members,
    rows,
    payableRows,
    paidRows,
    unpaidRows,
    sales,
    fee,
    memberBonus,
    paidMemberBonus,
    unpaidMemberBonus,
    totalTransfer,
    transferPaid,
    transferStatus: totalTransfer <= 0 ? "Tidak ada dana" : transferPaid ? "Dana sudah diterima" : "Dana belum diterima",
    activeMembers: members.filter((member) => Number(member.ppv || 0) > 0).length,
    paymentStatsLabel: `${paidRows.length}/${payableRows.length} member dibayar`
  };
}

function stockistsView() {
  if (serverMasterEnabled("stockists")) return serverStockistsView();
  const stockists = state.stockists
    .filter((item) => state.activeRole !== "branch" || branchCanAccessArea(item.area))
    .filter((item) => matchesSearch(item, searchTerms.stockists, [item.district]));
  const scope = stockistPaymentScopeValue();
  const stockistIds = stockists.map((item) => item.id);
  const rows = stockists.map((item) => {
    const metrics = stockistMetricsForScope(item, scope);
    const transferAmount = metrics.memberBonus + metrics.fee;
    const transferPaid = stockistFeePaymentDoneForScope(item.id, scope, state.selectedMonth, state.paymentPeriod);
    const transferChecked = transferAmount > 0 && transferPaid;
    const canToggleMemberPayments = scope === "payment" && metrics.paymentStats.payableCount > 0;
    const transferStatus = transferAmount <= 0 ? "Tidak ada dana" : transferChecked ? "Dana sudah dikirim" : "Dana belum dikirim";
    return `
      <tr>
        ${selectionCell("stockist", item.id)}
        <td><b>${html(item.id)}</b><br><span class="muted">${html(item.name)}</span></td>
        <td>${html(item.area)}<br><span class="muted">${html(item.district || "-")}</span></td>
        <td>${money(metrics.sales)}</td>
        <td class="money">${money(metrics.fee)}</td>
        <td>
          <label class="select-all-inline">
            <input type="checkbox" data-stockist-fee-toggle="${attr(item.id)}" data-stockist-scope="${attr(scope)}" data-payment-month="${attr(state.selectedMonth)}" data-payment-period="${attr(paymentPeriodValue())}" ${transferChecked ? "checked" : ""} ${transferAmount > 0 ? "" : "disabled"} title="${transferChecked ? "Dana bonus member + fee sudah dikirim ke stokis" : "Tandai dana bonus member + fee sudah dikirim ke stokis"}">
            ${transferAmount <= 0 ? "-" : transferChecked ? "Sudah" : "Belum"}
          </label>
          <br><span class="${transferChecked ? "pill" : "muted"}">${html(transferStatus)}</span>
        </td>
        <td>${money(metrics.memberBonus)}<br><span class="muted">${scope === "payment" ? `${metrics.paymentStats.paidCount}/${metrics.paymentStats.payableCount} member dibayar` : metrics.paymentStats.status}</span></td>
        <td class="actions">
          ${canEditAll() ? `<button class="ghost" data-stockist-pay-all="${attr(item.id)}" data-payment-month="${attr(state.selectedMonth)}" data-payment-period="${attr(paymentPeriodValue())}" ${canToggleMemberPayments ? "" : "disabled"}>${metrics.paymentStats.allPaid ? "Buka Semua Member" : "Bayar Semua Member"}</button>` : ""}
          ${actionButtons("stockist", item.id)}
        </td>
      </tr>
    `;
  }).join("");
  return `
    ${controlPanel("Filter Stokis", [
      scope === "year" ? yearControl("Tahun") : monthControl("Bulan & Tahun"),
      stockistPaymentScopeControl("Tampilan"),
      scope === "payment" ? paymentPeriodControl("Periode Bayar") : ""
    ], scope === "payment" ? `Sumber: ${commissionSourceLabel(state.selectedMonth, state.paymentPeriod)}` : scope === "year" ? `Audit ${selectedYearValue()}` : `Audit ${selectedMonthLabel()} full`)}
    <div style="height:16px"></div>
    <article class="card">
      <div class="toolbar">
        <h3>${state.activeRole === "branch" ? `Stokis Cabang ${html(currentUser()?.area || "")}` : "Dana & Pembayaran via Stokis"}</h3>
        <div class="toolbar-actions">
          ${searchBox("stockists", "ID, nama, provinsi, daerah")}
          ${bulkActionButton("stockist")}
          ${canEditAll() ? `<button class="primary" data-add="stockist">Tambah Stokis</button>` : ""}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>${selectionHeader("stockist", stockistIds)}<th>ID Stokis</th><th>Provinsi / Daerah</th><th>Omset Penjualan</th><th>Fee Stokis</th><th>Dana ke Stokis</th><th>Bonus Member</th><th>Aksi</th></tr></thead>
          <tbody>${rows || emptyRow("Tidak ada stokis yang cocok.")}</tbody>
        </table>
      </div>
      <p class="notice">Ceklis dana ke stokis berarti admin sudah mengirim dana periode tersebut ke stokis: bonus member untuk disalurkan ditambah fee stokis. Checklist pembayaran member tetap dicatat terpisah oleh stokis saat bonus sudah dibayarkan ke member.</p>
    </article>
    ${deletedItemsPanelHtml("stockist", "Stokis")}
  `;
}

function serverMasterActionButtons(type, id) {
  const canEdit = type === "stockists" ? canEditAll() : state.activeRole === "admin";
  if (!canEdit) return `<span class="muted">Lihat saja</span>`;
  const dialogType = { stockists: "serverStockist", admins: "serverAdmin", announcements: "serverAnnouncement" }[type];
  const canDelete = state.activeRole === "admin" && !(type === "admins" && id === state.activeId);
  return `
    <button class="icon-btn" title="Edit" data-edit="${attr(dialogType)}:${attr(id)}">E</button>
    ${canDelete ? `<button class="icon-btn danger" title="Arsipkan" data-server-master-delete="${attr(type)}:${attr(id)}">X</button>` : ""}
  `;
}

function serverStockistsView() {
  ensureServerMasterPage("stockists");
  ensureServerStockistPayouts(stockistPaymentScopeValue());
  const page = serverMasterPages.stockists;
  const scope = stockistPaymentScopeValue();
  const source = serverPaymentSource(scope, state.selectedMonth, state.paymentPeriod);
  const isStockistView = state.activeRole === "stockist";
  const payoutById = serverStockistPayoutsEnabled() ? new Map(serverStockistPayouts.rows.map((row) => [row.id, row])) : new Map();
  const rows = page.rows.map((item) => {
    const payout = payoutById.get(item.id) || {};
    const totalTransfer = Number(payout.memberBonus || 0) + Number(payout.fee || 0);
    return `
      <tr>
        <td><b>${html(item.id)}</b><br><span class="muted">${html(item.name)}</span></td>
        <td>${html(item.area)}<br><span class="muted">${html(item.district || "-")}</span></td>
        <td>${money(payout.sales || 0)}<br><span class="muted">${item.memberCount || payout.memberCount || 0} member</span></td>
        <td class="money">${money(payout.fee || 0)}</td>
        <td class="money">${money(payout.memberBonus || 0)}<br><span class="muted">${payout.paidCount || 0}/${payout.payableCount || 0} member dibayar</span></td>
        <td>
          <label class="select-all-inline">
            <input type="checkbox" data-stockist-fee-toggle="${attr(item.id)}" data-server-stockist-transfer="true" data-sales-rupiah="${attr(payout.sales || 0)}" data-fee-rupiah="${attr(payout.fee || 0)}" data-member-bonus-rupiah="${attr(payout.memberBonus || 0)}" ${payout.transferPaid ? "checked" : ""} ${!isStockistView && totalTransfer > 0 && scope !== "year" ? "" : "disabled"} title="${payout.transferPaid ? "Dana bonus member + fee sudah dikirim ke stokis" : "Tandai dana bonus member + fee sudah dikirim ke stokis"}">
            ${totalTransfer <= 0 ? "-" : payout.transferPaid ? "Sudah" : "Belum"}
          </label>
        </td>
        <td class="actions">${isStockistView ? `<button class="ghost" data-view="payouts">Komisi</button>` : serverMasterActionButtons("stockists", item.id)}</td>
      </tr>
    `;
  }).join("");
  return `
    ${controlPanel("Filter Stokis", [
      scope === "year" ? yearControl("Tahun") : monthControl("Bulan & Tahun"),
      stockistPaymentScopeControl("Tampilan"),
      scope === "payment" ? paymentPeriodControl("Periode Bayar") : ""
    ], serverStockistPayoutsEnabled() ? `Sumber data: ${source.label}` : "Data stokis")}
    <div style="height:16px"></div>
    <article class="card">
      <div class="toolbar">
        <div>
          <h3>${isStockistView ? "Profil & Dana Stokis Saya" : state.activeRole === "branch" ? `Stokis Cabang ${html(currentUser()?.area || "")}` : "Data Stokis"}</h3>
          <p class="muted">${isStockistView ? "Menampilkan omset member, fee stokis, bonus member yang harus disalurkan, dan status dana dari pusat/cabang." : "Data stokis dimuat bertahap agar tetap ringan."}</p>
        </div>
        <div class="toolbar-actions">
          ${isStockistView ? "" : searchBox("stockists", "ID, nama, provinsi, daerah")}
          ${canEditAll() ? `<button class="primary" data-add="serverStockist">Tambah Stokis</button>` : ""}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID Stokis</th><th>Provinsi / Daerah</th><th>Omset</th><th>Fee</th><th>Bonus Member</th><th>Dana ke Stokis</th><th>Aksi</th></tr></thead>
          <tbody>${page.loading ? emptyRow("Memuat data stokis...") : page.error ? emptyRow(page.error) : rows || emptyRow("Tidak ada stokis yang cocok.")}</tbody>
        </table>
      </div>
      <div class="toolbar" style="margin-top:12px">
        <span class="pill">${page.rows.length} data tampil</span>
        ${serverPagerHtml("stockists")}
      </div>
      ${serverStockistPayouts.error ? `<p class="notice">${html(serverStockistPayouts.error)}</p>` : ""}
      <p class="notice">${isStockistView ? "Status dana menunjukkan apakah dana bonus member dan fee stokis sudah diterima dari pusat/cabang. Pembayaran ke member tetap diceklis di halaman Komisi." : "Checklist dana ke stokis berarti admin/cabang sudah mengirim dana bonus member ditambah fee stokis ke stokis tersebut."}</p>
    </article>
  `;
}

function forfeitureRowsHtml(rows, emptyMessage) {
  const filteredRows = rows.filter((row) => matchesSearch(row.member || {}, searchTerms.forfeitures, [row.category, row.status, row.source, row.note, row.member ? stockistName(row.member.stockist) : "Perusahaan"]));
  return filteredRows.map((row) => `
    <tr>
      <td><b>${html(row.member?.id || "PERUSAHAAN")}</b><br><span class="muted">${html(row.member?.name || "Dana Kelola Perusahaan")}</span></td>
      <td>${row.member?.rank ? rankLabelHtml(row.member.rank) : `<span class="muted">Perusahaan</span>`}<br><span class="muted">${html(row.member ? stockistName(row.member.stockist) : "-")}</span></td>
      <td>${html(row.category)}<br><span class="muted">${html(row.source)}</span></td>
      <td>${row.pvAmount ? pv(row.pvAmount) : "-"}</td>
      <td class="money">${money(row.amount)}</td>
      <td><span class="pill">${html(row.status)}</span></td>
      <td>${html(row.note)}</td>
    </tr>
  `).join("") || emptyRow(emptyMessage);
}

function poolGapRowsHtml(rows) {
  return rows.map((row) => `
    <tr>
      <td><b>${html(row.label)}</b><br><span class="muted">${Math.round(row.rate * 1000) / 10}% dari ${row.label === "Bonus Bimbingan" ? "Bonus Pasangan" : "TNPV perusahaan"}</span></td>
      <td><span class="pill">${row.active ? "Aktif" : "Nonaktif"}</span></td>
      <td class="money">${money(row.basis || 0)}</td>
      <td class="money">${money(row.target)}</td>
      <td class="money">${money(row.paid)}</td>
      <td class="money">${money(row.gap)}</td>
      <td>${html(row.note)}</td>
    </tr>
  `).join("") || emptyRow("Belum ada selisih pool bonus.");
}

function serverForfeituresView() {
  ensureServerCompanyFunds();
  const fundScope = companyFundScopeValue();
  const data = serverCompanyFunds.data || {};
  const poolRows = (data.poolRows || []).map((row) => `
    <tr>
      <td><b>${html(row.label)}</b><br><span class="muted">${Math.round(Number(row.rate || 0) * 1000) / 10}% dari dasar hitung</span></td>
      <td class="money">${money(row.basis || 0)}</td>
      <td class="money">${money(row.target || 0)}</td>
      <td class="money">${money(row.paid || 0)}</td>
      <td class="money">${money(row.managed || 0)}</td>
    </tr>
  `).join("");
  return `
    ${controlPanel("Filter Dana Kelola", [
      monthControl("Bulan & Tahun"),
      companyFundScopeControl("Tampilan"),
      fundScope === "payment" ? paymentPeriodControl("Periode Bayar") : ""
    ], `Sumber data: ${selectedMonthLabel()}`)}
    <div style="height:16px"></div>
    ${serverCompanyFunds.loading ? `<article class="card"><p class="muted">Memuat dana kelola...</p></article>` : serverCompanyFunds.error ? `<article class="card"><p class="muted">${html(serverCompanyFunds.error)}</p></article>` : `
      <div class="grid kpi-grid">
        ${kpiCard("Total untuk Perusahaan", money(data.totalCompanyRupiah || 0), "45% dasar + dana kelola")}
        ${kpiCard("Bagian Perusahaan 45%", money(data.companyBaseRupiah || 0), `Dari Omset Perusahaan ${money(data.companyTnpvRupiah || 0)}`)}
        ${kpiCard("Dana Kelola", money(data.managedRupiah || 0), "Selisih pool bonus tidak terpakai")}
        ${kpiCard("Bonus Member", money(data.memberBonusRupiah || 0), "Hasil tutup buku")}
        ${kpiCard("Fee Stokis", money(data.stockistFeeRupiah || 0), "Kewajiban fee stokis")}
        ${kpiCard("Total Dibayar/Owed", money(data.totalPaidOrOwedRupiah || 0), `Rasio ${Math.round(Number(data.payoutRatio || 0) * 1000) / 10}%`)}
        ${kpiCard("Belum Dibayar", money(data.unpaidMemberBonusRupiah || 0), "Masih kewajiban member")}
        ${kpiCard("Bonus Nonaktif", (data.inactiveBonusTypes || []).length || 0, "Jenis bonus massal nonaktif")}
      </div>
      <article class="card" style="margin-top:16px">
        <div class="toolbar">
          <div>
            <h3>Total Dana Kelola</h3>
            <p class="muted">Ringkasan ini dihitung setelah proses tutup buku selesai.</p>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Sumber</th><th>Nominal</th><th>Keterangan</th></tr></thead>
            <tbody>
              <tr><td><b>Bagian Perusahaan 45%</b></td><td class="money">${money(data.companyBaseRupiah || 0)}</td><td>Dasar perusahaan dari omset perusahaan bulan ini.</td></tr>
              <tr><td><b>Dana Kelola Pool</b></td><td class="money">${money(data.managedRupiah || 0)}</td><td>Selisih desain pool bonus dikurangi bonus yang dibayar.</td></tr>
              <tr><td><b>Total Semua untuk Perusahaan</b></td><td class="money">${money(data.totalCompanyRupiah || 0)}</td><td>Bagian perusahaan 45% + dana kelola.</td></tr>
            </tbody>
          </table>
        </div>
      </article>
      <article class="card" style="margin-top:16px">
        <div class="toolbar">
          <div>
            <h3>Selisih Pool Bonus</h3>
            <p class="muted">Jika pool tidak terpakai penuh, selisihnya menjadi dana kelola perusahaan.</p>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Pool Bonus</th><th>Dasar Hitung</th><th>Acuan Pool</th><th>Dibayarkan</th><th>Dana Kelola</th></tr></thead>
            <tbody>${poolRows || emptyRow("Belum ada data pool bonus.")}</tbody>
          </table>
        </div>
      </article>
    `}
  `;
}

function forfeituresView() {
  if (state.activeRole !== "admin") {
    return `<article class="card"><p class="muted">Halaman dana kelola hanya tersedia untuk akses pusat.</p></article>`;
  }
  if (serverCompanyFundsEnabled()) return serverForfeituresView();
  const fundScope = companyFundScopeValue();
  const audit = fundScope === "year"
    ? aggregateForfeitureAuditData(selectedYearValue())
    : fundScope === "payment"
      ? forfeitureAuditData(state.selectedMonth, state.paymentPeriod)
      : fullMonthForfeitureAuditData(state.selectedMonth);
  const auditPeriodLabel = fundScope === "year" ? `Tahun ${selectedYearValue()}` : selectedMonthLabel();
  const manageableRows = [...audit.expiredCarryRows, ...audit.tupoRows, ...(audit.personalBonusRows || []), ...audit.pairHeldRows]
    .sort((left, right) => {
      const priority = {
        "Bonus Personal Nonaktif": 1,
        "Bonus Tertahan TUPO": 2,
        "Carry Over Hangus": 3,
        "Pasangan Tertahan Payout": 4
      };
      return (priority[left.category] || 99) - (priority[right.category] || 99) || right.amount - left.amount;
    });
  const priorityManaged = Number(audit.totals.personalBonus || 0);
  const otherManaged = Math.max(0, Number(audit.totals.safeManaged || 0) - priorityManaged);
  const companyManaged = priorityManaged + otherManaged;
  const companyGrandTotal = Number(audit.poolSummary.companyBase || 0) + companyManaged;
  const companyManagedNote = audit.totals.activeCarryReserve > 0
    ? `Termasuk personal ${money(priorityManaged)}; carry aktif ${money(audit.totals.activeCarryReserve)} dipisahkan`
    : `Termasuk personal nonaktif ${money(priorityManaged)}`;
  const detailSummary = [
    ["Prioritas Personal", audit.totals.personalBonus || 0, "Bonus personal yang statusnya nonaktif"],
    ["Dana Kelola Lain", otherManaged, "Selain bonus personal nonaktif"],
    ["Carry Hangus", audit.totals.expiredCarry || 0, "Carry over yang sudah melewati batas"],
    ["TUPO Tidak Terpenuhi", audit.totals.tupo || 0, "Bonus tidak diterima karena TUPO"],
    ["Pasangan Tertahan", audit.totals.pairHeld || 0, "Selisih sistem payout pasangan"]
  ];
  return `
    ${controlPanel("Filter Dana Kelola", [
      fundScope === "year" ? yearControl("Tahun") : monthControl("Bulan & Tahun"),
      companyFundScopeControl("Tampilan"),
      fundScope === "payment" ? paymentPeriodControl("Periode Bayar") : ""
    ], `Audit: ${auditPeriodLabel}`)}
    <div style="height:16px"></div>
    <div class="grid kpi-grid">
      ${kpiCard("Uang Masuk Perusahaan", money(companyManaged), companyManagedNote)}
      ${kpiCard("Prioritas Kelola", money(priorityManaged), "Bonus personal nonaktif")}
      ${kpiCard("Bagian Perusahaan", money(audit.poolSummary.companyBase), `45% dasar dari Omset/TNPV ${money(audit.poolSummary.companyTnpv)}`)}
      ${kpiCard("Total Perusahaan", money(companyGrandTotal), "45% dasar + total dana kelola")}
      ${kpiCard("Periode", auditPeriodLabel, fundScope === "year" ? `${audit.months?.length || 0} bulan berdata` : companyFundScopeLabel())}
    </div>
    <details class="card detail-card" style="margin-top:16px">
      <summary>Ringkasan Sumber Dana</summary>
      <div class="grid kpi-grid">
        ${detailSummary.map(([label, amount, note]) => kpiCard(label, money(amount), note)).join("")}
        ${kpiCard("Cadangan Carry Aktif", money(audit.totals.activeCarryReserve), "Belum aman dikelola")}
        ${kpiCard("Belum Dibayar", money(audit.totals.unpaid), "Masih kewajiban ke member")}
      </div>
    </details>
    <article class="card" style="margin-top:16px">
      <div class="toolbar">
        <div>
          <h3>Total Dana Kelola</h3>
          <p class="muted">Total ini dipisah dari Bagian Perusahaan dasar agar asal uangnya mudah dibaca.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Sumber</th><th>Nominal</th><th>Keterangan</th></tr></thead>
          <tbody>
            <tr><td><b>Bagian Perusahaan 45%</b></td><td class="money">${money(audit.poolSummary.companyBase)}</td><td>Dasar perusahaan dari Omset/TNPV ${money(audit.poolSummary.companyTnpv)}.</td></tr>
            <tr><td><b>Bonus Personal Nonaktif</b></td><td class="money">${money(priorityManaged)}</td><td>Bonus per member yang dinonaktifkan personal dan masuk dana kelola.</td></tr>
            <tr><td><b>Dana Kelola Lain</b></td><td class="money">${money(otherManaged)}</td><td>Selisih payout aman setelah dikurangi carry aktif dan nonaktif massal.</td></tr>
            <tr><td><b>Total Dana Kelola</b></td><td class="money">${money(companyManaged)}</td><td>Total dana yang dapat dikelola perusahaan pada tampilan ini.</td></tr>
            <tr><td><b>Total Semua untuk Perusahaan</b></td><td class="money">${money(companyGrandTotal)}</td><td>Bagian perusahaan 45% + total dana kelola.</td></tr>
          </tbody>
        </table>
      </div>
    </article>
    <article class="card" style="margin-top:16px">
      <div class="toolbar">
        <div>
          <h3>Prioritas Dana Kelola</h3>
          <p class="muted">Fokus utama: berapa uang yang aman masuk perusahaan dan sumber prioritasnya.</p>
        </div>
        <div class="toolbar-actions">
          ${searchBox("forfeitures", "ID, nama, kategori, stokis")}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Member</th><th>Peringkat / Stokis</th><th>Kategori</th><th>PV Dasar</th><th>Nominal</th><th>Status</th><th>Keterangan</th></tr></thead>
          <tbody>${forfeitureRowsHtml(manageableRows, `Belum ada dana prioritas pada ${auditPeriodLabel}.`)}</tbody>
        </table>
      </div>
      <p class="notice">Bonus personal nonaktif masuk prioritas dana kelola perusahaan. Nonaktif massal dari Kontrol Bonus tidak dimasukkan sebagai dana kelola. Carry aktif belum dihitung sebagai uang aman karena masih bisa cair jika member memenuhi pasangan sebelum batas hangus.</p>
    </article>
    <details class="card detail-card" style="margin-top:16px">
      <summary>Detail Selisih Pool Bonus</summary>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Pool Bonus</th><th>Status</th><th>Dasar Hitung</th><th>Acuan Pool</th><th>Dibayarkan</th><th>Selisih</th><th>Keterangan</th></tr></thead>
          <tbody>${poolGapRowsHtml(audit.poolSummary.targetRows)}</tbody>
        </table>
      </div>
      <p class="notice">Detail ini hanya audit sumber selisih. Angka utama uang masuk perusahaan tetap memakai Uang Masuk Perusahaan di atas agar tidak hitung ganda.</p>
    </details>
    <details class="card detail-card" style="margin-top:16px">
      <summary>Kewajiban Belum Dibayar</summary>
      <div class="toolbar">
        <div>
          <p class="muted">Ini bukan dana kelola perusahaan. Pastikan stokis membayar atau mencentang status bayar setelah komisi dicairkan.</p>
        </div>
        <span class="pill">${fundScope === "year" ? `Audit ${html(auditPeriodLabel)} - P1 & P2` : fundScope === "month" ? `Audit ${html(auditPeriodLabel)} - 1 bulan full` : `Sumber: ${html(commissionSourceLabel(state.selectedMonth, state.paymentPeriod))}`}</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Member</th><th>Peringkat / Stokis</th><th>Kategori</th><th>PV Dasar</th><th>Nominal</th><th>Status</th><th>Keterangan</th></tr></thead>
          <tbody>${forfeitureRowsHtml(audit.unpaidPaymentRows, `Tidak ada kewajiban pembayaran yang belum diceklis pada ${auditPeriodLabel}.`)}</tbody>
        </table>
      </div>
    </details>
    <details class="card detail-card" style="margin-top:16px">
      <summary>Monitoring Carry Over Aktif</summary>
      <div class="toolbar">
        <div>
          <p class="muted">Nilai ini cadangan risiko. Jangan masukkan sebagai dana aman dikelola karena masih bisa dicairkan member.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Member</th><th>Peringkat / Stokis</th><th>Kategori</th><th>PV Dasar</th><th>Estimasi Cadangan</th><th>Status</th><th>Keterangan</th></tr></thead>
          <tbody>${forfeitureRowsHtml(audit.activeCarryRows, `Tidak ada carry over aktif yang perlu dimonitor pada ${auditPeriodLabel}.`)}</tbody>
        </table>
      </div>
    </details>
  `;
}

function announcementsView() {
  if (serverMasterEnabled("announcements")) return serverAnnouncementsView();
  const announcements = state.announcements.filter((item) => matchesSearch(item, searchTerms.announcements));
  const announcementIds = announcements.map((item) => item.id);
  return `
    <article class="card">
      <div class="toolbar">
        <h3>Pengumuman & Kebijakan Perusahaan</h3>
        <div class="toolbar-actions">
          ${searchBox("announcements", "Reward, kebijakan, tanggal")}
          ${canBulkSelect() ? `<label class="select-all-inline"><input type="checkbox" data-select-all="announcement" data-select-ids="${attr(announcementIds.join(","))}" ${announcementIds.length && announcementIds.every((id) => selectedSet("announcement").has(id)) ? "checked" : ""}> Pilih semua</label>` : ""}
          ${bulkActionButton("announcement")}
          ${canEditAll() ? `<button class="primary" data-add="announcement">Tambah Pengumuman</button>` : ""}
        </div>
      </div>
      <div class="announcement-list">
        ${announcements.map((item) => `
          <div class="announcement-item ${canBulkSelect() ? "selectable" : ""}">
            ${selectionPanelCell("announcement", item.id)}
            <div>
              <span class="pill">${html(item.status)}</span>
              <h3>${html(item.title)}</h3>
              <p>${html(item.body)}</p>
              <small>${formatDate(item.date)} - ${html(item.audience)}</small>
            </div>
            <div class="actions">${actionButtons("announcement", item.id)}</div>
          </div>
        `).join("") || `<p class="muted">Belum ada pengumuman yang cocok.</p>`}
      </div>
    </article>
    ${deletedItemsPanelHtml("announcement", "Pengumuman")}
  `;
}

function serverAnnouncementsView() {
  ensureServerMasterPage("announcements");
  const page = serverMasterPages.announcements;
  return `
    <article class="card">
      <div class="toolbar">
        <div>
          <h3>Pengumuman & Kebijakan Perusahaan</h3>
          <p class="muted">Pengumuman resmi perusahaan.</p>
        </div>
        <div class="toolbar-actions">
          ${searchBox("announcements", "Reward, kebijakan, tanggal")}
          ${state.activeRole === "admin" ? `<button class="primary" data-add="serverAnnouncement">Tambah Pengumuman</button>` : ""}
        </div>
      </div>
      <div class="announcement-list">
        ${page.loading
          ? `<p class="muted">Memuat pengumuman...</p>`
          : page.error
            ? `<p class="muted">${html(page.error)}</p>`
            : page.rows.map((item) => `
              <div class="announcement-item">
                <div>
                  <span class="pill">${html(item.status)}</span>
                  <h3>${html(item.title)}</h3>
                  <p>${html(item.body)}</p>
                  <small>${formatDate(item.date)} - ${html(item.audience)}</small>
                </div>
                <div class="actions">${serverMasterActionButtons("announcements", item.id)}</div>
              </div>
            `).join("") || `<p class="muted">Belum ada pengumuman yang cocok.</p>`}
      </div>
      <div class="toolbar" style="margin-top:12px">
        <span class="pill">${page.rows.length} data tampil</span>
        ${serverPagerHtml("announcements")}
      </div>
    </article>
  `;
}

function payoutsView() {
  if (serverStockistPayoutsEnabled()) return serverPayoutsView();
  const stockist = currentUser();
  const scope = stockistPaymentScopeValue();
  const report = stockistPayoutContext(stockist, scope, state.selectedMonth, state.paymentPeriod);
  const rows = report.rows
    .filter(({ member }) => matchesSearch(member, searchTerms.payouts, [member.id, member.rank]))
    .map((row) => {
      const { member, bonus } = row;
      const payable = bonus.rupiah > 0;
      const status = scope === "year"
        ? payable ? `${row.bonusMonths || 0} bulan ada bonus` : "Tidak ada bonus"
        : scope === "month"
          ? payable ? "Estimasi full bulan" : "Tidak ada bonus"
          : member.paidDone ? "Sudah dibayar" : payable ? "Belum dibayar" : "Tidak ada bonus";
      return `
        <tr>
          ${scope === "payment" ? `<td class="select-col"><input type="checkbox" data-payment-toggle="${attr(member.id)}" data-payment-month="${attr(state.selectedMonth)}" data-payment-period="${attr(paymentPeriodValue())}" ${member.paidDone ? "checked" : ""} ${payable ? "" : "disabled"} title="${payable ? "Tandai sudah dibayar" : "Tidak ada bonus dibayar"}"></td>` : ""}
          <td>${memberNameCell(member)}</td>
          <td>${rankLabelHtml(member.rank)}<br><span class="muted">TUPO ${html(tupoStatusText(member))}</span></td>
          ${scope === "payment" ? "" : `<td>${pv(member.ppv || 0)}</td>`}
          <td class="money">${money(bonus.rupiah)}</td>
          <td>${payable ? `<span class="pill">${html(status)}</span>` : `<span class="muted">${html(status)}</span>`}</td>
        </tr>
      `;
    }).join("");
  return `
    ${controlPanel("Filter Komisi Stokis", [
      scope === "year" ? yearControl("Tahun") : monthControl("Bulan & Tahun"),
      stockistPaymentScopeControl("Tampilan"),
      scope === "payment" ? paymentPeriodControl("Periode Bayar") : ""
    ], `Sumber data: ${report.sourceLabel}`)}
    <div style="height:16px"></div>
    <div class="grid kpi-grid">
      ${kpiCard("Stokis", stockist.name, stockistLocationText(stockist))}
      ${kpiCard("Member Dilayani", report.members.length, scope === "payment" ? "Pembayaran bonus member" : report.periodNote)}
      ${kpiCard("Omset Penjualan", money(report.sales), `Dari ${report.sourceLabel}`)}
      ${kpiCard("Fee Stokis 5%", money(report.fee), "Dihitung dari omset")}
      ${kpiCard("Status Dana Pusat", report.transferStatus, "Bonus member + fee stokis")}
      ${kpiCard("Bonus Member", money(report.memberBonus), "Termasuk sharing profit jika qualified")}
      ${scope === "payment" ? kpiCard("Sudah Dibayar", money(report.paidMemberBonus), `${report.paidRows.length}/${report.payableRows.length} member`) : kpiCard("Status Bonus", report.paymentStatsLabel, report.periodNote)}
      ${scope === "payment" ? kpiCard("Belum Dibayar", money(report.unpaidMemberBonus), "Perlu dicairkan ke member") : kpiCard("Sumber Data", report.sourceLabel, report.periodNote)}
      ${kpiCard("Total Kewajiban", money(report.totalTransfer), "Bonus member + fee stokis")}
    </div>
    <article class="card" style="margin-top:16px">
      <div class="toolbar">
        <h3>${scope === "payment" ? "Checklist Pembayaran Member" : "Ringkasan Bonus Member"}</h3>
        <div class="toolbar-actions">
          ${searchBox("payouts", "ID, nama, peringkat")}
          ${scope === "payment" ? `<button class="primary" data-payment-bulk="mark" data-payment-month="${attr(state.selectedMonth)}" data-payment-period="${attr(paymentPeriodValue())}" data-payment-ids="${attr(report.payableRows.map((row) => row.member.id).join(","))}" ${report.payableRows.length ? "" : "disabled"}>Ceklis semua dibayar</button>` : ""}
          ${scope === "payment" ? `<button class="ghost" data-payment-bulk="clear" data-payment-month="${attr(state.selectedMonth)}" data-payment-period="${attr(paymentPeriodValue())}" data-payment-ids="${attr(report.paidRows.map((row) => row.member.id).join(","))}" ${report.paidRows.length ? "" : "disabled"}>Kosongkan ceklis</button>` : ""}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>${scope === "payment" ? "<th></th>" : ""}<th>Member</th><th>Peringkat / TUPO</th>${scope === "payment" ? "" : "<th>PPV</th>"}<th>${scope === "payment" ? "Bonus Dibayar" : "Bonus"}</th><th>Status</th></tr></thead>
          <tbody>${rows || emptyRow(scope === "payment" ? "Tidak ada pembayaran member yang cocok." : "Tidak ada ringkasan bonus member yang cocok.")}</tbody>
        </table>
      </div>
      <p class="notice">${scope === "payment" ? "Checklist ini adalah status pembayaran lewat stokis untuk bulan dan periode pembayaran yang dipilih. Sumber bonus mengikuti aturan: omset Periode 1 dibayar pada Periode 2 bulan yang sama, sedangkan omset Periode 2 dibayar pada Periode 1 bulan berikutnya." : `Tampilan ini adalah ringkasan ${stockistPaymentScopeLabel(scope).toLowerCase()} untuk membantu stokis melihat total omset, fee, dan bonus member tanpa mengubah checklist pembayaran periode.`}</p>
      <p class="notice">Status dana pusat menunjukkan dana dari perusahaan/cabang ke stokis sudah diterima atau belum. Dana itu mencakup bonus member yang harus disalurkan stokis dan fee stokis.</p>
    </article>
  `;
}

function serverPayoutsView() {
  const scope = stockistPaymentScopeValue();
  ensureServerBonusPage();
  ensureServerStockistPayouts(scope);
  const source = serverPaymentSource(scope, state.selectedMonth, state.paymentPeriod);
  const stockist = currentUser();
  const report = serverStockistPayouts.rows.find((row) => row.id === state.activeId) || {
    id: state.activeId,
    name: stockist?.name || state.activeId,
    area: stockist?.area || "",
    district: stockist?.district || "",
    sales: 0,
    fee: 0,
    memberBonus: 0,
    payableCount: 0,
    paidCount: 0,
    transferPaid: false
  };
  const rows = serverBonusPage.rows
    .filter((row) => row.bonus.rupiah > 0 || matchesSearch(row.member, searchTerms.payouts, [row.member.id, row.member.rank]))
    .map((row) => {
      const payable = row.bonus.rupiah > 0;
      const status = row.member.paidDone ? "Sudah dibayar" : payable ? "Belum dibayar" : "Tidak ada bonus";
      return `
        <tr>
          ${scope === "payment" ? `<td class="select-col"><input type="checkbox" data-server-payment-toggle="${attr(row.member.id)}" data-ledger-period="${attr(source.ledgerPeriod)}" data-payment-month="${attr(source.paymentMonth)}" data-payment-period="${attr(source.paymentPeriod)}" ${row.member.paidDone ? "checked" : ""} ${payable ? "" : "disabled"} title="${payable ? "Tandai sudah dibayar" : "Tidak ada bonus dibayar"}"></td>` : ""}
          <td><b>${html(row.member.id)}</b><br><span class="muted">${html(row.member.name)}</span></td>
          <td>${rankLabelHtml(row.member.rank)}</td>
          ${scope === "payment" ? "" : `<td>${pv(row.member.ppv || 0)}</td>`}
          <td class="money">${money(row.bonus.rupiah)}</td>
          <td>${payable ? `<span class="pill">${html(status)}</span>` : `<span class="muted">${html(status)}</span>`}</td>
        </tr>
      `;
    }).join("");
  const paidMemberBonus = serverBonusPage.rows
    .filter((row) => row.member.paidDone)
    .reduce((sum, row) => sum + row.bonus.rupiah, 0);
  const unpaidMemberBonus = Math.max(0, report.memberBonus - paidMemberBonus);
  return `
    ${controlPanel("Filter Komisi Stokis", [
      monthControl("Bulan & Tahun"),
      stockistPaymentScopeControl("Tampilan"),
      scope === "payment" ? paymentPeriodControl("Periode Bayar") : ""
    ], `Sumber data: ${source.label}`)}
    <div style="height:16px"></div>
    <div class="grid kpi-grid">
      ${kpiCard("Stokis", report.name, stockistLocationText(report))}
      ${kpiCard("Member Dilayani", report.memberCount || serverBonusPage.rows.length, scope === "payment" ? "Pembayaran bonus member" : "Ringkasan bonus")}
      ${kpiCard("Omset Penjualan", money(report.sales), `Dari ${source.label}`)}
      ${kpiCard("Fee Stokis", money(report.fee), "Dihitung dari omset")}
      ${kpiCard("Status Dana Pusat", report.transferPaid ? "Dana sudah diterima" : "Dana belum diterima", "Bonus member + fee stokis")}
      ${kpiCard("Bonus Member", money(report.memberBonus), "Hasil tutup buku")}
      ${scope === "payment" ? kpiCard("Sudah Dibayar", money(paidMemberBonus), `${report.paidCount || 0}/${report.payableCount || 0} member`) : kpiCard("Status Bonus", `${report.payableCount || 0} member ada bonus`, "Ringkasan")}
      ${scope === "payment" ? kpiCard("Belum Dibayar", money(unpaidMemberBonus), "Perlu dicairkan ke member") : kpiCard("Sumber Data", source.label, "Data resmi")}
      ${kpiCard("Total Kewajiban", money(report.memberBonus + report.fee), "Bonus member + fee stokis")}
    </div>
    <article class="card" style="margin-top:16px">
      <div class="toolbar">
        <h3>${scope === "payment" ? "Checklist Pembayaran Member" : "Ringkasan Bonus Member"}</h3>
        <div class="toolbar-actions">
          ${searchBox("payouts", "ID, nama, peringkat")}
          ${scope === "payment" ? `<button class="primary" data-server-payment-bulk="mark" data-ledger-period="${attr(source.ledgerPeriod)}" data-payment-month="${attr(source.paymentMonth)}" data-payment-period="${attr(source.paymentPeriod)}" data-payment-ids="${attr(serverBonusPage.rows.filter((row) => row.bonus.rupiah > 0).map((row) => row.member.id).join(","))}" ${serverBonusPage.rows.some((row) => row.bonus.rupiah > 0) ? "" : "disabled"}>Ceklis semua dibayar</button>` : ""}
          ${scope === "payment" ? `<button class="ghost" data-server-payment-bulk="clear" data-ledger-period="${attr(source.ledgerPeriod)}" data-payment-month="${attr(source.paymentMonth)}" data-payment-period="${attr(source.paymentPeriod)}" data-payment-ids="${attr(serverBonusPage.rows.filter((row) => row.member.paidDone).map((row) => row.member.id).join(","))}" ${serverBonusPage.rows.some((row) => row.member.paidDone) ? "" : "disabled"}>Kosongkan ceklis</button>` : ""}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>${scope === "payment" ? "<th></th>" : ""}<th>Member</th><th>Peringkat</th>${scope === "payment" ? "" : "<th>PPV</th>"}<th>${scope === "payment" ? "Bonus Dibayar" : "Bonus"}</th><th>Status</th></tr></thead>
          <tbody>${serverBonusPage.loading ? emptyRow("Memuat bonus member...") : serverBonusPage.error ? emptyRow(serverBonusPage.error) : rows || emptyRow("Tidak ada pembayaran member yang cocok.")}</tbody>
        </table>
      </div>
      <p class="notice">Data ini muncul setelah Admin Pusat menjalankan tutup buku.</p>
    </article>
  `;
}

function adminsView() {
  if (serverMasterEnabled("admins")) return serverAdminsView();
  const admins = state.admins.filter((item) => matchesSearch(item, searchTerms.admins));
  const adminIds = admins.map((item) => item.id);
  const rows = admins.map((item) => `
    <tr>
      ${selectionCell("admin", item.id)}
      <td><b>${html(item.id)}</b><br><span class="muted">${html(item.name)}</span></td>
      <td>${html(item.role)}</td>
      <td>${html(item.area)}</td>
      <td>${html(item.password)}</td>
      <td class="actions">${actionButtons("admin", item.id)}</td>
    </tr>
  `).join("");
  return `
    <article class="card">
      <div class="toolbar">
        <h3>Pengelola Pusat & Cabang</h3>
        <div class="toolbar-actions">
          ${searchBox("admins", "ID, nama, role, area")}
          ${bulkActionButton("admin")}
          <button class="primary" data-add="admin">Tambah Admin</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>${selectionHeader("admin", adminIds)}<th>ID Admin</th><th>Role</th><th>Lokasi Akses</th><th>Sandi</th><th>Aksi</th></tr></thead>
          <tbody>${rows || emptyRow("Tidak ada admin yang cocok.")}</tbody>
        </table>
      </div>
    </article>
    ${deletedItemsPanelHtml("admin", "Pengelola")}
  `;
}

function serverAdminsView() {
  ensureServerMasterPage("admins");
  const page = serverMasterPages.admins;
  const rows = page.rows.map((item) => `
    <tr>
      <td><b>${html(item.id)}</b><br><span class="muted">${html(item.name)}</span></td>
      <td>${html(item.role)}</td>
      <td>${html(item.area)}</td>
      <td>${html(item.email || "-")}<br><span class="muted">${html(item.phone || "-")}</span></td>
      <td class="actions">${serverMasterActionButtons("admins", item.id)}</td>
    </tr>
  `).join("");
  return `
    <article class="card">
      <div class="toolbar">
        <div>
          <h3>Pengelola Pusat & Cabang</h3>
          <p class="muted">Sandi tidak ditampilkan. Ubah sandi lewat tombol edit jika diperlukan.</p>
        </div>
        <div class="toolbar-actions">
          ${searchBox("admins", "ID, nama, role, area")}
          <button class="primary" data-add="serverAdmin">Tambah Admin</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID Admin</th><th>Role</th><th>Lokasi Akses</th><th>Kontak</th><th>Aksi</th></tr></thead>
          <tbody>${page.loading ? emptyRow("Memuat data admin...") : page.error ? emptyRow(page.error) : rows || emptyRow("Tidak ada admin yang cocok.")}</tbody>
        </table>
      </div>
      <div class="toolbar" style="margin-top:12px">
        <span class="pill">${page.rows.length} data tampil</span>
        ${serverPagerHtml("admins")}
      </div>
    </article>
  `;
}

function treeSourceMembers() {
  return state.activeRole === "branch" ? filteredMembers() : state.members;
}

function treeRootMember() {
  if (state.activeRole === "member") return currentMember();
  return treeSourceMembers()[0] || state.members[0];
}

function serverTreeKey(kind) {
  return [
    kind,
    state.selectedMonth || currentMonthValue(),
    state.activeRole,
    state.activeId,
    searchTerms[kind] || ""
  ].join("|");
}

function serverTreeChildCount(member, kind) {
  if (kind === "placement") return Number(member.placementChildCount || 0);
  return Number(member.sponsorChildCount || 0);
}

function ensureServerTree(kind) {
  if (!serverTreeEnabled()) return;
  const key = serverTreeKey(kind);
  if (serverTreeState[kind].key !== key) {
    serverTreeState[kind] = createServerTreeState(key);
  }
  const tree = serverTreeState[kind];
  if (tree.rootId || tree.rootLoading) return;
  tree.rootLoading = true;
  loadServerTreeRoot(kind, key);
}

async function loadServerTreeRoot(kind, key) {
  const tree = serverTreeState[kind];
  try {
    const period = state.selectedMonth || currentMonthValue();
    const term = String(searchTerms[kind] || "").trim();
    let root = null;
    if (state.activeRole === "member" && !term) {
      const result = await apiRequest(`/api/members/${encodeURIComponent(state.activeId)}?period=${encodeURIComponent(period)}`);
      root = apiMemberToLocal(result);
    } else {
      const params = new URLSearchParams({ limit: "1", period });
      if (term) params.set("q", term);
      const result = await apiRequest(`/api/members?${params.toString()}`);
      root = (result.data || [])[0] ? apiMemberToLocal((result.data || [])[0]) : null;
    }
    if (serverTreeState[kind].key !== key) return;
    if (!root) {
      tree.error = term ? "Member yang dicari tidak ditemukan di akses ini." : "Belum ada member untuk ditampilkan.";
      return;
    }
    tree.rootId = root.id;
    tree.nodes.set(root.id, root);
    if (kind === "network") {
      expandedNetworkIds.add(root.id);
      collapsedNetworkIds.delete(root.id);
    } else {
      expandedPlacementIds.add(root.id);
      collapsedPlacementIds.delete(root.id);
    }
    await loadServerTreeChildren(kind, root.id, false, key);
  } catch (error) {
    if (serverTreeState[kind].key !== key) return;
    tree.error = error.message || "Struktur belum bisa dimuat.";
    if (error.status === 401) {
      isAuthenticated = false;
      saveApiSession(null);
      sessionStorage.removeItem(SESSION_KEY);
    }
  } finally {
    if (serverTreeState[kind].key === key) {
      tree.rootLoading = false;
      if (activeView === kind) render();
    }
  }
}

async function loadServerTreeChildren(kind, memberId, shouldRender = true, key = serverTreeKey(kind)) {
  const tree = serverTreeState[kind];
  if (!memberId || tree.loadingChildren.has(memberId)) return;
  if (tree.children.has(memberId)) {
    if (kind === "placement") await prefetchServerPlacementSlotChildren(memberId, key);
    if (shouldRender && serverTreeState[kind].key === key && activeView === kind) render();
    return;
  }
  tree.loadingChildren.add(memberId);
  try {
    const period = state.selectedMonth || currentMonthValue();
    const endpoint = kind === "placement" ? "placement-children" : "sponsor-children";
    const params = new URLSearchParams({ period, limit: kind === "placement" ? "10" : "500" });
    const result = await apiRequest(`/api/members/${encodeURIComponent(memberId)}/${endpoint}?${params.toString()}`);
    if (serverTreeState[kind].key !== key) return;
    const children = (result.data || []).map(apiMemberToLocal);
    tree.children.set(memberId, children.map((member) => member.id));
    children.forEach((member) => tree.nodes.set(member.id, member));
    if (kind === "placement") await prefetchServerPlacementSlotChildren(memberId, key);
  } catch (error) {
    if (serverTreeState[kind].key !== key) return;
    tree.error = error.message || "Cabang struktur belum bisa dimuat.";
  } finally {
    tree.loadingChildren.delete(memberId);
    if (shouldRender && serverTreeState[kind].key === key && activeView === kind) render();
  }
}

async function prefetchServerPlacementSlotChildren(memberId, key = serverTreeKey("placement")) {
  const tree = serverTreeState.placement;
  const childIds = tree.children.get(memberId) || [];
  if (!childIds.length) return;
  const period = state.selectedMonth || currentMonthValue();
  await Promise.all(childIds.map(async (childId) => {
    const child = tree.nodes.get(childId);
    if (!child || serverTreeChildCount(child, "placement") <= 0 || tree.children.has(childId) || tree.loadingChildren.has(childId)) return;
    tree.loadingChildren.add(childId);
    try {
      const params = new URLSearchParams({ period, limit: "10" });
      const result = await apiRequest(`/api/members/${encodeURIComponent(childId)}/placement-children?${params.toString()}`);
      if (serverTreeState.placement.key !== key) return;
      const children = (result.data || []).map(apiMemberToLocal);
      tree.children.set(childId, children.map((member) => member.id));
      children.forEach((member) => tree.nodes.set(member.id, member));
    } catch (error) {
      if (serverTreeState.placement.key === key) tree.error = error.message || "Cabang placement belum bisa dimuat.";
    } finally {
      tree.loadingChildren.delete(childId);
    }
  }));
}

function serverTreeBranchIsCollapsed(kind, memberId, depth, hasChildren) {
  if (!hasChildren) return false;
  const expanded = kind === "placement" ? expandedPlacementIds : expandedNetworkIds;
  const collapsed = kind === "placement" ? collapsedPlacementIds : collapsedNetworkIds;
  if (expanded.has(memberId)) return false;
  if (collapsed.has(memberId)) return true;
  return depth >= 1;
}

function serverTreeDescendantIds(kind, rootId) {
  const tree = serverTreeState[kind];
  const result = [];
  const queue = [...(tree.children.get(rootId) || [])];
  const seen = new Set(queue);
  while (queue.length) {
    const id = queue.shift();
    result.push(id);
    (tree.children.get(id) || []).forEach((childId) => {
      if (!seen.has(childId)) {
        seen.add(childId);
        queue.push(childId);
      }
    });
  }
  return result;
}

function resetServerTreeDescendantToggles(kind, rootId) {
  serverTreeDescendantIds(kind, rootId).forEach((id) => {
    if (kind === "placement") {
      expandedPlacementIds.delete(id);
      collapsedPlacementIds.delete(id);
    } else {
      expandedNetworkIds.delete(id);
      collapsedNetworkIds.delete(id);
    }
  });
}

function serverTreeToggleHtml(kind, member, hasChildren, isCollapsed, isLoading) {
  if (!hasChildren) return `<span class="network-toggle ${kind === "placement" ? "placement-toggle" : ""} empty" aria-hidden="true"></span>`;
  const label = isCollapsed ? (kind === "placement" ? "Buka kaki placement" : "Buka downline") : (kind === "placement" ? "Tutup kaki placement" : "Tutup downline");
  const attrName = kind === "placement" ? "data-server-placement-toggle" : "data-server-network-toggle";
  const collapsedAttr = kind === "placement" ? "data-server-placement-collapsed" : "data-server-network-collapsed";
  return `<button class="network-toggle ${kind === "placement" ? "placement-toggle" : ""}" type="button" ${attrName}="${attr(member.id)}" ${collapsedAttr}="${isCollapsed ? "true" : "false"}" title="${label}" aria-label="${label}">${isLoading ? "..." : isCollapsed ? "+" : "-"}</button>`;
}

function placementSideOf(member, index = 0) {
  const text = String(member?.placementSide || member?.side || "").trim().toUpperCase();
  if (["L", "LEFT", "KIRI"].includes(text)) return "L";
  if (["R", "RIGHT", "KANAN"].includes(text)) return "R";
  return index === 0 ? "L" : index === 1 ? "R" : "";
}

function placementMemberTotalPv(member) {
  if (!member) return 0;
  return Number(member.ppv || 0) + Number(member.leftPv || 0) + Number(member.rightPv || 0);
}

function serverPlacementNodeMetrics(member, depth = 0, children = [], loadedChildren = true, knownChildCount = children.length) {
  const leftChildren = loadedChildren ? children.filter((child, index) => placementSideOf(child, index) === "L") : [];
  const rightChildren = loadedChildren ? children.filter((child, index) => placementSideOf(child, index) === "R") : [];
  const left = leftChildren[0] || null;
  const right = rightChildren[0] || null;
  const leftPv = leftChildren.reduce((sum, child) => sum + placementMemberTotalPv(child), 0);
  const rightPv = rightChildren.reduce((sum, child) => sum + placementMemberTotalPv(child), 0);
  const visibleCount = loadedChildren ? children.length : knownChildCount;
  const recommendedSide = !loadedChildren && knownChildCount > 0
    ? "Memuat"
    : leftPv <= rightPv && !left ? "Kiri" : rightPv < leftPv && !right ? "Kanan" : !left ? "Kiri" : !right ? "Kanan" : "Penuh";
  return `
    <div class="team-avatar placement-avatar" aria-hidden="true">${html(memberInitials(memberDisplayName(member)))}</div>
    <div class="team-main placement-main">
      <div class="team-title">
        <b>${html(memberDisplayName(member))}</b>
        <span>${html(member.id)}</span>
        <strong>Placement ID:${html(member.id)}</strong>
      </div>
      <div class="team-badges">
        ${rankLabelHtml(member.rank)}
        <span class="generation-badge">${depth === 0 ? "Root" : `Level ${depth}`}</span>
        <span class="activity-badge active">${visibleCount}/2 kaki</span>
        <span class="child-badge">Prioritas ${html(recommendedSide)}</span>
      </div>
      <div class="placement-leg-summary">
        ${!loadedChildren && knownChildCount > 0
          ? placementLoadingLegSummary()
          : `${placementMiniLeg("Kiri", left, leftPv, recommendedSide === "Kiri")}${placementMiniLeg("Kanan", right, rightPv, recommendedSide === "Kanan")}`}
      </div>
    </div>
  `;
}

function serverTreeNodeHtml(kind, memberId, depth = 0, visited = new Set()) {
  const tree = serverTreeState[kind];
  const member = tree.nodes.get(memberId);
  if (!member || visited.has(memberId)) return "";
  const nextVisited = new Set(visited);
  nextVisited.add(memberId);
  const loadedChildren = tree.children.has(memberId);
  const childIds = tree.children.get(memberId) || [];
  const children = childIds.map((id) => tree.nodes.get(id)).filter(Boolean);
  const hasChildren = loadedChildren ? children.length > 0 : serverTreeChildCount(member, kind) > 0;
  const isCollapsed = serverTreeBranchIsCollapsed(kind, memberId, depth, hasChildren);
  const isLoading = tree.loadingChildren.has(memberId);
  const childHtml = hasChildren && !isCollapsed && loadedChildren
    ? children.map((child) => serverTreeNodeHtml(kind, child.id, depth + 1, nextVisited)).filter(Boolean).join("")
    : "";
  const loadingHtml = hasChildren && !isCollapsed && isLoading
    ? `<div class="team-children"><p class="muted" style="padding-left:24px">Memuat cabang...</p></div>`
    : "";
  const slotHtml = kind === "placement" && loadedChildren && !isCollapsed ? placementEmptySlotsHtml(member, children, depth) : "";
  const branchClass = kind === "placement" ? "team-branch placement-branch" : "team-branch";
  const rowClass = kind === "placement" ? "team-row placement-row" : "team-row";
  const metrics = kind === "placement"
    ? serverPlacementNodeMetrics(member, depth, children, loadedChildren, serverTreeChildCount(member, kind))
    : networkNodeMetrics(member, depth, loadedChildren ? children.length : serverTreeChildCount(member, kind));
  return `
    <div class="${branchClass} ${depth === 0 ? "root" : ""} ${hasChildren ? "has-children" : ""} ${isCollapsed ? "collapsed" : ""}" style="--depth:${depth}">
      <div class="${rowClass}">
        ${serverTreeToggleHtml(kind, member, hasChildren, isCollapsed, isLoading)}
        ${metrics}
      </div>
      ${hasChildren && !isCollapsed && childHtml ? `<div class="team-children ${kind === "placement" ? "placement-children" : ""}">${childHtml}</div>` : ""}
      ${loadingHtml}
      ${slotHtml}
    </div>
  `;
}

function serverNetworkView() {
  ensureServerTree("network");
  const tree = serverTreeState.network;
  const treeHtml = tree.rootId ? serverTreeNodeHtml("network", tree.rootId, 0) : "";
  return `
    ${controlPanel("Filter Jaringan", [monthControl("Bulan & Tahun")], "Generasi 1 dimuat otomatis, cabang berikutnya dibuka manual dengan tombol plus.")}
    <div style="height:16px"></div>
    <article class="card network">
      <div class="toolbar">
        <h3>Struktur Jaringan</h3>
        <div class="toolbar-actions">
          ${searchBox("network", "Cari ID atau nama")}
          <span class="pill">${tree.nodes.size} data termuat</span>
          <span class="pill">Awal tampil sampai Level 1</span>
        </div>
      </div>
      <div class="team-tree-wrap">
        <div class="team-tree">
          ${tree.rootLoading ? `<p class="muted">Memuat struktur jaringan...</p>` : tree.error ? `<p class="muted">${html(tree.error)}</p>` : treeHtml}
        </div>
      </div>
    </article>
  `;
}

function serverPlacementView() {
  ensureServerTree("placement");
  const tree = serverTreeState.placement;
  const treeHtml = tree.rootId ? serverTreeNodeHtml("placement", tree.rootId, 0) : "";
  return `
    ${controlPanel("Filter Placement", [monthControl("Bulan & Tahun")], "Generasi 1 dimuat otomatis, kaki berikutnya dibuka manual dengan tombol plus.")}
    <div style="height:16px"></div>
    <article class="card compact-toolbar">
      <div class="toolbar">
        <h3>Struktur Placement</h3>
        <div class="toolbar-actions">
          ${searchBox("placement", "Cari ID atau nama")}
          <span class="pill">${tree.nodes.size} data termuat</span>
          <span class="pill">Awal tampil sampai Level 1</span>
        </div>
      </div>
      <p class="muted">Struktur ini memakai Placement ID. Data dibuat ringan karena cabang berikutnya dimuat saat dibuka.</p>
    </article>
    <article class="card placement-structure" style="margin-top:16px">
      <div class="team-tree-wrap placement-tree-wrap">
        <div class="team-tree placement-tree">
          ${tree.rootLoading ? `<p class="muted">Memuat struktur placement...</p>` : tree.error ? `<p class="muted">${html(tree.error)}</p>` : treeHtml}
        </div>
      </div>
    </article>
  `;
}

function networkView() {
  if (serverTreeEnabled()) return serverNetworkView();
  const root = treeRootMember();
  if (!root) return `<article class="card"><p class="muted">Belum ada member untuk ditampilkan.</p></article>`;
  const term = searchTerms.network || "";
  const treeHtml = term ? networkSearchTreeHtml(root, term) : networkTreeHtml(root, "", 0, 7);
  const visibleMembers = buildLevels(root.id, 8).flat().length;
  return `
    ${controlPanel("Filter Jaringan", [monthControl("Bulan & Tahun")], "Cari ID akan menampilkan member tersebut dan tim di bawahnya.")}
    <div style="height:16px"></div>
    <article class="card network">
      <div class="toolbar">
        <h3>Struktur Jaringan</h3>
        <div class="toolbar-actions">
          ${searchBox("network", "Nama, ID, peringkat")}
          <span class="pill">${visibleMembers} member jaringan</span>
          <span class="pill">Awal tampil sampai Level 1</span>
        </div>
      </div>
      <div class="team-tree-wrap">
        <div class="team-tree">
          ${treeHtml || `<p class="muted">Tidak ada jaringan yang cocok.</p>`}
        </div>
      </div>
    </article>
  `;
}

function networkSearchTreeHtml(root, term) {
  const visibleMembers = buildLevels(root.id, 8).flat();
  const query = normalizeSearch(term);
  const exactIdMatches = visibleMembers.filter((member) => normalizeSearch(member.id) === query);
  const matched = (exactIdMatches.length ? exactIdMatches : visibleMembers.filter((member) => matchesSearch(member, term, [stockistName(member.stockist)])))
    .sort((a, b) => String(a.joinedAt || "").localeCompare(String(b.joinedAt || "")) || String(a.id).localeCompare(String(b.id)));
  const roots = matched.filter((member) => !matched.some((candidate) => candidate.id !== member.id && sponsorIsAncestor(candidate.id, member.id)));
  return roots.map((member) => networkTreeHtml(member, "", 0, 7, new Set(), term)).join("");
}

function sponsorIsAncestor(ancestorId, memberId) {
  const byId = Object.fromEntries(treeSourceMembers().map((member) => [member.id, member]));
  const seen = new Set([memberId]);
  let cursor = byId[memberId]?.sponsor;
  while (cursor && !isRootSponsor(cursor)) {
    if (cursor === ancestorId) return true;
    if (seen.has(cursor)) return false;
    seen.add(cursor);
    cursor = byId[cursor]?.sponsor;
  }
  return false;
}

function networkTreeHtml(member, term = "", depth = 0, maxDepth = 5, visited = new Set(), highlightTerm = term) {
  if (!member || visited.has(member.id) || depth > maxDepth) return "";
  const nextVisited = new Set(visited);
  nextVisited.add(member.id);
  const children = treeSourceMembers()
    .filter((child) => child.sponsor === member.id && !nextVisited.has(child.id))
    .sort((a, b) => String(a.joinedAt || "").localeCompare(String(b.joinedAt || "")) || String(a.id).localeCompare(String(b.id)));
  const childHtml = depth < maxDepth
    ? children.map((child) => networkTreeHtml(child, term, depth + 1, maxDepth, nextVisited, highlightTerm)).filter(Boolean).join("")
    : "";
  const selfMatch = matchesSearch(member, term, [stockistName(member.stockist)]);
  if (term && !selfMatch && !childHtml) return "";
  const highlighted = highlightTerm && matchesSearch(member, highlightTerm, [stockistName(member.stockist)]);
  const hasChildren = children.length > 0;
  const isCollapsed = networkBranchIsCollapsed(member.id, depth, hasChildren, term);
  return `
    <div class="team-branch ${depth === 0 ? "root" : ""} ${hasChildren ? "has-children" : ""} ${isCollapsed ? "collapsed" : ""}" style="--depth:${depth}">
      <div class="team-row ${term && !selfMatch ? "search-muted" : ""} ${highlighted ? "search-match" : ""}">
        ${networkToggleHtml(member, hasChildren, isCollapsed)}
        ${networkNodeMetrics(monthlyMember(member), depth, children.length)}
      </div>
      ${hasChildren && !isCollapsed && childHtml ? `<div class="team-children">${childHtml}</div>` : ""}
    </div>
  `;
}

function networkToggleHtml(member, hasChildren, isCollapsed) {
  if (!hasChildren) return `<span class="network-toggle empty" aria-hidden="true"></span>`;
  const label = isCollapsed ? "Buka downline" : "Tutup downline";
  return `<button class="network-toggle" type="button" data-network-toggle="${attr(member.id)}" data-network-collapsed="${isCollapsed ? "true" : "false"}" title="${label}" aria-label="${label}">${isCollapsed ? "+" : "-"}</button>`;
}

function networkBranchIsCollapsed(memberId, depth, hasChildren, term = "") {
  if (!hasChildren || term) return false;
  if (expandedNetworkIds.has(memberId)) return false;
  if (collapsedNetworkIds.has(memberId)) return true;
  return depth >= 1;
}

function rankBadgeClass(rankName) {
  if (rankName === "Executive Director") return "executive";
  if (rankName === "Director") return "director";
  if (rankName === "Leader Majestic") return "majestic";
  if (rankName === "Leader Ambassador") return "ambassador";
  if (rankName === "Crown Star") return "crown";
  if (rankName === "Royal Star") return "royal";
  if (rankName === "VIP") return "vip";
  return "member";
}

function memberInitials(name) {
  return String(name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?";
}

function networkNodeMetrics(member, depth = 0, childCount = 0) {
  const badgeClass = rankBadgeClass(member.rank);
  const hasPersonalPv = Number(member.ppv || 0) > 0;
  return `
    <div class="team-avatar" aria-hidden="true">${html(memberInitials(memberDisplayName(member)))}</div>
    <div class="team-main">
      <div class="team-title">
        <b>${html(memberDisplayName(member))}</b>
        <span>${html(member.id)}</span>
        <strong>APPV:${pv(member.cpv || 0).replace(" PV", "")}</strong>
      </div>
      <div class="team-badges">
        <span class="rank-badge ${badgeClass}">${html(member.rank)}</span>
        <span class="generation-badge">${depth === 0 ? "Root" : `Level ${depth}`}</span>
        <span class="activity-badge ${hasPersonalPv ? "active" : ""}" title="Status aktivitas">${hasPersonalPv ? "Aktif PV" : "Belum PV"}</span>
        ${childCount ? `<span class="child-badge">${childCount} downline</span>` : ""}
      </div>
      <div class="team-metrics">
        <span>PPV <b>${pv(member.ppv)}</b></span>
        <span>APPV <b>${pv(member.cpv)}</b></span>
        <span>GPV <b>${pv(member.gpv)}</b></span>
        <span>ATNPV <b>${pv(member.atnpv)}</b></span>
        <span>TNPV <b>${pv(member.tnpv)}</b></span>
      </div>
    </div>
  `;
}

function placementView() {
  if (serverTreeEnabled()) return serverPlacementView();
  const root = treeRootMember();
  if (!root) return `<article class="card"><p class="muted">Belum ada member untuk ditampilkan.</p></article>`;
  const term = searchTerms.placement || "";
  const treeHtml = term ? placementSearchTreeHtml(root, term) : placementTreeHtml(root, "", 0, 7);
  const placementCount = placementMembers().length;
  return `
    ${controlPanel("Filter Placement", [monthControl("Bulan & Tahun")], "Struktur placement dibuka bertahap per cabang dengan tombol plus.")}
    <div style="height:16px"></div>
    <article class="card compact-toolbar">
      <div class="toolbar">
        <h3>Struktur Placement</h3>
        <div class="toolbar-actions">
          ${searchBox("placement", "Cari nama, ID, atau peringkat")}
          <span class="pill">${placementCount} member placement</span>
          <span class="pill">Awal tampil sampai Level 1</span>
        </div>
      </div>
      <p class="muted">Struktur ini memakai Placement ID. Kaki kiri dan kanan dibatasi maksimal 2 kaki langsung, lalu cabang berikutnya dibuka bertahap dengan tombol plus.</p>
    </article>
    <article class="card placement-structure" style="margin-top:16px">
      <div class="team-tree-wrap placement-tree-wrap">
        <div class="team-tree placement-tree">
          ${treeHtml || `<p class="muted">Tidak ada placement yang cocok.</p>`}
        </div>
      </div>
    </article>
  `;
}

function placementSearchTreeHtml(root, term) {
  const visibleMembers = placementSubtreeMembers(root.id, 8);
  const query = normalizeSearch(term);
  const exactIdMatches = visibleMembers.filter((member) => normalizeSearch(member.id) === query);
  const matched = (exactIdMatches.length ? exactIdMatches : visibleMembers.filter((member) => matchesSearch(member, term, [stockistName(member.stockist)])))
    .sort((a, b) => String(a.joinedAt || "").localeCompare(String(b.joinedAt || "")) || String(a.id).localeCompare(String(b.id)));
  const roots = matched.filter((member) => !matched.some((candidate) => candidate.id !== member.id && placementIsAncestor(candidate.id, member.id)));
  return roots.map((member) => placementTreeHtml(member, "", 0, 7, new Set(), term)).join("");
}

function placementSubtreeMembers(rootId, maxDepth = 8) {
  const sourceMembers = treeSourceMembers();
  const root = sourceMembers.find((member) => member.id === rootId);
  const visible = root ? [root] : [];
  let cursor = root ? [root.id] : [];
  for (let depth = 0; depth < maxDepth; depth += 1) {
    const children = sourceMembers.filter((member) => cursor.includes(member.parent));
    visible.push(...children);
    cursor = children.map((member) => member.id);
    if (!cursor.length) break;
  }
  return visible;
}

function placementIsAncestor(ancestorId, memberId) {
  const byId = Object.fromEntries(treeSourceMembers().map((member) => [member.id, member]));
  const seen = new Set([memberId]);
  let cursor = byId[memberId]?.parent;
  while (cursor) {
    if (cursor === ancestorId) return true;
    if (seen.has(cursor)) return false;
    seen.add(cursor);
    cursor = byId[cursor]?.parent;
  }
  return false;
}

function placementTreeHtml(member, term = "", depth = 0, maxDepth = 5, visited = new Set(), highlightTerm = term) {
  if (!member || visited.has(member.id) || depth > maxDepth) return "";
  const nextVisited = new Set(visited);
  nextVisited.add(member.id);
  const children = treeSourceMembers()
    .filter((child) => child.parent === member.id && !nextVisited.has(child.id))
    .sort((a, b) => String(a.joinedAt || "").localeCompare(String(b.joinedAt || "")) || String(a.id).localeCompare(String(b.id)))
    .slice(0, 2);
  const childHtml = depth < maxDepth
    ? children.map((child) => placementTreeHtml(child, term, depth + 1, maxDepth, nextVisited, highlightTerm)).filter(Boolean).join("")
    : "";
  const selfMatch = matchesSearch(member, term, [stockistName(member.stockist)]);
  if (term && !selfMatch && !childHtml) return "";
  const highlighted = highlightTerm && matchesSearch(member, highlightTerm, [stockistName(member.stockist)]);
  const hasChildren = children.length > 0;
  const isCollapsed = placementBranchIsCollapsed(member.id, depth, hasChildren, term);
  const slotHtml = !term && !isCollapsed ? placementEmptySlotsHtml(member, children, depth) : "";
  return `
    <div class="team-branch placement-branch ${depth === 0 ? "root" : ""} ${hasChildren ? "has-children" : ""} ${isCollapsed ? "collapsed" : ""}" style="--depth:${depth}">
      <div class="team-row placement-row ${term && !selfMatch ? "search-muted" : ""} ${highlighted ? "search-match" : ""}">
        ${placementToggleHtml(member, hasChildren, isCollapsed)}
        ${placementNodeMetrics(monthlyMember(member), depth, children)}
      </div>
      ${hasChildren && !isCollapsed && childHtml ? `<div class="team-children placement-children">${childHtml}</div>` : ""}
      ${slotHtml}
    </div>
  `;
}

function placementBranchIsCollapsed(memberId, depth, hasChildren, term = "") {
  if (!hasChildren || term) return false;
  if (expandedPlacementIds.has(memberId)) return false;
  if (collapsedPlacementIds.has(memberId)) return true;
  return depth >= 1;
}

function placementToggleHtml(member, hasChildren, isCollapsed) {
  if (!hasChildren) return `<span class="network-toggle placement-toggle empty" aria-hidden="true"></span>`;
  const label = isCollapsed ? "Buka kaki placement" : "Tutup kaki placement";
  return `<button class="network-toggle placement-toggle" type="button" data-placement-toggle="${attr(member.id)}" data-placement-collapsed="${isCollapsed ? "true" : "false"}" title="${label}" aria-label="${label}">${isCollapsed ? "+" : "-"}</button>`;
}

function placementNodeMetrics(member, depth = 0, children = []) {
  const legs = placementLegs(member);
  const recommendedSide = member.leftPv <= member.rightPv ? "Kiri" : "Kanan";
  const carryIn = Number(member.carryInLeft || 0) + Number(member.carryInRight || 0);
  return `
    <div class="team-avatar placement-avatar" aria-hidden="true">${html(memberInitials(memberDisplayName(member)))}</div>
    <div class="team-main placement-main">
      <div class="team-title">
        <b>${html(memberDisplayName(member))}</b>
        <span>${html(member.id)}</span>
        <strong>Placement ID:${html(member.id)}</strong>
      </div>
      <div class="team-badges">
        ${rankLabelHtml(member.rank)}
        <span class="generation-badge">${depth === 0 ? "Root" : `Level ${depth}`}</span>
        <span class="activity-badge active">${children.length}/2 kaki</span>
        ${carryIn > 0 ? `<span class="generation-badge">Carry masuk ${pv(carryIn)}</span>` : ""}
        ${Number(member.carry || 0) > 0 ? `<span class="child-badge">Sisa ${html(member.carrySide || "Carry")} ${pv(member.carry)}</span>` : ""}
        <span class="child-badge">Prioritas ${recommendedSide}</span>
      </div>
      <div class="placement-leg-summary">
        ${placementMiniLeg("Kiri", legs.left, member.leftPv, recommendedSide === "Kiri")}
        ${placementMiniLeg("Kanan", legs.right, member.rightPv, recommendedSide === "Kanan")}
      </div>
    </div>
  `;
}

function placementMiniLeg(label, child, pvValue, recommended) {
  return `
    <div class="placement-mini-leg ${child ? "" : "empty"} ${recommended ? "recommended" : ""}">
      <span>${html(label)}</span>
      <b>${child ? html(memberDisplayName(child)) : "Slot Kosong"}</b>
      <small>${child ? `${html(child.id)} - ${pv(pvValue)}` : "Siap dipakai"}</small>
    </div>
  `;
}

function placementLoadingLegSummary() {
  return `
    <div class="placement-mini-leg pending">
      <span>Kiri</span>
      <b>Memuat data member</b>
      <small>Data slot sedang diambil</small>
    </div>
    <div class="placement-mini-leg pending">
      <span>Kanan</span>
      <b>Memuat data member</b>
      <small>Data slot sedang diambil</small>
    </div>
  `;
}

function placementEmptySlotsHtml(member, children, depth) {
  if (children.length >= 2) return "";
  const labels = ["Kiri", "Kanan"].slice(children.length);
  return labels.map((label, index) => `
    <div class="team-branch placement-branch placement-empty-branch" style="--depth:${depth + 1}">
      <div class="team-row placement-row placement-empty-row">
        <span class="network-toggle placement-toggle empty" aria-hidden="true"></span>
        <div class="team-avatar placement-avatar empty" aria-hidden="true">+</div>
        <div class="team-main placement-main empty">
          <div class="team-title">
            <b>Slot ${html(label)} Kosong</b>
            <span>Placement ID: ${html(member.id)}</span>
            <strong>Urutan slot ${children.length + index + 1}/2</strong>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function descendantIds(rootId, relationField) {
  const result = [];
  const queue = [rootId];
  const visited = new Set([rootId]);
  while (queue.length) {
    const parentId = queue.shift();
    state.members
      .filter((member) => member[relationField] === parentId && !visited.has(member.id))
      .forEach((child) => {
        visited.add(child.id);
        result.push(child.id);
        queue.push(child.id);
      });
  }
  return result;
}

function resetNetworkDescendantToggles(rootId) {
  descendantIds(rootId, "sponsor").forEach((id) => {
    expandedNetworkIds.delete(id);
    collapsedNetworkIds.delete(id);
  });
}

function resetPlacementDescendantToggles(rootId) {
  descendantIds(rootId, "parent").forEach((id) => {
    expandedPlacementIds.delete(id);
    collapsedPlacementIds.delete(id);
  });
}

function placementSponsorCard(member, side, score) {
  const legs = placementLegs(member);
  const sponsorCount = state.members.filter((item) => item.sponsor === member.id).length;
  const placementCount = state.members.filter((item) => item.parent === member.id).length;
  return `
    <article class="card placement-board">
      <div class="placement-root">
        <div>
          <span class="pill">${html(member.rank)}</span>
          <h3>${html(memberDisplayName(member))}</h3>
          <small>${html(member.id)} - TNPV ${pv(member.tnpv)}</small>
        </div>
        <div class="placement-signal">
          <b>${html(side)}</b>
          <span>disarankan</span>
        </div>
      </div>
      <div class="placement-legs">
        ${placementLegCard("Kiri", legs.left, member.leftPv, side === "Kiri")}
        ${placementLegCard("Kanan", legs.right, member.rightPv, side === "Kanan")}
      </div>
      <div class="placement-footer">
        <span>Placement ID: <b>${html(member.id)}</b></span>
        <span>Sponsor langsung: <b>${sponsorCount}</b></span>
        <span>Placement langsung: <b>${placementCount}/2</b></span>
        <span>Skor peluang: <b>${score}</b></span>
      </div>
    </article>
  `;
}

function placementLegs(member) {
  const children = state.members.filter((item) => item.parent === member.id);
  return {
    left: children.find((child, index) => placementSideOf(child, index) === "L") || null,
    right: children.find((child, index) => placementSideOf(child, index) === "R") || null
  };
}

function placementLegCard(label, child, pvValue, recommended) {
  if (!child) {
    return `
      <div class="placement-leg empty ${recommended ? "recommended" : ""}">
        <span>${html(label)}</span>
        <b>Slot Kosong</b>
        <small>Isi Placement ID dengan ID di atas. Jika penuh, sistem turun ke slot kosong di bawahnya.</small>
      </div>
    `;
  }
  return `
    <div class="placement-leg ${recommended ? "recommended" : ""}">
      <span>${html(label)}</span>
      <b>${html(memberDisplayName(child))}</b>
      <small>${html(child.id)} - ${html(child.rank)}</small>
      <small>PV kaki: ${pv(pvValue)}</small>
    </div>
  `;
}

function revenueView() {
  if (serverRevenueEnabled()) return serverRevenueView();
  const members = monthlyMembersList();
  const isMemberView = state.activeRole === "member";
  const isStockistView = state.activeRole === "stockist";
  const visibleMembers = isMemberView
    ? members
    : members.filter((member) => matchesSearch(member, searchTerms.revenue, [stockistName(member.stockist), stockistArea(member.stockist)]));
  const periodPpvFor = (member) => periodPpvForRevenuePeriod(member.id, state.selectedMonth, state.revenuePeriod);
  const totalPpv = members.reduce((sum, member) => sum + periodPpvFor(member), 0);
  const monthlyTotalPpv = members.reduce((sum, member) => sum + member.ppv, 0);
  const revenueLabel = isMemberView
    ? "PPV Saya"
    : isStockistView
      ? "Omset Stokis"
      : state.activeRole === "branch"
        ? "Omset Cabang"
        : "Omset Perusahaan";
  const revenueNote = isMemberView
    ? "Belanja pribadi bulan ini"
    : isStockistView
      ? "Total PPV member stokis bulan ini"
      : state.activeRole === "branch"
        ? "Total PPV wilayah cabang"
        : "Total PPV periode ini";
  const rows = visibleMembers.map((member) => `
    <tr>
      <td>${memberNameCell(member, state.activeRole === "admin")}</td>
      <td>${formatDate(member.joinedAt)}</td>
      <td>${rankLabelHtml(member.rank)}</td>
      <td>${pv(periodPpvFor(member))}<br><span class="muted">Bulanan ${pv(member.ppv)}</span></td>
      <td>${money(periodPpvFor(member) * 1000)}</td>
      ${isStockistView ? `<td><button class="primary" data-omzet="${attr(member.id)}">Input PV</button></td>` : ""}
    </tr>
  `).join("");
  return `
    ${controlPanel("Filter Omset", [
      monthControl("Bulan & Tahun"),
      revenuePeriodControl("Periode Omset")
    ], `Menampilkan ${revenuePeriodLabel()} untuk ${selectedMonthLabel()}.`)}
    <div style="height:16px"></div>
    <div class="grid kpi-grid">
      ${kpiCard("Bulan", selectedMonthLabel(), "Bulan pengecekan")}
      ${kpiCard(revenueLabel, pv(totalPpv), `${revenueNote} - ${revenuePeriodLabel()}`)}
      ${kpiCard(isMemberView ? "Nilai PPV Saya" : "Nilai Omset", money(totalPpv * 1000), "Dihitung dari total PPV")}
      ${kpiCard("Total Bulanan", pv(monthlyTotalPpv), "Gabungan Periode 1 + Periode 2")}
      ${kpiCard(isMemberView ? "Status Omset" : "Member Beromset", isMemberView ? (totalPpv > 0 ? "Ada PPV" : "Belum PPV") : members.filter((member) => Number(periodPpvFor(member) || 0) > 0).length, isMemberView ? "PPV pribadi periode ini" : "PPV lebih dari 0")}
    </div>
    <article class="card" style="margin-top:16px">
      <div class="toolbar">
        <h3>${isMemberView ? "Omset Saya" : state.activeRole === "stockist" ? "Input Omset Member" : "Rincian Omset Bulanan"}</h3>
        <div class="toolbar-actions">
          ${isMemberView ? "" : searchBox("revenue", "Cari ID, nama, peringkat")}
          <span class="pill">${html(revenuePeriodLabel())}</span>
          ${!isMemberView && searchTerms.revenue ? `<span class="pill">${visibleMembers.length} hasil</span>` : ""}
          ${isStockistView ? `<span class="pill">Input dalam PV</span>` : ""}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Tanggal</th><th>Peringkat</th><th>PPV</th><th>Nilai Omset PPV</th>${isStockistView ? "<th>Aksi</th>" : ""}</tr></thead>
          <tbody>${rows || emptyRow("Belum ada data omset untuk bulan ini.")}</tbody>
        </table>
      </div>
    </article>
  `;
}

function serverRevenueView() {
  ensureServerRevenuePage();
  const isMemberView = state.activeRole === "member";
  const canInputPv = ["admin", "branch", "stockist"].includes(state.activeRole);
  const members = serverRevenuePage.rows;
  const totalPpv = members.reduce((sum, member) => sum + Number(member.ppv || 0), 0);
  const activeCount = members.filter((member) => Number(member.ppv || 0) > 0).length;
  const revenueLabel = isMemberView
    ? "PPV Saya"
    : state.activeRole === "stockist"
      ? "Omset Stokis"
      : state.activeRole === "branch"
        ? "Omset Cabang"
        : "Omset Perusahaan";
  const rows = members.map((member) => `
    <tr>
      <td>${memberNameCell(member, state.activeRole === "admin")}</td>
      <td>${formatDate(member.joinedAt)}</td>
      <td>${rankLabelHtml(member.rank)}</td>
      <td>${pv(member.ppv)}<br><span class="muted">APPV ${pv(member.cpv)}</span></td>
      <td>${money(Number(member.ppv || 0) * 1000)}</td>
      ${canInputPv ? `<td><button class="primary" data-server-omzet="${attr(member.id)}">Input PV</button></td>` : ""}
    </tr>
  `).join("");
  return `
    ${controlPanel("Filter Omset", [
      monthControl("Bulan & Tahun")
    ], isMemberView ? `Menampilkan omset pribadi ${selectedMonthLabel()}.` : `Input PV disimpan untuk ${selectedMonthLabel()}. Nilai yang diinput adalah total PV bulan terpilih.`)}
    <div style="height:16px"></div>
    <div class="grid kpi-grid">
      ${kpiCard("Bulan", selectedMonthLabel(), "Bulan pengecekan")}
      ${kpiCard(revenueLabel, pv(totalPpv), "Total PPV dari data yang tampil")}
      ${kpiCard("Nilai Omset", money(totalPpv * 1000), "1 PV = Rp1.000")}
      ${kpiCard("Member Beromset", activeCount, "PPV lebih dari 0")}
    </div>
    <article class="card" style="margin-top:16px">
      <div class="toolbar">
        <h3>${isMemberView ? "Omset Saya" : state.activeRole === "stockist" ? "Input Omset Member Stokis" : "Rincian Omset"}</h3>
        <div class="toolbar-actions">
          ${isMemberView ? "" : searchBox("revenue", "Cari ID, nama, peringkat")}
          <span class="pill">${members.length} data tampil</span>
          <button class="ghost" data-server-revenue-page="prev" ${serverRevenuePage.previousCursors.length ? "" : "disabled"}>Sebelumnya</button>
          <button class="primary" data-server-revenue-page="next" ${serverRevenuePage.nextCursor ? "" : "disabled"}>Berikutnya</button>
        </div>
      </div>
      ${serverRevenuePage.loading ? `<p class="notice">Memuat omset...</p>` : ""}
      ${serverRevenuePage.error ? `<p class="notice">${html(serverRevenuePage.error)}</p>` : ""}
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Tanggal</th><th>Peringkat</th><th>PPV / APPV</th><th>Nilai Omset</th>${canInputPv ? "<th>Aksi</th>" : ""}</tr></thead>
          <tbody>${rows || emptyRow(serverRevenuePage.loading ? "Memuat data..." : "Belum ada data member.")}</tbody>
        </table>
      </div>
      ${canInputPv ? `<p class="notice">Untuk mengoreksi omset, input ulang angka total PV bulan tersebut. Sistem menyimpan nilai bulan terpilih, bukan menambahkan dobel. Setelah koreksi PV, admin pusat perlu menjalankan tutup buku ulang agar bonus dan dana kelola ikut sinkron.</p>` : ""}
    </article>
  `;
}

function rulesView() {
  const isMemberRules = state.activeRole === "member";
  const isAdminRules = state.activeRole === "admin";
  const isOperationalRules = ["admin", "branch", "stockist"].includes(state.activeRole);
  return `
    <div class="grid two-col">
      <article class="card">
        <h3>Istilah Utama</h3>
        <div class="bonus-grid">
          <div class="bonus-row"><span>PPV</span><b>Belanja pribadi bulan ini</b></div>
          <div class="bonus-row"><span>APPV</span><b>Dihitung otomatis dari akumulasi PPV</b></div>
          <div class="bonus-row"><span>TNPV</span><b>Dihitung otomatis dari PPV pribadi dan tim</b></div>
          <div class="bonus-row"><span>ATNPV</span><b>Dihitung otomatis dari akumulasi TNPV</b></div>
          <div class="bonus-row"><span>GPV</span><b>Dihitung otomatis dari jalur yang memenuhi aturan peringkat</b></div>
          <div class="bonus-row"><span>PV / BV</span><b>1 PV = Rp1.000 omset, 1 BV = Rp1.000 bonus</b></div>
        </div>
      </article>
      <article class="card">
        <h3>Keuntungan Sistem Ascendia</h3>
        <div class="bonus-grid">
          <div class="bonus-row"><span>Peringkat</span><b>Tidak turun</b></div>
          <div class="bonus-row"><span>Bonus Pasangan</span><b>Carry over maksimal 3 bulan</b></div>
          ${isMemberRules ? "" : `<div class="bonus-row"><span>Pembayaran</span><b>Lewat Stokis kerja sama</b></div>`}
          ${isOperationalRules ? `<div class="bonus-row"><span>Stokis</span><b>Fee 5%</b></div>` : ""}
          <div class="bonus-row"><span>Tutup Buku</span><b>Tanggal 11 dan 27</b></div>
          <div class="bonus-row"><span>Jadwal Komisi</span><b>P1 dibayar P2, P2 dibayar P1 bulan berikutnya</b></div>
        </div>
      </article>
    </div>
    <article class="card" style="margin-top:16px">
      <h3>Syarat Peringkat Ascendia</h3>
      <div class="rules-table">
        ${ranks.map((rank) => `
          <div class="rule-item">
            <b>${html(rank.name)}</b>
            <p>${html(rank.rule)}</p>
            <span>Bonus Prestasi ${rank.performance}%${rank.pair ? `, Bonus Pasangan ${rank.pair}%` : ""}</span>
            <span>TUPO Bonus: ${html(tupoRequirementText(rank.name))}</span>
          </div>
        `).join("")}
      </div>
    </article>
    <article class="card" style="margin-top:16px">
      <h3>TUPO Syarat Bonus</h3>
      <div class="rules-table">
        <div class="rule-item"><b>Member dan VIP</b><p>Tidak wajib TUPO untuk menerima bonus sesuai hak bonus peringkatnya.</p></div>
        <div class="rule-item"><b>Royal Star</b><p>Wajib TUPO ${pv(requiredTupoPv("Royal Star"))} pada bulan tersebut agar bonus dibayarkan.</p></div>
        <div class="rule-item"><b>Crown Star</b><p>Wajib TUPO ${pv(requiredTupoPv("Crown Star"))} pada bulan tersebut agar bonus dibayarkan.</p></div>
        <div class="rule-item"><b>Leader Ambassador - Executive Director</b><p>Wajib TUPO ${pv(requiredTupoPv("Leader Ambassador"))} pada bulan tersebut agar bonus dibayarkan.</p></div>
      </div>
      <p class="notice">TUPO bukan syarat naik peringkat. Peringkat tetap mengikuti APPV, ATNPV, dan syarat kaki. TUPO hanya menentukan apakah bonus bulan tersebut dibayarkan atau ditahan. Syarat TUPO dihitung dari total PPV satu bulan penuh, termasuk omset Periode 1 dan Periode 2.</p>
    </article>
    <article class="card" style="margin-top:16px">
      <h3>Penjelasan Sistem Bonus</h3>
      <div class="rules-table">
        <div class="rule-item"><b>Bonus Prestasi 30%</b><p>PPV pribadi mendapat bonus sesuai rate peringkat: Member 10%, VIP 15%, Royal Star 18%, Crown Star 22%, Leader Ambassador 26%, Leader Majestic sampai Executive Director 30%. Bonus jaringan sponsor dihitung dari selisih rate peringkat. Jika bertemu downline dengan rate sama atau lebih tinggi, jalur Bonus Prestasi berhenti di titik itu.</p></div>
        <div class="rule-item"><b>TUPO Bonus</b><p>${isMemberRules ? "TUPO dipakai sebagai syarat menerima bonus, bukan syarat naik peringkat. PPV TUPO memakai total satu bulan penuh, jadi P1 dan P2 digabung untuk menentukan kelayakan bonus bulan tersebut." : "TUPO dipakai sebagai syarat menerima bonus, bukan syarat naik peringkat. Jika TUPO belum terpenuhi, estimasi bonus bulan itu menjadi 0 sampai PPV TUPO cukup atau status TUPO disesuaikan oleh sistem. PPV TUPO memakai total satu bulan penuh, jadi P1 dan P2 digabung untuk menentukan kelayakan bonus bulan tersebut."}</p></div>
        <div class="rule-item"><b>Bonus Pasangan 15%</b><p>Mulai Royal Star 12%, Crown Star 13%, Leader Ambassador 14%, Leader Majestic sampai Executive Director 15%. Bonus dihitung dari kaki terlemah: rate peringkat x PV terpasang/lebih kecil, maksimal Rp250 juta per member per bulan. Karena wajib berpasangan kanan-kiri, 15% dari kaki lemah setara 7,5% dari total dua kaki yang berpasangan.</p></div>
        <div class="rule-item"><b>Carry Over Pasangan</b><p>Omset yang belum terpasangkan disimpan ke bulan berikutnya. Jika 3 bulan tidak menghasilkan bonus pasangan, carry over hangus.</p></div>
        <div class="rule-item"><b>Renewal Member Tahunan</b><p>Member wajib memiliki minimal ${pv(RENEWAL_MIN_PERSONAL_PV)} PPV pribadi dalam 1 tahun membership. Jika tidak terpenuhi, akun menjadi Failure of renewal, tidak bisa login, dan bonus tidak dihitung sampai status renewal diperbarui oleh perusahaan.</p></div>
        <div class="rule-item"><b>Bonus Kepemimpinan 8%</b><p>Pengganti saat peringkat sama dan tidak lagi mendapatkan selisih prestasi. Crown Star G1, Leader Ambassador G1-G2, Leader Majestic G1-G4, Director dan Executive Director G1-G5. Rate: G1 3%, G2 1,5%, G3 1,5%, G4 1%, G5 1% dari GPV downline peringkat sama.</p></div>
        <div class="rule-item"><b>Bonus Bimbingan 12%</b><p>Dihitung dari Bonus Pasangan downline, bukan dari TNPV. Generasi: G1 5%, G2 3%, G3 2%, G4 2%. Royal Star mendapat G1, Crown Star G1-G2, Leader Ambassador G1-G3, Leader Majestic sampai Executive Director G1-G4.</p></div>
        ${isAdminRules ? `<div class="rule-item"><b>Dana Kelola Perusahaan</b><p>Halaman Dana Kelola menampilkan selisih payout 55%, selisih pool bonus yang tidak terpakai, bonus yang tidak diterima karena syarat, dan carry over yang sudah hangus. Carry over yang belum mencapai batas hangus dipisahkan sebagai cadangan risiko karena masih bisa cair jika member berhasil memasangkan volume.</p></div>` : ""}
        ${isAdminRules ? `<div class="rule-item"><b>Sharing Profit Pool 3%</b><p>Perusahaan menyediakan pool sharing profit maksimal 3% dari TNPV Perusahaan. Pool ini dibagi kepada peserta qualified, bukan 3% untuk masing-masing orang. Bobot pembagian: Director 2 bagian dan Executive Director 1 bagian agar payout tidak membengkak. Status aktif/nonaktif diatur dari halaman Kontrol Bonus.</p></div>` : ""}
        ${isAdminRules ? `<div class="rule-item"><b>Acuan Payout 55%</b><p>Rasio 55% adalah batas acuan maksimal payout dari TNPV Perusahaan. Jika payout aktual di bawah 55%, selisihnya menjadi dana yang dikelola perusahaan sehingga bagian perusahaan bisa lebih dari 45%, tergantung kondisi bonus bulan tersebut.</p></div>` : ""}
        ${isOperationalRules ? `<div class="rule-item"><b>Input Omset</b><p>Admin atau Stokis cukup mengisi PPV. Sistem menghitung APPV, TNPV, ATNPV, GPV, kaki kiri, dan kaki kanan berdasarkan struktur tim.</p></div>` : ""}
        <div class="rule-item"><b>Periode Pembayaran Komisi</b><p>Omset Periode 1 pada bulan berjalan dibayarkan pada Periode 2 bulan yang sama. Omset Periode 2 dibayarkan pada Periode 1 bulan berikutnya. Contoh: omset P1 Juli dibayar di P2 Juli, sedangkan omset P2 Juli dibayar di P1 Agustus.</p></div>
        <div class="rule-item"><b>GPV</b><p>Berlaku untuk Crown Star ke atas. GPV dihitung dari PPV pribadi dan grup sponsor yang tidak berada di bawah downline dengan peringkat sama atau lebih tinggi.</p></div>
        ${isOperationalRules ? `<div class="rule-item"><b>Stokis</b><p>Bonus member dibayarkan melalui Stokis. Fee Stokis kerja sama dihitung 5% dari omset penjualan/PPV yang masuk lewat Stokis tersebut.</p></div>` : ""}
      </div>
      ${isMemberRules ? "" : `<p class="notice">Catatan: halaman ini adalah panduan pembelajaran di prototipe. Untuk operasional resmi, rumus final perlu dikunci dalam dokumen kebijakan perusahaan.</p>`}
    </article>
  `;
}

function settingsView() {
  const baseUser = currentUser();
  const user = state.activeRole === "member" ? monthlyMember(baseUser) : baseUser;
  const type = state.activeRole === "member" ? "member" : state.activeRole === "stockist" ? "stockist" : "admin";
  const canEditProfile = !apiConnected() && (state.activeRole === "admin" || state.activeRole === "branch");
  const locationLabel = state.activeRole === "stockist"
    ? stockistLocationText(user)
    : state.activeRole === "member"
      ? stockistName(user.stockist)
      : user.area || "-";
  return `
    <article class="card">
      <div class="toolbar">
        <h3>${state.activeRole === "member" ? "Profil Saya" : "Pengaturan Akun"}</h3>
        ${canEditProfile ? `<button class="primary" data-profile-edit="${attr(`${type}:${user.id}`)}">Ubah Data</button>` : `<span class="pill">${apiConnected() ? "Akun Online" : "Hanya lihat profil"}</span>`}
      </div>
      <div class="profile-grid">
        ${profileField("ID", user.id)}
        ${profileField("Nama", user.name)}
        ${profileField("Email", user.email || "-")}
        ${profileField("Nomor HP", user.phone || "-")}
        ${profileField("Sandi", user.password || "-")}
        ${profileField(state.activeRole === "member" ? "Peringkat" : "Role", user.rank || user.role || "Stokis")}
        ${state.activeRole === "member" ? profileField("TUPO Bonus", tupoStatusText(user)) : ""}
        ${profileField(state.activeRole === "member" ? "Stokis" : state.activeRole === "stockist" ? "Lokasi Stokis" : "Lokasi Akses", locationLabel)}
        ${state.activeRole === "member" ? profileField("Sponsor", user.sponsor) + profileField("Tanggal Bergabung", formatDate(user.joinedAt)) : ""}
      </div>
      ${state.activeRole === "member" ? `<p class="notice">Member hanya dapat melihat data profil. Perubahan data pribadi dilakukan melalui layanan perusahaan.</p>` : ""}
    </article>
    ${state.activeRole === "admin" ? `
      <article class="card" style="margin-top:16px">
        <div class="toolbar">
          <div>
            <h3>Kontrol Halaman</h3>
            <p class="muted">Atur halaman per kelompok atau per akun tertentu.</p>
          </div>
          ${menuVisibilityState.loading ? `<span class="pill">Memuat</span>` : ""}
        </div>
        ${menuVisibilityControlsHtml()}
        ${menuVisibilityState.error ? `<p class="notice">${html(menuVisibilityState.error)}</p>` : ""}
      </article>
      <article class="card" style="margin-top:16px">
        <div class="toolbar">
          <div>
            <h3>Data Tes Custom</h3>
            <p class="muted">Fitur tes untuk menambah member dari target mana saja. Jumlah per titik, PPV, peringkat, stokis, mode titik terbawah/langsung, dan nama prefix bisa diatur saat dijalankan.</p>
          </div>
          <button class="primary" data-seed-custom-test>Tambah Member Test Custom</button>
        </div>
      </article>
    ` : ""}
  `;
}

function menuVisibilityControlsHtml() {
  const roles = ["branch", "stockist", "member"];
  const personalRole = state.menuPersonalRole || "member";
  const personalId = String(state.menuPersonalId || "").trim();
  return `
    <details class="detail-card">
      <summary>Umum Per Akses</summary>
      <div class="grid three-col compact-grid">
        ${roles.map((role) => `
          <div class="mini-panel">
            <b>${html(roleName(role))}</b>
            <div class="bonus-grid compact-list">
              ${(navByRole[role] || []).map(([key, label]) => `
                <label class="bonus-row">
                  <span>${html(label)}</span>
                  <input type="checkbox" data-menu-visibility="${attr(role)}:${attr(key)}" ${menuVisibleFor(role, key) ? "checked" : ""}>
                </label>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </details>
    <details class="detail-card" open>
      <summary>Personal Per Akun</summary>
      <div class="toolbar compact-toolbar">
        <select data-menu-personal-role>
          ${roles.map((role) => `<option value="${attr(role)}" ${role === personalRole ? "selected" : ""}>${html(roleName(role))}</option>`).join("")}
        </select>
        <input data-menu-personal-id value="${attr(personalId)}" placeholder="Masukkan ID akun">
        <button class="ghost" data-menu-personal-load>Tampilkan</button>
      </div>
      ${personalId ? `
        <div class="bonus-grid compact-list">
          ${(navByRole[personalRole] || []).map(([key, label]) => `
            <label class="bonus-row">
              <span>${html(label)}</span>
              <input type="checkbox" data-menu-personal-toggle="${attr(personalRole)}:${attr(personalId)}:${attr(key)}" ${personalMenuVisibleFor(personalRole, personalId, key) ? "checked" : ""}>
            </label>
          `).join("")}
        </div>
      ` : `<p class="notice">Pilih akses dan isi ID akun untuk mengatur halaman khusus akun tersebut.</p>`}
    </details>
  `;
}

function profileField(label, value) {
  return `<div class="profile-field"><span>${html(label)}</span><b>${html(value || "-")}</b></div>`;
}

function adminYearMemberBonusSummary(memberId, year = selectedYearValue()) {
  const months = dataMonthsForYear(year);
  const baseMember = state.members.find((member) => member.id === memberId);
  const totals = {
    performance: 0,
    pair: 0,
    leadership: 0,
    mentoring: 0,
    sharing: 0,
    rupiah: 0,
    ppv: 0,
    tnpv: 0,
    bonusMonths: 0,
    blockedMonths: 0
  };
  let latestMember = baseMember;
  months.forEach((month) => {
    const members = computedMembersForMonth(month, state.members);
    const member = members.find((item) => item.id === memberId);
    if (!member) return;
    latestMember = member;
    const bonus = withCalcMembers(members, () => calcBonus(member));
    totals.performance += bonus.performance;
    totals.pair += bonus.pair;
    totals.leadership += bonus.leadership;
    totals.mentoring += bonus.mentoring;
    totals.sharing += bonus.sharing;
    totals.rupiah += bonus.rupiah;
    totals.ppv += Number(member.ppv || 0);
    totals.tnpv += Number(member.tnpv || 0);
    if (bonus.rupiah > 0) totals.bonusMonths += 1;
    if (bonus.blockedByTupo) totals.blockedMonths += 1;
  });
  return { months, member: latestMember || baseMember, totals };
}

const serverBonusTypeLabels = {
  performance: "Prestasi",
  pair: "Pasangan",
  leadership: "Kepemimpinan",
  mentoring: "Bimbingan",
  sharing_profit: "Sharing Profit",
  sharing: "Sharing Profit"
};

function serverBonusSourceHtml(source) {
  const sourceName = source.sourceMemberName || source.sourceMemberId || "Perusahaan";
  const sourceId = source.sourceMemberId ? ` (${source.sourceMemberId})` : "";
  const generation = source.generation ? `G${source.generation}` : "";
  const note = [generation, source.sourceRank, source.note].filter(Boolean).join(" - ");
  return `
    <div class="source-row">
      <span>${html(sourceName)}${html(sourceId)}<small>${html(note)}</small></span>
      <b>${money(source.rupiah)}</b>
    </div>
  `;
}

function serverBonusSourcesHtml(bonus, type) {
  const sources = (bonus.sources || []).filter((source) => source.type === type || (type === "sharing" && source.type === "sharing_profit"));
  if (!sources.length) return "";
  return `
    <details class="bonus-sources">
      <summary>Sumber ${html(serverBonusTypeLabels[type] || type)} <small>${sources.length} sumber</small></summary>
      <div class="source-list">
        ${sources.map(serverBonusSourceHtml).join("")}
      </div>
    </details>
  `;
}

function serverBonusComponentRows(bonus) {
  const rows = [
    ["performance", "Prestasi", bonus.performance],
    ["pair", "Pasangan", bonus.pair],
    ["leadership", "Kepemimpinan", bonus.leadership],
    ["mentoring", "Bimbingan", bonus.mentoring],
    ["sharing", "Sharing Profit", bonus.sharing]
  ];
  return rows
    .filter(([, , amount]) => Number(amount || 0) > 0)
    .map(([type, label, amount]) => `
      <div class="bonus-row"><span>${html(label)}</span><b class="money">${money(amount)}</b></div>
      ${serverBonusSourcesHtml(bonus, type)}
    `)
    .join("") || `<p class="bonus-empty">Belum ada bonus pada tampilan ini.</p>`;
}

function serverBonusesView() {
  ensureServerBonusPage();
  const scope = serverBonusScope();
  const source = serverPaymentSource(scope, state.selectedMonth, state.paymentPeriod);
  const controls = [
    monthControl("Bulan & Tahun"),
    state.activeRole === "member" ? memberBonusScopeControl("Tampilan") : adminReportScopeControl("Tampilan"),
    scope === "payment" ? paymentPeriodControl("Periode Bayar") : "",
    state.activeRole !== "member" ? searchBox("bonuses", "Nama, ID, peringkat") : ""
  ];
  const rows = serverBonusPage.rows;
  if (state.activeRole === "member") {
    const row = rows[0];
    return `
      ${controlPanel("Filter Bonus Saya", controls, `Sumber data: ${source.label}`)}
      <div style="height:16px"></div>
      <article class="card">
        <div class="toolbar">
          <h3>Rincian Bonus - ${html(source.label)}</h3>
          <span class="pill">Data resmi</span>
        </div>
        ${serverBonusPage.loading ? `<p class="muted">Memuat bonus...</p>` : serverBonusPage.error ? `<p class="muted">${html(serverBonusPage.error)}</p>` : row ? `
          <h3>${html(row.member.name)}</h3>
          ${rankLabelHtml(row.member.rank)}
          <div class="bonus-grid" style="margin-top:12px">
            ${serverBonusComponentRows(row.bonus)}
            ${row.bonus.rupiah > 0 ? `<div class="bonus-row"><span>Total Diterima</span><b class="money">${money(row.bonus.rupiah)}</b></div>` : ""}
          </div>
        ` : `<p class="muted">Belum ada bonus pada periode ini.</p>`}
      </article>
    `;
  }
  const totalBonus = rows.reduce((sum, row) => sum + row.bonus.rupiah, 0);
  const paidRows = rows.filter((row) => row.member.paidDone && row.bonus.rupiah > 0);
  const payableRows = rows.filter((row) => row.bonus.rupiah > 0);
  const cards = rows.map((row) => `
    <article class="card">
      <h3>${html(row.member.name)}</h3>
      ${rankLabelHtml(row.member.rank)}
      <p class="muted">${html(row.member.id)} - ${html(row.stockistName || row.member.stockist || "-")}</p>
      <div class="bonus-grid" style="margin-top:12px">
        ${serverBonusComponentRows(row.bonus)}
        ${row.bonus.rupiah > 0 ? `<div class="bonus-row"><span>Total</span><b class="money">${money(row.bonus.rupiah)}</b></div>` : ""}
      </div>
    </article>
  `).join("");
  return `
    ${controlPanel("Filter Bonus Admin", controls, `Sumber data: ${source.label}`)}
    <div style="height:16px"></div>
    <div class="grid kpi-grid">
      ${kpiCard("Data Tampil", rows.length, "50 data per halaman")}
      ${kpiCard("Total Bonus Tampil", money(totalBonus), "Hasil tutup buku")}
      ${kpiCard("Sudah Dibayar", `${paidRows.length}/${payableRows.length}`, "Status pembayaran periode ini")}
      ${kpiCard("Periode Bonus", monthLabel(source.ledgerPeriod), source.label)}
    </div>
    <article class="card compact-toolbar" style="margin-top:16px">
      <div class="toolbar">
        <h3>Rincian Bonus - ${html(source.label)}</h3>
        <div class="toolbar-actions">
          <button class="ghost" data-server-bonus-page="prev" ${serverBonusPage.previousCursors.length ? "" : "disabled"}>Sebelumnya</button>
          <button class="ghost" data-server-bonus-page="next" ${serverBonusPage.nextCursor ? "" : "disabled"}>Berikutnya</button>
        </div>
      </div>
      ${serverBonusPage.loading ? `<p class="muted">Memuat bonus...</p>` : serverBonusPage.error ? `<p class="muted">${html(serverBonusPage.error)}</p>` : ""}
    </article>
    <div class="grid three-col bonus-card-grid" style="margin-top:16px">
      ${!serverBonusPage.loading && !serverBonusPage.error ? cards || `<article class="card"><p class="muted">Belum ada bonus pada periode ini.</p></article>` : ""}
    </div>
  `;
}

function bonusesView() {
  if (serverBonusEnabled()) return serverBonusesView();
  if (state.activeRole === "member") {
    const report = memberBonusReportContext();
    const member = report.member;
    return `
      ${controlPanel("Filter Bonus Saya", [
        report.scope === "year" ? yearControl("Tahun") : monthControl("Bulan & Tahun"),
        memberBonusScopeControl("Tampilan"),
        report.scope === "payment" ? paymentPeriodControl("Periode Bayar") : ""
      ], `Sumber data: ${report.sourceLabel}`)}
      <div style="height:16px"></div>
      <article class="card compact-toolbar">
        <div class="toolbar">
          <h3>Rincian Bonus - ${html(report.sourceLabel)}</h3>
          <span class="pill">${html(memberBonusScopeLabel())}</span>
        </div>
      </article>
      <div class="grid three-col bonus-card-grid" style="margin-top:16px">
        <article class="card">
          <h3>${html(memberDisplayName(member))}</h3>
          ${rankLabelHtml(member.rank)}
          ${report.scope === "year" ? yearlyBonusBreakdownHtml(report.yearly) : withCalcMembers(report.members, () => bonusBreakdownHtml(member))}
        </article>
      </div>
    `;
  }
  const reportScope = adminReportScopeValue();
  const calcList = reportScope === "payment"
    ? commissionMembersForPayment(state.selectedMonth, state.paymentPeriod, state.members)
    : computedMembersForMonth(state.selectedMonth, state.members);
  const sourceLabel = reportScope === "year"
    ? `1 Tahun ${selectedYearValue()}`
    : reportScope === "month"
      ? `1 Bulan Full ${selectedMonthLabel()}`
      : commissionSourceLabel(state.selectedMonth, state.paymentPeriod);
  const members = calcList
    .filter((member) => filteredMembers().some((visible) => visible.id === member.id))
    .filter((member) => matchesSearch(member, searchTerms.bonuses, [stockistName(member.stockist)]));
  return withCalcMembers(calcList, () => `
    ${controlPanel("Filter Bonus Admin", [
      reportScope === "year" ? yearControl("Tahun") : monthControl("Bulan & Tahun"),
      adminReportScopeControl("Tampilan"),
      reportScope === "payment" ? paymentPeriodControl("Periode Bayar") : "",
      searchBox("bonuses", "Nama, ID, peringkat")
    ], `Sumber data: ${sourceLabel}`)}
    <div style="height:16px"></div>
    <article class="card compact-toolbar">
      <div class="toolbar">
        <h3>Rincian Bonus - ${html(sourceLabel)}</h3>
        <span class="pill">${html(adminReportScopeLabel(reportScope))}</span>
      </div>
    </article>
    <div class="grid three-col bonus-card-grid" style="margin-top:16px">
      ${members.map((member) => `
        <article class="card">
          <h3>${html(memberDisplayName(member, state.activeRole === "admin"))}</h3>
          ${rankLabelHtml(member.rank)}
          ${reportScope === "year" ? yearlyBonusBreakdownHtml(adminYearMemberBonusSummary(member.id, selectedYearValue())) : bonusBreakdownHtml(member)}
        </article>
      `).join("") || `<article class="card"><p class="muted">Tidak ada bonus yang cocok.</p></article>`}
    </div>
  `);
}

function bonusSettingRows() {
  const settings = [
    ["performance", "Bonus Prestasi", "Selisih peringkat sponsor dan PPV pribadi sesuai rate rank."],
    ["pair", "Bonus Pasangan", "Dihitung dari kaki terlemah; menjadi dasar Bonus Bimbingan."],
    ["leadership", "Bonus Kepemimpinan", "Pengganti saat peringkat sama sesuai generasi."],
    ["mentoring", "Bonus Bimbingan", "Dihitung dari Bonus Pasangan downline."],
    ["sharing", "Sharing Profit", "Pool khusus Director dan Executive Director; aktifkan saat program siap jalan."]
  ];
  return settings.map(([key, title, note]) => `
    <tr>
      <td><b>${html(title)}</b><br><span class="muted">${html(note)}</span></td>
      <td><span class="pill">${bonusEnabled(key) ? "Aktif" : "Nonaktif"}</span></td>
      <td class="select-col">
        <input type="checkbox" data-bonus-toggle="${attr(key)}" ${bonusEnabled(key) ? "checked" : ""} title="${bonusEnabled(key) ? "Nonaktifkan bonus" : "Aktifkan bonus"}">
      </td>
    </tr>
  `).join("");
}

function bonusControlView() {
  if (state.activeRole !== "admin") {
    return `<article class="card"><p class="muted">Kontrol bonus hanya tersedia untuk akses pusat.</p></article>`;
  }
  ensureServerBonusSettings();
  const activeCount = Object.keys(defaultState.bonusSettings).filter((key) => bonusEnabled(key)).length;
  const backendActive = apiConnected();
  return `
    ${controlPanel("Periode Tutup Buku", [
      monthControl("Bulan & Tahun")
    ], backendActive ? "Tutup buku akan menyimpan hasil bonus resmi." : "Kontrol ini masih menampilkan estimasi sementara.")}
    <div style="height:16px"></div>
    <div class="grid kpi-grid">
      ${kpiCard("Bonus Aktif", `${activeCount}/5`, "Jenis bonus yang sedang dihitung")}
      ${kpiCard("Sharing Profit", bonusEnabled("sharing") ? "Aktif" : "Nonaktif", "Bisa dijalankan nanti saat siap")}
      ${kpiCard("Bonus Pasangan", bonusEnabled("pair") ? "Aktif" : "Nonaktif", bonusEnabled("pair") ? "Bimbingan bisa mengikuti pasangan" : "Bimbingan ikut nol")}
      ${kpiCard("Tutup Buku", backendActive ? "Siap" : "Lokal", selectedMonthLabel())}
    </div>
    <article class="card" style="margin-top:16px">
      <div class="toolbar">
        <div>
          <h3>Tutup Buku Bonus</h3>
          <p class="muted">Proses ini menghitung dan menyimpan hasil bonus resmi untuk periode yang dipilih.</p>
        </div>
        <div class="toolbar-actions">
          <button class="primary" data-run-server-bonus ${backendActive && !serverBonusRun.loading ? "" : "disabled"}>${serverBonusRun.loading ? "Menghitung..." : "Jalankan Tutup Buku"}</button>
        </div>
      </div>
      ${serverBonusRun.message ? `<p class="notice">${html(serverBonusRun.message)}</p>` : ""}
      ${serverBonusRun.error ? `<p class="notice">${html(serverBonusRun.error)}</p>` : ""}
      ${serverBonusSettingsState.error ? `<p class="notice">${html(serverBonusSettingsState.error)}</p>` : ""}
      <p class="notice">Jika dijalankan ulang untuk bulan yang sama, hasil bonus bulan tersebut dihitung ulang agar tidak dobel.</p>
    </article>
    <article class="card" style="margin-top:16px">
      <div class="toolbar">
        <div>
          <h3>Aktif / Nonaktif Bonus</h3>
          <p class="muted">Perubahan ini langsung mempengaruhi estimasi bonus, dashboard payout, Dana Kelola, dan laporan member.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Jenis Bonus</th><th>Status</th><th>Aktif</th></tr></thead>
          <tbody>${bonusSettingRows()}</tbody>
        </table>
      </div>
      <p class="notice">Jika Bonus Pasangan dinonaktifkan, Bonus Bimbingan otomatis tidak punya dasar hitung karena Bimbingan berasal dari Bonus Pasangan downline. Sharing Profit sengaja bisa dinonaktifkan dulu sampai program resmi dijalankan.</p>
    </article>
  `;
}

function yearlyBonusBreakdownHtml(summary) {
  const totals = summary?.totals || {};
  const monthsText = summary?.months?.length ? summary.months.map(monthLabel).join(", ") : "Belum ada bulan berdata";
  const rows = [
    ["Prestasi", totals.performance || 0],
    ["Pasangan", totals.pair || 0],
    ["Kepemimpinan", totals.leadership || 0],
    ["Bimbingan", totals.mentoring || 0],
    ["Sharing Profit", totals.sharing || 0]
  ]
    .filter(([, amount]) => Number(amount || 0) > 0)
    .map(([label, amount]) => `<div class="bonus-row"><span>${html(label)}</span><b>${bv(amount)}</b></div>`)
    .join("");
  return `
    <div class="bonus-grid" style="margin-top:12px">
      ${rows || `<p class="bonus-empty">Belum ada bonus yang diterima pada tampilan ini.</p>`}
      ${Number(totals.rupiah || 0) > 0 ? `<div class="bonus-row"><span>Total Estimasi 1 Tahun</span><b class="money">${money(totals.rupiah || 0)}</b></div>` : ""}
      ${Number(totals.bonusMonths || 0) > 0 ? `<div class="bonus-row"><span>Bulan ada bonus</span><b>${totals.bonusMonths || 0} bulan</b></div>` : ""}
      ${Number(totals.blockedMonths || 0) > 0 ? `<div class="bonus-row"><span>Bulan tertahan TUPO</span><b>${totals.blockedMonths || 0} bulan</b></div>` : ""}
    </div>
    <p class="notice">Total 1 tahun dihitung dari bulan yang sudah punya data omset: ${html(monthsText)}.</p>
  `;
}

function bonusSummaryRows(bonus, tupoPotential, tupoShortage) {
  const rows = [
    ["Prestasi", bonus.performance],
    ["Pasangan", bonus.pair],
    ["Kepemimpinan", bonus.leadership],
    ["Bimbingan", bonus.mentoring],
    ["Sharing Profit", bonus.sharing]
  ]
    .filter(([, amount]) => Number(amount || 0) > 0)
    .map(([label, amount]) => `<div class="bonus-row"><span>${html(label)}</span><b>${bv(amount)}</b></div>`);
  if (Number(bonus.rupiah || 0) > 0) {
    rows.push(`<div class="bonus-row"><span>Total Estimasi</span><b class="money">${money(bonus.rupiah)}</b></div>`);
  }
  if (Number(tupoPotential?.rupiah || 0) > 0) {
    rows.push(`<div class="bonus-row"><span>Bonus Jika TUPO</span><b class="money">${money(tupoPotential.rupiah || 0)}</b></div>`);
  }
  if (Number(tupoPotential?.rupiah || 0) > 0 && tupoShortage > 0) {
    rows.push(`<div class="bonus-row"><span>Kekurangan TUPO</span><b>${pv(tupoShortage)}</b></div>`);
  }
  return rows.join("") || `<p class="bonus-empty">Belum ada bonus yang diterima pada bulan ini.</p>`;
}

function bonusBreakdownHtml(member) {
  const bonus = calcBonus(member);
  const tupoPotential = bonus.blockedByTupo ? forcedTupoBonus(member, calcMembers()) : null;
  const tupoShortage = Math.max(0, requiredTupoPv(member.rank) - Number(member.tupoPpv ?? member.ppv ?? 0));
  return `
    ${state.activeRole === "admin" && hasDisabledPersonalBonus(member) ? `<p class="notice">Sebagian bonus personal member ini sedang belum aktif: ${html(disabledPersonalBonusLabels(member).join(", "))}. Estimasi bonus hanya menghitung jenis bonus yang masih aktif.</p>` : ""}
    ${bonus.blockedByRenewal ? `<p class="notice">Bonus member ini tidak dihitung karena status renewal: Failure of renewal.</p>` : ""}
    ${bonus.blockedByTupo ? `<p class="notice">Bonus bulan ini belum dibayarkan karena TUPO ${html(member.rank)} belum terpenuhi. Syarat bonus: ${html(tupoRequirementText(member.rank))}. Jika TUPO terpenuhi, estimasi bonus yang bisa diterima adalah ${html(money(tupoPotential?.rupiah || 0))}${tupoShortage > 0 ? ` dan kekurangan TUPO saat ini ${html(pv(tupoShortage))}` : ""}.</p>` : ""}
    <div class="bonus-grid" style="margin-top:12px">
      ${bonusSummaryRows(bonus, tupoPotential, tupoShortage)}
    </div>
    ${bonusSourcesHtml(member, bonus)}
  `;
}

function bonusSourcesHtml(member, bonus) {
  const groups = [
    ["Prestasi", calcPerformanceSources(member)],
    ["Pasangan", calcPairSources(member)],
    ["Kepemimpinan", calcLeadershipSources(member)],
    ["Bimbingan", calcMentoringSources(member)],
    ["Sharing Profit", bonus.sharing ? calcSharingProfitSources(member, bonus.sharing) : []]
  ]
    .map(([title, sources]) => [title, sources.filter((source) => Number(source.amount || 0) > 0)])
    .filter(([, sources]) => sources.length);

  if (!groups.length) return `<p class="bonus-empty">Belum ada sumber bonus pada bulan ini.</p>`;

  return `
    <div class="bonus-sources">
      <b>Sumber Bonus</b>
      ${groups.map(([title, sources]) => `
        <details>
          <summary>${html(title)} - ${bv(sources.reduce((sum, source) => sum + source.amount, 0))} <small>${sources.length} sumber</small></summary>
          <div class="source-list">
            ${sources.map((source) => `
              <div class="source-row">
                <span>${html(source.label)}<small>${html(source.note)}</small></span>
                <b>${bv(source.amount)}</b>
              </div>
            `).join("")}
          </div>
        </details>
      `).join("")}
    </div>
  `;
}

function filteredMembers() {
  if (state.activeRole === "stockist") return state.members.filter((member) => member.stockist === state.activeId);
  if (state.activeRole === "member") return [currentMember()];
  if (state.activeRole === "branch") return state.members.filter(branchCanAccessMember);
  return state.members;
}

function placementMembers() {
  if (state.activeRole !== "member") return filteredMembers();
  const root = currentMember();
  const visible = [root];
  let cursor = [root.id];
  for (let depth = 0; depth < 5; depth += 1) {
    const children = state.members.filter((member) => cursor.includes(member.parent));
    visible.push(...children);
    cursor = children.map((member) => member.id);
    if (!cursor.length) break;
  }
  return visible;
}

function periodMembersList() {
  return filteredMembers().filter(memberInSelectedMonth);
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

function stockistPeriodMembers(stockistId, month = state.selectedMonth) {
  return computedMembersForMonth(month, state.members).filter((member) => member.stockist === stockistId);
}

function stockistSalesRupiah(stockistId, month = state.selectedMonth) {
  return stockistPeriodMembers(stockistId, month).reduce((sum, member) => sum + Number(member.ppv || 0) * 1000, 0);
}

function stockistMemberBonusRupiah(stockistId, month = state.selectedMonth) {
  const allMonthlyMembers = computedMembersForMonth(month, state.members);
  return stockistMemberBonusRupiahForMembers(allMonthlyMembers.filter((member) => member.stockist === stockistId), allMonthlyMembers);
}

function stockistMemberBonusRows(members, contextMembers = computedMembersForMonth(state.selectedMonth, state.members)) {
  const contextById = new Map(contextMembers.map((member) => [member.id, member]));
  return withCalcMembers(contextMembers, () => members.map((member) => {
    const contextMember = contextById.get(member.id) || member;
    return { member: contextMember, bonus: calcBonus(contextMember) };
  }));
}

function stockistMemberBonusRupiahForMembers(members, contextMembers = computedMembersForMonth(state.selectedMonth, state.members)) {
  return stockistMemberBonusRows(members, contextMembers).reduce((sum, row) => sum + row.bonus.rupiah, 0);
}

function stockistPaymentStats(stockistId, month = state.selectedMonth, members = stockistPeriodMembers(stockistId, month), contextMembers = computedMembersForMonth(month, state.members)) {
  const rows = stockistMemberBonusRows(members, contextMembers);
  const payableRows = rows.filter((row) => row.bonus.rupiah > 0);
  const paidRows = payableRows.filter((row) => row.member.paidDone);
  const payableAmount = payableRows.reduce((sum, row) => sum + row.bonus.rupiah, 0);
  const paidAmount = paidRows.reduce((sum, row) => sum + row.bonus.rupiah, 0);
  const allPaid = payableRows.length > 0 && paidRows.length === payableRows.length;
  return {
    payableCount: payableRows.length,
    paidCount: paidRows.length,
    payableAmount,
    paidAmount,
    unpaidAmount: Math.max(0, payableAmount - paidAmount),
    allPaid,
    status: !payableRows.length ? "Tidak ada bonus" : allPaid ? "Sudah dibayar semua" : `${paidRows.length}/${payableRows.length} dibayar`
  };
}

function forcedTupoBonus(member, members) {
  const forcedMembers = members.map((item) => item.id === member.id
    ? {
      ...item,
      tupoDone: true,
      tupoBlocked: false,
      tupoPpv: Math.max(Number(item.tupoPpv ?? item.ppv ?? 0), requiredTupoPv(item.rank))
    }
    : item);
  const forcedMember = forcedMembers.find((item) => item.id === member.id);
  return forcedMember ? withCalcMembers(forcedMembers, () => calcBonus(forcedMember)) : { rupiah: 0 };
}

function forcedAllTupoBonusMap(members) {
  const forcedMembers = members.map((item) => requiredTupoPv(item.rank) > 0
    ? {
      ...item,
      tupoDone: true,
      tupoBlocked: false,
      tupoPpv: Math.max(Number(item.tupoPpv ?? item.ppv ?? 0), requiredTupoPv(item.rank))
    }
    : item);
  return withCalcMembers(forcedMembers, () => new Map(forcedMembers.map((member) => [member.id, calcBonus(member)])));
}

function carryReserveRupiah(member) {
  const rate = rankRate(member, "pair");
  return Math.round(Number(member.carry || 0) * rate / 100) * 1000;
}

function companyPoolSummary(members) {
  const companyTnpv = companyTnpvBv(members);
  return withCalcMembers(members, () => {
    const paid = members.reduce((totals, member) => {
      const bonus = calcBonus(member);
      totals.performance += bonus.performance * 1000;
      totals.pair += bonus.pair * 1000;
      totals.leadership += bonus.leadership * 1000;
      totals.mentoring += bonus.mentoring * 1000;
      totals.sharing += bonus.sharing * 1000;
      totals.member += bonus.rupiah;
      return totals;
    }, { performance: 0, pair: 0, leadership: 0, mentoring: 0, sharing: 0, member: 0 });
    const stockistFee = stockistFeeBvForMembers(members) * 1000;
    const totalPaid = paid.member + stockistFee;
    const maxPayout = Math.round(companyTnpv * MAX_COMPANY_PAYOUT_RATE) * 1000;
    const companyRevenue = companyTnpv * 1000;
    const companyBase = Math.round(companyTnpv * (1 - MAX_COMPANY_PAYOUT_RATE)) * 1000;
    const targetRows = [
      ["performance", "Bonus Prestasi", PERFORMANCE_POOL_RATE, companyTnpv, paid.performance, "Selisih dari pool prestasi 30% menjadi bagian perusahaan."],
      ["pair", "Bonus Pasangan", PAIR_DESIGN_POOL_RATE, companyTnpv, paid.pair, "Selisih desain pool pasangan 15%; cadangan carry aktif dipisah agar kas tidak kaget."],
      ["leadership", "Bonus Kepemimpinan", LEADERSHIP_POOL_RATE, companyTnpv, paid.leadership, "Jika pembagian tidak sampai 8%, sisanya dikelola perusahaan."],
      ["mentoring", "Bonus Bimbingan", MENTORING_POOL_RATE, paid.pair / 1000, paid.mentoring, "Bonus Bimbingan dihitung dari Bonus Pasangan downline; jika tidak terpakai penuh, sisanya dikelola perusahaan."],
      ["sharing", "Sharing Profit", SHARING_POOL_RATE, companyTnpv, paid.sharing, "Jika pool 3% tidak terpakai penuh, sisanya dikelola perusahaan."]
    ].map(([key, label, rate, basisBv, paidAmount, note]) => {
      const target = Math.round(basisBv * rate) * 1000;
      const active = bonusEnabled(key);
      return {
        key,
        label,
        rate,
        active,
        basis: basisBv * 1000,
        target,
        paid: paidAmount,
        gap: Math.max(0, target - paidAmount),
        inactiveReserve: 0,
        note: active ? note : `${label} sedang nonaktif massal di Kontrol Bonus dan masuk dana kelola perusahaan.`
      };
    });
    const inactiveReserved = targetRows
      .filter((row) => !row.active)
      .reduce((sum, row) => sum + row.inactiveReserve, 0);
    return {
      companyTnpv: companyRevenue,
      maxPayout,
      companyBase,
      companyGross: Math.max(0, companyRevenue - totalPaid),
      paid,
      stockistFee,
      totalPaid,
      payoutGap: Math.max(0, maxPayout - totalPaid),
      inactiveManaged: 0,
      inactiveReserved,
      targetRows
    };
  });
}

function mergePoolTargetRows(audits) {
  const byLabel = new Map();
  audits.flatMap((audit) => audit.poolSummary.targetRows).forEach((row) => {
    const previous = byLabel.get(row.label) || { ...row, target: 0, paid: 0, gap: 0 };
    previous.target += row.target;
    previous.paid += row.paid;
    previous.gap += row.gap;
    byLabel.set(row.label, previous);
  });
  return [...byLabel.values()];
}

function latestRowsByMember(rows) {
  const byMember = new Map();
  rows.forEach((row) => {
    const previous = byMember.get(row.member.id);
    if (!previous || String(row.periodMonth || "") >= String(previous.periodMonth || "")) byMember.set(row.member.id, row);
  });
  return [...byMember.values()];
}

function fullMonthForfeitureAuditData(month = state.selectedMonth) {
  const audit = forfeitureAuditData(month, "2");
  const currentP1Rows = forfeitureAuditData(month, "2").unpaidPaymentRows
    .map((row) => ({ ...row, id: `${row.id}-PAY-P2`, source: `${row.source} - Bayar P2 ${monthLabel(month)}` }));
  const nextMonthDate = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 1);
  const nextMonth = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, "0")}`;
  const currentP2Rows = forfeitureAuditData(nextMonth, "1").unpaidPaymentRows
    .filter((row) => row.periodMonth === nextMonth)
    .map((row) => ({ ...row, id: `${row.id}-PAY-P1`, source: `${row.source} - Bayar P1 ${monthLabel(nextMonth)}` }));
  const unpaidPaymentRows = [...currentP1Rows, ...currentP2Rows];
  const unpaid = unpaidPaymentRows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  return {
    ...audit,
    scope: "month",
    month,
    unpaidPaymentRows,
    totals: {
      ...audit.totals,
      unpaid
    }
  };
}

function aggregateForfeitureAuditData(year = selectedYearValue()) {
  const months = dataMonthsForYear(year);
  const audits = months.map((month) => forfeitureAuditData(month, state.paymentPeriod));
  const unpaidPaymentRows = months.flatMap((month) => {
    const p1 = forfeitureAuditData(month, "1").unpaidPaymentRows.map((row) => ({ ...row, id: `${row.id}-P1`, source: `${row.source} - Bayar P1` }));
    const p2 = forfeitureAuditData(month, "2").unpaidPaymentRows.map((row) => ({ ...row, id: `${row.id}-P2`, source: `${row.source} - Bayar P2` }));
    return [...p1, ...p2];
  });
  const poolSummary = audits.reduce((summary, audit) => {
    summary.companyTnpv += audit.poolSummary.companyTnpv;
    summary.maxPayout += audit.poolSummary.maxPayout;
    summary.companyBase += audit.poolSummary.companyBase;
    summary.companyGross += audit.poolSummary.companyGross;
    summary.stockistFee += audit.poolSummary.stockistFee;
    summary.totalPaid += audit.poolSummary.totalPaid;
    summary.payoutGap += audit.poolSummary.payoutGap;
    summary.inactiveManaged += audit.poolSummary.inactiveManaged || 0;
    summary.inactiveReserved += audit.poolSummary.inactiveReserved || 0;
    Object.keys(summary.paid).forEach((key) => {
      summary.paid[key] += audit.poolSummary.paid[key] || 0;
    });
    return summary;
  }, {
    companyTnpv: 0,
    maxPayout: 0,
    companyBase: 0,
    companyGross: 0,
    paid: { performance: 0, pair: 0, leadership: 0, mentoring: 0, sharing: 0, member: 0 },
    stockistFee: 0,
    totalPaid: 0,
    payoutGap: 0,
    inactiveManaged: 0,
    inactiveReserved: 0,
    targetRows: []
  });
  poolSummary.targetRows = mergePoolTargetRows(audits);
  const expiredCarryRows = latestRowsByMember(audits.flatMap((audit) => audit.expiredCarryRows));
  const activeCarryRows = latestRowsByMember(audits.flatMap((audit) => audit.activeCarryRows));
  const tupoRows = audits.flatMap((audit) => audit.tupoRows);
  const personalBonusRows = audits.flatMap((audit) => audit.personalBonusRows || []);
  const pairHeldRows = audits.flatMap((audit) => audit.pairHeldRows);
  const sum = (rows) => rows.reduce((total, row) => total + Number(row.amount || 0), 0);
  const activeCarryReserve = sum(activeCarryRows);
  return {
    scope: "year",
    year,
    months,
    poolSummary,
    inactivePoolRows: [],
    expiredCarryRows,
    activeCarryRows,
    tupoRows,
    personalBonusRows,
    pairHeldRows,
    unpaidPaymentRows,
    totals: {
      expiredCarry: sum(expiredCarryRows),
      inactivePool: 0,
      activeCarryReserve,
      tupo: sum(tupoRows),
      personalBonus: sum(personalBonusRows),
      pairHeld: sum(pairHeldRows),
      unpaid: sum(unpaidPaymentRows),
      payoutGap: poolSummary.payoutGap,
      safeManaged: Math.max(0, poolSummary.payoutGap - activeCarryReserve)
    }
  };
}

function forfeitureAuditData(month = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  const monthlyMembers = computedMembersForMonth(month, state.members);
  const paymentMembers = commissionMembersForPayment(month, paymentPeriod, state.members);
  const poolSummary = companyPoolSummary(monthlyMembers);
  const forcedTupoBonuses = forcedAllTupoBonusMap(monthlyMembers);
  const forcedPersonalBonusMap = withCalcMembers(
    monthlyMembers.map((member) => hasDisabledPersonalBonus(member) ? { ...member, bonusDisabled: false, disabledBonuses: {} } : member),
    () => new Map(calcMembers().map((member) => [member.id, calcBonus(member)]))
  );
  const actualBonusMap = withCalcMembers(monthlyMembers, () => new Map(monthlyMembers.map((member) => [member.id, calcBonus(member)])));
  const rowId = (prefix, memberId) => `${prefix}-${memberId}`;
  const inactivePoolRows = [];
  const expiredCarryRows = monthlyMembers
    .filter((member) => Number(member.carry || 0) > 0 && Number(member.carryAge || 0) >= 3)
    .map((member) => ({
      id: rowId("carry-expired", member.id),
      category: "Carry Over Hangus",
      member,
      amount: carryReserveRupiah(member),
      pvAmount: Number(member.carry || 0),
      status: "Hangus",
      periodMonth: month,
      source: monthLabel(month),
      note: `Carry over umur ${member.carryAge} bulan. Masuk dana kelola karena sudah melewati batas.`
    }));
  const activeCarryRows = monthlyMembers
    .filter((member) => Number(member.carry || 0) > 0 && Number(member.carryAge || 0) < 3)
    .map((member) => ({
      id: rowId("carry-active", member.id),
      category: "Carry Over Aktif",
      member,
      amount: carryReserveRupiah(member),
      pvAmount: Number(member.carry || 0),
      status: "Belum hangus",
      periodMonth: month,
      source: monthLabel(month),
      note: `Belum masuk dana kelola. Masih bisa cair jika member mendapat pasangan dalam batas 3 bulan.`
    }));
  const tupoRows = monthlyMembers
    .filter((member) => requiredTupoPv(member.rank) > 0 && !effectiveTupoDone(member))
    .map((member) => {
      const forcedBonus = forcedTupoBonuses.get(member.id) || { rupiah: 0 };
      return {
        id: rowId("tupo", member.id),
        category: "Bonus Tertahan TUPO",
        member,
        amount: forcedBonus.rupiah,
        pvAmount: Number(member.tupoPpv ?? member.ppv ?? 0),
        status: "Tidak diterima",
        periodMonth: month,
        source: monthLabel(month),
        note: `TUPO belum memenuhi ${tupoRequirementText(member.rank)}. Estimasi ini adalah hak jika TUPO terpenuhi.`
      };
    })
    .filter((row) => row.amount > 0);
  const personalBonusRows = monthlyMembers
    .filter((member) => hasDisabledPersonalBonus(member))
    .map((member) => {
      const forcedBonus = forcedPersonalBonusMap.get(member.id) || { rupiah: 0 };
      const actualBonus = actualBonusMap.get(member.id) || { rupiah: 0 };
      const labels = disabledPersonalBonusLabels(member);
      return {
        id: rowId("personal-bonus-off", member.id),
        category: "Bonus Personal Nonaktif",
        member,
        amount: Math.max(0, forcedBonus.rupiah - actualBonus.rupiah),
        pvAmount: Number(member.ppv || 0),
        status: "Prioritas kelola",
        periodMonth: month,
        source: monthLabel(month),
        note: `Prioritas dana kelola dari bonus personal nonaktif: ${labels.join(", ")}. Nominal ini estimasi selisih jika bonus tersebut aktif.`
      };
    })
    .filter((row) => row.amount > 0);
  const pairHeldRows = withCalcMembers(monthlyMembers, () => monthlyMembers
    .map((member) => {
      const rawPair = calcRawPairBonus(member);
      const paidPair = calcPairBonus(member);
      return {
        id: rowId("pair-held", member.id),
        category: "Pasangan Tertahan Payout",
        member,
        amount: Math.max(0, rawPair - paidPair) * 1000,
        pvAmount: Math.min(Number(member.leftPv || 0), Number(member.rightPv || 0)),
        status: "Tidak dibayar sistem",
        periodMonth: month,
        source: monthLabel(month),
        note: "Selisih hak mentah pasangan dengan pasangan yang dibayar karena ruang payout pasangan."
      };
    })
    .filter((row) => row.amount > 0));
  const unpaidPaymentRows = withCalcMembers(paymentMembers, () => paymentMembers
    .map((member) => ({ member, bonus: calcBonus(member) }))
    .filter((row) => row.bonus.rupiah > 0 && !row.member.paidDone)
    .map(({ member, bonus }) => ({
      id: rowId("unpaid", member.id),
      category: "Belum Dibayar Stokis",
      member,
      amount: bonus.rupiah,
      pvAmount: Number(member.ppv || 0),
      status: "Masih kewajiban bayar",
      periodMonth: month,
      source: commissionSourceLabel(month, paymentPeriod),
      note: `Belum diceklis dibayar pada ${paymentPeriodLabel(paymentPeriod)}. Ini bukan dana kelola perusahaan.`
    })));
  const sum = (rows) => rows.reduce((total, row) => total + Number(row.amount || 0), 0);
  const activeCarryReserve = sum(activeCarryRows);
  const safeManaged = Math.max(0, poolSummary.payoutGap - activeCarryReserve);
  return {
    poolSummary,
    inactivePoolRows,
    expiredCarryRows,
    activeCarryRows,
    tupoRows,
    personalBonusRows,
    pairHeldRows,
    unpaidPaymentRows,
    totals: {
      expiredCarry: sum(expiredCarryRows),
      inactivePool: sum(inactivePoolRows),
      activeCarryReserve,
      tupo: sum(tupoRows),
      personalBonus: sum(personalBonusRows),
      pairHeld: sum(pairHeldRows),
      unpaid: sum(unpaidPaymentRows),
      payoutGap: poolSummary.payoutGap,
      safeManaged: Math.max(0, poolSummary.payoutGap - activeCarryReserve)
    }
  };
}

function stockistName(id) {
  const stockist = state.stockists.find((item) => item.id === id);
  return stockist ? stockist.name : "-";
}

function stockistLocationText(stockist) {
  if (!stockist) return "-";
  return [stockist.area, stockist.district].filter(Boolean).join(" - ") || "-";
}

function stockistArea(id) {
  return state.stockists.find((item) => item.id === id)?.area || "";
}

function sameArea(left, right) {
  return sameText(normalizeAreaName(left), normalizeAreaName(right));
}

function branchCanAccessArea(area) {
  if (state.activeRole !== "branch") return true;
  const branchArea = currentUser()?.area || "";
  return sameArea(branchArea, "Semua Indonesia") || sameArea(branchArea, area);
}

function branchCanAccessMember(member) {
  return branchCanAccessArea(stockistArea(member.stockist));
}

function canEditAll() {
  return state.activeRole === "admin" || state.activeRole === "branch";
}

function canBulkSelect() {
  return state.activeRole === "admin";
}

function selectedSet(type) {
  if (!selectedRows[type]) selectedRows[type] = new Set();
  return selectedRows[type];
}

function rowIsSelectable(type, id) {
  return !(type === "admin" && id === state.activeId);
}

function clearSelections() {
  Object.values(selectedRows).forEach((set) => set.clear());
}

function selectionHeader(type, ids) {
  if (!canBulkSelect()) return "";
  const selectableIds = ids.map(String).filter((id) => id && rowIsSelectable(type, id));
  const selected = selectedSet(type);
  const checked = selectableIds.length > 0 && selectableIds.every((id) => selected.has(id));
  return `<th class="select-col"><input type="checkbox" data-select-all="${attr(type)}" data-select-ids="${attr(selectableIds.join(","))}" ${checked ? "checked" : ""} title="Pilih semua"></th>`;
}

function selectionCell(type, id) {
  if (!canBulkSelect()) return "";
  const selectable = rowIsSelectable(type, String(id));
  return `<td class="select-col"><input type="checkbox" data-select-row="${attr(type)}:${attr(id)}" ${selectedSet(type).has(String(id)) ? "checked" : ""} ${selectable ? "" : "disabled"} title="${selectable ? "Pilih data" : "Akun aktif tidak bisa dipilih"}"></td>`;
}

function selectionPanelCell(type, id) {
  if (!canBulkSelect()) return "";
  const selectable = rowIsSelectable(type, String(id));
  return `<label class="panel-select"><input type="checkbox" data-select-row="${attr(type)}:${attr(id)}" ${selectedSet(type).has(String(id)) ? "checked" : ""} ${selectable ? "" : "disabled"} title="${selectable ? "Pilih data" : "Akun aktif tidak bisa dipilih"}"></label>`;
}

function bulkActionButton(type, label = "Hapus Terpilih") {
  if (!canBulkSelect()) return "";
  const count = selectedSet(type).size;
  return `<button class="danger bulk-action" data-bulk-delete="${attr(type)}" ${count ? "" : "disabled"}>${html(label)}${count ? ` (${count})` : ""}</button>`;
}

function actionButtons(type, id) {
  if (!canEditAll()) return `<span class="muted">Lihat saja</span>`;
  const actionId = `${type}:${id}`;
  const deleteBtn = state.activeRole === "admin" ? `<button class="icon-btn danger" title="Hapus" data-delete="${attr(actionId)}">X</button>` : "";
  return `<button class="icon-btn" title="Edit" data-edit="${attr(actionId)}">E</button>${deleteBtn}`;
}

function placementScore(member) {
  const pairable = Math.min(member.leftPv, member.rightPv);
  const imbalance = Math.abs(member.leftPv - member.rightPv);
  const rankWeight = (rankIndex[member.rank] || 0) * 1000;
  return Math.max(1, Math.round(pairable / 1000 + rankWeight - imbalance / 2500));
}

function relationCreatesCycle(startId, targetId, field, members = state.members) {
  if (!startId || !targetId || isRootSponsor(startId)) return false;
  const byId = Object.fromEntries(members.map((member) => [member.id, member]));
  const seen = new Set([targetId]);
  let cursor = startId;
  while (cursor && !isRootSponsor(cursor)) {
    if (seen.has(cursor)) return true;
    seen.add(cursor);
    cursor = byId[cursor]?.[field];
  }
  return false;
}

function buildLevels(rootId, depth) {
  const sourceMembers = treeSourceMembers();
  const levels = [];
  let current = [sourceMembers.find((member) => member.id === rootId)].filter(Boolean);
  const visited = new Set(current.map((member) => member.id));
  for (let index = 0; index < depth; index += 1) {
    levels.push(current);
    current = sourceMembers.filter((member) => current.some((parent) => parent.id === member.sponsor) && !visited.has(member.id));
    current.forEach((member) => visited.add(member.id));
  }
  return levels;
}

function attachViewEvents() {
  document.querySelectorAll("[data-period-field]").forEach((input) => {
    input.addEventListener("change", () => {
      state[input.dataset.periodField] = input.value;
      if (input.dataset.periodField === "selectedMonth") state.monthManuallySelected = true;
      if (input.dataset.periodField === "dashboardMonth") state.dashboardMonthManuallySelected = true;
      if (input.dataset.periodField === "selectedMonth") {
        resetServerMembersPagination();
        resetServerTrees();
        resetServerBonusPage();
        serverStockistPayouts.key = "";
        serverCompanyFunds.key = "";
      }
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-month-part-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const field = input.dataset.monthPartField;
      const currentValue = state[field] || state.selectedMonth || currentMonthValue();
      const year = String(currentValue).slice(0, 4) || selectedYearValue(currentValue);
      state[field] = `${year}-${String(input.value || "01").padStart(2, "0")}`;
      if (field === "selectedMonth") state.monthManuallySelected = true;
      if (field === "dashboardMonth") state.dashboardMonthManuallySelected = true;
      if (field === "selectedMonth") {
        resetServerMembersPagination();
        resetServerTrees();
        resetServerBonusPage();
        serverStockistPayouts.key = "";
        serverCompanyFunds.key = "";
      }
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-month-year-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const field = input.dataset.monthYearField;
      const currentValue = state[field] || state.selectedMonth || currentMonthValue();
      const month = String(currentValue).slice(5, 7) || "01";
      const year = String(input.value || selectedYearValue(currentValue)).slice(0, 4);
      state[field] = `${year}-${month}`;
      if (field === "selectedMonth") state.monthManuallySelected = true;
      if (field === "dashboardMonth") state.dashboardMonthManuallySelected = true;
      if (field === "selectedMonth") {
        resetServerMembersPagination();
        resetServerTrees();
        resetServerBonusPage();
        serverStockistPayouts.key = "";
        serverCompanyFunds.key = "";
      }
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-year-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const year = String(input.value || selectedYearValue()).slice(0, 4);
      const field = input.dataset.yearField;
      const currentValue = state[field] || state.selectedMonth || currentMonthValue();
      const month = String(currentValue).slice(5, 7) || "01";
      state[field] = `${year}-${month}`;
      if (field === "selectedMonth") state.monthManuallySelected = true;
      if (field === "dashboardMonth") state.dashboardMonthManuallySelected = true;
      if (field === "selectedMonth") {
        resetServerMembersPagination();
        resetServerTrees();
        resetServerBonusPage();
        serverStockistPayouts.key = "";
        serverCompanyFunds.key = "";
      }
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-revenue-period-field]").forEach((input) => {
    input.addEventListener("change", () => {
      state.revenuePeriod = revenuePeriodValue(input.value);
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-payment-period-field]").forEach((input) => {
    input.addEventListener("change", () => {
      state.paymentPeriod = paymentPeriodValue(input.value);
      resetServerBonusPage();
      serverStockistPayouts.key = "";
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-admin-report-scope-field]").forEach((input) => {
    input.addEventListener("change", () => {
      state.adminReportScope = adminReportScopeValue(input.value);
      resetServerBonusPage();
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-member-bonus-scope-field]").forEach((input) => {
    input.addEventListener("change", () => {
      state.memberBonusScope = memberBonusScopeValue(input.value);
      resetServerBonusPage();
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-company-fund-scope-field]").forEach((input) => {
    input.addEventListener("change", () => {
      state.companyFundScope = companyFundScopeValue(input.value);
      serverCompanyFunds.key = "";
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-stockist-payment-scope-field]").forEach((input) => {
    input.addEventListener("change", () => {
      state.stockistPaymentScope = stockistPaymentScopeValue(input.value);
      serverStockistPayouts.key = "";
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-bonus-toggle]").forEach((input) => {
    input.addEventListener("change", async () => {
      const key = input.dataset.bonusToggle;
      const checked = input.checked;
      state.bonusSettings = { ...defaultState.bonusSettings, ...(state.bonusSettings || {}), [key]: checked };
      saveState();
      if (apiConnected() && state.activeRole === "admin") {
        try {
          await updateServerBonusSetting(key, checked);
          serverDashboardSummary.key = "";
          resetServerBonusPage();
          serverStockistPayouts.key = "";
          serverCompanyFunds.key = "";
        } catch (error) {
          state.bonusSettings = { ...defaultState.bonusSettings, ...(state.bonusSettings || {}), [key]: !checked };
          saveState();
          showToast(error.message || "Pengaturan bonus gagal disimpan.");
          render();
          return;
        }
      }
      render();
      showToast(`${checked ? "Bonus diaktifkan" : "Bonus dinonaktifkan"}.`, "success");
    });
  });
  document.querySelectorAll("[data-menu-visibility]").forEach((input) => {
    input.addEventListener("change", async () => {
      const [role, key] = input.dataset.menuVisibility.split(":");
      const nextData = structuredClone(menuVisibilityState.data || { admin: {}, branch: {}, stockist: {}, member: {}, personal: {} });
      nextData[role] = { ...(nextData[role] || {}), [key]: input.checked };
      try {
        await saveMenuVisibility(nextData);
        render();
        showToast("Pengaturan halaman berhasil disimpan.", "success");
      } catch (error) {
        input.checked = !input.checked;
        showToast(error.message || "Pengaturan halaman gagal disimpan.");
      }
    });
  });
  document.querySelector("[data-menu-personal-role]")?.addEventListener("change", (event) => {
    state.menuPersonalRole = event.target.value;
    saveState();
    render();
  });
  document.querySelector("[data-menu-personal-load]")?.addEventListener("click", () => {
    const roleInput = document.querySelector("[data-menu-personal-role]");
    const idInput = document.querySelector("[data-menu-personal-id]");
    state.menuPersonalRole = roleInput?.value || "member";
    state.menuPersonalId = String(idInput?.value || "").trim();
    saveState();
    render();
  });
  document.querySelector("[data-menu-personal-id]")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    state.menuPersonalRole = document.querySelector("[data-menu-personal-role]")?.value || "member";
    state.menuPersonalId = String(event.target.value || "").trim();
    saveState();
    render();
  });
  document.querySelectorAll("[data-menu-personal-toggle]").forEach((input) => {
    input.addEventListener("change", async () => {
      const [role, id, key] = input.dataset.menuPersonalToggle.split(":");
      const nextData = structuredClone(menuVisibilityState.data || { admin: {}, branch: {}, stockist: {}, member: {}, personal: {} });
      const personalKey = `${role}:${id}`;
      nextData.personal = { ...(nextData.personal || {}) };
      nextData.personal[personalKey] = { ...(nextData.personal[personalKey] || {}), [key]: input.checked };
      try {
        await saveMenuVisibility(nextData);
        render();
        showToast("Pengaturan halaman personal berhasil disimpan.", "success");
      } catch (error) {
        input.checked = !input.checked;
        showToast(error.message || "Pengaturan halaman personal gagal disimpan.");
      }
    });
  });
  document.querySelectorAll("[data-search]").forEach((input) => {
    input.addEventListener("input", () => {
      searchTerms[input.dataset.search] = input.value;
      if (input.dataset.search === "members") resetServerMembersPagination();
      if (input.dataset.search === "tupo") resetServerTupoPagination();
      if (input.dataset.search === "revenue") resetServerRevenuePagination();
      if (["network", "placement"].includes(input.dataset.search)) resetServerTree(input.dataset.search);
      if (input.dataset.search === "stockists") resetServerListPagination("stockists");
      if (input.dataset.search === "admins") resetServerListPagination("admins");
      if (input.dataset.search === "announcements") resetServerListPagination("announcements");
      if (input.dataset.search === "bonuses") resetServerBonusPage();
      if (input.dataset.search === "payouts") resetServerBonusPage();
      clearTimeout(searchRenderTimer);
      searchRenderTimer = setTimeout(() => {
        render();
        const next = document.querySelector(`[data-search="${input.dataset.search}"]`);
        if (next) {
          next.focus();
          next.setSelectionRange(next.value.length, next.value.length);
        }
      }, 180);
    });
  });
  document.querySelectorAll("[data-members-page]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.membersPage === "next" && serverMembersPage.nextCursor) {
        serverMembersPage.previousCursors.push(serverMembersPage.cursor || "");
        serverMembersPage.cursor = serverMembersPage.nextCursor;
      }
      if (button.dataset.membersPage === "prev") {
        serverMembersPage.cursor = serverMembersPage.previousCursors.pop() || "";
      }
      serverMembersPage.loadedKey = "";
      render();
    });
  });
  document.querySelectorAll("[data-server-tupo-page]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.serverTupoPage === "next" && serverTupoPage.nextCursor) {
        serverTupoPage.previousCursors.push(serverTupoPage.cursor || "");
        serverTupoPage.cursor = serverTupoPage.nextCursor;
      }
      if (button.dataset.serverTupoPage === "prev") {
        serverTupoPage.cursor = serverTupoPage.previousCursors.pop() || "";
      }
      serverTupoPage.loadedKey = "";
      render();
    });
  });
  document.querySelectorAll("[data-server-revenue-page]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.serverRevenuePage === "next" && serverRevenuePage.nextCursor) {
        serverRevenuePage.previousCursors.push(serverRevenuePage.cursor || "");
        serverRevenuePage.cursor = serverRevenuePage.nextCursor;
      }
      if (button.dataset.serverRevenuePage === "prev") {
        serverRevenuePage.cursor = serverRevenuePage.previousCursors.pop() || "";
      }
      serverRevenuePage.loadedKey = "";
      render();
    });
  });
  document.querySelectorAll("[data-server-bonus-page]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.serverBonusPage === "next" && serverBonusPage.nextCursor) {
        serverBonusPage.previousCursors.push(serverBonusPage.cursor || "");
        serverBonusPage.cursor = serverBonusPage.nextCursor;
      }
      if (button.dataset.serverBonusPage === "prev") {
        serverBonusPage.cursor = serverBonusPage.previousCursors.pop() || "";
      }
      serverBonusPage.loadedKey = "";
      render();
    });
  });
  document.querySelectorAll("[data-server-master-page]").forEach((button) => {
    button.addEventListener("click", () => {
      const [type, direction] = button.dataset.serverMasterPage.split(":");
      const page = serverMasterPages[type];
      if (!page) return;
      if (direction === "next" && page.nextCursor) {
        page.previousCursors.push(page.cursor || "");
        page.cursor = page.nextCursor;
      }
      if (direction === "prev") {
        page.cursor = page.previousCursors.pop() || "";
      }
      page.loadedKey = "";
      render();
    });
  });
  document.querySelectorAll("[data-server-add-member]").forEach((button) => {
    button.addEventListener("click", async () => {
      pendingServerMemberId = await nextServerMemberId();
      openDialog("serverMember");
    });
  });
  document.querySelectorAll("[data-server-edit-member]").forEach((button) => {
    button.addEventListener("click", () => openDialog("serverMember", button.dataset.serverEditMember));
  });
  document.querySelectorAll("[data-server-delete-member]").forEach((button) => {
    button.addEventListener("click", () => archiveServerMember(button.dataset.serverDeleteMember));
  });
  document.querySelectorAll("[data-server-member-status]").forEach((button) => {
    button.addEventListener("click", () => {
      const [id, status] = button.dataset.serverMemberStatus.split(":");
      updateServerMemberStatus(id, status === "active");
    });
  });
  document.querySelectorAll("[data-server-master-delete]").forEach((button) => {
    button.addEventListener("click", () => archiveServerMaster(...button.dataset.serverMasterDelete.split(":")));
  });
  document.querySelectorAll("[data-server-omzet]").forEach((button) => {
    button.addEventListener("click", () => openDialog("serverOmzet", button.dataset.serverOmzet));
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      activeView = button.dataset.view;
      render();
    });
  });
  document.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => openDialog(...button.dataset.edit.split(":")));
  });
  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => openDialog(button.dataset.add));
  });
  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteItem(...button.dataset.delete.split(":")));
  });
  document.querySelectorAll("[data-select-row]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const [type, id] = checkbox.dataset.selectRow.split(":");
      if (checkbox.checked) selectedSet(type).add(id);
      else selectedSet(type).delete(id);
      render();
    });
  });
  document.querySelectorAll("[data-select-all]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const type = checkbox.dataset.selectAll;
      const ids = String(checkbox.dataset.selectIds || "").split(",").filter(Boolean);
      if (checkbox.checked) ids.forEach((id) => selectedSet(type).add(id));
      else ids.forEach((id) => selectedSet(type).delete(id));
      render();
    });
  });
  document.querySelectorAll("[data-bulk-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      if (apiConnected() && button.dataset.bulkDelete === "member") {
        archiveSelectedServerMembers();
        return;
      }
      deleteSelectedItems(button.dataset.bulkDelete);
    });
  });
  document.querySelectorAll("[data-restore-member]").forEach((button) => {
    button.addEventListener("click", () => restoreDeletedMember(button.dataset.restoreMember));
  });
  document.querySelectorAll("[data-restore-item]").forEach((button) => {
    button.addEventListener("click", () => restoreDeletedItem(...button.dataset.restoreItem.split(":")));
  });
  document.querySelectorAll("[data-tupo-toggle]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      setPeriodTupoDone(checkbox.dataset.tupoToggle, checkbox.checked);
      syncPersistentMemberProgress(state.selectedMonth);
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-server-tupo-toggle]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => updateServerTupo(checkbox.dataset.serverTupoToggle, checkbox.checked));
  });
  document.querySelectorAll("[data-tupo-bulk]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.tupoBulk === "clear") clearVisibleTupoOverrides(button.dataset.tupoIds);
      else updateVisibleTupo(button.dataset.tupoIds, true);
    });
  });
  document.querySelectorAll("[data-payment-toggle]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      setPeriodPaymentDone(checkbox.dataset.paymentToggle, checkbox.checked, checkbox.dataset.paymentMonth || state.selectedMonth, checkbox.dataset.paymentPeriod || state.paymentPeriod);
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-server-payment-toggle]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateServerVisiblePayments(
        checkbox.dataset.serverPaymentToggle,
        checkbox.checked,
        checkbox.dataset.ledgerPeriod,
        checkbox.dataset.paymentMonth,
        checkbox.dataset.paymentPeriod
      );
    });
  });
  document.querySelectorAll("[data-payment-toggle-button]").forEach((button) => {
    button.addEventListener("click", () => {
      setPeriodPaymentDone(button.dataset.paymentToggleButton, true, button.dataset.paymentMonth || state.selectedMonth, button.dataset.paymentPeriod || state.paymentPeriod);
      saveState();
      render();
      showToast("Pembayaran member berhasil diceklis.", "success");
    });
  });
  document.querySelectorAll("[data-payment-bulk]").forEach((button) => {
    button.addEventListener("click", () => updateVisiblePayments(button.dataset.paymentIds, button.dataset.paymentBulk === "mark", button.dataset.paymentMonth || state.selectedMonth, button.dataset.paymentPeriod || state.paymentPeriod));
  });
  document.querySelectorAll("[data-server-payment-bulk]").forEach((button) => {
    button.addEventListener("click", () => updateServerVisiblePayments(
      button.dataset.paymentIds,
      button.dataset.serverPaymentBulk === "mark",
      button.dataset.ledgerPeriod,
      button.dataset.paymentMonth,
      button.dataset.paymentPeriod
    ));
  });
  document.querySelectorAll("[data-stockist-pay-all]").forEach((button) => {
    button.addEventListener("click", () => updateStockistPayments(button.dataset.stockistPayAll, button.dataset.paymentMonth || state.selectedMonth, button.dataset.paymentPeriod || state.paymentPeriod));
  });
  document.querySelectorAll("[data-stockist-fee-toggle]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (apiConnected() && checkbox.dataset.serverStockistTransfer === "true") {
        updateServerStockistTransfer(checkbox.dataset.stockistFeeToggle, checkbox.checked, {
          sales: checkbox.dataset.salesRupiah,
          fee: checkbox.dataset.feeRupiah,
          memberBonus: checkbox.dataset.memberBonusRupiah
        });
        return;
      }
      setStockistFeePaymentDoneForScope(checkbox.dataset.stockistFeeToggle, checkbox.checked, checkbox.dataset.stockistScope || state.stockistPaymentScope, checkbox.dataset.paymentMonth || state.selectedMonth, checkbox.dataset.paymentPeriod || state.paymentPeriod);
      saveState();
      render();
      showToast(checkbox.checked ? "Dana ke stokis ditandai sudah dikirim." : "Ceklis dana ke stokis dibuka.", "success");
    });
  });
  document.querySelectorAll("[data-seed-custom-test]").forEach((button) => {
    button.addEventListener("click", seedCustomTestMembers);
  });
  document.querySelectorAll("[data-run-server-bonus]").forEach((button) => {
    button.addEventListener("click", runServerBonusPeriod);
  });
  document.querySelectorAll("[data-network-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.networkToggle;
      const isCollapsed = button.dataset.networkCollapsed === "true";
      if (isCollapsed) {
        expandedNetworkIds.add(id);
        collapsedNetworkIds.delete(id);
      } else {
        collapsedNetworkIds.add(id);
        expandedNetworkIds.delete(id);
        resetNetworkDescendantToggles(id);
      }
      render();
    });
  });
  document.querySelectorAll("[data-server-network-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.serverNetworkToggle;
      const isCollapsed = button.dataset.serverNetworkCollapsed === "true";
      if (isCollapsed) {
        expandedNetworkIds.add(id);
        collapsedNetworkIds.delete(id);
        loadServerTreeChildren("network", id);
        render();
      } else {
        collapsedNetworkIds.add(id);
        expandedNetworkIds.delete(id);
        resetServerTreeDescendantToggles("network", id);
        render();
      }
    });
  });
  document.querySelectorAll("[data-placement-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.placementToggle;
      const isCollapsed = button.dataset.placementCollapsed === "true";
      if (isCollapsed) {
        expandedPlacementIds.add(id);
        collapsedPlacementIds.delete(id);
      } else {
        collapsedPlacementIds.add(id);
        expandedPlacementIds.delete(id);
        resetPlacementDescendantToggles(id);
      }
      render();
    });
  });
  document.querySelectorAll("[data-server-placement-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.serverPlacementToggle;
      const isCollapsed = button.dataset.serverPlacementCollapsed === "true";
      if (isCollapsed) {
        expandedPlacementIds.add(id);
        collapsedPlacementIds.delete(id);
        loadServerTreeChildren("placement", id);
        render();
      } else {
        collapsedPlacementIds.add(id);
        expandedPlacementIds.delete(id);
        resetServerTreeDescendantToggles("placement", id);
        render();
      }
    });
  });
  document.querySelectorAll("[data-profile-edit]").forEach((button) => {
    button.addEventListener("click", () => openDialog(...button.dataset.profileEdit.split(":")));
  });
  document.querySelectorAll("[data-omzet]").forEach((button) => {
    button.addEventListener("click", () => openDialog("omzet", button.dataset.omzet));
  });
}

function emptyRow(message) {
  return `<tr><td colspan="9"><span class="muted">${html(message)}</span></td></tr>`;
}

function updateVisibleTupo(idsText, checked) {
  const ids = String(idsText || "").split(",").filter(Boolean);
  ids.forEach((id) => setPeriodTupoDone(id, checked));
  syncPersistentMemberProgress(state.selectedMonth);
  saveState();
  render();
  showToast(checked ? "TUPO member yang tampil berhasil diceklis." : "Ceklis TUPO berhasil dikosongkan.", "success");
}

function clearVisibleTupoOverrides(idsText) {
  const ids = String(idsText || "").split(",").filter(Boolean);
  ids.forEach((id) => clearPeriodTupoOverride(id));
  syncPersistentMemberProgress(state.selectedMonth);
  saveState();
  render();
  showToast("Pengaturan TUPO berhasil dikosongkan.", "success");
}

function updateVisiblePayments(idsText, checked, month = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  const ids = String(idsText || "").split(",").filter(Boolean);
  ids.forEach((id) => setPeriodPaymentDone(id, checked, month, paymentPeriod));
  saveState();
  render();
  showToast(checked ? "Pembayaran member berhasil diceklis." : "Ceklis pembayaran berhasil dikosongkan.", "success");
}

async function updateServerPayment(memberId, checked, ledgerPeriod, paymentMonth, paymentPeriod) {
  await apiRequest(`/api/periods/${encodeURIComponent(ledgerPeriod)}/member-payments/${encodeURIComponent(memberId)}?${new URLSearchParams({ paymentMonth, paymentPeriod }).toString()}`, {
    method: "PATCH",
    body: JSON.stringify({ paid: checked })
  });
  serverCompanyFunds.key = "";
}

async function updateServerVisiblePayments(idsText, checked, ledgerPeriod, paymentMonth, paymentPeriod) {
  const ids = String(idsText || "").split(",").filter(Boolean);
  if (!ids.length) return;
  try {
    await Promise.all(ids.map((id) => updateServerPayment(id, checked, ledgerPeriod, paymentMonth, paymentPeriod)));
    resetServerBonusPage();
    serverStockistPayouts.key = "";
    serverCompanyFunds.key = "";
    render();
    showToast(checked ? "Pembayaran member berhasil diceklis." : "Ceklis pembayaran dikosongkan.", "success");
  } catch (error) {
    showToast(error.message || "Status pembayaran gagal disimpan.");
  }
}

async function updateServerStockistTransfer(stockistId, checked, payload = {}) {
  const source = serverPaymentSource(stockistPaymentScopeValue(), state.selectedMonth, state.paymentPeriod);
  try {
    await apiRequest(`/api/periods/${encodeURIComponent(source.ledgerPeriod)}/stockist-payouts/${encodeURIComponent(stockistId)}?${new URLSearchParams({ paymentMonth: source.paymentMonth, paymentPeriod: source.paymentPeriod }).toString()}`, {
      method: "PATCH",
      body: JSON.stringify({
        paid: checked,
        salesRupiah: Number(payload.sales || 0),
        feeRupiah: Number(payload.fee || 0),
        memberBonusRupiah: Number(payload.memberBonus || 0)
      })
    });
    serverStockistPayouts.key = "";
    serverCompanyFunds.key = "";
    render();
    showToast(checked ? "Dana ke stokis ditandai sudah dikirim." : "Ceklis dana ke stokis dibuka.", "success");
  } catch (error) {
    showToast(error.message || "Status dana stokis gagal disimpan.");
  }
}

function updateStockistPayments(stockistId, month = state.selectedMonth, paymentPeriod = state.paymentPeriod) {
  const allMonthlyMembers = commissionMembersForPayment(month, paymentPeriod, state.members);
  const members = allMonthlyMembers.filter((member) => member.stockist === stockistId);
  const rows = stockistMemberBonusRows(members, allMonthlyMembers).filter((row) => row.bonus.rupiah > 0);
  if (!rows.length) {
    showToast("Tidak ada bonus member yang perlu dibayar untuk stokis ini.");
    return;
  }
  const allPaid = rows.every((row) => row.member.paidDone);
  rows.forEach((row) => setPeriodPaymentDone(row.member.id, !allPaid, month, paymentPeriod));
  saveState();
  render();
  showToast(allPaid ? "Ceklis pembayaran stokis dikosongkan." : "Semua pembayaran member stokis berhasil diceklis.", "success");
}

function sponsorDescendantIds(rootId, members = state.members) {
  const result = [];
  const queue = [rootId];
  const visited = new Set([rootId]);
  while (queue.length) {
    const sponsorId = queue.shift();
    members
      .filter((member) => member.sponsor === sponsorId && !visited.has(member.id))
      .forEach((child) => {
        visited.add(child.id);
        result.push(child.id);
        queue.push(child.id);
      });
  }
  return result;
}

function nextTestMemberId(rootId, usedIds) {
  const cleanRoot = String(rootId || "TEST").replace(/[^A-Za-z0-9]/g, "").slice(0, 8).toUpperCase() || "TEST";
  let number = 1;
  let candidate = `${cleanRoot}-T${String(number).padStart(3, "0")}`;
  while (usedIds.has(candidate)) {
    number += 1;
    candidate = `${cleanRoot}-T${String(number).padStart(3, "0")}`;
  }
  usedIds.add(candidate);
  return candidate;
}

function findMemberByQuery(query) {
  const term = normalizeSearch(query);
  if (!term) return null;
  return state.members.find((member) => normalizeSearch(member.id) === term)
    || state.members.find((member) => normalizeSearch(member.name) === term)
    || state.members.find((member) => normalizeSearch(member.id).includes(term) || normalizeSearch(member.name).includes(term));
}

function parsePositiveInteger(value, fallback = 1) {
  const number = Number(String(value ?? "").trim());
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

async function findServerMemberByQuery(query) {
  const params = new URLSearchParams({
    limit: "1",
    period: state.selectedMonth || currentMonthValue(),
    q: String(query || "").trim()
  });
  const result = await apiRequest(`/api/members?${params.toString()}`);
  return (result.data || [])[0] ? apiMemberToLocal((result.data || [])[0]) : null;
}

async function seedServerCustomTestMembers() {
  const targetText = prompt("Isi ID atau nama member target untuk dibuatkan downline test.", state.activeId || serverMembersPage.rows[0]?.id || "");
  if (targetText === null) return;
  let root = null;
  try {
    root = await findServerMemberByQuery(targetText);
  } catch (error) {
    showToast(error.message || "Member target belum bisa dicari.");
    return;
  }
  if (!root) {
    showToast("Member target tidak ditemukan di server.");
    return;
  }
  const modeText = prompt("Mode penambahan: ketik 'terbawah' untuk masing-masing titik terbawah, atau 'langsung' untuk langsung di bawah target.", "terbawah");
  if (modeText === null) return;
  const mode = normalizeSearch(modeText).startsWith("langsung") ? "direct" : "leaves";
  const countText = prompt(`Berapa member test yang ditambah per titik ${mode === "direct" ? root.name || root.id : "terbawah"}?`, "4");
  if (countText === null) return;
  const countPerPoint = parsePositiveInteger(countText, 4);
  if (countPerPoint > 500) {
    showToast("Maksimal 500 member per titik agar proses tetap aman.");
    return;
  }
  const pvText = prompt(`Isi PPV untuk setiap member test baru pada ${selectedMonthLabel()}.`, "6000");
  if (pvText === null) return;
  const testPpv = parsePvInput(pvText);
  if (!Number.isFinite(testPpv) || testPpv < 0) {
    showToast("PPV test tidak valid. Isi angka seperti 6000 atau 10000.");
    return;
  }
  const rankText = prompt(`Peringkat member test. Pilihan: ${ranks.map((rank) => rank.name).join(", ")}`, "Member");
  if (rankText === null) return;
  const selectedRank = ranks.find((rank) => sameText(rank.name, rankText))?.name || "Member";
  const stockistText = prompt("ID stokis untuk member baru. Kosongkan untuk mengikuti stokis sponsor/target.", "");
  if (stockistText === null) return;
  const forcedStockist = String(stockistText || "").trim();
  const prefixText = prompt("Prefix nama member test.", `Test ${root.name || root.id}`);
  if (prefixText === null) return;
  const namePrefix = String(prefixText || `Test ${root.name || root.id}`).trim() || `Test ${root.name || root.id}`;
  const passwordText = prompt("Sandi untuk member test baru.", "ascendia");
  if (passwordText === null) return;
  const password = String(passwordText || "ascendia");
  if (!confirm(`Target: ${root.name || root.id}. Mode ${mode === "direct" ? "langsung" : "terbawah"}. Tambah ${countPerPoint} member per titik. PV ${pv(testPpv)}, peringkat ${selectedRank}, stokis ${forcedStockist || "ikut sponsor/target"}. Lanjutkan?`)) return;

  showToast("Sedang membuat member test di server...");
  try {
    const result = await apiRequest(`/api/periods/${encodeURIComponent(state.selectedMonth || currentMonthValue())}/test-members`, {
      method: "POST",
      body: JSON.stringify({
        targetId: root.id,
        mode,
        countPerPoint,
        ppv: testPpv,
        rankName: selectedRank,
        stockistId: forcedStockist || null,
        namePrefix,
        password
      })
    });
    resetServerMembersPagination();
    resetServerRevenuePagination();
    resetServerTupoPagination();
    resetServerTrees();
    resetServerBonusPage();
    serverDashboardSummary.key = "";
    serverStockistPayouts.key = "";
    serverCompanyFunds.key = "";
    clearSelections();
    render();
    showToast(`Selesai: ${result.createdCount || 0} member test dibuat. ID ${result.firstId || "-"} sampai ${result.lastId || "-"}. Lihat di Data Member / Struktur / Placement.`, "success");
  } catch (error) {
    showToast(error.message || "Member test gagal dibuat.");
  }
}

async function seedCustomTestMembers() {
  if (state.activeRole !== "admin") {
    showToast("Member test custom hanya bisa dibuat oleh akses pusat.");
    return;
  }
  if (apiConnected()) {
    await seedServerCustomTestMembers();
    return;
  }
  const targetText = prompt("Isi ID atau nama member target untuk dibuatkan downline test.", state.members[0]?.id || "");
  if (targetText === null) return;
  const root = findMemberByQuery(targetText);
  if (!root) {
    showToast("Member target tidak ditemukan. Isi ID atau nama member yang sudah ada.");
    return;
  }
  const modeText = prompt("Mode penambahan: ketik 'terbawah' untuk masing-masing titik terbawah, atau 'langsung' untuk langsung di bawah target.", "terbawah");
  if (modeText === null) return;
  const mode = normalizeSearch(modeText).startsWith("langsung") ? "langsung" : "terbawah";
  const descendants = sponsorDescendantIds(root.id);
  const descendantSet = new Set(descendants);
  const leaves = mode === "langsung"
    ? [root]
    : (descendants.length ? state.members.filter((member) => descendantSet.has(member.id)) : [root])
      .filter((member) => !state.members.some((candidate) => candidate.sponsor === member.id && descendantSet.has(candidate.id)));
  if (!leaves.length) {
    showToast("Titik penambahan tidak ditemukan.");
    return;
  }
  const countText = prompt(`Berapa member test yang ditambah per titik ${mode === "langsung" ? root.name || root.id : "terbawah"}?`, "4");
  if (countText === null) return;
  const countPerLeaf = parsePositiveInteger(countText, 4);
  if (countPerLeaf > 500) {
    showToast("Maksimal 500 member per titik agar browser tetap responsif.");
    return;
  }
  const plannedCount = leaves.length * countPerLeaf;
  if (plannedCount > 5000) {
    showToast("Total tambahan terlalu besar untuk sekali proses. Batasi maksimal 5.000 member per batch.");
    return;
  }
  const pvText = prompt(`Isi PPV untuk setiap member test baru pada ${selectedMonthLabel()}.`, "6000");
  if (pvText === null) return;
  const testPpv = parsePvInput(pvText);
  if (!Number.isFinite(testPpv) || testPpv < 0) {
    showToast("PPV test tidak valid. Isi angka seperti 6000 atau 10000.");
    return;
  }
  const rankText = prompt(`Peringkat member test. Pilihan: ${ranks.map((rank) => rank.name).join(", ")}`, "Member");
  if (rankText === null) return;
  const selectedRank = ranks.find((rank) => sameText(rank.name, rankText))?.name || "Member";
  const stockistText = prompt("ID stokis untuk member baru. Kosongkan untuk mengikuti stokis sponsor/target.", "");
  if (stockistText === null) return;
  const forcedStockist = String(stockistText || "").trim();
  if (forcedStockist && !state.stockists.some((stockist) => stockist.id === forcedStockist)) {
    showToast("ID stokis tidak ditemukan. Kosongkan atau isi ID stokis yang valid.");
    return;
  }
  const prefixText = prompt("Prefix nama member test.", `Test ${root.name || root.id}`);
  if (prefixText === null) return;
  const namePrefix = String(prefixText || `Test ${root.name || root.id}`).trim() || `Test ${root.name || root.id}`;
  const passwordText = prompt("Sandi untuk member test baru.", "ascendia");
  if (passwordText === null) return;
  const password = String(passwordText || "ascendia");
  if (!confirm(`Target: ${root.name || root.id}. Mode ${mode}. Titik: ${leaves.length}. Tambah ${countPerLeaf} member per titik, total ${plannedCount} member. PV ${pv(testPpv)}, peringkat ${selectedRank}, stokis ${forcedStockist || "ikut sponsor/target"}. Lanjutkan?`)) return;

  const usedIds = new Set(state.members.map((member) => member.id));
  const newMembers = [];
  const draftMembers = [...state.members];
  leaves.forEach((leaf) => {
    for (let index = 1; index <= countPerLeaf; index += 1) {
      const id = nextTestMemberId(root.id, usedIds);
      const member = {
        id,
        name: `${namePrefix} ${String(newMembers.length + 1).padStart(3, "0")}`,
        email: "",
        phone: "",
        sponsor: leaf.id,
        parent: findAvailablePlacement(leaf.id, id, draftMembers),
        rank: selectedRank,
        manualRank: selectedRank !== "Member",
        renewalOverride: "",
        disabledBonuses: {},
        tupoDone: false,
        joinedAt: `${state.selectedMonth}-01`,
        ppv: 0,
        cpv: 0,
        tnpv: 0,
        atnpv: 0,
        gpv: 0,
        leftPv: 0,
        rightPv: 0,
        carry: 0,
        carryAge: 0,
        stockist: forcedStockist || leaf.stockist || root.stockist || state.stockists[0]?.id || "",
        password
      };
      draftMembers.push(member);
      newMembers.push(member);
    }
  });

  state.members.push(...newMembers);
  newMembers.forEach((member) => setPeriodPpv(member.id, testPpv));
  syncPersistentMemberProgress(state.selectedMonth);
  recomputeMetrics();
  saveState();
  clearSelections();
  render();
  const totalTeam = sponsorDescendantIds(root.id).length;
  showToast(`Selesai: ${leaves.length} titik x ${countPerLeaf} = ${newMembers.length} member test, PV ${pv(testPpv)}, rank ${selectedRank}. Total tim ${root.name || root.id} sekarang ${totalTeam} member.`, "success");
}

function openDialog(type, id = null) {
  editTarget = { type, id };
  const baseItem = id ? collection(type).find((entry) => entry.id === id) : blankItem(type);
  let item = (type === "omzet" || type === "member") && baseItem
    ? { ...baseItem, ppv: periodPpvForRevenuePeriod(baseItem.id, state.selectedMonth, state.revenuePeriod), tupoDone: periodTupoDone(baseItem.id) }
    : baseItem;
  if (type === "serverMember" && item) {
    item = {
      ...item,
      rankName: item.rank || item.rankName || "Member",
      newId: item.id,
      renewalFailed: Boolean(item.renewalFailed || item.active === false),
      password: id ? "" : item.password || "ascendia",
      sponsor: item.sponsor || "Pusat",
      parent: item.parent || "",
      stockist: item.stockist || "",
      ...Object.fromEntries(personalBonusTypes.map((type) => [type.field, personalBonusDisabled(item, type.key)]))
    };
  }
  if (type === "serverStockist" && item) item = { ...item, newId: item.id };
  if (type === "serverAdmin" && item) item = { ...item, newId: item.id };
  if (type === "member" && item) {
    item = {
      ...item,
      renewalStatus: item.renewalOverride === "active" ? "Aktif" : item.renewalOverride === "inactive" ? "Nonaktif" : "Otomatis",
      ...Object.fromEntries(personalBonusTypes.map((type) => [type.field, personalBonusDisabled(item, type.key)]))
    };
  }
  dialogTitle.textContent = type === "omzet" || type === "serverOmzet"
    ? `Input Omset PV - ${revenuePeriodLabel()}`
    : type === "serverMember"
      ? id ? "Edit Member" : "Tambah Member"
      : type === "serverStockist"
        ? id ? "Edit Stokis" : "Tambah Stokis"
        : type === "serverAdmin"
          ? id ? "Edit Admin" : "Tambah Admin"
          : type === "serverAnnouncement"
            ? id ? "Edit Pengumuman" : "Tambah Pengumuman"
      : id ? `Edit ${type}` : `Tambah ${type}`;
  dialogFields.innerHTML = fieldsFor(type).map((field) => `
    <label class="${field.wide ? "wide" : ""}">
      ${html(field.label)}
      ${field.type === "select"
        ? selectField(field, item[field.key])
        : field.type === "checkbox"
          ? `<input name="${attr(field.key)}" type="checkbox" value="true" ${item[field.key] ? "checked" : ""}>`
          : `<input name="${attr(field.key)}" value="${attr(item[field.key] ?? "")}" ${field.inputType ? `type="${attr(field.inputType)}"` : ""} ${field.readonly ? "readonly" : ""}>`}
    </label>
  `).join("");
  attachDialogFieldEvents();
  dialog.showModal();
}

function selectField(field, value) {
  return `<select name="${attr(field.key)}" data-field-key="${attr(field.key)}">${field.options.map((option) => {
    const optionValue = typeof option === "object" ? option.value : option;
    const optionLabel = typeof option === "object" ? option.label : option;
    return `<option value="${attr(optionValue)}" ${optionValue === value ? "selected" : ""}>${html(optionLabel)}</option>`;
  }).join("")}</select>`;
}

function stockistDistrictOptionsForDialog() {
  const source = editTarget?.type === "serverStockist" ? serverMasterPages.stockists.rows : state.stockists;
  const current = editTarget?.id ? source.find((item) => item.id === editTarget.id) : null;
  const area = current?.area || (state.activeRole === "branch" ? currentUser().area : indonesiaAreas[0]);
  return districtOptionsForArea(area, current?.district);
}

function updateDistrictOptionsForArea(areaValue) {
  const districtSelect = dialogFields.querySelector('[name="district"]');
  if (!districtSelect) return;
  const previous = districtSelect.value;
  const options = districtOptionsForArea(areaValue, previous);
  districtSelect.innerHTML = options
    .map((option) => `<option value="${attr(option)}" ${option === previous ? "selected" : ""}>${html(option)}</option>`)
    .join("");
  if (!options.includes(previous)) districtSelect.value = options[0] || "";
}

function attachDialogFieldEvents() {
  const areaSelect = dialogFields.querySelector('[name="area"]');
  if (!areaSelect || !["stockist", "serverStockist"].includes(editTarget?.type)) return;
  areaSelect.addEventListener("change", () => updateDistrictOptionsForArea(areaSelect.value));
}

function nextNumericMemberIdFromRows(rows = state.members) {
  const usedIds = new Set(rows.map((member) => String(member.id || "")));
  const maxNumber = rows.reduce((max, member) => {
    const id = String(member.id || "").trim();
    return /^\d+$/.test(id) ? Math.max(max, Number(id)) : max;
  }, 0);
  let nextNumber = maxNumber + 1;
  let candidate = String(nextNumber).padStart(6, "0");
  while (usedIds.has(candidate)) {
    nextNumber += 1;
    candidate = String(nextNumber).padStart(6, "0");
  }
  return candidate;
}

async function nextServerMemberId() {
  if (!apiConnected()) return nextNumericMemberIdFromRows();
  try {
    const result = await apiRequest("/api/members/next-id");
    return String(result.id || "").trim() || nextNumericMemberIdFromRows(serverMembersPage.rows);
  } catch (error) {
    showToast("ID otomatis belum bisa dimuat dari server, memakai nomor cadangan.");
    return nextNumericMemberIdFromRows(serverMembersPage.rows.length ? serverMembersPage.rows : state.members);
  }
}

function nextMemberId() {
  const usedIds = new Set(state.members.map((member) => String(member.id || "")));
  const lastId = String(state.members.at(-1)?.id || "").trim();
  const numericMatch = lastId.match(/^(\d+)$/);
  const prefixedMatch = lastId.match(/^([A-Za-z]+-)(\d+)$/);

  const candidateFrom = (prefix, numberText) => {
    let nextNumber = Number(numberText) + 1;
    let candidate = `${prefix}${String(nextNumber).padStart(numberText.length, "0")}`;
    while (usedIds.has(candidate)) {
      nextNumber += 1;
      candidate = `${prefix}${String(nextNumber).padStart(numberText.length, "0")}`;
    }
    return candidate;
  };

  if (numericMatch) return candidateFrom("", numericMatch[1]);
  if (prefixedMatch) return candidateFrom(prefixedMatch[1], prefixedMatch[2]);

  const maxAscNumber = state.members.reduce((max, member) => {
    const match = String(member.id || "").match(/^ASC-(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 1000);
  return candidateFrom("ASC-", String(maxAscNumber).padStart(4, "0"));
}

function fieldsFor(type) {
  if (type === "serverStockist") return [
    { key: "id", label: "ID Stokis", readonly: Boolean(editTarget?.id) },
    { key: "newId", label: "Ubah ID Stokis", adminOnly: true, editOnly: true },
    { key: "name", label: "Nama" },
    { key: "email", label: "Email", inputType: "email" },
    { key: "phone", label: "Nomor HP" },
    { key: "area", label: "Provinsi Cabang", type: "select", options: state.activeRole === "branch" ? [currentUser().area] : indonesiaAreas },
    { key: "district", label: "Daerah / Kabupaten / Kota", type: "select", options: stockistDistrictOptionsForDialog() },
    { key: "feeRate", label: "Fee (%)", inputType: "number" },
    { key: "password", label: "Sandi Baru" }
  ].filter((field) => (!field.adminOnly || state.activeRole === "admin") && (!field.editOnly || editTarget?.id));
  if (type === "serverAdmin") return [
    { key: "id", label: "ID Admin", readonly: Boolean(editTarget?.id) },
    { key: "newId", label: "Ubah ID Admin", adminOnly: true, editOnly: true },
    { key: "name", label: "Nama" },
    { key: "email", label: "Email", inputType: "email" },
    { key: "phone", label: "Nomor HP" },
    { key: "role", label: "Role", type: "select", options: ["Admin Pusat", "Admin Cabang"] },
    { key: "area", label: "Lokasi Akses", type: "select", options: adminAreaOptions },
    { key: "password", label: "Sandi Baru" }
  ].filter((field) => (!field.adminOnly || state.activeRole === "admin") && (!field.editOnly || editTarget?.id));
  if (type === "serverAnnouncement") return [
    { key: "id", label: "ID Pengumuman", readonly: Boolean(editTarget?.id) },
    { key: "title", label: "Judul" },
    { key: "date", label: "Tanggal", inputType: "date" },
    { key: "audience", label: "Untuk" },
    { key: "status", label: "Status", type: "select", options: ["Aktif", "Draft", "Selesai"] },
    { key: "body", label: "Isi Pengumuman", wide: true }
  ];
  if (type === "serverOmzet") return [
    { key: "id", label: "ID Member", readonly: true },
    { key: "name", label: "Nama Member", readonly: true },
    { key: "ppv", label: "PV Omset", inputType: "number" }
  ];
  if (type === "serverMember") {
    const fields = [
      { key: "id", label: "ID Member", readonly: Boolean(editTarget?.id) },
      { key: "newId", label: "Ubah ID Member", adminOnly: true, editOnly: true },
      { key: "name", label: "Nama" },
      { key: "email", label: "Email", inputType: "email" },
      { key: "phone", label: "Nomor HP" },
      { key: "sponsor", label: "ID Sponsor" },
      { key: "parent", label: "Placement ID" },
      { key: "stockist", label: "ID Stokis" },
      { key: "rankName", label: "Peringkat", type: "select", options: ranks.map((rank) => rank.name), adminOnly: true },
      { key: "renewalFailed", label: "Nonaktifkan Member", type: "checkbox", adminOnly: true },
      ...personalBonusTypes.map((type) => ({ key: type.field, label: `Nonaktifkan ${type.label}`, type: "checkbox", adminOnly: true })),
      { key: "ppv", label: "PV Awal", inputType: "number" },
      { key: "password", label: "Sandi" }
    ];
    return fields.filter((field) => {
      if (state.activeRole === "stockist" && field.key === "stockist") return false;
      if (field.adminOnly && state.activeRole !== "admin") return false;
      if (field.editOnly && !editTarget?.id) return false;
      return true;
    });
  }
  if (type === "omzet") return [
    { key: "id", label: "ID Member", readonly: true },
    { key: "name", label: "Nama Member", readonly: true },
    { key: "ppv", label: "PPV Bulan Ini", inputType: "number" }
  ];
  if (type === "member") {
    const stockistOptions = state.stockists
      .filter((item) => state.activeRole !== "branch" || branchCanAccessArea(item.area))
      .map((item) => item.id);
    const fields = [
    { key: "id", label: "ID Member" },
    { key: "name", label: "Nama" },
    { key: "email", label: "Email", inputType: "email" },
    { key: "phone", label: "Nomor HP" },
    { key: "joinedAt", label: "Tanggal Bergabung", inputType: "date" },
    { key: "sponsor", label: "ID Sponsor" },
    { key: "parent", label: "Placement ID (maks. 2 kaki langsung)" },
    { key: "ppv", label: "PPV", inputType: "number" },
    { key: "stockist", label: "Stokis", type: "select", options: stockistOptions },
    { key: "rank", label: "Peringkat Saat Ini", type: "select", options: ranks.map((rank) => rank.name), adminOnly: true },
    { key: "manualRank", label: "Rank Khusus", type: "checkbox", adminOnly: true },
    { key: "renewalStatus", label: "Status Renewal Member", type: "select", options: ["Otomatis", "Aktif", "Nonaktif"], adminOnly: true },
    ...personalBonusTypes.map((type) => ({ key: type.field, label: `Nonaktifkan ${type.label}`, type: "checkbox", adminOnly: true })),
    { key: "tupoDone", label: "TUPO Khusus", type: "checkbox", adminOnly: true },
    { key: "password", label: "Sandi" }
    ];
    if (state.activeRole === "stockist") {
      return fields.filter((field) => !field.adminOnly && field.key !== "stockist" && (editTarget?.id || field.key !== "id"));
    }
    return state.activeRole === "admin" ? fields : fields.filter((field) => !field.adminOnly);
  }
  if (type === "stockist") return [
    { key: "id", label: "ID Stokis" },
    { key: "name", label: "Nama" },
    { key: "email", label: "Email", inputType: "email" },
    { key: "phone", label: "Nomor HP" },
    { key: "area", label: "Provinsi Cabang", type: "select", options: state.activeRole === "branch" ? [currentUser().area] : indonesiaAreas },
    { key: "district", label: "Daerah / Kabupaten / Kota", type: "select", options: stockistDistrictOptionsForDialog() },
    { key: "feeRate", label: "Fee (%)", inputType: "number" },
    { key: "password", label: "Sandi" }
  ];
  if (type === "announcement") return [
    { key: "id", label: "ID Pengumuman" },
    { key: "title", label: "Judul" },
    { key: "date", label: "Tanggal", inputType: "date" },
    { key: "audience", label: "Untuk" },
    { key: "status", label: "Status", type: "select", options: ["Aktif", "Draft", "Selesai"] },
    { key: "body", label: "Isi Pengumuman", wide: true }
  ];
  
  return [
    { key: "id", label: "ID Admin" },
    { key: "name", label: "Nama" },
    { key: "email", label: "Email", inputType: "email" },
    { key: "phone", label: "Nomor HP" },
    { key: "role", label: "Role", type: "select", options: ["Admin Pusat", "Admin Cabang"] },
    { key: "area", label: "Lokasi Akses", type: "select", options: adminAreaOptions },
    { key: "password", label: "Sandi" }
  ].filter((field) => state.activeRole !== "branch" || !["role", "area"].includes(field.key));
}

function blankItem(type) {
  if (type === "serverStockist") {
    const area = state.activeRole === "branch" ? currentUser().area : indonesiaAreas[0];
    return { id: `STK-${Math.floor(100 + Math.random() * 899)}`, name: "", email: "", phone: "", area, district: districtOptionsForArea(area)[0] || "", feeRate: 5, password: "ascendia" };
  }
  if (type === "serverAdmin") return { id: `CAB-${Math.floor(100 + Math.random() * 899)}`, name: "", email: "", phone: "", role: "Admin Cabang", area: indonesiaAreas[0], password: "ascendia" };
  if (type === "serverAnnouncement") return { id: `ANN-${Math.floor(100 + Math.random() * 899)}`, title: "", date: `${state.selectedMonth}-01`, audience: "Semua Member", status: "Aktif", body: "" };
  if (type === "serverMember") {
    const stockist = state.activeRole === "stockist"
      ? state.activeId
      : state.stockists.find((item) => state.activeRole !== "branch" || branchCanAccessArea(item.area))?.id || state.stockists[0]?.id || "";
    const id = pendingServerMemberId || nextNumericMemberIdFromRows(serverMembersPage.rows.length ? serverMembersPage.rows : state.members);
    pendingServerMemberId = "";
    return { id, name: "", email: "", phone: "", sponsor: "Pusat", parent: "", stockist, ppv: 0, password: "ascendia" };
  }
  if (type === "member") {
    const stockist = state.activeRole === "stockist"
      ? state.activeId
      : state.stockists.find((item) => state.activeRole !== "branch" || branchCanAccessArea(item.area))?.id || state.stockists[0]?.id || "";
    return { id: nextMemberId(), name: "", email: "", phone: "", rank: "Member", manualRank: false, renewalOverride: "", disabledBonuses: {}, tupoDone: false, joinedAt: `${state.selectedMonth}-01`, sponsor: "", parent: "", ppv: 0, cpv: 0, tnpv: 0, atnpv: 0, gpv: 0, leftPv: 0, rightPv: 0, carry: 0, carryAge: 0, stockist, password: "ascendia" };
  }
  if (type === "stockist") {
    const area = state.activeRole === "branch" ? currentUser().area : indonesiaAreas[0];
    return { id: `STK-${Math.floor(100 + Math.random() * 899)}`, name: "", email: "", phone: "", area, district: districtOptionsForArea(area)[0] || "", feeRate: 5, password: "ascendia" };
  }
  if (type === "announcement") return { id: `ANN-${Math.floor(100 + Math.random() * 899)}`, title: "", date: `${state.selectedMonth}-01`, audience: "Semua Member", status: "Aktif", body: "" };
  return { id: `CAB-${Math.floor(100 + Math.random() * 899)}`, name: "", email: "", phone: "", role: "Admin Cabang", area: indonesiaAreas[0], password: "ascendia" };
}

function collection(type) {
  if (type === "serverStockist") return serverMasterPages.stockists.rows;
  if (type === "serverAdmin") return serverMasterPages.admins.rows;
  if (type === "serverAnnouncement") return serverMasterPages.announcements.rows;
  if (type === "serverMember" || type === "serverOmzet") return serverMembersPage.rows;
  if (type === "member" || type === "omzet") return state.members;
  if (type === "stockist") return state.stockists;
  if (type === "announcement") return state.announcements;
  return state.admins;
}

function validateDialogData(data) {
  const type = editTarget.type;
  const list = collection(type);
  const currentId = String(data.id || editTarget.id || "").trim();

  if (type !== "omzet") {
    if (!currentId) return "ID wajib terisi.";
    if (currentId.includes(":")) return "ID tidak boleh memakai tanda titik dua (:).";
    const duplicate = list.some((item) => item.id === currentId && item.id !== editTarget.id);
    if (duplicate) return `ID ${currentId} sudah dipakai.`;
  }

  if ((type === "member" || type === "omzet") && Number(data.ppv || 0) < 0) {
    return "PPV tidak boleh minus.";
  }

  if (type === "admin") {
    if (!String(data.name || "").trim()) return "Nama admin wajib diisi.";
    data.area = normalizeAreaName(data.area);
    if (data.role === "Admin Cabang" && (!data.area || data.area === "Pusat")) {
      return "Admin Cabang wajib memilih lokasi akses cabang.";
    }
    if (data.role === "Admin Pusat") data.area = "Pusat";
  }

  if (type === "stockist") {
    if (!String(data.name || "").trim()) return "Nama stokis wajib diisi.";
    data.area = normalizeAreaName(data.area);
    data.district = String(data.district || "").trim();
    if (!indonesiaAreas.some((area) => sameArea(area, data.area))) return "Lokasi stokis wajib memilih provinsi Indonesia.";
    if (state.activeRole === "branch" && !branchCanAccessArea(data.area)) return "Admin cabang hanya bisa membuat stokis di provinsi cabangnya.";
    if (!data.district) return "Daerah/Kabupaten/Kota stokis wajib dipilih.";
  }

  if (type === "member") {
    if (!String(data.name || "").trim()) return "Nama member wajib diisi.";
    const selectedStockist = state.stockists.find((stockist) => stockist.id === data.stockist);
    if (!selectedStockist) return "Stokis member wajib dipilih.";
    if (state.activeRole === "branch" && !branchCanAccessArea(selectedStockist.area)) {
      return "Admin cabang hanya bisa memilih stokis di lokasi cabangnya.";
    }
    const sponsorId = String(data.sponsor || "").trim() || (state.activeRole === "stockist" ? "" : "Pusat");
    const rawPlacementId = String(data.parent || "").trim();
    const placementId = isRootSponsor(rawPlacementId) ? "" : rawPlacementId;
    const sponsorExists = isRootSponsor(sponsorId) || state.members.some((member) => member.id === sponsorId);
    const placementExists = !placementId || state.members.some((member) => member.id === placementId);

    if (!sponsorId) return "ID Sponsor wajib diisi.";
    if (state.activeRole === "stockist" && isRootSponsor(sponsorId)) return "Stokis wajib mengisi ID Sponsor member yang sudah ada.";
    if (!sponsorExists) return `ID Sponsor ${sponsorId} tidak ditemukan.`;
    if ((!isRootSponsor(sponsorId) && sponsorId === currentId) || relationCreatesCycle(sponsorId, currentId, "sponsor")) return "ID Sponsor tidak valid karena membuat perputaran jaringan sponsor.";
    if (!placementExists) return `Placement ID ${placementId} tidak ditemukan.`;
    if (placementId && (placementId === currentId || relationCreatesCycle(placementId, currentId, "parent"))) return "Placement ID tidak valid karena membuat perputaran placement.";
  }

  return "";
}

async function saveServerDialog(data) {
  if (editTarget.type === "serverOmzet") {
    const pvAmount = Number(data.ppv || 0);
    if (!editTarget.id || pvAmount < 0) {
      showToast("PV tidak valid.");
      return;
    }
    await apiRequest(`/api/periods/${encodeURIComponent(state.selectedMonth)}/input-ppv`, {
      method: "POST",
      body: JSON.stringify({
        memberId: editTarget.id,
        pv: pvAmount
      })
    });
    dialog.close();
    resetServerMembersPagination();
    resetServerRevenuePagination();
    resetServerTupoPagination();
    resetServerTrees();
    serverDashboardSummary.key = "";
    serverBonusPage.loadedKey = "";
    serverStockistPayouts.key = "";
    serverCompanyFunds.key = "";
    render();
    showToast(`PV bulan ${selectedMonthLabel()} disimpan menjadi ${pv(pvAmount)}.`, "success");
    return;
  }

  if (editTarget.type === "serverMember") {
    const payload = {
      id: String(data.id || "").trim(),
      name: String(data.name || "").trim(),
      email: data.email || null,
      phone: data.phone || null,
      sponsorId: String(data.sponsor || "").trim() || "Pusat",
      placementParentId: String(data.parent || "").trim() || null,
      stockistId: state.activeRole === "stockist" ? state.activeId : String(data.stockist || "").trim(),
      password: String(data.password || "ascendia"),
      rankName: state.activeRole === "admin" && ranks.some((rank) => rank.name === data.rankName) ? data.rankName : "Member"
    };
    if (state.activeRole === "admin") {
      payload.newId = String(data.newId || data.id || "").trim();
      payload.renewalFailed = Boolean(data.renewalFailed);
      payload.active = !payload.renewalFailed;
      personalBonusTypes.forEach((type) => {
        payload[type.field] = Boolean(data[type.field]);
      });
    }
    if (!payload.id || !payload.name || !payload.sponsorId || !payload.stockistId) {
      showToast("ID, nama, sponsor, dan stokis wajib diisi.");
      return;
    }
    if (Number(data.ppv || 0) < 0) {
      showToast("PV awal tidak boleh minus.");
      return;
    }
    let savedMemberId = editTarget.id || payload.id;
    if (editTarget.id) {
      const updatePayload = { ...payload };
      delete updatePayload.id;
      if (!updatePayload.newId || updatePayload.newId === editTarget.id) delete updatePayload.newId;
      if (state.activeRole !== "admin" || !updatePayload.rankName) delete updatePayload.rankName;
      if (state.activeRole !== "admin") {
        delete updatePayload.active;
        delete updatePayload.renewalFailed;
        delete updatePayload.newId;
      }
      if (!String(data.password || "").trim()) delete updatePayload.password;
      await apiRequest(`/api/members/${encodeURIComponent(editTarget.id)}`, {
        method: "PATCH",
        body: JSON.stringify(updatePayload)
      });
      savedMemberId = updatePayload.newId || editTarget.id;
    } else {
      const createdMember = await apiRequest("/api/members", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      savedMemberId = createdMember?.id || payload.id;
    }
    if (!editTarget.id && Number(data.ppv || 0) > 0) {
      await apiRequest(`/api/periods/${encodeURIComponent(state.selectedMonth)}/input-ppv`, {
        method: "POST",
        body: JSON.stringify({
          memberId: savedMemberId,
          pv: Number(data.ppv || 0)
        })
      });
    }
    dialog.close();
    resetServerMembersPagination();
    resetServerRevenuePagination();
    resetServerTupoPagination();
    resetServerTrees();
    resetServerBonusPage();
    serverDashboardSummary.key = "";
    serverStockistPayouts.key = "";
    serverCompanyFunds.key = "";
    render();
    showToast(editTarget.id ? "Member berhasil diperbarui." : "Member berhasil ditambahkan.", "success");
  }
}

function serverMasterTypeInfo(dialogType) {
  return {
    serverStockist: { list: "stockists", endpoint: "/api/stockists", label: "Stokis" },
    serverAdmin: { list: "admins", endpoint: "/api/admins", label: "Admin" },
    serverAnnouncement: { list: "announcements", endpoint: "/api/announcements", label: "Pengumuman" }
  }[dialogType];
}

async function saveServerMasterDialog(data) {
  const info = serverMasterTypeInfo(editTarget.type);
  if (!info) return false;
  const id = String(data.id || editTarget.id || "").trim();
  if (!id) {
    showToast("ID wajib diisi.");
    return true;
  }

  let payload = {};
  if (editTarget.type === "serverStockist") {
    payload = {
      id,
      newId: state.activeRole === "admin" ? String(data.newId || id).trim() : undefined,
      name: String(data.name || "").trim(),
      email: data.email || null,
      phone: data.phone || null,
      area: state.activeRole === "branch" ? currentUser().area : String(data.area || "").trim(),
      district: String(data.district || "").trim(),
      feeRate: Number(data.feeRate || 0),
      password: String(data.password || "")
    };
    if (!payload.name || !payload.area || !payload.district) {
      showToast("Nama, provinsi, dan daerah stokis wajib diisi.");
      return true;
    }
  }
  if (editTarget.type === "serverAdmin") {
    payload = {
      id,
      newId: state.activeRole === "admin" ? String(data.newId || id).trim() : undefined,
      name: String(data.name || "").trim(),
      email: data.email || null,
      phone: data.phone || null,
      role: data.role || "Admin Cabang",
      area: data.role === "Admin Pusat" ? "Pusat" : String(data.area || "").trim(),
      password: String(data.password || "")
    };
    if (!payload.name || !payload.role || !payload.area) {
      showToast("Nama, role, dan lokasi admin wajib diisi.");
      return true;
    }
  }
  if (editTarget.type === "serverAnnouncement") {
    payload = {
      id,
      title: String(data.title || "").trim(),
      date: data.date || `${state.selectedMonth}-01`,
      audience: data.audience || "Semua Member",
      status: data.status || "Aktif",
      body: data.body || ""
    };
    if (!payload.title) {
      showToast("Judul pengumuman wajib diisi.");
      return true;
    }
  }

  if (editTarget.id) {
    const updatePayload = { ...payload };
    delete updatePayload.id;
    if (!updatePayload.newId || updatePayload.newId === editTarget.id) delete updatePayload.newId;
    if (Object.prototype.hasOwnProperty.call(updatePayload, "password") && !String(updatePayload.password || "").trim()) delete updatePayload.password;
    await apiRequest(`${info.endpoint}/${encodeURIComponent(editTarget.id)}`, {
      method: "PATCH",
      body: JSON.stringify(updatePayload)
    });
  } else {
    if (Object.prototype.hasOwnProperty.call(payload, "password") && !String(payload.password || "").trim()) payload.password = "ascendia";
    await apiRequest(info.endpoint, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  dialog.close();
  resetServerListPagination(info.list);
  if (editTarget.type === "serverStockist") {
    resetServerMembersPagination();
    resetServerRevenuePagination();
    resetServerTupoPagination();
    resetServerTrees();
    resetServerBonusPage();
    serverDashboardSummary.key = "";
    serverStockistPayouts.key = "";
    serverCompanyFunds.key = "";
  }
  render();
  showToast(`${info.label} berhasil disimpan.`, "success");
  return true;
}

async function archiveServerMember(memberId) {
  if (!confirm(`Hapus permanen member ${memberId}? Data PV, bonus, pembayaran, dan metrik member ini akan ikut dihapus.`)) return;
  try {
    await apiRequest(`/api/members/${encodeURIComponent(memberId)}`, { method: "DELETE" });
    resetServerMembersPagination();
    resetServerRevenuePagination();
    resetServerTupoPagination();
    resetServerTrees();
    resetServerBonusPage();
    serverDashboardSummary.key = "";
    serverStockistPayouts.key = "";
    serverCompanyFunds.key = "";
    render();
    showToast("Member berhasil dihapus permanen.", "success");
  } catch (error) {
    showToast(error.message || "Member gagal dihapus.");
  }
}

async function archiveSelectedServerMembers() {
  const ids = [...selectedSet("member")];
  if (!ids.length) return;
  if (!confirm(`Hapus permanen ${ids.length} member terpilih? Data PV, bonus, pembayaran, dan metrik member ini akan ikut dihapus.`)) return;
  try {
    for (const id of ids) {
      await apiRequest(`/api/members/${encodeURIComponent(id)}`, { method: "DELETE" });
    }
    selectedSet("member").clear();
    resetServerMembersPagination();
    resetServerRevenuePagination();
    resetServerTupoPagination();
    resetServerTrees();
    resetServerBonusPage();
    serverDashboardSummary.key = "";
    serverStockistPayouts.key = "";
    serverCompanyFunds.key = "";
    render();
    showToast(`${ids.length} member berhasil dihapus permanen.`, "success");
  } catch (error) {
    showToast(error.message || "Member terpilih gagal dihapus.");
  }
}

async function updateServerMemberStatus(memberId, active) {
  const message = active
    ? `Aktifkan kembali member ${memberId}?`
    : `Nonaktifkan member ${memberId}? Di struktur akan tampil sebagai Failure of renewal dan tidak bisa login.`;
  if (!confirm(message)) return;
  try {
    await apiRequest(`/api/members/${encodeURIComponent(memberId)}`, {
      method: "PATCH",
      body: JSON.stringify({ active, renewalFailed: !active })
    });
    resetServerMembersPagination();
    resetServerRevenuePagination();
    resetServerTupoPagination();
    resetServerTrees();
    resetServerBonusPage();
    serverDashboardSummary.key = "";
    serverStockistPayouts.key = "";
    serverCompanyFunds.key = "";
    render();
    showToast(active ? "Member berhasil diaktifkan." : "Member berhasil dinonaktifkan.", "success");
  } catch (error) {
    showToast(error.message || "Status member gagal disimpan.");
  }
}

async function updateServerTupo(memberId, checked) {
  try {
    await apiRequest(`/api/members/${encodeURIComponent(memberId)}/tupo`, {
      method: "PATCH",
      body: JSON.stringify({ checked })
    });
    serverTupoPage.loadedKey = "";
    serverMembersPage.loadedKey = "";
    render();
    showToast(checked ? "TUPO berhasil diceklis." : "TUPO dikosongkan.", "success");
  } catch (error) {
    showToast(error.message || "TUPO gagal disimpan.");
    serverTupoPage.loadedKey = "";
    render();
  }
}

async function archiveServerMaster(type, id) {
  const config = serverMasterConfig(type);
  const label = { stockists: "stokis", admins: "admin", announcements: "pengumuman" }[type] || "data";
  if (!config || !confirm(`Arsipkan ${label} ${id}? Data tidak dihapus permanen, hanya tidak tampil di daftar aktif.`)) return;
  try {
    await apiRequest(`${config.endpoint}/${encodeURIComponent(id)}`, { method: "DELETE" });
    resetServerListPagination(type);
    render();
    showToast(`${label} berhasil diarsipkan.`, "success");
  } catch (error) {
    showToast(error.message || `${label} gagal diarsipkan.`);
  }
}

async function saveDialog() {
  const data = Object.fromEntries(new FormData(editForm).entries());
  fieldsFor(editTarget.type).forEach((field) => {
    if (field.inputType === "number") data[field.key] = Number(data[field.key] || 0);
    if (field.type === "checkbox") data[field.key] = data[field.key] === "true";
  });
  if (editTarget.type === "serverOmzet" || editTarget.type === "serverMember") {
    try {
      await saveServerDialog(data);
    } catch (error) {
      showToast(error.message || "Data gagal disimpan.");
    }
    return;
  }
  if (["serverStockist", "serverAdmin", "serverAnnouncement"].includes(editTarget.type)) {
    try {
      await saveServerMasterDialog(data);
    } catch (error) {
      showToast(error.message || "Data gagal disimpan.");
    }
    return;
  }
  if (editTarget.type === "omzet") {
    const member = state.members.find((item) => item.id === editTarget.id);
    if (!member) {
      showToast("Member tidak ditemukan.");
      return;
    }
    setPeriodPpv(member.id, data.ppv, state.selectedMonth, state.revenuePeriod);
    syncPersistentMemberProgress(state.selectedMonth);
    saveState();
    dialog.close();
    showToast(`PPV ${revenuePeriodLabel()} ${selectedMonthLabel()} berhasil disimpan.`, "success");
    render();
    return;
  }
  if (editTarget.type === "member" && state.activeRole === "stockist" && !editTarget.id) {
    data.id = nextMemberId();
    data.stockist = state.activeId;
    data.rank = "Member";
    data.manualRank = false;
    data.disabledBonuses = {};
  }
  const errorMessage = validateDialogData(data);
  if (errorMessage) {
    showToast(errorMessage);
    return;
  }
  if (editTarget.type === "member") {
    data._periodPpv = Number(data.ppv || 0);
    data.ppv = 0;
    if (state.activeRole === "admin") {
      data._periodTupoDone = Boolean(data.tupoDone);
      data.tupoDone = false;
      data.renewalOverride = data.renewalStatus === "Aktif" ? "active" : data.renewalStatus === "Nonaktif" ? "inactive" : "";
      delete data.renewalStatus;
      data.disabledBonuses = Object.fromEntries(personalBonusTypes.map((type) => [type.key, Boolean(data[type.field])]));
      personalBonusTypes.forEach((type) => delete data[type.field]);
      data.bonusDisabled = false;
      const currentMemberData = editTarget.id ? state.members.find((member) => member.id === editTarget.id) : null;
      const selectedRank = ranks.some((rank) => rank.name === data.rank) ? data.rank : "Member";
      data.manualRank = Boolean(data.manualRank) || Boolean(currentMemberData && selectedRank !== currentMemberData.rank);
      data.rank = ranks.some((rank) => rank.name === data.rank) ? data.rank : "Member";
      if (!data.manualRank && editTarget.id) {
        data.rank = currentMemberData?.rank || data.rank;
      }
    } else {
      const currentMemberData = editTarget.id ? state.members.find((member) => member.id === editTarget.id) : null;
      data.disabledBonuses = currentMemberData ? normalizeDisabledBonuses(currentMemberData) : {};
      data.renewalOverride = currentMemberData?.renewalOverride || "";
      data.bonusDisabled = false;
      delete data.renewalStatus;
      personalBonusTypes.forEach((type) => delete data[type.field]);
    }
    data.sponsor = String(data.sponsor || "").trim() || (state.activeRole === "stockist" ? "" : "Pusat");
    if (isRootSponsor(data.sponsor)) data.sponsor = "Pusat";
    const sponsorId = data.sponsor;
    const rawPlacementId = String(data.parent || "").trim();
    const placementId = isRootSponsor(rawPlacementId) ? "" : rawPlacementId;
    if (isRootSponsor(rawPlacementId)) data.parent = "";
    const sponsorExists = isRootSponsor(sponsorId) || state.members.some((member) => member.id === sponsorId);
    const placementExists = state.members.some((member) => member.id === placementId);
    if (!placementId && sponsorExists && !isRootSponsor(sponsorId)) data.parent = findAvailablePlacement(sponsorId, editTarget.id);
    if (placementId && placementExists) data.parent = findAvailablePlacement(placementId, editTarget.id);
    if (placementId && !data.parent) {
      showToast("Placement penuh atau tidak bisa dipakai. Pilih Placement ID lain.");
      return;
    }
  }
  if (data.parent === "") data.parent = null;
  const list = collection(editTarget.type);
  const index = list.findIndex((item) => item.id === editTarget.id);
  if (editTarget.type === "member" && index < 0) removePeriodDataForMembers([data.id]);
  if (index >= 0) list[index] = { ...list[index], ...data };
  else list.push(data);
  if (editTarget.type === "member") {
    const memberId = data.id || editTarget.id;
    setPeriodPpv(memberId, data._periodPpv, state.selectedMonth, state.revenuePeriod);
    if (state.activeRole === "admin") {
      if (data._periodTupoDone) setPeriodTupoDone(memberId, true);
      else clearPeriodTupoOverride(memberId);
    }
    const savedMember = list.find((item) => item.id === memberId);
    if (savedMember) delete savedMember._periodPpv;
    if (savedMember) delete savedMember._periodTupoDone;
    syncPersistentMemberProgress(state.selectedMonth);
  }
  delete data._periodPpv;
  delete data._periodTupoDone;
  if (editTarget.id === state.activeId && data.id) state.activeId = data.id;
  recomputeMetrics();
  saveState();
  dialog.close();
  showToast("Data berhasil disimpan.", "success");
  render();
}

function deleteItem(type, id) {
  if (type === "admin" && id === state.activeId) {
    showToast("Admin yang sedang login tidak bisa dihapus.");
    return;
  }
  const confirmMessage = type === "member"
    ? `Hapus member ${id}? Data akan masuk ke Member Terhapus dan masih bisa dipulihkan.`
    : `Hapus data ${id}? Data akan masuk ke daftar terhapus dan masih bisa dipulihkan.`;
  if (!confirm(confirmMessage)) return;
  const listName = type === "member" ? "members" : type === "stockist" ? "stockists" : type === "announcement" ? "announcements" : "admins";
  if (type === "member") {
    archiveDeletedMembers([id]);
    removePeriodDataForMembers([id]);
  } else {
    archiveDeletedItems(type, [id]);
  }
  state[listName] = state[listName].filter((item) => item.id !== id);
  selectedSet(type).delete(id);
  recomputeMetrics();
  saveState();
  showToast(type === "member" ? "Member dipindahkan ke Member Terhapus. Bisa dipulihkan jika salah hapus." : "Data dipindahkan ke daftar terhapus. Bisa dipulihkan jika salah hapus.", "success");
  render();
}

function deleteSelectedItems(type) {
  const ids = [...selectedSet(type)];
  if (!ids.length) return;
  if (type === "admin" && ids.includes(state.activeId)) {
    showToast("Admin yang sedang login tidak bisa ikut dihapus.");
    return;
  }
  const confirmMessage = type === "member"
    ? `Hapus ${ids.length} member terpilih? Data akan masuk ke Member Terhapus dan masih bisa dipulihkan.`
    : `Hapus ${ids.length} data terpilih? Data akan masuk ke daftar terhapus dan masih bisa dipulihkan.`;
  if (!confirm(confirmMessage)) return;
  const listName = type === "member" ? "members" : type === "stockist" ? "stockists" : type === "announcement" ? "announcements" : "admins";
  if (type === "member") {
    archiveDeletedMembers(ids);
    removePeriodDataForMembers(ids);
  } else {
    archiveDeletedItems(type, ids);
  }
  state[listName] = state[listName].filter((item) => !ids.includes(item.id));
  selectedSet(type).clear();
  recomputeMetrics();
  saveState();
  showToast(type === "member" ? `${ids.length} member dipindahkan ke Member Terhapus.` : `${ids.length} data dipindahkan ke daftar terhapus.`, "success");
  render();
}

const views = {
  dashboard: dashboardView,
  memberHome: memberHomeView,
  members: membersView,
  tupo: tupoView,
  stockists: stockistsView,
  payouts: payoutsView,
  admins: adminsView,
  network: networkView,
  placement: placementView,
  revenue: revenueView,
  bonuses: bonusesView,
  bonusControl: bonusControlView,
  forfeitures: forfeituresView,
  announcements: announcementsView,
  rules: rulesView,
  settings: settingsView
};

document.querySelector("#loginBtn").addEventListener("click", login);
loginBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") login();
});
resetDataBtn.addEventListener("click", () => {
  if (!isAuthenticated) {
    showToast("Silakan login sebelum reset data.");
    return;
  }
  if (!canManageSystemData()) {
    showToast("Reset data hanya bisa dilakukan akses pusat.");
    return;
  }
  if (!confirm("Reset semua data ke contoh awal? Backup data lama terlebih dulu jika masih diperlukan.")) return;
  state = structuredClone(defaultState);
  recomputeMetrics();
  clearSelections();
  saveState();
  activeView = "dashboard";
  render();
  showToast("Data contoh berhasil dipulihkan.", "success");
});
exportDataBtn.addEventListener("click", exportData);
importDataBtn.addEventListener("click", () => {
  if (!canManageSystemData()) {
    showToast("Import data hanya bisa dilakukan akses pusat.");
    return;
  }
  importDataInput.click();
});
importDataInput.addEventListener("change", () => importData(importDataInput.files[0]));
logoutBtn.addEventListener("click", logout);
editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveDialog();
});
document.querySelector("[data-close-dialog]").addEventListener("click", () => dialog.close());

render();
