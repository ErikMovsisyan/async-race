import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setCars, setPage, setSelectedCar,
  setNewCarName, setNewCarColor,
  setEditCarName, setEditCarColor,
  setIsRacing, setWinner,
} from '../../store/carsSlice';
import {
  getCars, createCar, updateCar, deleteCar,
  getWinner, createWinner, updateWinner, deleteWinner,
} from '../../api';
import CarCard from '../../components/CarCard';
import type { CarCardHandle } from '../../components/CarCard';
import Pagination from '../../components/Pagination';
import WinnerBanner from '../../components/WinnerBanner';
import type { Car } from '../../types';

const CARS_PER_PAGE = 7;

const BRANDS = ['Tesla', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Toyota', 'Lamborghini', 'Ferrari', 'Porsche', 'Honda'];
const MODELS = ['Model S', 'Mustang', 'M3', 'AMG GT', 'RS6', 'Supra', 'Huracan', '488 GTB', '911', 'Civic'];

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

function randomCarName() {
  const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
  const model = MODELS[Math.floor(Math.random() * MODELS.length)];
  return `${brand} ${model}`;
}

export default function Garage() {
  const dispatch = useAppDispatch();
  const { cars, total, page, selectedCar, newCarName, newCarColor, editCarName, editCarColor, isRacing, winner } =
    useAppSelector((s) => s.cars);

  const cardRefs = useRef<(CarCardHandle | null)[]>([]);
  const bannerTimeRef = useRef(0);

  const loadCars = useCallback(async (p: number) => {
    const data = await getCars(p, CARS_PER_PAGE);
    dispatch(setCars(data));
  }, [dispatch]);

  useEffect(() => {
    void loadCars(page);
  }, [page, loadCars]);

  async function handleCreate() {
    if (!newCarName.trim()) return;
    await createCar(newCarName.trim(), newCarColor);
    dispatch(setNewCarName(''));
    await loadCars(page);
  }

  async function handleUpdate() {
    if (!selectedCar || !editCarName.trim()) return;
    await updateCar(selectedCar.id, editCarName.trim(), editCarColor);
    dispatch(setSelectedCar(null));
    await loadCars(page);
  }

  async function handleDelete(id: number) {
    await deleteCar(id);
    await deleteWinner(id).catch(() => {}); // might not exist
    const newTotal = total - 1;
    const maxPage = Math.max(1, Math.ceil(newTotal / CARS_PER_PAGE));
    const nextPage = page > maxPage ? maxPage : page;
    dispatch(setPage(nextPage));
    await loadCars(nextPage);
  }

  async function generateCars() {
    const promises = Array.from({ length: 100 }, () =>
      createCar(randomCarName(), randomColor()),
    );
    await Promise.all(promises);
    await loadCars(page);
  }

  async function saveRaceWinner(car: Car, timeMs: number) {
    const timeSec = parseFloat((timeMs / 1000).toFixed(2));
    const existing = await getWinner(car.id);
    if (existing) {
      await updateWinner(car.id, existing.wins + 1, Math.min(existing.time, timeSec));
    } else {
      await createWinner(car.id, 1, timeSec);
    }
  }

  async function handleRace() {
    dispatch(setIsRacing(true));
    dispatch(setWinner(null));

    let firstWinner: Car | null = null;

    const promises = cars.map((car, i) => {
      const cardRef = cardRefs.current[i];
      if (!cardRef) return Promise.resolve();
      return cardRef.startRace().then(({ broken, time }) => {
        if (!broken && !firstWinner) {
          firstWinner = car;
          bannerTimeRef.current = time;
          dispatch(setWinner(car));
          void saveRaceWinner(car, time);
        }
      });
    });

    await Promise.all(promises);
    dispatch(setIsRacing(false));
  }

  async function handleReset() {
    await Promise.all(cardRefs.current.map((ref) => ref?.reset()));
    dispatch(setIsRacing(false));
    dispatch(setWinner(null));
  }

  function handlePageChange(p: number) {
    dispatch(setPage(p));
  }

  return (
    <div className="garage-page">
      {winner && (
        <WinnerBanner
          winner={winner}
          time={bannerTimeRef.current}
          onClose={() => dispatch(setWinner(null))}
        />
      )}

      <div className="control-panel">
        <div className="car-form">
          <input
            className="input"
            placeholder="Car name"
            value={newCarName}
            onChange={(e) => dispatch(setNewCarName(e.target.value))}
            onKeyDown={(e) => e.key === 'Enter' && void handleCreate()}
          />
          <input
            type="color"
            className="color-picker"
            value={newCarColor}
            onChange={(e) => dispatch(setNewCarColor(e.target.value))}
          />
          <button className="btn btn-primary" onClick={() => void handleCreate()}>
            Create
          </button>
        </div>

        <div className="car-form">
          <input
            className="input"
            placeholder="Select a car to edit"
            value={editCarName}
            disabled={!selectedCar}
            onChange={(e) => dispatch(setEditCarName(e.target.value))}
          />
          <input
            type="color"
            className="color-picker"
            value={editCarColor}
            disabled={!selectedCar}
            onChange={(e) => dispatch(setEditCarColor(e.target.value))}
          />
          <button className="btn btn-primary" onClick={() => void handleUpdate()} disabled={!selectedCar}>
            Update
          </button>
        </div>

        <div className="race-controls">
          <button className="btn btn-race" onClick={() => void handleRace()} disabled={isRacing || cars.length === 0}>
            Race
          </button>
          <button className="btn btn-reset" onClick={() => void handleReset()} disabled={!isRacing}>
            Reset
          </button>
          <button className="btn btn-secondary" onClick={() => void generateCars()} disabled={isRacing}>
            Generate 100 Cars
          </button>
        </div>
      </div>

      <h2 className="section-title">
        Garage <span className="count">({total})</span>
      </h2>

      {cars.length === 0 ? (
        <p className="empty-msg">No cars yet. Create one or generate 100!</p>
      ) : (
        <div className="car-list">
          {cars.map((car, i) => (
            <CarCard
              key={car.id}
              car={car}
              isRaceActive={isRacing}
              onSelect={(c) => dispatch(setSelectedCar(c))}
              onDelete={(id) => void handleDelete(id)}
              ref={(el) => { cardRefs.current[i] = el; }}
            />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        total={total}
        perPage={CARS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
