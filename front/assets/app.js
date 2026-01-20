export const AUTH_BASE = 'http://localhost:3000';
// export const METADATA_BASE = 'http://localhost:4000';

/** Déconnecte l'utilisateur */
export function logout() {
  window.location.href = `${AUTH_BASE}/logout`;
}

/** Charge les infos utilisateur et met à jour l'affichage */
export async function loadUser() {
  try {
    const res = await fetch(`${AUTH_BASE}/profile`, { credentials: 'include' });

    if (!res.ok) {
      window.location.href = '/';
      return;
    }

    const { user } = await res.json(); // user contient sub, username, email

    // Affiche le username dans l'élément displayName
    const displayNameEl = document.getElementById('displayName');
    if (displayNameEl && user && user.username) {
      displayNameEl.textContent = user.username; // pas displayName, on utilise username
    }
  } catch (err) {
    console.error('Erreur lors du chargement de l’utilisateur:', err);
    window.location.href = '/';
  }
}

/** Initialise le layout et la navigation */
export async function loadLayout(activePage, contentHtml) {
  try {
    const layout = await fetch('partials/layout.html').then(r => r.text());
    document.body.innerHTML = layout;

    // Navigation sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
      const link = item.dataset.link;
      if (link === activePage) item.classList.add('active');
      if (link) item.onclick = () => location.href = link;
    });

    // Contenu principal
    const contentEl = document.getElementById('page-content');
    if (contentEl) contentEl.innerHTML = contentHtml;

    await loadUser();
  } catch (err) {
    console.error('Erreur lors du chargement du layout:', err);
  }
}
