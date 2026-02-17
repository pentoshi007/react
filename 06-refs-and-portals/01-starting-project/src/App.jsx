import Player from './components/Player.jsx';
import { TimerChallenge } from './components/TimerChallenge.jsx';

function App() {
  return (
    <>
      <Player />
      <div id="challenges">
        <TimerChallenge title="Easy" targetTime={2} />
        <TimerChallenge title="Medium" targetTime={5} />
        <TimerChallenge title="Hard" targetTime={8} />
        <TimerChallenge title="Insane" targetTime={10} />
      </div>
    </>
  );
}

export default App;
