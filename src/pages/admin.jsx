import { Table } from "antd";
import DashboardLayout from "../components/layout";






const Adminpage = () => {
    const columns = [
        {
            title:"S/NO",
            dataIndex:"no",
            key:"no"
        },
        {
            title:"Name",
            dataIndex:"name",
            key:"name"
        },
        {
            title:"Email",
            dataIndex:"email",
            key:"email"
        },
        {
            title:"Mobile NO.",
            dataIndex:"mobile",
            key:"mobile"
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
            name:"",
            email:"",
            mobile:"",
            action: <button>View</button>

        },
        {
            no:2,
            key:2,
            name:"",
            email:"",
            mobile:"",
            action: <button>View</button>

        }
    ]

  return (
    <DashboardLayout>
         <Table dataSource={dataSource} columns={columns} />
    </DashboardLayout>
  )
}

export default Adminpage