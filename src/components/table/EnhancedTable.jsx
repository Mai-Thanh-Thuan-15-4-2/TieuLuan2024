// EnhancedTable.jsx
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TableHeader from './TableHeader';
import EnhancedTableToolbar from './TableToolbar';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';


function EnhancedTable({ initialRows, headCells, selected, handleClick, handleSelectAllClick, handleCreateExam }) {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState(initialRows);
    const [searchText, setSearchText] = useState('');
    const cheerio = require('cheerio');

    function truncateHTML(html, maxLength) {
        const $ = cheerio.load(html);
    
        const text = $.text();

        const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    
        return truncatedText;
    }
    const handleRowClick = (event, id) => {
        handleClick(event, id);
    };
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        const sortedRows = [...rows];
        sortedRows.sort((a, b) => {
            if (isAsc) {
                return a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
            } else {
                return a[property] > b[property] ? -1 : a[property] < b[property] ? 1 : 0;
            }
        });

        setRows(sortedRows);
    };
    useEffect(() => {
        setRows(initialRows);
    }, [initialRows]);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const handleSearch = () => {
        const filteredRows = initialRows.filter((row) =>
            Object.values(row).some(
                (value) => value && value.toString().toLowerCase().includes(searchText.toLowerCase())
            )
        );
        setRows(filteredRows);
    };

    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
    };
    const truncate = (str, length) => {
        if (str && typeof str === 'string') {
            return str.length > length ? str.substring(0, length) + "..." : str;
        }
        return "";
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar
                    numSelected={selected?.length || 0}
                    searchText={searchText}
                    searchHandlers={{
                        handleSearchInputChange,
                    }}
                    onSearch={handleSearch}
                    handleCreateExam={handleCreateExam}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <TableHeader
                            numSelected={selected?.length || 0}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            headCells={headCells}
                        />
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" style={{ fontSize: '13px' }}>
                                        Không có câu hỏi
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleRowClick(event, row.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <Tooltip title={
                                                    <div style={{ fontSize: '13px', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                                        <div dangerouslySetInnerHTML={{ __html: row.question }} />
                                                    </div>
                                                }>
                                                    <TableCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                        style={{ fontSize: '13px', important: true }}
                                                    >
                                                     {truncateHTML(row.question, 30)}
                                                    </TableCell>
                                                </Tooltip>
                                                <Tooltip title={<p style={{ fontSize: '13px', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{row.category}</p>}>
                                                    <TableCell align="right" style={{ fontSize: '13px', important: true }}>{truncate(row.category, 15)}</TableCell>
                                                </Tooltip>
                                                <Tooltip title={<p style={{ fontSize: '13px', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{row.type}</p>}>
                                                    <TableCell align="right" style={{ fontSize: '13px', important: true }}> {truncate(row.type, 15)}</TableCell>
                                                </Tooltip>
                                                <TableCell align="right" style={{ fontSize: '13px', important: true }}>{row.createat}</TableCell>
                                                <TableCell align="right" style={{ fontSize: '13px', important: true }}>{row.level}</TableCell>
                                                <TableCell align="right" style={{ fontSize: '13px', important: true }}>{row.owner}</TableCell>
                                            </TableRow>
                                        );
                                    })
                            )}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={7} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />}
                label="Khoảng cách nhỏ gọn"
            />
        </Box>
    );
}

export default EnhancedTable;
