import { useRef, useState, useEffect, useCallback } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

// This code is outside the component because:
// 1. It only needs to run once when the module loads (not on every re-render)
// 2. localStorage is synchronous and fast, so no need for useEffect
// 3. It doesn't depend on any component state or props
const storedIds = JSON.parse(localStorage.getItem('pickedPlaces')) || [];
const storedPlaces = storedIds.map((id) => AVAILABLE_PLACES.find((place) => place.id === id)).filter(Boolean);
const filteredAvailablePlaces = AVAILABLE_PLACES.filter(
  (place) => !storedIds.includes(place.id)
);

function App() {
  const [modelIsOpen, setModelIsOpen] = useState(false);//we have switched to declarative state management instead of imperative state management-{explain both and which is better and why we have switched to declarative state management}
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState(filteredAvailablePlaces);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      // Filter out already picked places when setting available places
      const filteredPlaces = sortedPlaces.filter(
        (place) => !storedIds.includes(place.id)
      );
      setAvailablePlaces(filteredPlaces);
    });

  }, []);

  function handleStartRemovePlace(id) {
    setModelIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModelIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // Remove selected place from available places
    setAvailablePlaces((prevAvailablePlaces) =>
      prevAvailablePlaces.filter((place) => place.id !== id)
    );

    // This is also a side effect but it does not need to be inside a useEffect hook.
    // Not every side effect needs useEffect - this runs in response to a user action.
    const storedIds = JSON.parse(localStorage.getItem('pickedPlaces')) || [];
    if (!storedIds.includes(id)) {
      localStorage.setItem('pickedPlaces', JSON.stringify([id, ...storedIds]));
    }
  }

  const handleRemovePlace = useCallback(() => {
    const removedId = selectedPlace.current;
    const removedPlace = pickedPlaces.find((place) => place.id === removedId);

    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== removedId)
    );

    // Add the removed place back to available places
    if (removedPlace) {
      setAvailablePlaces((prevAvailablePlaces) => {
        // Insert back in sorted order would require distance calculation
        // For simplicity, add to the end
        return [...prevAvailablePlaces, removedPlace];
      });
    }

    setModelIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem('pickedPlaces')) || [];
    localStorage.setItem(
      'pickedPlaces',
      JSON.stringify(storedIds.filter((storedId) => storedId !== removedId))
    );
  }, []);
  //what issue the usecalback solves here and how is it related to delecteconfirmation component and onconfirm function passing in dependency to useeffect hook?

  return (
    <>
      <Modal open={modelIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          open={modelIsOpen}
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );

}


export default App;
