import { Table } from "antd";



import React from 'react'
import DashboardLayout from "../components/layout";

const Refundpage = () => {
    const columns = [
        {
            title:"S/NO",
            dataIndex:"no",
            key:"no"
        },
        {
            title:"Customer Name",
            dataIndex:"customername",
            key:"customername"
        },
        {
            title:"Product Name",
            dataIndex:"product_name",
            key:"product_name"
        },
        {
            title:"Amount Refund",
            dataIndex:"amountrefund",
            key:"amountrefund"
        },
        {
            title:"Reason For Refund",
            dataIndex:"reasonforrefund",
            key:"reasonforrefund"
        },
        {
            title:"Refund Status",
            dataIndex:"refundstatus",
            key:"refundstatus"
        },
        {
            title:"Refund  Date",
            dataIndex:"refunddate",
            key:"refunddate"
        },
        {
            title:"Action",
            dataIndex:"action",
            key:"action"
        }
    ]

    const dataSource = [
        {
            no:1,
            key:1,
            product_name:"",
            Amountrefund:"",
            reasonforrefund:"",
            refundstatus:"",
            refunddate:"",
            action: <button>View</button>

        },
        {
            no:2,
            key:2,
            product_name:"",
            Amountrefund:"",
            reasonforrefund:"",
            refundstatus:"",
            refunddate:"",
            action: <button>View</button>

        }
    ]
  return (
    <DashboardLayout>
        <Table dataSource={dataSource} columns={columns} />
    </DashboardLayout>
  )
}

export default Refundpage