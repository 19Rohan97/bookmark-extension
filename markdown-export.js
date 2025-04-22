document.getElementById("exportBtn").addEventListener("click", () => {
  chrome.storage.local.get(["bookmarks"], ({ bookmarks }) => {
    let md = "# Bookmarks Export\n\n";

    const grouped = {};
    bookmarks.forEach((b) => {
      if (!grouped[b.category]) grouped[b.category] = [];
      grouped[b.category].push(b);
    });

    for (const [category, items] of Object.entries(grouped)) {
      md += `## ${category}\n`;
      items.forEach((b) => {
        md += `- [${b.title}](${b.url})\n`;
        if (b.tags?.length) md += `  - Tags: ${b.tags.join(", ")}\n`;
        md += `  - Date: ${new Date(b.date).toLocaleDateString()}\n`;
      });
      md += `\n`;
    }

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url,
      filename: "bookmarks.md",
    });
  });
});
