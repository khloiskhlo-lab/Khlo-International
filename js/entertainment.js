document.addEventListener('DOMContentLoaded', () => {
  const albums = window.KHLO_ALBUMS || [];

  const grid = document.getElementById('album-grid');
  const categories = document.getElementById('console-categories');
  const count = document.getElementById('album-count');
  const title = document.getElementById('album-section-title');
  const passenger = document.getElementById('console-passenger');

  let currentFilter = 'all';
  let favourites = [];

  try {
    favourites = JSON.parse(
      localStorage.getItem('khloIntFavourites') || '[]'
    );
  } catch (_) {
    favourites = [];
  }

  passenger.textContent =
    `PASSENGER: ${window.KhloAirport.passengerName().toUpperCase()}`;

  function matches(album, filter) {
    if (filter === 'all') return true;

    if (filter === 'favourites') {
      return favourites.includes(album.id);
    }

    if (filter === '1970s') {
      return album.year >= 1970 && album.year <= 1979;
    }

    if (filter === '1980s') {
      return album.year >= 1980 && album.year <= 1989;
    }

    if (filter === '2010s') {
      return album.year >= 2010 && album.year <= 2019;
    }

    return album.genre === filter || album.mood === filter;
  }

  function coverMarkup(album) {
    return `
      <div class="cover-art ${album.coverClass}">
        <span class="cover-topline">${album.coverTop}</span>
        <span class="cover-mark">${album.coverMark}</span>
        <span class="cover-bottomline">${album.coverBottom}</span>
      </div>
    `;
  }

  function render() {
    const shown = albums.filter(album =>
      matches(album, currentFilter)
    );

    count.textContent =
      `${String(shown.length).padStart(2, '0')} ALBUM${shown.length === 1 ? '' : 'S'}`;

    title.textContent =
      currentFilter === 'all'
        ? 'FEATURED ALBUMS'
        : currentFilter === 'favourites'
          ? 'YOUR FAVOURITES'
          : `${currentFilter.toUpperCase()} PICKS`;

    if (!shown.length) {
      grid.innerHTML = `
        <p class="empty-library">
          No albums here yet. Add a favourite or choose another category.
        </p>
      `;
      return;
    }

    grid.innerHTML = shown.map(album => `
      <article class="album-card">

        <button
          class="album-heart ${favourites.includes(album.id) ? 'is-favourite' : ''}"
          type="button"
          data-favourite="${album.id}"
          aria-label="Toggle favourite"
        >
          ${favourites.includes(album.id) ? '★' : '☆'}
        </button>

        <a
          class="album-open"
          href="player.html?album=${encodeURIComponent(album.id)}"
          aria-label="Open ${album.title} by ${album.artist}"
        >
          ${coverMarkup(album)}

          <h3 class="album-title">${album.title}</h3>
          <p class="album-artist">${album.artist}</p>

          <span class="album-meta">
            ${album.year} · ${album.genre.toUpperCase()} ·
            ${album.tracks.length} TRACKS
          </span>
        </a>
      </article>
    `).join('');
  }

  categories.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');

    if (!button) return;

    currentFilter = button.dataset.filter;

    categories.querySelectorAll('[data-filter]').forEach(item => {
      item.classList.toggle('active', item === button);
    });

    render();
  });

  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-favourite]');

    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    const id = button.dataset.favourite;

    favourites = favourites.includes(id)
      ? favourites.filter(item => item !== id)
      : [...favourites, id];

    try {
      localStorage.setItem(
        'khloIntFavourites',
        JSON.stringify(favourites)
      );
    } catch (_) {}

    render();
  });

  render();
});
