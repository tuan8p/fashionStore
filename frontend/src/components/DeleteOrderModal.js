import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import axios from 'axios';

const DeleteOrderModal = ({ visible, onCancel, onConfirm, orderDetails }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!orderDetails?.ma_don_hang) {
      message.error('Mã đơn hàng không tồn tại!');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/delete-order', {
        ma_don_hang: orderDetails.ma_don_hang,
      });

      if (response.status === 200) {
        message.success('Đơn hàng đã được xóa thành công!');
        onConfirm(); // Gọi hàm để tải lại dữ liệu
      } else {
        message.error('Không thể xóa đơn hàng. Vui lòng thử lại!');
      }
    } catch (error) {
        console.error('Error deleting order:', error);
        if (error.response && error.response.data && error.response.data.error) {
          // Hiển thị thông báo lỗi chi tiết từ backend
          message.error(error.response.data.error); 
        } else {
          message.error('Có lỗi xảy ra khi xóa đơn hàng!');
        }
      } finally {
        setLoading(false);
      }
  };
        
  console.log('Order Details:', orderDetails);
  return (
    <Modal
      title="Xác nhận xóa đơn hàng"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="delete" type="primary" danger onClick={handleDelete} loading={loading}>
          Xóa
        </Button>,
      ]}
    >
      <p>Bạn có chắc chắn muốn xóa đơn hàng <b>{orderDetails?.ma_don_hang}</b> không?</p>
    </Modal>
  );
};

export default DeleteOrderModal;
