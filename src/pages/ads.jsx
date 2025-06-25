import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Modal, Form, Input, Select, Card, Row, Col, Statistic, Upload, Image, DatePicker, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { MdAnnouncement, MdVisibility, MdBlock, MdTrendingUp } from 'react-icons/md';
import DashboardLayout from '../components/layout';
import { apiService } from '../services/apiService';
import { toast } from 'sonner';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const Adspage = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        draft: 0
    });

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const response = await apiService.getAllAds();
            if (response.data.message) {
                setAds(response.data.message);
                calculateStats(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to fetch ads');
            console.error('Error fetching ads:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (adsData) => {
        const total = adsData.length;
        const active = adsData.filter(ad => ad.status === 'active').length;
        const inactive = adsData.filter(ad => ad.status === 'inactive').length;
        const draft = adsData.filter(ad => ad.status === 'draft').length;

        setStats({ total, active, inactive, draft });
    };

    const handleCreateAd = async (values) => {
        try {
            const adData = {
                ...values,
                start_date: values.dateRange[0].format('YYYY-MM-DD'),
                end_date: values.dateRange[1]?.format('YYYY-MM-DD') || null,
                image: fileList[0]?.originFileObj || null
            };
            delete adData.dateRange;

            await apiService.createAd(adData);
            toast.success('Advertisement created successfully');
            setModalVisible(false);
            form.resetFields();
            setFileList([]);
            fetchAds();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create advertisement');
        }
    };

    const handleUpdateAd = async (values) => {
        try {
            const adData = {
                ...values,
                start_date: values.dateRange[0].format('YYYY-MM-DD'),
                end_date: values.dateRange[1]?.format('YYYY-MM-DD') || null,
            };

            if (fileList[0]?.originFileObj) {
                adData.image = fileList[0].originFileObj;
            }
            delete adData.dateRange;

            await apiService.updateAd(editingAd.ad_id, adData);
            toast.success('Advertisement updated successfully');
            setModalVisible(false);
            setEditingAd(null);
            form.resetFields();
            setFileList([]);
            fetchAds();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update advertisement');
        }
    };

    const handleDeleteAd = async (adId) => {
        try {
            await apiService.deleteAd(adId);
            toast.success('Advertisement deleted successfully');
            fetchAds();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete advertisement');
        }
    };

    const openModal = (ad = null) => {
        setEditingAd(ad);
        setModalVisible(true);
        if (ad) {
            form.setFieldsValue({
                title: ad.title,
                description: ad.description,
                ad_type: ad.ad_type,
                target_audience: ad.target_audience,
                status: ad.status,
                dateRange: [
                    dayjs(ad.start_date),
                    ad.end_date ? dayjs(ad.end_date) : null
                ]
            });
            if (ad.image) {
                setFileList([{
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: `http://localhost:8888/uploads/${ad.image}`,
                }]);
            }
        } else {
            form.resetFields();
            setFileList([]);
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
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (
                image ? (
                    <Image
                        width={50}
                        height={50}
                        src={`http://localhost:8888/uploads/${image}`}
                        alt="Ad Image"
                        className="rounded"
                    />
                ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                )
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (
                <span className="text-gray-600">
                    {text.length > 50 ? `${text.substring(0, 50)}...` : text}
                </span>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'ad_type',
            key: 'ad_type',
            render: (type) => {
                const colors = {
                    banner: 'blue',
                    popup: 'green',
                    sidebar: 'orange',
                    featured: 'purple'
                };
                return (
                    <Tag color={colors[type]} className="capitalize">
                        {type}
                    </Tag>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = {
                    active: 'green',
                    inactive: 'red',
                    draft: 'orange'
                };
                return (
                    <Tag color={colors[status]} className="capitalize">
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (date) => date ? new Date(date).toLocaleDateString() : 'No End Date',
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
                        title="Are you sure you want to delete this advertisement?"
                        onConfirm={() => handleDeleteAd(record.ad_id)}
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

    const uploadProps = {
        fileList,
        onChange: ({ fileList: newFileList }) => setFileList(newFileList),
        beforeUpload: () => false, // Prevent auto upload
        maxCount: 1,
        accept: 'image/*',
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Advertisement Management</h1>
                        <p className="text-gray-600">Create and manage your advertising campaigns</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => openModal()}
                        size="large"
                    >
                        Create Ad
                    </Button>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Total Ads"
                                value={stats.total}
                                prefix={<MdAnnouncement className="text-blue-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Active"
                                value={stats.active}
                                prefix={<MdVisibility className="text-green-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Inactive"
                                value={stats.inactive}
                                prefix={<MdBlock className="text-red-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Draft"
                                value={stats.draft}
                                prefix={<MdTrendingUp className="text-orange-500" />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Ads Table */}
                <Card title="All Advertisements" className="shadow-sm">
                    <Table
                        dataSource={ads}
                        columns={columns}
                        loading={loading}
                        rowKey="ad_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} advertisements`,
                        }}
                    />
                </Card>

                {/* Create/Edit Modal */}
                <Modal
                    title={editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        setEditingAd(null);
                        form.resetFields();
                        setFileList([]);
                    }}
                    footer={null}
                    width={800}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={editingAd ? handleUpdateAd : handleCreateAd}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="title"
                                    label="Title"
                                    rules={[{ required: true, message: 'Please enter title' }]}
                                >
                                    <Input placeholder="Enter advertisement title" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="ad_type"
                                    label="Advertisement Type"
                                    rules={[{ required: true, message: 'Please select ad type' }]}
                                >
                                    <Select placeholder="Select ad type">
                                        <Option value="banner">Banner</Option>
                                        <Option value="popup">Popup</Option>
                                        <Option value="sidebar">Sidebar</Option>
                                        <Option value="featured">Featured</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter description' }]}
                        >
                            <TextArea rows={4} placeholder="Enter advertisement description" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="target_audience"
                                    label="Target Audience"
                                >
                                    <Input placeholder="Enter target audience (optional)" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="status"
                                    label="Status"
                                    rules={[{ required: true, message: 'Please select status' }]}
                                >
                                    <Select placeholder="Select status">
                                        <Option value="active">Active</Option>
                                        <Option value="inactive">Inactive</Option>
                                        <Option value="draft">Draft</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="dateRange"
                            label="Campaign Duration"
                            rules={[{ required: true, message: 'Please select campaign duration' }]}
                        >
                            <RangePicker
                                style={{ width: '100%' }}
                                placeholder={['Start Date', 'End Date']}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Advertisement Image"
                        >
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>
                                    {fileList.length > 0 ? 'Change Image' : 'Upload Image'}
                                </Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item className="mb-0 flex justify-end">
                            <Space>
                                <Button onClick={() => {
                                    setModalVisible(false);
                                    setEditingAd(null);
                                    form.resetFields();
                                    setFileList([]);
                                }}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    {editingAd ? 'Update' : 'Create'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Adspage