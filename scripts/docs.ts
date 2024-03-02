import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import packageJson from '../package.json';

const workspace = `${process.cwd()}/apps/vespera`;

async function main() {
  if (fs.existsSync(`${process.cwd()}/apps/website/content/docs/${packageJson.version}`)) {
    fs.rmSync(`${process.cwd()}/apps/website/content/docs/${packageJson.version}`, {
      recursive: true,
    });
  }

  try {
    execSync(
      `cd ${workspace} && typedoc --plugin typedoc-plugin-markdown --plugin typedoc-plugin-mdn-links --out temp src`,
    );

    const packagePath = path.resolve(workspace);

    fs.cpSync(
      path.resolve(packagePath, 'temp'),
      path.resolve(`${process.cwd()}/apps/website/content/docs/${packageJson.version}`),
      {
        recursive: true,
      },
    );

    fs.rmSync(path.resolve(packagePath, 'temp'), {
      recursive: true,
    });
  } catch (error) {
    console.error(`Failed to generate docs for ${workspace}`, error);
  }

  const files = fs.readdirSync(`${process.cwd()}/apps/website/content/docs/${packageJson.version}`, {
    withFileTypes: true,
    recursive: true,
  });

  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.md')) {
      const filePath = path.resolve(file.path, file.name);

      const oldContent = fs.readFileSync(filePath, 'utf-8');
      const newContent = `---\ntitle: ${file.name.replace('.md', '')}\ndescription: ${file.name.replace('.md', '')}\n---\n${oldContent
        .replace(/\{@\w+\s.*?\}/g, '')
        .replace('(<insert name of object here>)', '')
        .replace(/#### Defined in/g, '')
        .replace(/^node_modules\/.*\n/gm, '')
        .replace(/^apps\/.*\n/gm, '')
        .replace(/^packages\/.*\n/gm, '')
        .replace(/\.md/g, '')}`;
      fs.writeFileSync(filePath, newContent);
      fs.renameSync(`${filePath}`, `${filePath.replace('.md', '.mdx').replace('README', 'readme')}`);
    }
  }
}

void main();
