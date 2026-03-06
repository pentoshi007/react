import { useState, memo, useCallback, useMemo } from 'react';
//added memo to prevent re-rendering of the component when the props are the same(do we even have to add it in latest react version?)

import IconButton from '../UI/IconButton.jsx';
import MinusIcon from '../UI/Icons/MinusIcon.jsx';
import PlusIcon from '../UI/Icons/PlusIcon.jsx';
import CounterOutput from './CounterOutput.jsx';
import { log } from '../../log.js';

function isPrime(number) {
  log(
    'Calculating if is prime number',
    2,
    'other'
  );
  if (number <= 1) {
    return false;
  }

  const limit = Math.sqrt(number);

  for (let i = 2; i <= limit; i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
}

const Counter = memo(({ initialCount }) => {
  log('<Counter /> rendered', 1);
  // Here we could consider removing memo, because App no longer re-renders on every input keystroke after moving enteredNumber state out.
  const initialCountIsPrime = useMemo(() => isPrime(initialCount), [initialCount]);

  const [counter, setCounter] = useState(initialCount);

  const handleDecrement = useCallback(function handleDecrement() {
    setCounter((prevCounter) => prevCounter - 1);
  }, []);

  const handleIncrement = useCallback(function handleIncrement() {
    setCounter((prevCounter) => prevCounter + 1);
  }, []);

  return (
    <section className="counter">
      <p className="counter-info">
        The initial counter value was <strong>{initialCount}</strong>. It{' '}
        <strong>is {initialCountIsPrime ? 'a' : 'not a'}</strong> prime number.
      </p>
      <p>
        <IconButton icon={MinusIcon} onClick={handleDecrement}>
          Decrement
        </IconButton>
        <CounterOutput value={counter} />
        <IconButton icon={PlusIcon} onClick={handleIncrement}>
          Increment
        </IconButton>
      </p>
    </section>
  );
});

export default Counter;