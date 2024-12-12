import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Modal, Form, message } from 'antd';
import axios from 'axios';

const Page4 = () => {
    const [products, setProducts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        // Tải danh sách sản phẩm từ API
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data); // Lưu danh sách sản phẩm vào state
            } catch (error) {
                console.error('Error fetching products:', error);
                message.error('Lỗi khi tải danh sách sản phẩm');
            }
        };

        fetchProducts();
    }, []);

    // Hàm gọi API để lấy điểm trung bình
    const fetchAverageRating = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/products/${productId}/average-rating`);
            return response.data.diem_trung_binh;
        } catch (error) {
            console.error('Error fetching average rating:', error);
            return 'Chưa có đánh giá';
        }
    };

    // Cập nhật điểm trung bình cho sản phẩm khi mở modal
    const updateProductRating = async (product) => {
        const averageRating = await fetchAverageRating(product.ma_san_pham);
        const updatedProduct = { ...product, diem_trung_binh: averageRating };
        setProducts((prev) =>
            prev.map((p) => (p.ma_san_pham === updatedProduct.ma_san_pham ? updatedProduct : p))
        );
    };

    // Cột bảng
    const columns = [
        {
            title: 'Mã sản phẩm',
            dataIndex: 'ma_san_pham',
            key: 'ma_san_pham',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten_san_pham',
            key: 'ten_san_pham',
        },
        {
            title: 'Mô tả sản phẩm',
            dataIndex: 'mo_ta',
            key: 'mo_ta',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'don_gia',
            key: 'don_gia',
            render: (price) => `${price.toLocaleString()} VNĐ`,
        },
        {
            title: 'Điểm đánh giá',
            dataIndex: 'diem_trung_binh',
            key: 'diem_trung_binh',
            render: (rating) => (
                <Tag color={rating === 'Chưa có đánh giá' ? 'red' : 'green'}>{rating}</Tag>
            ),
        },
    ];

    // Hiển thị modal để tạo hoặc cập nhật sản phẩm
    const showModal = (product = null) => {
        setCurrentProduct(product);
        form.resetFields();
        if (product) {
            form.setFieldsValue(product);
            updateProductRating(product); // Cập nhật điểm trung bình khi mở modal
        }
        setIsModalVisible(true);
    };

    // Hủy bỏ modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentProduct(null);
    };

    // Xử lý tạo sản phẩm mới
    const handleCreateProduct = (values) => {
        setProducts([...products, values]);
        message.success('Tạo sản phẩm thành công!');
        setIsModalVisible(false);
    };

    // Xử lý cập nhật sản phẩm
    const handleUpdateProduct = (values) => {
        setProducts(
            products.map((product) =>
                product.ma_san_pham === values.ma_san_pham ? values : product
            )
        );
        message.success('Cập nhật sản phẩm thành công!');
        setIsModalVisible(false);
    };

    const modalTitle = currentProduct ? 'Cập nhật sản phẩm' : 'Tạo mới sản phẩm';

    return (
        <div style={{ padding: 20 }}>
            <h2>Danh sách sản phẩm</h2>
            <Button
                type="primary"
                onClick={() => showModal()}
                style={{ marginBottom: 20 }}
            >
                Tạo mới sản phẩm
            </Button>
            <Table
                columns={columns}
                dataSource={products}
                rowKey="ma_san_pham"
                pagination={{ pageSize: 10 }}
            />
            <Modal
                title={modalTitle}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    initialValues={currentProduct}
                    onFinish={currentProduct ? handleUpdateProduct : handleCreateProduct}
                >
                    <Form.Item
                        name="ma_san_pham"
                        label="Mã sản phẩm"
                        rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}
                    >
                        <Input disabled={!!currentProduct} />
                    </Form.Item>
                    <Form.Item
                        name="ten_san_pham"
                        label="Tên sản phẩm"
                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="mo_ta"
                        label="Mô tả sản phẩm"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        name="don_gia"
                        label="Đơn giá"
                        rules={[{ required: true, message: 'Vui lòng nhập đơn giá!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {currentProduct ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Page4;