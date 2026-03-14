import { useEffect, useState } from 'react';

function useFetch(fetchFunction, initialValue) {
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState(initialValue);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setIsFetching(true);
            try {
                const places = await fetchFunction();
                setData(places);
            } catch (error) {
                setError({ message: error.message || 'Failed to fetch data.' });
            }

            setIsFetching(false);
        }

        fetchData();
    }, [fetchFunction]);
    // Answer: React compares dependency values using Object.is() (similar to ===).
    // For functions, this means reference equality - the effect runs when the
    // function reference changes. Unlike primitive state values, functions are
    // objects, so a new function instance (even with identical code) is considered
    // "different". To prevent unnecessary re-runs, wrap fetchFunction with
    // useCallback in the parent component to maintain a stable reference.
    // This is different from state changes where React compares the actual values.

    return { isFetching, data, error, setData };
}

export default useFetch;