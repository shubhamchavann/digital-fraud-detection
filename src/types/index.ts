export type RiskVerdict = 'Safe' | 'Suspicious' | 'Dangerous';

export type FlagSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface RedFlag {
  id: string;
  rule: string;
  severity: FlagSeverity;
  category: 'domain' | 'protocol' | 'spoofing' | 'urgency' | 'path' | 'content' | 'ai';
  title: string;
  description: string;
  recommendation: string;
}

export interface DomainDetails {
  url: string;
  hostname: string;
  protocol: string;
  tld: string;
  isIpBased: boolean;
  hasPunycode: boolean;
  isShortener: boolean;
  subdomainCount: number;
  subdomains: string[];
  pathSegments: number;
  suspiciousKeywordsFound: string[];
  estimatedAgeDays?: number;
  sslSecure: boolean;
  port?: string;
  simulatedDns?: {
    ip: string;
    serverCountry: string;
    asn: string;
  };
}

export interface EmailForensics {
  urgencyScore: number; // 0-100
  impersonationTarget: string | null;
  detectedCta: string[];
  triggerPhrases: string[];
  senderAnomaly: boolean;
  financialPressure: boolean;
  scamCategory: 'Credential Theft' | 'Advance Fee / Wire' | 'Fake Invoice' | 'Account Suspension' | 'Tech Support' | 'Gift Card' | 'Legitimate / Low Risk';
  aiSummary?: string;
}

export interface ScanResult {
  id: string;
  type: 'url' | 'email';
  target: string; // The URL or subject/snippet of text
  inputContent?: string; // Full content for emails
  riskScore: number; // 0-100
  verdict: RiskVerdict;
  threatCategory: string;
  flags: RedFlag[];
  domainDetails?: DomainDetails;
  emailForensics?: EmailForensics;
  aiForensics?: {
    confidence: number;
    explanation: string;
    scamLikelihood: string;
    recommendedActions: string[];
  };
  timestamp: string;
  userId?: string;
  scanDurationMs: number;
}

export interface ScamReport {
  id: string;
  target: string;
  scamType: string;
  targetBrand: string;
  description: string;
  senderInfo?: string;
  severity: FlagSeverity;
  upvotes: number;
  status: 'Investigating' | 'Confirmed Malicious' | 'Resolved';
  createdAt: string;
  reporterName: string;
  userUpvoted?: boolean;
}

export interface ThreatFeedItem {
  id: string;
  title: string;
  category: 'Smishing' | 'Spear Phishing' | 'Quishing' | 'Brand Impersonation' | 'Crypto Drainer' | 'Scareware';
  targetBrand: string;
  severity: 'high' | 'critical' | 'medium';
  description: string;
  indicators: string[];
  date: string;
  activeCampaignCount: number;
  preventionTip: string;
}

export interface GlobalStats {
  totalScans: number;
  threatsBlocked: number;
  suspiciousDetected: number;
  safeCleared: number;
  accuracyRate: number;
  communityReportsCount: number;
  todayScansCount: number;
  activityTimeline: {
    time: string;
    scans: number;
    threats: number;
  }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'analyst';
  createdAt: string;
  scanCount: number;
  threatsPrevented: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
