document.addEventListener('DOMContentLoaded', () => {
  const flights = [
    { number: 'KH 021', name: 'Music Lounge', gate: 'A21', route: 'music', minutes: 8, mode: 'normal' },
    { number: 'KH 045', name: 'Playlist Studio', gate: 'B45', route: 'playlist', minutes: 26, mode: 'normal' },
    { number: 'KH 118', name: 'Cinema Cabin', gate: 'C14', route: 'film', minutes: 42, mode: 'delayed' },
    { number: 'KH 032', name: 'Private Logbook', gate: 'D32', route: 'diary', minutes: 56, mode: 'cancelled' },
    { number: 'KH 064', name: 'Stamped Passport', gate: 'E64', route: 'passport', minutes: 72, mode: 'normal' },
    { number: 'KH 075', name: 'Confessions Desk', gate: 'F75', route: 'confessions', minutes: 88, mode: 'normal' },
    { number: 'KH 206', name: 'Creative Studio', gate: 'G06', route: 'art', minutes: 103, mode: 'normal' },
    { number: 'KH 309', name: 'Hall of Fame', gate: 'H09', route: 'hall', minutes: 121, mode: 'normal' }
  ];

  const rows = document.getElementById('departure-rows');
  const clock = document.getElementById('airport-clock');
  const date = document.getElementById('airport-date');

  const base = new Date();

  flights.forEach(flight => {
    flight.departureAt = new Date(
      base.getTime() + flight.minutes * 60000
    );
  });

  function getStatus(flight, now) {
    const remaining = Math.ceil(
      (flight.departureAt - now) / 60000
    );

    if (flight.mode === 'cancelled') {
      return {
        text: 'CANCELLED',
        className: 'status-cancelled'
      };
    }

    if (flight.mode === 'delayed') {
      if (remaining > 25) {
        return { text: 'DELAYED', className: 'status-delayed' };
      }

      if (remaining > 15) {
        return { text: 'GATE CHANGE', className: 'status-change' };
      }

      if (remaining > 5) {
        return { text: 'BOARDING', className: 'status-boarding' };
      }

      if (remaining > 0) {
        return { text: 'FINAL CALL', className: 'status-final' };
      }

      return { text: 'DEPARTED', className: 'status-departed' };
    }

    if (remaining > 35) {
      return { text: 'ON TIME', className: 'status-ontime' };
    }

    if (remaining > 15) {
      return { text: 'GATE OPEN', className: 'status-open' };
    }

    if (remaining > 5) {
      return { text: 'BOARDING', className: 'status-boarding' };
    }

    if (remaining > 0) {
      return { text: 'FINAL CALL', className: 'status-final' };
    }

    return { text: 'DEPARTED', className: 'status-departed' };
  }

  function updateClock() {
    const now = new Date();

    clock.textContent = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    date.textContent = now.toLocaleDateString([], {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  }

  function renderRows() {
    const now = new Date();

    rows.innerHTML = flights.map(flight => {
      const time = flight.departureAt.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      const status = getStatus(flight, now);

      return `
        <article class="departure-row">
          <span class="dep-time">${time}</span>

          <span class="dep-destination">
            <small>${flight.number}</small>
            ${flight.name}
          </span>

          <span class="dep-code">${flight.gate}</span>

          <span class="dep-status ${status.className}">
            ${status.text}
          </span>

          <a
            class="dep-open"
            href="destination.html?route=${encodeURIComponent(flight.route)}"
            aria-label="Travel to ${flight.name}"
          >↗</a>
        </article>
      `;
    }).join('');
  }

  updateClock();
  renderRows();

  window.setInterval(updateClock, 1000);
  window.setInterval(renderRows, 15000);
});
