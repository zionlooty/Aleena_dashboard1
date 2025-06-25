import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Modal, Form, Input, Select, Card, Row, Col, Statistic, Popconfirm, Descriptions } from "antd";
import { EyeOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { MdAttachMoney, MdPending, MdCheckCircle, MdCancel } from 'react-icons/md';
import DashboardLayout from "../components/layout";
import { apiService } from "../services/apiService";
import { toast } from 'sonner';

const { Option } = Select;
const { TextArea } = Input;

const Refundpage = () => {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [form] = Form.useForm();
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        processing: 0
    });

    useEffect(() => {
        fetchRefunds();
    }, []);

    const fetchRefunds = async () => {
        setLoading(true);
        try {
            const response = await apiService.getAllRefunds();
            if (response.data.message) {
                setRefunds(response.data.message);
                calculateStats(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to fetch refunds');
            console.error('Error fetching refunds:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (refundData) => {
        const total = refundData.length;
        const pending = refundData.filter(refund => refund.status === 'pending').length;
        const approved = refundData.filter(refund => refund.status === 'approved').length;
        const rejected = refundData.filter(refund => refund.status === 'rejected').length;
        const processing = refundData.filter(refund => refund.status === 'processing').length;

        setStats({ total, pending, approved, rejected, processing });
    };

    const handleUpdateRefundStatus = async (values) => {
        try {
            await apiService.updateRefundStatus(selectedRefund.refund_id, values);
            toast.success('Refund status updated successfully');
            setModalVisible(false);
            setSelectedRefund(null);
            form.resetFields();
            fetchRefunds();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update refund status');
        }
    };

    const openStatusModal = (refund) => {
        setSelectedRefund(refund);
        setModalVisible(true);
        form.setFieldsValue({
            status: refund.status,
            admin_notes: refund.admin_notes || '',
            processed_amount: refund.processed_amount || refund.refund_amount
        });
    };

    const openViewModal = (refund) => {
        setSelectedRefund(refund);
        setViewModalVisible(true);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'orange',
            approved: 'green',
            rejected: 'red',
            processing: 'blue'
        };
        return colors[status] || 'default';
    };

    const getReasonText = (reason) => {
        const reasons = {
            defective: 'Defective Product',
            wrong_item: 'Wrong Item',
            not_as_described: 'Not as Described',
            damaged: 'Damaged',
            other: 'Other'
        };
        return reasons[reason] || reason;
    };

    const columns = [
        {
            title: 'S/NO',
            key: 'index',
            render: (_, __, index) => index + 1,
            width: 60,
        },
        {
            title: 'Customer',
            dataIndex: 'user_fullname',
            key: 'user_fullname',
            render: (text) => <span className="font-medium">{text || 'N/A'}</span>,
        },
        {
            title: 'Order ID',
            dataIndex: 'order_id',
            key: 'order_id',
            render: (orderId) => <span className="text-blue-600">#{orderId}</span>,
        },
        {
            title: 'Refund Amount',
            dataIndex: 'refund_amount',
            key: 'refund_amount',
            render: (amount) => <span className="font-medium">₦{Intl.NumberFormat().format(amount)}</span>,
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            render: (reason) => (
                <Tag color="blue" className="capitalize">
                    {getReasonText(reason)}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)} className="capitalize">
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Request Date',
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
                        type="default"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => openViewModal(record)}
                    >
                        View
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openStatusModal(record)}
                    >
                        Update Status
                    </Button>
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
                        <h1 className="text-2xl font-bold text-gray-900">Refund Management</h1>
                        <p className="text-gray-600">Manage customer refund requests and process refunds</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Total Refunds"
                                value={stats.total}
                                prefix={<MdAttachMoney className="text-blue-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Pending"
                                value={stats.pending}
                                prefix={<MdPending className="text-orange-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Approved"
                                value={stats.approved}
                                prefix={<MdCheckCircle className="text-green-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <Statistic
                                title="Rejected"
                                value={stats.rejected}
                                prefix={<MdCancel className="text-red-500" />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Refunds Table */}
                <Card title="All Refund Requests" className="shadow-sm">
                    <Table
                        dataSource={refunds}
                        columns={columns}
                        loading={loading}
                        rowKey="refund_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} refund requests`,
                        }}
                    />
                </Card>

                {/* View Refund Details Modal */}
                <Modal
                    title="Refund Request Details"
                    open={viewModalVisible}
                    onCancel={() => {
                        setViewModalVisible(false);
                        setSelectedRefund(null);
                    }}
                    footer={[
                        <Button key="close" onClick={() => {
                            setViewModalVisible(false);
                            setSelectedRefund(null);
                        }}>
                            Close
                        </Button>
                    ]}
                    width={700}
                >
                    {selectedRefund && (
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Refund ID" span={2}>
                                #{selectedRefund.refund_id}
                            </Descriptions.Item>
                            <Descriptions.Item label="Customer">
                                {selectedRefund.user_fullname || 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Order ID">
                                #{selectedRefund.order_id}
                            </Descriptions.Item>
                            <Descriptions.Item label="Refund Amount">
                                ₦{Intl.NumberFormat().format(selectedRefund.refund_amount)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Processed Amount">
                                {selectedRefund.processed_amount
                                    ? `₦${Intl.NumberFormat().format(selectedRefund.processed_amount)}`
                                    : 'Not processed'
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Reason">
                                <Tag color="blue">{getReasonText(selectedRefund.reason)}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={getStatusColor(selectedRefund.status)}>
                                    {selectedRefund.status.toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Description" span={2}>
                                {selectedRefund.description}
                            </Descriptions.Item>
                            <Descriptions.Item label="Admin Notes" span={2}>
                                {selectedRefund.admin_notes || 'No admin notes'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Request Date">
                                {new Date(selectedRefund.created_at).toLocaleString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Last Updated">
                                {new Date(selectedRefund.updated_at).toLocaleString()}
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </Modal>

                {/* Update Status Modal */}
                <Modal
                    title="Update Refund Status"
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        setSelectedRefund(null);
                        form.resetFields();
                    }}
                    footer={null}
                    width={600}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdateRefundStatus}
                    >
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select status' }]}
                        >
                            <Select placeholder="Select status">
                                <Option value="pending">Pending</Option>
                                <Option value="approved">Approved</Option>
                                <Option value="rejected">Rejected</Option>
                                <Option value="processing">Processing</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="processed_amount"
                            label="Processed Amount"
                            rules={[{ required: true, message: 'Please enter processed amount' }]}
                        >
                            <Input
                                type="number"
                                placeholder="Enter processed amount"
                                prefix="₦"
                            />
                        </Form.Item>

                        <Form.Item
                            name="admin_notes"
                            label="Admin Notes"
                        >
                            <TextArea
                                rows={4}
                                placeholder="Enter admin notes (optional)"
                            />
                        </Form.Item>

                        <Form.Item className="mb-0 flex justify-end">
                            <Space>
                                <Button onClick={() => {
                                    setModalVisible(false);
                                    setSelectedRefund(null);
                                    form.resetFields();
                                }}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Update Status
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Refundpage