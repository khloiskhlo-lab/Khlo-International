document.addEventListener('DOMContentLoaded', () => {
  const albums = window.KHLO_ALBUMS || [];
  const params = new URLSearchParams(window.location.search);

  const album =
    albums.find(item => item.id === params.get('album')) ||
    albums[0];

  if (!album) return;

  const cover = document.getElementById('player-cover');
  const genre = document.getElementById('player-genre');
  const title = document.getElementById('player-title');
  const artist = document.getElementById('player-artist');
  const meta = document.getElementById('player-meta');
  const total = document.getElementById('track-total');
  const list = document.getElementById('track-list');

  const upload = document.getElementById('audio-upload');
  const audio = document.getElementById('audio-player');
  const trackLabel = document.getElementById('audio-track-label');
  const note = document.getElementById('audio-note');

  let activeTrackIndex = -1;
  let temporaryAudioUrl = null;

  cover.classList.add(album.coverClass);

  cover.innerHTML = `
    <span class="cover-topline">${album.coverTop}</span>
    <span class="cover-mark">${album.coverMark}</span>
    <span class="cover-bottomline">${album.coverBottom}</span>
  `;

  genre.textContent = album.genre.toUpperCase();
  title.textContent = album.title;
  artist.textContent = album.artist;

  meta.textContent =
    `${album.year} / ${album.genre.toUpperCase()} / ${album.mood.toUpperCase()}`;

  total.textContent = `${album.tracks.length} TRACKS`;

  list.innerHTML = album.tracks.map((track, index) => `
    <li data-track-index="${index}">
      <button
        class="track-play"
        type="button"
        aria-label="Select ${track.title}"
      >▶</button>

      <button class="track-select" type="button">
        ${track.title}
      </button>

      <span class="track-duration">
        ${track.duration || '—:—'}
      </span>
    </li>
  `).join('');

  function selectTrack(index) {
    activeTrackIndex = index;

    const track = album.tracks[index];

    list.querySelectorAll('li').forEach((item, itemIndex) => {
      item.classList.toggle(
        'selected-track',
        itemIndex === index
      );
    });

    trackLabel.textContent = `SELECTED: ${track.title}`;

    if (temporaryAudioUrl) {
      URL.revokeObjectURL(temporaryAudioUrl);
      temporaryAudioUrl = null;
    }

    audio.pause();
    audio.removeAttribute('src');
    audio.load();

    if (track.src) {
      audio.src = track.src;
      audio.load();

      audio.play().catch(() => {
        note.textContent =
          'The audio file could not autoplay. Press play on the audio controls.';
      });

      note.textContent =
        'Playing an audio file from your project assets.';

    } else {
      upload.value = '';

      note.textContent =
        'Track selected. Choose a music file saved on your device using LOAD AUDIO FILE. This demo does not stream commercial recordings.';
    }
  }

  list.addEventListener('click', event => {
    const button = event.target.closest('button');
    const row = event.target.closest('li');

    if (!button || !row) return;

    selectTrack(Number(row.dataset.trackIndex));
  });

  upload.addEventListener('change', () => {
    const file = upload.files && upload.files[0];

    if (!file || !file.type.startsWith('audio/')) {
      note.textContent =
        'Please choose an audio file (MP3, WAV, M4A, or another browser-supported format).';
      return;
    }

    if (activeTrackIndex < 0) {
      selectTrack(0);
    }

    if (temporaryAudioUrl) {
      URL.revokeObjectURL(temporaryAudioUrl);
    }

    temporaryAudioUrl = URL.createObjectURL(file);

    audio.src = temporaryAudioUrl;
    audio.load();

    audio.play().catch(() => {
      note.textContent =
        'Your file is loaded. Press play on the audio controls to listen.';
    });

    trackLabel.textContent =
      `NOW PLAYING: ${album.tracks[activeTrackIndex].title}`;

    note.textContent =
      `Loaded locally: ${file.name}. This file is not uploaded anywhere.`;
  });

  window.addEventListener('beforeunload', () => {
    if (temporaryAudioUrl) {
      URL.revokeObjectURL(temporaryAudioUrl);
    }
  });
});
