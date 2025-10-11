import * as fs from 'fs'

const srcDirs = ['lib']
const fileExports: string[] = []

const addSrcDir = (dirPath: string[]) => {
  const dirPathStr = dirPath.join('/')
  const files = fs.readdirSync(`../${dirPathStr}`, {withFileTypes: true})
  console.log('Directory contents:', files)
  let newExports: string[] = []
  for (let file of files) {
    const filePath = [...dirPath, file.name]
    const filePathStr = filePath.slice(1).join('/')
    if (file.isDirectory()) {
      addSrcDir(filePath)
      console.log('dir  ', file.name)
    } else {
      const filename = filePathStr.split('/').slice(-1)[0]
      const fileStem = filename.split('.').slice(0, -1).join('.')
      const fileExtension = filename.split('.').slice(-1)[0]
      if (fileExtension === 'svelte') {
        fileExports.push(`export { default as Sm${fileStem}} from './${filePathStr}'`)
      } else if (fileExtension === 'ts' && !fileStem.startsWith('+') && !fileStem.endsWith('.d')) {
        const content = fs.readFileSync('../lib/'+filePathStr, 'utf-8')
        const lines = content.split('\n')
        for (let lineO of lines) {
          const line = lineO.trim()
          if (line.startsWith('export')) {
            // console.log(`==>buildBarrelFile.ts:29 line`, line)
            const words = line.split(' ')
            if (['class', 'const', 'interface', 'enum'].indexOf(words[1]) + 1) {
              const varName = words[2].split(':')[0].split('<')[0]
              fileExports.push(`export {${(words[1]==='interface')?'type ':''}${varName}} from './${filePathStr.replace('.ts', '.js')}'`)
            }
          }
        }
      }
    }
  }
}
fileExports.push(`import './svelte-mos.css'`)

for (let srcDir of srcDirs) {
  addSrcDir([srcDir])
}


const content = fileExports.join('\n')
fs.writeFileSync('../lib/index.ts', content)