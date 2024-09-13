import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../../App.css";
import {
  UserOutlined,
  PlusOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Button, message, theme } from "antd";
import logo from "../../assets/logo.png";
import Dashboard from "../../pages/dashboard";
import Try from "../../pages/Try";
import Post from "../../pages/Post";
import Resume from "../../pages/resume";
import ResumeCreate from "../../pages/resume/create";
import ResumeEdit from "../../pages/resume/edit";
import ResumeView from "../../pages/resume/view";
import WorkCreate from "../../pages/Post/create";
import WorkEdit from "../../pages/Post/edit";
import Work from "../../pages/Post";
import Postwork from "../../pages/postwork";

const { Header, Content } = Layout;

const FullLayout: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const setCurrentPage = (val: string) => {
    localStorage.setItem("page", val);
    if (val === "dashboard") {
      window.location.reload(); // Refresh the page when clicking "Home"
    }
  };

  const Logout = () => {
    localStorage.clear();
    messageApi.success("Logout successful");
    setTimeout(() => {
      location.href = "/";
    }, 2000);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      <Layout>
        <Header style={{ background: '#06579b', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ width: 50, margin: '0 10px' }} />
            <h1 style={{color: 'white'}}> Capylance</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
            <Button 
              type="text" 
              style={{ color: 'white', margin: '0 10px' }} 
              onClick={() => setCurrentPage("dashboard")}
            >
              <Link to="/">
                <HomeOutlined style={{ color: 'white' }} />
                <span style={{ color: 'white' }}> หน้าหลัก</span>
              </Link>
            </Button>
            <Button 
              type="text" 
              style={{ color: 'white', margin: '0 10px' }} 
              onClick={() => setCurrentPage("Try")}
            >
              <Link to="/t">
                <PlusOutlined style={{ color: 'white' }} />
                <span style={{ color: 'white' }}> โพสงาน</span>
              </Link>
            </Button>
            <Button 
              type="text" 
              style={{ color: 'white', margin: '0 10px' }} 
              onClick={() => setCurrentPage("resume")}
            >
              <Link to="/resume">
                <UserOutlined style={{ color: 'white' }} />
                <span style={{ color: 'white' }}> Resume</span>
              </Link>
            </Button>
            <Button 
              type="primary" 
              onClick={Logout} 
              style={{ marginLeft: '20px' }}
            >
              ออกจากระบบ
            </Button>
          </div>
        </Header>

        <Content style={{ margin: "16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }} />
          <div style={{ padding: 24, minHeight: "100%", background: '#f0f2f5' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/t" element={<Try />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/resume/create" element={<ResumeCreate />} />
              <Route path="/resume/edit/:id" element={<ResumeEdit />} />
              <Route path="/resume/view/:id" element={<ResumeView />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/create" element={<WorkCreate />} />
              <Route path="/work/edit/:id" element={<WorkEdit />} />
              <Route path="/go" element={<Postwork />} />
            </Routes>
          </div>
        </Content>

      </Layout>
    </Layout>
  );
};

export default FullLayout;
