import React, { useRef, useState } from 'react'
import { Upload, FileSearch } from 'lucide-react'
import styles from './DropZone.module.css'

export default function DropZone({ onFile, loading }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      className={`${styles.zone} ${dragging ? styles.dragging : ''} ${loading ? styles.loading : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !loading && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      aria-label="Upload Tableau workbook file"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".twb,.twbx"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <div className={styles.iconWrap}>
        {loading
          ? <div className={styles.spinner} aria-hidden="true" />
          : <Upload size={28} strokeWidth={1.5} aria-hidden="true" />
        }
      </div>
      <p className={styles.primary}>
        {loading ? 'Parsing workbook...' : 'Drop your .twb or .twbx file here'}
      </p>
      {!loading && (
        <p className={styles.secondary}>
          or <span className={styles.link}>click to browse</span> — 100% client-side, no upload
        </p>
      )}
      <div className={styles.pills}>
        <span className={styles.pill}>.twb</span>
        <span className={styles.pill}>.twbx</span>
      </div>
    </div>
  )
}
