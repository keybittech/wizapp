
import TreeSitter from 'tree-sitter';
import * as fs from 'fs';
import path from 'path';
import languages from '../languages';
const langValues = Object.values(languages);

export async function parseFile(): Promise<any> {

  const files = fs.readdirSync('../files');

  const originalName = files.find(f => f.startsWith('original'));

  if (!originalName) throw 'No original file was written.';
  
  const extName = path.extname(originalName);

  const { parserName } = langValues.find(lang => lang.fileExtension.includes(extName)) || {};

  if (!parserName) throw 'You found an unsupported parser!';

  const filePath = path.join(__dirname, '../file/');
  const code = fs.readFileSync(filePath, 'utf-8');

  const { default: lang } = await import(parserName) as { default: any };
  
  const parser = new TreeSitter();
  parser.setLanguage(lang);
  return parser.parse(code);
}

const command = process.argv[2];

if ('edit' === command) {
  const parsedFile = parse

}