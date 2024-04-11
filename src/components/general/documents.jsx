import React from "react";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import FolderIcon from '@mui/icons-material/Folder'

export const Documents = (props) => {
  const [value, setValue] = React.useState(0);
  const [filterValue, setFilterValue] = React.useState('');
  const [sortValue, setSortValue] = React.useState('');
  const [searchValue, setSearchValue] = React.useState('');
  let [filteredData, setFilteredData] = React.useState([]);
  const handleChange = (event, newValue) => {
    // setValue(newValue);
  };

  const handleFilterChange = (event) => {
    // setFilterValue(event.target.value);
    // setSearchValue('');
  };

  const handleSortChange = (event) => {
    // setSortValue(event.target.value);
  };

  const handleSearchChange = (event) => {
    // const searchValue = event.target.value;
    // setSearchValue(searchValue);
    // const searchData = searchFunction(data, searchValue);
    // setFilterValue(0);
    // setFilteredData(searchData); 
  };

  // Hàm tìm kiếm chung
  const searchFunction = (data, searchValue) => {
    return data.filter(item => {
      // Tìm kiếm dựa trên ID và name
      // return (
      //   item.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      //   item.name.toLowerCase().includes(searchValue.toLowerCase())
      // );
    });
  };
  // Lọc dữ liệu
  // filteredData = searchValue ? searchFunction(data, searchValue) : data;
  // switch (filterValue) {
  //   case '1':
  //     filteredData = data.filter(item => item.year === '1');
  //     break;
  //   case '2':
  //     filteredData = data.filter(item => item.year === '2');
  //     break;
  //   case '3':
  //     filteredData = data.filter(item => item.year === '3');
  //     break;
  //   case '4':
  //     filteredData = data.filter(item => item.year === '4');
  //     break;
  //   case '5':
  //     filteredData = data.filter(item => item.credits === '1');
  //     break;
  //   case '6':
  //     filteredData = data.filter(item => item.credits === '2');
  //     break;
  //   case '7':
  //     filteredData = data.filter(item => item.credits === '3');
  //     break;
  //   case '8':
  //     filteredData = data.filter(item => item.credits === '4');
  //     break;
  //   default:
  //     break;
  // }
  // // Sắp xếp dữ liệu
  // let sortedData = filteredData;
  // switch (sortValue) {
  //   case '1':
  //     sortedData = filteredData.sort((a, b) => a.name.localeCompare(b.name));
  //     break;
  //   case '2':
  //     sortedData = filteredData.sort((a, b) => a.year - b.year);
  //     break;
  //   case '3':
  //     sortedData = filteredData.sort((a, b) => a.credits - b.credits);
  //     break;
  //   default:
  //     sortedData = filteredData;
  // }

  // const truncate = (str) => {
  //   return str.length > 15 ? str.substring(0, 15) + "..." : str;
  // };
  const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
    fontSize: '1.2rem',
    marginLeft: '13%',
  }));
  return (
    <div id="documents" className="text-center">
      <div className="container">
        <div className="section-title-doc">
          <h2>Tài liệu</h2>
          <p>
            Nơi chia sẻ tài liệu để mọi người có thể tham khảo một cách dễ dàng và nhanh chóng.
          </p>
        </div>
        <div className="row">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} className="grid-item">
              <FormControl fullWidth>
                <StyledInputLabel id="filter-label">Lọc</StyledInputLabel>
                <Select
                  labelId="filter-label"
                  id="filter"
                  value={filterValue}
                  // onChange={}
                  className="custom-select"
                >
                  <MenuItem value="0">Tất cả</MenuItem>
                  <MenuItem value="1">Năm 1</MenuItem>
                  <MenuItem value="2">Năm 2</MenuItem>
                  <MenuItem value="3">Năm 3</MenuItem>
                  <MenuItem value="4">Năm 4</MenuItem>
                  <MenuItem value="5">1 Tín chỉ</MenuItem>
                  <MenuItem value="6">2 Tín chỉ</MenuItem>
                  <MenuItem value="7">3 Tín chỉ</MenuItem>
                  <MenuItem value="8">4 Tín chỉ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} className="grid-item">
              <FormControl fullWidth>
                <StyledInputLabel id="sort-label">Sắp xếp</StyledInputLabel>
                <Select
                  labelId="sort-label"
                  id="sort"
                  value={sortValue}
                  // onChange={}
                  className="custom-select"
                >
                  <MenuItem value="0">Mặc định</MenuItem>
                  <MenuItem value="1">Theo tên</MenuItem>
                  <MenuItem value="2">Theo năm học</MenuItem>
                  <MenuItem value="3">Theo tín chỉ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} className="grid-item">
              <TextField
                fullWidth
                id="search"
                label="Tìm kiếm"
                value={searchValue}
                // onChange={}
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
                InputLabelProps={{
                  className: 'textfield-label'
                }}
                className="custom-textfield"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="flex-start">
          <Grid item xs={12} sm={6} md={4}>
          <div className="card">
              <div className="folder-icon">
                <FolderIcon style={{ fontSize: 50, color: '#CD8500' }} />
              </div>
              <div className="folder-details">
                <h3 className="folder-name">Tên thư mục</h3>
                <p className="folder-info">Thông tin bổ sung về thư mục...</p>
              </div>
            </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
          <div className="card">
              <div className="folder-icon">
                <FolderIcon style={{ fontSize: 50, color: '#CD8500' }} />
              </div>
              <div className="folder-details">
                <h3 className="folder-name">Tên thư mục</h3>
                <p className="folder-info">Thông tin bổ sung về thư mục...</p>
              </div>
            </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
          <div className="card">
              <div className="folder-icon">
                <FolderIcon style={{ fontSize: 50, color: '#CD8500' }} />
              </div>
              <div className="folder-details">
                <h3 className="folder-name">Tên thư mục</h3>
                <p className="folder-info">Thông tin bổ sung về thư mục...</p>
              </div>
            </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
          <div className="card">
              <div className="folder-icon">
                <FolderIcon style={{ fontSize: 50, color: '#CD8500' }} />
              </div>
              <div className="folder-details">
                <h3 className="folder-name">Tên thư mục</h3>
                <p className="folder-info">Thông tin bổ sung về thư mục...</p>
              </div>
            </div>
            </Grid>
            </Grid>
        </div>
      </div>
    </div>
  );
};
