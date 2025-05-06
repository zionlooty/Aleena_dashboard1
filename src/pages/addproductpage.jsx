import React, { useState } from 'react'
import DashboardLayout from '../components/layout'
import { toast } from 'sonner'
import { Input, Select } from 'antd'
import axios from "axios"


const Addproductpage = () => {


    const [previewUrl, setpreviewUrl] = useState("")
    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        percentage: "",
        discount: "",
        quantity: "",
        image: "",
        category: "",
        tag: ""
    })

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value })
    }


    function getImagePreview(e) {
        const file = e.target.files[0]
        const fileType = file.name.split(".").pop()
        if (file.size > 400000) {
            toast.error("file too large")
        } else if (fileType !== "jpeg" && fileType !== "png" && fileType !== "jpg") {
            toast.error("file not supported")
        } else {
            setpreviewUrl(file)
        }
    }


    const addNewProduct = async (e) => {
        e.preventDefault()
        try {

            const formData = new FormData()

            formData.append("product_name", product.name)
            formData.append("product_price", parseInt(product.price))
            formData.append("product_description", product.description)
            formData.append("product_quantity", product.quantity)
            formData.append("product_image", previewUrl)
            formData.append("discount_percentage", product.percentage)
            formData.append("discount_type", product.discount)
            formData.append("product_category", product.category)
            formData.append("product_tag", product.tag)
            

            const res = await axios.post("http://localhost:5000/new/product", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            toast.success(res.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
           
        }
    }





    return (
        <DashboardLayout>
            {/* <div className='p-2'>

                <div className='w-{100%} h-[80px] flex items-center rounded-md shadow-xl justify-between border-gray-200 px-5 bg-white mb-5'>
                    <h1 className='font-semibold text-2xl'>Add Product</h1>
                    <div className='flex gap-2'>
                        <button className='border px-2 py-2 rounded-md border-red-500 text-red-500 cursor-pointer'>Discard Changes</button>
                        <button className='border px-3 py-2 rounded-md bg-blue-700 text-white cursor-pointer'>Add Product</button>
                    </div>
                </div>
            </div> */}



            <form className='gridsection' onSubmit={addNewProduct}>
                <main className='flex justify-center items-center p-2'>

                    <div>

                        <div className='w-[700px] h-full bg-white px-5 py-3 rounded-md shadow- mb-5 '>
                            <h1 className='font-bold mb-2 text-2xl'>General information</h1>
                            <div>


                                <div className='flex flex-col gap-2 mb-4'>
                                    <h2 className='text-gray-500'>Product Name</h2>
                                    <input placeholder='Enter Product Name' className='w-full p-2 border  border-gray-500 rounded-md bg-blue-200  outline-none text-black' onChange={handleChange} name='name' />

                                </div>

                                <div className='flex flex-col gap-2 mb-4'>
                                    <h2 className='text-gray-500'>Description</h2>
                                    <textarea id="message" placeholder='Type Your Message' className='w-full h-32 p-2 border rounded-md bg-blue-200 text-black outline-none' onChange={handleChange} name='description'></textarea>

                                </div>

                            </div>
                        </div>

                        <div className='w-[700px] h-full bg-white px-5 py-3 mb-5 rounded-md shadow  '>
                            <h1 className='font-bold mb-2 text-2xl'>Pricing</h1>
                            <div>


                                <div className='flex flex-col gap-2 mb-4'>
                                    <h2 className='text-gray-500'>Base Price</h2>
                                    <input type="text" placeholder='Enter Product Price' className='w-full p-2 border  border-gray-500 rounded-md bg-blue-200  outline-none text-black' onChange={handleChange} name='price' />

                                </div>
                                <div className='flex gap-4'>


                                    <div className='flex flex-col gap-2 mb-4'>
                                        <h2 className='text-gray-500'>Discount Percentage(%)</h2>
                                        <Input type="text" className='w-[300px] p-2 border rounded-md  text-black outline-none' onChange={handleChange} name='discount' />
                                    </div>
                                    <div className='flex flex-col gap-2 mb-4'>
                                        <h2 className='text-gray-500'>Discount Type</h2>
                                        <Select name="category" id="category" placeholder='Select a discount type' className='w-[300px] p-2 border rounded-md bg-blue-200 text-black outline-none'
                                            onChange={(value) => { setProduct({ ...product, discount_type: value }) }}
                                            options={[
                                                { value: "promo", label: "promo" },
                                                { value: "black friday", label: "black friday" }
                                            ]}
                                        >

                                        </Select>
                                    </div>

                                </div>

                            </div>
                        </div>
                        <div className='w-[700px] h-full bg-white px-5 py-3 rounded-md shadow  '>
                            <h1 className='font-bold mb-2 text-2xl'>Inventory</h1>
                            <div>


                                <div className='flex flex-col gap-2 mb-4'>
                                    <h2 className='text-gray-500'>Quantity</h2>
                                    <input placeholder='Type product quantity' className='w-full p-2 border  border-gray-500 rounded-md bg-blue-200  outline-none text-black' onChange={handleChange} name='quantity' />
                                </div>


                            </div>
                        </div>

                    </div>



                </main>
                <article>
                    <div>


                        <div className='w[500px] h-[300px] px-3 py-2 shadow mb-5 '>
                            <h1 className='text-2xl font-semibold mb-3'>Product Media</h1>
                            <h2>Photo Product</h2>

                            {
                                previewUrl ?
                                    <div className="flex flex-col justify-center items-center w-[100px] h-[100px] gap-3 cursor-pointer overflow-hidden">

                                        <img src={URL.createObjectURL(previewUrl)} alt="" />

                                    </div>
                                    :

                                    <div className="flex items-center flex-col gap-2">

                                        <label htmlFor="file" className="flex flex-col border-2 border-dashed justify-center items-center w-full h-[170px] gap-3 cursor-pointer bg-slate-300  ">
                                            <span>upload Image</span>

                                        </label>
                                        <input type="file" id="file" className="hidden" onChange={getImagePreview} />
                                    </div>
                            }

                        </div>
                        <div className='w[500px] h-[300px] px-3 py-2 shadow '>
                            <h1 className='text-2xl font-semibold mb-3'>Categories</h1>

                            <div className='flex flex-col gap-2 mb-4'>
                                <h2 className='text-gray-500'>Product Category</h2>
                                <Select name="category" id="category"  className='w-[300px] p-2 border rounded-md bg-blue-200 text-black outline-none' onChange={(value) => { setProduct({ ...product, category: value }) }}
                                    options={[
                                        { value: "jewelries", label: "jewelries" },
                                        { value: "clothes", label: "clothes" },
                                        // {value:"fashion", lablel:"fashion"},
                                    ]}
                                ></Select>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <h2 className='text-gray-500'>Product Tag</h2>
                                <Select name="Product Tag" id="Product Tag"  className='w-[300px] p-2 border rounded-md bg-blue-200 text-black outline-none'
                                    onChange={(value) => { setProduct({ ...product, tag: value }) }}
                                    options={[
                                        { value: "earing", lablel: "earing" },
                                        { value: "necklace", lablel: "necklace" },
                                        { value: "ring", lablel: "ring" },
                                        { value: "bracelet", lablel: "bracelet" },
                                    ]}   ></Select>
                            </div>

                        </div>
                    </div>
                </article>
                <div className='mt-5 flex items-center justify-center'>

                <input type="submit" value="Add new product" className='w-[200px] py-2 px-5 bg-blue-500 text-white rounded-md cursor-pointer' />
                </div>
            </form>


        </DashboardLayout>

    )
}

export default Addproductpage