import React, { useState } from 'react';
import { Button, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  SettingOutlined,
  FormOutlined,
  UsergroupAddOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DatabaseOutlined,
  FieldTimeOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';

const RolliesSidebar = ({ collapsed, setCollapsed }) => {
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: 'Home',
      path: '/materials/rollies/home',
    },
    {
      key: '9',
      icon: <FormOutlined />,
      label: 'Rollies Sheet',
      path: '/materials/rollies/sheet',
    },
    {
      key: '4',
      icon: <FieldTimeOutlined />,
      label: 'Saved Rollies',
      path: '/materials/rollies/saved',
    }
  ];

  const location = useLocation();

  const logout = () => {
    // Remove token and type from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('type');
    // Navigate to '/'
    window.location.href = '/'; // Redirect to the home page
  };

  return (
    <div
      className={`bg-[#F5F5F5] h-screen sticky top-0 flex flex-col justify-between`}
    >
      <div className="bg-purple-800 h-28 flex">
        <Button
          type="primary"
          className="bg-blue-800 my-auto ml-4"
          onClick={toggleCollapsed}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Menu
          defaultSelectedKeys={['1']}
          mode="inline"
          className="bg-[#F5F5F5]"
          inlineCollapsed={collapsed}
          selectedKeys={[location.pathname]} // Highlight the current route based on the pathname
        >
          {items.map(item => (
            <Menu.Item key={item.path} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </div>
      <div className="flex">
        <Link
          to="/landing"
          className="bg-blue-600 justify-center space-x-2 flex align-middle text-center text-sm py-2 hover:text-gray-400 rounded-none w-full text-white mt-auto"
        >
          <ArrowLeftOutlined className="my-auto" />
          <h1 className="text-center text-sm">Back to Dashboard</h1>
        </Link>
      </div>
    </div>
  );
};

export default RolliesSidebar;
