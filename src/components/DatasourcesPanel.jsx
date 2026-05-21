import React, { useState } from 'react'
import { Database, Table2, Code2, Columns3, ChevronDown, ChevronRight } from 'lucide-react'
import styles from './Panels.module.css'

function DSCard({ ds }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader} onClick={() => setOpen(o => !o)} style={{ cursor: 'pointer' }}>
        <div className={styles.cardTitle}>
          <Database size={16} strokeWidth={1.8} aria-hidden="true" />
          <span>{ds.name}</span>
          <span className={`${styles.tag} ${styles.tagBlue}`}>{ds.connectionType}</span>
          {ds.server && <span className={`${styles.tag} ${styles.tagTeal}`}>{ds.server}{ds.port ? ':' + ds.port : ''}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#888', fontSize: 12 }}>
          {ds.tables.length > 0 && <span>{ds.tables.length} tables</span>}
          {ds.columns.length > 0 && <span>{ds.columns.length} fields</span>}
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </div>

      {open && (
        <div className={styles.cardBody}>
          {(ds.database || ds.schema || ds.file) && (
            <div className={styles.metaRow}>
              {ds.database && <div className={styles.metaItem}><span className={styles.metaLabel}>Database</span><code>{ds.database}</code></div>}
              {ds.schema && <div className={styles.metaItem}><span className={styles.metaLabel}>Schema</span><code>{ds.schema}</code></div>}
              {ds.file && <div className={styles.metaItem}><span className={styles.metaLabel}>File</span><code>{ds.file}</code></div>}
            </div>
          )}

          {ds.tables.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}><Table2 size={13} aria-hidden="true" /> Tables</div>
              <div className={styles.tableList}>
                {ds.tables.map((t, i) => (
                  <div key={i} className={styles.tableRow}>
                    <code>{t.name}</code>
                    {t.type && t.type !== 'table' && <span className={`${styles.tag} ${styles.tagGray}`}>{t.type}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {ds.customSQLs.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}><Code2 size={13} aria-hidden="true" /> Custom SQL</div>
              {ds.customSQLs.map((sql, i) => (
                <pre key={i} className={styles.sqlBlock}>{sql}{sql.length >= 500 ? '...' : ''}</pre>
              ))}
            </div>
          )}

          {ds.columns.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}><Columns3 size={13} aria-hidden="true" /> Fields ({ds.columns.length})</div>
              <div className={styles.fieldGrid}>
                {ds.columns.map((c, i) => (
                  <div key={i} className={styles.fieldRow}>
                    <span className={styles.fieldName}>{c.name}</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {c.datatype && <span className={`${styles.tag} ${styles.tagGray}`}>{c.datatype}</span>}
                      {c.role && <span className={`${styles.tag} ${c.role === 'measure' ? styles.tagGreen : styles.tagBlue}`}>{c.role}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DatasourcesPanel({ datasources }) {
  if (!datasources.length) return (
    <div className={styles.empty}>
      <Database size={32} strokeWidth={1.2} aria-hidden="true" />
      <p>No datasources found</p>
    </div>
  )
  return (
    <div className={styles.list}>
      {datasources.map((ds, i) => <DSCard key={i} ds={ds} />)}
    </div>
  )
}
