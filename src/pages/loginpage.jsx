import { useState } from "react";
import React from 'react'
import { toast } from 'sonner';
import { Button, Input, Form, Card } from 'antd';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdAdminPanelSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API || 'http://localhost:8888';

function Loginpage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/admin/login`, {
                email_number: values.email,
                password: values.password
            });

            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
                toast.success('Login successful!');
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden">

        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 p-12">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdAdminPanelSettings className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Portal</h2>
            <p className="text-gray-600">Welcome back! Please sign in to your account</p>
          </div>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="space-y-6"
          >
            <Form.Item
              name="email"
              label={<span className="text-sm font-medium text-gray-700">Email Address</span>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input
                prefix={<MdEmail className="text-gray-400" />}
                placeholder="Enter your email address"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-sm font-medium text-gray-700">Password</span>}
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password
                prefix={<MdLock className="text-gray-400" />}
                placeholder="Enter your password"
                size="large"
                className="rounded-lg"
                iconRender={(visible) => (visible ? <MdVisibility /> : <MdVisibilityOff />)}
              />
            </Form.Item>

            <div className="flex justify-between items-center">
              <Form.Item name="remember" valuePropName="checked" className="mb-0">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-blue-500 rounded" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
              </Form.Item>
              <a href="#" className="text-sm text-blue-500 hover:text-blue-700 transition-colors">
                Forgot password?
              </a>
            </div>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-lg h-12 text-lg font-medium"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help? <a href="#" className="text-blue-500 hover:text-blue-700">Contact Support</a>
            </p>
          </div>
        </div>

        {/* Right Side - Image/Branding */}
        <div className="hidden md:block md:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700"></div>
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <img
            src="/pe.jpg"
            alt="Admin Dashboard"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h3 className="text-3xl font-bold mb-4">Jewelry Store Admin</h3>
              <p className="text-lg opacity-90 mb-6">
                Manage your jewelry business with our comprehensive admin dashboard
              </p>
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm opacity-75">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">1K+</div>
                  <div className="text-sm opacity-75">Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">99%</div>
                  <div className="text-sm opacity-75">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Loginpage