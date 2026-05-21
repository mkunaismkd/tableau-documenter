import React, { useState } from 'react'
import { FileSearch, Braces, FileCode2, RefreshCw, GitBranch } from 'lucide-react'
import { parseTableauFile } from './utils/parser'
import { exportMarkdown, exportJSON, downloadFile } from './utils/exporters'
import DropZone from './components/DropZone'
import MetricCards from './components/MetricCards'
import Tabs from './components/Tabs'
import DatasourcesPanel from './components/DatasourcesPanel'
import CalcsPanel from './components/CalcsPanel'
import { ParamsPanel, SheetsPanel } from './components/Panels'
import styles from './App.module.css'

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('datasources')

  const handleFile = async (file) => {
    setLoading(true)
    setError('')
    setData(null)
    try {
      const result = await parseTableauFile(file)
      setData(result)
      setActiveTab('datasources')
    } catch (e) {
      setError(e.message || 'Failed to parse file')
    } finally {
      setLoading(false)
    }
  }

  const handleExportMd = () => {
    if (!data) return
    const md = exportMarkdown(data)
    const name = data.filename.replace(/\.twbx?$/i, '') + '_documentation.md'
    downloadFile(md, name, 'text/markdown')
  }

  const handleExportJSON = () => {
    if (!data) return
    const json = exportJSON(data)
    const name = data.filename.replace(/\.twbx?$/i, '') + '_metadata.json'
    downloadFile(json, name, 'application/json')
  }

  const tabs = data ? [
    { id: 'datasources', label: 'Datasources', count: data.datasources.length },
    { id: 'calcs', label: 'Calculated Fields', count: data.calculatedFields.length },
    { id: 'params', label: 'Parameters', count: data.parameters.length },
    { id: 'sheets', label: 'Sheets & Dashboards', count: data.sheets.length + data.dashboards.length },
  ] : []

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.logo} aria-hidden="true">
              <FileSearch size={20} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className={styles.title}>Tableau Workbook Documenter</h1>
              <p className={styles.subtitle}>Extract & document any .twb / .twbx — 100% in-browser</p>
            </div>
          </div>
          <a
            href="https://github.com/mkunaismkd/tableau-documenter"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ghLink}
            aria-label="View on GitHub"
          >
            <GitBranch size={18} strokeWidth={1.5} />
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <DropZone onFile={handleFile} loading={loading} />

        {error && (
          <div className={styles.error} role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {data && (
          <div className={styles.results}>
            <div className={styles.resultHeader}>
              <div>
                <p className={styles.filename}>{data.filename}</p>
                {data.workbookVersion && (
                  <p className={styles.version}>Tableau build {data.workbookVersion}</p>
                )}
              </div>
              <div className={styles.actions}>
                <button className={styles.btn} onClick={() => { setData(null); setError('') }}>
                  <RefreshCw size={14} aria-hidden="true" /> New file
                </button>
                <button className={styles.btn} onClick={handleExportMd}>
                  <FileCode2 size={14} aria-hidden="true" /> Export .md
                </button>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleExportJSON}>
                  <Braces size={14} aria-hidden="true" /> Export JSON
                </button>
              </div>
            </div>

            <MetricCards data={data} />

            <Tabs tabs={tabs} active={activeTab} onSelect={setActiveTab} />

            {activeTab === 'datasources' && <DatasourcesPanel datasources={data.datasources} />}
            {activeTab === 'calcs' && <CalcsPanel calculatedFields={data.calculatedFields} />}
            {activeTab === 'params' && <ParamsPanel parameters={data.parameters} />}
            {activeTab === 'sheets' && (
              <SheetsPanel
                sheets={data.sheets}
                dashboards={data.dashboards}
                stories={data.stories}
              />
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Built by <a href="https://github.com/mkunaismkd" target="_blank" rel="noopener noreferrer">Unais MK</a> · No data leaves your browser</p>
      </footer>
    </div>
  )
}
