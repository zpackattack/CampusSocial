import "./SearchResult.css";

export const SearchResult = ({ result, handleUniversitySelection }) => {
  const handleClick = () => {
    console.log(result);
    handleUniversitySelection(result);
  };

  return (
    <div
      className="search-result"
      onClick={handleClick}
    >
      {result.name}
    </div>
  );
};
