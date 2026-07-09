import React from "react";

function AIAssistantView() {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        height: "calc(100vh - 100px)",
      }}
    >
      {/* History Sidebar */}
      <div style={{
        width: "260px",
        borderRight: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-card-inner)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px"
      }}>
        <h3 style={{ margin: "0 0 20px 8px", fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>
          Recent Chats
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto" }}>
          {["Groceries vs Budget", "Investment Tips", "July Spending Summary", "Tax Deductions 2026"].map((item, idx) => (
            <div key={idx} style={{
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: idx === 0 ? "rgba(0, 216, 246, 0.08)" : "transparent",
              color: idx === 0 ? "#00d8f6" : "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: idx === 0 ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }} onMouseEnter={(e) => { 
                if (idx !== 0) {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.color = "var(--text-primary)";
                }
            }} onMouseLeave={(e) => { 
                if (idx !== 0) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                }
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 216, 246, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00d8f6",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
            </svg>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>
              AI Assistant
            </h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
              Powered by SpendSight
            </p>
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flexGrow: 1,
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* AI Message */}
          <div style={{ display: "flex", gap: "16px", maxWidth: "80%" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 216, 246, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#00d8f6",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </div>
            <div
              style={{
                backgroundColor: "rgba(0, 216, 246, 0.04)",
                border: "1px solid rgba(0, 216, 246, 0.2)",
                padding: "16px 20px",
                borderRadius: "0 16px 16px 16px",
                color: "var(--text-primary)",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Hi there! I am your SpendSight AI. I can help you analyze your spending, set goals, or find anomalies. What would you like to know?
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div style={{ padding: "24px", borderTop: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)" }}>
          {/* Suggestions */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
            {["Analyze this week's anomalies", "Set a savings goal", "Am I on track?"].map(
              (text) => (
                <button
                  key={text}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid var(--border-color)",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--text-primary)";
                    e.currentTarget.style.borderColor = "var(--text-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.borderColor = "var(--border-color)";
                  }}
                >
                  {text}
                </button>
              )
            )}
          </div>

          {/* Input Field */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Ask anything about your finances..."
              style={{
                width: "100%",
                backgroundColor: "var(--bg-card-inner)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                padding: "16px 48px 16px 16px",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              style={{
                position: "absolute",
                right: "12px",
                backgroundColor: "rgba(0, 216, 246, 0.08)",
                border: "none",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#00d8f6",
                cursor: "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistantView;
