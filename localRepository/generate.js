import fs from 'fs';
import { replaceHTMLSymbols } from './helpers/replaceSymbols.js';
import { parseTemplate } from './templateParser.js';
import File from './components/File.js';
const createTemplate = (children) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Project structure</title>
    <style>
      .visible {
        display: block;
      }
      .invisible {
        display: none;
      }
    </style>
  </head>
  <body>
    ${children}
  </body>
</html>`
const mode = `to${process.env.MODE || 'HTML'}`;

function createFileView(file) {
  // console.log(title);
  const actions = {
    'toHTML': () => {
      const content = replaceHTMLSymbols(file.content);
      return parseTemplate(
        {
          ...File,
          title: file.title,
          content,
        },
      );
      // console.log(file);
      // return `
      //   <div class=file>
      //     <span class="file-name">
      //       ${file.title}
      //     </span>
      //     <pre>
      //       <code id="'+file.title+'">
      //         ${replace(
      //           replace(
      //             replace(
      //               file.content,
      //               /[&]/gm,
      //               '&amp',
      //             ),
      //             /[<]/gm,
      //             '&lt'
      //           ),
      //           /[>]/gm,
      //           '&gt'
      //         )}
      //       </code>
      //     </pre>
      //   </div>
      // `
      return '<div class=file>'+
      '<span class="file-name">'+
      file.title+
      '</span>'+
      '<pre>'+
      '<code id="'+file.title+'">'+
      replace(
        replace(
          replace(
            file.content,
            /[&]/gm,
            '&amp',
          ),
          /[<]/gm,
          '&lt'
        ),
        /[>]/gm,
        '&gt'
      )+
      '</code></pre></div>'
    },
  };
  return mode in actions ? actions[mode]() : '';
}

function createFolderView(folder) {
  const files = folder.files.map((file) => {

    if(file.type === 'file') return createFileView(file) //replace(createFileView(file),/"\n "/gm, '<br/>');
    if(file.type === 'folder') return createFolderView(file);
  }).join('');
  const actions = {
    toHTML: () => `<div class=folder><span>${folder.title}</span>${files}</div>`
  };
  return mode in actions ? actions[mode]() : '';
}

// function replace(str, regex, to) {
//   return str.replace(regex, to);
// }

export default async function generate(structure) {
  const generated = createTemplate(createFolderView(structure));
  fs.writeFile('./structure.html', generated,(err) => {console.error(err)});
}
