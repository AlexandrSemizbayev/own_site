export function replace(str, regex, to) {
  return str.replace(regex, to);
}

export function replaceHTMLSymbols(rawHTML) { // replacing all special HTML symbols to avoid their dissapearance in resulted examples
  return replace(
    replace(
      replace( // > -> &gt
        replace( // < -> &lt
          replace(  // & -> &amp
            rawHTML,
            /[&]/gm,
            '&amp',
          ),
          /[<]/gm,
          '&lt'
        ),
        /[>]/gm,
        '&gt'
      ),
      /[{]/gm,
      '&lbrace;'
    ),
    /[}]/gm,
    '&rbrace;',
  );
  // return value for HTML changed from <span>Text</span> to &ltspan&gtText&ltspan&gt
  // return value for JS changed from if(a >= x && x <= 10) to if(a &gt= x &amp&amp x &lt= 10)
}