import React, {useState, useEffect} from 'react';
import { Table, Tag, Button, Row, Col, Modal, Input, DatePicker, Select, Form } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';

const {Option} = Select;

// Data mẫu
const data = [
    {
      id: "DH20240121113078FG7",
      accountId: "z2x8v5k3w1",
      houseNumber: "56",
      district: "Sơn Trà",
      city: "Đà Nẵng",
      paymentStatus: "Ebanking",
      orderDate: "15/02/2024",
      deliveryDate: "15/02/2024",
      orderStatus: "Đang xử lý"
    },
    {
      id: "DH202401211109FT",
      accountId: "x7n4p7ef89",
      houseNumber: "56",
      district: "Sơn Trà",
      city: "Đà Nẵng",
      paymentStatus: "MoMo",
      orderDate: "12/10/2024",
      deliveryDate: "12/10/2024",
      orderStatus: "Đang xử lý",
    },
];

const Page1 = () => {
    const columns = [
        {
          title: "Mã đơn hàng",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "Mã tài khoản",
          dataIndex: "accountId",
          key: "accountId",
        },
        {
          title: "Số nhà",
          dataIndex: "houseNumber",
          key: "houseNumber",
          responsive: ['md'],
        },
        {
          title: "Quận/Huyện",
          dataIndex: "district",
          key: "district",
          responsive: ['md'],
        },
        {
          title: "Tỉnh/Thành phố",
          dataIndex: "city",
          key: "city",
          responsive: ['md'],
        },
        {
          title: "Tình trạng thanh toán",
          dataIndex: "paymentStatus",
          key: "paymentStatus",
          render: (status) => {
            const color = 
                status === "Ebanking" ? "green" : 
                status === "MoMo" ? "orange" : 
                status === "ATM" ? "blue" : 
                "violet";
            return <Tag color={color}>{status}</Tag>;
          },
        },
        {
          title: "Ngày đặt hàng",
          dataIndex: "orderDate",
          key: "orderDate",
          responsive: ['lg'],
        },
        {
          title: "Thời gian xuất đơn",
          dataIndex: "deliveryDate",
          key: "deliveryDate",
          responsive: ['lg'],
        },
        {
            title: 'Trạng thái đơn hàng',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (text) => {
              let color = '';
              switch (text) {
                case 'Đã giao':
                  color = '#6226EF';
                  break;
                case 'Đang xử lý':
                  color = 'blue';
                  break;
                case 'Đã hủy':
                  color = 'red';
                  break;
                default:
                  color = 'gray';
              }
              return <Tag color={color}>{text}</Tag>;
            },
        },
        {
          title: "",
          key: "actions",
          render: (_, record) => (
            <div>
              <Button
                type="primary"
                shape="round"
                icon={<EditOutlined />}
                style={{ marginRight: 8}}
                onClick={() => showModal('changeOrder', record)}
              >
                Thay đổi
              </Button>
              <Button
                type="primary"
                danger
                shape="round"
                icon={<DeleteOutlined />}
                disabled={record.orderStatus !== "Đang xử lý"}
                onClick={() => showModal('deleteOrder', record)}
              >
                Xóa
              </Button>
            </div>
          ),
        },
    ];
    
    const [currentOrder, setCurrentOrder] = useState(null);
    const useWindowSize = () => {
      const [size, setSize] = useState({ width: window.innerWidth });
    
      useEffect(() => {
        const handleResize = () => setSize({ width: window.innerWidth });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    
      return size;
    };
    const { width } = useWindowSize();
    //Hàm xử lý khi bấm "Lưu đơn hàng" trong modal
    const handleEditSave = (values) => {
      console.log('Thông tin đã lưu: ', values);
      setModalVisible(false); // Đóng modal
    };
    
    // Hàm xử lý khi bấm "Xác nhận" trong modal
    const handleConfirm = () => {
      console.log(`Đơn hàng ${currentOrder?.id} đã bị hủy!`);
      setCurrentOrder(null);
      setModalVisible(false);
    };
    const [modelVisible, setModalVisible] = useState(null);
    const showModal = (id, order = null) => {
      setModalVisible(id);
      if (order) {
        order.orderDate = dayjs(order.orderDate, 'DD/MM/YYYY'); // Định dạng gốc trong data
        order.deliveryDate = dayjs(order.deliveryDate, 'DD/MM/YYYY');
      }
      setModalVisible(id);
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
        //rowKey="id"
        style={{ marginTop: '20px' }}
        pagination={{ pageSize: 10 }}
        scroll={{ x: '100%' }}
      />

    <Modal
        title="Xác nhận hủy đơn hàng ?"
        open = {modelVisible === 'deleteOrder'}
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
        open = {modelVisible === 'createOrder'}
        onCancel={handleCancel}
        footer={null}
        width={width > 768 ? 600 : "90%"}
      >
        <Form
          initialValues={currentOrder}
          onFinish={handleEditSave}
          layout="vertical"
        >
          <Form.Item label="Mã đơn hàng" name="id">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Mã tài khoản" initialValue="accountId">
            <Input />
          </Form.Item>
          <Form.Item label="Số nhà" initialValue="houseNumber">
            <Input />
          </Form.Item>
          <Form.Item label="Quận/ Huyện" initialValue="district">
            <Input />
          </Form.Item>
          <Form.Item label="Tỉnh/ Thành phố" initialValue="city">
            <Input />
          </Form.Item>
          <Form.Item label="Tình trạng thanh toán" initialValue="paymentStatus">
            <Select>
              <Option value="Ebanking">Ebanking</Option>
              <Option value="MoMo">MoMo</Option>
              <Option value="ATM">ATM</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ngày đặt hàng" initialValue="orderDate">
            <DatePicker />
          </Form.Item>
          <Form.Item label="Thời gian xuất đơn" initialValue="deliveryDate">
            <DatePicker />
          </Form.Item>
          <Form.Item label="Trạng thái đơn hàng" initialValue="orderStatus">
            <Select>
              <Option value="Đang xử lý">Đang xử lý</Option>
              <Option value="Đã giao">Đã giao</Option>
              <Option value="Đã hủy">Đã hủy</Option>
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
        open = {modelVisible === 'changeOrder'}
        onCancel={handleCancel}
        footer={null}
        width={width > 768 ? 600 : "90%"}
      >
        <Form
          onFinish={handleEditSave}
          layout="vertical"
          initialValues={currentOrder || {}}
        >
          <Form.Item label="Mã đơn hàng" name="id">
            <Input disabled input="1"/>
          </Form.Item>
          <Form.Item label="Mã tài khoản" name="accountId">
            <Input disabled/>
          </Form.Item>
          <Form.Item label="Số nhà" name="houseNumber">
            <Input disabled/>
          </Form.Item>
          <Form.Item label="Quận/ Huyện" name="district">
            <Input disabled/>
          </Form.Item>
          <Form.Item label="Tỉnh/ Thành phố" name="city">
            <Input disabled/>
          </Form.Item>
          <Form.Item label="Tình trạng thanh toán" name="paymentStatus">
            <Select disabled>
              <Option value="Ebanking">Ebanking</Option>
              <Option value="MoMo">MoMo</Option>
              <Option value="ATM">ATM</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ngày đặt hàng" name="orderDate">
            <DatePicker disabled/>
          </Form.Item>
          <Form.Item label="Thời gian xuất đơn" name="deliveryDate">
            <DatePicker disabled/>
          </Form.Item>
          <Form.Item label="Trạng thái đơn hàng" name="orderStatus"
            initialValue="Đang xử lý">
            <Select>
              <Option value="Đang xử lý">Đang xử lý</Option>
              <Option value="Đã giao">Đã giao</Option>
              <Option value="Đã hủy">Đã hủy</Option>
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