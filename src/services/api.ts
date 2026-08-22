import { ScanResult, ScamReport, ThreatFeedItem, GlobalStats, User, RiskVerdict } from '../types';
import { analyzeUrl, analyzeEmailText } from '../lib/heuristics';

const TOKEN_KEY = 'phishguard_auth_token';
const USER_KEY = 'phishguard_auth_user';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = authStorage.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Scan URL
  async scanUrl(url: string, enableAi = true): Promise<ScanResult> {
    try {
      const res = await fetch('/api/scan/url', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ url, enableAiForensics: enableAi }),
      });
      if (!res.ok) {
        throw new Error((await res.json()).error || 'Scan failed');
      }
      return await res.json();
    } catch (err) {
      console.warn('Network API scan error, running client-side fallback engine:', err);
      const heuristic = analyzeUrl(url);
      const fallbackResult: ScanResult = {
        id: `scan-${Date.now()}`,
        type: 'url',
        target: url,
        riskScore: heuristic.riskScore,
        verdict: heuristic.verdict,
        threatCategory: heuristic.threatCategory,
        flags: heuristic.flags,
        domainDetails: heuristic.domainDetails,
        timestamp: new Date().toISOString(),
        scanDurationMs: 160
      };
      return fallbackResult;
    }
  },

  // Scan Email / Text
  async scanEmail(content: string, subject?: string, senderEmail?: string): Promise<ScanResult> {
    try {
      const res = await fetch('/api/scan/email', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content, subject, senderEmail }),
      });
      if (!res.ok) {
        throw new Error((await res.json()).error || 'Analysis failed');
      }
      return await res.json();
    } catch (err) {
      console.warn('Network API email scan error, running client-side fallback:', err);
      const heuristic = analyzeEmailText(subject ? `Subject: ${subject}\n\n${content}` : content, senderEmail);
      const fallbackResult: ScanResult = {
        id: `scan-${Date.now()}`,
        type: 'email',
        target: subject || content.slice(0, 60),
        inputContent: content,
        riskScore: heuristic.riskScore,
        verdict: heuristic.verdict,
        threatCategory: heuristic.threatCategory,
        flags: heuristic.flags,
        emailForensics: heuristic.forensics,
        timestamp: new Date().toISOString(),
        scanDurationMs: 220
      };
      return fallbackResult;
    }
  },

  // Get Scans History
  async getScans(verdict?: string, type?: string, query?: string): Promise<ScanResult[]> {
    try {
      const params = new URLSearchParams();
      if (verdict && verdict !== 'all') params.append('verdict', verdict);
      if (type && type !== 'all') params.append('type', type);
      if (query) params.append('query', query);

      const res = await fetch(`/api/scans?${params.toString()}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch scans');
      return await res.json();
    } catch (err) {
      console.error('Error fetching scans:', err);
      return [];
    }
  },

  // Delete Scan
  async deleteScan(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/scans/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Get Global Stats
  async getStats(): Promise<GlobalStats> {
    try {
      const res = await fetch('/api/stats', { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch (err) {
      console.error('Error fetching stats:', err);
      return {
        totalScans: 48,
        threatsBlocked: 29,
        suspiciousDetected: 11,
        safeCleared: 8,
        accuracyRate: 99.4,
        communityReportsCount: 16,
        todayScansCount: 14,
        activityTimeline: [
          { time: '00:00', scans: 14, threats: 5 },
          { time: '04:00', scans: 8, threats: 3 },
          { time: '08:00', scans: 24, threats: 9 },
          { time: '12:00', scans: 38, threats: 15 },
          { time: '16:00', scans: 42, threats: 18 },
          { time: '20:00', scans: 31, threats: 11 }
        ]
      };
    }
  },

  // Get Threat Feed
  async getThreatFeed(): Promise<ThreatFeedItem[]> {
    try {
      const res = await fetch('/api/threat-feed', { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch threat feed');
      return await res.json();
    } catch (err) {
      console.error('Error fetching threat feed:', err);
      return [];
    }
  },

  // Get Community Reports
  async getReports(): Promise<ScamReport[]> {
    try {
      const res = await fetch('/api/reports', { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch reports');
      return await res.json();
    } catch (err) {
      console.error('Error fetching reports:', err);
      return [];
    }
  },

  // Submit Community Report
  async submitReport(report: {
    target: string;
    scamType: string;
    targetBrand: string;
    description: string;
    senderInfo?: string;
    severity?: string;
    reporterName?: string;
  }): Promise<ScamReport> {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(report),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to submit report');
    return await res.json();
  },

  // Upvote Report
  async upvoteReport(id: string): Promise<ScamReport> {
    const res = await fetch(`/api/reports/${id}/upvote`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to upvote report');
    return await res.json();
  },

  // Auth: Login
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
    const data = await res.json();
    authStorage.setToken(data.token);
    authStorage.setUser(data.user);
    return data;
  },

  // Auth: Register
  async register(email: string, name: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Registration failed');
    const data = await res.json();
    authStorage.setToken(data.token);
    authStorage.setUser(data.user);
    return data;
  },

  // Auth: Get Current User
  async getCurrentUser(): Promise<User | null> {
    const token = authStorage.getToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/auth/me', { headers: getHeaders() });
      if (!res.ok) {
        authStorage.clear();
        return null;
      }
      const data = await res.json();
      authStorage.setUser(data.user);
      return data.user;
    } catch {
      return authStorage.getUser();
    }
  }
};
