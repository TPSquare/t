export default function generateInlineCode(input) {
  const spanWrapped = input.replace(/(mtk|bh)(\d+)\(([^)]+)\)/g, (_, prefix, number, content) => {
    const className = prefix === "mtk" ? `mtk${number}` : `bracket-highlighting-${number}`;
    return `<span class="${className}">${content}</span>`;
  });
  return `<code>${spanWrapped}</code>`;
}
