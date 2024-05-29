function convertMarkdownToSlackFormat(markdown) {
  console.log(markdown);
  // Convert headings
  markdown = markdown.replace(/^(#+) (.*$)/gim, "*$2*");
  // Convert bold text
  markdown = markdown.replace(/\*\*(.*?)\*\*/gim, "*$1*");
  // Convert italic text
  markdown = markdown.replace(/\*(.*?)\*/gim, "_$1_");
  // Convert inline code
  markdown = markdown.replace(/`([^`]+)`/g, "```$1```");
  // Convert block quotes
  markdown = markdown.replace(/^> (.*$)/gim, "_$1_");
  // Convert unordered lists
  markdown = markdown.replace(/^\s*[-+*]\s+(.*$)/gim, "• $1");
  // Convert ordered lists
  markdown = markdown.replace(/^\s*\d+\.\s+(.*$)/gim, "1. $1");
  // Convert newlines to break lines
  markdown = markdown.replace(/\n/g, "\n");

  return markdown.trim();
}

module.exports = {
  convertMarkdownToSlackFormat,
};
