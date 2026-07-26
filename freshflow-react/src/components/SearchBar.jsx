// reusable search bar component
// controlled input using useState from parent, passed down as props
function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-bar">
      <i className="fa-solid fa-magnifying-glass search-icon"></i>
      <input
        type="text"
        placeholder="Search inventory by name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
}

export default SearchBar;
