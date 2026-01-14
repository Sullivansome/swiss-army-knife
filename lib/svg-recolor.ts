export function recolorSvgSource(source: string, color: string) {
  if (!source.trim()) return "";
  if (typeof DOMParser !== "undefined" && typeof XMLSerializer !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(source, "image/svg+xml");
      doc.querySelectorAll<SVGElement>("*").forEach((node) => {
        if (node.tagName.toLowerCase() === "svg") {
          if (!node.hasAttribute("fill") || node.getAttribute("fill") !== "none") {
            node.setAttribute("fill", color);
          }
          return;
        }
        if (node.getAttribute("fill") !== "none") {
          node.setAttribute("fill", color);
        }
        if (node.getAttribute("stroke")) {
          node.setAttribute("stroke", color);
        }
      });
      const serializer = new XMLSerializer();
      return serializer.serializeToString(doc);
    } catch (error) {
      console.error("svg recolor failed", error);
      return fallbackRecolor(source, color);
    }
  }
  return fallbackRecolor(source, color);
}

function fallbackRecolor(source: string, color: string) {
  let updated = source.replace(/fill="(?!none)[^"]*"/gi, `fill="${color}"`);
  updated = updated.replace(/stroke="[^"]*"/gi, `stroke="${color}"`);
  updated = updated.replace(/<svg(\s[^>]*?)?>/i, (match) => {
    if (/\sfill=/.test(match)) return match;
    return match.replace("<svg", `<svg fill=\"${color}\"`);
  });
  return updated;
}
