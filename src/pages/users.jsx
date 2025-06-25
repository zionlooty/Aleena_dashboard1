import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Tag, Avatar, Modal, Card, Row, Col, Statistic } from "antd";
import { SearchOutlined, UserOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { MdPeople, MdPersonAdd, MdBlock, MdCheckCircle } from 'react-icons/md';
import DashboardLayout from "../components/layout";
import { apiService } from "../services/apiService";
import { toast } from 'sonner';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        newThisMonth: 0
    });

    // Fetch users from API
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await apiService.getAllUsers();
            if (response.data.message) {
                setUsers(response.data.message);
                calculateStats(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to fetch users');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (userData) => {
        const total = userData.length;
        const active = total; // Since we don't have status field, assume all users are active
        const currentMonth = new Date().getMonth();
        const newThisMonth = userData.filter(user => {
            const userMonth = new Date(user.createdAt).getMonth();
            return userMonth === currentMonth;
        }).length;

        setStats({ total, active, newThisMonth });
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setIsModalVisible(true);
    };

    const handleDeleteUser = async (userId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this user?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await apiService.deleteUser(userId);
                    toast.success('User deleted successfully');
                    fetchUsers();
                } catch (error) {
                    toast.error('Failed to delete user');
                }
            }
        });
    };

    const columns = [
        {
            title: "S/NO",
            dataIndex: "no",
            key: "no",
            width: 70,
            render: (_, __, index) => index + 1
        },
        {
            title: "User",
            dataIndex: "fullname",
            key: "fullname",
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <Avatar size={40} icon={<UserOutlined />} />
                    <div>
                        <div className="font-medium text-gray-900">{text}</div>
                        <div className="text-sm text-gray-500">{record.email}</div>
                    </div>
                </div>
            ),
            filterable: true,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="p-4">
                    <Input
                        placeholder="Search users"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        className="mb-2"
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                        >
                            Search
                        </Button>
                        <Button onClick={() => clearFilters()} size="small">
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) =>
                record.fullname.toLowerCase().includes(value.toLowerCase()) ||
                record.email.toLowerCase().includes(value.toLowerCase())
        },
        {
            title: "Mobile",
            dataIndex: "mobile",
            key: "mobile",
            render: (mobile) => mobile || 'Not provided'
        },
        {
            title: "Joined",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewUser(record)}
                    >
                        View
                    </Button>
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        size="small"
                    >
                        Edit
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleDeleteUser(record.user_id)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600">Manage and monitor all registered users</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<MdPersonAdd />}
                        size="large"
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Add New User
                    </Button>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Total Users"
                                value={stats.total}
                                prefix={<MdPeople className="text-blue-500" />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Active Users"
                                value={stats.active}
                                prefix={<MdCheckCircle className="text-green-500" />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="New This Month"
                                value={stats.newThisMonth}
                                prefix={<MdPersonAdd className="text-purple-500" />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Users Table */}
                <Card className="border-0 shadow-sm">
                    <Table
                        dataSource={users}
                        columns={columns}
                        loading={loading}
                        rowKey="user_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} users`,
                        }}
                        className="overflow-x-auto"
                    />
                </Card>

                {/* User Details Modal */}
                <Modal
                    title="User Details"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setIsModalVisible(false)}>
                            Close
                        </Button>
                    ]}
                    width={600}
                >
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <Avatar size={64} icon={<UserOutlined />} />
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedUser.fullname}</h3>
                                    <p className="text-gray-600">{selectedUser.email}</p>
                                    <Tag color="green">ACTIVE</Tag>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Mobile</label>
                                    <p className="text-gray-900">{selectedUser.mobile || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">User ID</label>
                                    <p className="text-gray-900">{selectedUser.user_id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Joined Date</label>
                                    <p className="text-gray-900">
                                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default UserPage