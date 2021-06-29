import React, { useState, useEffect } from 'react';
// import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     formControl: {
//       minWidth: '100%',
//       '& .MuiOutlinedInput-input': {
//         padding: '12px 20px !important',
//         color: '#808080',
//       },
//       '& .MuiAutocomplete-inputRoot': {
//         paddingTop: 0,
//         paddingBottom: 0,
//       },
//       '& .MuiAutocomplete-root': {
//         width: '100% !important',
//       },
//       '& .MuiInputLabel-outlined': {
//         transform: 'translate(14px, 14px)',
//         fontSize: 14,
//         backgroundColor: '#FFFFFF',
//       },
//       '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
//         transform: 'translate(14px, -6px) scale(0.75)',
//       },
//     },
//   })
// );

const SearchBilling = ({ updateFilters, searchData }) => {

  useEffect(() => {
    if (searchData) setSearchValue(searchData);
  }, [searchData]);

  const [searchValue, setSearchValue] = useState(searchData);
  // const [focused, setFocused] = useState(false);

  const handleBlur = () => {
    // setFocused(false);
    updateFilters({ search: searchValue, page: 0 });
    closeSearch();
  };

  const closeSearch = () => {
    // setFocused(false);
  };

  const handleTextChange = ({ target }) => {
    setSearchValue(target.value);
  };

  const enterFunction = (event) => {
    if (event.key === 'Enter') {
      updateFilters({ search: searchValue, page: 0 });
      closeSearch();
    }
  };

  const handleFocus = () => {
    // setFocused(true);
  };

  return (
    <div className="mr-4">
      <TextField
        className="mt-3 w-100"
        placeholder="Search"
        fullWidth
        onKeyPress={(event) => enterFunction(event)}
        value={searchValue}
        onChange={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default SearchBilling;
