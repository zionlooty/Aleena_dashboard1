import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdDashboard, MdReceipt, MdReplay, MdLocalOffer, MdAdminPanelSettings, MdMenu, MdClose, MdLogout, MdNotifications, MdSearch } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { FaProductHunt, FaPlus } from "react-icons/fa6";
import { FcAdvertising } from "react-icons/fc"
import { Avatar, Badge, Dropdown } from 'antd';
import { toast } from 'sonner';






const DashboardLayout = ({children}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { path: "/", icon: MdDashboard, label: "Dashboard" },
    { path: "/users", icon: BsPeopleFill, label: "Users" },
    { path: "/product", icon: FaProductHunt, label: "Products" },
    { path: "/addproduct", icon: FaPlus, label: "Add Products" },
    { path: "/order", icon: MdReceipt, label: "Orders" },
    // { path: "/refund", icon: MdReplay, label: "Refunds" },
    // { path: "/promo", icon: MdLocalOffer, label: "Promo" },
    // { path: "/admin", icon: MdAdminPanelSettings, label: "Admin" },
    // { path: "/ads", icon: FcAdvertising, label: "Ads" },
  ];

  const isActiveRoute = (path) => {
    if (path === "") return location.pathname === "/";
    return location.pathname === path;
  };

  return (
    <section className='flex min-h-screen bg-gray-50'>
        {/* Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white shadow-lg border-r border-gray-200 h-screen overflow-y-auto`}>
            {/* Logo Section */}
            <div className='p-4 border-b border-gray-200'>
                <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                        <span className='text-white font-bold text-sm'>A</span>
                    </div>
                    {!sidebarCollapsed && (
                        <div>
                            <h1 className='text-lg font-bold text-gray-800'>Admin Panel</h1>
                            <p className='text-xs text-gray-500'>Jewelry Store</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className='p-4'>
                <div className='space-y-2'>
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = isActiveRoute(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <IconComponent className={`text-lg ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                                {!sidebarCollapsed && (
                                    <span className='font-medium text-sm'>{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </aside>

        {/* Main Content */}
        <main className='flex-1 flex flex-col'>
            {/* Top Navigation Bar */}
            <header className='bg-white shadow-sm border-b border-gray-200 px-6 py-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
                        >
                            {sidebarCollapsed ? <MdMenu className='text-xl' /> : <MdClose className='text-xl' />}
                        </button>

                        {/* Search Bar */}
                        <div className='relative'>
                            <MdSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                            <input
                                type="text"
                                placeholder="Search..."
                                className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64'
                            />
                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        {/* Notifications */}
                        <Badge count={5} size="small">
                            <button className='p-2 rounded-lg hover:bg-gray-100 transition-colors'>
                                <MdNotifications className='text-xl text-gray-600' />
                            </button>
                        </Badge>

                        {/* User Profile with Dropdown */}
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'profile',
                                        icon: <MdAdminPanelSettings />,
                                        label: 'Profile Settings',
                                    },
                                    {
                                        type: 'divider',
                                    },
                                    {
                                        key: 'logout',
                                        icon: <MdLogout />,
                                        label: 'Logout',
                                        onClick: handleLogout,
                                        className: 'text-red-600',
                                    },
                                ],
                            }}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <div className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                                <Avatar size={32} style={{ backgroundColor: '#1890ff' }}>
                                    A
                                </Avatar>
                                <div className='hidden md:block'>
                                    <p className='text-sm font-medium text-gray-900'>Admin User</p>
                                    <p className='text-xs text-gray-500'>admin@jewelry.com</p>
                                </div>
                            </div>
                        </Dropdown>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <div className='flex-1 overflow-y-auto p-6 bg-gray-50'>
                <div className='max-w-7xl mx-auto'>
                    {children}
                </div>
            </div>
        </main>
    </section>
  )
}

export default DashboardLayout