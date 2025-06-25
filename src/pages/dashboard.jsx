import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout'
import SummaryCard from '../components/summarycard'
import { Row, Col, Card, Table, Progress, Tag, Spin, Button } from 'antd'
import {
  MdPeople,
  MdShoppingCart,
  MdAttachMoney,
  MdInventory,
  MdTrendingUp,
  MdTrendingDown
} from 'react-icons/md'
import { apiService } from '../services/apiService'
import { toast } from 'sonner'
import PageLoader from '../components/PageLoader'
import EmptyState from '../components/EmptyState'

const DashboardPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardStats, setDashboardStats] = useState({})
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch dashboard statistics
      const statsResponse = await apiService.getDashboardStats()
      if (statsResponse.data.message) {
        setDashboardStats(statsResponse.data.message)
      }

      // Fetch recent orders
      const ordersResponse = await apiService.getAllOrders()
      if (ordersResponse.data.message) {
        // Get the 5 most recent orders
        const recent = ordersResponse.data.message
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((order, index) => ({
            key: index + 1,
            orderId: `#ORD-${order.order_id}`,
            customer: order.user_fullname || 'N/A',
            product: order.product_names || 'Multiple Items',
            amount: `₦${Intl.NumberFormat().format(order.amount)}`,
            status: order.delivery_status,
            date: new Date(order.createdAt).toLocaleDateString()
          }))
        setRecentOrders(recent)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError(error.response?.data?.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          completed: 'green',
          pending: 'orange',
          shipped: 'blue',
          cancelled: 'red'
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your jewelry store.</p>
          </div>
          <div className="flex items-center gap-4">
            {error && (
              <Button
                type="primary"
                onClick={fetchDashboardData}
                loading={loading}
              >
                Retry
              </Button>
            )}
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {loading ? (
          <PageLoader tip="Loading dashboard data..." />
        ) : error ? (
          <EmptyState
            title="Failed to load dashboard data"
            description={error}
            actionText="Retry"
            onAction={fetchDashboardData}
          />
        ) : (
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <SummaryCard
                icon={<MdPeople />}
                count={dashboardStats.total_users || 0}
                title="Total Users"
                subtitle="Active customers"
                trend="up"
                trendValue={12}
                color="blue"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <SummaryCard
                icon={<MdShoppingCart />}
                count={dashboardStats.orders_today || 0}
                title="Orders Today"
                subtitle="New orders"
                trend="up"
                trendValue={8}
                color="green"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <SummaryCard
                icon={<MdAttachMoney />}
                count={`₦${Intl.NumberFormat().format(dashboardStats.monthly_revenue || 0)}`}
                title="Revenue"
                subtitle="This month"
                trend="up"
                trendValue={15}
                color="purple"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <SummaryCard
                icon={<MdInventory />}
                count={dashboardStats.total_products || 0}
                title="Products"
                subtitle="In inventory"
                trend="down"
                trendValue={3}
                color="orange"
              />
            </Col>
          </Row>
        )}

        {/* Charts and Tables Row */}
        <Row gutter={[24, 24]}>
          {/* Recent Orders */}
          <Col xs={24} lg={16}>
            <Card
              title="Recent Orders"
              className="shadow-sm"
              extra={<a href="/order">View All</a>}
            >
              <Table
                dataSource={recentOrders}
                columns={orderColumns}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>

          {/* Quick Stats */}
          <Col xs={24} lg={8}>
            <Card title="Quick Stats" className="shadow-sm">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Order Completion Rate</span>
                    <span className="text-sm font-medium">
                      {dashboardStats.total_orders > 0
                        ? Math.round(((dashboardStats.total_orders - dashboardStats.pending_orders) / dashboardStats.total_orders) * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress
                    percent={dashboardStats.total_orders > 0
                      ? Math.round(((dashboardStats.total_orders - dashboardStats.pending_orders) / dashboardStats.total_orders) * 100)
                      : 0}
                    strokeColor="#52c41a"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Low Stock Products</span>
                    <span className="text-sm font-medium">
                      {dashboardStats.low_stock_products || 0}
                    </span>
                  </div>
                  <Progress
                    percent={dashboardStats.total_products > 0
                      ? Math.round((dashboardStats.low_stock_products / dashboardStats.total_products) * 100)
                      : 0}
                    strokeColor="#ff7875"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Inventory Turnover</span>
                    <span className="text-sm font-medium">76%</span>
                  </div>
                  <Progress percent={76} strokeColor="#722ed1" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage