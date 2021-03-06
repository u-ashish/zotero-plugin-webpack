import * as path from 'path'

import root from '../root'
const pkg = { ...require(path.join(root, 'package.json')) }

export = function loader(source) {
  // this.cacheable()

  const src = this.resourcePath.substring(process.cwd().length + 1)

  const loading = `
    Zotero.debug('${pkg.name}: loading ${src}')
  `
  const loaded = `
    Zotero.debug('${pkg.name}: loaded ${src}')
  `

  const id = src.replace(/[^a-zA-Z0-9]/g, '_')
  const errvar = '$wrap_loader_catcher_' + id
  const msgvar = '$wrap_loader_message_' + id
  const failed = `
    var ${msgvar} = 'Error: ${pkg.name}: load of ${src} failed:' + ${errvar} + '::' + ${errvar}.stack;
    if (typeof Zotero.logError === 'function') {
      Zotero.logError(${msgvar})
    } else {
      Zotero.debug(${msgvar})
    }
  `

  switch (src.split('.').pop()) {
    case 'ts':
      return `${loading}; try { ${source}; ${loaded}; } catch (${errvar}) { ${failed} };`

    default:
      throw new Error(`Unexpected extension on ${src}`)
  }
}
