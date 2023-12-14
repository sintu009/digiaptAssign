// src/components/ReusableTable/ReusableTable.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Pagination } from 'react-bootstrap';
import './Table.css';

const ITEMS_PER_PAGE = 10;

const ReusableTable = ({ columns, data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [hiddenColumns, setHiddenColumns] = useState({});
    const [resizingColumn, setResizingColumn] = useState(null);
    const [resizeStartX, setResizeStartX] = useState(null);
    const [columnWidths, setColumnWidths] = useState({});
    const [columnOrder, setColumnOrder] = useState(columns.map((column) => column.key));

    const handleMouseDown = (columnKey, e) => {
        setResizingColumn(columnKey);
        setResizeStartX(e.clientX);
    };

    const handleMouseMove = (e) => {
        if (resizingColumn !== null) {
            const deltaX = e.clientX - resizeStartX;
            const newWidth =
                (columnWidths[resizingColumn] ||
                    columns.find((col) => col.key === resizingColumn).width) + deltaX;

            if (newWidth > 50) {
                setColumnWidths((prevWidths) => ({
                    ...prevWidths,
                    [resizingColumn]: newWidth,
                }));
                setResizeStartX(e.clientX);
            }
        }
    };

    const handleMouseUp = () => {
        setResizingColumn(null);
        setResizeStartX(null);
    };

    useEffect(() => {
        if (resizingColumn !== null) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingColumn, handleMouseMove, handleMouseUp]);

    const handleColumnResize = (columnKey, newWidth) => {
        setColumnWidths((prevWidths) => ({
            ...prevWidths,
            [columnKey]: newWidth,
        }));
    };

    const sortedData = () => {
        const sorted = [...data];
        if (sortConfig.key) {
            sorted.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sorted;
    };

    const filteredData = () => {
        return sortedData().filter((row) => {
            return Object.keys(row).some((key) => {
                return (
                    !hiddenColumns[key] &&
                    String(row[key]).toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        });
    };

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key ? flipDirection() : 'asc',
        });
    };

    const flipDirection = () => {
        return sortConfig.direction === 'asc' ? 'desc' : 'asc';
    };

    const handleSearch = () => {
        console.log('Performing search for:', searchTerm);
        // Implement actual search logic here based on your requirements
    };

    const toggleColumnVisibility = (columnKey) => {
        setHiddenColumns((prevHiddenColumns) => ({
            ...prevHiddenColumns,
            [columnKey]: !prevHiddenColumns[columnKey],
        }));
    };

    const handlePaginationClick = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredData().length / ITEMS_PER_PAGE);

    const paginatedData = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredData().slice(startIndex, endIndex);
    };

    const moveColumnLeft = (columnIndex) => {
        if (columnIndex > 0) {
            setColumnOrder((prevOrder) => {
                const newOrder = [...prevOrder];
                const temp = newOrder[columnIndex - 1];
                newOrder[columnIndex - 1] = newOrder[columnIndex];
                newOrder[columnIndex] = temp;
                return newOrder;
            });
        }
    };

    const moveColumnRight = (columnIndex) => {
        if (columnIndex < columnOrder.length - 1) {
            setColumnOrder((prevOrder) => {
                const newOrder = [...prevOrder];
                const temp = newOrder[columnIndex + 1];
                newOrder[columnIndex + 1] = newOrder[columnIndex];
                newOrder[columnIndex] = temp;
                return newOrder;
            });
        }
    };

    const renderSortIcon = (columnKey) => {
        if (sortConfig.key === columnKey) {
            return sortConfig.direction === 'asc' ? '↑' : '↓';
        }
        return null;
    };

    return (
        <div className="mt-4">
            <div className="table-responsive">
                <Table striped bordered hover responsive>
                    <thead className="thead-dark">
                        <tr>
                            {columnOrder.map((columnKey, index) => (
                                !hiddenColumns[columnKey] && (
                                    <th
                                        key={columnKey}
                                        style={{ width: columnWidths[columnKey] || columns.find(col => col.key === columnKey).width }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex">
                                                <Form.Control
                                                    size="sm"
                                                    type="text"
                                                    placeholder={`Search ${columns.find(col => col.key === columnKey).label}`}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="mb-2"
                                                />
                                            </div>
                                            <div className="d-flex">
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => handleSearch}
                                                >
                                                    Search
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    className="ml-2"
                                                    onClick={() => moveColumnLeft(index)}
                                                >
                                                    Move Left
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="info"
                                                    className="ml-2"
                                                    onClick={() => moveColumnRight(index)}
                                                >
                                                    Move Right
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span>{columns.find(col => col.key === columnKey).label}</span>
                                            <div className="d-flex">
                                                <Button
                                                    size="sm"
                                                    variant={hiddenColumns[columnKey] ? 'success' : 'warning'}
                                                    onClick={() => toggleColumnVisibility(columnKey)}
                                                >
                                                    {hiddenColumns[columnKey] ? 'Show' : 'Hide'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => handleSort(columnKey)}
                                                    className="ml-2"
                                                >
                                                    Sort {renderSortIcon(columnKey)}
                                                </Button>
                                                <div
                                                    className="resize-handle"
                                                    onMouseDown={(e) => handleMouseDown(columnKey, e)}
                                                />
                                            </div>
                                        </div>
                                    </th>
                                )
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData().map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columnOrder.map(
                                    (columnKey) =>
                                        !hiddenColumns[columnKey] && (
                                            <td key={columnKey}>{row[columnKey]}</td>
                                        )
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
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

export default ReusableTable;
