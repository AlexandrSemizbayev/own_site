const template = `
  <div class=file>
  /*onclick="toogleView()"*/
    <span class="file-name file-{{ id }}">
      {{ title }}
    </span>
    <pre>
      <code id="{{ id }}" class="invisible" style="white-space: pre-wrap;">
        {{ content }}
      </code>
    </pre>
  </div>
  <script>
  (function() {
      const codeSection = document.querySelector('#{{ id}}');
      let isVisible = false;
      function toogleView(e) {
        isVisible = !isVisible;
        if(isVisible) {
          codeSection.classList.add('visible');
          codeSection.classList.remove('invisible');
        } else {
          codeSection.classList.add('invisible');
          codeSection.classList.remove('visible');
        }
        // codeSection.classList.add('visible') : codeSection.classList.
        console.log(e);
      }
      const elementToListen = document.querySelector('.file-{{ id }}');
      // console.log(elementToListen);
      elementToListen.addEventListener('click', toogleView);
  })();
  </script>
`;

// const methods = {
//   toogleView(e) {
//     console.log(this);
//     console.log(e,e.target);
//   }
// };
// let script = '<script>';

// Object.keys(methods).forEach((key) => {
//   console.log(key);
//   script += `function ${methods[key]}`;
// })

// script+='</script>'
// template += script;

// const fileParameters = {
//   toogleView: (e) => {
//     console.log(this);
//     console.log(e,e.target);
//   }
// };

const data = {
  id: 'el-1',
  title: '',
  content: '',
  template,
  // ...fileParameters,
};

export default data;