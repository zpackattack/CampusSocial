import "./SearchResultsList.css";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({ results, handleUniversitySelection }) => {
  return (
    <div className="results-list">
      {results.map((result, id) => {
        return <SearchResult result={result} key={id} handleUniversitySelection={handleUniversitySelection} />;
      })}
    </div>
  );
};
