function convertMarkdownToSlackFormat(markdown) {
  console.log(markdown);
  //   // Convert italic text
  //   markdown = markdown.replace(/\*(.*?)\*/gim, "_$1_");
  // Convert bold text
  markdown = markdown.replace(/\*\*(.*?)\*\*/gim, "*$1*");
  // Convert inline code
  markdown = markdown.replace(/`([^`]+)`/g, "```$1```");
  // Convert block quotes
  markdown = markdown.replace(/^> (.*$)/gim, "_$1_");
  // Convert unordered lists
  markdown = markdown.replace(/^\s*[-+*]\s+(.*$)/gim, "- $1");
  // Convert ordered lists
  markdown = markdown.replace(/^\s*\d+\.\s+(.*$)/gim, "1. $1");
  // Convert headings
  markdown = markdown.replace(/^(#+) (.*$)/gim, "*$2*");
  // Convert newlines to break lines
  markdown = markdown.replace(/\n/g, "\n");
  console.log("After Conversion", markdown);
  return markdown.trim();
}

module.exports = {
  convertMarkdownToSlackFormat,
};
