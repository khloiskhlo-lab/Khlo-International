(() => {
  const PROFILE_KEY = 'khloIntPassengerV1';
  const SEAT_KEY = 'khloIntSeatV1';

  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null');
    } catch (error) {
      console.warn('Could not read saved airport data:', error);
      return null;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Could not save airport data:', error);
      return false;
    }
  }

  function passenger() {
    return read(PROFILE_KEY);
  }

  function seat() {
    return read(SEAT_KEY);
  }

  function passengerName() {
    const profile = passenger();
    return profile && profile.name ? profile.name : 'Passenger';
  }

  function passengerId() {
    const profile = passenger();
    return profile && profile.id ? profile.id : 'KHI—0000';
  }

  window.KhloAirport = {
    PROFILE_KEY,
    SEAT_KEY,
    read,
    save,
    passenger,
    seat,
    passengerName,
    passengerId
  };
})();
