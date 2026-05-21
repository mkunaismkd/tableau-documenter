import React, { useState } from 'react'
import { FunctionSquare, Search, EyeOff } from 'lucide-react'
import styles from './Panels.module.css'

export default function CalcsPanel({ calculatedFields }) {
  const [q, setQ] = useState('')

  const filtered = calculatedFields.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.formula.toLowerCase().includes(q.toLowerCase())
  )

  if (!calculatedFields.length) return (
    <div className={styles.empty}>
      <FunctionSquare size={32} strokeWidth={1.2} aria-hidden="true" />
      <p>No calculated fields found</p>
    </div>
  )

  return (
    <div>
      <div className={styles.searchBar}>
        <Search size={14} strokeWidth={1.8} aria-hidden="true" />
        <input
          type="text"
          placeholder="Search by name or formula..."
          value={q}
          onChange={e => setQ(e.target.value)}
          className={styles.searchInput}
          aria-label="Search calculated fields"
        />
        {q && <button className={styles.clearBtn} onClick={() => setQ('')} aria-label="Clear search">×</button>}
      </div>

      {filtered.length === 0 && <p style={{ color: '#888', fontSize: 13, padding: '1rem 0' }}>No results for "{q}"</p>}

      <div className={styles.list}>
        {filtered.map((c, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <FunctionSquare size={15} strokeWidth={1.8} aria-hidden="true" />
                <span>{c.name}</span>
                {c.datatype && <span className={`${styles.tag} ${styles.tagGreen}`}>{c.datatype}</span>}
                {c.role && <span className={`${styles.tag} ${c.role === 'measure' ? styles.tagBlue : styles.tagTeal}`}>{c.role}</span>}
                {c.hidden && (
                  <span className={`${styles.tag} ${styles.tagGray}`} title="Hidden field">
                    <EyeOff size={10} aria-hidden="true" /> hidden
                  </span>
                )}
              </div>
            </div>
            {c.comment && <p className={styles.comment}>{c.comment}</p>}
            <pre className={styles.formula}>{c.formula}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
