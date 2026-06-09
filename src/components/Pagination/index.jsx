export default function Pagination({ page, total, perPage, onPageChange }) {
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="btn btn-secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>

      <span className="pagination-info">
        {page} / {totalPages}
      </span>

      <button
        className="btn btn-secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}
