document.addEventListener('DOMContentLoaded', () => {
  const number = document.getElementById('seat-number');
  const type = document.getElementById('seat-type');
  const subtitle = document.getElementById('seat-subtitle');
  const scenario = document.getElementById('seat-scenario');
  const button = document.getElementById('assign-seat');
  const map = document.getElementById('seat-map');

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const jokes = {
    window: [
      'Lucky you. Enjoy the view and pretend you are in a music video.',
      'Window seat! The clouds are your complimentary entertainment.',
      'A lovely view awaits. Try not to narrate the entire flight to the clouds.'
    ],

    middle: [
      'Both armrests have been taken. Better luck next time, soldier.',
      'Middle seat. You are now the diplomatic bridge between two strangers.',
      'No window, no aisle. But you do get character development.'
    ],

    aisle: [
      'Aisle seat! Freedom to stretch, plus unlimited trolley traffic.',
      'You have leg-stretching privileges. Use them wisely.',
      'You are the unofficial bathroom-access coordinator. Congratulations.'
    ]
  };

  const seat = window.KhloAirport.seat();

  function classify(letter) {
    if (letter === 'A' || letter === 'F') return 'window';
    if (letter === 'B' || letter === 'E') return 'middle';
    return 'aisle';
  }

  function showSeat(selected) {
    const group = classify(selected.letter);

    const descriptions = {
      window: ['WINDOW SEAT', 'A view worth the neck cramp.'],
      middle: ['MIDDLE SEAT', 'A test of patience and personal space.'],
      aisle: ['AISLE SEAT', 'Stretch your legs. Be ready to stand up.']
    };

    number.textContent = `${selected.row}${selected.letter}`;
    type.textContent = descriptions[group][0];
    subtitle.textContent = descriptions[group][1];

    scenario.textContent = selected.message ||
      jokes[group][Math.floor(Math.random() * jokes[group].length)];

    map.querySelectorAll('.seat-group i').forEach(el => {
      el.classList.remove('selected');
    });

    const rowElement = [...map.querySelectorAll('.seat-row')]
      .find(row => row.querySelector('.row-number')?.textContent === String(selected.row));

    if (rowElement) {
      const index = letters.indexOf(selected.letter);
      const seatElement = rowElement.querySelectorAll('.seat-group i')[index];

      if (seatElement) {
        seatElement.classList.add('selected');
      }
    }
  }

  function assign() {
    const row = Math.floor(Math.random() * 6) + 12;
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const group = classify(letter);

    const selected = {
      row,
      letter,
      message: jokes[group][Math.floor(Math.random() * jokes[group].length)]
    };

    window.KhloAirport.save(
      window.KhloAirport.SEAT_KEY,
      selected
    );

    showSeat(selected);
  }

  if (seat && seat.row && seat.letter) {
    showSeat(seat);
  } else {
    assign();
  }

  button.addEventListener('click', assign);
});
