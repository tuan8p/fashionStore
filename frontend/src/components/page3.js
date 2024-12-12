import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, DatePicker, Form } from "antd";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const Page3 = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async (startDate, endDate) => {
        setLoading(true);
        try {
            const response = await fetch('https://api.example.com/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startDate: startDate ? dayjs(startDate, "DD/MM/YYYY").format("YYYY-MM-DD") : null,
                    endDate: endDate ? dayjs(endDate, "DD/MM/YYYY").format("YYYY-MM-DD") : null,
                }),
            });
            const result = await response.json();
            setFilteredData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Mã sản phẩm",
            dataIndex: "productId",
            key: "productId",
        },
        {
            title: "Số lượng",
            dataIndex: "count",
            key: "count",
            responsive: ['md'],
        },
        {
            title: "Ngày đặt hàng",
            dataIndex: "orderDate",
            key: "orderDate",
            responsive: ['lg'],
            render: (text) => dayjs(text, "YYYY-MM-DD").format("DD/MM/YYYY"),
        },
        {
            title: "Thành tiền",
            dataIndex: "total",
            key: "total",
            responsive: ['lg'],
        },
    ];

    const handleFilter = () => {
        fetchData(startDate, endDate);
    };

    return (
        <div style={{ padding: 20, backgroundColor: "#F5F6FA" }}>
            <Row gutter={[16, 16]} align="middle" justify="space-between">
                <Col xs={24} sm={16} md={8}>
                    <h2>Order Lists</h2>
                </Col>
                <Col xs={24} sm={16} md={16}>
                    <Form layout="inline">
                        <Form.Item label="Start Date">
                            <DatePicker
                                format="DD/MM/YYYY"
                                onChange={(date) => setStartDate(date ? date.format("DD/MM/YYYY") : null)}
                            />
                        </Form.Item>
                        <Form.Item label="End Date">
                            <DatePicker
                                format="DD/MM/YYYY"
                                onChange={(date) => setEndDate(date ? date.format("DD/MM/YYYY") : null)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleFilter}>Filter</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Table
                dataSource={filteredData}
                columns={columns}
                rowKey="id"
                style={{ marginTop: '20px' }}
                pagination={{ pageSize: 10 }}
                scroll={{ x: '100%' }}
                loading={loading}
            />
        </div>
    );
};

export default Page3;
