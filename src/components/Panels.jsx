import React from 'react'
import { SlidersHorizontal, LayoutDashboard, Table2, BookOpen } from 'lucide-react'
import styles from './Panels.module.css'

export function ParamsPanel({ parameters }) {
  if (!parameters.length) return (
    <div className={styles.empty}>
      <SlidersHorizontal size={32} strokeWidth={1.2} aria-hidden="true" />
      <p>No parameters found</p>
    </div>
  )

  return (
    <div className={styles.list}>
      {parameters.map((p, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <SlidersHorizontal size={15} strokeWidth={1.8} aria-hidden="true" />
              <span>{p.name}</span>
              {p.datatype && <span className={`${styles.tag} ${styles.tagAmber}`}>{p.datatype}</span>}
              {p.domainType && <span className={`${styles.tag} ${styles.tagGray}`}>{p.domainType}</span>}
            </div>
          </div>
          <div className={styles.metaRow} style={{ marginTop: 8 }}>
            {p.defaultValue && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Default</span>
                <code>{p.defaultValue}</code>
              </div>
            )}
            {p.currentValue && p.currentValue !== p.defaultValue && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Current</span>
                <code>{p.currentValue}</code>
              </div>
            )}
          </div>
          {p.allowedValues.length > 0 && (
            <div className={styles.section} style={{ marginTop: 10 }}>
              <div className={styles.sectionTitle}>Allowed Values</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                {p.allowedValues.map((v, j) => (
                  <code key={j} className={styles.valuePill}>{v}</code>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function SheetsPanel({ sheets, dashboards, stories }) {
  return (
    <div>
      {dashboards.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle} style={{ fontSize: 13, marginBottom: 8 }}>
            <LayoutDashboard size={13} aria-hidden="true" /> Dashboards ({dashboards.length})
          </div>
          <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
            {dashboards.map((db, i) => (
              <div key={i} className={styles.sheetRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <LayoutDashboard size={14} strokeWidth={1.8} style={{ color: '#993C1D' }} aria-hidden="true" />
                  <span style={{ fontWeight: 500 }}>{db.name}</span>
                  {(db.width || db.height) && (
                    <span className={`${styles.tag} ${styles.tagGray}`}>{db.width}×{db.height}</span>
                  )}
                </div>
                {db.zones.length > 0 && (
                  <span className={`${styles.tag} ${styles.tagGray}`}>{db.zones.length} zones</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {sheets.length > 0 && (
        <div className={styles.section} style={{ marginTop: dashboards.length ? 1.25 + 'rem' : 0 }}>
          <div className={styles.sectionTitle} style={{ fontSize: 13, marginBottom: 8 }}>
            <Table2 size={13} aria-hidden="true" /> Worksheets ({sheets.length})
          </div>
          <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
            {sheets.map((s, i) => (
              <div key={i} className={styles.sheetRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Table2 size={14} strokeWidth={1.8} style={{ color: '#185FA5' }} aria-hidden="true" />
                  <span>{s.name}</span>
                </div>
                {s.datasourceRefs.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {s.datasourceRefs.map((r, j) => (
                      <span key={j} className={`${styles.tag} ${styles.tagBlue}`}>{r}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {stories.length > 0 && (
        <div className={styles.section} style={{ marginTop: '1.25rem' }}>
          <div className={styles.sectionTitle} style={{ fontSize: 13, marginBottom: 8 }}>
            <BookOpen size={13} aria-hidden="true" /> Stories ({stories.length})
          </div>
          <div className={styles.list}>
            {stories.map((s, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardTitle} style={{ marginBottom: 8 }}>
                  <BookOpen size={15} strokeWidth={1.8} aria-hidden="true" />
                  <span style={{ fontWeight: 500 }}>{s.name}</span>
                </div>
                {s.points.map((p, j) => (
                  <div key={j} style={{ fontSize: 13, color: '#666', padding: '3px 0', borderBottom: j < s.points.length - 1 ? '0.5px solid #eee' : 'none' }}>
                    {j + 1}. {p}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
