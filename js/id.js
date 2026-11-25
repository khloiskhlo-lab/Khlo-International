document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('passenger-form');
  const nameField = document.getElementById('preferred-name');
  const interestField = document.getElementById('travel-interest');
  const signatureField = document.getElementById('signature');
  const idPreview = document.getElementById('preview-id');

  const previous = window.KhloAirport.passenger();

  function makePassengerId(name) {
    const clean = name.trim().toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 5) || 'GUEST';

    let hash = 0;

    for (let i = 0; i < clean.length; i += 1) {
      hash = ((hash << 5) - hash + clean.charCodeAt(i)) | 0;
    }

    const suffix = String(Math.abs(hash) % 9000 + 1000);

    return `KHI—${clean}-${suffix}`;
  }

  if (previous) {
    nameField.value = previous.name || '';
    interestField.value = previous.interest || 'A little bit of everything';
    signatureField.value = previous.signature || '';
    idPreview.textContent = previous.id || makePassengerId(previous.name || '');
  }

  nameField.addEventListener('input', () => {
    idPreview.textContent = nameField.value.trim()
      ? makePassengerId(nameField.value)
      : 'KHI—0000';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = nameField.value.trim();

    if (!name) {
      nameField.focus();
      return;
    }

    const profile = {
      name: name,
      interest: interestField.value,
      signature: signatureField.value.trim(),
      id: makePassengerId(name),
      checkedInAt: new Date().toISOString()
    };

    const saved = window.KhloAirport.save(
      window.KhloAirport.PROFILE_KEY,
      profile
    );

    if (!saved) {
      alert('Your browser could not save the ID. Please check your storage settings and try again.');
      return;
    }

    window.location.href = 'boarding.html?next=departures.html';
  });
});
