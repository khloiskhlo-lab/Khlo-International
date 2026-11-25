document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);

  const next = params.get('next') === 'departures.html'
    ? 'departures.html'
    : 'departures.html';

  const hello = document.getElementById('boarding-hello');
  const status = document.getElementById('boarding-status');
  const continueLink = document.getElementById('continue-link');

  const name = window.KhloAirport.passengerName();

  hello.textContent = `HELLO, ${name.toUpperCase()}.`;
  continueLink.href = next;

  const messages = [
    'Preparing your journey',
    'Checking your boarding pass',
    'Clearing the runway',
    'Ready for take-off'
  ];

  let index = 0;

  const ticker = window.setInterval(() => {
    index = (index + 1) % messages.length;
    status.textContent = messages[index];
  }, 520);

  window.setTimeout(() => {
    window.clearInterval(ticker);
    window.location.href = next;
  }, 2600);
});
