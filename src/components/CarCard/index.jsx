import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import CarIcon from '../CarIcon';
import { startEngine, stopEngine, driveMode } from '../../api';

const CarCard = forwardRef(({ car, onSelect, onDelete, isRaceActive }, ref) => {
  const carEl = useRef(null);
  const trackEl = useRef(null);
  const startTime = useRef(0);
  const [engineOn, setEngineOn] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleStartEngine() {
    setLoading(true);
    const data = await startEngine(car.id);
    const duration = Math.round(data.distance / data.velocity);
    startTime.current = Date.now();

    if (carEl.current && trackEl.current) {
      const trackW = trackEl.current.offsetWidth;
      carEl.current.style.transition = `transform ${duration}ms linear`;
      carEl.current.style.transform = `translateX(${trackW - 90}px)`;
    }

    setEngineOn(true);
    setLoading(false);

    try {
      await driveMode(car.id);
      return { broken: false, time: Date.now() - startTime.current };
    } catch {
      if (carEl.current) {
        const tx = window.getComputedStyle(carEl.current).transform;
        carEl.current.style.transition = 'none';
        carEl.current.style.transform = tx;
      }
      return { broken: true, time: 0 };
    }
  }

  async function handleStopEngine() {
    await stopEngine(car.id);
    setEngineOn(false);
    if (carEl.current) {
      carEl.current.style.transition = 'transform 0.4s ease';
      carEl.current.style.transform = 'translateX(0)';
    }
  }

  useImperativeHandle(ref, () => ({
    startRace: handleStartEngine,
    reset: handleStopEngine,
  }));

  return (
    <div className="car-card">
      <div className="car-controls-row">
        <div className="car-btns">
          <button
            className="btn btn-small btn-select"
            onClick={() => onSelect(car)}
            disabled={isRaceActive}
          >
            Select
          </button>
          <button
            className="btn btn-small btn-danger"
            onClick={() => onDelete(car.id)}
            disabled={isRaceActive}
          >
            Delete
          </button>
        </div>
        <div className="car-engine-btns">
          <button
            className="btn btn-small btn-go"
            onClick={handleStartEngine}
            disabled={engineOn || loading}
          >
            A
          </button>
          <button
            className="btn btn-small btn-stop"
            onClick={handleStopEngine}
            disabled={!engineOn}
          >
            B
          </button>
        </div>
        <span className="car-name">{car.name}</span>
      </div>

      <div className="car-track" ref={trackEl}>
        <div className="car-mover" ref={carEl}>
          <CarIcon color={car.color} size={80} />
        </div>
        <div className="finish-flag">🏁</div>
      </div>
    </div>
  );
});

CarCard.displayName = 'CarCard';
export default CarCard;
