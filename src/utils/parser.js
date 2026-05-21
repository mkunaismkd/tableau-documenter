import JSZip from 'jszip'

export async function parseTableauFile(file) {
  const name = file.name.toLowerCase()
  let xmlText = ''

  if (name.endsWith('.twb')) {
    xmlText = await file.text()
  } else if (name.endsWith('.twbx')) {
    const zip = await JSZip.loadAsync(file)
    const twbEntry = Object.keys(zip.files).find(n => n.endsWith('.twb'))
    if (!twbEntry) throw new Error('No .twb file found inside .twbx archive')
    xmlText = await zip.files[twbEntry].async('text')
  } else {
    throw new Error('Unsupported file type. Please upload a .twb or .twbx file.')
  }

  return extractMetadata(xmlText, file.name)
}

function extractMetadata(xmlText, filename) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlText, 'text/xml')

  const parseError = doc.querySelector('parsererror')
  if (parseError) throw new Error('Invalid XML in workbook file')

  return {
    filename,
    extractedAt: new Date().toISOString(),
    workbookVersion: doc.querySelector('workbook')?.getAttribute('source-build') || '',
    datasources: extractDatasources(doc),
    calculatedFields: extractCalculatedFields(doc),
    parameters: extractParameters(doc),
    sheets: extractSheets(doc),
    dashboards: extractDashboards(doc),
    stories: extractStories(doc),
  }
}

function extractDatasources(doc) {
  const datasources = []

  doc.querySelectorAll('datasource').forEach(ds => {
    const name = ds.getAttribute('name') || ''
    const caption = ds.getAttribute('caption') || name

    // Skip the Parameters pseudo-datasource
    if (name === 'Parameters') return

    const conn = ds.querySelector('connection')
    const connType = conn?.getAttribute('class') || 'unknown'
    const server = conn?.getAttribute('server') || ''
    const dbname = conn?.getAttribute('dbname') || conn?.getAttribute('database') || ''
    const filename = conn?.getAttribute('filename') || ''
    const port = conn?.getAttribute('port') || ''
    const schema = conn?.getAttribute('schema') || ''
    const username = conn?.getAttribute('username') || ''

    // Extract tables from relations
    const tables = []
    const tableSet = new Set()
    ds.querySelectorAll('relation').forEach(rel => {
      const relName = rel.getAttribute('name') || rel.getAttribute('table') || ''
      const relType = rel.getAttribute('type') || ''
      const cleaned = relName.replace(/^\[|\]$/g, '').trim()
      if (cleaned && !tableSet.has(cleaned)) {
        tableSet.add(cleaned)
        tables.push({ name: cleaned, type: relType || 'table' })
      }
    })

    // Extract custom SQL
    const customSQLs = []
    ds.querySelectorAll('relation[type="text"]').forEach(rel => {
      const sql = rel.textContent?.trim()
      if (sql) customSQLs.push(sql.slice(0, 500))
    })

    // Extract all columns (non-calculated)
    const columns = []
    ds.querySelectorAll('column').forEach(col => {
      const formula = col.getAttribute('formula')
      if (formula) return // skip calculated fields, handled separately
      const colName = col.getAttribute('caption') || col.getAttribute('name') || ''
      const datatype = col.getAttribute('datatype') || ''
      const role = col.getAttribute('role') || ''
      const type = col.getAttribute('type') || ''
      if (colName && !colName.startsWith(':')) {
        columns.push({ name: colName, datatype, role, type })
      }
    })

    // Extract folder groups
    const folders = []
    ds.querySelectorAll('folder').forEach(folder => {
      const fName = folder.getAttribute('name') || ''
      const items = []
      folder.querySelectorAll('folder-item').forEach(fi => {
        items.push(fi.getAttribute('name') || '')
      })
      if (fName) folders.push({ name: fName, items })
    })

    datasources.push({
      name: caption,
      internalName: name,
      connectionType: connType,
      server,
      database: dbname,
      file: filename,
      port,
      schema,
      username,
      tables,
      customSQLs,
      columns,
      folders,
    })
  })

  return datasources
}

function extractCalculatedFields(doc) {
  const calcs = []
  const seen = new Set()

  doc.querySelectorAll('column[formula]').forEach(col => {
    const name = col.getAttribute('caption') || col.getAttribute('name') || ''
    const formula = col.getAttribute('formula') || ''
    const datatype = col.getAttribute('datatype') || ''
    const role = col.getAttribute('role') || ''
    const type = col.getAttribute('type') || ''
    const hidden = col.getAttribute('hidden') === 'true'
    const comment = col.querySelector('desc')?.textContent?.trim() || ''

    const key = `${name}__${formula}`
    if (name && formula && !seen.has(key)) {
      seen.add(key)
      calcs.push({ name, formula, datatype, role, type, hidden, comment })
    }
  })

  return calcs
}

function extractParameters(doc) {
  const params = []
  const paramDS = Array.from(doc.querySelectorAll('datasource'))
    .find(ds => ds.getAttribute('name') === 'Parameters')

  if (!paramDS) return params

  paramDS.querySelectorAll('column').forEach(col => {
    const name = col.getAttribute('caption') || col.getAttribute('name') || ''
    const datatype = col.getAttribute('datatype') || ''
    const role = col.getAttribute('role') || ''
    const domainType = col.getAttribute('param-domain-type') || ''
    const defaultValue = col.getAttribute('value') || col.getAttribute('default-value') || ''
    const currentValue = col.getAttribute('actual-value') || defaultValue
    const hidden = col.getAttribute('hidden') === 'true'

    // Extract allowed values
    const allowedValues = []
    col.querySelectorAll('members member').forEach(m => {
      allowedValues.push(m.getAttribute('value') || '')
    })

    // Extract range info
    const rangeMin = col.querySelector('range')?.getAttribute('granularity') || ''
    const rangeMax = col.querySelector('range')?.getAttribute('max') || ''

    if (name) {
      params.push({
        name,
        datatype,
        role,
        domainType,
        defaultValue,
        currentValue,
        hidden,
        allowedValues,
        rangeMin,
        rangeMax,
      })
    }
  })

  return params
}

function extractSheets(doc) {
  const sheets = []
  doc.querySelectorAll('worksheet').forEach(ws => {
    const name = ws.getAttribute('name') || ''
    // Collect referenced datasources for this sheet
    const dsRefs = []
    ws.querySelectorAll('datasource-dependencies').forEach(dep => {
      dsRefs.push(dep.getAttribute('datasource') || '')
    })
    if (name) sheets.push({ name, datasourceRefs: dsRefs.filter(Boolean) })
  })
  return sheets
}

function extractDashboards(doc) {
  const dashboards = []
  doc.querySelectorAll('dashboard').forEach(db => {
    const name = db.getAttribute('name') || ''
    const width = db.getAttribute('maxwidth') || db.getAttribute('width') || ''
    const height = db.getAttribute('maxheight') || db.getAttribute('height') || ''
    // Collect worksheet zones
    const zones = []
    db.querySelectorAll('zone[name]').forEach(z => {
      const zName = z.getAttribute('name') || ''
      const zType = z.getAttribute('type') || 'worksheet'
      if (zName) zones.push({ name: zName, type: zType })
    })
    if (name) dashboards.push({ name, width, height, zones })
  })
  return dashboards
}

function extractStories(doc) {
  const stories = []
  doc.querySelectorAll('story').forEach(s => {
    const name = s.getAttribute('name') || ''
    const points = []
    s.querySelectorAll('story-point').forEach(sp => {
      points.push(sp.getAttribute('caption') || '')
    })
    if (name) stories.push({ name, points: points.filter(Boolean) })
  })
  return stories
}
