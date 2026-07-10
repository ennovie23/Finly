import React, { useState, useEffect } from 'react';
import BankLinkModal from './components/BankLinkModal';

const WalletView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const fetchAccounts = async () => {
    try {
      const accountsRes = await fetch(`${API_URL}/api/banks/accounts`);
      if (accountsRes.ok) {
        const data = await accountsRes.json();
        setLinkedAccounts(data);
      }
    } catch (e) {
      console.error('Error fetching wallet data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleLinkSuccess = () => {
    // Refresh accounts after linking
    fetchAccounts();
  };

  // Calculate Live Net Worth
  const liveNetWorth = linkedAccounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

  const formatCurrency = (val) => {
    return `₱${Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const getBankColor = (bankName) => {
    const colors = {
      'BDO Unibank': '#002C77',
      'BPI': '#B01F24',
      'UnionBank': '#F47920',
      'GCash': '#005CEE',
      'Maya': '#00C853',
      'GoTyme Bank': '#0055FF'
    };
    return colors[bankName] || '#4B5563';
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "32px",
      maxWidth: "1000px",
      margin: "0 auto"
    }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0", color: "var(--text-primary)" }}>Wallet View</h1>
        <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "15px" }}>Your linked accounts and live net worth.</p>
      </div>

      {/* Live Net Worth Card */}
      <div style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "32px 40px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Faint wallet background icon */}
        <div style={{
          position: "absolute",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.05,
          color: "currentColor",
          pointerEvents: "none"
        }}>
          <svg width="280" height="280" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-2 9h-2c-.55 0-1-.45-1-1s.45-1 1-1h2v2z"/>
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "15px", fontWeight: "600" }}>Live Net Worth</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <h2 style={{ fontSize: "56px", fontWeight: "800", margin: "0 0 24px 0", letterSpacing: "-1.5px", color: "var(--text-primary)" }}>
            {loading ? '...' : formatCurrency(liveNetWorth)}
          </h2>
          
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            color: "#22c55e",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "600"
          }}>
            <div style={{ width: "6px", height: "6px", backgroundColor: "#22c55e", borderRadius: "50%" }}></div>
            Syncing Live via Open Banking
          </div>
        </div>
      </div>

      {/* Linked Accounts Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "var(--text-primary)" }}>Linked Accounts</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: "rgba(0, 216, 246, 0.1)",
            color: "#00d8f6",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease"
          }} 
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 216, 246, 0.15)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 216, 246, 0.1)"}
        >
          <span style={{ fontSize: "16px", fontWeight: "400" }}>+</span> Connect Bank
        </button>
      </div>

      {/* Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
        gap: "24px" 
      }}>

        {linkedAccounts.map(acc => (
          <AccountCard 
            key={acc.id}
            name={acc.bank_name} 
            type={acc.account_type} 
            amount={formatCurrency(acc.balance)} 
            color={getBankColor(acc.bank_name)} 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
              </svg>
            }
          />
        ))}

        {!loading && linkedAccounts.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text-secondary)',
            border: '1px dashed var(--border-color)',
            borderRadius: '16px'
          }}>
            No bank accounts linked yet. Click "Connect Bank" to start syncing your live balances.
          </div>
        )}
      </div>

      <BankLinkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLinkSuccess={handleLinkSuccess} 
      />
    </div>
  );
};

const AccountCard = ({ name, type, amount, color, icon }) => (
  <div style={{
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "border-color 0.2s ease, transform 0.2s ease",
    cursor: "pointer"
  }} onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      e.currentTarget.style.transform = "translateY(-2px)";
  }} onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "var(--border-color)";
      e.currentTarget.style.transform = "translateY(0)";
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{
        width: "56px",
        height: "56px",
        borderRadius: "14px",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: name === 'SpendSight Wallet' ? '#000' : 'white'
      }}>
        {icon}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontWeight: "600", fontSize: "16px", color: "var(--text-primary)" }}>{name}</span>
          {name !== 'SpendSight Wallet' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "13px", fontWeight: "500" }}>{type}</span>
          {name !== 'SpendSight Wallet' && (
            <span style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "10px",
              color: "var(--text-secondary)",
              fontWeight: "700",
              letterSpacing: "0.5px"
            }}>LIVE SYNC</span>
          )}
        </div>
      </div>
    </div>
    <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)" }}>{amount}</div>
  </div>
);

export default WalletView;
