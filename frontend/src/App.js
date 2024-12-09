import './App.css';
import React, {useState}  from 'react';
import { Layout, Menu, Button } from 'antd';
import { Routes, Route, Link } from 'react-router-dom';
import Page1 from './components/page1';
import Page2 from './components/page2';
import Page3 from './components/page3';

import {AppstoreOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div className="App">
      <Layout style={{ minHeight: '80vh' }}>
        {/* Sidebar */}
        <Sider
          width={200}  // Chiều rộng ban đầu
          collapsedWidth={5}
          collapsible
          collapsed={collapsed}
          onCollapse={toggleCollapse}
          style={{ background: '#001529', position: 'relative' }}
          trigger = {null}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
          <Button
            type="primary"
            onClick={toggleCollapse}
            style={{
              margin: '16px 0',
              alignSelf: collapsed ? 'flex-start' : 'flex-end', 
              backgroundColor: '#1890ff',
              borderColor: '#1890ff', 
              color: '#fff', 
              padding: '10px 16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              position: 'absolute', 
              left: collapsed ? '20px' : '210px', 
              top: '16px', 
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ flex: 1, height: '100%', borderRight: 0,  paddingTop: '10px'  }}
          >
            <Menu.Item key="1" icon={<AppstoreOutlined />}>
              <Link to="/">Page 1</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<AppstoreOutlined />}>
              <Link to="/2">Page 2</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<AppstoreOutlined />}>
              <Link to="/3">Page 3</Link>
            </Menu.Item>
          </Menu>
          </div>
        </Sider>
        

        <Layout >
          <Content style={{ padding: '0 50px', marginTop: 64 }}>
            <Routes>
              <Route path="/" element={<Page1 />} />
              <Route path="/2" element={<Page2 />} />
              <Route path="/3" element={<Page3 />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
