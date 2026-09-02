function injectModern(htmlBuf) {
  let out = new TextDecoder().decode(htmlBuf);
  out = out.replace(/<meta name="twitter:site"[^>]*>\n?/g, "");
  out = out.replace(/,"sameAs":\["https:\/\/x\.com\/h4_rry2"\]/g, "");
  out = out.replace(/"sameAs":\["https:\/\/x\.com\/h4_rry2"\],/g, "");
  out = out.replace(/<link rel="stylesheet" href="\/modern-v3[0-9]\.css\?v=[^"]+" \/>\n?/g, "");
  out = out.replace(/<link rel="stylesheet" href="\/styles\.css\?v=[0-9]+" \/>/g, '<link rel="stylesheet" href="/styles.css?v=32" />');
  if (out.indexOf("modern-v39.css") === -1) {
    const link = '<link rel="stylesheet" href="/modern-v39.css?v=42" />';
    if (out.indexOf("</head>") !== -1) out = out.replace("</head>", link + "\n</head>");
    else if (out.indexOf("<head>") !== -1) out = out.replace("<head>", "<head>\n" + link);
  }
  if (out.indexOf('src="/stage.jpg"') !== -1 && out.indexOf('href="/stage.jpg"') === -1) {
    const pre = '<link rel="preload" href="/stage.jpg" as="image" fetchpriority="high" />';
    if (out.indexOf("</head>") !== -1) out = out.replace("</head>", pre + "\n</head>");
  }
  if (out.indexOf("application/ld+json") === -1 && out.indexOf("</head>") !== -1) {
    const schema = '<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebSite","name":"Word Unscrambler","url":"https://lettersunscrambler.com/","inLanguage":"en-GB","publisher":{"@id":"https://lettersunscrambler.com/#org"},"potentialAction":{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://lettersunscrambler.com/?q={search_term_string}"},"query-input":"required name=search_term_string"}},{"@type":"Organization","@id":"https://lettersunscrambler.com/#org","name":"Word Unscrambler","legalName":"HDK Distribution Ltd","url":"https://lettersunscrambler.com/","logo":{"@type":"ImageObject","url":"https://lettersunscrambler.com/og.jpg"},"address":{"@type":"PostalAddress","addressCountry":"GB"}}]}</script>';
    out = out.replace("</head>", schema + "\n</head>");
  }
  if (out.indexOf('href="/feedback"') === -1 && out.indexOf('href="/contact">Contact</a>') !== -1) {
    out = out.replace('<a href="/contact">Contact</a>', '<a href="/feedback">Feedback</a>\n        <a href="/contact">Contact</a>');
  }
  if (out.indexOf('href="/word-checker"') === -1 && out.indexOf('href="/words-from-letters">Words from letters</a>') !== -1) {
    out = out.replace('<a href="/words-from-letters">Words from letters</a>', '<a href="/words-from-letters">Words from letters</a>\n        <a href="/word-checker">Word checker</a>\n        <a href="/word-descrambler">Word descrambler</a>');
  }
  if (out.indexOf('href="/word-descrambler"') === -1 && out.indexOf('href="/word-checker">Word checker</a>') !== -1) {
    out = out.replace('<a href="/word-checker">Word checker</a>', '<a href="/word-checker">Word checker</a>\n        <a href="/word-descrambler">Word descrambler</a>');
  }
  if (out.indexOf('href="/words-starting-with"') === -1 && out.indexOf('href="/bingo-stems">Bingo stems</a>') !== -1) {
    out = out.replace('<a href="/bingo-stems">Bingo stems</a>', '<a href="/bingo-stems">Bingo stems</a>\n        <a href="/words-starting-with">Words starting with</a>\n        <a href="/words-ending-with">Words ending with</a>\n        <a href="/words-containing">Words containing</a>\n        <a href="/5-letter-words-starting-with">5-letter starting with</a>\n        <a href="/9-letter-words">9-letter words</a>\n        <a href="/10-letter-words">10-letter words</a>');
  }
  if (out.indexOf('href="/words-containing"') === -1 && out.indexOf('href="/words-ending-with">Words ending with</a>') !== -1) {
    out = out.replace('<a href="/words-ending-with">Words ending with</a>', '<a href="/words-ending-with">Words ending with</a>\n        <a href="/words-containing">Words containing</a>');
  }
  if (out.indexOf('href="/letter-unscrambler"') === -1 && out.indexOf('href="/word-descrambler">Word descrambler</a>') !== -1) {
    out = out.replace('<a href="/word-descrambler">Word descrambler</a>', '<a href="/word-descrambler">Word descrambler</a>\n        <a href="/letter-unscrambler">Letter unscrambler</a>\n        <a href="/word-maker">Word maker</a>\n        <a href="/unjumble">Unjumble</a>\n        <a href="/word-scrambler">Word scrambler</a>\n        <a href="/spelling-bee">Spelling Bee helper</a>\n        <a href="/multiple-word-unscrambler">Multiple-word unscrambler</a>');
  }
  if (out.indexOf('href="/word-generator"') === -1 && out.indexOf('href="/spelling-bee">Spelling Bee helper</a>') !== -1) {
    out = out.replace('<a href="/spelling-bee">Spelling Bee helper</a>', '<a href="/spelling-bee">Spelling Bee helper</a>\n        <a href="/word-generator">Word generator</a>\n        <a href="/letter-boxed">Letter Boxed</a>\n        <a href="/7-letter-unscrambler">7-letter unscrambler</a>\n        <a href="/text-twist-solver">Text Twist solver</a>\n        <a href="/is-it-a-word">Is it a word</a>');
  }
  if (out.indexOf('href="/words-containing"') === -1 && out.indexOf('href="/bingo-stems">Bingo stems</a>') !== -1) {
    out = out.replace('<a href="/bingo-stems">Bingo stems</a>', '<a href="/bingo-stems">Bingo stems</a>\n        <a href="/words-containing">Words containing</a>');
  }
  if (out.indexOf('id="adAfterResults"') === -1 && out.indexOf('id="results"') !== -1) {
    const ad = '<aside class="ad-region ad-after-results" id="adAfterResults" hidden aria-label="Advertisement"><p class="ad-label">Advertisement</p><div class="ad-box ad-box-slim"><ins class="adsbygoogle" style="display:block;min-height:90px" data-ad-client="ca-pub-2666058844257008" data-ad-format="horizontal" data-full-width-responsive="true"></ins></div></aside>';
    out = out.replace('<div id="results" class="empty">Your words will show here.</div>', '<div id="results" class="empty">Your words will show here.</div>\n    ' + ad);
  }
  if (out.indexOf("has-consent") === -1 && out.indexOf('KEY = "wu_consent"') !== -1) {
    out = out.replace(
      'bar.className = "consent";',
      'document.body.classList.add("has-consent"); bar.className = "consent";'
    );
    out = out.replace(
      'bar.remove();',
      'document.body.classList.remove("has-consent"); bar.remove();'
    );
  }
  if (out.indexOf("profit-v1.js") === -1 && out.indexOf('id="results"') !== -1) {
    out = out.replace("</body>", '<script src="/profit-v1.js" defer></script>\n</body>');
  }
  return new TextEncoder().encode(out).buffer;
}
export { injectModern };
