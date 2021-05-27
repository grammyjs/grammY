const { writeFileSync, mkdirSync } = require('fs')
const { ClassDeclaration, ExportAssignment, FunctionDeclaration, Project, VariableDeclaration } = require('ts-morph')

const index = './src/mod.ts'

const wrapperPath = './out/esm'
const wrapperFile = `${wrapperPath}/wrapper.mjs`

const project = new Project()
project.addSourceFileAtPath(index)

const indexMembers = project
  .getSourceFileOrThrow(index)
  .getExportedDeclarations()

const lines = Array.from(indexMembers.entries())
  .filter(([, e]) => e.some(d => d instanceof ClassDeclaration
    || d instanceof FunctionDeclaration
    || d instanceof VariableDeclaration
    || d instanceof ExportAssignment))
  .map(([n]) => `export const ${n} = i.${n}`)
  .join('\n')

mkdirSync(wrapperPath, { recursive: true })
writeFileSync(wrapperFile, `import i from "../mod.js"\n\n${lines}\n`)
