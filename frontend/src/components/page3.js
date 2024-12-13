import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, DatePicker, Form, message } from "antd";
import dayjs from 'dayjs';
import axios from 'axios';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);


const Page3 = () => {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async (startDate, endDate) => {
        setLoading(true);
        try {
            console.log('Start Date:', startDate);
            console.log('End Date:', endDate);

            const response = await axios.post('http://localhost:5000/api/calculate-order-total', {
                startDate: startDate ? dayjs(startDate, "DD/MM/YYYY").format("YYYY-MM-DD") : null,
                endDate: endDate ? dayjs(endDate, "DD/MM/YYYY").format("YYYY-MM-DD") : null,
            });
            const result = response.data;
            console.log('API Result:', result);
            if (Array.isArray(result.output)) {
                setData(result.output);  // Cập nhật dữ liệu sau khi nhận từ API
              } else {
                console.error('Dữ liệu không đúng định dạng');
                message.error('Dữ liệu không hợp lệ.');
              }
            }  catch (error) {
                console.error('Error fetching data:', error);
                message.error('Có lỗi khi tải dữ liệu.');
              } finally {
                setLoading(false);
              }
    };
    
    useEffect(() => {
        fetchData(); // Lấy dữ liệu mặc định không có ngày lọc
    }, []);

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "ma_don_hang",
            key: "ma_don_hang",
        },
        {
            title: "Mã sản phẩm",
            dataIndex: "ma_san_pham",
            key: "ma_san_pham",
        },
        {
            title: "Số lượng",
            dataIndex: "so_luong",
            key: "so_luong",
            responsive: ['md'],
        },
        { 
            title: "Ngày đặt hàng", 
            dataIndex: "ngay_dat_hang", 
            key: "ngay_dat_hang", 
            render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : '', 
            width: 150 
        },
        { title: "Thành tiền", dataIndex: "thanh_tien", key: "thanh_tien", width: 150 },
    ];

    const handleFilter = () => {
        fetchData(startDate, endDate);  // Gọi hàm fetchData với startDate và endDate
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
                dataSource={data}
                columns={columns}
                rowKey="ma_don_hang"
                style={{ marginTop: '20px' }}
                pagination={{ pageSize: 10 }}
                scroll={{ x: '100%' }}
                loading={loading}
            />
        </div>
    );
};

export default Page3;
