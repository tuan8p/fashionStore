import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, DatePicker, Form, Input } from "antd";
import dayjs from 'dayjs';
import axios from 'axios';

const Page2 = () => {
    const [filteredData, setFilteredData] = useState([]); // Dữ liệu bảng
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [accountId, setAccountId] = useState("");  // Mã tài khoản
    const [loading, setLoading] = useState(false);

    // Hàm fetchData để lấy dữ liệu từ API
    const fetchData = async (ma_tai_khoan, ngay_bat_dau, ngay_ket_thuc) => {
        setLoading(true);
        try {
            const startDate = ngay_bat_dau ? dayjs(ngay_bat_dau, "DD/MM/YYYY").format("YYYY-MM-DD"): null;
            const endDate = ngay_ket_thuc ? dayjs(ngay_ket_thuc, "DD/MM/YYYY").format("YYYY-MM-DD"): null;
            const response = await axios.post('http://localhost:5000/api/so-luong-tinh-trang-don-hang', {
                ma_tai_khoan,
                ngay_bat_dau: startDate, 
                ngay_ket_thuc: endDate,
            });
            console.log("API Response: ", response.data);
            const orderData = response.data.data[0] || [];  // Dữ liệu đơn hàng
            const summaryData = response.data.data[1] || []; // Dữ liệu tổng quan

            // const result = orderData.map(order => {
            //     const summary = summaryData[0]; // Chỉ có một đối tượng trong mảng summaryData
            //     return {
            //         ...order, 
            //         ma_tai_khoan: summary? summary.ma_tai_khoan: 0,
            //         tong_don_hang: summary ? summary.tong_don_hang : 0,
            //         so_dơn_dang_xu_ly: summary ? summary.so_dơn_dang_xu_ly : 0,
            //         so_don_dang_giao: summary ? summary.so_don_dang_giao : 0,
            //         so_don_da_giao: summary ? summary.so_don_da_giao : 0,
            //         so_don_huy: summary ? summary.so_don_huy : 0,
            //         so_don_hoan_tra: summary ? summary.so_don_hoan_tra : 0
            // };
            // });
            // setFilteredData(result);
            let result;
            //---
            if (ma_tai_khoan) {
                // Nếu có mã tài khoản, chỉ hiển thị dữ liệu tổng quan
                const summary = summaryData[0];
                const result = summary ? [{
                    ma_tai_khoan: summary.ma_tai_khoan,
                    tong_don_hang: summary.tong_don_hang,
                    so_dơn_dang_xu_ly: summary.so_dơn_dang_xu_ly,
                    so_don_dang_giao: summary.so_don_dang_giao,
                    so_don_da_giao: summary.so_don_da_giao,
                    so_don_huy: summary.so_don_huy,
                    so_don_hoan_tra: summary.so_don_hoan_tra,
                }] : [];
                setFilteredData(result);
            } else {
                // Nếu không có mã tài khoản, hiển thị toàn bộ danh sách
                result = summaryData.map(order => {
                    const summary = summaryData.find(item => item.ma_tai_khoan === order.ma_tai_khoan) || {};
                    return {
                        ...order,
                        tong_don_hang: summary.tong_don_hang || 0,
                        so_dơn_dang_xu_ly: summary.so_dơn_dang_xu_ly || 0,
                        so_don_dang_giao: summary.so_don_dang_giao || 0,
                        so_don_da_giao: summary.so_don_da_giao || 0,
                        so_don_huy: summary.so_don_huy || 0,
                        so_don_hoan_tra: summary.so_don_hoan_tra || 0,
                    };
                });
            }
    
            console.log("Mapped Result: ", result);
            
            setFilteredData(result);
            
        } catch (error) {
            console.error('Error fetching order data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(accountId, startDate, endDate);
    }, []); 

    const columns = [
        {
            title: "Mã tài khoản",
            dataIndex: "ma_tai_khoan", 
            key: "ma_tai_khoan",
        },
        {
            title: "Tổng đơn hàng",
            dataIndex: "tong_don_hang",
            key: "tong_don_hang",
            responsive: ['md'],
        },
        {
            title: "Số đơn đang xử lý",
            dataIndex: "so_dơn_dang_xu_ly",
            key: "so_dơn_dang_xu_ly",
            responsive: ['md'],
        },
        {
            title: "Số đơn đang giao",
            dataIndex: "so_don_dang_giao",
            key: "so_don_dang_giao",
            responsive: ['md'],
        },
        {
            title: "Số đơn đã giao",
            dataIndex: "so_don_da_giao",
            key: "so_don_da_giao",
            responsive: ['md'],
        },
        {
            title: "Số đơn đã hủy",
            dataIndex: "so_don_huy",
            key: "so_don_huy",
            responsive: ['md'],
        },
        {
            title: "Số đơn đã hoàn trả",
            dataIndex: "so_don_hoan_tra",
            key: "so_don_hoan_tra",
            responsive: ['md'],
        }
    ];
    

    // Hàm gọi lại API khi có thay đổi trong form lọc
    const handleFilter = () => {
        fetchData(accountId, startDate, endDate);  // Gọi hàm fetchData khi có thay đổi
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
                rowKey="ma_tai_khoan" 
                style={{ marginTop: '20px' }}
                pagination={{ pageSize: 10 }}
                scroll={{ x: '100%' }}
                loading={loading}
            />
        </div>
    );
};

export default Page2;
