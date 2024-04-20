import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import stylecss from '../../styles-page/exam.module.css';

function EnhancedTableToolbar({ numSelected, onSearch, searchText, searchHandlers, handleCreateExam }) {
  const { handleSearchInputChange } = searchHandlers;

  const handleSearch = () => {
    onSearch(searchText);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
      {numSelected > 0 ? (
        <Typography variant="subtitle1" component="div">Đã chọn&nbsp;{numSelected} câu hỏi
        </Typography>
      ) : (
        <Typography variant="h6" id="tableTitle" component="div">
          Câu hỏi
        </Typography>
      )}
      <InputBase
        placeholder="Tìm kiếm..."
        inputProps={{ 'aria-label': 'search' }}
        sx={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '4px 8px',
          width: '60%',
        }}
        value={searchText}
        onChange={handleSearchInputChange}
        onKeyPress={handleKeyPress}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="search"
              onClick={handleSearch}
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
      {numSelected > 0 ? (
        <Tooltip title="Bắt đầu">
          <button className={stylecss.buttonStart} onClick={handleCreateExam}>Bắt đầu</button>
        </Tooltip>
      ) : (
        <Tooltip title="Danh sách câu hỏi">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
  searchHandlers: PropTypes.object.isRequired,
};

export default EnhancedTableToolbar;
