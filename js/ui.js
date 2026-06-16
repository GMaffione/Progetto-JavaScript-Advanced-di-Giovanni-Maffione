import _ from 'lodash';

/**
 * Modulo UI: responsabile esclusivamente del rendering e della manipolazione DOM.
 * Non contiene logica di business né chiamate API.
 */

export function showLoader(visible) {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.toggle('hidden', !visible);
}

export function showError(message) {
  const errorBox = document.getElementById('error-box');
  if (!errorBox) return;
  errorBox.textContent = message;
  errorBox.classList.toggle('hidden', !message);
}

export function clearResults() {
  const grid = document.getElementById('results-grid');
  const empty = document.getElementById('empty-state');
  if (grid) grid.innerHTML = '';
  if (empty) empty.classList.add('hidden');
}

export function showEmptyState(category) {
  const empty = document.getElementById('empty-state');
  if (!empty) return;
  empty.querySelector('.empty-msg').textContent =
    `Nessun libro trovato per la categoria "${category}". Prova con un'altra parola chiave.`;
  empty.classList.remove('hidden');
}

export function renderBooks(books, onDescriptionRequest) {
  const grid = document.getElementById('results-grid');
  if (!grid) return;

  grid.innerHTML = '';

  books.forEach((book) => {
    const authorsText = book.authors.length > 0
      ? book.authors.join(', ')
      : 'Autore non disponibile';

    const card = document.createElement('article');
    card.className = 'book-card';
    card.dataset.key = book.key;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-icon">📖</div>
        <h3 class="card-title">${escapeHtml(book.title)}</h3>
        <p class="card-authors"><span class="authors-label">di</span> ${escapeHtml(authorsText)}</p>
        <button class="btn-description" aria-label="Mostra descrizione di ${escapeHtml(book.title)}">
          Scopri il libro ↓
        </button>
        <div class="description-panel hidden">
          <div class="description-loading hidden">
            <span class="spinner-small"></span> Caricamento...
          </div>
          <p class="description-text"></p>
        </div>
      </div>
    `;

    const btn = card.querySelector('.btn-description');
    btn.addEventListener('click', () => onDescriptionRequest(book.key, card));

    grid.appendChild(card);
  });
}

export function renderDescription(card, text) {
  const panel = card.querySelector('.description-panel');
  const loading = card.querySelector('.description-loading');
  const descText = card.querySelector('.description-text');
  const btn = card.querySelector('.btn-description');

  loading.classList.add('hidden');
  panel.classList.remove('hidden');

  if (text) {
    descText.textContent = text;
  } else {
    descText.textContent = 'Descrizione non disponibile per questo libro.';
    descText.classList.add('no-description');
  }

  btn.textContent = 'Nascondi ↑';
  btn.dataset.open = 'true';
}

export function toggleDescriptionPanel(card) {
  const panel = card.querySelector('.description-panel');
  const btn = card.querySelector('.btn-description');
  const isOpen = btn.dataset.open === 'true';

  panel.classList.toggle('hidden', isOpen);
  btn.textContent = isOpen ? 'Scopri il libro ↓' : 'Nascondi ↑';
  btn.dataset.open = isOpen ? 'false' : 'true';
}

export function setDescriptionLoading(card, loading) {
  const loadingEl = card.querySelector('.description-loading');
  const panel = card.querySelector('.description-panel');
  if (loading) {
    panel.classList.remove('hidden');
    loadingEl.classList.remove('hidden');
  } else {
    loadingEl.classList.add('hidden');
  }
}

// Utility: protezione XSS
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, (m) => map[m]);
}
