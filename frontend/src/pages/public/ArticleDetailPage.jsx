import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';

export const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await articleService.getArticleBySlug(slug);
        if (res.success && res.data) {
          setArticle(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading article...</div>;
  }

  if (!article) {
    return (
      <div className="card" style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center', padding: '48px' }}>
        <h3>Article Not Found</h3>
        <Link to="/safety" className="btn btn-secondary" style={{ marginTop: '16px' }}>Back to Safety Center</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Link to="/safety" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
        <ArrowLeft size={16} /> Back to Safety Center
      </Link>

      <div className="card" style={{ padding: '36px' }}>
        <span className="badge" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)', marginBottom: '12px' }}>
          {article.category}
        </span>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
          {article.title}
        </h1>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} /> Published on {new Date(article.createdAt).toLocaleDateString()}
        </div>

        <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
          {article.content}
        </div>
      </div>
    </div>
  );
};
