import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Modal, Card, Row, Col, Statistic, Form, Input, Select, DatePicker, Switch } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PercentageOutlined } from '@ant-design/icons';
import { MdLocalOffer, MdTrendingUp, MdCheckCircle, MdBlock } from 'react-icons/md';
import DashboardLayout from "../components/layout";
import { apiService } from "../services/apiService";
import { toast } from 'sonner';
import dayjs from 'dayjs';

const PromoPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(true);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [form] = Form.useForm();
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        expired: 0,
        totalUsage: 0
    });

    // Fetch promotions from API
    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const response = await apiService.getAllPromotions();
            if (response.data.message) {
                setPromotions(response.data.message);
                calculateStats(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to fetch promotions');
            console.error('Error fetching promotions:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (promoData) => {
        const total = promoData.length;
        const active = promoData.filter(promo => promo.status === 'active').length;
        const expired = promoData.filter(promo => {
            const endDate = new Date(promo.end_date);
            return endDate < new Date();
        }).length;
        const totalUsage = promoData.reduce((sum, promo) => sum + (promo.used_count || 0), 0);

        setStats({ total, active, expired, totalUsage });
    };

    const handleCreatePromo = () => {
        setIsCreateMode(true);
        setSelectedPromo(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditPromo = (promo) => {
        setIsCreateMode(false);
        setSelectedPromo(promo);
        form.setFieldsValue({
            ...promo,
            start_date: dayjs(promo.start_date),
            end_date: promo.end_date ? dayjs(promo.end_date) : null
        });
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            const formData = {
                ...values,
                start_date: values.start_date.format('YYYY-MM-DD'),
                end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null
            };

            if (isCreateMode) {
                await apiService.createPromotion(formData);
                toast.success('Promotion created successfully');
            } else {
                // Note: Update promotion endpoint needs to be added to backend
                toast.info('Update functionality will be available when backend endpoint is implemented');
            }

            setIsModalVisible(false);
            fetchPromotions();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save promotion');
        }
    };

    const handleDeletePromo = async (promoId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this promotion?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    // Note: Delete promotion endpoint needs to be added to backend
                    toast.info('Delete functionality will be available when backend endpoint is implemented');
                    // await apiService.deletePromotion(promoId);
                    // toast.success('Promotion deleted successfully');
                    // fetchPromotions();
                } catch (error) {
                    toast.error('Failed to delete promotion');
                }
            }
        });
    };

    const getStatusColor = (status, endDate) => {
        if (status === 'inactive') return 'red';
        if (endDate && new Date(endDate) < new Date()) return 'orange';
        return 'green';
    };

    const getStatusText = (status, endDate) => {
        if (status === 'inactive') return 'INACTIVE';
        if (endDate && new Date(endDate) < new Date()) return 'EXPIRED';
        return 'ACTIVE';
    };

    const columns = [
        {
            title: "Promo Code",
            dataIndex: "promo_code",
            key: "promo_code",
            render: (code) => (
                <span className="font-mono font-semibold text-blue-600">{code}</span>
            )
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title"
        },
        {
            title: "Discount",
            key: "discount",
            render: (_, record) => (
                <div>
                    <span className="font-semibold">
                        {record.discount_type === 'percentage'
                            ? `${record.discount_value}%`
                            : `₦${Intl.NumberFormat().format(record.discount_value)}`
                        }
                    </span>
                    <div className="text-xs text-gray-500">
                        {record.discount_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                    </div>
                </div>
            )
        },
        {
            title: "Usage",
            key: "usage",
            render: (_, record) => (
                <div>
                    <span>{record.used_count || 0}</span>
                    {record.usage_limit && (
                        <span className="text-gray-500">/{record.usage_limit}</span>
                    )}
                </div>
            )
        },
        {
            title: "Valid Period",
            key: "period",
            render: (_, record) => (
                <div className="text-sm">
                    <div>{new Date(record.start_date).toLocaleDateString()}</div>
                    <div className="text-gray-500">
                        to {record.end_date ? new Date(record.end_date).toLocaleDateString() : 'No end date'}
                    </div>
                </div>
            )
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <Tag color={getStatusColor(record.status, record.end_date)}>
                    {getStatusText(record.status, record.end_date)}
                </Tag>
            )
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditPromo(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleDeletePromo(record.promo_id)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    useEffect(() => {
        fetchPromotions();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Promotion Management</h1>
                        <p className="text-gray-600">Create and manage promotional codes and discounts</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={handleCreatePromo}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Create Promotion
                    </Button>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={6}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Total Promotions"
                                value={stats.total}
                                prefix={<MdLocalOffer className="text-blue-500" />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Active Promotions"
                                value={stats.active}
                                prefix={<MdCheckCircle className="text-green-500" />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Expired"
                                value={stats.expired}
                                prefix={<MdBlock className="text-red-500" />}
                                valueStyle={{ color: '#ff4d4f' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Total Usage"
                                value={stats.totalUsage}
                                prefix={<MdTrendingUp className="text-purple-500" />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Promotions Table */}
                <Card className="border-0 shadow-sm">
                    <Table
                        dataSource={promotions}
                        columns={columns}
                        loading={loading}
                        rowKey="promo_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} promotions`,
                        }}
                        className="overflow-x-auto"
                    />
                </Card>

                {/* Create/Edit Promotion Modal */}
                <Modal
                    title={isCreateMode ? 'Create New Promotion' : 'Edit Promotion'}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={700}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        className="mt-4"
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="promo_code"
                                    label="Promo Code"
                                    rules={[{ required: true, message: 'Please enter promo code' }]}
                                >
                                    <Input placeholder="e.g., SAVE20" className="font-mono" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="title"
                                    label="Title"
                                    rules={[{ required: true, message: 'Please enter title' }]}
                                >
                                    <Input placeholder="e.g., 20% Off Summer Sale" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter description' }]}
                        >
                            <Input.TextArea rows={3} placeholder="Describe the promotion..." />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="discount_type"
                                    label="Discount Type"
                                    rules={[{ required: true, message: 'Please select discount type' }]}
                                >
                                    <Select placeholder="Select type">
                                        <Select.Option value="percentage">Percentage</Select.Option>
                                        <Select.Option value="fixed">Fixed Amount</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="discount_value"
                                    label="Discount Value"
                                    rules={[{ required: true, message: 'Please enter discount value' }]}
                                >
                                    <Input type="number" placeholder="e.g., 20" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="usage_limit"
                                    label="Usage Limit"
                                >
                                    <Input type="number" placeholder="Leave empty for unlimited" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="min_order_amount"
                                    label="Minimum Order Amount"
                                >
                                    <Input type="number" placeholder="e.g., 1000" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="max_discount_amount"
                                    label="Maximum Discount Amount"
                                >
                                    <Input type="number" placeholder="e.g., 5000" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="start_date"
                                    label="Start Date"
                                    rules={[{ required: true, message: 'Please select start date' }]}
                                >
                                    <DatePicker className="w-full" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="end_date"
                                    label="End Date"
                                >
                                    <DatePicker className="w-full" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="status"
                            label="Status"
                            initialValue="active"
                        >
                            <Select>
                                <Select.Option value="active">Active</Select.Option>
                                <Select.Option value="inactive">Inactive</Select.Option>
                                <Select.Option value="draft">Draft</Select.Option>
                            </Select>
                        </Form.Item>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button onClick={() => setIsModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {isCreateMode ? 'Create Promotion' : 'Update Promotion'}
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default PromoPage;