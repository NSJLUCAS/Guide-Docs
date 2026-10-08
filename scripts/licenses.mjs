import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function collectLicenses(dist) {
  const root = join(import.meta.dirname, '..')
  const packages = JSON.parse(await readFile(join(dist, 'bundled-packages.json'), 'utf8'))
  const sections = ['Guide documentation static distribution — original dependency notices\n\nUpstream document site: MIT, Copyright (c) 2026 stqfdyr; see LICENSE.txt.\n']
  for (const name of packages) {
    const dir = join(root, 'node_modules', name)
    const pkg = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8'))
    const files = (await readdir(dir, { withFileTypes: true })).filter(file => file.isFile() && /^(licen[cs]e|copying|notice|ofl)(\.|$|-)/i.test(file.name)).map(file => file.name).sort()
    if (!files.length) throw new Error(`Missing original license text for bundled ${name}@${pkg.version}`)
    sections.push(`\n===== ${name}@${pkg.version} (${pkg.license ?? 'see original text'}) =====\n`)
    for (const file of files) sections.push(`Source: node_modules/${name}/${file}\n${await readFile(join(dir, file), 'utf8')}`)
  }
  sections.push(`\n===== shadcn/ui — copied UI foundations =====\n${await readFile(join(root, 'licenses/shadcn-ui.txt'), 'utf8')}`)
  await writeFile(join(dist, 'DEPENDENCY_LICENSES.txt'), sections.join('\n'))
  console.log(`Collected original notices for ${packages.length} bundled packages plus shadcn/ui`)
}
