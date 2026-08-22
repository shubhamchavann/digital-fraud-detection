import { RedFlag, DomainDetails, EmailForensics, RiskVerdict } from '../types';

// High-Risk / Commonly Abused Top Level Domains
const HIGH_RISK_TLDS = new Set([
  'xyz', 'top', 'work', 'click', 'buzz', 'cam', 'live', 'loan', 'tk', 'ml', 
  'ga', 'cf', 'gq', 'zip', 'mov', 'country', 'surf', 'gdn', 'racing', 'kim', 
  'fit', 'rest', 'men', 'party', 'mom', 'date', 'stream', 'trade', 'accountant',
  'download', 'vip', 'monster', 'icu', 'cfd', 'sbs', 'cyou'
]);

// Well-known and trusted TLDs (lower baseline risk)
const TRUSTED_TLDS = new Set(['gov', 'edu', 'mil']);

// Recognized URL Shorteners
const URL_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 
  'cutt.ly', 'rb.gy', 'shorturl.at', 'rebrand.ly', 'v.gd', 'bl.ink', 't.ly'
]);

// Common Targets of Phishing Impersonation
const IMPERSONATED_BRANDS: { [key: string]: { officialDomains: string[], names: string[] } } = {
  paypal: { officialDomains: ['paypal.com', 'paypal.me'], names: ['paypal'] },
  apple: { officialDomains: ['apple.com', 'icloud.com'], names: ['apple', 'icloud', 'applestore'] },
  netflix: { officialDomains: ['netflix.com'], names: ['netflix'] },
  amazon: { officialDomains: ['amazon.com', 'amazon.co.uk', 'amazon.de', 'aws.amazon.com'], names: ['amazon', 'prime'] },
  microsoft: { officialDomains: ['microsoft.com', 'live.com', 'office.com', 'outlook.com'], names: ['microsoft', 'office365', 'outlook', 'onedrive'] },
  google: { officialDomains: ['google.com', 'accounts.google.com', 'gmail.com'], names: ['google', 'gmail', 'googleplay'] },
  chase: { officialDomains: ['chase.com'], names: ['chase', 'chasebank'] },
  wellsfargo: { officialDomains: ['wellsfargo.com'], names: ['wellsfargo'] },
  bankofamerica: { officialDomains: ['bankofamerica.com', 'bofa.com'], names: ['bankofamerica', 'bofa'] },
  citibank: { officialDomains: ['citi.com', 'citibank.com'], names: ['citibank', 'citi'] },
  binance: { officialDomains: ['binance.com'], names: ['binance'] },
  metamask: { officialDomains: ['metamask.io'], names: ['metamask'] },
  coinbase: { officialDomains: ['coinbase.com'], names: ['coinbase'] },
  dhl: { officialDomains: ['dhl.com', 'dhl.de'], names: ['dhl', 'dhlexpress'] },
  fedex: { officialDomains: ['fedex.com'], names: ['fedex'] },
  usps: { officialDomains: ['usps.com'], names: ['usps', 'postalservice'] },
  steam: { officialDomains: ['steampowered.com', 'steamcommunity.com'], names: ['steam', 'steampowered'] },
  facebook: { officialDomains: ['facebook.com', 'meta.com', 'fb.com'], names: ['facebook', 'meta'] },
  instagram: { officialDomains: ['instagram.com'], names: ['instagram'] },
  whatsapp: { officialDomains: ['whatsapp.com'], names: ['whatsapp'] },
  irs: { officialDomains: ['irs.gov'], names: ['irs', 'internalrevenueservice', 'taxrefund'] },
  spotify: { officialDomains: ['spotify.com'], names: ['spotify'] }
};

// Lookalike Cyrillic and Greek Unicode characters (IDN Homograph attacks)
const HOMOGRAPH_LOOKALIKES: { [char: string]: string } = {
  '\u0430': 'a', // Cyrillic small letter a
  '\u0441': 'c', // Cyrillic small letter es
  '\u0435': 'e', // Cyrillic small letter ie
  '\u0456': 'i', // Cyrillic small letter byelorussian-ukrainian i
  '\u0458': 'j', // Cyrillic small letter je
  '\u043E': 'o', // Cyrillic small letter o
  '\u0440': 'p', // Cyrillic small letter er
  '\u0455': 's', // Cyrillic small letter dze
  '\u0443': 'y', // Cyrillic small letter u
  '\u0445': 'x', // Cyrillic small letter ha
  '\u03B1': 'a', // Greek small letter alpha
  '\u03BF': 'o', // Greek small letter omicron
  '\u03C1': 'p', // Greek small letter rho
  '\u03BD': 'v', // Greek small letter nu
};

// Sensitive phishing keywords in path or query
const SUSPICIOUS_PATH_KEYWORDS = [
  'login', 'signin', 'sign-in', 'log-in', 'logon', 'verify', 'verification',
  'authenticate', 'secure', 'account-update', 'billing-confirm', 'update-payment',
  'restore-access', 'security-checkpoint', 'wallet-connect', 'claim-airdrop',
  'reset-password', 'session-expired', '2fa-verify', 'kyc-approval', 'confirm-identity',
  'wp-includes', 'wp-admin', 'cpanel', 'webmail', 'redirect'
];

/**
 * Analyzes a URL with multi-layered heuristic checks
 */
export function analyzeUrl(rawUrl: string): {
  riskScore: number;
  verdict: RiskVerdict;
  flags: RedFlag[];
  domainDetails: DomainDetails;
  threatCategory: string;
} {
  let cleaned = rawUrl.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }

  const flags: RedFlag[] = [];
  let score = 0;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(cleaned);
  } catch {
    return {
      riskScore: 90,
      verdict: 'Dangerous',
      threatCategory: 'Malformed / Obfuscated URL',
      flags: [{
        id: 'malformed-url',
        rule: 'SYNTAX_PARSE_FAILURE',
        severity: 'critical',
        category: 'protocol',
        title: 'Malformed or Obfuscated URL Structure',
        description: 'The provided string cannot be parsed as a legitimate Internet address and displays deceptive framing.',
        recommendation: 'Do not attempt to navigate to or copy this link.'
      }],
      domainDetails: {
        url: rawUrl,
        hostname: 'invalid-domain',
        protocol: 'unknown',
        tld: 'none',
        isIpBased: false,
        hasPunycode: false,
        isShortener: false,
        subdomainCount: 0,
        subdomains: [],
        pathSegments: 0,
        suspiciousKeywordsFound: [],
        sslSecure: false
      }
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const protocol = parsedUrl.protocol.toLowerCase();
  const pathname = parsedUrl.pathname.toLowerCase();
  const search = parsedUrl.search.toLowerCase();
  const fullPath = pathname + search;

  // 1. IP-Based Hostname Check
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const isIpBased = ipv4Regex.test(hostname) || /^(0x[0-9a-f]+|\d{8,11})$/i.test(hostname);
  if (isIpBased) {
    score += 35;
    flags.push({
      id: 'ip-hostname',
      rule: 'IP_ADDRESS_HOST',
      severity: 'critical',
      category: 'domain',
      title: 'Raw IP Address Hostname Detected',
      description: `The URL uses a direct IP address (${hostname}) instead of a registered domain name, a staple tactic of credential harvesters.`,
      recommendation: 'Never input passwords or personal information into raw IP addresses.'
    });
  }

  // 2. SSL/TLS Protocol Check
  const sslSecure = protocol === 'https:';
  if (!sslSecure) {
    score += 20;
    flags.push({
      id: 'insecure-http',
      rule: 'NO_HTTPS_ENCRYPTION',
      severity: 'high',
      category: 'protocol',
      title: 'Missing HTTPS Encryption',
      description: 'The URL uses unencrypted HTTP protocol. All modern banking and legitimate portals strictly mandate HTTPS.',
      recommendation: 'Avoid entering any sensitive data on unencrypted connections.'
    });
  }

  // 3. Userinfo / @ Symbol Obfuscation Check (e.g. http://google.com@evil.com)
  if (rawUrl.includes('@')) {
    score += 40;
    flags.push({
      id: 'userinfo-spoof',
      rule: 'USERINFO_OBFUSCATION',
      severity: 'critical',
      category: 'spoofing',
      title: 'URL Authority Spoofing (@ Symbol Used)',
      description: 'The URL uses an @ symbol to mislead users into believing they are visiting a trusted domain when they are actually routed to a malicious destination.',
      recommendation: 'Extremely dangerous trick. The browser ignores everything before the @ symbol.'
    });
  }

  // 4. Homograph & Punycode Attack Check
  const hasPunycode = hostname.startsWith('xn--') || hostname.includes('.xn--');
  let hasHomograph = false;
  for (const char of hostname) {
    if (HOMOGRAPH_LOOKALIKES[char]) {
      hasHomograph = true;
      break;
    }
  }

  if (hasPunycode || hasHomograph) {
    score += 35;
    flags.push({
      id: 'homograph-attack',
      rule: 'IDN_HOMOGRAPH_SPOOF',
      severity: 'critical',
      category: 'spoofing',
      title: 'Punycode / Homograph Character Spoofing',
      description: 'The domain contains internationalized lookalike characters (e.g., Cyrillic "а" instead of Latin "a") designed to visually mimic legitimate brands.',
      recommendation: 'This is an intentional visual impersonation. Close the link immediately.'
    });
  }

  // 5. Domain Parsing & TLD extraction
  const hostParts = hostname.split('.');
  const tld = hostParts.length > 1 ? hostParts[hostParts.length - 1] : '';
  const secondLevel = hostParts.length > 1 ? hostParts[hostParts.length - 2] : '';
  const registeredDomain = hostParts.length >= 2 ? `${secondLevel}.${tld}` : hostname;
  const subdomains = hostParts.slice(0, hostParts.length - 2);

  // High risk TLD check
  if (HIGH_RISK_TLDS.has(tld)) {
    score += 25;
    flags.push({
      id: 'high-risk-tld',
      rule: 'SUSPICIOUS_TOP_LEVEL_DOMAIN',
      severity: 'high',
      category: 'domain',
      title: `High-Risk TLD ( .${tld} )`,
      description: `The domain uses the .${tld} top-level domain, which has a disproportionately high prevalence in phishing and malware campaigns due to cheap or anonymous registration.`,
      recommendation: 'Exercise heightened caution; verify sender identity through an alternate channel.'
    });
  } else if (TRUSTED_TLDS.has(tld)) {
    score = Math.max(0, score - 15);
  }

  // 6. Excessive Subdomain / Domain Nesting Check
  if (subdomains.length >= 3) {
    score += 25;
    flags.push({
      id: 'excessive-subdomains',
      rule: 'DEEP_SUBDOMAIN_NESTING',
      severity: 'high',
      category: 'domain',
      title: `Excessive Subdomain Stacking (${subdomains.length} subdomains)`,
      description: `The URL chains deep subdomains (${subdomains.join('.')}) to push the actual registered domain (${registeredDomain}) off-screen or disguise brand names.`,
      recommendation: 'Inspect the true domain before the last dot and extension.'
    });
  }

  // 7. URL Shortener Detection
  const isShortener = URL_SHORTENERS.has(hostname) || URL_SHORTENERS.has(registeredDomain);
  if (isShortener) {
    score += 20;
    flags.push({
      id: 'url-shortener',
      rule: 'OBFUSCATED_SHORTLINK',
      severity: 'medium',
      category: 'spoofing',
      title: 'Shortened / Masked URL Destination',
      description: `The link uses a shortening service (${hostname}) that obscures the ultimate destination server and prevents upfront domain validation.`,
      recommendation: 'Use a link unshortener or sandbox to inspect final routing before opening.'
    });
  }

  // 8. Brand Impersonation & Typosquatting Check
  let detectedBrandTarget: string | null = null;
  for (const [brandKey, brandInfo] of Object.entries(IMPERSONATED_BRANDS)) {
    const isOfficialDomain = brandInfo.officialDomains.some(d => hostname === d || hostname.endsWith('.' + d));
    
    // Check if brand name appears in hostname or path
    const inSubdomains = subdomains.some(s => brandInfo.names.some(n => s.includes(n)));
    const inSecondLevel = brandInfo.names.some(n => secondLevel.includes(n)) && !isOfficialDomain;
    const inPath = brandInfo.names.some(n => fullPath.includes(n));

    if (!isOfficialDomain && (inSubdomains || inSecondLevel)) {
      score += 45;
      detectedBrandTarget = brandKey;
      flags.push({
        id: `brand-spoof-${brandKey}`,
        rule: 'BRAND_TYPOSQUATTING_TARGET',
        severity: 'critical',
        category: 'spoofing',
        title: `Targeted Brand Impersonation (${brandKey.toUpperCase()})`,
        description: `The URL references "${brandKey}" in its host structure but is NOT registered to the official entity (${brandInfo.officialDomains.join(', ')}). The true host is "${registeredDomain}".`,
        recommendation: `Navigate directly to https://${brandInfo.officialDomains[0]} instead of clicking this link.`
      });
      break;
    } else if (!isOfficialDomain && inPath && (subdomains.length > 0 || HIGH_RISK_TLDS.has(tld))) {
      score += 20;
      flags.push({
        id: `path-brand-mimic-${brandKey}`,
        rule: 'PATH_BRAND_MIMIC',
        severity: 'medium',
        category: 'spoofing',
        title: `Deceptive Brand Keyword in Path (${brandKey.toUpperCase()})`,
        description: `The URL path mentions "${brandKey}" on an unrelated domain (${registeredDomain}).`,
        recommendation: 'Check whether this organization genuinely uses third-party domains for this workflow.'
      });
    }
  }

  // 9. Suspicious Path & Credential Harvesting Keywords
  const foundKeywords: string[] = [];
  for (const kw of SUSPICIOUS_PATH_KEYWORDS) {
    if (fullPath.includes(kw)) {
      foundKeywords.push(kw);
    }
  }

  if (foundKeywords.length > 0) {
    const keywordImpact = Math.min(foundKeywords.length * 8, 25);
    score += keywordImpact;
    flags.push({
      id: 'credential-harvesting-path',
      rule: 'CREDENTIAL_HARVESTING_PATHS',
      severity: foundKeywords.length > 2 ? 'high' : 'medium',
      category: 'path',
      title: `Authentication & Verification Keywords in Path (${foundKeywords.slice(0, 3).join(', ')})`,
      description: `The URL path contains terms (${foundKeywords.join(', ')}) commonly deployed in fake login forms, session hijacks, or account recovery traps.`,
      recommendation: 'Verify if you genuinely initiated a security checkpoint from this provider.'
    });
  }

  // 10. Hyphen Overuse & Suspicious Characters in Host
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    score += 15;
    flags.push({
      id: 'excessive-hyphens',
      rule: 'HYPHEN_STUFFING',
      severity: 'medium',
      category: 'domain',
      title: `Excessive Hyphen Usage in Domain (${hyphenCount} hyphens)`,
      description: 'Attackers frequently chain hyphens (e.g., "secure-paypal-login-portal-auth.com") to simulate legitimate multi-word services.',
      recommendation: 'Legitimate corporate portals rarely use more than one hyphen in their primary domain.'
    });
  }

  // 11. Non-standard Ports
  if (parsedUrl.port && !['80', '443', ''].includes(parsedUrl.port)) {
    score += 15;
    flags.push({
      id: 'unusual-port',
      rule: 'NON_STANDARD_PORT',
      severity: 'medium',
      category: 'protocol',
      title: `Non-Standard Port Execution (:${parsedUrl.port})`,
      description: `Traffic is being forced through port ${parsedUrl.port}, often used by rogue hosting nodes and evasion proxies to bypass corporate firewalls.`,
      recommendation: 'Standard web traffic operates exclusively on port 80 (HTTP) or 443 (HTTPS).'
    });
  }

  // Normalize final score 0-100
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));

  let verdict: RiskVerdict = 'Safe';
  if (normalizedScore >= 70) {
    verdict = 'Dangerous';
  } else if (normalizedScore >= 30) {
    verdict = 'Suspicious';
  }

  // Determine threat category
  let threatCategory = 'Legitimate Web Target';
  if (verdict === 'Dangerous') {
    if (detectedBrandTarget) {
      threatCategory = `${detectedBrandTarget.toUpperCase()} Phishing Impersonation`;
    } else if (isIpBased) {
      threatCategory = 'Direct IP Credential Harvester';
    } else if (hasPunycode || hasHomograph) {
      threatCategory = 'IDN Homograph Deception Campaign';
    } else {
      threatCategory = 'Malicious Phishing Portal';
    }
  } else if (verdict === 'Suspicious') {
    threatCategory = isShortener ? 'Obfuscated Link Redirection' : 'Suspicious Web Domain';
  }

  // Simulated DNS/WHOIS attributes for forensics inspection
  const mockAsnList = ['AS13335 CLOUDFLARENET', 'AS16509 AMAZON-02', 'AS15169 GOOGLE', 'AS20940 AKAMAI', 'AS47583 HOSTINGER'];
  const mockCountries = ['United States', 'Germany', 'Netherlands', 'Panama', 'Russia', 'Hong Kong'];
  const hash = hostname.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const selectedAsn = mockAsnList[hash % mockAsnList.length];
  const selectedCountry = isIpBased || HIGH_RISK_TLDS.has(tld) ? 'Offshore Privacy Shield' : mockCountries[hash % mockCountries.length];

  const domainDetails: DomainDetails = {
    url: cleaned,
    hostname,
    protocol,
    tld,
    isIpBased,
    hasPunycode,
    isShortener,
    subdomainCount: subdomains.length,
    subdomains,
    pathSegments: pathname.split('/').filter(Boolean).length,
    suspiciousKeywordsFound: foundKeywords,
    sslSecure,
    port: parsedUrl.port || (protocol === 'https:' ? '443' : '80'),
    estimatedAgeDays: isIpBased || HIGH_RISK_TLDS.has(tld) ? Math.floor(Math.random() * 20) + 2 : Math.floor(Math.random() * 2000) + 300,
    simulatedDns: {
      ip: isIpBased ? hostname : `104.${(hash % 200) + 20}.${(hash % 150) + 10}.${(hash % 250) + 1}`,
      serverCountry: selectedCountry,
      asn: selectedAsn
    }
  };

  return {
    riskScore: normalizedScore,
    verdict,
    flags,
    domainDetails,
    threatCategory
  };
}

/**
 * Analyzes Email or SMS text for Phishing, Scareware & Fraud tactics
 */
export function analyzeEmailText(rawText: string, senderEmail?: string): {
  riskScore: number;
  verdict: RiskVerdict;
  flags: RedFlag[];
  forensics: EmailForensics;
  threatCategory: string;
} {
  const text = rawText.toLowerCase();
  const flags: RedFlag[] = [];
  let score = 0;

  // 1. Urgency and Panic Inducing Triggers
  const urgencyKeywords = [
    { phrase: 'within 24 hours', weight: 15 },
    { phrase: 'immediate action required', weight: 20 },
    { phrase: 'account suspended', weight: 25 },
    { phrase: 'account locked', weight: 25 },
    { phrase: 'unauthorized login', weight: 15 },
    { phrase: 'final notice', weight: 20 },
    { phrase: 'access restricted', weight: 15 },
    { phrase: 'legal action', weight: 20 },
    { phrase: 'law enforcement', weight: 25 },
    { phrase: 'terminated immediately', weight: 20 },
    { phrase: 'security alert', weight: 12 },
    { phrase: 'verify immediately', weight: 18 },
    { phrase: 'unusual activity', weight: 12 }
  ];

  const detectedUrgency: string[] = [];
  let urgencyPoints = 0;
  for (const item of urgencyKeywords) {
    if (text.includes(item.phrase)) {
      detectedUrgency.push(item.phrase);
      urgencyPoints += item.weight;
    }
  }

  if (detectedUrgency.length > 0) {
    score += Math.min(urgencyPoints, 40);
    flags.push({
      id: 'high-urgency-triggers',
      rule: 'PSYCHOLOGICAL_URGENCY_PRESSURE',
      severity: detectedUrgency.length > 2 ? 'high' : 'medium',
      category: 'urgency',
      title: `High Urgency / Pressure Language (${detectedUrgency.slice(0, 3).join(', ')})`,
      description: 'The message employs psychological intimidation or artificially tight deadlines to induce panic and force hasty clicks.',
      recommendation: 'Legitimate institutions provide adequate grace periods and never threaten instant account deletion without formal correspondence.'
    });
  }

  // 2. Financial Extortion / Fraud / Invoice Keywords
  const financialKeywords = [
    { phrase: 'wire transfer', weight: 20 },
    { phrase: 'gift card', weight: 35 },
    { phrase: 'bitcoin', weight: 25 },
    { phrase: 'crypto', weight: 20 },
    { phrase: 'tax refund', weight: 20 },
    { phrase: 'unpaid invoice', weight: 20 },
    { phrase: 'invoice #', weight: 15 },
    { phrase: 'geek squad', weight: 35 },
    { phrase: 'mcafee', weight: 25 },
    { phrase: 'norton', weight: 25 },
    { phrase: 'auto-renewal', weight: 15 },
    { phrase: 'charged $', weight: 20 },
    { phrase: 'refund $', weight: 18 },
    { phrase: 'claim your prize', weight: 30 },
    { phrase: 'lottery winner', weight: 35 }
  ];

  const detectedFinancial: string[] = [];
  let hasFinancialPressure = false;
  for (const item of financialKeywords) {
    if (text.includes(item.phrase)) {
      detectedFinancial.push(item.phrase);
      score += item.weight;
      hasFinancialPressure = true;
    }
  }

  if (detectedFinancial.length > 0) {
    flags.push({
      id: 'financial-fraud-indicators',
      rule: 'FINANCIAL_EXTORTION_TACTIC',
      severity: 'critical',
      category: 'content',
      title: `Financial Pressure / Fake Billing Indicators (${detectedFinancial.slice(0, 3).join(', ')})`,
      description: 'The communication references unauthorized charges, fake tech-support renewals, gift cards, or cryptocurrency payments.',
      recommendation: 'Do NOT call any phone numbers or click links listed in unverified renewal notices.'
    });
  }

  // 3. Phishing Call-to-Action (CTA) Patterns
  const ctaPatterns = [
    'click here to verify',
    'click here to restore',
    'login to your account',
    'update your billing',
    'confirm your password',
    'reply with your otp',
    'download attached invoice',
    'open the attachment',
    'scan the qr code',
    'cancel subscription here',
    'call toll-free'
  ];

  const detectedCtas: string[] = [];
  for (const cta of ctaPatterns) {
    if (text.includes(cta)) {
      detectedCtas.push(cta);
      score += 15;
    }
  }

  if (detectedCtas.length > 0) {
    flags.push({
      id: 'deceptive-call-to-action',
      rule: 'DECEPTIVE_CTA_PRESSURE',
      severity: 'high',
      category: 'content',
      title: 'Deceptive Action Hook Detected',
      description: `Contains explicit instructions to bypass normal security flow: "${detectedCtas[0]}".`,
      recommendation: 'Log into the service by typing the official URL into your browser directly instead of following message instructions.'
    });
  }

  // 4. Targeted Brand / Entity Impersonation in text
  let impersonationTarget: string | null = null;
  for (const [brandKey, brandInfo] of Object.entries(IMPERSONATED_BRANDS)) {
    if (brandInfo.names.some(n => text.includes(n))) {
      impersonationTarget = brandKey.toUpperCase();
      score += 15;
      break;
    }
  }

  if (text.includes('geek squad') || text.includes('best buy')) {
    impersonationTarget = 'GEEK SQUAD / BEST BUY';
    score += 25;
  } else if (text.includes('irs') || text.includes('internal revenue')) {
    impersonationTarget = 'INTERNAL REVENUE SERVICE (IRS)';
    score += 30;
  }

  // 5. Sender Address Anomaly Check
  let senderAnomaly = false;
  if (senderEmail) {
    const sender = senderEmail.toLowerCase().trim();
    const isFreeMail = sender.includes('@gmail.com') || sender.includes('@yahoo.com') || sender.includes('@hotmail.com') || sender.includes('@outlook.com');
    if (impersonationTarget && isFreeMail) {
      senderAnomaly = true;
      score += 40;
      flags.push({
        id: 'freemail-sender-spoof',
        rule: 'FREE_WEBMAIL_IMPERSONATION',
        severity: 'critical',
        category: 'spoofing',
        title: 'Mismatched Webmail Sender for Corporate Identity',
        description: `The message claims to originate from ${impersonationTarget}, but was sent from a generic free webmail address (${senderEmail}).`,
        recommendation: 'Clear sign of a fraud attempt. Official corporations strictly transmit from their dedicated corporate domain.'
      });
    }
  }

  // Calculate Scam Category
  let scamCategory: EmailForensics['scamCategory'] = 'Legitimate / Low Risk';
  if (detectedFinancial.some(f => f.includes('geek squad') || f.includes('mcafee') || f.includes('invoice'))) {
    scamCategory = 'Fake Invoice';
  } else if (detectedUrgency.some(u => u.includes('account suspended') || u.includes('account locked'))) {
    scamCategory = 'Account Suspension';
  } else if (detectedFinancial.some(f => f.includes('gift card') || f.includes('bitcoin') || f.includes('wire transfer'))) {
    scamCategory = 'Advance Fee / Wire';
  } else if (detectedCtas.some(c => c.includes('password') || c.includes('otp') || c.includes('verify'))) {
    scamCategory = 'Credential Theft';
  } else if (detectedFinancial.some(f => f.includes('gift card'))) {
    scamCategory = 'Gift Card';
  }

  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));

  let verdict: RiskVerdict = 'Safe';
  if (normalizedScore >= 70) {
    verdict = 'Dangerous';
  } else if (normalizedScore >= 30) {
    verdict = 'Suspicious';
  }

  let threatCategory = 'Safe Communication';
  if (verdict === 'Dangerous') {
    threatCategory = impersonationTarget ? `${impersonationTarget} Social Engineering Attack` : `${scamCategory} Scam`;
  } else if (verdict === 'Suspicious') {
    threatCategory = 'Suspicious Deceptive Message';
  }

  const triggerPhrases = [...detectedUrgency, ...detectedFinancial, ...detectedCtas];

  const forensics: EmailForensics = {
    urgencyScore: Math.min(100, urgencyPoints * 2),
    impersonationTarget,
    detectedCta: detectedCtas,
    triggerPhrases,
    senderAnomaly,
    financialPressure: hasFinancialPressure,
    scamCategory
  };

  return {
    riskScore: normalizedScore,
    verdict,
    flags,
    forensics,
    threatCategory
  };
}
