/*  This file helps us to parse template files
input:
----------------
<div class=file>
  <span class="file-name" @click="toogleView">
    {{ title }}
  </span>
  <pre>
    <code id="{{ title }}">
      {{ content }}
    </code>
  </pre>
</div>
----------------

desired output:
----------------
<div class=file>
  <span class="file-name" onclick="toogleView">
    Alex
  </span>
  <pre>
    <code id="Alex">
      Some content
    </code>
  </pre>
</div>
----------------
*/
let countAsId = 1;

const nonWhiteSpaceChars = '\\S+';  // double backslash is required for new RegExp(regex), since we are passing a string;
const additionalAttributes = {  // keys have RegExp based naming
  // [`@click="${nonWhiteSpaceChars}"`]: (callback) => `onclick="${callback}"`,
  // [`@change="[${nonWhiteSpaceChars}]"`]: (callback) => `onchange="${callback}"`,
  [`@click="${nonWhiteSpaceChars}"`]: (callback) => `onclick="(e) => ${callback}"`,
  [`@change="[${nonWhiteSpaceChars}]"`]: (callback) => `onchange="${callback}"`,
}

const strictMode = !!process.env.IS_STRICT;

const throwException = (reason, template) => {
  const message = `${reason} was not passed in ${template}, ${process.cwd()}`;
  if(strictMode) throw Error(message);
  else console.warn(message);
}

export const parseTemplate = (data) => {
  let { template } = data;
  data.id = `el${countAsId}`;
  countAsId++;
  delete data[template];

  const valuesToReplace = template.match(/\{\{\s*([^\s{}]+)\s*\}\}/gm);  // matching all values enclosed in {{ * }};
  const filteredDictOfValues = {};
  valuesToReplace.forEach((val) => {
    // const matchedKey = val.match(/[^\s{}]+/);
    filteredDictOfValues[val]=true;
  });
  const filteredValues = Object.keys(filteredDictOfValues);
  filteredValues.forEach((scopedValue,idx) => {
    // console.log(scopedValue,idx);
    // const matchedValues = scopedValue.matchAll(/[^\s{}]+/);  // matching all non-white-space chars within {{ * }};
    // if(matchedValues) { // may result null
    //   console.log(matchedValues,idx,'matchedValue');
    //   if(!matchedValue[0] in data) throwException(matchedValue[0], template); // throw exception, if not presented in data;
    //   template = template.replace(scopedValue, data[matchedValue[0]]);  // replacing {{ * }} to passed value;
    //   // console.table({template,matchedValue:matchedValue[0]});
    // }
    const matchedValue = scopedValue.match(/[^\s{}]+/);  // matching all non-white-space chars within {{ * }};
    if(matchedValue) { // may result null
      console.log(matchedValue[0],idx,'matchedValue');
      if(!matchedValue[0] in data) throwException(matchedValue[0], template); // throw exception, if not presented in data;
      template = template.replaceAll(scopedValue, data[matchedValue[0]]);  // replacing {{ * }} to passed value;
      if(matchedValue[0] === 'id') {
        console.log(template);
      }
      // console.table({template,matchedValue:matchedValue[0]});
    }
  });
  if(countAsId === 14) {
    console.log(template);
  }
  // console.log(filteredValues);
  Object.keys(additionalAttributes).forEach((attr) => { // 
    const regexp = new RegExp(attr, 'gm');
    const match = template.match(regexp); // getting whole attribute, like @click="toogleView"
    if(match) {
      match.forEach((matchedAttr) => {
        const val = matchedAttr.match(/"([^"]*)"/gm); // matching everything enclosed in double quotes a-la "toogleView"
        if(val) {
          const parameter = val[0].replace(/"/gm,''); // replacing ": '"toogleView"' -> 'toogleView'
          if(!parameter in data) throwException(parameter, template);
          template = template.replace(matchedAttr, additionalAttributes[attr](parameter));
        }
      });
    }
  });
  // if(countAsId === 3) {
  //   console.log(template);
  // }
  return template;
}