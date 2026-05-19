import { useState } from 'react';
import { createBin } from '../api';

export default function BinCreator({ onBinCreated }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  async function handleCreate() {
    setLoading(true);
    try {
      const data = await createBin();
      setWebhookUrl(data.webhook_url);
      onBinCreated(data.bin_id);
    } catch (err) {
      console.error('Failed to create bin:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🪝 WebhookBin</h1>
      <p style={styles.subtitle}>
        Inspect and debug webhooks in real time
      </p>

      {!webhookUrl ? (
        <button style={styles.button} onClick={handleCreate} disabled={loading}>
          {loading ? 'Creating...' : 'Generate Webhook URL'}
        </button>
      ) : (
        <div style={styles.urlBox}>
          <p style={styles.label}>Your webhook URL</p>
          <div style={styles.urlRow}>
            <code style={styles.url}>{webhookUrl}</code>
            <button style={styles.copyBtn} onClick={handleCopy}>
              {copied ? 'Copied' : '📋 Copy'}
            </button>
          </div>
          <p style={styles.hint}>
            Send any POST request to this URL — it will appear below instantly
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '48px 24px 32px',
    borderBottom: '1px solid #1e2130',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#7c6af7',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#8892a4',
    marginBottom: '32px',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#7c6af7',
    color: '#fff',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
  urlBox: {
    backgroundColor: '#1a1d27',
    border: '1px solid #2a2f45',
    borderRadius: '10px',
    padding: '20px 24px',
    maxWidth: '640px',
    margin: '0 auto',
  },
  label: {
    fontSize: '0.75rem',
    color: '#8892a4',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '10px',
  },
  urlRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  url: {
    color: '#7c6af7',
    fontSize: '0.95rem',
    wordBreak: 'break-all',
  },
  copyBtn: {
    backgroundColor: '#2a2f45',
    color: '#e2e8f0',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
  },
  hint: {
    marginTop: '12px',
    fontSize: '0.8rem',
    color: '#8892a4',
  },
};