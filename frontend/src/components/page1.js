import React, {useState, useEffect} from 'react';
import { Table, Tag, Button, Row, Col, Modal, Input, DatePicker, Select, Form } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';

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
// Data mẫu
// const data = [
//     {
//       id: "DH20240121113078FG7",
//       accountId: "z2x8v5k3w1",
//       houseNumber: "56",
//       district: "Sơn Trà",
//       city: "Đà Nẵng",
//       paymentStatus: "Ebanking",
//       orderDate: "15/02/2024",
//       deliveryDate: "15/02/2024",
//       orderStatus: "Đang xử lý"
//     },
//     {
//       id: "DH202401211109FT",
//       accountId: "x7n4p7ef89",
//       houseNumber: "56",
//       district: "Sơn Trà",
//       city: "Đà Nẵng",
//       paymentStatus: "MoMo",
//       orderDate: "12/10/2024",
//       deliveryDate: "12/10/2024",
//       orderStatus: "Đang xử lý",
//     },
// ];

const Page1 = () => {
  const { width } = useWindowSize();
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/DonHang')
        .then(response => response.json())
        .then(data => setData(data))  // Cập nhật state data
        .catch(error => console.error('Error fetching data:', error));
  }, []);
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
              onClick={() => showModal('changeOrder', record)}
            >Thay đổi
            </Button>
            <Button
            type="primary"
            danger
            shape="round"
            icon={<DeleteOutlined />}
            onClick={() => showModal('deleteOrder', record)}
            >Xóa
            </Button>
            </div>
        ),
      },
    ];
    
    const [currentOrder, setCurrentOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(null);
    //const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    //Hàm xử lý khi bấm "Lưu đơn hàng" trong modal
    const handleEditSave = (values) => {
      console.log('Thông tin đã lưu: ', values);
      setModalVisible(false); // Đóng modal
    };
    
    // Hàm xử lý khi bấm "Xác nhận" trong modal
    const handleConfirm = () => {
      console.log(`Đơn hàng ${currentOrder?.ma_don_hang} đã bị hủy!`);
      setModalVisible(false);
    };
    //const [modalType, setModalType] = useState(''); 
    
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

    <Modal
        title="Xác nhận hủy đơn hàng ?"
        open = {modalVisible === 'deleteOrder'}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Quay lại"
        width={width > 768 ? 600 : "90%"}
    >
        <p>Bạn có chắc chắn muốn hủy đơn hàng không?</p>
    </Modal>
    <Modal
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
            <Input />
          </Form.Item>
          <Form.Item label="Quận/Huyện" name="quan_huyen">
            <Input />
          </Form.Item>
          <Form.Item label="Tỉnh/ Thành phố" name="thanh_pho">
            <Input />
          </Form.Item>
          <Form.Item label="Tình trạng thanh toán" name="tinh_trang_thanh_toan">
            <Select>
              <Option value="Đã thanh toán">Đã thanh toán</Option>
              <Option value="Đã hoàn tiền">Đã hoàn tiền</Option>
              <Option value="Chưa thanh toán">Chưa thanh toán</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ngày đặt hàng" name="ngay_dat_hang">
            <DatePicker value={currentOrder?.ngay_dat_hang ? dayjs(currentOrder.ngay_dat_hang).format('DD/MM/YYYY') : ''}/>
          </Form.Item>
          <Form.Item label="Ngày nhận hàng" name="ngay_nhan_hang">
            <DatePicker value={currentOrder?.ngay_nhan_hang ? dayjs(currentOrder.ngay_nhan_hang).format('DD/MM/YYYY') : '' }/>
          </Form.Item>
          <Form.Item label="Trạng thái đơn hàng" name="trang_thai_don_hang">
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
    </Modal>

    <Modal
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
    </Modal>
    </div>
    )
}

export default Page1;