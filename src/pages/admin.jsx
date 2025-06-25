import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Modal, Form, Input, Select, Card, Row, Col, Statistic, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { MdAdminPanelSettings, MdSupervisorAccount, MdManageAccounts, MdPeople } from 'react-icons/md';
import DashboardLayout from "../components/layout";
import { apiService } from "../services/apiService";
import { toast } from 'sonner';


const { Option } = Select;

const Adminpage = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [form] = Form.useForm();
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        superAdmins: 0
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const response = await apiService.getAllAdmins();
            if (response.data.message) {
                setAdmins(response.data.message);
                calculateStats(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to fetch admins');
            console.error('Error fetching admins:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (adminData) => {
        const total = adminData.length;
        const active = adminData.filter(admin => admin.status === 'active').length;
        const inactive = adminData.filter(admin => admin.status === 'inactive').length;
        const superAdmins = adminData.filter(admin => admin.role === 'super_admin').length;

        setStats({ total, active, inactive, superAdmins });
    };

    const handleCreateAdmin = async (values) => {
        try {
            await apiService.createAdmin(values);
            toast.success('Admin created successfully');
            setModalVisible(false);
            form.resetFields();
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create admin');
        }
    };

    const handleUpdateAdmin = async (values) => {
        try {
            await apiService.updateAdmin(editingAdmin.admin_id, values);
            toast.success('Admin updated successfully');
            setModalVisible(false);
            setEditingAdmin(null);
            form.resetFields();
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update admin');
        }
    };

    const handleDeleteAdmin = async (adminId) => {
        try {
            await apiService.deleteAdmin(adminId);
            toast.success('Admin deleted successfully');
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete admin');
        }
    };

    const openModal = (admin = null) => {
        setEditingAdmin(admin);
        setModalVisible(true);
        if (admin) {
            form.setFieldsValue({
                fullname: admin.fullname,
                email: admin.email,
                mobile: admin.mobile,
                role: admin.role,
                status: admin.status
            });
        } else {
            form.resetFields();
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'super_admin':
                return <MdSupervisorAccount className="text-red-500" />;
            case 'admin':
                return <MdAdminPanelSettings className="text-blue-500" />;
            case 'moderator':
                return <MdManageAccounts className="text-green-500" />;
            default:
                return <UserOutlined />;
        }
    };

    const columns = [
        {
            title: 'S/NO',
            key: 'index',
            render: (_, __, index) => index + 1,
            width: 60,
        },
        {
            title: 'Name',
            dataIndex: 'fullname',
            key: 'fullname',
            render: (text, record) => (
                <div className="flex items-center space-x-2">
                    {getRoleIcon(record.role)}
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                const colors = {
                    super_admin: 'red',
                    admin: 'blue',
                    moderator: 'green'
                };
                return (
                    <Tag color={colors[role]} className="capitalize">
                        {role.replace('_', ' ')}
                    </Tag>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'} className="capitalize">
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openModal(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this admin?"
                        onConfirm={() => handleDeleteAdmin(record.admin_id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
                        <p className="text-gray-600">Manage admin users and their permissions</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => openModal()}
                        size="large"
                    >
                        Add Admin
                    </Button>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Total Admins"
                                value={stats.total}
                                prefix={<MdPeople className="text-blue-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Active"
                                value={stats.active}
                                prefix={<MdAdminPanelSettings className="text-green-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Inactive"
                                value={stats.inactive}
                                prefix={<UserOutlined className="text-red-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Super Admins"
                                value={stats.superAdmins}
                                prefix={<MdSupervisorAccount className="text-purple-500" />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Admins Table */}
                <Card title="All Admins" className="shadow-sm">
                    <Table
                        dataSource={admins}
                        columns={columns}
                        loading={loading}
                        rowKey="admin_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} admins`,
                        }}
                    />
                </Card>

                {/* Create/Edit Modal */}
                <Modal
                    title={editingAdmin ? 'Edit Admin' : 'Create New Admin'}
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        setEditingAdmin(null);
                        form.resetFields();
                    }}
                    footer={null}
                    width={600}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={editingAdmin ? handleUpdateAdmin : handleCreateAdmin}
                    >
                        <Form.Item
                            name="fullname"
                            label="Full Name"
                            rules={[{ required: true, message: 'Please enter full name' }]}
                        >
                            <Input placeholder="Enter full name" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please enter email' },
                                { type: 'email', message: 'Please enter valid email' }
                            ]}
                        >
                            <Input placeholder="Enter email address" />
                        </Form.Item>

                        <Form.Item
                            name="mobile"
                            label="Mobile Number"
                            rules={[{ required: true, message: 'Please enter mobile number' }]}
                        >
                            <Input placeholder="Enter mobile number" />
                        </Form.Item>

                        {!editingAdmin && (
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    { required: true, message: 'Please enter password' },
                                    { min: 6, message: 'Password must be at least 6 characters' }
                                ]}
                            >
                                <Input.Password placeholder="Enter password" />
                            </Form.Item>
                        )}

                        <Form.Item
                            name="role"
                            label="Role"
                            rules={[{ required: true, message: 'Please select role' }]}
                        >
                            <Select placeholder="Select role">
                                <Option value="admin">Admin</Option>
                                <Option value="super_admin">Super Admin</Option>
                                <Option value="moderator">Moderator</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select status' }]}
                        >
                            <Select placeholder="Select status">
                                <Option value="active">Active</Option>
                                <Option value="inactive">Inactive</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item className="mb-0 flex justify-end">
                            <Space>
                                <Button onClick={() => {
                                    setModalVisible(false);
                                    setEditingAdmin(null);
                                    form.resetFields();
                                }}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    {editingAdmin ? 'Update' : 'Create'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Adminpage