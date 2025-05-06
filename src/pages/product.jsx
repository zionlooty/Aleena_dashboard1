import { Table } from "antd";
import DashboardLayout from "../components/layout";





const  Productspage = () => {

    const columns = [
        {
            title:"S/NO",
            dataIndex:"no",
            key:"no"
        },
        {
            title:"Product Name",
            dataIndex:"product_name",
            key:"product_name"
        },
        {
            title:"Product Price",
            dataIndex:"product_price",
            key:"productprice"
        },
        {
            title:"Product Description",
            dataIndex:"product_description",
            key:"product_description"
        },
        {
            title:"Product Quantity",
            dataIndex:"product_quantity",
            key:"product_quantity"
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
            product_name:"Ring",
            product_price:100000,
            product_description:"iiiiii",
            product_quantity:"10gram",
            action: <button>View</button>

        },
        {
            no:2,
            key:2,
            product_name:"Necklace",
            product_price:1000000,
            product_description:"demure",
            product_quantity:"20gram",
            action: <button>View</button>

        }
    ]

  return (
    <DashboardLayout>
        <Table dataSource={dataSource} columns={columns} />
    </DashboardLayout>
  )
}

export default Productspage