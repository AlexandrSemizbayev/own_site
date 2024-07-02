import './style.scss';

const about = `
  With over three years of experience delivering impactful frontend solutions, I specialize in Vue.js and have a solid background in React.js.
  My technical skills include a strong command of JavaScript, HTML5, CSS3, and TypeScript, and I am well-versed in creating mobile-first, responsive websites.
  In my previous role, I thrived in a fast-paced and diverse environment, building user interfaces that boosted user engagement and drove business growth.
  I'm confident I can make a similar positive impact on your team.
`
const output = document.querySelector('.output');
const inputLine = document.querySelector('#terminal-input');
const writeLine = (str) => {
  const p = document.createElement('p');
  let idx = 0;
  output.appendChild(p);
  function recursive() {
    window.requestAnimationFrame(() => {
      p.innerText += str[idx];
      console.log(str[idx] === ' ', str[idx] === '\n');
      idx++;
      if(idx < str.length) {
        recursive();
      }
    })
  }
  recursive();
}

const commands = {
  '/help' : () => {
    Object.keys(commands).forEach((command) => {
      writeLine(command);
    })
  },
  '/about': () => {
    const splitedText = about.split('\n');
    writeLine(about);
    // splitedText.forEach((paragraph) => {
    //   writeLine(paragraph);
    // });
  },
  '/show_code': () => {
    console.log('S_C')
  },
  '/cv': () => {
    console.log('cv')
  },
}

inputLine.addEventListener('keypress', (e) => {
  requestAnimationFrame(() => {
    if(e.charCode === 13) {
      const {value} = e.target;
      console.log(e);
      if(value in commands) {
        commands[value]();
        e.target.value = "";
      } else {
        writeLine(`Command not found: ${value}`);
      }
    }
  })
});
