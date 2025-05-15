import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/layout'
import axios from 'axios'
import { API_URL } from './addproductpage'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { IMAGE_URL } from './product'
import { Button, Input, Modal, Select } from 'antd'
import { MdOutlineDoorbell } from 'react-icons/md'
import { IoIosHeart, IoLogoFacebook } from 'react-icons/io'
import { FaPinterestP, FaShareFromSquare, FaTwitter } from 'react-icons/fa6'
import { AiOutlineGooglePlus } from 'react-icons/ai'
import { CiStar } from 'react-icons/ci'


const ViewPage = () => {

    const { prodID } = useParams()
    const [product, setProduct] = useState([])
    const navigate = useNavigate()
    // const [discount, setDiscount] = useState(0)

    const getSingProduct = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/product/${prodID}`)
            setProduct(data.message)
            // console.log((parseInt(data.message.discount_percentage) / parseInt(data.message.product_price)) * 100)
            // setDiscount((parseInt(data.message.discount_percentage) / parseInt(data.message.product_price)) * 100)
        } catch (error) {
            console.log(error)
            navigate("/product")
        }
    }

    useEffect(() => {
        getSingProduct()
    }, [])



    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    const handleChange = () => {

    }
    return (
        <DashboardLayout>
            <section className='flex min-h-screen flex-wrap justify-around items-center'>

                <div >
                    <img src={`${IMAGE_URL}/${product.product_image}`} className='md:w-[400px]' />
                </div>
                <main className="flex flex-col min-h-[100vh]flex-wrap">
          <h1 className="text-2xl font-semibold mt-4">{product.product_name}</h1>
          <div className="flex items-center text-orange-400 mt-1">
            <Link to={'/'}><CiStar /></Link>
            <Link to={'/'}><CiStar /></Link>
            <Link to={'/'}><CiStar /></Link>
            <Link to={'/'}><CiStar /></Link>
            <Link to={'/'}><CiStar /></Link>
            <h2 className="text-black">NO REVIEWS</h2>
          </div>
          <div className="flex gap-2 mb-5">
            <h1 className="text-2xl text-orange-300">&#8358;{Intl.NumberFormat().format(product.product_price)}</h1>
            <h1 className="text-2xl text-gray-300 line-through">RS. 26000</h1>
          </div>
          <p className="text-2xl mb-5">{product.product_description}</p>


          <div className="mb-8 flex gap-2">
            <div className="flex items-center bg-black text-white justify-center gap-2 w-50 py-3 px-6 border">
              <Link to={'/'}><MdOutlineDoorbell /></Link>
              <button>BUY NOW</button>
            </div>
            <div className="w-15  border-[1.5px] border-black border-solid text-center items-center flex justify-center  p-3">
              <Link to={'/'}><IoIosHeart /></Link>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-20 border-gray-300 border flex items-center p-1">
              <Link to={'/'}><IoLogoFacebook className="text-blue-500" /></Link>
              <button>Share</button>
            </div>
            <div className="w-20 border-gray-300 border flex items-center p-1">
              <Link to={'/'}><FaTwitter className="text-blue-500" /></Link>
              <button>Tweet</button>
            </div>
            <div className="w-20 border-gray-300 border flex items-center p-1">
              <Link to={'/'}><FaPinterestP className="text-red-600" /></Link>
              <button>pin it</button>
            </div>
            <div className="w-20 border-gray-300 border flex items-center p-1">
              <Link to={'/'}><FaShareFromSquare className="text-blue-500" /></Link>
              <button>Fancy</button>
            </div>
            <div className="w-20 border-gray-300 border flex items-center p-1">
              <Link to={'/'}><AiOutlineGooglePlus className="text-red-500" /></Link>
              <button className="cursor-pointer">+1</button>
            </div>
          </div>


        </main>

            </section>




        </DashboardLayout>
    )
}

export default ViewPage