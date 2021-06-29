/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { withStyles, TextField, Icon } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSelector } from 'react-redux'

const filters = [
  { key: 'id:', value: 'ID of job' },
  { key: 'sid:', value: 'Shift ID' },
  { key: 'loc:', value: 'Location Address' },
  { key: 'po:', value: 'PO #' },
  { key: 'wname:', value: 'Worker`s Name' },
  { key: 'wphone:', value: 'Worker`s Phone Number' },
  { key: 'wr:', value: 'Work Request Nr' },
];

const styles = {
  root: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    height: '100%',
    paddingRight: '30px',
    '& .MuiAutocomplete-popupIndicator': {
      display: 'none',
    },
    '& .MuiInput-underline.Mui-disabled:before': {
      borderBottom: 'none',
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: 'none',
    },
    '& .MuiInput-underline:before': {
      borderBottom: 'none',
    },
    '& .MuiInput-underline.Mui-focused:after': {
      borderBottom: 'none',
    },
    '& .MuiInput-underline:after': {
      borderBottom: 'none',
    },
  },

  icon: {
    margin: '10px',
    padding: 0,
    fontSize: '24px',
    color: '#000000',
    opacity: 0.3,
  },
  input: {
    fontSize: '20px',
    letterSpacing: '0.44px',
    lineHeight: '16px',
    fontStyle: 'italic',
  },
  '& input:placeholder': {
    opacity: 0.38,
    fontSize: '20px',
    color: '#000000',
    letterSpacing: '0.44px',
    textAlign: 'left',
  },
  option: {
    fontSize: '14px',
    color: 'rgba(0,0,0,0.60)',
    letterSpacing: '0.25px',
    lineHeight: '20px',
  },
  key: {
    background: '#F5F6FB',
    borderRadius: '4px',
    padding: '1px 4px',
    marginRight: '10px',
  },
  noOptions: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    padding: '9px 16px',
    margin: '-9px -16px',
    fontSize: '14px',
    color: 'rgba(0,0,0,0.60)',
    letterSpacing: '0.25px',
    lineHeight: '20px',
  },
};

function SearchFC({ updateFilters, classes, clear, cleared }) {
  const [searchValue, setSearchValue] = useState('');
  const [focused, setFocused] = useState(false);
  const search_value = useSelector(state => state.jobs.locations_search_options.search);

  const getSearchText = () => {
    let result = searchValue;

    filters.map((value) => {
      if (result.search(value.key) === 0) {
        result = value.key + result.slice(value.key.length);
      }
      return null;
    });

    return result;
  };

  const showSearch = () => {
    setFocused(true);
  };

  const closeSearch = () => {
    setFocused(false);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    let search = getSearchText();
    updateFilters({ search: search, page: 0 });
    closeSearch();
  };

  const handleInputChange = (event, value, reason) => {
    setSearchValue(value);
    setFocused(true);
  };

  const handleTextChange = ({ target }) => {
    setSearchValue(target.value);
  };

  const enterFunction = (event) => {
    if (event.key === 'Enter') {
      let search = getSearchText();
      updateFilters({ search: search, page: 0 });
      closeSearch();
    }
  };

  useEffect(() => {
    if (focused === false && search_value !== searchValue) {
      setSearchValue(search_value);
    }
  }, [search_value]);


  return (
    <div className={classes.root}>
      <Icon className={classes.icon} color="action">
        search
      </Icon>

      <Autocomplete
        id="autocomplete-select"
        style={{ width: '100%' }}
        options={filters}
        inputValue={searchValue}
        open={focused}
        classes={{
          option: classes.option,
        }}
        clearOnEscape={true}
        disableCloseOnSelect={true}
        getOptionDisabled={(option) => option.key === null}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          return option.key;
        }}
        noOptionsText={<div className={classes.noOptions}>
            Show all results for {searchValue}
          </div>}
        onInputChange={handleInputChange}
        renderOption={(option) => {if (option.key === null) {return 'Suggested Filters';}
          return (
            <>
              <span className={classes.key}>{option.key}</span>
              {option.value}
            </>
          );
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              placeholder="Search by …"
              fullWidth
              inputProps={{
                ...params.inputProps,
                onFocus: showSearch,
                onBlur: closeSearch,
                autoComplete: 'off',
              }}
              onKeyPress={(event) => enterFunction(event)}
              onChange={handleTextChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          );
        }}
      />
    </div>
  );
}

export default withStyles(styles)(SearchFC);
