import { Table } from "antd";
import DashboardLayout from '../components/layout'

const Adspage = () => {
    const columns = [
        {
            title:"S/NO",
            dataIndex:"no",
            key:"no"
        },
        {
            title:"Title",
            dataIndex:"title",
            key:"title"
        },
        {
            title:"Description",
            dataIndex:"description",
            key:"decription"
        },
        {
            title:"Image",
            dataIndex:"image",
            key:"image"
        },
        {
            title:"Date",
            dataIndex:"date",
            key:"date"
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
            title:"",
            description:"",
            image:"",
            date:"",
            action: <button>View</button>

        },
        {
            no:2,
            key:2,
            title:"",
            description:"",
            image:"",
            date:"",
            action: <button>View</button>

        }
    ]



  return (
   <DashboardLayout>
    <Table dataSource={dataSource} columns={columns} />
   </DashboardLayout>
  )
}

export default Adspage