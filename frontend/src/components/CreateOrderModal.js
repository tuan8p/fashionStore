import React, { useState } from 'react';
import { Modal, Button, Form, Input, DatePicker, Select, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const CreateOrderModal = ({ visible, onCancel, onCreate }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleCreateOrder = async (values) => {
    if (values.ma_tai_khoan.length !== 10) {
        message.error('Mã tài khoản phải có đủ 10 ký tự!');
        return;
    }
    setLoading(true);
    try {
      // Gửi yêu cầu tạo đơn hàng
      const response = await axios.post('http://localhost:5000/api/create-order', {
        ma_tai_khoan: values.ma_tai_khoan,
        ma_khuyen_mai: values.ma_khuyen_mai || null,
        phuong_thuc: values.phuong_thuc,
      });
      
      if (response.status === 200) {
        message.success('Đơn hàng đã được tạo thành công!');
        onCreate(); // Gọi hàm để cập nhật dữ liệu trong component cha
        form.resetFields(); // Reset form
        onCancel();
      } else {
        message.error('Không thể tạo đơn hàng. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      message.error('Có lỗi xảy ra khi tạo đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo Đơn Hàng Mới"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateOrder}
          initialValues={{ trang_thai_don_hang: 'Đang xử lý' }}
        >
          <Form.Item label="Mã đơn hàng" name="ma_don_hang">
            <Input disabled />
          </Form.Item>
            <Form.Item label="Mã tài khoản" name="ma_tai_khoan" rules={[{ required: true, message: 'Vui lòng nhập mã tài khoản!' }]}>
            <Input />
          </Form.Item>
        <Form.Item label="Mã khuyến mãi" name="ma_khuyen_mai">
            <Input />
          </Form.Item>

          <Form.Item label="Phương thức thanh toán" name="phuong_thuc" rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}>
            <Select>
              <Option value="ATM">ATM</Option>
              <Option value="Ebanking">Ebanking</Option>
              <Option value="MoMo">MoMo</Option>
              <Option value="COD">COD</Option>
            </Select>
          </Form.Item > 
          

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Lưu đơn hàng
            </Button>
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default CreateOrderModal;
