import { Avatar, Table } from "antd";
import DashboardLayout from "../components/layout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
// import { API_URL } from "./addproductpage";
import SummaryCard from "../components/summarycard";
import { MdDelete } from "react-icons/md";

import { BsFillBasketFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { API_URL } from "./addproductpage";

export const IMAGE_URL = import.meta.env.VITE_FILE_URL


const Productspage = () => {

    const [product, setProduct] = useState([])

    const fetchAllProduct = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/all/product`)
            console.log(data)
            setProduct(data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const columns = [
        {
            title: "S/NO",
            dataIndex: "no",
            key: "no"
        },
        {
            title: "Product Image",
            dataIndex: "image",
            key: "image"
        },
        {
            title: "Product Name",
            dataIndex: "product_name",
            key: "product_name"
        },
        {
            title: "Product Price",
            dataIndex: "product_price",
            key: "productprice"
        },
        {
            title: "Product Description",
            dataIndex: "product_description",
            key: "product_description"
        },
        {
            title: "Product Quantity",
            dataIndex: "product_quantity",
            key: "product_quantity"
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action"
        }
        
    ]



    useEffect(() => {
        fetchAllProduct()
    }, [])

    return (
        <DashboardLayout>


            <div className="my-5">
                <SummaryCard 
                    title={"Products"} 
                    subtitle={"Available Products"} 
                    count={product.length} 
                    icon={<BsFillBasketFill size={40}/>} 
                />
            </div>


            <Table dataSource={product.map((product, index) => (
                {
                    no: index + 1,
                    key: index,
                    product_name: product.product_name,
                    product_price: product.product_price,
                    product_description: product.product_description,
                    product_quantity: product.product_quantity,
                    image: <Avatar src={`${IMAGE_URL}/${product.product_image}`} /> ,

                    action:(
                        <div className="flex items-center gap-2">
                            <Link to={`/view/product/${product.product_id}`}>View </Link>
                            <Link to={`/delete/product/${product.product_id}`}><MdDelete className="text-red-500" /> </Link>
                        </div>
                        
                    ) 
                    
                }

            ))} columns={columns} />
        </DashboardLayout>
    )
}

export default Productspage