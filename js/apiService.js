import axios from 'axios';
import _ from 'lodash';

const BASE_URL = 'https://openlibrary.org';

/**
 * Service Pattern: raccoglie tutta la logica di comunicazione con Open Library.
 * Disaccoppia i componenti UI dalle chiamate HTTP — nessun componente chiama
 * axios direttamente; tutto passa da qui.
 */
const apiService = {
  /**
   * Cerca libri per categoria (subject).
   * @param {string} category - es. "fantasy"
   * @returns {Promise<Array>} - array di libri normalizzati
   */
  async getBooksByCategory(category) {
    const slug = category.trim().toLowerCase().replace(/\s+/g, '_');
    const url = `${BASE_URL}/subjects/${slug}.json`;
    const response = await axios.get(url);

    const works = _.get(response, 'data.works', []);
    return works.map((work) => ({
      key: _.get(work, 'key', ''),
      title: _.get(work, 'title', 'Titolo non disponibile'),
      authors: _.get(work, 'authors', []).map((a) => _.get(a, 'name', 'Autore sconosciuto')),
    }));
  },

  /**
   * Recupera la descrizione completa di un libro dalla sua key.
   * @param {string} workKey - es. "/works/OL8193508W"
   * @returns {Promise<string>} - descrizione del libro
   */
  async getBookDescription(workKey) {
    const url = `${BASE_URL}${workKey}.json`;
    const response = await axios.get(url);

    const description = _.get(response, 'data.description', null);

    if (!description) return null;
    if (typeof description === 'string') return description;
    if (typeof description === 'object') return _.get(description, 'value', null);

    return null;
  },
};

export default apiService;
