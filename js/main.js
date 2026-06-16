import apiService from './apiService.js';
import {
  showLoader,
  showError,
  clearResults,
  showEmptyState,
  renderBooks,
  renderDescription,
  toggleDescriptionPanel,
  setDescriptionLoading,
} from './ui.js';

/**
 * Cache descrizioni già caricate — evita chiamate API duplicate.
 * Chiave: workKey stringa. Valore: testo descrizione (o null).
 */
const descriptionCache = new Map();

/**
 * Traccia quali card hanno già la descrizione caricata (o in caricamento).
 */
const loadedDescriptions = new Set();

async function handleSearch(category) {
  if (!category) {
    showError('Inserisci una categoria per cercare i libri.');
    return;
  }

  clearResults();
  showError('');
  showLoader(true);
  loadedDescriptions.clear();

  try {
    const books = await apiService.getBooksByCategory(category);

    showLoader(false);

    if (books.length === 0) {
      showEmptyState(category);
      return;
    }

    renderBooks(books, handleDescriptionRequest);

    // Aggiorna il contatore risultati
    const counter = document.getElementById('results-count');
    if (counter) {
      counter.textContent = `${books.length} libri trovati per "${category}"`;
      counter.classList.remove('hidden');
    }
  } catch (err) {
    showLoader(false);
    if (err.response?.status === 404) {
      showEmptyState(category);
    } else {
      showError('Errore durante la ricerca. Controlla la connessione e riprova.');
    }
  }
}

async function handleDescriptionRequest(workKey, card) {
  // Se la descrizione è già visibile, fai solo toggle
  if (loadedDescriptions.has(workKey)) {
    toggleDescriptionPanel(card);
    return;
  }

  // Segna come in caricamento
  loadedDescriptions.add(workKey);
  setDescriptionLoading(card, true);

  try {
    let description;

    if (descriptionCache.has(workKey)) {
      description = descriptionCache.get(workKey);
    } else {
      description = await apiService.getBookDescription(workKey);
      descriptionCache.set(workKey, description);
    }

    renderDescription(card, description);
  } catch {
    loadedDescriptions.delete(workKey);
    setDescriptionLoading(card, false);
    renderDescription(card, null);
  }
}

function init() {
  const form = document.getElementById('search-form');
  const input = document.getElementById('category-input');
  const clearBtn = document.getElementById('clear-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = input.value.trim();
    handleSearch(category);
  });

  // Clear button nel campo di input
  input.addEventListener('input', () => {
    clearBtn.classList.toggle('hidden', input.value.length === 0);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.add('hidden');
    input.focus();
    clearResults();
    showError('');
    const counter = document.getElementById('results-count');
    if (counter) counter.classList.add('hidden');
  });

  // Chip suggerimenti categoria
  document.querySelectorAll('.hint-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const hint = chip.dataset.hint;
      input.value = hint;
      clearBtn.classList.remove('hidden');
      handleSearch(hint);
    });
  });

  // Focus automatico all'avvio
  input.focus();
}

document.addEventListener('DOMContentLoaded', init);
