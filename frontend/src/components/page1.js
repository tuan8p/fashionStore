import React, {useState, useEffect} from 'react';
import { Table, Tag, Button, Row, Col, Modal, Input, DatePicker, Select, Form, message} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import axios from 'axios';
import ChangeOrderModal from '../components/ChangeOrderModal';
import CreateOrderModal from '../components/CreateOrderModal';
import DeleteOrderModal from '../components/DeleteOrderModal';


const {Option} = Select;


const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

const Page1 = () => {
  const { width } = useWindowSize();
  const [data, setData] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null); //[selectedOrder, setSelectedOrder]
  const [modalVisible, setModalVisible] = useState(null);//[isModalVisible, setIsModalVisible]
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/DonHang');
      setData(response.data); // Cập nhật dữ liệu cho bảng
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const showChangeOrderModal = (order) => {
    console.log('Selected order:', order);
    setCurrentOrder(order);  // Lưu thông tin đơn hàng vào state
    setModalVisible('changeOrder');   // Mở modal
  };

  const columns = [
      {
        title: "Mã đơn hàng",
        dataIndex: 'ma_don_hang',
        key: 'ma_don_hang',
      },
      {
        title: 'Mã giỏ hàng',
        dataIndex: 'ma_gio_hang',
        key: 'ma_gio_hang',
        responsive: ['lg'],
      },
      {
        title: "Mã tài khoản",
        dataIndex: "ma_tai_khoan",
        key: "ma_tai_khoan",
      },
      {
        title: "Mã thanh toán",
        dataIndex: "ma_thanh_toan",
        key: "ma_thanh_toan",
        responsive: ['md'],
      },
      {
        title: "Mã vận chuyển",
        dataIndex: "ma_van_chuyen",
        key: "ma_van_chuyen",
        responsive: ['lg'],
      },
      {
        title: "Mã khuyến mãi",
        dataIndex: "ma_khuyen_mai",
        key: "ma_khuyen_mai",
        responsive: ['lg'],
      },
      {
        title: "Số nhà",
        dataIndex: "so_nha",
        key: "so_nha",
        responsive: ['md'],
      },
      {
        title: "Quận/Huyện",
        dataIndex: "quan_huyen",
        key: "quan_huyen",
        responsive: ['md'],
      },
      {
        title: "Tỉnh/Thành phố",
        dataIndex: "thanh_pho",
        key: "thanh_pho",
        responsive: ['md'],
      },
      {
        title: "Tình trạng thanh toán",
        dataIndex: "tinh_trang_thanh_toan",
        key: "tinh_trang_thanh_toan",
        render: (status) => {
          const color = 
          status === 'Đã thanh toán' ? 'green' : 
          status === 'Đã hoàn tiền' ? 'red' : 'blue';
          return <Tag color={color}>{status}</Tag>;
        },
      },
      {
        title: 'Ngày đặt hàng',
        dataIndex: 'ngay_dat_hang',
        key: 'ngay_dat_hang',
        render: (date) => {
          return date ? dayjs(date).format('DD/MM/YYYY') : '';},
        responsive: ['lg'],
      },
      {
        title: 'Ngày nhận hàng',
        dataIndex: 'ngay_nhan_hang',
        key: 'ngay_nhan_hang',
        render: (date) => {
          return date ? dayjs(date).format('DD/MM/YYYY') : '';}, // Định dạng ngày
        responsive: ['lg'],
      },
      {
        title: "Thời gian xuất đơn",
        dataIndex: "thoi_gian_xuat_hoa_don",
        key: "thoi_gian_xuat_hoa_don",
        render: (date) => {
          return date ? dayjs(date).format('DD/MM/YYYY') : '';},
        responsive: ['lg'],
      },
      {
          title: 'Trạng thái đơn hàng',
          dataIndex: 'trang_thai_don_hang',
          key: 'trang_thai_don_hang',
          render: (text) => {
            let color = '';
            switch (text) {
              case 'Đã giao hàng':
                color = '#6226EF';
                break;
              case 'Đang xử lý':
                color = 'blue';
                break;
              case 'Đã hủy':
                color = 'red';
                break;
              case 'Đang vận chuyển':
                color = 'green';
                break;
              default:
                color = 'gray';
            }
            return <Tag color={color}>{text}</Tag>;
          },
      },
      {
        title: '',
        key: 'actions',
        render: (_, record) => (
        <div>
          <Button
            type="primary"
            shape="round"
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => showChangeOrderModal(record)}
          >Thay đổi
          </Button>
          <Button
          key="delete"
          type="primary"
          danger
          shape="round"
          icon={<DeleteOutlined />}
          onClick={() => {
            setCurrentOrder(record); // Lưu thông tin đơn hàng hiện tại
            setModalVisible('deleteOrder'); // Mở modal xóa
          }}
          >Xóa
          </Button>
          </div>
      ),
    },
  ];

    //Hàm xử lý khi bấm "Lưu đơn hàng" trong modal
    const handleEditSave = async (values) => {
      try {
        const response = await axios.post('http://localhost:5000/api/update-order-status', {
          ma_don_hang: values.ma_don_hang,
          trang_thai_don_hang: values.trang_thai_don_hang,
        });
  
        if (response.status === 200) {
          // Sau khi cập nhật thành công, gọi lại API để lấy dữ liệu mới
          await fetchOrders();
          setModalVisible(false); // Đóng modal
        }
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    };
    
    // Hàm xử lý khi bấm "Xác nhận hủy" trong modal
    const handleConfirmDelete = async () => {
      if (!currentOrder?.ma_don_hang) {
        console.error('Order ID is missing');
        return;
      }
    
      try {
        const response = await axios.post('http://localhost:5000/api/delete-order', {
          ma_don_hang: currentOrder.ma_don_hang,
        });
    
        if (response.status === 200) {
          message.success('Đơn hàng đã được xóa thành công!');
          await fetchOrders(); // Tải lại danh sách đơn hàng
        } else {
          message.error('Không thể xóa đơn hàng. Vui lòng thử lại!');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        if (error.response && error.response.data && error.response.data.error) {
          message.error(error.response.data.error);  // Hiển thị thông báo chi tiết từ backend
        } else {
          message.error('Có lỗi xảy ra khi xóa đơn hàng!');
        }
      }
    };
    
    const showModal = (modalType, order = null) => {
      setModalVisible(modalType); // Chỉ gọi một lần để thay đổi trạng thái modal
      if (order) {
        order.ngay_dat_hang = dayjs(order.ngay_dat_hang).format('DD/MM/YYYY');  // Định dạng ngày nếu cần
        order.ngay_nhan_hang = dayjs(order.ngay_nhan_hang).format('DD/MM/YYYY');
      }
      setCurrentOrder(order);
    };
  
    const handleCancel = () => {
      setCurrentOrder(null);
      setModalVisible(null);
    };
    
    return (
        <div style={{ padding: 20, backgroundColor: "#F5F6FA" }}>
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col xs={24} sm={16} md={8}>
          <h2>Order Lists</h2>
        </Col>
        <Col xs={24} sm={16} md={16}>
        <Button
            backgroundColor = "white"
            icon={<PlusOutlined />}
            size="medium"
            onClick={() => 
              {
                setCurrentOrder(null);
                showModal('createOrder')}
              }
          >
            Thêm Đơn Hàng
          </Button>
        </Col>
      </Row>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="ma_don_hang"
        pagination={{ pageSize: 10 }}
        style={{ marginTop: '20px' }}
        scroll={{ x: true }}
      />

    {/* <Modal
        title="Xác nhận hủy đơn hàng ?"
        open = {modalVisible === 'deleteOrder'}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Quay lại"
        width={width > 768 ? 600 : "90%"}
    >
        <p>Bạn có chắc chắn muốn hủy đơn hàng không?</p>
    </Modal> */}

    <DeleteOrderModal
      visible={modalVisible === 'deleteOrder'}
      onCancel={() => setModalVisible(null)} // Đóng modal khi hủy
      onConfirm={handleConfirmDelete} // Gọi hàm xóa khi xác nhận
      orderDetails={currentOrder} // Truyền thông tin đơn hàng hiện tại
    />

    {/* <Modal
        title="Điền thông tin đơn hàng"
        open = {modalVisible === 'createOrder'}
        onCancel={handleCancel}
        footer={null}
        width={width > 768 ? 600 : "90%"}
      >
        <Form
          initialValues={currentOrder}
          onFinish={handleEditSave}
          layout="vertical"
        >
          <Form.Item label="Mã đơn hàng" name="ma_don_hang">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Mã tài khoản" name="ma_tai_khoan">
            <Input />
          </Form.Item>
          <Form.Item label="Số nhà" name="so_nha">
            <Input disabled/>
          </Form.Item>
          <Form.Item label="Quận/Huyện" name="quan_huyen">
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
          </Form.Item > 
          <Form.Item label="Ngày đặt hàng" name="ngay_dat_hang">
            <DatePicker disabled value={currentOrder?.ngay_dat_hang ? dayjs(currentOrder.ngay_dat_hang).format('DD/MM/YYYY') : ''}/>
          </Form.Item>
          <Form.Item label="Ngày nhận hàng" name="ngay_nhan_hang">
            <DatePicker disabled  value={currentOrder?.ngay_nhan_hang ? dayjs(currentOrder.ngay_nhan_hang).format('DD/MM/YYYY') : '' }/>
          </Form.Item>
          <Form.Item label="Trạng thái đơn hàng">
            <Select disabled >
              <Option value="Đang xử lý">Đang xử lý</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Lưu đơn hàng
            </Button>
          </Form.Item>
        </Form>
    </Modal> */}
    
    <CreateOrderModal
      visible={modalVisible === 'createOrder'}
      onCancel={() => setModalVisible(null)}
      onCreate={fetchOrders} 
    />


    <ChangeOrderModal
        visible = {modalVisible === 'changeOrder'}
        onCancel={handleCancel}
        onOk={handleEditSave}
        orderDetails={currentOrder} // Gửi thông tin đơn hàng đã chọn vào modal
      />
    </div>
    )
}

export default Page1;