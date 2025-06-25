import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Modal, Card, Row, Col, Statistic, Select, DatePicker } from "antd";
import { EyeOutlined, EditOutlined, CheckCircleOutlined, ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { MdShoppingCart, MdLocalShipping, MdCheckCircle, MdPending } from 'react-icons/md';
import DashboardLayout from "../components/layout";
import { apiService } from "../services/apiService";
import { toast } from 'sonner';

const Orderpage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0
    });

    // Fetch orders from API
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await apiService.getAllOrders();
            if (response.data.message) {
                setOrders(response.data.message);
                calculateStats(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to fetch orders');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (orderData) => {
        const total = orderData.length;
        const pending = orderData.filter(order => order.delivery_status === 'pending').length;
        const processing = orderData.filter(order => order.delivery_status === 'processing').length;
        const shipped = orderData.filter(order => order.delivery_status === 'shipped').length;
        const delivered = orderData.filter(order => order.delivery_status === 'delivered').length;
        const cancelled = orderData.filter(order => order.delivery_status === 'cancelled').length;
        const totalRevenue = orderData.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0);

        setStats({ total, pending, processing, shipped, delivered, cancelled, totalRevenue });
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setLoading(true);
            console.log(`Updating order ${orderId} status to ${newStatus}`);
            await apiService.updateOrderStatus(orderId, { delivery_status: newStatus });
            toast.success(`Order #${orderId} status updated to ${newStatus.toUpperCase()}`);

            // Update the local state immediately for better UX
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.order_id === orderId
                        ? { ...order, delivery_status: newStatus }
                        : order
                )
            );

            // Refresh data to ensure consistency
            await fetchOrders();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update order status';
            toast.error(errorMessage);
            console.error('Error updating order status:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'processing': return 'blue';
            case 'shipped': return 'purple';
            case 'delivered': return 'green';
            case 'cancelled': return 'red';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <MdPending />;
            case 'processing': return <ClockCircleOutlined />;
            case 'shipped': return <MdLocalShipping />;
            case 'delivered': return <MdCheckCircle />;
            default: return <ClockCircleOutlined />;
        }
    };

    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'all') return true;
        return order.delivery_status === statusFilter;
    });

    const columns = [
        {
            title: "Order ID",
            dataIndex: "order_id",
            key: "order_id",
            render: (id) => `#${id}`,
            sorter: (a, b) => b.order_id - a.order_id
        },
        {
            title: "Customer",
            dataIndex: "customer_name",
            key: "customer_name",
            render: (name, record) => (
                <div>
                    <div className="font-medium">{name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{record.customer_email}</div>
                </div>
            )
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `₦${Intl.NumberFormat().format(amount)}`,
            sorter: (a, b) => parseFloat(b.amount || 0) - parseFloat(a.amount || 0)
        },
        {
            title: "Status",
            dataIndex: "delivery_status",
            key: "delivery_status",
            render: (status) => (
                <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
                    {status?.toUpperCase()}
                </Tag>
            )
        },
        {
            title: "Order Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            defaultSortOrder: 'descend'
        },
        {
            title: "Delivery Address",
            dataIndex: "delivery_address",
            key: "delivery_address",
            render: (address) => (
                <div className="max-w-xs truncate" title={address}>
                    {address || 'Not provided'}
                </div>
            )
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
                        onClick={() => handleViewOrder(record)}
                    >
                        View
                    </Button>
                    <select
                        value={record.delivery_status}
                        onChange={(e) => handleStatusUpdate(record.order_id, e.target.value)}
                        style={{ width: 120 }}
                        // loading={loading}
                        // disabled={loading}
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </Space>
            )
        }
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                        <p className="text-gray-600">Track and manage customer orders</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={fetchOrders}
                            loading={loading}
                        >
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Total Orders"
                                value={stats.total}
                                prefix={<MdShoppingCart className="text-blue-500" />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Pending"
                                value={stats.pending}
                                prefix={<MdPending className="text-orange-500" />}
                                valueStyle={{ color: '#fa8c16' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Processing"
                                value={stats.processing}
                                prefix={<ClockCircleOutlined className="text-blue-500" />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Shipped"
                                value={stats.shipped}
                                prefix={<MdLocalShipping className="text-purple-500" />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Delivered"
                                value={stats.delivered}
                                prefix={<MdCheckCircle className="text-green-500" />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card className="border-0 shadow-sm">
                            <Statistic
                                title="Total Revenue"
                                value={stats.totalRevenue}
                                prefix="₦"
                                formatter={(value) => Intl.NumberFormat().format(value)}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Filters */}
                <Card className="border-0 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <Select
                                value={statusFilter}
                                onChange={setStatusFilter}
                                className="w-40"
                            >
                                <Select.Option value="all">All Status</Select.Option>
                                <Select.Option value="pending">Pending</Select.Option>
                                <Select.Option value="processing">Processing</Select.Option>
                                <Select.Option value="shipped">Shipped</Select.Option>
                                <Select.Option value="delivered">Delivered</Select.Option>
                                <Select.Option value="cancelled">Cancelled</Select.Option>
                            </Select>
                        </div>
                        <div className="text-sm text-gray-500">
                            Showing {filteredOrders.length} of {orders.length} orders
                        </div>
                    </div>
                </Card>

                {/* Orders Table */}
                <Card className="border-0 shadow-sm">
                    <Table
                        dataSource={filteredOrders}
                        columns={columns}
                        loading={loading}
                        rowKey="order_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} orders`,
                        }}
                        className="overflow-x-auto"
                    />
                </Card>

                {/* Order Details Modal */}
                <Modal
                    title={`Order Details - #${selectedOrder?.order_id}`}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setIsModalVisible(false)}>
                            Close
                        </Button>
                    ]}
                    width={800}
                >
                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Customer Information</label>
                                        <div className="mt-1">
                                            <p className="font-medium">{selectedOrder.customer_name || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">{selectedOrder.customer_email || 'No email'}</p>
                                            <p className="text-sm text-gray-600">{selectedOrder.customer_mobile || 'No mobile'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Order Status</label>
                                        <div className="mt-1">
                                            <Tag color={getStatusColor(selectedOrder.delivery_status)} icon={getStatusIcon(selectedOrder.delivery_status)}>
                                                {selectedOrder.delivery_status?.toUpperCase()}
                                            </Tag>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Order Date</label>
                                        <p className="mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Total Amount</label>
                                        <p className="mt-1 text-lg font-semibold text-green-600">
                                            ₦{Intl.NumberFormat().format(selectedOrder.amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div>
                                <label className="text-sm font-medium text-gray-500">Delivery Address</label>
                                <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    {selectedOrder.delivery_address || 'No delivery address provided'}
                                </p>
                            </div>

                            {/* Order Items */}
                            <div>
                                <label className="text-sm font-medium text-gray-500">Order Items</label>
                                <div className="mt-2 border rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Product</th>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Quantity</th>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Price</th>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items?.length > 0 ? (
                                                <>
                                                    {selectedOrder.items.map((item, index) => (
                                                        <tr key={index} className="border-t">
                                                            <td className="px-4 py-2">
                                                                <div className="flex items-center space-x-3">
                                                                    {item.product_image && (
                                                                        <img
                                                                            src={`http://localhost:8888/uploads/${item.product_image}`}
                                                                            alt={item.product_name}
                                                                            className="w-10 h-10 object-cover rounded"
                                                                        />
                                                                    )}
                                                                    <span>{item.product_name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2">{item.quantity}</td>
                                                            <td className="px-4 py-2">₦{Intl.NumberFormat().format(item.price)}</td>
                                                            <td className="px-4 py-2">₦{Intl.NumberFormat().format(item.quantity * item.price)}</td>
                                                        </tr>
                                                    ))}
                                                    <tr className="border-t bg-gray-50 font-semibold">
                                                        <td colSpan="3" className="px-4 py-2 text-right">Total:</td>
                                                        <td className="px-4 py-2">₦{Intl.NumberFormat().format(selectedOrder.amount)}</td>
                                                    </tr>
                                                </>
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                                                        No item details available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Orderpage