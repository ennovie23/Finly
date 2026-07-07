import { useState, useEffect } from "react";

function DashboardView({ email, user_id }) {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [transactions, setTransactions] = useState([]);

  // Load all expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, [user_id]);

  const fetchExpenses = async () => {
    if (!user_id) return;
    try {
      const response = await fetch(`http://localhost:5001/api/expenses?user_id=${user_id}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Failed to fetch expenses in dashboard overview:", err);
    }
  };

  const getMonthName = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[dateObj.getMonth()];
  };

  // Filter transactions based on selected month
  const filteredTxs = transactions.filter((tx) => {
    if (selectedMonth === "All") return true;
    return getMonthName(tx.date) === selectedMonth;
  });

  // 1. Total Spend
  const totalSpendVal = filteredTxs.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
  const totalSpendFormatted = `₱${totalSpendVal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // 2. Weekly Average (assume 4 weeks per month)
  const weeklyAveVal = totalSpendVal / 4;
  const weeklyAveFormatted = `₱${weeklyAveVal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // 3. Daily Average (assume 30 days per month)
  const dailyAveVal = totalSpendVal / 30;
  const dailyAveFormatted = `₱${dailyAveVal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // 4. Category Breakdown calculations
  const categories = { Food: 0, Transport: 0, Utilities: 0, Entertainment: 0 };
  filteredTxs.forEach((tx) => {
    let catKey = tx.category;
    if (catKey === "Food" || catKey === "Transport" || catKey === "Utilities" || catKey === "Entertainment") {
      categories[catKey] += parseFloat(tx.amount || 0);
    }
  });

  const catPercentages = {};
  let highestCategory = "None";
  let highestVal = 0;
  let highestPercent = 0;

  const totalCategorySpend = Object.values(categories).reduce((s, v) => s + v, 0);
  if (totalCategorySpend > 0) {
    Object.keys(categories).forEach((cat) => {
      const pct = Math.round((categories[cat] / totalCategorySpend) * 100);
      catPercentages[cat] = pct;
      if (categories[cat] > highestVal) {
        highestVal = categories[cat];
        highestCategory = cat;
        highestPercent = pct;
      }
    });
  }

  // Calculate donut offsets
  let runningOffset = 0;
  const breakdown = {};
  ["Food", "Utilities", "Entertainment", "Transport"].forEach((cat) => {
    const pct = catPercentages[cat] || 0;
    breakdown[cat.toLowerCase()] = {
      percent: pct,
      offset: -runningOffset,
    };
    runningOffset += pct;
  });

  // 5. Line Chart (Trends)
  const getMonthSpend = (monthName) => {
    return transactions
      .filter((tx) => getMonthName(tx.date) === monthName)
      .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
  };

  const juneSpend = getMonthSpend("Jun");
  const julySpend = getMonthSpend("Jul");

  const formatCurrencySimple = (val) => {
    if (val >= 1000) {
      return `₱${(val / 1000).toFixed(1)}k`;
    }
    return `₱${val}`;
  };

  const trendVal1 = formatCurrencySimple(juneSpend);
  const trendVal2 = formatCurrencySimple(julySpend);

  const maxTrendSpend = Math.max(juneSpend, julySpend, 1000);
  const trendY1 = 100 - (juneSpend / maxTrendSpend) * 80;
  const trendY2 = 100 - (julySpend / maxTrendSpend) * 80;

  return (
    <div style={{ color: "var(--text-primary)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Title Header with Month Selector */}
      <div style={{ marginBottom: "36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 6px 0" }}>
            Overview
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", margin: 0 }}>
            Your financial insights at a glance.
          </p>
        </div>

        {/* Month Selector dropdown */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "10px 16px",
            color: "var(--text-primary)",
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
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "28px 24px", position: "relative", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d8f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span style={{ color: "var(--text-secondary)", fontSize: "15px", fontWeight: "600" }}>Total Spend</span>
            </div>
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--text-primary)" }}>
            {totalSpendFormatted}
          </div>
          {/* Subtle background pulse icon graphic */}
          <div style={{ position: "absolute", right: "24px", bottom: "24px", opacity: 0.15 }}>
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none" stroke="#00d8f6" strokeWidth="2.5">
              <path d="M0 20 L20 20 L27 5 L37 35 L44 20 L60 20" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Weekly Average Card */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "28px 24px", position: "relative", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span style={{ color: "var(--text-secondary)", fontSize: "15px", fontWeight: "600" }}>Weekly Average</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "36px", fontWeight: "800", color: "var(--text-primary)" }}>{weeklyAveFormatted}</span>
            <span style={{ fontSize: "15px", color: "var(--text-secondary)" }}>/wk</span>
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
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "28px 24px", position: "relative", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3F51B5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span style={{ color: "var(--text-secondary)", fontSize: "15px", fontWeight: "600" }}>Daily Average</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "36px", fontWeight: "800", color: "var(--text-primary)" }}>{dailyAveFormatted}</span>
            <span style={{ fontSize: "15px", color: "var(--text-secondary)" }}>/day</span>
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
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "28px 24px", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ color: "var(--text-secondary)", fontSize: "15px", fontWeight: "600" }}>Highest Category</span>
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "12px" }}>
            {highestCategory}
          </div>
          {/* Progress bar container */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flexGrow: 1, height: "8px", backgroundColor: "var(--bg-card-inner)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${highestPercent}%`, height: "100%", backgroundColor: "#00d8f6", borderRadius: "4px" }}></div>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-secondary)" }}>{highestPercent}%</span>
          </div>
        </div>
      </div>

      {/* Charts Section Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
        
        {/* Spending Breakdown Card */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "28px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 24px 0", textAlign: "left" }}>
            Spending Breakdown
          </h2>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: "20px", flexWrap: "wrap" }}>
            {/* SVG Donut Chart */}
            <div style={{ position: "relative", width: "160px", height: "160px" }}>
              <svg width="160" height="160" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
                {/* Background circle */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--bg-card-inner)" strokeWidth="3" />
                {/* Segments: Food (Cyan), Utilities (Purple), Entertainment (Green), Transport (Pink) */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#00d8f6" strokeWidth="3" strokeDasharray={`${breakdown.food?.percent || 0} ${100 - (breakdown.food?.percent || 0)}`} strokeDashoffset={breakdown.food?.offset || 0} />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#7928CA" strokeWidth="3" strokeDasharray={`${breakdown.utilities?.percent || 0} ${100 - (breakdown.utilities?.percent || 0)}`} strokeDashoffset={breakdown.utilities?.offset || 0} />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#00E676" strokeWidth="3" strokeDasharray={`${breakdown.entertainment?.percent || 0} ${100 - (breakdown.entertainment?.percent || 0)}`} strokeDashoffset={breakdown.entertainment?.offset || 0} />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#FF007A" strokeWidth="3" strokeDasharray={`${breakdown.transport?.percent || 0} ${100 - (breakdown.transport?.percent || 0)}`} strokeDashoffset={breakdown.transport?.offset || 0} />
              </svg>
              {/* Inner Label */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block" }}>Total</span>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)" }}>{totalSpendFormatted}</span>
              </div>
            </div>

            {/* Color Legend */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#00d8f6" }}></span>
                <span style={{ fontSize: "14px", color: breakdown.food?.percent > 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: breakdown.food?.percent > 0 ? "bold" : "normal" }}>
                  Food ({breakdown.food?.percent || 0}%)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#7928CA" }}></span>
                <span style={{ fontSize: "14px", color: breakdown.utilities?.percent > 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: breakdown.utilities?.percent > 0 ? "bold" : "normal" }}>
                  Utilities ({breakdown.utilities?.percent || 0}%)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#00E676" }}></span>
                <span style={{ fontSize: "14px", color: breakdown.entertainment?.percent > 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: breakdown.entertainment?.percent > 0 ? "bold" : "normal" }}>
                  Entertainment ({breakdown.entertainment?.percent || 0}%)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FF007A" }}></span>
                <span style={{ fontSize: "14px", color: breakdown.transport?.percent > 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: breakdown.transport?.percent > 0 ? "bold" : "normal" }}>
                  Transport ({breakdown.transport?.percent || 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Spend Trends Line Chart */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "28px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 10px 0", textAlign: "left" }}>
            Monthly Spend Trends
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "0 0 28px 0", textAlign: "left" }}>
            Comparison between June and July total spending.
          </p>

          <div style={{ position: "relative", width: "100%", height: "140px", boxSizing: "border-box" }}>
            {/* SVG Line Chart */}
            <svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="100" x2="300" y2="100" stroke="var(--bg-card-inner)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="60" x2="300" y2="60" stroke="var(--bg-card-inner)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="20" x2="300" y2="20" stroke="var(--bg-card-inner)" strokeWidth="1" strokeDasharray="4 4" />

              {/* Gradient beneath the line */}
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d8f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00d8f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={`M 50 ${trendY1} L 250 ${trendY2} L 250 100 L 50 100 Z`} fill="url(#lineGrad)" />

              {/* Main Line */}
              <path d={`M 50 ${trendY1} L 250 ${trendY2}`} fill="none" stroke="#00d8f6" strokeWidth="3" />

              {/* Line nodes */}
              <circle cx="50" cy={trendY1} r="5" fill="#FFF" stroke="#00d8f6" strokeWidth="3.5" />
              <circle cx="250" cy={trendY2} r="5" fill="#FFF" stroke="#00d8f6" strokeWidth="3.5" />
            </svg>

            {/* Labels and values overlay */}
            <div style={{ position: "absolute", left: "20px", top: `${trendY1 - 25}px`, color: "#00d8f6", fontSize: "14px", fontWeight: "bold" }}>
              {trendVal1}
            </div>
            <div style={{ position: "absolute", left: "20px", bottom: "-10px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: "600" }}>
              June
            </div>

            <div style={{ position: "absolute", right: "20px", top: `${trendY2 - 25}px`, color: "#00d8f6", fontSize: "14px", fontWeight: "bold" }}>
              {trendVal2}
            </div>
            <div style={{ position: "absolute", right: "20px", bottom: "-10px", color: "var(--text-secondary)", fontSize: "12px", fontWeight: "600" }}>
              July
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
