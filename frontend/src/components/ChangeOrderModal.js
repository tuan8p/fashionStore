import React, {useEffect } from 'react';
import { Modal, Form, Select, Button, Input } from 'antd';
//import axios from 'axios';

const { Option } = Select;

const ChangeOrderModal = ({ visible, onCancel, onOk, orderDetails }) => {
  const [form] = Form.useForm();
  //const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderDetails) {
        console.log('orderDetails in ChangeOrderModal:', orderDetails.ma_don_hang, "+ ", orderDetails.trang_thai_don_hang);  // Kiểm tra orderDetails
      form.setFieldsValue({
        ma_don_hang: orderDetails.ma_don_hang,
        trang_thai_don_hang: orderDetails.trang_thai_don_hang,
      });
    }
  }, [orderDetails, form]);

//   const handleSubmit = async (values) => {
//     console.log('Form submitted with values:', values);
//     setLoading(true);
//     try {
//       const response = await axios.post(`http://localhost:5000/api/update-order-status`, {
//         ma_don_hang: values.ma_don_hang,
//         trang_thai_don_hang: values.trang_thai_don_hang,
//       },{
//         headers: {
//         'Content-Type': 'application/json'
//       }
//       });
//       console.log("Result: ",response.status);
//       if (response.status === 200) {
//         onOk();
//       }
//     } catch (error) {
//       console.log('Error updating order status:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <Modal
      title="Chỉnh sửa trạng thái đơn hàng"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={(values)=> {onOk(values);}} layout="vertical">
        <Form.Item label="Mã đơn hàng" name="ma_don_hang">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Trạng thái đơn hàng" name="trang_thai_don_hang" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
          <Select>
            <Option value="Đang xử lý">Đang xử lý</Option>
            <Option value="Đang vận chuyển">Đang vận chuyển</Option>
            <Option value="Đã giao hàng">Đã giao hàng</Option>
            <Option value="Đã hủy">Đã hủy</Option>
            <Option value="Đã hoàn trả">Đã hoàn trả</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

/* <Modal
        title="Chỉnh sửa đơn hàng"
        open = {modalVisible === 'changeOrder'}
        onCancel={handleCancel}
        footer={null}
        width={width > 768 ? 600 : "90%"}
      >
        <Form
          onFinish={handleEditSave}
          layout="vertical"
          initialValues={currentOrder || {}}
        >
          <Form.Item label="Mã đơn hàng" name="ma_don_hang">
            <Input disabled input="1"/>
          </Form.Item>
          <Form.Item label="Mã tài khoản" name="ma_tai_khoan">
            <Input disabled/>
          </Form.Item>
          <Form.Item label="Số nhà" name="so_nha">
            <Input disabled/>
          </Form.Item>
          <Form.Item label="Quận/ Huyện" name="quan_huyen">
            <Input disabled/>
          </Form.Item>
          <Form.Item label="Tỉnh/ Thành phố" name="thanh_pho">
            <Input disabled/>
          </Form.Item>
          <Form.Item label="Tình trạng thanh toán" name="tinh_trang_thanh_toan">
            <Select disabled>
            <Option value="Đã thanh toán">Đã thanh toán</Option>
            <Option value="Đã hoàn tiền">Đã hoàn tiền</Option>
            <Option value="Chưa thanh toán">Chưa thanh toán</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ngày đặt hàng" name="ngay_dat_hang">
            <Input
              disabled
              value={currentOrder?.ngay_dat_hang ? dayjs(currentOrder.ngay_dat_hang).format('DD/MM/YYYY') : ''}
            />
          </Form.Item>

          <Form.Item label="Ngày nhận hàng" name="ngay_nhan_hang">
            <Input
              disabled
              value={currentOrder?.ngay_nhan_hang ? dayjs(currentOrder.ngay_nhan_hang).format('DD/MM/YYYY') : ''}
            />
          </Form.Item>
          <Form.Item label="Trạng thái đơn hàng" name="trang_thai_don_hang"
            initialValue="Đang xử lý">
            <Select>
            <Option value="Đang xử lý">Đang xử lý</Option>
              <Option value="Đang vận chuyển">Đang vận chuyển</Option>
              <Option value="Đã giao hàng">Đã giao hàng</Option>
              <Option value="Đã hủy">Đã hủy</Option>
              <Option value="Đã hoàn trả">Đã hoàn trả</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Lưu đơn hàng
            </Button>
          </Form.Item>
        </Form>
</Modal> */
};


export default ChangeOrderModal;
