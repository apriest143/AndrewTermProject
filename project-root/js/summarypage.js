const form = document.querySelector("form");
const display = document.getElementById("summaryDisplay");

// Load summaries from localStorage and render them
function loadSummaries() {
  const saved = JSON.parse(localStorage.getItem("climbSummaries") || "[]");
  saved.forEach((entry, index) => renderSummary(entry, index));
}

// Save summaries array to localStorage
function saveSummaries(data) {
  localStorage.setItem("climbSummaries", JSON.stringify(data));
}

// Render a single summary and its delete button
function renderSummary(summary, index) {
  const summaryEntry = document.createElement("div");
  summaryEntry.classList.add("summary-entry");
  summaryEntry.dataset.index = index;
  summaryEntry.style.borderBottom = "1px solid #ccc";
  summaryEntry.style.paddingBottom = "15px";
  summaryEntry.style.marginBottom = "20px";

  summaryEntry.innerHTML = `
    <h3 style="color:#427aa1;">Climb Summary</h3>
    <p><strong>Climb Name:</strong> ${summary.climbName}</p>
    <p><strong>Date(s):</strong> ${summary.date}</p>
    <p><strong>Rating:</strong> ${summary.rating}</p>
    <p><strong>Difficulty (VB Scale):</strong> ${
      summary.difficulty || "Not specified"
    }</p>
    <p><strong>Total Attempts:</strong> ${summary.attempts}</p>
    <p><strong>Completed:</strong> ${summary.completed}</p>
    <p><strong>Description:</strong> ${summary.description}</p>
  `;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete Summary";
  deleteBtn.style.backgroundColor = "#ff4d4d";
  deleteBtn.style.color = "#fff";
  deleteBtn.style.border = "none";
  deleteBtn.style.padding = "8px 12px";
  deleteBtn.style.borderRadius = "6px";
  deleteBtn.style.marginTop = "10px";
  deleteBtn.style.cursor = "pointer";

  deleteBtn.addEventListener("click", () => {
    const summaries = JSON.parse(
      localStorage.getItem("climbSummaries") || "[]"
    );
    summaries.splice(index, 1); // Remove that summary
    saveSummaries(summaries);
    refreshDisplay();
  });

  summaryEntry.appendChild(deleteBtn);
  display.appendChild(summaryEntry);
}

// Re-render all summaries
function refreshDisplay() {
  display.innerHTML = "";
  loadSummaries();
}

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newSummary = {
    climbName: document.getElementById("climbName").value,
    date: document.getElementById("date").value,
    rating: document.getElementById("rating").value,
    difficulty: document.getElementById("difficulty-select").value,
    attempts: document.getElementById("attempts").value,
    completed:
      document.querySelector('input[name="completed"]:checked')?.value ||
      "Not specified",
    description: document.getElementById("description").value,
  };

  const summaries = JSON.parse(localStorage.getItem("climbSummaries") || "[]");
  summaries.push(newSummary);
  saveSummaries(summaries);

  refreshDisplay();
  form.reset();
});

// Load existing summaries on page load
window.addEventListener("DOMContentLoaded", refreshDisplay);
