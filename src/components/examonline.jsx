import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { CardItem } from './card'
import { Link } from 'react-router-dom';

const CustomCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

export const Exam = (props) => {
  const [value, setValue] = React.useState(0);
  const [filterValue, setFilterValue] = React.useState('');
  const [sortValue, setSortValue] = React.useState('');
  const [searchValue, setSearchValue] = React.useState('');
  let [filteredData, setFilteredData] = React.useState([]);

  const data = props.data?.main || [];


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
    setSearchValue('');
  };

  const handleSortChange = (event) => {
    setSortValue(event.target.value);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchValue(searchValue);
    const searchData = searchFunction(data, searchValue);
    setFilterValue(0);
    setFilteredData(searchData);
  };

  // Hàm tìm kiếm chung
  const searchFunction = (data, searchValue) => {
    return data.filter(item => {
      // Tìm kiếm dựa trên ID và name
      return (
        item.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
  };
  // Lọc dữ liệu
  filteredData = searchValue ? searchFunction(data, searchValue) : data;
  switch (filterValue) {
    case '1':
      filteredData = data.filter(item => item.year === '1');
      break;
    case '2':
      filteredData = data.filter(item => item.year === '2');
      break;
    case '3':
      filteredData = data.filter(item => item.year === '3');
      break;
    case '4':
      filteredData = data.filter(item => item.year === '4');
      break;
    case '5':
      filteredData = data.filter(item => item.credits === '1');
      break;
    case '6':
      filteredData = data.filter(item => item.credits === '2');
      break;
    case '7':
      filteredData = data.filter(item => item.credits === '3');
      break;
    case '8':
      filteredData = data.filter(item => item.credits === '4');
      break;
    default:
      break;
  }
  // Sắp xếp dữ liệu
  let sortedData = filteredData;
  switch (sortValue) {
    case '1':
      sortedData = filteredData.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case '2':
      sortedData = filteredData.sort((a, b) => a.year - b.year);
      break;
    case '3':
      sortedData = filteredData.sort((a, b) => a.credits - b.credits);
      break;
    default:
      sortedData = filteredData;
  }

  return (
    <div id="examonline" className="text-center">
      <div className="container">
        <div className="col-md-10 col-md-offset-1 section-title">
          <h2>Làm kiểm tra trực tuyến</h2>
          <p>
            Chào bạn đến với chuyên mục làm kiểm tra trực tuyến, hãy cố gắng để đạt kết quả tốt nhất nhé😉😉!!
          </p>
        </div>
        <div className="col-md-10 col-md-offset-1 section-title">
          <Box sx={{ width: '100%', marginTop: '-50px' }}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab style={{ fontSize: '20px', textTransform: 'none' }} label="Tin học cơ bản" />
              <Tab style={{ fontSize: '20px', textTransform: 'none' }} label="Các môn chuyên ngành" />
            </Tabs>
            {value === 0 && (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  {props.data ? props.data.basic.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Link to={`/examoption/${item.id}`}>
                        <CustomCard>
                          <CardContent>
                            <Typography variant="h5" component="h2">
                              {item.title}
                            </Typography>
                            <Typography variant="body2" component="p" style={{ fontSize: '13px' }}>
                              {item.text}
                            </Typography>
                          </CardContent>
                          <CardMedia component="img" src={item.img} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </CustomCard>
                      </Link>
                    </Grid>
                  )) : "loading"}
                </Grid>
              </Box>
            )}
            {value === 1 && (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <Select
                        id="filter"
                        value={filterValue}
                        onChange={handleFilterChange}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return <em>Lọc môn học</em>;
                          }
                          switch (selected) {
                            case "0":
                              return "Tất cả";
                            case "1":
                              return "Năm 1";
                            case "2":
                              return "Năm 2";
                            case "3":
                              return "Năm 3";
                            case "4":
                              return "Năm 4";
                            case "5":
                              return "1 Tín chỉ";
                            case "6":
                              return "2 Tín chỉ";
                            case "7":
                              return "3 Tín chỉ";
                            case "8":
                              return "4 Tín chỉ";
                            default:
                              return "";
                          }
                        }}
                      >
                        <MenuItem value="" disabled>
                          <em>Lọc môn học</em>
                        </MenuItem>
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
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <Select
                        id="sort"
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return <em>Sắp xếp môn học</em>;
                          }
                          switch (selected) {
                            case "0":
                              return "Mặc định";
                            case "1":
                              return "Theo tên";
                            case "2":
                              return "Theo năm học";
                            case "3":
                              return "Theo tín chỉ";
                            default:
                              return "";
                          }
                        }}
                        value={sortValue}
                        onChange={handleSortChange}
                      >
                        <MenuItem value="" disabled>
                          <em>Sắp xếp môn học</em>
                        </MenuItem>
                        <MenuItem value="0">Mặc định</MenuItem>
                        <MenuItem value="1">Theo tên</MenuItem>
                        <MenuItem value="2">Theo năm học</MenuItem>
                        <MenuItem value="3">Theo tín chỉ</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      id="search"
                      placeholder='Tìm kiếm'
                      value={searchValue}
                      onChange={handleSearchChange}
                      InputProps={{
                        endAdornment: (
                          <IconButton>
                            <SearchIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid container spacing={2}>
                    {sortedData ? sortedData.map((item, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <CardItem name={item.name} id={item.id} year={item.year} link={`/examoption/${item.id}`} credits={item.credits}></CardItem>
                      </Grid>
                    )) : "loading"}
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};
