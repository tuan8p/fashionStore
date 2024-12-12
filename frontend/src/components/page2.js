import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, DatePicker, Form, Input } from "antd";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const Page2 = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [accountId, setAccountId] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchData = async (startDate, endDate, accountId) => {
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
                    accountId: accountId || null,
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
            title: "Mã tài khoản",
            dataIndex: "accountId",
            key: "accountId",
        },
        {
            title: "Tổng đơn hàng",
            dataIndex: "total orders",
            key: "total orders",
            responsive: ['md'],
        },
        {
            title: "Số đơn đang xử lý",
            dataIndex: "processing orders",
            key: "processing orders",
            responsive: ['md'],
        },
        {
            title: "Số đơn đang giao",
            dataIndex: "delivering orders",
            key: "delivering orders",
            responsive: ['md'],
        },
        {
            title: "Số đơn đã giao",
            dataIndex: "delivered orders",
            key: "delivered orders",
            responsive: ['md'],
        },
        {
            title: "Số đơn đã hủy",
            dataIndex: "cancelled orders",
            key: "cancelled orders",
            responsive: ['md'],
        },
        {
            title: "Số đơn đã hoàn trả",
            dataIndex: "returned orders",
            key: "returned orders",
            responsive: ['md'],
        }
    ];

    const handleFilter = () => {
        fetchData(startDate, endDate, accountId);
    };

    return (
        <div style={{ padding: 20, backgroundColor: "#F5F6FA" }}>
            <Row gutter={[16, 16]} align="middle" justify="space-between">
                <Col xs={24} sm={16} md={8}>
                    <h2>Order Lists</h2>
                </Col>
            </Row>
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24}>
                    <Form layout="inline">
                        <Form.Item label="Mã tài khoản">
                            <Input
                                placeholder="Nhập mã tài khoản"
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Row gutter={[16, 16]} align="middle" justify="space-between">
                <Col xs={24} sm={8}>
                    <Form.Item label="Start Date">
                        <DatePicker
                            format="DD/MM/YYYY"
                            onChange={(date) => setStartDate(date ? date.format("DD/MM/YYYY") : null)}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                    <Form.Item label="End Date">
                        <DatePicker
                            format="DD/MM/YYYY"
                            onChange={(date) => setEndDate(date ? date.format("DD/MM/YYYY") : null)}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                    <Form.Item>
                        <Button type="primary" onClick={handleFilter}>Filter</Button>
                    </Form.Item>
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

export default Page2;
