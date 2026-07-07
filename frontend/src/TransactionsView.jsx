import { useState, useEffect } from "react";

function TransactionsView({ email, user_id }) {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("2026-07-07");
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [sortDirection, setSortDirection] = useState("desc");

  // Edit states
  const [editingId, setEditingId] = useState(null);

  // Trash bin states
  const [viewTrash, setViewTrash] = useState(false);

  // Modal confirmation states
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", onConfirm: null });

  // Helper to format date string from database format (e.g. YYYY-MM-DD) to frontend presentation
  const formatDateString = (dateStr) => {
    if (!dateStr) return "";
    const parsedDate = new Date(dateStr);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return parsedDate.toLocaleDateString("en-US", options);
  };

  // Load all active expenses
  const fetchExpenses = async () => {
    if (!user_id) return;
    try {
      const response = await fetch(`http://localhost:5001/api/expenses?user_id=${user_id}`);
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((tx) => ({
          ...tx,
          date: formatDateString(tx.date),
          amount: parseFloat(tx.amount),
        }));
        setTransactions(formattedData);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  // Load soft-deleted expenses
  const fetchTrash = async () => {
    if (!user_id) return;
    try {
      const response = await fetch(`http://localhost:5001/api/expenses/trash?user_id=${user_id}`);
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((tx) => ({
          ...tx,
          date: formatDateString(tx.date),
          amount: parseFloat(tx.amount),
        }));
        setTransactions(formattedData);
      }
    } catch (err) {
      console.error("Failed to fetch trash:", err);
    }
  };

  // Sync data fetch on mount or state toggling
  useEffect(() => {
    // If we start editing but toggle the trash view, clear editing state
    setEditingId(null);
    clearForm();

    if (viewTrash) {
      fetchTrash();
    } else {
      fetchExpenses();
    }
  }, [user_id, viewTrash]);

  // Open modal trigger helper
  const confirmAction = (title, message, onConfirm) => {
    setModalConfig({ title, message, onConfirm });
    setShowModal(true);
  };

  // Reset form inputs helper
  const clearForm = () => {
    setAmount("");
    setDescription("");
    setDate("2026-07-07");
    setCategory("Food");
  };

  // Form submit handler (supports both creating new and updating existing)
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      if (!user_id) {
        alert("You are not logged in.");
        return;
      }
      if (!amount) {
        alert("Please enter an amount");
        return;
      }
      if (isNaN(amount)) {
        alert("Please enter a valid amount");
        return;
      }
      if (!category) {
        alert("Please select a category");
        return;
      }
      if (!date) {
        alert("Please select a date");
        return;
      }

      if (editingId) {
        // SCENARIO A: Edit and Update Expense
        const response = await fetch(`http://localhost:5001/api/expenses/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            category,
            description: description || category,
            date,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const updatedTx = {
            ...data,
            date: formatDateString(data.date),
            amount: parseFloat(data.amount),
          };
          setTransactions(transactions.map((t) => (t.id === editingId ? updatedTx : t)));
          setEditingId(null);
          clearForm();
        } else {
          alert("Failed to update expense in the database.");
        }
      } else {
        // SCENARIO B: Create new Expense
        const response = await fetch("http://localhost:5001/api/expenses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            category,
            description: description || category,
            date,
            user_id,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const newTx = {
            ...data,
            date: formatDateString(data.date),
            amount: parseFloat(data.amount),
          };
          if (!viewTrash) {
            setTransactions([newTx, ...transactions]);
          }
          clearForm();
        } else {
          alert("Failed to save expense in the database.");
        }
      }
    } catch (error) {
      console.error("Error processing expense:", error);
      alert("Error processing expense. Please try again.");
    }
  };

  // Populate form with transaction data to initiate editing
  const handleEditClick = (tx) => {
    const dateObj = new Date(tx.date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const formattedDateForInput = `${year}-${month}-${day}`;

    setEditingId(tx.id);
    setAmount(tx.amount.toString());
    setCategory(tx.category);
    setDescription(tx.description === tx.category ? "" : tx.description);
    setDate(formattedDateForInput);
  };

  // Soft delete active expense handler
  const handleDeleteClick = (id) => {
    confirmAction(
      "Move to Trash?",
      "Are you sure you want to move this expense to the trash bin? You can restore it later.",
      async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/expenses/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            setTransactions(transactions.filter((t) => t.id !== id));
            if (editingId === id) {
              setEditingId(null);
              clearForm();
            }
          } else {
            alert("Failed to delete transaction.");
          }
        } catch (err) {
          console.error("Error deleting transaction:", err);
        }
      }
    );
  };

  // Restore trashed expense handler
  const handleRestoreClick = (id) => {
    confirmAction(
      "Restore Transaction?",
      "This transaction will be recovered back into your active logs.",
      async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/expenses/restore/${id}`, {
            method: "POST",
          });
          if (response.ok) {
            setTransactions(transactions.filter((t) => t.id !== id));
          } else {
            alert("Failed to restore transaction.");
          }
        } catch (err) {
          console.error("Error restoring transaction:", err);
        }
      }
    );
  };

  // Hard delete / purge single trashed expense handler
  const handlePurgeClick = (id) => {
    confirmAction(
      "Delete Permanently?",
      "Warning: This action cannot be undone. This expense will be permanently deleted from the database.",
      async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/expenses/purge/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            setTransactions(transactions.filter((t) => t.id !== id));
          } else {
            alert("Failed to delete transaction permanently.");
          }
        } catch (err) {
          console.error("Error purging transaction:", err);
        }
      }
    );
  };

  // Purge all trashed expenses handler
  const handleClearTrashClick = () => {
    confirmAction(
      "Empty Trash Bin?",
      "Warning: This will permanently delete all trashed expenses. This action cannot be undone.",
      async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/expenses/trash/clear?user_id=${user_id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            setTransactions([]);
          } else {
            alert("Failed to clear trash bin.");
          }
        } catch (err) {
          console.error("Error clearing trash:", err);
        }
      }
    );
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
          {viewTrash ? "Trash Bin" : "Log Expenses"}
        </h1>
        <p style={{ color: "#718096", fontSize: "16px", margin: 0 }}>
          {viewTrash ? "Recover or permanently delete trashed items." : "Track your daily spending."}
        </p>
      </div>

      {/* Two Column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px", alignItems: "start" }}>
        
        {/* Left Column: New Transaction Form */}
        <div style={{ backgroundColor: "#111625", border: "1px solid #1b2135", borderRadius: "16px", padding: "28px", textAlign: "left", opacity: viewTrash ? 0.5 : 1, pointerEvents: viewTrash ? "none" : "auto" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#FFF", margin: "0 0 24px 0" }}>
            {editingId ? "Edit Transaction" : "New Transaction"}
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
                  disabled={viewTrash}
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
                disabled={viewTrash}
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

            {/* Description input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ color: "#A0AEC0", fontSize: "14px", fontWeight: "500" }}>Add a short note (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={viewTrash}
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
                }}
              />
            </div>

            {/* Date selection */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ color: "#A0AEC0", fontSize: "14px", fontWeight: "500" }}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={viewTrash}
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

            {/* Submit / Cancel Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              <button
                type="submit"
                disabled={viewTrash}
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {editingId ? "Save Expense" : <><span style={{ fontSize: "16px", fontWeight: "bold" }}>+</span> Add Expense</>}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    clearForm();
                  }}
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    border: "1px solid #1b2135",
                    color: "#A0AEC0",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#718096";
                    e.currentTarget.style.color = "#FFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1b2135";
                    e.currentTarget.style.color = "#A0AEC0";
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Recent Transactions Table */}
        <div style={{ backgroundColor: "#111625", border: "1px solid #1b2135", borderRadius: "16px", padding: "28px", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#FFF", margin: 0 }}>
              {viewTrash ? "Deleted Transactions" : "Recent Transactions"}
            </h2>
            
            {/* Filter controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {viewTrash && transactions.length > 0 && (
                <button
                  onClick={handleClearTrashClick}
                  style={{
                    backgroundColor: "rgba(255, 82, 82, 0.1)",
                    border: "1px solid rgba(255, 82, 82, 0.2)",
                    color: "#FF5252",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 82, 82, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 82, 82, 0.1)";
                  }}
                >
                  Empty Trash
                </button>
              )}

              <button
                onClick={() => setViewTrash(!viewTrash)}
                style={{
                  backgroundColor: viewTrash ? "rgba(0, 216, 246, 0.1)" : "rgba(113, 128, 150, 0.1)",
                  border: `1px solid ${viewTrash ? "rgba(0, 216, 246, 0.2)" : "rgba(113, 128, 150, 0.2)"}`,
                  color: viewTrash ? "#00d8f6" : "#A0AEC0",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s ease",
                }}
              >
                {viewTrash ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Log
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Trash Bin
                  </>
                )}
              </button>

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
                {filteredAndSortedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: "32px 16px", textAlign: "center", color: "#718096", fontSize: "14px" }}>
                      {viewTrash ? "Trash bin is empty." : "No transactions logged yet."}
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedTransactions.map((tx) => {
                    const styleData = getCategoryStyles(tx.category);
                    const isEditingThis = editingId === tx.id;
                    return (
                      <tr key={tx.id} style={{ borderBottom: "1px solid #1c2333", backgroundColor: isEditingThis ? "rgba(0, 216, 246, 0.04)" : "transparent" }}>
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
                          {viewTrash ? (
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                              {/* Restore Button */}
                              <button
                                onClick={() => handleRestoreClick(tx.id)}
                                title="Restore"
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#718096",
                                  transition: "color 0.2s ease",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  padding: "4px",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#00d8f6"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#718096"}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2.5 2v6h6M21.5 22v-6h-6" />
                                  <path d="M22 11.5A10 10 0 0 0 9.5 2.5M2 12.5a10 10 0 0 0 12.5 9" />
                                </svg>
                              </button>
                              
                              {/* Purge Button */}
                              <button
                                onClick={() => handlePurgeClick(tx.id)}
                                title="Delete Permanently"
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#718096",
                                  transition: "color 0.2s ease",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  padding: "4px",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#FF5252"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#718096"}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  <line x1="10" y1="11" x2="10" y2="17" />
                                  <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                              {/* Edit Button */}
                              <button
                                onClick={() => handleEditClick(tx)}
                                title="Edit Expense"
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  color: isEditingThis ? "#00d8f6" : "#718096",
                                  transition: "color 0.2s ease-in-out",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "4px",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#00d8f6"}
                                onMouseLeave={(e) => e.currentTarget.style.color = isEditingThis ? "#00d8f6" : "#718096"}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>

                              {/* Soft Delete Button */}
                              <button
                                onClick={() => handleDeleteClick(tx.id)}
                                title="Move to Trash"
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
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(5, 7, 12, 0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
        }}>
          <div style={{
            backgroundColor: "#111625",
            border: "1px solid #1b2135",
            borderRadius: "16px",
            padding: "30px",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.7)",
            textAlign: "left"
          }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#FFF", fontSize: "18px", fontWeight: "700" }}>
              {modalConfig.title}
            </h3>
            <p style={{ margin: "0 0 24px 0", color: "#A0AEC0", fontSize: "14px", lineHeight: "1.5" }}>
              {modalConfig.message}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #1b2135",
                  color: "#A0AEC0",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  modalConfig.onConfirm();
                  setShowModal(false);
                }}
                style={{
                  backgroundColor: "#FF5252",
                  border: "none",
                  color: "#FFF",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionsView;
