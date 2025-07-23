let goals = [];

function addGoal() {
  const avatar = document.getElementById("avatarSelect").value;
  const name = document.getElementById("goalName").value.trim();
  const amount = parseInt(document.getElementById("goalAmount").value);
  if (!name || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid goal name and amount.");
    return;
  }
  const goal = {
    id: Date.now(),
    avatar,
    name,
    target: amount,
    saved: 0
  };
  goals.push(goal);
  document.getElementById("goalName").value = "";
  document.getElementById("goalAmount").value = "";
  renderGoals();
}

function addMoney(goalId) {
  const input = document.getElementById(`amount-${goalId}`);
  const amount = parseInt(input.value);
  if (isNaN(amount) || amount <= 0) {
    alert("Enter a valid amount to save.");
    return;
  }
  const goal = goals.find((g) => g.id === goalId);
  goal.saved += amount;
  input.value = "";
  renderGoals();
}

function renderGoals() {
  const container = document.getElementById("goalsList");
  container.innerHTML = "";
  goals.forEach((goal) => {
    const remaining = goal.target - goal.saved;
    const percent = Math.min((goal.saved / goal.target) * 100, 100).toFixed(1);
    const card = document.createElement("div");
    card.className = "goal-card";
    card.innerHTML = `
          <div class="goal-header">
            <span>${goal.avatar}</span>
            <strong class="goal-name">${goal.name}</strong>
          </div>

          <div class="info">🎯 Goal Amount: <span class="highlight">KSh ${
            goal.target
          }</span></div>
          <div class="info">💰 Saved: <span class="highlight">KSh ${
            goal.saved
          }</span></div>
          <div class="info">⌛ Remaining: <span class="highlight">KSh ${Math.max(
            0,
            remaining
          )}</span></div>

          <div class="progress-container">
            <div class="progress-bar" style="width: ${percent}%"></div>
          </div>

          ${
            goal.saved >= goal.target
              ? `<div class="celebration">🎉 Hooray! ${goal.avatar} saved enough for <strong>${goal.name}</strong>!</div>`
              : `
              <div class="goal-input-container">
                <input type="number" id="amount-${goal.id}" placeholder="➕ Add KSh..." />
                <button onclick="addMoney(${goal.id})">Save</button>
              </div>
            `
          }
        `;
    container.appendChild(card);
  });
}
