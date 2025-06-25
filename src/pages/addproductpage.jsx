import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout'
import { toast } from 'sonner'
import { Form, Input, Select, Upload, Button, Card, Row, Col, InputNumber, Progress, Spin, Table, Modal, Space, Popconfirm, Tabs } from 'antd'
import { UploadOutlined, SaveOutlined, EyeOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { MdCloudUpload } from 'react-icons/md'
import { apiService } from "../services/apiService"

// Custom Select component that works with Ant Design Form
const CustomSelect = ({ value, onChange, options, placeholder, className, ...props }) => {
    return (
        <select
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
            className={className}
            {...props}
        >
            <option value="">{placeholder}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

const Addproductpage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Products management state
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('add');

    // Product categories with comprehensive jewelry options
    const categories = [
        { value: "rings", label: "Rings" },
        { value: "necklaces", label: "Necklaces" },
        { value: "earrings", label: "Earrings" },
        { value: "bracelets", label: "Bracelets" },
        { value: "watches", label: "Watches" },
        { value: "chains", label: "Chains" },
        { value: "pendants", label: "Pendants" },
        { value: "anklets", label: "Anklets" },
        { value: "brooches", label: "Brooches" },
        { value: "cufflinks", label: "Cufflinks" },
        { value: "sets", label: "Jewelry Sets" },
        { value: "bangles", label: "Bangles" },
        { value: "chokers", label: "Chokers" },
        { value: "tiaras", label: "Tiaras" },
        { value: "body-jewelry", label: "Body Jewelry" },
        { value: "hair-accessories", label: "Hair Accessories" },
        { value: "gemstones", label: "Gemstones" },
        { value: "pearls", label: "Pearls" },
        { value: "gold", label: "Gold Jewelry" },
        { value: "silver", label: "Silver Jewelry" },
        { value: "platinum", label: "Platinum Jewelry" },
        { value: "diamond", label: "Diamond Jewelry" },
        { value: "custom", label: "Custom Jewelry" },
        { value: "vintage", label: "Vintage Collection" },
        { value: "luxury", label: "Luxury Collection" }
    ];

    // Product tags for marketing and filtering
    const tags = [
        { value: "new-arrival", label: "New Arrival" },
        { value: "best-seller", label: "Best Seller" },
        { value: "limited-edition", label: "Limited Edition" },
        { value: "sale", label: "Sale" },
        { value: "premium", label: "Premium" },
        { value: "handcrafted", label: "Handcrafted" },
        { value: "trending", label: "Trending" },
        { value: "exclusive", label: "Exclusive" },
        { value: "vintage", label: "Vintage" },
        { value: "modern", label: "Modern" },
        { value: "featured", label: "Featured" },
        { value: "popular", label: "Popular" },
        { value: "recommended", label: "Recommended" },
        { value: "hot-deal", label: "Hot Deal" },
        { value: "clearance", label: "Clearance" },
        { value: "gift-idea", label: "Gift Idea" },
        { value: "bridal", label: "Bridal Collection" },
        { value: "anniversary", label: "Anniversary Special" },
        { value: "birthday", label: "Birthday Gift" },
        { value: "valentine", label: "Valentine's Special" },
        { value: "mother-day", label: "Mother's Day" },
        { value: "father-day", label: "Father's Day" },
        { value: "christmas", label: "Christmas Special" },
        { value: "graduation", label: "Graduation Gift" },
        { value: "engagement", label: "Engagement" },
        { value: "wedding", label: "Wedding" },
        { value: "everyday", label: "Everyday Wear" },
        { value: "formal", label: "Formal Occasion" },
        { value: "casual", label: "Casual Wear" },
        { value: "office", label: "Office Wear" }
    ];

    // Discount types for promotional campaigns
    const discountTypes = [
        { value: "none", label: "No Discount" },
        { value: "promo", label: "Promotional Discount" },
        { value: "seasonal", label: "Seasonal Sale" },
        { value: "clearance", label: "Clearance Sale" },
        { value: "black-friday", label: "Black Friday Deal" },
        { value: "cyber-monday", label: "Cyber Monday" },
        { value: "new-year", label: "New Year Sale" },
        { value: "valentine", label: "Valentine's Day Special" },
        { value: "mother-day", label: "Mother's Day Offer" },
        { value: "father-day", label: "Father's Day Deal" },
        { value: "christmas", label: "Christmas Sale" },
        { value: "easter", label: "Easter Special" },
        { value: "summer", label: "Summer Sale" },
        { value: "winter", label: "Winter Clearance" },
        { value: "spring", label: "Spring Collection" },
        { value: "fall", label: "Fall Special" },
        { value: "bulk", label: "Bulk Purchase Discount" },
        { value: "loyalty", label: "Loyalty Customer Discount" },
        { value: "first-time", label: "First Time Buyer" },
        { value: "student", label: "Student Discount" },
        { value: "senior", label: "Senior Citizen Discount" },
        { value: "military", label: "Military Discount" },
        { value: "employee", label: "Employee Discount" },
        { value: "flash-sale", label: "Flash Sale" },
        { value: "weekend", label: "Weekend Special" },
        { value: "birthday", label: "Birthday Month Discount" },
        { value: "anniversary", label: "Store Anniversary" },
        { value: "grand-opening", label: "Grand Opening" },
        { value: "liquidation", label: "Liquidation Sale" },
        { value: "end-of-season", label: "End of Season" }
    ];



    const handleImageChange = (info) => {
        if (info.file.status === 'uploading') {
            setUploadProgress(info.file.percent || 0);
        }

        if (info.file.status === 'done' || info.file.originFileObj) {
            const file = info.file.originFileObj || info.file;
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            toast.error('You can only upload JPG/PNG files!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            toast.error('Image must be smaller than 2MB!');
            return false;
        }
        return false; // Prevent auto upload
    };

    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            // Check if values object exists
            if (!values) {
                toast.error('Form validation failed - no data received');
                setLoading(false);
                return;
            }

            // Check if product name is provided
            if (!values.product_name || values.product_name.trim() === '') {
                toast.error('Please enter a product name');
                setLoading(false);
                return;
            }

            // Validate required fields
            if (!values.product_category) {
                toast.error('Please select a product category');
                setLoading(false);
                return;
            }

            if (!values.product_tag) {
                toast.error('Please select a product tag');
                setLoading(false);
                return;
            }

            const formData = new FormData();

            // Append form values
            formData.append("product_name", values.product_name || "");
            formData.append("product_price", parseInt(values.product_price) || 0);
            formData.append("product_description", values.product_description || "");
            formData.append("product_quantity", values.product_quantity || 0);
            formData.append("product_category", values.product_category || "");
            formData.append("product_tag", values.product_tag || "");
            formData.append("discount_percentage", values.discount_percentage || 0);
            formData.append("discount_type", values.discount_type || "none");

            // Add image if exists
            if (values.product_image?.fileList?.length > 0) {
                values.product_image = values.product_image.fileList[0].originFileObj;
            }

            const res = await apiService.createProduct(values, (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(progress);
            });

            toast.success(res.data.message || 'Product added successfully!');
            form.resetFields();
            setImagePreview(null);
            setUploadProgress(0);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };
    // Fetch all products
    const fetchProducts = async () => {
        console.log('Fetching products...');
        setProductsLoading(true);
        try {
            const response = await apiService.getAllProducts();
            console.log('Products response:', response);
            console.log('Products data:', response.data);
            const productsData = response.data.message || response.data || [];
            console.log('Setting products:', productsData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products: ' + (error.response?.data?.message || error.message));
        } finally {
            setProductsLoading(false);
        }
    };

    // Load products when component mounts or when switching to manage tab
    useEffect(() => {
        console.log('useEffect triggered, activeTab:', activeTab);
        if (activeTab === 'manage') {
            fetchProducts();
        }
    }, [activeTab]);

    // Also fetch products on component mount
    useEffect(() => {
        console.log('Component mounted, fetching products...');
        fetchProducts();
    }, []);

    // Handle edit product
    const handleEditProduct = (product) => {
        console.log('Editing product:', product);
        setEditingProduct(product);
        form.setFieldsValue({
            product_name: product.product_name,
            product_description: product.product_description,
            product_price: product.product_price,
            product_quantity: product.product_quantity
        });
        setIsEditModalVisible(true);
    };

    // Handle update product
    const handleUpdateProduct = async (values) => {
        setLoading(true);
        try {
            // Only send fields that backend supports
            const updateData = {
                product_name: values.product_name,
                product_price: values.product_price,
                product_description: values.product_description,
                product_quantity: values.product_quantity
            };

            console.log('Updating product with data:', updateData);
            const response = await apiService.updateProduct(editingProduct.product_id, updateData);
            toast.success(response.data.message || 'Product updated successfully!');
            setIsEditModalVisible(false);
            setEditingProduct(null);
            form.resetFields();
            setImagePreview(null);
            fetchProducts(); // Refresh the products list
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete product
    const handleDeleteProduct = async (productId) => {
        try {
            console.log('Deleting product with ID:', productId);
            await apiService.deleteProduct(productId);
            toast.success('Product deleted successfully!');
            fetchProducts(); // Refresh the products list
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setIsEditModalVisible(false);
        setEditingProduct(null);
        form.resetFields();
        setImagePreview(null);
    };





    return (
        <DashboardLayout>
            <style jsx global>{`
                .ant-select {
                    width: 100% !important;
                }
                .ant-select-selector {
                    min-height: 40px !important;
                }
            `}</style>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                        <p className="text-gray-600">Add new products and manage existing inventory</p>
                    </div>
                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={fetchProducts}
                            loading={productsLoading}
                        >
                            Refresh Products
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                console.log('Manual fetch triggered');
                                fetchProducts();
                            }}
                        >
                            Test Fetch
                        </Button>
                    </Space>
                </div>

                {/* Tabs for Add and Manage Products */}
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                >
                    <Tabs.TabPane
                        tab={
                            <span>
                                <PlusOutlined />
                                Add Product
                            </span>
                        }
                        key="add"
                    >
                        <div className="space-y-6">





                                    {/* Progress Indicator */}
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                        <Card className="border-0 shadow-sm">
                                            <Progress percent={uploadProgress} status="active" />
                                            <p className="text-center mt-2 text-sm text-gray-600">Uploading product...</p>
                                        </Card>
                                    )}

                                    {/* Product Form */}
                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={handleSubmit}
                    onFinishFailed={(errorInfo) => {
                        const firstError = errorInfo.errorFields[0];
                        if (firstError) {
                            toast.error(`${firstError.name[0]}: ${firstError.errors[0]}`);
                        }
                    }}
                    className="space-y-6"
                >
                    <Row gutter={[24, 24]}>
                        {/* Left Column - Main Information */}
                        <Col xs={24} lg={16}>
                            {/* General Information */}
                            <Card title="General Information" className="mb-6 border-0 shadow-sm">
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="product_name"
                                            label="Product Name"
                                            rules={[{ required: true, message: 'Please enter product name' }]}
                                        >
                                            <Input
                                                placeholder="Enter product name (e.g., Diamond Engagement Ring)"
                                                size="large"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="product_description"
                                            label="Description"
                                            rules={[{ required: true, message: 'Please enter product description' }]}
                                        >
                                            <Input.TextArea
                                                rows={4}
                                                placeholder="Describe your product in detail..."
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>

                            {/* Pricing */}
                            <Card title="Pricing" className="mb-6 border-0 shadow-sm">
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="product_price"
                                            label="Base Price (₦)"
                                            rules={[{ required: true, message: 'Please enter product price' }]}
                                        >
                                            <InputNumber
                                                placeholder="0.00"
                                                size="large"
                                                className="w-full"
                                                min={0}
                                                formatter={value => `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(/₦\s?|(,*)/g, '')}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="product_quantity"
                                            label="Quantity"
                                            rules={[{ required: true, message: 'Please enter quantity' }]}
                                        >
                                            <InputNumber
                                                placeholder="0"
                                                size="large"
                                                className="w-full"
                                                min={0}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="discount_percentage"
                                            label="Discount Percentage (%)"
                                        >
                                            <InputNumber
                                                placeholder="0"
                                                size="large"
                                                className="w-full"
                                                min={0}
                                                max={100}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="discount_type"
                                            label="Discount Type"
                                        >
                                            <CustomSelect
                                                placeholder="Select discount type..."
                                                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                                options={discountTypes}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        {/* Right Column - Media & Categories */}
                        <Col xs={24} lg={8}>
                            {/* Product Media */}
                            <Card title="Product Media" className="mb-6 border-0 shadow-sm">
                                <Form.Item
                                    name="product_image"
                                    label="Product Image"
                                    rules={[{ required: true, message: 'Please upload product image' }]}
                                >
                                    <Upload
                                        listType="picture-card"
                                        beforeUpload={beforeUpload}
                                        onChange={handleImageChange}
                                        maxCount={1}
                                        className="w-full"
                                    >
                                        <div className="flex flex-col items-center">
                                            <MdCloudUpload className="text-2xl text-gray-400 mb-2" />
                                            <span>Upload Image</span>
                                        </div>
                                    </Upload>
                                </Form.Item>

                                {imagePreview && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-lg border"
                                        />
                                    </div>
                                )}
                            </Card>

                            {/* Categories */}
                            <Card title="Categories" className="border-0 shadow-sm">
                                <Form.Item
                                    name="product_category"
                                    label="Product Category"
                                    rules={[{ required: true, message: 'Please select category' }]}
                                >
                                    <CustomSelect
                                        placeholder="Select category..."
                                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                        options={categories}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="product_tag"
                                    label="Product Tag"
                                    rules={[{ required: true, message: 'Please select tag' }]}
                                >
                                    <CustomSelect
                                        placeholder="Select tag..."
                                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                        options={tags}
                                    />
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>



                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <Button
                            size="large"
                            onClick={() => {
                                form.resetFields();
                                setImagePreview(null);
                                setUploadProgress(0);
                            }}
                        >
                            Reset Form
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            icon={<SaveOutlined />}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? 'Adding Product...' : 'Add Product'}
                        </Button>
                                    </div>
                                </Form>
                        </div>
                    </Tabs.TabPane>

                    <Tabs.TabPane
                        tab={
                            <span>
                                <EditOutlined />
                                Manage Products
                            </span>
                        }
                        key="manage"
                    >
                                <div className="space-y-6">
                                    {/* Debug Info */}
                                    <Card className="border-0 shadow-sm bg-gray-50">
                                        <div className="text-sm">
                                            <p><strong>Products Count:</strong> {products.length}</p>
                                            <p><strong>Loading:</strong> {productsLoading ? 'Yes' : 'No'}</p>
                                            <p><strong>Active Tab:</strong> {activeTab}</p>
                                            {products.length > 0 && (
                                                <details>
                                                    <summary><strong>First Product Data</strong></summary>
                                                    <pre className="mt-2 text-xs">{JSON.stringify(products[0], null, 2)}</pre>
                                                </details>
                                            )}
                                        </div>
                                    </Card>

                                    {/* Products Table */}
                                    <Card className="border-0 shadow-sm">
                                        <Table
                                            dataSource={products}
                                            loading={productsLoading}
                                            rowKey="product_id"
                                            columns={[
                                                {
                                                    title: 'ID',
                                                    dataIndex: 'product_id',
                                                    key: 'product_id',
                                                    width: 80
                                                },
                                                {
                                                    title: 'Name',
                                                    dataIndex: 'product_name',
                                                    key: 'product_name',
                                                    width: 200
                                                },
                                                {
                                                    title: 'Price',
                                                    dataIndex: 'product_price',
                                                    key: 'product_price',
                                                    width: 100,
                                                    render: (price) => `₦${price}`
                                                },
                                                {
                                                    title: 'Stock',
                                                    dataIndex: 'product_quantity',
                                                    key: 'product_quantity',
                                                    width: 80
                                                },
                                                {
                                                    title: 'Actions',
                                                    key: 'actions',
                                                    width: 150,
                                                    render: (_, record) => (
                                                        <Space>
                                                            <Button
                                                                type="primary"
                                                                size="small"
                                                                onClick={() => {
                                                                    console.log('Edit clicked for:', record);
                                                                    handleEditProduct(record);
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                type="primary"
                                                                danger
                                                                size="small"
                                                                onClick={() => {
                                                                    console.log('Delete clicked for:', record);
                                                                    if (window.confirm('Are you sure?')) {
                                                                        handleDeleteProduct(record.product_id);
                                                                    }
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </Space>
                                                    )
                                                }
                                            ]}
                                            pagination={{
                                                pageSize: 10,
                                                showSizeChanger: true,
                                                showQuickJumper: true,
                                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`
                                            }}
                                        />
                                    </Card>
                        </div>
                    </Tabs.TabPane>
                </Tabs>

                {/* Edit Product Modal */}
                <Modal
                    title="Edit Product"
                    open={isEditModalVisible}
                    onCancel={handleCancelEdit}
                    footer={null}
                    width={800}
                    destroyOnClose
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdateProduct}
                        className="space-y-4"
                    >
                        <Form.Item
                            label="Product Name"
                            name="product_name"
                            rules={[{ required: true, message: 'Please enter product name' }]}
                        >
                            <Input placeholder="Enter product name" />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="product_description"
                            rules={[{ required: true, message: 'Please enter product description' }]}
                        >
                            <Input.TextArea rows={3} placeholder="Enter product description" />
                        </Form.Item>

                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Price (₦)"
                                    name="product_price"
                                    rules={[{ required: true, message: 'Please enter price' }]}
                                >
                                    <InputNumber
                                        min={0}
                                        step={0.01}
                                        placeholder="0.00"
                                        className="w-full"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Quantity"
                                    name="product_quantity"
                                    rules={[{ required: true, message: 'Please enter quantity' }]}
                                >
                                    <InputNumber
                                        min={0}
                                        placeholder="0"
                                        className="w-full"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button onClick={handleCancelEdit}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<SaveOutlined />}
                            >
                                Update Product
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </DashboardLayout>
    )
}

export default Addproductpage