import { Table } from "antd";
import React from 'react'
import DashboardLayout from "../components/layout";

const Orderpage = () => {

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
            title:"Quantity",
            dataIndex:"quantity",
            key:"quantity"
        },
        {
            title:"Delivery Status",
            dataIndex:"delivery_status",
            key:"delivery_status"
        },
        {
            title:"Delivery Address",
            dataIndex:"delivery_address",
            key:"delivery_address"
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
            customername:"orange tech",
            product_name:"Ring",
            quantity:"10gram",
            delivery_status:"pending",
            delivery_address:"no 24 ajelekoko",
            action: <button>View</button>

        },
        {
            no:2,
            key:2,
            customername:"yusuf sodiq",
            product_name:"Necklace",
            quantity:"20gram",
            delivery_status:"delivered",
            delivery_address:"no 24 ajelekoko",
            action: <button>View</button>


        }
    ]

  return (
    <DashboardLayout>
         <Table dataSource={dataSource} columns={columns} />
    </DashboardLayout>
  )
}

export default Orderpage