import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import Error from './components/Error.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

  useEffect(() => {
    async function fetchUserPlaces() {
      const response = await fetch('http://localhost:3000/user-places');
      if (response.ok) {
        const data = await response.json();
        setUserPlaces(data.places);
      }
    }

    fetchUserPlaces();
  }, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleDismissError() {
    setErrorUpdatingPlaces(null);
  }

  async function handleSelectPlace(selectedPlace) {
    // Check if place already exists
    if (userPlaces.some((place) => place.id === selectedPlace.id)) {
      return;
    }

    // Store previous state for rollback
    const previousPlaces = userPlaces;
    const updatedPlaces = [selectedPlace, ...previousPlaces];

    // Optimistically update UI
    setUserPlaces(updatedPlaces);

    try {
      const response = await fetch('http://localhost:3000/user-places', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ places: updatedPlaces }),
      });

      if (!response.ok) {
        // Rollback on failure
        setUserPlaces(previousPlaces);
        throw new Error('Failed to add place');
      }
    } catch (error) {
      // Rollback on error
      setUserPlaces(previousPlaces);
      setErrorUpdatingPlaces({
        title: 'Failed to add place',
        message: error.message,
      });
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    // Store previous state for rollback
    const previousPlaces = userPlaces;
    const updatedPlaces = userPlaces.filter((place) => place.id !== selectedPlace.current.id);

    // Optimistically update UI
    setUserPlaces(updatedPlaces);

    try {
      const response = await fetch('http://localhost:3000/user-places', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          places: updatedPlaces,
        }),
      });

      if (!response.ok) {
        // Rollback on failure
        setUserPlaces(previousPlaces);
        throw new Error('Failed to remove place');
      }

      setModalIsOpen(false);
    } catch (error) {
      // Rollback on error
      setUserPlaces(previousPlaces);
      setErrorUpdatingPlaces({
        title: 'Failed to remove place',
        message: error.message,
      });
    }
  }, [userPlaces]);

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <Modal open={!!errorUpdatingPlaces} onClose={handleDismissError}>
        {errorUpdatingPlaces && (
          <Error
            title={errorUpdatingPlaces.title}
            message={errorUpdatingPlaces.message}
            onConfirm={handleDismissError}
          />
        )}
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
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
