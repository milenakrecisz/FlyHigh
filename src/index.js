import "./styles.scss";

// Tabs functionality
const tabs = document.querySelectorAll(".tabs__control");
const panels = document.querySelectorAll(".tabs__panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("aria-controls");

    tabs.forEach((t) => {
      t.classList.remove("tabs__control--active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("tabs__control--active");
    tab.setAttribute("aria-selected", "true");

    panels.forEach((panel) => {
      if (panel.id === target) {
        panel.classList.add("tabs__panel--active");
        panel.removeAttribute("hidden");
      } else {
        panel.classList.remove("tabs__panel--active");
        panel.setAttribute("hidden", "");
      }
    });
  });
});

//Retrieve array from API response, handling both array and object formats
function normalizeList(data, fallbackKeys = ['articles', 'items', 'data']) {
  if (Array.isArray(data)) {
    return data;
  }

  for (const key of fallbackKeys) {
    if (Array.isArray(data[key])) {
      return data[key];
    }
  }
  return [];
}

// Fetch knowledge base data
async function fetchKnowledgeBase() {
  try {
    const response = await fetch('/api/knowledge-base');
    const data = await response.json();
    const items = normalizeList(data);
    const grid = document.getElementById('knowledge-base-grid');

    if (items.length === 0) {
      grid.innerHTML = '<p>Brak danych do wyświetlenia.</p>';
      return;
    }

    grid.innerHTML = items.map(item => `
      <article class="feed__item ${item.featured ? 'feed__item--featured' : ''}">
      ${item.featured ? `<img src="${item.image}" alt="feed image" class="feed__image" onerror="this.src='./assets/images/baza-wiedzy.png'">` : ''}  
        <div class="feed__item-content">
            <p class="feed__item-type">${item.type}</p>
            <h3 class="feed__item-title">${item.title}</h3>
        </div>
    </article>
    `).join('');
  } catch (error) {
    console.error('Błąd pobierania bazy wiedzy:', error);
  }
}

// Fetch blog data
async function fetchBlog() {
  try {
    const response = await fetch('/api/blog');
    const data = await response.json();
    const articles = normalizeList(data);
    const list = document.getElementById('blog-list');

    if (articles.length === 0) {
      list.innerHTML = '<p>Brak artykułów do wyświetlenia.</p>';
      return;
    }

    list.innerHTML = articles.map(article => `
      <article class="feed__item">
      <div class="feed__item-meta"> <p>Data: ${article.date}</p> <p>czas czytania: ${Math.ceil(article.reading_time_seconds / 60)} min </p></div>
        <h3 class="feed__item-title">${article.title}</h3>
      </article>
    `).join('');
  } catch (error) {
    console.error('Błąd pobierania bloga:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchKnowledgeBase();
  fetchBlog();
});

