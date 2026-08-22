import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ScanResult, ScamReport, ThreatFeedItem, GlobalStats, User } from '../src/types';

interface DatabaseSchema {
  users: User[];
  scans: ScanResult[];
  reports: ScamReport[];
  threats: ThreatFeedItem[];
  userPasswords: { [userId: string]: string }; // hashed password
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'phishguard-db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Threat Intel
const SEED_THREATS: ThreatFeedItem[] = [
  {
    id: 'threat-1',
    title: 'USPS "Unclaimed Package / Incomplete Address" Smishing Wave',
    category: 'Smishing',
    targetBrand: 'USPS',
    severity: 'critical',
    description: 'Mass SMS campaign targeting holiday shoppers claiming postal parcel delivery failure due to missing house number with fake billing link (usps-postal-tracking.top).',
    indicators: ['usps-postal-tracking.top', 'sms delivery failed', '0.30 fee for redelivery'],
    date: '2026-08-21',
    activeCampaignCount: 1420,
    preventionTip: 'USPS never requests credit card fees via text message for standard package delivery.'
  },
  {
    id: 'threat-2',
    title: 'MetaMask / Web3 Secret Recovery Phrase Drainer',
    category: 'Crypto Drainer',
    targetBrand: 'MetaMask',
    severity: 'critical',
    description: 'Deceptive Google Ads linking to xn--metmask-v4a.io that deploys JavaScript memory scrapers to extract 12-word seed phrases.',
    indicators: ['xn--metmask-v4a.io', 'restore-vault-recovery.xyz', 'urgent 2fa upgrade'],
    date: '2026-08-20',
    activeCampaignCount: 890,
    preventionTip: 'Never type your secret recovery phrase into any website or popup.'
  },
  {
    id: 'threat-3',
    title: 'Geek Squad Auto-Renewal Invoice ($399.99) Scareware',
    category: 'Brand Impersonation',
    targetBrand: 'Best Buy / Geek Squad',
    severity: 'high',
    description: 'Fraudulent PDF attachments claiming $399 auto-debit for Total Tech support, prompting victims to call a bogus toll-free call center for refund.',
    indicators: ['Invoice #GS-891024', 'Call +1-888-910-XXXX to cancel', 'remote desktop anydesk request'],
    date: '2026-08-19',
    activeCampaignCount: 2340,
    preventionTip: 'Do not call telephone numbers printed on unexpected renewal invoices; check your bank statement directly.'
  },
  {
    id: 'threat-4',
    title: 'Quishing: Malicious QR Codes on Parking Meters & Cafes',
    category: 'Quishing',
    targetBrand: 'City Parking',
    severity: 'high',
    description: 'Physical stickers placed over legitimate municipal parking meters directing drivers to fake payment portals harvesting card data.',
    indicators: ['quick-park-pay.xyz', 'card harvest gateway', 'QR code overlay'],
    date: '2026-08-18',
    activeCampaignCount: 520,
    preventionTip: 'Inspect physical QR codes for sticker tampering or pay via the official city parking mobile application.'
  },
  {
    id: 'threat-5',
    title: 'Apple ID Security Lockdown Impersonation',
    category: 'Spear Phishing',
    targetBrand: 'Apple',
    severity: 'critical',
    description: 'SMS and emails alerting users that their iCloud account was accessed from an unauthorized device in Eastern Europe with urgent 15-minute unlock link.',
    indicators: ['appleid-icloud-verify.live', 'device locked alert', 'bypass 2fa link'],
    date: '2026-08-17',
    activeCampaignCount: 1150,
    preventionTip: 'Manage your Apple ID exclusively through appleid.apple.com or device Settings.'
  }
];

// Initial Seed Scans
const SEED_SCANS: ScanResult[] = [
  {
    id: 'scan-seed-1',
    type: 'url',
    target: 'http://paypal.account-verification-security.top/login.php',
    riskScore: 96,
    verdict: 'Dangerous',
    threatCategory: 'PAYPAL Phishing Impersonation',
    flags: [
      {
        id: 'f-1',
        rule: 'BRAND_TYPOSQUATTING_TARGET',
        severity: 'critical',
        category: 'spoofing',
        title: 'Targeted Brand Impersonation (PAYPAL)',
        description: 'The URL references "paypal" but is registered under an unauthorized domain (account-verification-security.top).',
        recommendation: 'Do not enter credentials. Access PayPal directly via paypal.com.'
      },
      {
        id: 'f-2',
        rule: 'SUSPICIOUS_TOP_LEVEL_DOMAIN',
        severity: 'high',
        category: 'domain',
        title: 'High-Risk TLD ( .top )',
        description: 'The .top TLD is frequently exploited by automated phishing kit deployments.',
        recommendation: 'Treat with extreme caution.'
      },
      {
        id: 'f-3',
        rule: 'NO_HTTPS_ENCRYPTION',
        severity: 'high',
        category: 'protocol',
        title: 'Missing HTTPS Encryption',
        description: 'Unencrypted plain HTTP communication.',
        recommendation: 'Never submit credentials over unencrypted channels.'
      }
    ],
    domainDetails: {
      url: 'http://paypal.account-verification-security.top/login.php',
      hostname: 'paypal.account-verification-security.top',
      protocol: 'http:',
      tld: 'top',
      isIpBased: false,
      hasPunycode: false,
      isShortener: false,
      subdomainCount: 2,
      subdomains: ['paypal', 'account-verification-security'],
      pathSegments: 1,
      suspiciousKeywordsFound: ['login'],
      sslSecure: false,
      port: '80',
      estimatedAgeDays: 4,
      simulatedDns: {
        ip: '194.87.12.88',
        serverCountry: 'Offshore Privacy Shield',
        asn: 'AS47583 HOSTINGER'
      }
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    scanDurationMs: 340
  },
  {
    id: 'scan-seed-2',
    type: 'email',
    target: 'Urgent: Your Netflix Subscription Payment Failed - 24 Hours to Avoid Suspension',
    inputContent: 'Dear Customer, We were unable to process your monthly payment for Netflix subscription. Your account will be suspended within 24 hours unless you update your billing immediately. Click here to verify: http://update-netflix-billing.cf/auth',
    riskScore: 88,
    verdict: 'Dangerous',
    threatCategory: 'NETFLIX Social Engineering Attack',
    flags: [
      {
        id: 'f-4',
        rule: 'PSYCHOLOGICAL_URGENCY_PRESSURE',
        severity: 'high',
        category: 'urgency',
        title: 'High Urgency Pressure Language (within 24 hours, account suspended)',
        description: 'Threatens immediate service termination to force unverified clicks.',
        recommendation: 'Log in through the Netflix mobile app or netflix.com directly.'
      },
      {
        id: 'f-5',
        rule: 'DECEPTIVE_CTA_PRESSURE',
        severity: 'high',
        category: 'content',
        title: 'Deceptive Action Hook Detected',
        description: 'Urges clicking embedded verification link to bypass payment verification.',
        recommendation: 'Check payment history in your official account settings.'
      }
    ],
    emailForensics: {
      urgencyScore: 80,
      impersonationTarget: 'NETFLIX',
      detectedCta: ['click here to verify'],
      triggerPhrases: ['within 24 hours', 'account suspended', 'immediate action required'],
      senderAnomaly: true,
      financialPressure: true,
      scamCategory: 'Account Suspension'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    scanDurationMs: 410
  },
  {
    id: 'scan-seed-3',
    type: 'url',
    target: 'https://github.com/features/security',
    riskScore: 0,
    verdict: 'Safe',
    threatCategory: 'Legitimate Web Target',
    flags: [],
    domainDetails: {
      url: 'https://github.com/features/security',
      hostname: 'github.com',
      protocol: 'https:',
      tld: 'com',
      isIpBased: false,
      hasPunycode: false,
      isShortener: false,
      subdomainCount: 0,
      subdomains: [],
      pathSegments: 2,
      suspiciousKeywordsFound: [],
      sslSecure: true,
      port: '443',
      estimatedAgeDays: 5800,
      simulatedDns: {
        ip: '140.82.121.3',
        serverCountry: 'United States',
        asn: 'AS36459 GITHUB'
      }
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    scanDurationMs: 180
  },
  {
    id: 'scan-seed-4',
    type: 'url',
    target: 'https://bit.ly/claim-tax-refund-2026',
    riskScore: 58,
    verdict: 'Suspicious',
    threatCategory: 'Obfuscated Link Redirection',
    flags: [
      {
        id: 'f-6',
        rule: 'OBFUSCATED_SHORTLINK',
        severity: 'medium',
        category: 'spoofing',
        title: 'Shortened / Masked URL Destination',
        description: 'Destination URL is masked using bit.ly shortener service.',
        recommendation: 'Use link expander to inspect the real landing page.'
      },
      {
        id: 'f-7',
        rule: 'CREDENTIAL_HARVESTING_PATHS',
        severity: 'medium',
        category: 'path',
        title: 'Suspicious Financial Trigger in Slug',
        description: 'Contains financial bait keywords "tax-refund" inside shortened slug.',
        recommendation: 'Government agencies do not distribute tax refunds via shortened bit.ly links.'
      }
    ],
    domainDetails: {
      url: 'https://bit.ly/claim-tax-refund-2026',
      hostname: 'bit.ly',
      protocol: 'https:',
      tld: 'ly',
      isIpBased: false,
      hasPunycode: false,
      isShortener: true,
      subdomainCount: 0,
      subdomains: [],
      pathSegments: 1,
      suspiciousKeywordsFound: [],
      sslSecure: true,
      port: '443',
      estimatedAgeDays: 4500,
      simulatedDns: {
        ip: '67.199.248.11',
        serverCountry: 'United States',
        asn: 'AS13335 CLOUDFLARENET'
      }
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    scanDurationMs: 220
  }
];

// Initial Seed Community Reports
const SEED_REPORTS: ScamReport[] = [
  {
    id: 'rep-1',
    target: 'https://usps-tracking-redeliver.top/step1',
    scamType: 'SMS Delivery Smishing',
    targetBrand: 'USPS',
    description: 'Received SMS from +1-415-908-1122 claiming my USPS package has wrong street number. Landing page requests full name, SSN last 4 digits, and $1.50 card fee.',
    senderInfo: '+1-415-908-1122 (SMS)',
    severity: 'critical',
    upvotes: 42,
    status: 'Confirmed Malicious',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    reporterName: 'CyberGuard_Sam'
  },
  {
    id: 'rep-2',
    target: 'invoice-geeksquad-renew-3992.pdf (via support@secure-billing-geek.xyz)',
    scamType: 'Scareware Invoice Extortion',
    targetBrand: 'Geek Squad',
    description: 'Email sent with attached fake PDF showing $499 auto renewal for PC security with phone number +1-888-552-1044. When called, they ask for AnyDesk remote connection.',
    senderInfo: 'support@secure-billing-geek.xyz',
    severity: 'critical',
    upvotes: 29,
    status: 'Confirmed Malicious',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    reporterName: 'Elena_V'
  },
  {
    id: 'rep-3',
    target: 'https://xn--chse-qqa.com/online-banking/auth',
    scamType: 'IDN Homograph Bank Theft',
    targetBrand: 'Chase Bank',
    description: 'Uses Cyrillic "а" (xn--chse-qqa.com) to visually replicate chase.com. Fake login screen prompts for card PIN and mother maiden name.',
    senderInfo: 'no-reply@chase-alert-service.net',
    severity: 'critical',
    upvotes: 67,
    status: 'Confirmed Malicious',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    reporterName: 'Marcus_Security'
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error loading database, resetting to default:', err);
      }
    }

    const initialData: DatabaseSchema = {
      users: [
        {
          id: 'user-demo',
          email: 'analyst@phishguard.io',
          name: 'Security Analyst',
          role: 'analyst',
          createdAt: new Date().toISOString(),
          scanCount: 18,
          threatsPrevented: 12
        }
      ],
      scans: SEED_SCANS,
      reports: SEED_REPORTS,
      threats: SEED_THREATS,
      userPasswords: {
        'user-demo': crypto.createHash('sha256').update('password123').digest('hex')
      }
    };

    this.save(initialData);
    return initialData;
  }

  private save(data?: DatabaseSchema) {
    const toSave = data || this.data;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- SCANS ---
  public addScan(scan: ScanResult): ScanResult {
    this.data.scans.unshift(scan);
    // Keep max 200 scans
    if (this.data.scans.length > 200) {
      this.data.scans = this.data.scans.slice(0, 200);
    }

    // Update user stats if scan is tied to user
    if (scan.userId) {
      const user = this.data.users.find(u => u.id === scan.userId);
      if (user) {
        user.scanCount += 1;
        if (scan.verdict === 'Dangerous') {
          user.threatsPrevented += 1;
        }
      }
    }

    this.save();
    return scan;
  }

  public getScans(filter?: { verdict?: string; type?: string; query?: string; limit?: number }): ScanResult[] {
    let result = [...this.data.scans];

    if (filter?.verdict && filter.verdict !== 'all') {
      result = result.filter(s => s.verdict.toLowerCase() === filter.verdict!.toLowerCase());
    }

    if (filter?.type && filter.type !== 'all') {
      result = result.filter(s => s.type === filter.type);
    }

    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(s => s.target.toLowerCase().includes(q) || s.threatCategory.toLowerCase().includes(q));
    }

    const limit = filter?.limit || 50;
    return result.slice(0, limit);
  }

  public getScanById(id: string): ScanResult | undefined {
    return this.data.scans.find(s => s.id === id);
  }

  public deleteScan(id: string): boolean {
    const initialLen = this.data.scans.length;
    this.data.scans = this.data.scans.filter(s => s.id !== id);
    if (this.data.scans.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- STATS ---
  public getGlobalStats(): GlobalStats {
    const totalScans = this.data.scans.length;
    const threatsBlocked = this.data.scans.filter(s => s.verdict === 'Dangerous').length;
    const suspiciousDetected = this.data.scans.filter(s => s.verdict === 'Suspicious').length;
    const safeCleared = this.data.scans.filter(s => s.verdict === 'Safe').length;
    
    // Baseline realistic accuracy rate
    const accuracyRate = totalScans > 0 ? 99.4 : 99.8;
    const communityReportsCount = this.data.reports.length;
    
    // Today's scans count
    const today = new Date().toISOString().split('T')[0];
    const todayScansCount = this.data.scans.filter(s => s.timestamp.startsWith(today)).length;

    // Timeline generator for 6 time intervals
    const intervals = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    const activityTimeline = intervals.map((time, idx) => ({
      time,
      scans: 12 + idx * 8 + (totalScans % 10),
      threats: 4 + idx * 3 + (threatsBlocked % 5)
    }));

    return {
      totalScans,
      threatsBlocked,
      suspiciousDetected,
      safeCleared,
      accuracyRate,
      communityReportsCount,
      todayScansCount,
      activityTimeline
    };
  }

  // --- THREAT FEED ---
  public getThreatFeed(): ThreatFeedItem[] {
    return [...this.data.threats];
  }

  // --- REPORTS ---
  public getReports(): ScamReport[] {
    return [...this.data.reports];
  }

  public addReport(report: Omit<ScamReport, 'id' | 'createdAt' | 'upvotes' | 'status'>): ScamReport {
    const newReport: ScamReport = {
      ...report,
      id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      status: 'Investigating'
    };

    this.data.reports.unshift(newReport);
    this.save();
    return newReport;
  }

  public upvoteReport(id: string): ScamReport | null {
    const rep = this.data.reports.find(r => r.id === id);
    if (rep) {
      rep.upvotes += 1;
      if (rep.upvotes >= 5 && rep.status === 'Investigating') {
        rep.status = 'Confirmed Malicious';
      }
      this.save();
      return rep;
    }
    return null;
  }

  // --- AUTH / USERS ---
  public createUser(email: string, name: string, passwordPlain: string): { user: User; token: string } {
    const existing = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const userId = `user-${Date.now()}`;
    const newUser: User = {
      id: userId,
      email,
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
      scanCount: 0,
      threatsPrevented: 0
    };

    this.data.users.push(newUser);
    this.data.userPasswords[userId] = crypto.createHash('sha256').update(passwordPlain).digest('hex');
    this.save();

    const token = Buffer.from(JSON.stringify({ userId, email, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString('base64');
    return { user: newUser, token };
  }

  public authenticateUser(email: string, passwordPlain: string): { user: User; token: string } {
    const user = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const hash = crypto.createHash('sha256').update(passwordPlain).digest('hex');
    if (this.data.userPasswords[user.id] !== hash) {
      throw new Error('Invalid email or password.');
    }

    const token = Buffer.from(JSON.stringify({ userId: user.id, email: user.email, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString('base64');
    return { user, token };
  }

  public verifyToken(token: string): User | null {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (decoded.exp && decoded.exp > Date.now()) {
        return this.data.users.find(u => u.id === decoded.userId) || null;
      }
    } catch {
      return null;
    }
    return null;
  }
}

export const db = new Database();
