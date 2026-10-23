import { ORDER_STATUSES } from "../types/order";
import type { StatusFilter } from "../utils/filterOrders";
import "./SearchFilterBar.css";

interface SearchFilterBarProps {
  searchText: string;
  statusFilter: StatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
}

function SearchFilterBar({
  searchText,
  statusFilter,
  onSearchChange,
  onStatusChange,
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
    </div>
  );
}

export default SearchFilterBar;
