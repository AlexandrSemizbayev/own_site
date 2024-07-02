import fs from 'fs';
import {dirname} from 'path';
import generate from './generate.js';
// import {JSDOM} from 'jsdom';

// const { window } = new JSDOM();
// const { document } = window;

// const mode = `to${process.env.MODE || 'HTML'}`;

async function init() {

  // class ViewGenerator{
  //   constructor() {
  //     // this.root = 
  //   }
  // }
  
  // class FileView {
  //   constructor(title, content) {
  //     this.title = title;
  //     this.content = content;
      
  //   }
  
  //   toHTML() {
  //     console.log(this.title);
  //     return `
  //       <div class="file">
  //         <span class="file-name">
  //           ${this.title}
  //         </span>
  //         <span id="${this.title}">
  //           <code>
  //           ${this.content}
  //           </code>
  //         </span>
  //       </div>
  //     `
  //   }
  // }

  // function createFileView(title = '', content = '') {
  //   console.log(title);
  //   const actions = {
  //     'toHTML': () => {
  //       const wrapper = document.createElement('div');
  //       wrapper.classList.add('file');
  //       const title = document.createElement('span');
  //       // title.classList.add(title);
  //       wrapper.appendChild(title);
  //       const children = document.createElement('div');
  //       children.innerText = content;
  //       wrapper.appendChild(children);
  //       return wrapper.innerHTML;
  //     //   return `
  //     //   <div class="file">
  //     //     <span class="file-name">
  //     //       ${title}
  //     //     </span>
          
  //     //       <code id="${title}">
  //     //       ${content}
  //     //       </code>
          
  //     //   </div>
  //     // `
  //     },
  //   };
  //   return mode in actions ? actions[mode]() : '';
  // }

  // function createFolderView(path = '', title = '') {
  //   const files = ls(`${path}${title}/`);
  //   const actions = {
  //     // .map((file) => new FileView(file)[mode]())
  //     'toHTML': () => `
  //       <div class="folder">
  //         <span> ${title} </span>
  //         ${files}
  //       </div>
  //     `
  //   };
  //   return mode in actions ? actions[mode]() : '';
  // }
  
  // class FolderView {
  //   constructor(path, title) {
  //     this.title = title;
  //     this.files = ls(`${path}${title}/`);
  //   }
  
  //   toHTML() {
  //     const files = [...this.files].join('')
  //     // .join('');
  //     return `
  //       <div class="folder">
  //       // .map((file) => new FileView(file)[mode]())
  //         ${files}
  //       </div>
  //     `
  //   }
  // }


  const startPath = '../';
  const excludeFiles = {
    'package-lock.json': true,
    '.gitignore': true,
    'node_modules': true,
    'structure.html': true,
    'structure.json': true,
  }

  const skipThisExtensions = ['jpg','jpeg','png','bmp','mp3','mp4','mpeg'];
  const extensionsToSkip = {};

  skipThisExtensions.forEach((extension) => {
    extensionsToSkip[`.${extension}`] = true;
  })

  const generateExcluded = (fileName, path = '') => ({
    type: 'excluded',
    title: fileName,
    path,
  })

  const generateFile = (fileName, content) => 
    // createFileView(fileName,content);
    // new FileView(fileName, content)[mode]();
    {
    return {
    type: 'file',
    title: fileName,
    content: content,
    };
  };

  const generateFolder = (path = './', folderName = '') => {
    // return createFolderView(path,folderName);
    // return new FolderView(path, folderName)[mode]();
    const files = ls(`${path}${folderName}/`);
    return {
      type: 'folder',
      title: folderName,
      files,
    };
  };


  function defineType(fileName, path) {
    if(fileName.match(/[\w|\-|_]+\.\w+/gm)) {
      return open(fileName, path);
    } else {
      return generateFolder(path, fileName);
    }
  }

  function open(fileName, path) {
    const fileContent = fs.readFileSync(path+fileName, { encoding: 'utf-8', flag: 'r'});
    return generateFile(fileName, fileContent);
  }

  function ls(path = '.') {
    const files = fs.readdirSync(path,{ withFileTypes: true });
    const result = files.map((file) => {
      if(!excludeFiles[file.name]) {
        const extension = file.name.match(/\.\w+/gm);
        if(extension && extensionsToSkip[extension[0]]) {
          return generateExcluded(file.name, path+file.name);
        }
        const result = defineType(file.name, path);
        return result;
      } else {
        return generateExcluded(file.name);
      }
    });
    return result;
  }
  const root = generateFolder(dirname(startPath));
  // console.log(root);
  generate(root);
  fs.writeFile('./structure.json', JSON.stringify(await Promise.resolve(root)),(err) => {console.error(err)});
}

init();