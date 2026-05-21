import React from 'react'
import styles from './Tabs.module.css'

export default function Tabs({ tabs, active, onSelect }) {
  return (
    <div className={styles.bar} role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={styles.badge}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}
