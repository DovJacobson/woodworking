const stories = [
  { title: "A Mind's Journey in Wood", file: "A Minds Journey in Wood.pdf", tags: ["Makers", "Woodturning", "Studio Craft"] },
  { title: "A Quick French Polishing Technique", file: "A Quick French Polishing Technique.pdf", tags: ["Finishing", "French Polish", "Technique"] },
  { title: "Curtis Buchanan", file: "Curtis Buchanan.pdf", tags: ["Makers", "Chairs", "Woodturning", "Hand Tools"] },
  { title: "Four Chairs", file: "Four Chairs.pdf", tags: ["Furniture", "Chairs", "Design"] },
  { title: "French Polishing", file: "French Polishing.pdf", tags: ["Finishing", "French Polish", "Technique"] },
  { title: "Hand-shaping Wood for Furniture", file: "Hand-shaping Wood For Furniture.pdf", tags: ["Furniture", "Shaping", "Hand Tools", "Technique"] },
  { title: "Heart of Oak", file: "Heart of Oak.pdf", tags: ["Timber", "Oak", "Material"] },
  { title: "In the Shadow of Babala", file: "In The Shadow of Babala.pdf", tags: ["Makers", "Studio Craft"] },
  { title: "Inspired by China", file: "Inspired by China.pdf", tags: ["Design", "Furniture", "Chinese Furniture"] },
  { title: "Is the Price Right?", file: "Is the Price Right.pdf", tags: ["Business", "Pricing", "Woodturning"] },
  { title: "Like Seashells", file: "Like Seashells.pdf", tags: ["Woodturning", "Sculpture", "Design"] },
  { title: "Making Desk Compartments", file: "Making Desk Compartments.pdf", tags: ["Furniture", "Desks", "Joinery", "Woodturning"] },
  { title: "Making the Case for Studio Furniture", file: "Making the Case for Studio Furniture.pdf", tags: ["Studio Craft", "Furniture", "Business"] },
  { title: "Miter, Mortise and Tenon", file: "Miter, Mortise and Tenon.pdf", tags: ["Joinery", "Mortise and Tenon", "Technique"] },
  { title: "Sharpening Handsaws", file: "Sharpening Handsaws.pdf", tags: ["Hand Tools", "Handsaws", "Sharpening", "Technique"] },
  { title: "Spoon Project", file: "Spoon Project.pdf", tags: ["Projects", "Carving", "Hand Tools"] },
  { title: "Terry Martin", file: "Terry Martin.pdf", tags: ["Makers", "Woodturning", "Studio Craft"] },
  { title: "The Story of Walnut", file: "The Story of Walnut.pdf", tags: ["Timber", "Walnut", "Material", "Woodturning"] },
  { title: "To Fume or Not to Fume", file: "To Fume or Not to Fume.pdf", tags: ["Finishing", "Fuming", "Oak", "Technique"] },
  { title: "Trouble with History", file: "Trouble with History.pdf", tags: ["History", "Ideas", "Design"] }
];

const grid = document.querySelector("[data-story-grid]");
const search = document.querySelector("[data-search]");
const count = document.querySelector("[data-count]");
const empty = document.querySelector("[data-empty]");
const filters = document.querySelector("[data-filters]");
const reader = document.querySelector("[data-reader]");
const readerFrame = document.querySelector("[data-reader-frame]");
let activeTag = "All";

function storyUrl(file) {
  return encodeURI(file);
}

function openStory(story) {
  const url = storyUrl(story.file);
  document.querySelector("[data-reader-title]").textContent = story.title;
  document.querySelector("[data-reader-tags]").textContent = story.tags.join(" · ");
  document.querySelector("[data-reader-open]").href = url;
  document.querySelector("[data-reader-download]").href = url;
  readerFrame.src = `${url}#view=FitH`;
  reader.showModal();
}

function renderStories() {
  const query = search.value.trim().toLowerCase();
  const visibleStories = stories.filter((story) => {
    const matchesTag = activeTag === "All" || story.tags.includes(activeTag);
    const searchableText = `${story.title} ${story.tags.join(" ")}`.toLowerCase();
    return matchesTag && searchableText.includes(query);
  });

  grid.replaceChildren(...visibleStories.map((story) => {
    const button = document.createElement("button");
    button.className = "story-card";
    button.type = "button";
    button.innerHTML = `
      <h3>${story.title}</h3>
      <span class="story-meta">${story.tags.join(" · ")}</span>
    `;
    button.addEventListener("click", () => openStory(story));
    return button;
  }));

  count.textContent = visibleStories.length;
  empty.hidden = visibleStories.length !== 0;
}

function renderFilters() {
  const tags = ["All", ...new Set(stories.flatMap((story) => story.tags))];
  filters.replaceChildren(...tags.map((tag) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = tag;
    button.setAttribute("aria-pressed", tag === activeTag);
    button.addEventListener("click", () => {
      activeTag = tag;
      renderFilters();
      renderStories();
    });
    return button;
  }));
}

function closeReader() {
  reader.close();
  readerFrame.removeAttribute("src");
}

search.addEventListener("input", renderStories);
document.querySelector("[data-reader-close]").addEventListener("click", closeReader);
reader.addEventListener("click", (event) => {
  if (event.target === reader) closeReader();
});

const aboutDialog = document.querySelector("[data-about-dialog]");
document.querySelector("[data-about]").addEventListener("click", () => aboutDialog.showModal());
document.querySelector("[data-about-close]").addEventListener("click", () => aboutDialog.close());
aboutDialog.addEventListener("click", (event) => {
  if (event.target === aboutDialog) aboutDialog.close();
});

renderFilters();
renderStories();