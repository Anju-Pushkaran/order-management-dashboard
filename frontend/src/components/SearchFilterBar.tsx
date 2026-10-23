import { ORDER_STATUSES } from "../types/order";
import type { StatusFilter } from "../utils/filterOrders";
import "./SearchFilterBar.css";
import { SORT_OPTIONS, type SortOption } from "../utils/sortOrders";

interface SearchFilterBarProps {
  searchText: string;
  statusFilter: StatusFilter;
  sortOption: SortOption;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onSortChange: (value: SortOption) => void;
}

function SearchFilterBar({
  searchText,
  statusFilter,
  sortOption,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: SearchFilterBarProps) {
  return (
    <div className="search-filter-bar">
      <label className="field">
        <span>Search</span>
        <input
          type="search"
          placeholder="Order ID or customer name"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label className="field">
        <span>Status</span>
        <select
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value as StatusFilter)
          }
        >
          <option value="All">All statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Sort by</span>
        <select
          value={sortOption}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default SearchFilterBar;
