import type { OutputData } from "@editorjs/editorjs";

type ListItem = { content: string; items?: ListItem[] };

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function inlineHtml(value: string) {
  const parsed = new DOMParser().parseFromString(value, "text/html");
  function render(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent ?? "");
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const element = node as Element;
    const children = Array.from(element.childNodes, render).join("");
    if (element.tagName === "B" || element.tagName === "STRONG") return `<strong>${children}</strong>`;
    if (element.tagName === "I" || element.tagName === "EM") return `<em>${children}</em>`;
    if (element.tagName === "BR") return "<br>";
    return children;
  }
  return Array.from(parsed.body.childNodes, render).join("");
}

function listHtml(items: ListItem[], style: string): string {
  const tag = style === "ordered" ? "ol" : "ul";
  const content = items.map(item => `<li>${inlineHtml(item.content)}${item.items?.length ? listHtml(item.items, style) : ""}</li>`).join("");
  return `<${tag}>${content}</${tag}>`;
}

export function editorDataToHtml(output: OutputData): string {
  const html = output.blocks.map(block => {
    if (block.type === "paragraph") return `<p>${inlineHtml(String(block.data.text ?? ""))}</p>`;
    if (block.type === "header") {
      const level = Number(block.data.level) === 3 ? "h3" : "h2";
      return `<${level}>${inlineHtml(String(block.data.text ?? ""))}</${level}>`;
    }
    if (block.type === "list") return listHtml(block.data.items as ListItem[], String(block.data.style ?? "unordered"));
    return "";
  }).join("");
  return new DOMParser().parseFromString(html, "text/html").body.textContent?.trim() ? html : "";
}
