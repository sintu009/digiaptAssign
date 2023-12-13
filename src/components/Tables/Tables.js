// src/components/ReusableTable/ReusableTable.js
import React, { useState } from 'react';
import { Table, Button, Form, Pagination } from 'react-bootstrap';

const ITEMS_PER_PAGE = 10;

const Tables = ({ columns, data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [filteredData, setFilteredData] = useState(data);

    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedData = sortedData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const toggleColumnVisibility = (columnKey) => {
        setHiddenColumns((prevHiddenColumns) =>
            prevHiddenColumns.includes(columnKey)
                ? prevHiddenColumns.filter((key) => key !== columnKey)
                : [...prevHiddenColumns, columnKey]
        );
    };

    const handlePaginationClick = (page) => setCurrentPage(page);

    const handleSearch = () => {
        // Filter data based on the search term
        const filteredData = data.filter((row) =>
            Object.values(row).some(
                (value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        // Update the current page to 1 when performing a new search
        setCurrentPage(1);

        // Set the filtered data
        // You can use this filteredData for further processing or rendering
        // For example, you might want to update the state or make an API call
        // updateStateBasedOnSearch(filteredData);
        // makeAPICallWithSearchTerm(searchTerm);

        // Log the search term and filtered data (for demonstration purposes)
        console.log('Search term:', searchTerm);
        console.log('Filtered data:', filteredData);

        // Update the state with the filtered data
        setFilteredData(filteredData);
    };

    const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

    return (
        <div className="glassmorphism-container">
            <Form className="mb-3 d-flex justify-content-center align-items-center">
                <Form.Group controlId="search" className="mb-0 mr-2">
                    <Form.Control
                        type="text"
                        placeholder="Search for data"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleSearch}>
                    Search
                </Button>
            </Form>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        {columns.map((column) => (!hiddenColumns.includes(column.key) && (
                            <th key={column.key} className="align-middle">
                                <div className="d-flex align-items-center justify-content-between">
                                    <span>{column.label}</span>
                                    <div className="d-flex align-items-center">
                                        <Button
                                            size="sm"
                                            variant="link"
                                            onClick={() => toggleColumnVisibility(column.key)}
                                        >
                                            {hiddenColumns.includes(column.key) ? 'Show' : 'Hide'}
                                        </Button>
                                    </div>
                                </div>
                            </th>
                        )
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map(
                                (column) =>
                                    !hiddenColumns.includes(column.key) && (
                                        <td key={column.key}>{row[column.key]}</td>
                                    )
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination className="justify-content-center">
                <Pagination.Prev
                    onClick={() => handlePaginationClick(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => handlePaginationClick(i + 1)}
                    >
                        {i + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => handlePaginationClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        </div>
    );
};

export default Tables;