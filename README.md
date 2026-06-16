# 🦉 Owly Book Finder

> Cerca libri per categoria e scopri il tuo prossimo libro preferito — powered by [Open Library](https://openlibrary.org).

---

## 🔗 Demo online

**[→ Prova l'applicazione](https://poetic-sprite-914f8e.netlify.app)**

---

## 📖 Descrizione

**Owly Book Finder** è un'applicazione web sviluppata nell'ambito del progetto Owly, una piattaforma SaaS nel settore education pensata per supportare bambini, insegnanti e famiglie nell'apprendimento quotidiano.

L'app permette di cercare libri per categoria (es. *fantasy*, *mystery*, *science*) sfruttando le API pubbliche di Open Library, e di visualizzare titolo, autori e descrizione completa di ogni libro.

### Funzionalità principali

- **Ricerca per categoria** — inserisci una parola chiave (es. `fantasy`) e ottieni un elenco di libri dalla libreria Open Library
- **Chip suggerimenti** — categorie preimpostate per iniziare subito a esplorare
- **Descrizione su richiesta** — clicca su *Scopri il libro* per caricare la descrizione completa con una seconda chiamata API
- **Cache client-side** — le descrizioni già caricate non vengono ri-scaricate
- **Gestione stati** — loader animato, messaggi di errore chiari, empty state dedicato

---

## 🛠 Tecnologie utilizzate

| Categoria       | Strumento                     |
|-----------------|-------------------------------|
| Linguaggio      | JavaScript ES6+               |
| Bundler         | [Vite](https://vitejs.dev)    |
| Testing         | [Vitest](https://vitest.dev)  |
| HTTP            | [Axios](https://axios-http.com) |
| Utilità dati    | [Lodash](https://lodash.com)  |
| API esterna     | [Open Library](https://openlibrary.org/dev/docs/api/subjects) |

---

## 🏗 Architettura

Il progetto adotta il **Service Pattern** come design pattern principale, con separazione netta delle responsabilità:

```
js/
├── apiService.js      # Service: tutta la logica di comunicazione con Open Library
├── ui.js              # UI module: rendering DOM, nessuna logica di business
├── main.js            # Orchestratore: gestione eventi, connette Service e UI
└── apiService.test.js # Test unitari con Vitest (mock di Axios)
```

**Perché il Service Pattern?**
Il `apiService.js` incapsula tutte le chiamate HTTP. I moduli `ui.js` e `main.js` non importano mai Axios direttamente. Questo disaccoppiamento rende le funzioni facilmente testabili (basta mockare il Service) e permette di cambiare la sorgente dati senza toccare la UI.

---

## 📁 Struttura progetto

```
owly-books/
├── index.html          # Markup principale
├── css/
│   └── style.css       # Stili (Nunito font, palette Owly viola/giallo)
├── js/
│   ├── apiService.js
│   ├── ui.js
│   ├── main.js
│   └── apiService.test.js
├── img/                # Immagini statiche
├── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Avvio in locale

### Prerequisiti

- Node.js >= 18
- npm >= 9

### Installazione

```bash
git clone https://github.com/GMaffione/Progetto-Javascript-Advanced.git
cd owly-books
npm install
```

### Sviluppo

```bash
npm run dev
```

Apri (https://poetic-sprite-914f8e.netlify.app/) nel browser.

### Build di produzione

```bash
npm run build
npm run preview
```

### Test

```bash
npm test
```

---

## 🧪 Test automatici

I test coprono il modulo `apiService.js` con **9 unit test** che verificano:

- Normalizzazione e costruzione corretta degli URL
- Parsing della risposta per lista libri
- Gestione della descrizione come stringa o come oggetto
- Comportamento con risposte vuote o assenti
- Propagazione degli errori HTTP

```bash
npm test
# → 9 passed (9)
```

---

## 🌐 Deploy

L'applicazione è deployata su **Netlify**.

[![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://poetic-sprite-914f8e.netlify.app)

---

## 👤 Autore

**Giovanni Maffione**

