document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveBtn");

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (tab && tab.title) {
      document.getElementById("title").value = tab.title;
    }
  });

  saveBtn.addEventListener("click", async () => {
    console.log("Save button clicked");

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const title = document.getElementById("title").value.trim();
    const notes = document.getElementById("notes").value.trim();
    const category = document.getElementById("category").value.trim();
    const tags = document
      .getElementById("tags")
      .value.trim()
      .split(",")
      .map((tag) => tag.trim());

    const bookmark = {
      title,
      notes,
      url: tab.url,
      category,
      tags,
      pinned: false,
      date: new Date().toISOString(),
    };

    chrome.storage.local.get({ bookmarks: [] }, (data) => {
      const updated = [...data.bookmarks, bookmark];
      chrome.storage.local.set({ bookmarks: updated }, () => {
        alert("Bookmark saved!");
      });
    });
  });

  function renderBookmarks() {
    chrome.storage.local.get(["bookmarks"], ({ bookmarks }) => {
      const container = document.getElementById("bookmarkList");
      container.innerHTML = "";

      if (!bookmarks.length) {
        container.innerHTML = "<p>No bookmarks yet.</p>";
        return;
      }

      // ✅ Sort pinned bookmarks first
      bookmarks.sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));

      const grouped = {};
      bookmarks.forEach((b) => {
        if (!grouped[b.category]) grouped[b.category] = [];
        grouped[b.category].push(b);
      });

      for (const [category, items] of Object.entries(grouped)) {
        const catElem = document.createElement("div");
        catElem.innerHTML = `<h6>${category}</h6>`;

        items.forEach((b) => {
          const item = document.createElement("div");
          item.className = "mb-2 border p-2 rounded bg-light";

          const isPinned = b.pinned
            ? `<svg class="pinned" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19.1835 7.80516L16.2188 4.83755C14.1921 2.8089 13.1788 1.79457 12.0904 2.03468C11.0021 2.2748 10.5086 3.62155 9.5217 6.31506L8.85373 8.1381C8.59063 8.85617 8.45908 9.2152 8.22239 9.49292C8.11619 9.61754 7.99536 9.72887 7.86251 9.82451C7.56644 10.0377 7.19811 10.1392 6.46145 10.3423C4.80107 10.8 3.97088 11.0289 3.65804 11.5721C3.5228 11.8069 3.45242 12.0735 3.45413 12.3446C3.45809 12.9715 4.06698 13.581 5.28476 14.8L6.69935 16.2163L2.22345 20.6964C1.92552 20.9946 1.92552 21.4782 2.22345 21.7764C2.52138 22.0746 3.00443 22.0746 3.30236 21.7764L7.77841 17.2961L9.24441 18.7635C10.4699 19.9902 11.0827 20.6036 11.7134 20.6045C11.9792 20.6049 12.2404 20.5358 12.4713 20.4041C13.0192 20.0914 13.2493 19.2551 13.7095 17.5825C13.9119 16.8472 14.013 16.4795 14.2254 16.1835C14.3184 16.054 14.4262 15.9358 14.5468 15.8314C14.8221 15.593 15.1788 15.459 15.8922 15.191L17.7362 14.4981C20.4 13.4973 21.7319 12.9969 21.9667 11.9115C22.2014 10.826 21.1954 9.81905 19.1835 7.80516Z" fill="#1C274C"></path> </g></svg>`
            : `<svg class="unpinned" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19.1835 7.80516L16.2188 4.83755C14.1921 2.8089 13.1788 1.79457 12.0904 2.03468C11.0021 2.2748 10.5086 3.62155 9.5217 6.31506L8.85373 8.1381C8.59063 8.85617 8.45908 9.2152 8.22239 9.49292C8.11619 9.61754 7.99536 9.72887 7.86251 9.82451C7.56644 10.0377 7.19811 10.1392 6.46145 10.3423C4.80107 10.8 3.97088 11.0289 3.65804 11.5721C3.5228 11.8069 3.45242 12.0735 3.45413 12.3446C3.45809 12.9715 4.06698 13.581 5.28476 14.8L6.69935 16.2163L2.22345 20.6964C1.92552 20.9946 1.92552 21.4782 2.22345 21.7764C2.52138 22.0746 3.00443 22.0746 3.30236 21.7764L7.77841 17.2961L9.24441 18.7635C10.4699 19.9902 11.0827 20.6036 11.7134 20.6045C11.9792 20.6049 12.2404 20.5358 12.4713 20.4041C13.0192 20.0914 13.2493 19.2551 13.7095 17.5825C13.9119 16.8472 14.013 16.4795 14.2254 16.1835C14.3184 16.054 14.4262 15.9358 14.5468 15.8314C14.8221 15.593 15.1788 15.459 15.8922 15.191L17.7362 14.4981C20.4 13.4973 21.7319 12.9969 21.9667 11.9115C22.2014 10.826 21.1954 9.81905 19.1835 7.80516Z" fill="#1C274C"></path> </g></svg>`;
          const pinTitle = b.pinned ? "Unpin" : "Pin";

          item.innerHTML = `
            <div class="d-flex flex-col justify-content-between align-items-start gap-3 bookmark_item">
                <div>
                    <a class="d-block" href="${b.url}" target="_blank">${
            b.title
          }</a>
                    ${
                      b.notes
                        ? `<small class="d-block"><strong>Note:</strong> ${b.notes}</small>`
                        : ""
                    }
                    <small class="d-inline-block me-2"><strong>Tags:</strong> ${b.tags.join(
                      ", "
                    )}</small>
                    <small class="d-inline-block"><strong>Date:</strong> ${new Date(
                      b.date
                    ).toLocaleDateString()}</small>
                </div>
                <div>
                    <button class="btn p-0 pin-btn" data-id="${
                      b.url
                    }" title="${pinTitle}">${isPinned}</button>
                    <button class="btn p-0 edit-btn" data-id="${
                      b.url
                    }"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#6c757d"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="edit"> <g> <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#6c757d" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path> <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#6c757d" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon> </g> </g> </g> </g></svg></button>
                    <button class="btn p-0 delete-btn" data-id="${
                      b.url
                    }"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#dc3545"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#dc3545" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"></path></g></svg></button>
                </div>
            </div>
          `;
          catElem.appendChild(item);
        });

        container.appendChild(catElem);
      }

      handleBookmarkActions();
    });
  }

  function handleBookmarkActions() {
    // DELETE
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const url = button.dataset.id;
        chrome.storage.local.get(["bookmarks"], ({ bookmarks }) => {
          const updated = bookmarks.filter((b) => b.url !== url);
          chrome.storage.local.set({ bookmarks: updated }, renderBookmarks);
        });
      });
    });

    // EDIT
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const url = button.dataset.id;
        chrome.storage.local.get(["bookmarks"], ({ bookmarks }) => {
          const bookmark = bookmarks.find((b) => b.url === url);
          if (!bookmark) return;

          // Pre-fill the input fields
          document.getElementById("title").value = bookmark.title;
          document.getElementById("notes").value = bookmark.notes || "";
          document.getElementById("category").value = bookmark.category;
          document.getElementById("tags").value = bookmark.tags.join(", ");

          // Remove the old bookmark before re-saving
          const filtered = bookmarks.filter((b) => b.url !== url);
          chrome.storage.local.set({ bookmarks: filtered }, () => {
            // Switch to the Add tab
            document.getElementById("add-tab").click();
          });
        });
      });
    });

    // PIN/UNPIN
    document.querySelectorAll(".pin-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const url = button.dataset.id;
        chrome.storage.local.get(["bookmarks"], ({ bookmarks }) => {
          const updated = bookmarks.map((b) =>
            b.url === url ? { ...b, pinned: !b.pinned } : b
          );
          chrome.storage.local.set({ bookmarks: updated }, renderBookmarks);
        });
      });
    });
  }

  // Trigger render when "View" tab is clicked
  document
    .getElementById("view-tab")
    .addEventListener("click", renderBookmarks);
});
