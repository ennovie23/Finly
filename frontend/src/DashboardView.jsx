import { useState } from "react";

function DashboardView({ email }) {
  const [selectedMonth, setSelectedMonth] = useState("All");

  const dataSets = {
    All: {
      totalSpend: "₱12,500",
      weeklyAve: "₱3,125",
      dailyAve: "₱1,250",
      highestCategory: "Food",
      highestPercent: 37,
      breakdown: {
        food: { percent: 37, offset: 0 },
        utilities: { percent: 25, offset: -37 },
        entertainment: { percent: 23, offset: -62 },
        transport: { percent: 15, offset: -85 }
      },
      trends: {
        val1: "₱8k",
        val2: "₱4k",
        y1: 40,
        y2: 100,
        label1: "Jun",
        label2: "Jul"
      }
    },
    Jul: {
      totalSpend: "₱4,250",
      weeklyAve: "₱1,062",
      dailyAve: "₱531",
      highestCategory: "Utilities",
      highestPercent: 58,
      breakdown: {
        food: { percent: 20, offset: -58 },
        utilities: { percent: 58, offset: 0 },
        entertainment: { percent: 12, offset: -78 },
        transport: { percent: 10, offset: -90 }
      },
      trends: {
        val1: "₱1.5k",
        val2: "₱2.75k",
        y1: 100,
        y2: 50,
        label1: "Jul W1",
        label2: "Jul W2"
      }
    },
    Jun: {
      totalSpend: "₱8,250",
      weeklyAve: "₱2,062",
      dailyAve: "₱1,031",
      highestCategory: "Food",
      highestPercent: 45,
      breakdown: {
        food: { percent: 45, offset: 0 },
        utilities: { percent: 15, offset: -45 },
        entertainment: { percent: 25, offset: -60 },
        transport: { percent: 15, offset: -85 }
      },
      trends: {
        val1: "₱5k",
        val2: "₱3.25k",
        y1: 30,
        y2: 80,
        label1: "Jun W1",
        label2: "Jun W2"
      }
    }
  };

  const activeData = dataSets[selectedMonth] || dataSets.All;

  return (
    <div style={{ color: "#F3F4F6", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Title Header with Month Selector */}
      <div style={{ marginBottom: "36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#FFF", margin: "0 0 6px 0" }}>
            Overview
          </h1>
          <p style={{ color: "#718096", fontSize: "16px", margin: 0 }}>
            Your financial insights at a glance.
          </p>
        </div>

        {/* Month Selector dropdown */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            backgroundColor: "#111625",
            border: "1px solid #1b2135",
            borderRadius: "8px",
            padding: "10px 16px",
            color: "#A0AEC0",
            fontSize: "14px",
            fontWeight: "600",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="All">All Months</option>
          <option value="Jul">July</option>
          <option value="Jun">June</option>
        </select>
      </div>

      {/* Top Metric Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        
        {/* Total Monthly Spend Card */}
        <div style={{ backgroundColor: "#111625", border: "1px solid #1b2135", borderRadius: "16px", padding: "28px 24px", position: "relative", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d8f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span style={{ color: "#A0AEC0", fontSize: "15px", fontWeight: "600" }}>Total Spend</span>
            </div>
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "#FFF" }}>
            {activeData.totalSpend}
          </div>
          {/* Subtle background pulse icon graphic */}
          <div style={{ position: "absolute", right: "24px", bottom: "24px", opacity: 0.15 }}>
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none" stroke="#00d8f6" strokeWidth="2.5">
              <path d="M0 20 L20 20 L27 5 L37 35 L44 20 L60 20" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Weekly Average Card */}
        <div style={{ backgroundColor: "#111625", border: "1px solid #1b2135", borderRadius: "16px", padding: "28px 24px", position: "relative", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span style={{ color: "#A0AEC0", fontSize: "15px", fontWeight: "600" }}>Weekly Average</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "36px", fontWeight: "800", color: "#FFF" }}>{activeData.weeklyAve}</span>
            <span style={{ fontSize: "15px", color: "#718096" }}>/wk</span>
          </div>
          {/* Subtle calendar graphic */}
          <div style={{ position: "absolute", right: "24px", bottom: "24px", opacity: 0.15 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>

        {/* Daily Average Card */}
        <div style={{ backgroundColor: "#111625", border: "1px solid #1b2135", borderRadius: "16px", padding: "28px 24px", position: "relative", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3F51B5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span style={{ color: "#A0AEC0", fontSize: "15px", fontWeight: "600" }}>Daily Average</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "36px", fontWeight: "800", color: "#FFF" }}>{activeData.dailyAve}</span>
            <span style={{ fontSize: "15px", color: "#718096" }}>/day</span>
          </div>
          {/* Trend arrow graphic */}
          <div style={{ position: "absolute", right: "24px", bottom: "24px", opacity: 0.15 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3F51B5" strokeWidth="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
        </div>

        {/* Highest Category Card */}
        <div style={{ backgroundColor: "#111625", border: "1px solid #1b2135", borderRadius: "16px", padding: "28px 24px", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ color: "#A0AEC0", fontSize: "15px", fontWeight: "600" }}>Highest Category</span>
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "#FFF", marginBottom: "12px" }}>
            {activeData.highestCategory}
          </div>
          {/* Progress bar container */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flexGrow: 1, height: "8px", backgroundColor: "#1A202C", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${activeData.highestPercent}%`, height: "100%", backgroundColor: "#00d8f6", borderRadius: "4px" }}></div>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#718096" }}>{activeData.highestPercent}%</span>
          </div>
        </div>
      </div>

      {/* Charts Section Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
        
        {/* Spending Breakdown Card */}
        <div style={{ backgroundColor: "#111625", border: "1px solid #1b2135", borderRadius: "16px", padding: "28px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#FFF", margin: "0 0 24px 0", textAlign: "left" }}>
            Spending Breakdown
          </h2>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: "20px", flexWrap: "wrap" }}>
            {/* SVG Donut Chart */}
            <div style={{ position: "relative", width: "160px", height: "160px" }}>
              <svg width="160" height="160" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
                {/* Background circle */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1A202C" strokeWidth="3" />
                {/* Segments: Food (Cyan), Utilities (Purple), Entertainment (Green), Transport (Pink) */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#00d8f6" strokeWidth="3" strokeDasharray={`${activeData.breakdown.food?.percent || 0} ${100 - (activeData.breakdown.food?.percent || 0)}`} strokeDashoffset={activeData.breakdown.food?.offset || 0} />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#7928CA" strokeWidth="3" strokeDasharray={`${activeData.breakdown.utilities?.percent || 0} ${100 - (activeData.breakdown.utilities?.percent || 0)}`} strokeDashoffset={activeData.breakdown.utilities?.offset || 0} />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#00E676" strokeWidth="3" strokeDasharray={`${activeData.breakdown.entertainment?.percent || 0} ${100 - (activeData.breakdown.entertainment?.percent || 0)}`} strokeDashoffset={activeData.breakdown.entertainment?.offset || 0} />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#FF007A" strokeWidth="3" strokeDasharray={`${activeData.breakdown.transport?.percent || 0} ${100 - (activeData.breakdown.transport?.percent || 0)}`} strokeDashoffset={activeData.breakdown.transport?.offset || 0} />
              </svg>
              {/* Inner Label */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <span style={{ fontSize: "12px", color: "#A0AEC0", display: "block" }}>Total</span>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "#FFF" }}>{activeData.totalSpend}</span>
              </div>
            </div>

            {/* Color Legend */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#00d8f6" }}></span>
                <span style={{ fontSize: "14px", color: activeData.breakdown.food ? "#FFF" : "#718096", fontWeight: activeData.breakdown.food ? "bold" : "normal" }}>
                  Food ({activeData.breakdown.food?.percent || 0}%)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#7928CA" }}></span>
                <span style={{ fontSize: "14px", color: activeData.breakdown.utilities ? "#FFF" : "#718096", fontWeight: activeData.breakdown.utilities ? "bold" : "normal" }}>
                  Utilities ({activeData.breakdown.utilities?.percent || 0}%)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#00E676" }}></span>
                <span style={{ fontSize: "14px", color: activeData.breakdown.entertainment ? "#FFF" : "#718096", fontWeight: activeData.breakdown.entertainment ? "bold" : "normal" }}>
                  Entertainment ({activeData.breakdown.entertainment?.percent || 0}%)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FF007A" }}></span>
                <span style={{ fontSize: "14px", color: activeData.breakdown.transport ? "#FFF" : "#718096", fontWeight: activeData.breakdown.transport ? "bold" : "normal" }}>
                  Transport ({activeData.breakdown.transport?.percent || 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Trends Card */}
        <div style={{ backgroundColor: "#111625", border: "1px solid #1b2135", borderRadius: "16px", padding: "28px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#FFF", margin: "0 0 24px 0", textAlign: "left" }}>
            Spending Trends
          </h2>

          {/* SVG Line Chart */}
          <div style={{ width: "100%", height: "160px", position: "relative" }}>
            <svg width="100%" height="140" viewBox="0 0 400 140" preserveAspectRatio="none">
              {/* Horizontal helper gridlines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="#1A202C" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#1A202C" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="#1A202C" strokeWidth="1" strokeDasharray="4 4" />

              {/* Trend line */}
              <path d={`M 50 ${activeData.trends.y1} L 350 ${activeData.trends.y2}`} fill="none" stroke="#00d8f6" strokeWidth="3" strokeLinecap="round" />

              {/* Data points */}
              <circle cx="50" cy={activeData.trends.y1} r="5" fill="#00d8f6" stroke="#111625" strokeWidth="2" />
              <circle cx="350" cy={activeData.trends.y2} r="5" fill="#00d8f6" stroke="#111625" strokeWidth="2" />

              {/* Value labels */}
              <text x="50" y={activeData.trends.y1 - 15} fill="#A0AEC0" fontSize="11" textAnchor="middle">{activeData.trends.val1}</text>
              <text x="350" y={activeData.trends.y2 + 20} fill="#A0AEC0" fontSize="11" textAnchor="middle">{activeData.trends.val2}</text>

              {/* X Axis Labels */}
              <text x="50" y="138" fill="#718096" fontSize="12" textAnchor="middle">{activeData.trends.label1}</text>
              <text x="350" y="138" fill="#718096" fontSize="12" textAnchor="middle">{activeData.trends.label2}</text>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardView;
