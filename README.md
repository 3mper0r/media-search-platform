# 🔍 Media Search Platform

A high-performance search system for unstructured media metadata, built with **Next.js 14**, **TypeScript**, and a custom in-memory search engine.

---

## 🚀 Live Demo

👉 [Add your deployed link here]

---

## 📦 Repository

👉 [Add your GitHub repo link here]

---

## 📖 Overview

This project implements a lightweight yet scalable search experience over inconsistent and unstructured media metadata.

The goal is to:

* Improve search relevance
* Normalize inconsistent data
* Provide a fast, intuitive UI
* Demonstrate scalable search system design

---

## 🧠 High-Level Approach

The system is designed in four layers:

1. **Preprocessing Layer**

   * Normalizes raw data
   * Extracts structured fields from text

2. **Indexing Layer**

   * Builds an inverted index for fast lookup

3. **Search Engine**

   * Handles filtering, scoring, sorting, pagination

4. **Frontend UI**

   * Provides a responsive, user-friendly search experience

---

## ⚙️ Features

### 🔎 Search

* Full-text keyword search
* Multi-field search:

  * `suchtext` (primary)
  * `fotografen` (secondary)
  * `bildnummer` (optional)

### 🎯 Filters

* Credit (agency / photographer)
* Date range (ISO normalized)
* Restrictions (extracted from text)

### ↕️ Sorting

* By relevance (default)
* By date (ascending / descending)

### 📄 Pagination

* Page-based navigation
* Includes total results and total pages

### 📊 Analytics

* Total searches
* Average response time
* Top keywords
* Recent searches

### 🎨 UI/UX

* Debounced search input
* Skeleton loading
* Responsive grid layout
* Clean card-based design

---

## 🧩 Search & Relevance Strategy

### Fields & Weights

| Field      | Weight |
| ---------- | ------ |
| suchtext   | 1.0    |
| fotografen | 0.6    |
| bildnummer | 0.3    |

### Match Types

| Match Type | Multiplier |
| ---------- | ---------- |
| Exact      | ×2.0       |
| Prefix     | ×1.0       |

### Scoring Formula

```
score = Σ (field_weight × match_bonus)
```

### Key Behavior

* Multi-word queries increase ranking
* Items matching more terms rank higher
* Prefix matching supports partial search

---

## 🧹 Preprocessing Strategy

To improve consistency and search quality:

### Implemented Steps

* ✅ Tokenization (lowercase, clean text)
* ✅ Stop-word removal
* ✅ Date normalization (`DD.MM.YYYY → ISO`)
* ✅ Restriction extraction via regex
* ✅ Credit parsing (agency vs photographer)

### Why This Helps

* Reduces noise
* Improves relevance scoring
* Enables structured filtering
* Avoids repeated parsing at runtime

### When It Happens

* At **application startup (build-time in memory)**

### Updating with New Data

* New items are processed via:

```
appendItem()
```

* Index is updated incrementally

---

## 🗂️ Data & Indexing

### Inverted Index

```
token → Set<bildnummer>
```

### Benefits

* Avoids full dataset scans
* Fast candidate retrieval
* Scales efficiently to ~10k items

---

## 🔁 Continuous Ingestion Strategy

Assumption: New items arrive every minute.

### Current Approach

* In-memory append + incremental indexing

### Production Approach

* API ingestion endpoint
* Queue (e.g., Kafka / SQS)
* Background workers for indexing
* Near real-time updates

---

## ⚡ Performance Considerations

### Current (10k items)

* In-memory operations
* Fast (<10ms typical queries)
* Efficient filtering via index

### Scaling to Millions

Would replace in-memory search with:

* Elasticsearch / Meilisearch / Typesense

### Improvements at Scale

* Distributed indexing
* Fuzzy search
* Advanced ranking (BM25)
* Horizontal scaling

---

## 🧪 Testing Strategy

* Unit tests for:

  * Tokenization
  * Preprocessing
  * Scoring logic
  * Filters

* Integration tests:

  * `/api/search`

* Manual testing:

  * UI states
  * Edge cases

---

## ⚖️ Trade-offs

### Pros

* Simple and fast
* Fully controlled search logic
* Easy to extend

### Cons

* In-memory limits scalability
* Prefix matching not optimized for large datasets
* No fuzzy search yet

---

## 🧩 Assumptions

* Metadata is inconsistent and partially unstructured
* Restrictions are embedded in text
* Placeholder dates (e.g., `01.01.1900`) are invalid
* Dataset size initially manageable (~10k items)

---

## 🔮 What I Would Do Next

* Add fuzzy search (typo tolerance)
* Implement trie-based prefix indexing
* Introduce BM25 ranking
* Persist analytics (e.g., ClickHouse)
* Add highlight animations
* Improve accessibility (ARIA, keyboard navigation)

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14, React, TailwindCSS
* **Backend:** Next.js API Routes
* **Language:** TypeScript
* **State:** Custom hooks
* **Data:** In-memory + inverted index

---

## ▶️ Running Locally

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 📄 Documentation

A full technical document is included (PDF) covering:

* Architecture overview
* Search & relevance strategy
* Preprocessing pipeline
* Scaling approach
* Continuous ingestion
* Testing strategy
* Trade-offs

---

## 🧑‍💻 Author

Elidon Morina

---

## 📌 Final Note

This project demonstrates how to design a **search system from scratch**, balancing:

* Performance
* Simplicity
* Scalability
* Real-world data challenges

---

⭐ If you found this interesting, feel free to connect or reach out!
