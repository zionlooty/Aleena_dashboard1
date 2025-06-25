import React, { useEffect, useState } from "react";
import { Avatar, Table, Button, Input, Space, Tag, Card, Row, Col, Statistic, Modal, Select, Image } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { MdDelete, MdEdit, MdInventory, MdTrendingUp, MdWarning } from "react-icons/md";
import { BsFillBasketFill } from "react-icons/bs";
import DashboardLayout from "../components/layout";
import SummaryCard from "../components/summarycard";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { apiService } from "../services/apiService";

export const IMAGE_URL = import.meta.env.VITE_FILE_URL;


const Productspage = () => {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stats, setStats] = useState({
        total: 0,
        lowStock: 0,
        outOfStock: 0,
        totalValue: 0
    });

    const fetchAllProduct = async () => {
        setLoading(true);
        try {
            const response = await apiService.getAllProducts();
            console.log(response.data);
            setProduct(response.data.message);
            calculateStats(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (productData) => {
        const total = productData.length;
        const lowStock = productData.filter(p => p.product_quantity < 10 && p.product_quantity > 0).length;
        const outOfStock = productData.filter(p => p.product_quantity === 0).length;
        const totalValue = productData.reduce((sum, p) => sum + (p.product_price * p.product_quantity), 0);

        setStats({ total, lowStock, outOfStock, totalValue });
    };

    const handleDeleteProduct = async (productId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await apiService.deleteProduct(productId);
                    toast.success('Product deleted successfully');
                    fetchAllProduct();
                } catch (error) {
                    toast.error('Failed to delete product');
                }
            }
        });
    };

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
    };

    const getStockStatus = (quantity) => {
        if (quantity === 0) return { color: 'red', text: 'Out of Stock' };
        if (quantity < 10) return { color: 'orange', text: 'Low Stock' };
        return { color: 'green', text: 'In Stock' };
    };

    const filteredProducts = product.filter(p => {
        const matchesSearch = p.product_name.toLowerCase().includes(searchText.toLowerCase()) ||
                            p.product_description.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.product_category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(product.map(p => p.product_category))];

    const columns = [
        {
            title: "S/NO",
            dataIndex: "no",
            key: "no",
            width: 70,
            render: (_, __, index) => index + 1
        },
        {
            title: "Product",
            dataIndex: "product_name",
            key: "product_name",
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <Image
                        width={50}
                        height={50}
                        src={`${IMAGE_URL}/${record.product_image}`}
                        alt={text}
                        className="rounded-lg object-cover"
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                    />
                    <div>
                        <div className="font-medium text-gray-900">{text}</div>
                        <div className="text-sm text-gray-500">{record.product_category}</div>
                    </div>
                </div>
            )
        },
        {
            title: "Price",
            dataIndex: "product_price",
            key: "product_price",
            render: (price) => `₦${Intl.NumberFormat().format(price)}`
        },
        {
            title: "Stock",
            dataIndex: "product_quantity",
            key: "product_quantity",
            render: (quantity) => {
                const status = getStockStatus(quantity);
                return (
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{quantity}</span>
                        <Tag color={status.color}>{status.text}</Tag>
                    </div>
                );
            }
        },
        {
            title: "Category",
            dataIndex: "product_category",
            key: "product_category",
            render: (category) => (
                <Tag color="blue">{category}</Tag>
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
                        onClick={() => handleViewProduct(record)}
                    >
                        View
                    </Button>
                    <Link to={`/view/product/${record.product_id}`}>
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            size="small"
                        >
                            Edit
                        </Button>
                    </Link>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleDeleteProduct(record.product_id)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    useEffect(() => {
        fetchAllProduct();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                        <p className="text-gray-600">Manage your jewelry inventory and products</p>
                    </div>
                    <Link to="/addproduct">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Add New Product
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={6}>
                        <SummaryCard
                            title="Total Products"
                            subtitle="All products"
                            count={stats.total}
                            icon={<BsFillBasketFill />}
                            color="blue"
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        <SummaryCard
                            title="Low Stock"
                            subtitle="< 10 items"
                            count={stats.lowStock}
                            icon={<MdWarning />}
                            color="orange"
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        <SummaryCard
                            title="Out of Stock"
                            subtitle="0 items"
                            count={stats.outOfStock}
                            icon={<MdInventory />}
                            color="red"
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        <SummaryCard
                            title="Total Value"
                            subtitle="Inventory value"
                            count={`₦${Intl.NumberFormat().format(stats.totalValue)}`}
                            icon={<MdTrendingUp />}
                            color="green"
                        />
                    </Col>
                </Row>

                {/* Filters */}
                <Card className="border-0 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <Input
                                placeholder="Search products..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-64"
                            />
                            <Select
                                value={categoryFilter}
                                onChange={setCategoryFilter}
                                className="w-40"
                            >
                                <Select.Option value="all">All Categories</Select.Option>
                                {categories.map(category => (
                                    <Select.Option key={category} value={category}>
                                        {category}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                        <div className="text-sm text-gray-500">
                            Showing {filteredProducts.length} of {product.length} products
                        </div>
                    </div>
                </Card>

                {/* Products Table */}
                <Card className="border-0 shadow-sm">
                    <Table
                        dataSource={filteredProducts}
                        columns={columns}
                        loading={loading}
                        rowKey="product_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} products`,
                        }}
                        className="overflow-x-auto"
                    />
                </Card>

                {/* Product Details Modal */}
                <Modal
                    title="Product Details"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setIsModalVisible(false)}>
                            Close
                        </Button>
                    ]}
                    width={700}
                >
                    {selectedProduct && (
                        <div className="space-y-6">
                            <div className="flex gap-6">
                                <Image
                                    width={200}
                                    height={200}
                                    src={`${IMAGE_URL}/${selectedProduct.product_image}`}
                                    alt={selectedProduct.product_name}
                                    className="rounded-lg object-cover"
                                />
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold">{selectedProduct.product_name}</h3>
                                        <Tag color="blue">{selectedProduct.product_category}</Tag>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Price</label>
                                            <p className="text-lg font-semibold text-green-600">
                                                ₦{Intl.NumberFormat().format(selectedProduct.product_price)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Stock</label>
                                            <p className="text-lg font-semibold">
                                                {selectedProduct.product_quantity} units
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Tag</label>
                                            <p className="text-gray-900">{selectedProduct.product_tag}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Discount</label>
                                            <p className="text-gray-900">{selectedProduct.discount_percentage}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Description</label>
                                <p className="text-gray-900 mt-1">{selectedProduct.product_description}</p>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Productspage