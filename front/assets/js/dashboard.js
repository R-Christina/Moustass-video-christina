import { loadLayout } from '../app';

async function getCurrentUser() {
  const res = await fetch('/auth/profile', { credentials: 'include' });
  if (!res.ok) throw new Error('Utilisateur non connecté');
  return res.json();
}

async function displayDashboard(user) {
  await loadLayout('dashboard.html', `
    <div class="dashboard">
      <h1>Bonjour, ${user.username} !</h1>
    </div>
  `);
}

function displayError(message) {
  const root = document.getElementById('dashboard-root');
  root.innerHTML = `<h1 style="color:red">❌ Erreur : ${message}</h1>`;
}

async function init() {
  try {
    const user = await getCurrentUser();
    await displayDashboard(user);
  } catch (err) {
    console.error(err);
    displayError(err.message);
  }
}

init();
