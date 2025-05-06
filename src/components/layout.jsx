import React from 'react'
import { Link } from 'react-router-dom'
import { MdDashboard } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { FaProductHunt } from "react-icons/fa6";
import { MdReceipt } from "react-icons/md";
import { MdReplay } from "react-icons/md";
import { MdLocalOffer } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import { FcAdvertising } from "react-icons/fc"






const DashboardLayout = ({children}) => {
  return (
    <section className='flex min-h-screen'>
        <aside className='w-[200px] h-screen overflow-y-scroll p-5'>
            <div>
                <h1></h1>
            </div>

            <div className='flex flex-col gap-4'>
                <Link to={""} className='flex items-center gap-4'><MdDashboard /><span>Dashboard</span></Link>
                <Link to={"/users"} className='flex items-center gap-4'><BsPeopleFill /><span>Users</span></Link>
                <Link to={"/product"} className='flex items-center gap-4'><FaProductHunt /><span>Products</span></Link>
                <Link to={"/addproduct"} className='flex items-center gap-4'><FaProductHunt /><span>Add Products</span></Link>
                <Link to={"/order"} className='flex items-center gap-4'><MdReceipt /><span>Orders</span></Link>
                <Link to={"/refund"} className='flex items-center gap-4'><MdReplay /><span>Refunds</span></Link>
                <Link to={""} className='flex items-center gap-4'><MdLocalOffer /><span>Promo</span></Link>
                <Link to={"/admin"} className='flex items-center gap-4'><MdAdminPanelSettings /><span>Admin</span></Link>
                <Link to={"/ads"} className='flex items-center gap-4'><FcAdvertising /> <span>Ads</span></Link>
            </div>
        </aside>
        <main className='flex-1'>
            {/* <nav></nav> */}
            <div className='h-[90vh] overflow-y-scroll p-5'>
             {children}
            </div>
        </main>
    </section>
  )
}

export default DashboardLayout