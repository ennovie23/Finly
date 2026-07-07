import { useState } from "react";

function TransactionsView() {
  const [transactions, setTransactions] = useState([
    { id: 1, date: "Jul 5, 2026", description: "Food", category: "Food", amount: 850.00 },
    { id: 2, date: "Jul 4, 2026", description: "Transport", category: "Transport", amount: 300.00 },
    { id: 3, date: "Jul 3, 2026", description: "Utilities", category: "Utilities", amount: 2500.00 },
    { id: 4, date: "Jul 2, 2026", description: "Entertainment", category: "Entertainment", amount: 1200.00 },
    { id: 5, date: "Jun 30, 2026", description: "Food", category: "Food", amount: 1450.00 },
    { id: 6, date: "Jun 28, 2026", description: "Food", category: "Food", amount: 980.00 },
    { id: 7, date: "Jun 25, 2026", description: "Transport", category: "Transport", amount: 620.00 },
  ]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("2026-07-07");
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [sortDirection, setSortDirection] = useState("desc");

  // Form submit handler
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;

    // Format date string from YYYY-MM-DD to "Month Day, Year"
    const parsedDate = new Date(date);
    const options = { month: "short", day: "numeric", year: "numeric" };
    const formattedDate = parsedDate.toLocaleDateString("en-US", options);

    const newTx = {
      id: Date.now(),
      date: formattedDate,
      description: category,
      category: category,
      amount: parseFloat(amount),
    };

    setTransactions([newTx, ...transactions]);
    setAmount("");
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Toggle sort direction
  const handleSortToggle = () => {
    setSortDirection(sortDirection === "desc" ? "asc" : "desc");
  };

  // Badge stylings per category
  const getCategoryStyles = (cat) => {
    switch (cat) {
      case "Food":
        return { color: "#00d8f6", bg: "rgba(0, 216, 246, 0.1)", dot: "#00d8f6" };
      case "Transport":
        return { color: "#FF007A", bg: "rgba(255, 0, 122, 0.1)", dot: "#FF007A" };
      case "Utilities":
        return { color: "#9F7AEA", bg: "rgba(121, 40, 202, 0.1)", dot: "#9F7AEA" };
      case "Entertainment":
        return { color: "#00E676", bg: "rgba(0, 230, 118, 0.1)", dot: "#00E676" };
      default:
        return { color: "#A0AEC0", bg: "rgba(160, 174, 192, 0.1)", dot: "#A0AEC0" };
    }
  };

  // Filter and sort transactions
  const filteredAndSortedTransactions = transactions
    .filter((tx) => {
      if (selectedMonth === "All") return true;
      return tx.date.startsWith(selectedMonth);
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <div style={{ color: "#F3F4F6", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px", textAlign: "left" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#FFF", margin: "0 0 6px 0" }}>
          Log Expenses
        </h1>
        <p style={{ color: "#718096", fontSize: "16px", margin: 0 }}>
          Track your daily spending.
        </p>
      </div>

      {/* Two Column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px", alignItems: "start" }}>
        
        {/* Left Column: New Transaction Form */}
        <div style={{ backgroundColor: "#111625", border: "1px solid #1b2135", borderRadius: "16px", padding: "28px", textAlign: "left" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#FFF", margin: "0 0 24px 0" }}>
            New Transaction
          </h2>

          <form onSubmit={handleAddExpense} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Amount input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ color: "#A0AEC0", fontSize: "14px", fontWeight: "500" }}>Amount (₱)</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "12px", color: "#718096", fontSize: "15px" }}>₱</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#080B11",
                    border: "1px solid #1b2135",
                    borderRadius: "8px",
                    padding: "12px 16px 12px 32px",
                    color: "#FFF",
                    fontSize: "15px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Category selection */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ color: "#A0AEC0", fontSize: "14px", fontWeight: "500" }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#080B11",
                  border: "1px solid #1b2135",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#FFF",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            {/* Date selection */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ color: "#A0AEC0", fontSize: "14px", fontWeight: "500" }}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#080B11",
                  border: "1px solid #1b2135",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#FFF",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onMouseEnter={() => setIsBtnHovered(true)}
              onMouseLeave={() => setIsBtnHovered(false)}
              style={{
                width: "100%",
                backgroundColor: isBtnHovered ? "#00e5ff" : "#00b6d3",
                color: "#080B11",
                border: "none",
                borderRadius: "8px",
                padding: "14px",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>+</span> Add Expense
            </button>
          </form>
        </div>

        {/* Right Column: Recent Transactions Table */}
        <div style={{ backgroundColor: "#111625", border: "1px solid #1b2135", borderRadius: "16px", padding: "28px", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#FFF", margin: 0 }}>
              Recent Transactions
            </h2>
            
            {/* Filter controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  backgroundColor: "#080B11",
                  border: "1px solid #1b2135",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  color: "#A0AEC0",
                  fontSize: "13px",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="All">All Months</option>
                <option value="Jul">July</option>
                <option value="Jun">June</option>
              </select>
              <span style={{ color: "#718096", fontSize: "13px" }}>{filteredAndSortedTransactions.length} entries</span>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1b2135" }}>
                  <th 
                    onClick={handleSortToggle}
                    style={{ 
                      padding: "12px 16px", 
                      color: "#718096", 
                      fontSize: "13px", 
                      fontWeight: "600", 
                      textTransform: "uppercase", 
                      letterSpacing: "0.5px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    Date {sortDirection === "desc" ? "▼" : "▲"}
                  </th>
                  <th style={{ padding: "12px 16px", color: "#718096", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Category</th>
                  <th style={{ padding: "12px 16px", color: "#718096", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Amount</th>
                  <th style={{ padding: "12px 16px", color: "#718096", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTransactions.map((tx) => {
                  const styleData = getCategoryStyles(tx.category);
                  return (
                    <tr key={tx.id} style={{ borderBottom: "1px solid #1c2333" }}>
                      <td style={{ padding: "16px", fontSize: "14px", color: "#A0AEC0" }}>{tx.date}</td>
                      <td style={{ padding: "16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: styleData.bg,
                            color: styleData.color,
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: styleData.dot }}></span>
                          {tx.category}
                        </span>
                      </td>
                      <td style={{ padding: "16px", fontSize: "14px", fontWeight: "700", color: "#FFF" }}>
                        ₱{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#718096",
                            transition: "color 0.2s ease-in-out",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "#FF5252"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "#718096"}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TransactionsView;
