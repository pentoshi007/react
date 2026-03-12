import Places from './Places.jsx';
import { useState, useEffect } from 'react';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetch('http://localhost:3000/places')
  //     .then((data) => data.json())
  //     .then((json) => setAvailablePlaces(json.places));

  // }, []);

  useEffect(() => {
    async function fetchAvailablePlaces() {
      setIsFetching(true);
      try {
        const response = await fetch('http://localhost:3000/places');
        const json = await response.json();
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const sortedPlaces = sortPlacesByDistance(
              json.places,
              position.coords.latitude,
              position.coords.longitude
            );
            setAvailablePlaces(sortedPlaces);
            setIsFetching(false);
          },
          () => {
            setAvailablePlaces(json.places);
            setIsFetching(false);
          }
        );
      } catch (error) {
        setError({ message: error.message || 'Could not fetch places, please try again later.' });
        setIsFetching(false);
      }
    }
    fetchAvailablePlaces();
  }, []);

  if (error) {
    return (
      <Error
        title="An error occurred!"
        message={error.message}
      />
    );
  }

  return (
    <Places
      title="Available Places"
      isLoading={isFetching}
      LoadingText="Loading places..."
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
