export function exportMarkdown(data) {
  const { filename, extractedAt, workbookVersion, datasources, calculatedFields, parameters, sheets, dashboards, stories } = data
  const date = new Date(extractedAt).toLocaleString()
  const wbName = filename.replace(/\.twbx?$/i, '')

  let md = `# Tableau Workbook Documentation\n\n`
  md += `| | |\n|---|---|\n`
  md += `| **Workbook** | ${wbName} |\n`
  md += `| **File** | ${filename} |\n`
  if (workbookVersion) md += `| **Tableau Build** | ${workbookVersion} |\n`
  md += `| **Generated** | ${date} |\n\n`
  md += `---\n\n`

  md += `## Summary\n\n`
  md += `| Component | Count |\n|---|---|\n`
  md += `| Datasources | ${datasources.length} |\n`
  md += `| Calculated Fields | ${calculatedFields.length} |\n`
  md += `| Parameters | ${parameters.length} |\n`
  md += `| Worksheets | ${sheets.length} |\n`
  md += `| Dashboards | ${dashboards.length} |\n`
  if (stories.length) md += `| Stories | ${stories.length} |\n`
  md += `\n---\n\n`

  if (datasources.length) {
    md += `## Datasources\n\n`
    datasources.forEach((ds, i) => {
      md += `### ${i + 1}. ${ds.name}\n\n`
      md += `| Property | Value |\n|---|---|\n`
      md += `| Connection Type | \`${ds.connectionType}\` |\n`
      if (ds.server) md += `| Server | ${ds.server}${ds.port ? ':' + ds.port : ''} |\n`
      if (ds.database) md += `| Database | ${ds.database} |\n`
      if (ds.schema) md += `| Schema | ${ds.schema} |\n`
      if (ds.file) md += `| File | ${ds.file} |\n`
      if (ds.username) md += `| Username | ${ds.username} |\n`
      md += `\n`

      if (ds.tables.length) {
        md += `**Tables / Relations:**\n\n`
        md += `| Table | Type |\n|---|---|\n`
        ds.tables.forEach(t => { md += `| ${t.name} | ${t.type} |\n` })
        md += `\n`
      }

      if (ds.customSQLs.length) {
        md += `**Custom SQL:**\n\n`
        ds.customSQLs.forEach(sql => { md += `\`\`\`sql\n${sql}\n\`\`\`\n\n` })
      }

      if (ds.columns.length) {
        md += `**Fields (${ds.columns.length}):**\n\n`
        md += `| Field | Datatype | Role |\n|---|---|---|\n`
        ds.columns.forEach(c => { md += `| ${c.name} | ${c.datatype} | ${c.role} |\n` })
        md += `\n`
      }
    })
    md += `---\n\n`
  }

  if (calculatedFields.length) {
    md += `## Calculated Fields\n\n`
    calculatedFields.forEach((c, i) => {
      md += `### ${i + 1}. ${c.name}\n`
      if (c.comment) md += `> ${c.comment}\n\n`
      md += `| Property | Value |\n|---|---|\n`
      md += `| Datatype | ${c.datatype} |\n`
      md += `| Role | ${c.role} |\n`
      if (c.hidden) md += `| Hidden | Yes |\n`
      md += `\n**Formula:**\n\n\`\`\`\n${c.formula}\n\`\`\`\n\n`
    })
    md += `---\n\n`
  }

  if (parameters.length) {
    md += `## Parameters\n\n`
    md += `| Parameter | Datatype | Domain Type | Default Value |\n|---|---|---|---|\n`
    parameters.forEach(p => {
      md += `| ${p.name} | ${p.datatype} | ${p.domainType || '-'} | ${p.defaultValue || '-'} |\n`
    })
    md += `\n`
    parameters.forEach((p, i) => {
      if (p.allowedValues.length) {
        md += `**${p.name} — Allowed Values:** ${p.allowedValues.join(', ')}\n\n`
      }
    })
    md += `---\n\n`
  }

  if (dashboards.length) {
    md += `## Dashboards\n\n`
    dashboards.forEach((db, i) => {
      md += `### ${i + 1}. ${db.name}\n`
      if (db.width || db.height) md += `Size: ${db.width} x ${db.height}\n\n`
      if (db.zones.length) {
        md += `**Worksheets used:**\n`
        db.zones.filter(z => z.type !== 'layout-basic').forEach(z => { md += `- ${z.name}\n` })
        md += `\n`
      }
    })
    md += `---\n\n`
  }

  if (sheets.length) {
    md += `## Worksheets\n\n`
    sheets.forEach((s, i) => {
      md += `${i + 1}. **${s.name}**`
      if (s.datasourceRefs.length) md += ` — datasources: ${s.datasourceRefs.join(', ')}`
      md += `\n`
    })
    md += `\n`
  }

  if (stories.length) {
    md += `## Stories\n\n`
    stories.forEach(s => {
      md += `### ${s.name}\n`
      s.points.forEach(p => { md += `- ${p}\n` })
      md += `\n`
    })
  }

  return md
}

export function exportJSON(data) {
  return JSON.stringify(data, null, 2)
}

export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
