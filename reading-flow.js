/* Keep the final two words of each prose block together without changing its wording. */
(() => {
  const blocks = document.querySelectorAll('p, blockquote, h1, h2, h3, .hero-sub, .cta-note, .audience-list li, .tre-facts li, .good-to-know li, .faq-item summary, .faq-answer');
  for (const block of blocks) {
    if (block.matches('.video-subs') || block.querySelector('p, li, blockquote, h1, h2, h3')) continue;
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let content = '';
    while (walker.nextNode()) {
      const node = walker.currentNode;
      nodes.push({ node, start: content.length });
      content += node.data;
    }
    const match = /\S+([ \t\r\n]+)\S+\s*$/u.exec(content);
    if (!match) continue;
    const start = match.index + match[0].indexOf(match[1]);
    const end = start + match[1].length;
    // Don't join extremely long tokens, URLs or unusually narrow UI labels.
    if (match[0].trim().length > 30) continue;
    for (const {node, start: offset} of nodes) {
      const from = Math.max(0, start - offset);
      const to = Math.min(node.length, end - offset);
      if (from < to) node.data = node.data.slice(0, from) + (offset + from === start ? '\u00a0' : '') + node.data.slice(to);
    }
  }
})();
