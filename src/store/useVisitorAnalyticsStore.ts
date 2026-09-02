import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimeFilter = 'live' | 'today' | 'week' | 'month' | 'all';
export type DeviceType = 'Mobile' | 'Desktop' | 'Tablet';
export type SessionStatus = 'active' | 'idle' | 'blocked' | 'bot' | 'bounced';
export type KpiFilterType = 'all' | 'live' | 'pageviews' | 'duration' | 'bounced' | 'cart';
export type GeoPolicyMode = 'global' | 'domestic_only';

export interface VisitorSession {
  id: string;
  ip: string;
  customerName?: string;
  contactPhone?: string;
  country: string;
  countryCode: string;
  city: string;
  flag: string;
  isp: string;
  device: DeviceType;
  deviceModel: string;
  browser: string;
  os: string;
  currentUrl: string;
  referrer: string;
  durationSeconds: number;
  pageviews: number;
  status: SessionStatus;
  isCartActive: boolean;
  cartItemsCount?: number;
  cartValueBDT?: number;
  cartItemsSummary?: string;
  isBounced: boolean;
  bounceReason?: string;
  startedAt: string;
  lastActiveAt: string;
}

export interface BlockedIPRecord {
  ip: string;
  country: string;
  city: string;
  flag: string;
  blockedAt: string;
  reason: string;
  blockedBy: string;
}

export interface CityBreakdown {
  city: string;
  percentage: number;
  subdivision: string;
}

export interface CountryInfo {
  country: string;
  code: string;
  flag: string;
  pct: number;
  isPrimaryMarket?: boolean;
}

export const COUNTRY_REGIONS_MAP: Record<string, { country: string; flag: string; cities: CityBreakdown[] }> = {
  BD: {
    country: 'Bangladesh',
    flag: '🇧🇩',
    cities: [
      { city: 'Dhaka (Metropolitan & Gulshan)', percentage: 62, subdivision: 'Capital Division' },
      { city: 'Chittagong (Port City & Agrabad)', percentage: 19, subdivision: 'Chittagong Division' },
      { city: 'Sylhet (Zindabazar & Shahjalal)', percentage: 9, subdivision: 'Sylhet Division' },
      { city: 'Rajshahi (Shaheb Bazar)', percentage: 5, subdivision: 'Rajshahi Division' },
      { city: 'Khulna (Shibbari & Daulatpur)', percentage: 5, subdivision: 'Khulna Division' },
    ],
  },
  US: {
    country: 'United States',
    flag: '🇺🇸',
    cities: [
      { city: 'New York (Manhattan & Brooklyn)', percentage: 38, subdivision: 'New York (NY)' },
      { city: 'California (Los Angeles & Silicon Valley)', percentage: 32, subdivision: 'California (CA)' },
      { city: 'Texas (Dallas & Austin)', percentage: 16, subdivision: 'Texas (TX)' },
      { city: 'Florida (Miami & Orlando)', percentage: 8, subdivision: 'Florida (FL)' },
      { city: 'Washington (Seattle Metro)', percentage: 6, subdivision: 'Washington (WA)' },
    ],
  },
  GB: {
    country: 'United Kingdom',
    flag: '🇬🇧',
    cities: [
      { city: 'London (Westminster & Soho)', percentage: 54, subdivision: 'Greater London' },
      { city: 'Manchester (City Centre)', percentage: 22, subdivision: 'Greater Manchester' },
      { city: 'Birmingham (Bullring Area)', percentage: 12, subdivision: 'West Midlands' },
      { city: 'Edinburgh (Old Town)', percentage: 7, subdivision: 'Scotland' },
      { city: 'Leeds (City Centre)', percentage: 5, subdivision: 'West Yorkshire' },
    ],
  },
  AE: {
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    cities: [
      { city: 'Dubai (Downtown & Marina)', percentage: 65, subdivision: 'Emirate of Dubai' },
      { city: 'Abu Dhabi (Corniche & Al Reem)', percentage: 22, subdivision: 'Emirate of Abu Dhabi' },
      { city: 'Sharjah (Al Majaz Area)', percentage: 9, subdivision: 'Emirate of Sharjah' },
      { city: 'Ajman (Coastal Hub)', percentage: 4, subdivision: 'Emirate of Ajman' },
    ],
  },
  CA: {
    country: 'Canada',
    flag: '🇨🇦',
    cities: [
      { city: 'Toronto (Downtown & GTA)', percentage: 48, subdivision: 'Ontario (ON)' },
      { city: 'Vancouver (Metro Vancouver)', percentage: 26, subdivision: 'British Columbia (BC)' },
      { city: 'Montreal (Ville-Marie)', percentage: 18, subdivision: 'Quebec (QC)' },
      { city: 'Calgary (Downtown Beltline)', percentage: 8, subdivision: 'Alberta (AB)' },
    ],
  },
  UN: {
    country: 'Other International Regions',
    flag: '🌐',
    cities: [
      { city: 'European Union (Frankfurt, Paris, Amsterdam)', percentage: 45, subdivision: 'Western Europe' },
      { city: 'Asia-Pacific (Singapore, Tokyo, Sydney)', percentage: 35, subdivision: 'APAC Hub' },
      { city: 'Middle East & Africa (Riyadh, Doha, Cairo)', percentage: 20, subdivision: 'MENA Region' },
    ],
  },
};

interface VisitorAnalyticsState {
  timeFilter: TimeFilter;
  kpiFilter: KpiFilterType;
  selectedCountryCode: string;
  blockedCountries: string[];
  geoPolicyMode: GeoPolicyMode;
  liveVisitorCount: number;
  sessions: VisitorSession[];
  blockedIPs: BlockedIPRecord[];
  searchQuery: string;
  statusFilter: string;
  deviceFilter: string;
  activeTab: 'sessions' | 'geo' | 'devices' | 'sources' | 'blocked';
  
  setTimeFilter: (filter: TimeFilter) => void;
  setKpiFilter: (filter: KpiFilterType) => void;
  setSelectedCountry: (code: string) => void;
  toggleCountryBlock: (code: string) => void;
  setGeoPolicyMode: (mode: GeoPolicyMode) => void;
  setActiveTab: (tab: 'sessions' | 'geo' | 'devices' | 'sources' | 'blocked') => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setDeviceFilter: (device: string) => void;
  
  blockIP: (ip: string, reason?: string) => void;
  unblockIP: (ip: string) => void;
  simulateLiveUpdate: () => void;
}

const INITIAL_SESSIONS: VisitorSession[] = [
  {
    id: 'sess_1',
    ip: '103.145.118.24',
    customerName: 'Tanvir Ahmed (Registered Member)',
    contactPhone: '+880 1712-884910',
    country: 'Bangladesh',
    countryCode: 'BD',
    city: 'Dhaka (Gulshan-2)',
    flag: '🇧🇩',
    isp: 'Grameenphone 4G/Fiber',
    device: 'Mobile',
    deviceModel: 'Samsung Galaxy S24 Ultra',
    browser: 'Chrome Mobile 124',
    os: 'Android 14 (OneUI 6.1)',
    currentUrl: '/products/p1',
    referrer: 'Google Search (Organic)',
    durationSeconds: 342,
    pageviews: 7,
    status: 'active',
    isCartActive: true,
    cartItemsCount: 2,
    cartValueBDT: 28500,
    cartItemsSummary: 'Sony WH-1000XM5 + Spigen Case',
    isBounced: false,
    startedAt: '10:45 PM',
    lastActiveAt: 'Just now',
  },
  {
    id: 'sess_2',
    ip: '118.179.82.112',
    customerName: 'Sadia Rahman (Checkout Initiated)',
    contactPhone: '+880 1819-445566',
    country: 'Bangladesh',
    countryCode: 'BD',
    city: 'Chittagong (Agrabad)',
    flag: '🇧🇩',
    isp: 'Banglalink Broadband',
    device: 'Desktop',
    deviceModel: 'Dell XPS 15 (Core i9)',
    browser: 'Chrome 124',
    os: 'Windows 11 Pro',
    currentUrl: '/checkout',
    referrer: 'Direct URL',
    durationSeconds: 520,
    pageviews: 12,
    status: 'active',
    isCartActive: true,
    cartItemsCount: 3,
    cartValueBDT: 84000,
    cartItemsSummary: 'MacBook Sleeve + Keychron K2 + MX Master 3S',
    isBounced: false,
    startedAt: '10:42 PM',
    lastActiveAt: 'Just now',
  },
  {
    id: 'sess_3',
    ip: '202.53.168.45',
    customerName: 'Anonymous Visitor',
    contactPhone: undefined,
    country: 'Bangladesh',
    countryCode: 'BD',
    city: 'Sylhet (Zindabazar)',
    flag: '🇧🇩',
    isp: 'AmberIT Fiber',
    device: 'Mobile',
    deviceModel: 'iPhone 15 Pro Max',
    browser: 'Safari Mobile 17.5',
    os: 'iOS 17.5.1',
    currentUrl: '/flash-sales',
    referrer: 'Facebook Campaign',
    durationSeconds: 180,
    pageviews: 4,
    status: 'active',
    isCartActive: false,
    isBounced: false,
    startedAt: '10:48 PM',
    lastActiveAt: '1m ago',
  },
  {
    id: 'sess_4',
    ip: '185.199.110.153',
    customerName: 'David Miller (Intl Cart)',
    contactPhone: '+1 (212) 555-0198',
    country: 'United States',
    countryCode: 'US',
    city: 'New York',
    flag: '🇺🇸',
    isp: 'Verizon Fios 1Gbps',
    device: 'Desktop',
    deviceModel: 'MacBook Pro 16" (M3 Max)',
    browser: 'Safari 17.4',
    os: 'macOS Sonoma 14.5',
    currentUrl: '/products',
    referrer: 'Instagram Ad',
    durationSeconds: 260,
    pageviews: 5,
    status: 'active',
    isCartActive: true,
    cartItemsCount: 1,
    cartValueBDT: 14500,
    cartItemsSummary: 'Anker 737 Power Bank 24,000mAh',
    isBounced: false,
    startedAt: '10:46 PM',
    lastActiveAt: 'Just now',
  },
  {
    id: 'sess_5',
    ip: '103.230.106.90',
    customerName: 'Nusrat Jahan (Registered)',
    contactPhone: '+880 1622-778899',
    country: 'Bangladesh',
    countryCode: 'BD',
    city: 'Dhaka (Uttara Sector 7)',
    flag: '🇧🇩',
    isp: 'Dot Internet Fiber',
    device: 'Tablet',
    deviceModel: 'iPad Pro 13" (M4 OLED)',
    browser: 'Safari iPadOS 17.5',
    os: 'iPadOS 17.5',
    currentUrl: '/cart',
    referrer: 'Direct Bookmark',
    durationSeconds: 410,
    pageviews: 9,
    status: 'active',
    isCartActive: true,
    cartItemsCount: 2,
    cartValueBDT: 32000,
    cartItemsSummary: 'Logitech MX Keys Mini + Palm Rest',
    isBounced: false,
    startedAt: '10:44 PM',
    lastActiveAt: 'Just now',
  },
  {
    id: 'sess_6',
    ip: '86.12.189.44',
    customerName: 'Anonymous Visitor',
    contactPhone: undefined,
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London (Westminster)',
    flag: '🇬🇧',
    isp: 'BT Broadband UK',
    device: 'Desktop',
    deviceModel: 'Lenovo ThinkPad X1 Carbon',
    browser: 'Edge 124',
    os: 'Windows 11 Enterprise',
    currentUrl: '/products/p7',
    referrer: 'Google Shopping',
    durationSeconds: 195,
    pageviews: 3,
    status: 'active',
    isCartActive: false,
    isBounced: false,
    startedAt: '10:49 PM',
    lastActiveAt: '2m ago',
  },
  {
    id: 'sess_7',
    ip: '103.48.26.15',
    customerName: 'Anonymous Visitor',
    contactPhone: undefined,
    country: 'Bangladesh',
    countryCode: 'BD',
    city: 'Rajshahi (Shaheb Bazar)',
    flag: '🇧🇩',
    isp: 'Robi Axiata 4G LTE',
    device: 'Mobile',
    deviceModel: 'Xiaomi Redmi Note 13 Pro+ 5G',
    browser: 'Samsung Internet 24',
    os: 'Android 14 (HyperOS)',
    currentUrl: '/products/p11',
    referrer: 'YouTube Review Link',
    durationSeconds: 140,
    pageviews: 3,
    status: 'active',
    isCartActive: false,
    isBounced: false,
    startedAt: '10:50 PM',
    lastActiveAt: 'Just now',
  },
  {
    id: 'sess_8',
    ip: '94.200.45.18',
    customerName: 'Anonymous Visitor',
    contactPhone: undefined,
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Dubai (Business Bay)',
    flag: '🇦🇪',
    isp: 'Etisalat UAE 5G',
    device: 'Mobile',
    deviceModel: 'iPhone 14 Pro',
    browser: 'Chrome Mobile 124',
    os: 'iOS 17.4.1',
    currentUrl: '/about',
    referrer: 'Direct URL',
    durationSeconds: 85,
    pageviews: 2,
    status: 'active',
    isCartActive: false,
    isBounced: false,
    startedAt: '10:51 PM',
    lastActiveAt: '3m ago',
  },
  {
    id: 'sess_9',
    ip: '66.249.66.1',
    customerName: 'Googlebot Crawler',
    contactPhone: undefined,
    country: 'United States',
    countryCode: 'US',
    city: 'Mountain View (Googleplex)',
    flag: '🇺🇸',
    isp: 'Google LLC (Crawler Spider)',
    device: 'Desktop',
    deviceModel: 'Googlebot Indexer Cluster',
    browser: 'Googlebot 2.1 Web Crawler',
    os: 'Linux x86_64',
    currentUrl: '/products/p3',
    referrer: 'Automated Search Spider',
    durationSeconds: 30,
    pageviews: 18,
    status: 'bot',
    isCartActive: false,
    isBounced: false,
    startedAt: '10:52 PM',
    lastActiveAt: 'Just now',
  },
  {
    id: 'sess_10',
    ip: '103.114.98.50',
    customerName: 'Anik Dutta (Checkout Step)',
    contactPhone: '+880 1733-445566',
    country: 'Bangladesh',
    countryCode: 'BD',
    city: 'Khulna (Shibbari)',
    flag: '🇧🇩',
    isp: 'Link3 Technologies Fiber',
    device: 'Mobile',
    deviceModel: 'OnePlus 12 5G',
    browser: 'Chrome Mobile 123',
    os: 'Android 14 (OxygenOS 14)',
    currentUrl: '/products',
    referrer: 'Facebook Storefront',
    durationSeconds: 220,
    pageviews: 6,
    status: 'active',
    isCartActive: true,
    cartItemsCount: 1,
    cartValueBDT: 6800,
    cartItemsSummary: 'Baseus 65W GaN5 Pro Fast Charger',
    isBounced: false,
    startedAt: '10:47 PM',
    lastActiveAt: 'Just now',
  },
  {
    id: 'sess_11',
    ip: '103.197.153.22',
    customerName: 'Anonymous Guest (Bounced)',
    contactPhone: undefined,
    country: 'Bangladesh',
    countryCode: 'BD',
    city: 'Barisal (Sadar)',
    flag: '🇧🇩',
    isp: 'Grameenphone 4G',
    device: 'Mobile',
    deviceModel: 'Google Pixel 8 Pro',
    browser: 'Chrome Mobile 124',
    os: 'Android 14',
    currentUrl: '/flash-sales',
    referrer: 'Instagram Story Ad',
    durationSeconds: 14,
    pageviews: 1,
    status: 'bounced',
    isCartActive: false,
    isBounced: true,
    bounceReason: 'Left page after 14 seconds without interaction (Single Pageview)',
    startedAt: '10:52 PM',
    lastActiveAt: '1m ago',
  },
  {
    id: 'sess_12',
    ip: '197.210.226.4',
    customerName: 'Anonymous Guest (Bounced)',
    contactPhone: undefined,
    country: 'Nigeria',
    countryCode: 'NG',
    city: 'Lagos',
    flag: '🇳🇬',
    isp: 'MTN Nigeria LTE',
    device: 'Mobile',
    deviceModel: 'Tecno Camon 30 Premier',
    browser: 'Opera Mini 78',
    os: 'Android 13',
    currentUrl: '/products/p9',
    referrer: 'Direct Link',
    durationSeconds: 9,
    pageviews: 1,
    status: 'bounced',
    isCartActive: false,
    isBounced: true,
    bounceReason: 'High latency bounce after 9s (Out-of-region session)',
    startedAt: '10:53 PM',
    lastActiveAt: 'Just now',
  },
];

const INITIAL_BLOCKED: BlockedIPRecord[] = [
  {
    ip: '194.26.29.112',
    country: 'Russia',
    city: 'Moscow',
    flag: '🇷🇺',
    blockedAt: '2026-08-30 04:12 PM',
    reason: 'Rapid brute-force authentication attempt detected',
    blockedBy: 'Root Security Shield',
  },
  {
    ip: '45.155.205.88',
    country: 'Seychelles',
    city: 'Victoria',
    flag: '🇸🇨',
    blockedAt: '2026-08-28 11:30 AM',
    reason: 'Automated scraping bot violating rate limits',
    blockedBy: 'Super Admin (S.M. Amirul Islam)',
  },
];

export const useVisitorAnalyticsStore = create<VisitorAnalyticsState>()(
  persist(
    (set, get) => ({
      timeFilter: 'live',
      kpiFilter: 'all',
      selectedCountryCode: 'BD',
      blockedCountries: ['RU', 'KP'],
      geoPolicyMode: 'global',
      liveVisitorCount: 42,
      sessions: INITIAL_SESSIONS,
      blockedIPs: INITIAL_BLOCKED,
      searchQuery: '',
      statusFilter: 'all',
      deviceFilter: 'all',
      activeTab: 'sessions',

      setTimeFilter: (timeFilter) => {
        const counts: Record<TimeFilter, number> = {
          live: 42,
          today: 1840,
          week: 12450,
          month: 48920,
          all: 218500,
        };
        set({ timeFilter, liveVisitorCount: counts[timeFilter] || 42 });
      },

      setKpiFilter: (kpiFilter) => {
        set({ kpiFilter, activeTab: 'sessions' });
      },

      setSelectedCountry: (selectedCountryCode) => set({ selectedCountryCode }),

      toggleCountryBlock: (code: string) => {
        const state = get();
        const isCurrentlyBlocked = state.blockedCountries.includes(code);
        const updated = isCurrentlyBlocked
          ? state.blockedCountries.filter((c) => c !== code)
          : [...state.blockedCountries, code];
        set({ blockedCountries: updated });
      },

      setGeoPolicyMode: (geoPolicyMode) => set({ geoPolicyMode }),

      setActiveTab: (activeTab) => set({ activeTab }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),
      setDeviceFilter: (deviceFilter) => set({ deviceFilter }),

      blockIP: (ip: string, reason = 'Administrative Block by Root Security') => {
        const state = get();
        const existingSession = state.sessions.find((s) => s.ip === ip);
        
        const newBlockedRecord: BlockedIPRecord = {
          ip,
          country: existingSession?.country || 'Unknown',
          city: existingSession?.city || 'Unknown',
          flag: existingSession?.flag || '🌐',
          blockedAt: new Date().toLocaleString(),
          reason,
          blockedBy: 'Super Admin (Root)',
        };

        const updatedBlocked = [newBlockedRecord, ...state.blockedIPs.filter((b) => b.ip !== ip)];
        const updatedSessions = state.sessions.map((s) =>
          s.ip === ip ? { ...s, status: 'blocked' as SessionStatus } : s
        );

        set({
          blockedIPs: updatedBlocked,
          sessions: updatedSessions,
          liveVisitorCount: Math.max(1, state.liveVisitorCount - 1),
        });
      },

      unblockIP: (ip: string) => {
        const state = get();
        const updatedBlocked = state.blockedIPs.filter((b) => b.ip !== ip);
        const updatedSessions = state.sessions.map((s) =>
          s.ip === ip ? { ...s, status: 'active' as SessionStatus } : s
        );

        set({
          blockedIPs: updatedBlocked,
          sessions: updatedSessions,
        });
      },

      simulateLiveUpdate: () => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const currentCount = get().liveVisitorCount;
        set({ liveVisitorCount: Math.max(38, Math.min(48, currentCount + delta)) });
      },
    }),
    {
      name: 'shopnexus-visitor-analytics-storage-v3',
    }
  )
);
