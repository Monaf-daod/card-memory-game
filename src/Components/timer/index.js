import { CountdownCircleTimer } from "react-countdown-circle-timer";

const CounterTimer = ({
  timeDuration,
  colorsTime = [5, 4, 1, 0],
  isPlaying,
  onComplete,
}) => (
  <CountdownCircleTimer
    isPlaying={isPlaying}
    duration={timeDuration || 5}
    colors={["#0DF909", "#BFF909", "#ff5500", "#ff0000"]}
    colorsTime={colorsTime}
    onComplete={onComplete}
  >
    {({ remainingTime }) => remainingTime}
  </CountdownCircleTimer>
);

export default CounterTimer;
