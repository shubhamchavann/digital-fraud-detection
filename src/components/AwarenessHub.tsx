import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, QrCode, Smartphone, Globe, ShieldAlert, Award, 
  HelpCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, 
  Sparkles, RefreshCw, AlertTriangle, ArrowRight, Zap,
  Lock, Eye, PhoneCall, ShieldCheck, HeartHandshake, Lightbulb,
  Check, X, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id: number;
  scenario: string;
  sender: string;
  linkOrSnippet: string;
  isPhishing: boolean;
  explanation: string;
  redFlags: string[];
}

interface AwarenessHubProps {
  onOpenHelplines?: () => void;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: 'You receive an urgent SMS text from what appears to be the Postal Service:',
    sender: '+1 (415) 890-1122',
    linkOrSnippet: 'USPS: Package #US9821 cannot be delivered due to wrong street address. Please update your address within 12h: http://usps-postal-tracking.top/redeliver',
    isPhishing: true,
    explanation: 'PHISHING! USPS operates exclusively under usps.com. It never sends SMS from standard 10-digit mobile numbers with high-risk .top domain links requesting fee payments.',
    redFlags: ['High-risk .top TLD', 'Generic SMS sender number', 'Artificial 12-hour panic deadline']
  },
  {
    id: 2,
    scenario: 'You receive a password reset confirmation email from GitHub:',
    sender: 'support@github.com',
    linkOrSnippet: 'https://github.com/password_reset/verify?token=ab78912cde45',
    isPhishing: false,
    explanation: 'LEGITIMATE! The sender domain is officially github.com, uses standard HTTPS, and matches standard authentication token routing.',
    redFlags: ['None. Standard verified GitHub portal communication.']
  },
  {
    id: 3,
    scenario: 'An email claims your Netflix subscription payment failed:',
    sender: 'service-billing@netflix-account-checkpoint.cf',
    linkOrSnippet: 'Your Netflix membership is locked. Click here to verify credit card: http://update-netflix-billing.cf/auth',
    isPhishing: true,
    explanation: 'PHISHING! Look at the registered domain (.cf extension with "netflix" placed in the subdomain). Legitimate Netflix strictly transmits from netflix.com.',
    redFlags: ['Subdomain spoofing', 'Unencrypted HTTP protocol', 'Freenom .cf domain']
  },
  {
    id: 4,
    scenario: 'You receive an urgent Slack/Email from your CEO while they are at a conference:',
    sender: 'ceo-office-direct@gmail.com',
    linkOrSnippet: 'I am in a private board meeting. Please purchase 5x $200 Apple gift cards for a partner gift immediately and send the codes here. I will expense it.',
    isPhishing: true,
    explanation: 'PHISHING / CEO FRAUD (BEC)! Executives will never ask employees to purchase retail gift cards using personal funds via personal Gmail accounts.',
    redFlags: ['Free webmail address for corporate executive', 'Demand for untraceable gift card codes', 'Pressure to bypass standard procurement']
  },
  {
    id: 5,
    scenario: 'You scan a QR code pasted on a public parking meter:',
    sender: 'Physical Sticker on meter',
    linkOrSnippet: 'https://quick-park-pay-city.xyz/checkout?meter=402',
    isPhishing: true,
    explanation: 'QUISHING (QR Phishing)! Scammers place sticker overlays on parking meters directing victims to rogue payment gateways with .xyz TLDs to harvest credit cards.',
    redFlags: ['Sticker overlay on public infrastructure', 'Third-party .xyz payment gateway']
  }
];

const SIMPLE_GOLDEN_RULES = [
  {
    number: '01',
    title: 'The 10-Minute Panic Rule',
    tagline: 'If it sounds like an emergency, it is almost certainly a scam.',
    simpleExplanation: 'Scammers try to scare you with words like "Your account will be blocked in 2 hours!" or "Electricity will be cut tonight!" They do this so you panic and don\'t have time to ask a friend or think carefully.',
    realLifeExample: 'Banks and government departments NEVER cut your service with 30-minute deadlines over SMS. Real letters come by post.',
    whatToDo: 'Take a deep breath. Stop, put your phone down for 5 minutes, and verify before clicking.',
    icon: AlertTriangle,
    accentColor: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30'
  },
  {
    number: '02',
    title: 'The Secret OTP (One-Time Password) Rule',
    tagline: 'Never give your 6-digit SMS code or PIN to ANYONE.',
    simpleExplanation: 'Your OTP is like the key to your front door. No genuine bank manager, police officer, or customer care agent will EVER ask for your OTP or UPI PIN.',
    realLifeExample: 'Scammer says: "Sir, I am calling from your bank to stop a fraud transaction. Please tell me the OTP you just received to cancel it." -> In reality, that OTP will authorize the theft!',
    whatToDo: 'Treat your OTP like your toothbrush — never share it with anyone, not even someone claiming to be police or bank staff.',
    icon: Lock,
    accentColor: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30'
  },
  {
    number: '03',
    title: 'Look Right Before the Last Dot (.com)',
    tagline: 'How to read any website link in 5 seconds.',
    simpleExplanation: 'Scammers put real brand names at the start of a link to trick your eyes, but only the name right before ".com" or ".org" is the real owner.',
    realLifeExample: 'www.amazon.pay-verify.com is NOT Amazon! The real owner is "pay-verify.com". Amazon is ONLY "amazon.com".',
    whatToDo: 'Always look at the words directly attached to .com, .org, or .gov.',
    icon: Eye,
    accentColor: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
  },
  {
    number: '04',
    title: 'No Stranger Gives Free Money or Lotteries',
    tagline: 'If you didn\'t buy a lottery ticket, you didn\'t win anything.',
    simpleExplanation: 'If you get a message saying "Congratulations! You won $50,000 / ₹25 Lakhs" or "Earn $100/day just by liking YouTube videos", it is a classic trap.',
    realLifeExample: 'They will give you $5 in the beginning, then ask you to pay $200 as a "processing fee" or "tax" to release the bigger money, and then disappear.',
    whatToDo: 'Remember: Real companies never ask you to pay money in order to receive your own salary or prize.',
    icon: Lightbulb,
    accentColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    number: '05',
    title: 'Never Install Apps When Someone is on the Call',
    tagline: 'Do NOT install AnyDesk, TeamViewer, or QuickSupport on your phone.',
    simpleExplanation: 'Screen-sharing apps allow a stranger to see your phone screen, read your passwords, and view your bank OTP codes in real time.',
    realLifeExample: 'Someone calls: "Your KYC is expired, download QuickSupport so our agent can update your account." -> Once installed, they take over your device.',
    whatToDo: 'If any caller asks you to install any app to "fix an issue" or "complete KYC", hang up the call immediately.',
    icon: Smartphone,
    accentColor: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30'
  }
];

const COMMON_DAILY_SCAMS = [
  {
    name: '1. The "Parcel / Courier Address Incomplete" SMS',
    bait: '"Your package cannot be delivered due to missing house number. Click here to update within 12h: link.xyz/usps"',
    truth: 'Scammers send millions of these randomly. If you click, they ask for a $0.30 or ₹25 "redelivery fee" to steal your credit card and CVV.',
    remedy: 'Ignore the text. If you ordered something, check the official Amazon, USPS, or FedEx app directly.'
  },
  {
    name: '2. The "Electricity / Water Disconnection" SMS',
    bait: '"Dear Consumer, your electricity power will be disconnected at 9:30 PM tonight because your previous bill was not updated. Call 98XXXXXX immediately."',
    truth: 'Power companies never disconnect without multiple formal postal notices. The phone number in the SMS connects to a scam call center.',
    remedy: 'Never call numbers in SMS. Check your electricity bill on your official utility website or municipal office.'
  },
  {
    name: '3. The "Part-Time Work from Home: Like YouTube Videos" Trap',
    bait: '"Earn $50–$200/day by simply liking videos or writing reviews on Telegram/WhatsApp."',
    truth: 'They pay a tiny amount on day 1 to gain your trust. On day 2, they ask you to deposit money into a "prepaid trading task" which is never returned.',
    remedy: 'Legitimate jobs never require you to pay upfront fees or join secret Telegram groups.'
  },
  {
    name: '4. The "Bank KYC Block / PAN Card Expired" Scare',
    bait: '"Dear customer, your bank account is blocked today due to pending KYC. Click here to update your PAN/Aadhaar/SSN: bank-kyc.top"',
    truth: 'Banks never update KYC through third-party links or WhatsApp messages.',
    remedy: 'Visit your nearest bank branch or log in securely through the bank\'s official mobile app.'
  }
];

const TACTIC_MODULES = [
  {
    id: 'mod-1',
    title: 'Fake Login Pages (Credential Harvesting)',
    icon: Globe,
    badge: 'High Frequency',
    summary: 'Attackers create pixel-perfect clones of login pages (Microsoft 365, Google, PayPal, Banking) to steal usernames, passwords, and session cookies.',
    indicators: [
      'Lookalike domain (e.g. micr0soft-login.xyz instead of microsoft.com)',
      'Lack of valid HTTPS EV certificate or mismatch in address bar',
      'Prompting for 2FA / OTP codes repeatedly',
      'Hosted on free cloud platforms (Firebase, Vercel, Canva, GitHub Pages) without corporate domain'
    ],
    defense: 'Always check the domain right before the last dot and extension. Use a password manager — it will never autofill on spoofed domains!'
  },
  {
    id: 'mod-2',
    title: 'SMS Smishing & Parcel Delivery Scams',
    icon: Smartphone,
    badge: 'Critical Wave',
    summary: 'Text messages claiming missed packages (USPS, FedEx, DHL), unpaid toll fees, or bank security alerts with shortened links.',
    indicators: [
      'Sent from regular 10-digit phone numbers rather than 5-6 digit shortcodes',
      'Small fee requirement (e.g., "$0.30 redelivery charge") to harvest credit cards',
      'Vague recipient greeting ("Dear customer")',
      'Extreme urgency ("within 12 hours or package will be destroyed")'
    ],
    defense: 'Never click links in delivery texts. Track shipments exclusively by copying the tracking code into the official carrier app.'
  },
  {
    id: 'mod-3',
    title: 'Quishing: Malicious QR Codes',
    icon: QrCode,
    badge: 'Emerging Vector',
    summary: 'Malicious QR codes on parking meters, restaurant menus, or email attachments designed to bypass email security filters.',
    indicators: [
      'Physical stickers placed over original printed signage',
      'QR code in email asking you to "Authenticate 2FA with your mobile camera"',
      'No preview of destination URL before loading'
    ],
    defense: 'Use a QR scanner that shows the full destination URL before opening it. Check for physical sticker tampering.'
  },
  {
    id: 'mod-4',
    title: 'Tech Support & Fake Invoice Scareware',
    icon: ShieldAlert,
    badge: 'Financial Extortion',
    summary: 'Bogus invoices claiming $399-$799 renewals for Geek Squad, McAfee, or Norton prompting you to call a fraudulent call center.',
    indicators: [
      'Urgent instruction: "Call +1-888-XXX-XXXX immediately to cancel"',
      'Asking to install remote software (AnyDesk, TeamViewer, UltraViewer)',
      'Claims of accidental "over-refund" demanding repayment in gift cards'
    ],
    defense: 'Check your real bank statement online. If no money left your account, the invoice is 100% fake.'
  }
];

export const AwarenessHub: React.FC<AwarenessHubProps> = ({ onOpenHelplines }) => {
  const [activeTab, setActiveTab] = useState<'plain-english' | 'modules' | 'quiz'>('plain-english');
  const [selectedExampleDomain, setSelectedExampleDomain] = useState<number>(0);

  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  const handleAnswer = (isPhish: boolean) => {
    setSelectedAnswer(isPhish);
    setShowExplanation(true);
    if (isPhish === currentQ.isPhishing) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleResetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  const LINK_EXAMPLES = [
    {
      fullUrl: 'https://login.paypal.account-verify.xyz/signin',
      subdomain: 'login.paypal.',
      realDomain: 'account-verify',
      tld: '.xyz',
      isFake: true,
      verdict: 'FAKED! "Paypal" is just a fake word in front. The real owner is account-verify.xyz.'
    },
    {
      fullUrl: 'https://www.netflix.com/login',
      subdomain: 'www.',
      realDomain: 'netflix',
      tld: '.com',
      isFake: false,
      verdict: 'REAL! The word right before .com is officially "netflix".'
    },
    {
      fullUrl: 'https://secure-bank.chase-update-service.top/auth',
      subdomain: 'secure-bank.',
      realDomain: 'chase-update-service',
      tld: '.top',
      isFake: true,
      verdict: 'FAKED! Chase is "chase.com", not chase-update-service.top.'
    }
  ];

  return (
    <div id="awareness-hub-section" className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel-elevated p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>ACADEMY & SIMPLE CYBER DEFENSE</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-display">
              Cyber Safety Education & Practice
            </h2>
            <p className="text-slate-400 text-sm">
              Simple, everyday explanations for everyone — no complicated jargon. Learn the 5 Golden Rules and test your instincts.
            </p>
          </div>

          {/* Three-Way Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('plain-english')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'plain-english'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
              <span>Plain English (For Everyone)</span>
            </button>

            <button
              onClick={() => setActiveTab('modules')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'modules'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Threat Tactics (Pro)</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>"Spot The Phish" Game</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Plain English Guide for Everyday People */}
      {activeTab === 'plain-english' && (
        <div className="space-y-8">
          {/* Top Quick Action Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Need Official Government Help Right Now?</h4>
                <p className="text-xs text-slate-300">
                  Call <strong>1930 (India)</strong>, <strong>1-877-FTC-HELP (USA)</strong>, or <strong>0300 123 2040 (UK)</strong> for immediate 24x7 assistance.
                </p>
              </div>
            </div>
            {onOpenHelplines && (
              <button
                onClick={onOpenHelplines}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>View All Official Helplines</span>
              </button>
            )}
          </div>

          {/* 5 Golden Rules Cards */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-bold text-white font-display">
                The 5 Golden Rules of Cyber Safety (In Plain Words)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SIMPLE_GOLDEN_RULES.map((rule) => {
                const Icon = rule.icon;
                return (
                  <div
                    key={rule.number}
                    className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                          RULE #{rule.number}
                        </span>
                        <div className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-white font-display">
                        {rule.title}
                      </h4>

                      <p className="text-xs font-semibold text-emerald-300/90 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20">
                        {rule.tagline}
                      </p>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {rule.simpleExplanation}
                      </p>

                      <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono text-rose-300 font-bold uppercase">Real Scam Example:</span>
                        <p className="text-[11px] text-slate-400 italic">"{rule.realLifeExample}"</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs text-cyan-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span><strong>What to do:</strong> {rule.whatToDo}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Link Reading Guide */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white font-display">
                How to Read Any Link in 5 Seconds (Interactive Demo)
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Scammers try to trick you by putting big company names at the beginning of a web link. Click the examples below to see how to find the REAL website:
            </p>

            {/* Example Selection Buttons */}
            <div className="flex flex-wrap gap-2">
              {LINK_EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedExampleDomain(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    selectedExampleDomain === idx
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 text-slate-400 border border-white/10 hover:text-white'
                  }`}
                >
                  Example #{idx + 1}
                </button>
              ))}
            </div>

            {/* Visual Domain Breakdown Card */}
            {(() => {
              const ex = LINK_EXAMPLES[selectedExampleDomain];
              return (
                <div className="bg-slate-950/90 p-5 rounded-2xl border border-white/10 space-y-4 shadow-inner">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Full Address:</span>
                    <div className="p-3 bg-slate-900 rounded-xl font-mono text-sm break-all flex flex-wrap items-center gap-1">
                      <span className="text-slate-500">https://</span>
                      <span className="text-amber-400 bg-amber-950/60 px-1 rounded border border-amber-500/30" title="Subdomain (Tricky part)">
                        {ex.subdomain}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-bold ${ex.isFake ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'}`} title="Real Owner Domain">
                        {ex.realDomain}
                      </span>
                      <span className="text-cyan-400">{ex.tld}</span>
                      <span className="text-slate-500">/signin</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                      <span className="text-slate-400 text-[10px] font-mono uppercase">What your eyes see first:</span>
                      <p className="text-amber-300 font-bold mt-0.5 font-mono">{ex.subdomain.replace('.', '')}</p>
                      <p className="text-slate-400 text-[11px] mt-1">This is just a decoy prefix anyone can create for free!</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                      <span className="text-slate-400 text-[10px] font-mono uppercase">Who ACTUALLY owns the page:</span>
                      <p className={`font-bold mt-0.5 font-mono ${ex.isFake ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {ex.realDomain}{ex.tld}
                      </p>
                      <p className="text-slate-300 text-[11px] mt-1">{ex.verdict}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 4 Most Common Daily Scams */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h3 className="text-xl font-bold text-white font-display">
                Top 4 Scams Happening Right Now (And How to Stop Them)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMMON_DAILY_SCAMS.map((scam, i) => (
                <div key={i} className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
                  <h4 className="font-bold text-white text-sm font-display flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>{scam.name}</span>
                  </h4>

                  <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-500/20 space-y-1">
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">The Bait Message:</span>
                    <p className="text-xs text-rose-200 italic">{scam.bait}</p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-100">The Hidden Trap:</strong> {scam.truth}
                  </p>

                  <div className="bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20 flex items-start gap-2 text-xs text-emerald-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Simple Solution:</strong> {scam.remedy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Interactive Tactics Modules (In-Depth Pro) */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TACTIC_MODULES.map((mod) => {
              const Icon = mod.icon;

              return (
                <div
                  key={mod.id}
                  className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-white font-display">{mod.title}</h3>
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase bg-slate-900 px-2.5 py-1 rounded-full border border-white/10 text-slate-300">
                        {mod.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {mod.summary}
                    </p>

                    <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-slate-400">Tell-Tale Indicators:</span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {mod.indicators.map((ind, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                            <span>{ind}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-start gap-2 text-xs text-emerald-300/90 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Pro Defense:</strong> {mod.defense}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 3: Interactive Quiz Minigame */}
      {activeTab === 'quiz' && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-cyan-500/25 relative">
          {!quizFinished ? (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/10 pb-3">
                <span className="text-cyan-400 font-bold">
                  CASE #{currentQ.id} OF {QUIZ_QUESTIONS.length}
                </span>
                <span>Current Score: <strong className="text-white">{score}</strong> / {QUIZ_QUESTIONS.length}</span>
              </div>

              {/* Scenario Box */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-300">
                  {currentQ.scenario}
                </p>

                <div className="bg-slate-950/90 p-4 rounded-2xl border border-white/10 space-y-2 font-mono text-xs shadow-inner">
                  <div className="text-slate-400 text-[11px] pb-1 border-b border-white/5">
                    <strong>From:</strong> {currentQ.sender}
                  </div>
                  <div className="text-cyan-300 break-all leading-relaxed">
                    {currentQ.linkOrSnippet}
                  </div>
                </div>
              </div>

              {/* Answer Buttons */}
              {!showExplanation ? (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    id="btn-quiz-legit"
                    onClick={() => handleAnswer(false)}
                    className="p-4 rounded-2xl bg-slate-900/80 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-sm flex flex-col items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    <span>Legitimate (Safe)</span>
                  </button>

                  <button
                    id="btn-quiz-phish"
                    onClick={() => handleAnswer(true)}
                    className="p-4 rounded-2xl bg-slate-900/80 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-sm flex flex-col items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <ShieldAlert className="w-6 h-6" />
                    <span>Phishing Scam!</span>
                  </button>
                </div>
              ) : (
                /* Feedback Reveal */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    selectedAnswer === currentQ.isPhishing
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 text-base font-bold">
                    {selectedAnswer === currentQ.isPhishing ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>CORRECT ASSESSMENT!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400" />
                        <span>INCORRECT — DECEPTIVE LURE MISSED!</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-slate-200">
                    {currentQ.explanation}
                  </p>

                  <div className="pt-2">
                    <button
                      id="btn-quiz-next"
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    >
                      <span>{currentQIndex + 1 < QUIZ_QUESTIONS.length ? 'Next Case Scenario' : 'View Final Score'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Quiz Complete Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4 max-w-md mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                <Award className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold text-white font-display">
                Phishing Simulation Complete!
              </h3>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10">
                <p className="text-xs text-slate-400 font-mono">YOUR SENTINEL SCORE</p>
                <p className="text-4xl font-black text-cyan-400 font-display mt-1">
                  {score} / {QUIZ_QUESTIONS.length}
                </p>
                <p className="text-xs text-slate-300 mt-2">
                  {score === QUIZ_QUESTIONS.length
                    ? '🏆 Perfect Score! You have eagle-eyed social engineering detection skills.'
                    : score >= 3
                    ? '⭐ Great awareness! Review the red flags above to achieve 100% immunity.'
                    : '🛡️ Keep practicing! Review our Plain English rules to protect yourself against deceptive lures.'}
                </p>
              </div>

              <button
                id="btn-quiz-retry"
                onClick={handleResetQuiz}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs flex items-center gap-2 mx-auto cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake Simulation</span>
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
