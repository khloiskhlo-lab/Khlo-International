document.addEventListener('DOMContentLoaded', () => {
  const albums = window.KHLO_ALBUMS || [];

  const songs = albums.flatMap(album =>
    album.tracks.map((track, index) => ({
      id: `${album.id}-${index}`,
      title: track.title,
      artist: album.artist,
      album: album.title,
      albumId: album.id
    }))
  );

  const available = document.getElementById('available-songs');
  const selectedList = document.getElementById('selected-songs');
  const search = document.getElementById('song-search');
  const nameInput = document.getElementById('playlist-name');
  const moodInput = document.getElementById('playlist-mood');
  const count = document.getElementById('selected-count');
  const message = document.getElementById('playlist-message');
  const savedPanel = document.getElementById('saved-playlist');
  const saveButton = document.getElementById('save-playlist');

  let selected = [];

  function renderSaved(playlist) {
    savedPanel.replaceChildren();

    const heading = document.createElement('b');
    const name = document.createElement('span');
    const details = document.createElement('small');

    heading.textContent = 'LAST SAVED MIX';
    name.textContent = playlist.name || 'Untitled playlist';

    details.textContent =
      `${Array.isArray(playlist.tracks) ? playlist.tracks.length : 0} tracks · ${playlist.mood || 'Unspecified'}`;

    savedPanel.append(heading, name, details);
    savedPanel.hidden = false;
  }

  function renderAvailable() {
    const query = search.value.trim().toLowerCase();

    const filtered = songs.filter(song =>
      `${song.title} ${song.artist} ${song.album}`
        .toLowerCase()
        .includes(query)
    );

    available.innerHTML = filtered.map(song => {
      const alreadyAdded = selected.some(
        item => item.id === song.id
      );

      return `
        <div class="library-song">
          <div>
            <b>${song.title}</b>
            <small>${song.artist} · ${song.album}</small>
          </div>

          <button
            type="button"
            class="add-song"
            data-add="${song.id}"
            ${alreadyAdded ? 'disabled' : ''}
          >
            ${alreadyAdded ? 'ADDED' : '+ ADD'}
          </button>
        </div>
      `;
    }).join('') || `
      <p class="empty-library">
        No matches. Try another search.
      </p>
    `;
  }

  function renderSelected() {
    count.textContent =
      `${selected.length} TRACK${selected.length === 1 ? '' : 'S'}`;

    if (!selected.length) {
      selectedList.innerHTML = `
        <li class="empty-mix">
          Your songs will appear here. Go on, pick a few.
        </li>
      `;
      return;
    }

    selectedList.innerHTML = selected.map((song, index) => `
      <li>
        <span class="mix-index">
          ${String(index + 1).padStart(2, '0')}
        </span>

        <span class="mix-song">
          <b>${song.title}</b>
          <small>${song.artist}</small>
        </span>

        <button
          type="button"
          class="remove-song"
          data-remove="${song.id}"
          aria-label="Remove selected song"
        >
          ×
        </button>
      </li>
    `).join('');
  }

  available.addEventListener('click', event => {
    const button = event.target.closest('[data-add]');

    if (!button || button.disabled) return;

    const song = songs.find(
      item => item.id === button.dataset.add
    );

    if (song) {
      selected.push(song);
    }

    renderAvailable();
    renderSelected();
  });

  selectedList.addEventListener('click', event => {
    const button = event.target.closest('[data-remove]');

    if (!button) return;

    selected = selected.filter(
      item => item.id !== button.dataset.remove
    );

    renderAvailable();
    renderSelected();
  });

  search.addEventListener('input', renderAvailable);

  saveButton.addEventListener('click', () => {
    const playlistName = nameInput.value.trim();

    if (!playlistName) {
      message.textContent = 'Give your playlist a name first.';
      nameInput.focus();
      return;
    }

    if (!selected.length) {
      message.textContent =
        'Add at least one song before saving your mix.';
      return;
    }

    const playlist = {
      name: playlistName,
      mood: moodInput.value,
      tracks: selected,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(
        'khloIntPlaylist',
        JSON.stringify(playlist)
      );

      message.textContent =
        'Your playlist has been saved in this browser. Boarding approved.';

      renderSaved(playlist);

    } catch (_) {
      message.textContent =
        'Your browser could not save this playlist. Check your storage settings and try again.';
    }
  });

  try {
    const saved = JSON.parse(
      localStorage.getItem('khloIntPlaylist') || 'null'
    );

    if (saved) {
      nameInput.value = saved.name || '';
      moodInput.value = saved.mood || 'Unspecified';

      if (Array.isArray(saved.tracks)) {
        selected = saved.tracks.filter(song =>
          songs.some(item => item.id === song.id)
        );
      }

      renderSaved(saved);
    }
  } catch (_) {}

  renderAvailable();
  renderSelected();
});
