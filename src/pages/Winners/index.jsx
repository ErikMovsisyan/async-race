import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setWinners, setWinnersPage, setSortField, setSortOrder } from '../../store/winnersSlice';
import { getWinners, getCar } from '../../api';
import Pagination from '../../components/Pagination';
import CarIcon from '../../components/CarIcon';

const WINNERS_PER_PAGE = 10;

export default function Winners() {
  const dispatch = useAppDispatch();
  const { winners, total, page, sortField, sortOrder } = useAppSelector((s) => s.winners);

  const loadWinners = useCallback(async (p, field, order) => {
    const data = await getWinners(p, WINNERS_PER_PAGE, field, order);
    const full = await Promise.all(
      data.winners.map(async (w) => {
        const car = await getCar(w.id);
        return { ...w, car };
      }),
    );
    dispatch(setWinners({ winners: full, total: data.total }));
  }, [dispatch]);

  useEffect(() => {
    void loadWinners(page, sortField, sortOrder);
  }, [page, sortField, sortOrder, loadWinners]);

  function handleSort(field) {
    if (field === sortField) {
      dispatch(setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortOrder('ASC'));
    }
  }

  function sortArrow(field) {
    if (sortField !== field) return '';
    return sortOrder === 'ASC' ? ' ▲' : ' ▼';
  }

  return (
    <div className="winners-page">
      <h2 className="section-title">
        Winners <span className="count">({total})</span>
      </h2>

      {winners.length === 0 ? (
        <p className="empty-msg">No winners yet. Run a race first!</p>
      ) : (
        <table className="winners-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Car</th>
              <th>Name</th>
              <th className="sortable" onClick={() => handleSort('wins')}>
                Wins{sortArrow('wins')}
              </th>
              <th className="sortable" onClick={() => handleSort('time')}>
                Best Time (s){sortArrow('time')}
              </th>
            </tr>
          </thead>
          <tbody>
            {winners.map((w, i) => (
              <tr key={w.id}>
                <td>{(page - 1) * WINNERS_PER_PAGE + i + 1}</td>
                <td><CarIcon color={w.car.color} size={60} /></td>
                <td>{w.car.name}</td>
                <td>{w.wins}</td>
                <td>{w.time.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination
        page={page}
        total={total}
        perPage={WINNERS_PER_PAGE}
        onPageChange={(p) => dispatch(setWinnersPage(p))}
      />
    </div>
  );
}
