// ---------------- 🤖 AI CHAT ----------------
async function sendMsg() {
  let msg = document.getElementById("msg").value;

  if (!msg) return;

  document.getElementById("reply").innerText = "Thinking...";

  try {
    let res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    let data = await res.json();

    console.log("CHAT:", data);

    document.getElementById("reply").innerText =
      data.reply || data.error || "No response";

  } catch (err) {
    console.error(err);
    document.getElementById("reply").innerText = "Error connecting to AI";
  }
}


// ---------------- 📈 SIP ----------------
async function calcSIP() {
  let monthly = document.getElementById("monthly").value;
  let rate = document.getElementById("rate").value;
  let years = document.getElementById("years").value;

  if (!monthly || !rate || !years) {
    document.getElementById("sipResult").innerText = "Enter all fields";
    return;
  }

  document.getElementById("sipResult").innerText = "Calculating...";

  try {
    let res = await fetch("/sip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthly, rate, years })
    });

    let data = await res.json();

    console.log("SIP:", data);

    document.getElementById("sipResult").innerText =
      "Future Value: ₹ " + (data.future_value || "Error");

    drawChart(monthly, rate, years);

  } catch (err) {
    console.error(err);
    document.getElementById("sipResult").innerText = "Error calculating SIP";
  }
}


// ---------------- 📊 SIP CHART ----------------
function drawChart(monthly, rate, years) {
  let months = years * 12;
  let values = [];
  let total = 0;
  let r = rate / 100 / 12;

  for (let i = 1; i <= months; i++) {
    total = (total + parseFloat(monthly)) * (1 + r);
    values.push(total);
  }

  new Chart(document.getElementById("sipChart"), {
    type: "line",
    data: {
      labels: Array.from({ length: months }, (_, i) => i + 1),
      datasets: [{
        label: "Growth",
        data: values
      }]
    }
  });
}


// ---------------- 📊 STOCK ----------------
async function getStock() {
  let stock = document.getElementById("stock").value;

  if (!stock) return;

  document.getElementById("stockResult").innerText = "Fetching...";

  try {
    let res = await fetch("/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock })
    });

    let data = await res.json();

    console.log("STOCK:", data);

    document.getElementById("stockResult").innerText =
      data.price ? "₹ " + data.price : (data.error || "Invalid stock");

  } catch (err) {
    console.error(err);
    document.getElementById("stockResult").innerText = "Stock error";
  }
}


// ---------------- 💸 TAX ----------------
async function calcTax() {
  let income = document.getElementById("income").value;

  if (!income) return;

  document.getElementById("taxResult").innerText = "Calculating...";

  try {
    let res = await fetch("/tax", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ income })
    });

    let data = await res.json();

    console.log("TAX:", data);

    document.getElementById("taxResult").innerText =
      "₹ " + (data.tax || data.error);

  } catch (err) {
    console.error(err);
    document.getElementById("taxResult").innerText = "Tax error";
  }
}


// ---------------- 📄 PDF UPLOAD ----------------
async function uploadFile() {
  let file = document.getElementById("file").files[0];

  if (!file) return;

  document.getElementById("pdfResult").innerText = "Uploading...";

  let formData = new FormData();
  formData.append("file", file);

  try {
    let res = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    let data = await res.json();

    console.log("PDF:", data);

    document.getElementById("pdfResult").innerText =
      data.data || data.error || "No result";

  } catch (err) {
    console.error(err);
    document.getElementById("pdfResult").innerText = "Upload error";
  }
}


// ---------------- 🧠 MULTI AGENT ----------------
async function runAgent() {
  const queryInput = document.getElementById("agentQuery");
  const resultDisplay = document.getElementById("agentResult");
  let query = queryInput.value.trim();

  if (!query) {
    resultDisplay.innerText = "⚠️ Please enter a query (e.g., sip 5000 12 10)";
    return;
  }

  // UI Feedback
  resultDisplay.innerText = "🧠 Thinking...";
  queryInput.value = ""; // Clear input for next query

  try {
    const res = await fetch("/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    // Check if the server actually returned a 200-299 status
    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();

    // Use innerText for security, but ensure the CSS has 'white-space: pre-wrap'
    resultDisplay.innerText = data.response || data.error || "No response from agent.";

  } catch (err) {
    console.error("AGENT_FETCH_ERROR:", err);
    resultDisplay.innerText = "❌ Agent error: Could not connect to the server.";
  }
}

// ---------------- 💰 MONEY SCORE ----------------
async function getScore() {
  let data = {
    income: document.getElementById("income2").value,
    expenses: document.getElementById("expenses").value,
    savings: document.getElementById("savings").value,
    investments: document.getElementById("investments").value,
    debt: document.getElementById("debt").value,
    emergency: document.getElementById("emergency").value
  };

  document.getElementById("scoreResult").innerText = "Calculating...";

  try {
    let res = await fetch("/money-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    let result = await res.json();

    console.log("SCORE:", result);

    let score = result.score;

    document.getElementById("scoreResult").innerText = score + "/100";

    let text = "";
    if (score >= 80) text = "Excellent 💚";
    else if (score >= 60) text = "Good 👍";
    else if (score >= 40) text = "Average ⚠️";
    else text = "Needs Improvement ❌";

    document.getElementById("scoreText").innerText = text;

  } catch (err) {
    console.error(err);
    document.getElementById("scoreResult").innerText = "Error";
  }
}
