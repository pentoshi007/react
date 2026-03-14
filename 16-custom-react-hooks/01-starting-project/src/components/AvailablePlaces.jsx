import { useState, useEffect } from 'react';

import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';
import useFetch from '../hooks/useFetch.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const {
    isFetching,
    data: availablePlaces,
    error,
  } = useFetch(fetchAvailablePlaces, []);
  //totally independent of useFetch in App.jsx
  const [sortedPlaces, setSortedPlaces] = useState([]);

  useEffect(() => {
    if (!availablePlaces || availablePlaces.length === 0) {
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const placesSortedByDistance = sortPlacesByDistance(
        availablePlaces,
        position.coords.latitude,
        position.coords.longitude
      );
      setSortedPlaces(placesSortedByDistance);
    });
  }, [availablePlaces]);

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={sortedPlaces.length > 0 ? sortedPlaces : availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
