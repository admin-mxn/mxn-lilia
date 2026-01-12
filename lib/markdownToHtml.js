import { marked } from 'marked';

export default async function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  // Pre-procesar el markdown malformado
  let processedMarkdown = markdown
    // Arreglar bold con espacios internos: "**texto **" -> "**texto**"
    .replace(/\*\*([^*]+)\s+\*\*/g, '**$1**')
    // Arreglar bold con espacios al inicio: "** texto**" -> "**texto**"
    .replace(/\*\*\s+([^*]+)\*\*/g, '**$1**')
    // Separar listas del párrafo siguiente (asegurar línea en blanco después de lista)
    .replace(/^(-\s+[^\n]+)\n([^-\n])/gm, '$1\n\n$2')
    // Asegurar línea en blanco antes de párrafos que comienzan con **
    .replace(/\n(\*\*[A-Z])/g, '\n\n$1');

  // Usar marked para convertir markdown a HTML
  const html = marked(processedMarkdown);
  
  return html;
}
