import React from 'react'
import { Database, FunctionSquare, SlidersHorizontal, LayoutDashboard, Table2, BookOpen } from 'lucide-react'
import styles from './MetricCards.module.css'

const metrics = [
  { key: 'datasources', label: 'Datasources', icon: Database, color: 'blue' },
  { key: 'calculatedFields', label: 'Calculated Fields', icon: FunctionSquare, color: 'green' },
  { key: 'parameters', label: 'Parameters', icon: SlidersHorizontal, color: 'amber' },
  { key: 'sheets', label: 'Worksheets', icon: Table2, color: 'teal' },
  { key: 'dashboards', label: 'Dashboards', icon: LayoutDashboard, color: 'coral' },
  { key: 'stories', label: 'Stories', icon: BookOpen, color: 'purple' },
]

export default function MetricCards({ data }) {
  return (
    <div className={styles.grid}>
      {metrics.map(({ key, label, icon: Icon, color }) => {
        const count = data[key]?.length ?? 0
        return (
          <div key={key} className={`${styles.card} ${styles[color]}`}>
            <div className={styles.iconRow}>
              <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
              <span className={styles.label}>{label}</span>
            </div>
            <div className={styles.value}>{count}</div>
          </div>
        )
      })}
    </div>
  )
}
