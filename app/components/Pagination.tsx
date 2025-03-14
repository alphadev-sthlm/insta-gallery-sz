'use client';

interface PaginationProps {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_more: boolean;
  items_per_page: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  current_page,
  total_pages,
  total_items,
  has_more,
  items_per_page,
  onPageChange
}: PaginationProps) {
  const startItem = (current_page - 1) * items_per_page + 1;
  const endItem = Math.min(current_page * items_per_page, total_items);

  return (
    <div className="flex justify-between items-center px-4 py-4 bg-white border-t">
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {total_items} images
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: total_pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                page === current_page
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={!has_more}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
} 