import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Import dopo il mock
const { default: apiService } = await import('../js/apiService.js');

describe('apiService.getBooksByCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('restituisce un array di libri normalizzati', async () => {
    axios.get.mockResolvedValue({
      data: {
        works: [
          {
            key: '/works/OL123W',
            title: 'The Hobbit',
            authors: [{ name: 'J.R.R. Tolkien' }],
          },
          {
            key: '/works/OL456W',
            title: 'Harry Potter',
            authors: [{ name: 'J.K. Rowling' }],
          },
        ],
      },
    });

    const result = await apiService.getBooksByCategory('fantasy');

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      key: '/works/OL123W',
      title: 'The Hobbit',
      authors: ['J.R.R. Tolkien'],
    });
    expect(result[1].title).toBe('Harry Potter');
  });

  it('restituisce array vuoto se works non è presente', async () => {
    axios.get.mockResolvedValue({ data: {} });
    const result = await apiService.getBooksByCategory('xyz-categoria-inesistente');
    expect(result).toEqual([]);
  });

  it('gestisce libri senza autori', async () => {
    axios.get.mockResolvedValue({
      data: {
        works: [{ key: '/works/OL789W', title: 'Libro senza autore', authors: [] }],
      },
    });

    const result = await apiService.getBooksByCategory('test');
    expect(result[0].authors).toEqual([]);
  });

  it('costruisce la URL corretta con slug normalizzato', async () => {
    axios.get.mockResolvedValue({ data: { works: [] } });
    await apiService.getBooksByCategory('Science Fiction');
    expect(axios.get).toHaveBeenCalledWith(
      'https://openlibrary.org/subjects/science_fiction.json'
    );
  });

  it('propaga l\'errore se la chiamata HTTP fallisce', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    await expect(apiService.getBooksByCategory('fantasy')).rejects.toThrow('Network Error');
  });
});

describe('apiService.getBookDescription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('restituisce la descrizione come stringa', async () => {
    axios.get.mockResolvedValue({
      data: { description: 'Una storia fantastica.' },
    });

    const result = await apiService.getBookDescription('/works/OL123W');
    expect(result).toBe('Una storia fantastica.');
  });

  it('gestisce la descrizione come oggetto con campo value', async () => {
    axios.get.mockResolvedValue({
      data: { description: { type: '/type/text', value: 'Descrizione come oggetto.' } },
    });

    const result = await apiService.getBookDescription('/works/OL456W');
    expect(result).toBe('Descrizione come oggetto.');
  });

  it('restituisce null se la descrizione non è presente', async () => {
    axios.get.mockResolvedValue({ data: {} });
    const result = await apiService.getBookDescription('/works/OL789W');
    expect(result).toBeNull();
  });

  it('costruisce la URL corretta dalla workKey', async () => {
    axios.get.mockResolvedValue({ data: { description: 'Test.' } });
    await apiService.getBookDescription('/works/OL8193508W');
    expect(axios.get).toHaveBeenCalledWith(
      'https://openlibrary.org/works/OL8193508W.json'
    );
  });
});
