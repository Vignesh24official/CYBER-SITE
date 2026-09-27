import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { BookOpen, Search, ChevronRight, ShieldCheck, AlertTriangle, Lock, Globe, Zap, FileText } from 'lucide-react';

export const SafetyCenterPage = () => {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Fallback rich cyber guidance articles if database has not seeded yet
  const fallbackGuides = [
    {
      id: 'fb-1',
      slug: 'how-to-spot-ai-voice-vishing-scams',
      category: 'SOCIAL_ENGINEERING',
      title: 'How to Detect & Stop AI Voice Cloning & Vishing Scams',
      summary: 'Threat actors now use 3-second audio samples to replicate family or executive voices. Learn the mandatory verbal duress phrases and verification protocols.',
      readTime: '4 min read',
      icon: AlertTriangle,
    },
    {
      id: 'fb-2',
      slug: 'upi-qr-code-and-instant-payment-fraud-prevention',
      category: 'FINANCIAL_FRAUD',
      title: 'Protecting Against UPI QR Code Traps & Reversal Fraud',
      summary: 'Scanning a QR code never deposits money into your account—it only debits. Detailed steps to freeze unauthorized transactions within the golden 2-hour window.',
      readTime: '6 min read',
      icon: Zap,
    },
    {
      id: 'fb-3',
      slug: 'ransomware-containment-and-airgap-protocol',
      category: 'MALWARE_DEFENSE',
      title: 'Emergency Ransomware Isolation & Cryptographic Preservation',
      summary: 'Immediate air-gapping procedures, memory dump extraction steps, and why paying the ransom note causes secondary double-extortion attacks.',
      readTime: '8 min read',
      icon: Lock,
    },
    {
      id: 'fb-4',
      slug: 'punycode-and-homograph-phishing-inspection',
      category: 'PHISHING_DEFENSE',
      title: 'Detecting Spoofed Domains: Punycode & Lookalike Attacks',
      summary: 'How attackers register Cyrillic and Unicode characters that look identical to genuine banking domains in standard browser address bars.',
      readTime: '5 min read',
      icon: Globe,
    },
  ];

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await articleService.getArticles(0, 20, query);
      if (res && res.success && res.data && res.data.content && res.data.content.length > 0) {
        setArticles(res.data.content);
      } else {
        setArticles(fallbackGuides);
      }
    } catch (err) {
      setArticles(fallbackGuides);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [query]);

  const displayedArticles = articles.filter(a => {
    const matchesCat = selectedCat === 'ALL' || (a.category && a.category.toUpperCase().includes(selectedCat));
    const matchesQuery = !query || a.title?.toLowerCase().includes(query.toLowerCase()) || a.summary?.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 24px 80px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <div className="shimmer-badge" style={{ marginBottom: '14px' }}>
          <BookOpen size={14} color="var(--accent-cyan)" />
          <span>CYBER DEFENSE KNOWLEDGEBASE & ADVISORIES</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', fontWeight: 900, marginBottom: '14px', color: '#ffffff' }}>
          Cyber Safety & Incident Prevention Hub
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
          Practical threat defense protocols, scam prevention workflows, and verified remediation guidance curated by certified cyber investigators.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: '580px', margin: '28px auto 0', position: 'relative' }}>
          <Search size={18} color="var(--accent-cyan)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides by keyword (e.g., UPI, QR code, Phishing, Ransomware)..."
            style={{
              padding: '14px 18px 14px 44px',
              backgroundColor: 'rgba(9, 15, 30, 0.9)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '12px',
              fontSize: '0.95rem',
              color: '#ffffff',
            }}
          />
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
          {[
            { id: 'ALL', label: 'All Advisories' },
            { id: 'PHISHING', label: 'Phishing Defense' },
            { id: 'FINANCIAL', label: 'Financial & UPI' },
            { id: 'MALWARE', label: 'Malware & Ransomware' },
            { id: 'SOCIAL', label: 'Social Engineering' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                backgroundColor: selectedCat === cat.id ? 'rgba(0, 242, 254, 0.16)' : 'rgba(11, 19, 36, 0.7)',
                color: selectedCat === cat.id ? '#00f2fe' : 'var(--text-secondary)',
                border: selectedCat === cat.id ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading safety intelligence guides...
        </div>
      ) : displayedArticles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          No safety advisories found matching your criteria.
        </div>
      ) : (
        <div className="grid-2" style={{ gap: '24px' }}>
          {displayedArticles.map((article) => (
            <div 
              key={article.id} 
              className="card card-interactive" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                padding: '28px',
                backgroundColor: 'rgba(11, 19, 36, 0.75)',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span 
                    style={{ 
                      padding: '4px 10px', 
                      borderRadius: '4px', 
                      backgroundColor: 'rgba(0, 242, 254, 0.1)', 
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                      color: 'var(--accent-cyan-bright)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {article.category?.replace('_', ' ')}
                  </span>

                  {article.readTime && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {article.readTime}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#ffffff', lineHeight: 1.4 }}>
                  {article.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {article.summary}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '8px' }}>
                <Link 
                  to={`/safety/${article.slug}`} 
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px' }}
                >
                  Inspect Full Advisory <ChevronRight size={15} />
                </Link>

                <Link
                  to={`/report?type=${encodeURIComponent(article.category || 'general')}`}
                  style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                >
                  File Incident Related to This →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
