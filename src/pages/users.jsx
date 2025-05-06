import { Table } from "antd";
import DashboardLayout from "../components/layout";



const UserPage = () => {

    const columns = [
        {
            title: "S/NO",
            dataIndex: "no",
            key: "no"
        },
        {
            title: "Full Name",
            dataIndex: "fullname",
            key: "fullname"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: "Mobile NO.",
            dataIndex: "mobile",
            key: "mobile"
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action"
        },
    ]

    const dataSource = [
        {
            no: 1,
            key:1,
            fullname: "Orange Tech",
            email: "orange@gmail.com",
            mobile: "+2125235423534",
            action: <button>View</button>
        },
        {
            no: 2,
            key:2,
            fullname: "Yusuf Sodiq",
            email: "yusuf@gmail.com",
            mobile: "+9327382323223",
            action: <button>View</button>
        },
    ]

  return (
    <DashboardLayout>
        <Table dataSource={dataSource} columns={columns} />
    </DashboardLayout>
  )
}

export default UserPage