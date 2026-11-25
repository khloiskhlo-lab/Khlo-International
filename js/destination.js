document.addEventListener('DOMContentLoaded', () => {
  const destinations = {
    music: {
      code: 'A21',
      title: 'MUSIC LOUNGE',
      deck: 'A listening room for the songs, artists and sounds that travel with you.',
      message: 'Welcome to the music lounge. Browse the in-flight music library, open an album, and build a soundtrack for the rest of your journey.',
      stamp: 'SOUND CHECK',
      action: 'entertainment.html'
    },

    playlist: {
      code: 'B45',
      title: 'PLAYLIST STUDIO',
      deck: 'A small studio for putting different sounds together and making them yours.',
      message: 'This is your space to collect songs by mood, memory, genre, or pure instinct. Build a soundtrack from the in-flight library and save it in this browser.',
      stamp: 'MIX TAPE',
      action: 'playlist.html'
    },

    film: {
      code: 'C14',
      title: 'CINEMA CABIN',
      deck: 'A screen-side stop for favourite films, scenes, and stories worth revisiting.',
      message: 'Take a seat and explore the films that stay in your head long after the credits. This destination is ready for your film collection and write-ups.',
      stamp: 'NOW SHOWING'
    },

    diary: {
      code: 'D32',
      title: 'PRIVATE LOGBOOK',
      deck: 'A quieter corner for notes, thoughts, memories, and things you want to keep.',
      message: 'The logbook is a personal stop. You could use this space for diary entries, little observations, and snapshots from the journey.',
      stamp: 'PRIVATE ENTRY'
    },

    passport: {
      code: 'E64',
      title: 'STAMPED PASSPORT',
      deck: 'A collection of places, cultures, architecture, and corners of the world still waiting to be explored.',
      message: 'Every destination has a story. Build this section around the places you want to visit, what draws you to them, and the details you hope to experience one day.',
      stamp: 'WORLD ROAMER'
    },

    confessions: {
      code: 'F75',
      title: 'CONFESSIONS DESK',
      deck: 'Unfiltered opinions, tiny confessions, and thoughts that deserve their own little terminal.',
      message: 'No formal announcements here. This is the place for honest opinions, random thoughts, and the things you would normally write in the margins.',
      stamp: 'OFF RECORD'
    },

    art: {
      code: 'G06',
      title: 'CREATIVE STUDIO',
      deck: 'An open workspace for sketches, experiments, ideas, and art made along the way.',
      message: 'Pick up a pencil, make a mess, and see where the idea goes. This space can become your digital art studio and creative archive.',
      stamp: 'IN PROGRESS'
    },

    hall: {
      code: 'H09',
      title: 'HALL OF FAME',
      deck: 'A wall of people, works, characters, and discoveries that deserve a place in your personal museum.',
      message: 'A growing collection of inspirations and favourites. Add the people and creations that have made an impression on you.',
      stamp: 'VIP ARRIVAL'
    }
  };

  const params = new URLSearchParams(window.location.search);
  const key = params.get('route') || 'music';
  const destination = destinations[key] || destinations.music;

  document.title = `${destination.title} — KHLO'S INT.`;

  document.getElementById('destination-code').textContent =
    `GATE ${destination.code}`;

  document.getElementById('destination-title').textContent =
    destination.title;

  document.getElementById('destination-deck').textContent =
    destination.deck;

  document.getElementById('destination-message').textContent =
    destination.message;

  document.getElementById('destination-stamp').textContent =
    destination.stamp;

  document.getElementById('destination-personal').textContent =
    `Welcome, ${window.KhloAirport.passengerName()}. Enjoy your stay.`;

  const actionBox = document.querySelector('.destination-actions');

  if (destination.action) {
    const action = document.createElement('a');

    action.className = 'button button-outline';
    action.href = destination.action;

    action.textContent = key === 'playlist'
      ? 'BUILD A PLAYLIST ↗'
      : 'OPEN MUSIC LIBRARY ↗';

    actionBox.appendChild(action);
  }
});
