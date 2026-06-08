import CarIcon from '../CarIcon';
import type { Car } from '../../types';

interface Props {
  winner: Car;
  time: number;
  onClose: () => void;
}

export default function WinnerBanner({ winner, time, onClose }: Props) {
  return (
    <div className="banner-overlay" onClick={onClose}>
      <div className="banner-box" onClick={(e) => e.stopPropagation()}>
        <h2>🏆 Winner!</h2>
        <CarIcon color={winner.color} size={100} />
        <p className="banner-name">{winner.name}</p>
        <p className="banner-time">Time: {(time / 1000).toFixed(2)}s</p>
        <button className="btn btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
