import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { db } from './server/db.ts';
import { analyzeUrl, analyzeEmailText } from './src/lib/heuristics.ts';
import { performAiForensicAnalysis } from './server/gemini.ts';
import { ScanResult } from './src/types/index.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Helper to get authenticated user if present
function getAuthUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return db.verifyToken(token);
  }
  return null;
}

// --- API ROUTES ---

// 1. Scan URL
app.post('/api/scan/url', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { url, enableAiForensics } = req.body;

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'URL link is required for scanning.' });
  }

  try {
    const heuristicResult = analyzeUrl(url.trim());
    const user = getAuthUser(req);

    let aiForensics = undefined;
    if (enableAiForensics !== false && (heuristicResult.riskScore > 20 || process.env.GEMINI_API_KEY)) {
      const aiRes = await performAiForensicAnalysis(
        url,
        'url',
        heuristicResult.verdict,
        heuristicResult.riskScore
      );
      if (aiRes) {
        aiForensics = aiRes;
      }
    }

    const duration = Date.now() - startTime;
    const scanRecord: ScanResult = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'url',
      target: url.trim(),
      riskScore: heuristicResult.riskScore,
      verdict: heuristicResult.verdict,
      threatCategory: heuristicResult.threatCategory,
      flags: heuristicResult.flags,
      domainDetails: heuristicResult.domainDetails,
      aiForensics,
      timestamp: new Date().toISOString(),
      userId: user?.id,
      scanDurationMs: duration
    };

    const saved = db.addScan(scanRecord);
    return res.json(saved);
  } catch (err: any) {
    console.error('URL Scan error:', err);
    return res.status(500).json({ error: err.message || 'Failed to scan URL.' });
  }
});

// 2. Scan Email / Message Content
app.post('/api/scan/email', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { content, senderEmail, subject } = req.body;

  if (!content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'Message or email body is required.' });
  }

  try {
    const fullText = subject ? `Subject: ${subject}\n\n${content}` : content;
    const heuristicResult = analyzeEmailText(fullText, senderEmail);
    const user = getAuthUser(req);

    let aiForensics = undefined;
    const aiRes = await performAiForensicAnalysis(
      fullText,
      'email',
      heuristicResult.verdict,
      heuristicResult.riskScore
    );
    if (aiRes) {
      aiForensics = aiRes;
    }

    const duration = Date.now() - startTime;
    const targetLabel = subject ? subject : fullText.slice(0, 75) + (fullText.length > 75 ? '...' : '');

    const scanRecord: ScanResult = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'email',
      target: targetLabel,
      inputContent: content,
      riskScore: heuristicResult.riskScore,
      verdict: heuristicResult.verdict,
      threatCategory: heuristicResult.threatCategory,
      flags: heuristicResult.flags,
      emailForensics: heuristicResult.forensics,
      aiForensics,
      timestamp: new Date().toISOString(),
      userId: user?.id,
      scanDurationMs: duration
    };

    const saved = db.addScan(scanRecord);
    return res.json(saved);
  } catch (err: any) {
    console.error('Email scan error:', err);
    return res.status(500).json({ error: err.message || 'Failed to analyze text.' });
  }
});

// 3. Get Scans History
app.get('/api/scans', (req: Request, res: Response) => {
  const { verdict, type, query, limit } = req.query;
  const scans = db.getScans({
    verdict: verdict as string,
    type: type as string,
    query: query as string,
    limit: limit ? parseInt(limit as string, 10) : 50
  });
  return res.json(scans);
});

// 4. Get Scan by ID
app.get('/api/scans/:id', (req: Request, res: Response) => {
  const scan = db.getScanById(req.params.id);
  if (!scan) {
    return res.status(404).json({ error: 'Scan result not found.' });
  }
  return res.json(scan);
});

// 5. Delete Scan
app.delete('/api/scans/:id', (req: Request, res: Response) => {
  const deleted = db.deleteScan(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Scan not found or already deleted.' });
  }
  return res.json({ success: true });
});

// 6. Global Stats
app.get('/api/stats', (_req: Request, res: Response) => {
  const stats = db.getGlobalStats();
  return res.json(stats);
});

// 7. Threat Feed
app.get('/api/threat-feed', (_req: Request, res: Response) => {
  const feed = db.getThreatFeed();
  return res.json(feed);
});

// 8. Community Reports
app.get('/api/reports', (_req: Request, res: Response) => {
  const reports = db.getReports();
  return res.json(reports);
});

app.post('/api/reports', (req: Request, res: Response) => {
  const { target, scamType, targetBrand, description, senderInfo, severity, reporterName } = req.body;
  if (!target || !description) {
    return res.status(400).json({ error: 'Target URL/Content and incident description are required.' });
  }

  const newReport = db.addReport({
    target,
    scamType: scamType || 'General Phishing',
    targetBrand: targetBrand || 'Unknown Entity',
    description,
    senderInfo: senderInfo || 'N/A',
    severity: severity || 'high',
    reporterName: reporterName || 'Anonymous Sentinel'
  });

  return res.json(newReport);
});

app.post('/api/reports/:id/upvote', (req: Request, res: Response) => {
  const updated = db.upvoteReport(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: 'Report not found.' });
  }
  return res.json(updated);
});

// 9. Authentication
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Valid email and a password of at least 6 characters required.' });
  }

  try {
    const result = db.createUser(email, name || email.split('@')[0], password);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = db.authenticateUser(email, password);
    return res.json(result);
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.json({ user });
});

// --- CLIENT SERVING ---
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛡️ PhishGuard Sentinel active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
