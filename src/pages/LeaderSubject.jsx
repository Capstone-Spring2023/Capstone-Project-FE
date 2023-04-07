import React, { useEffect, useState, useRef } from "react";
import useTable from "../hooks/useTable";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Header, ModalAnt4 } from "../components";
import avatar from "../assets/banner.jpg";
import TableFooter from "../components/Table/TableFooter";
import { BASE_URL_API } from "../utils/constants";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, Empty, Tooltip } from "antd";
import { Select, Space } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { Table, Input } from 'antd';
import { Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Column } = Table;
const LeaderSubject = () => {
    const [page, setPage] = useState(1);
    const [examAvailableSubjectData, setAvailableSubjectData] = useState([{}]);
    const { slice, range } = useTable(examAvailableSubjectData, page, 5);
    const navigate = useNavigate();
    const [subject, setSubject] = useState([{}]);

    useEffect(() => {
        fetchSubject();
        // fetchTable2();
    }, []);

    const handleSubjectSelect = (value) => {
        fetchTable(value);
        const filteredData = examAvailableSubjectData.filter(
            (item) => item.subjectName.toLowerCase().indexOf(value.toLowerCase()) >= 0
        );
        // Cập nhật lại state để hiển thị dữ liệu đã lọc trên bảng
        setAvailableSubjectData(filteredData);
    };

    const fetchSubject = () => {
        fetch(`${BASE_URL_API}/leader/${sessionStorage.getItem("userId")}/available-subject`)
            .then((res) => {
                return res.json();
            })
            .then((resp) => {
                setSubject(resp.data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const fetchTable = (availableSubjectId) => {
        fetch(
            `${BASE_URL_API}/header/GetLecturersHaveRegisterSubjectByAvailableSubjectId/${availableSubjectId}`
        )
            .then((res) => {
                return res.json();
            })
            .then((resp) => {
                setAvailableSubjectData(resp.data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const fetchTable2 = () => {
        fetch(`${BASE_URL_API}/header/GetLecturersHaveRegisterSubjectByAvailableSubjectId/25`)
            .then((res) => {
                return res.json();
            })
            .then((resp) => {
                setAvailableSubjectData(resp.data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    //test
    const [data, setData] = useState(examAvailableSubjectData);
    const [filters, setFilters] = useState([]);

    const customizeRenderEmpty = () => (
        <div
            style={{
                textAlign: "center",
            }}
        >
            <SmileOutlined
                style={{
                    fontSize: 20,
                }}
            />
            <p>Data Not Found</p>
        </div>
    );
    const style = {
        width: 200,
    };

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <div>
                <Toaster />
            </div>
            <div className="flex justify-between items-center">
                <Header category="App" title="Available Subject" />
            </div>
            <div className="flex justify-center items-center">
                <ConfigProvider renderEmpty={customizeRenderEmpty}>
                    Choose subject :
                    <Select
                        showSearch
                        style={style}
                        placeholder="Select subjects"
                        onSelect={handleSubjectSelect}
                        optionLabelProp="label"
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        optionFilterProp="label"
                    >
                        {subject?.map((item, index) => (
                            <Option
                                key={index}
                                value={`${item?.availableSubjectId}`}
                                label={`${item?.subjectName}`}
                            >
                                <Space>{item?.subjectName}</Space>
                            </Option>
                        ))}
                    </Select>
                </ConfigProvider>
            </div>
            {slice.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                    <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                                    Basic Info
                                </th>
                                <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                                    Full Name
                                </th>
                                <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                                    Semester
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                            {slice.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="flex gap-3 px-3 py-3 font-normal text-gray-900 items-center">
                                        <div className="relative h-10 w-10">
                                            <img
                                                className="h-full w-full rounded-full object-cover object-center"
                                                src={avatar}
                                                alt=""
                                            />
                                            <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-700">
                                                Subject: {item.subjectName}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">{item.fullName}</td>
                                    <td className="px-3 py-3">{item.semester}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-4 content-center items-center">
                                            <Tooltip title="Info">
                                                <ConfigProvider
                                                    theme={{
                                                        token: {
                                                            colorPrimary: "#ea1c1c",
                                                        },
                                                    }}
                                                >
                                                    <StyleProvider hashPriority="high">
                                                        <ModalAnt4
                                                            subjectName={item.subjectName}
                                                            fullName={item.fullName}
                                                            semester={item.semester}
                                                            title="Lecturer detail"
                                                        />
                                                    </StyleProvider>
                                                </ConfigProvider>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <Empty />
            )}
            <TableFooter
                total={examAvailableSubjectData}
                range={range}
                slice={slice}
                setPage={setPage}
                page={page}
            />
        </div>
    );
};
// const LeaderSubject = () => {
//     const [examAvailableSubjectData, setAvailableSubjectData] = useState([]);
//     const [ setSubject] = useState([]);
//     const [page, setPage] = useState(1);
//         const { slice, range } = useTable(examAvailableSubjectData, page, 5);
//         const navigate = useNavigate();
//         const [isLoading, setIsLoading] = useState(false);
//         const [selectedSubjectId, setSelectedSubjectId] = useState(null);

//         const handleTableChange = (pagination) => {
//           setPage(pagination.current);
//         };

//         const fetchTable = () => {
//           setIsLoading(true);
//           fetch(
//             `${BASE_URL_API}/header/GetLecturersHaveRegisterSubjectByAvailableSubjectId/${selectedSubjectId}`
//           )
//             .then((res) => res.json())
//             .then((resp) => {
//               setAvailableSubjectData(resp.data);
//               setIsLoading(false);
//             })
//             .catch((err) => {
//               console.log(err.message);
//               setIsLoading(false);
//             });
//         };

//         const fetchSubject = () => {
//           fetch(
//             `${BASE_URL_API}/leader/${sessionStorage.getItem(
//               "userId"
//             )}/available-subject`
//           )
//             .then((res) => res.json())
//             .then((resp) => {
//               setSubject(resp.data);
//             })
//             .catch((err) => {
//               console.log(err.message);
//             });
//         };

//         const handleFilterClick = () => {
//           if (selectedSubjectId) {
//             fetchTable();
//           } else {
//             fetchSubject();
//           }
//         };

//         const handleSubjectSelect = (value) => {
//           setSelectedSubjectId(value);
//         };

//         const { subject } = props;
//     return (
//         <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
//             <div>
//                 <Toaster />
//             </div>
//             <div className="flex justify-between items-center">
//                 <Header category="App" title="Available Subject" />
//             </div>
//             <Table
//                 dataSource={examAvailableSubjectData}
//                 pagination={{ pageSize: 5, current: page, onChange: setPage }}
//                 rowKey="id"
//                 onChange={handleSubjectClick}
//                 footer={() => (
//                     <TableFooter
//                         total={examAvailableSubjectData}
//                         range={range}
//                         slice={slice}
//                         setPage={setPage}
//                         page={page}
//                     />
//                 )}
//             >
//                 <Column
//   title="Full Name"
//   dataIndex="fullName"
//   key="fullName"
//   filterDropdown={(props) => (
//     <div style={{ padding: 8 }}>
//       <Input
//         placeholder="Search name"
//         value={props.selectedKeys[0]}
//         onChange={(e) => props.setSelectedKeys(e.target.value ? [e.target.value] : [])}
//         onPressEnter={() => props.confirm()}
//         style={{ width: 188, marginBottom: 8, display: "block" }}
//       />
//       <Button
//         type="primary"
//         onClick={() => props.confirm()}
//         icon={<SearchOutlined />}
//         size="small"
//         style={{ width: 90, marginRight: 8 }}
//       >
//         Search
//       </Button>
//       <Button onClick={() => props.clearFilters()} size="small" style={{ width: 90 }}>
//         Reset
//       </Button>
//     </div>
//   )}
//   filterIcon={(filtered) => (
//     <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
//   )}
// />

//                 <Column title="Full Name" dataIndex="fullName" key="fullName" />
//                 <Column title="Semester" dataIndex="semester" key="semester" />
//                 <Column
//                     title="Action"
//                     key="action"
//                     render={(text, record) => (
//                         <Space size="middle">
//                             <ModalAnt4
//                                 subjectName={record.subjectName}
//                                 fullName={record.fullName}
//                                 semester={record.semester}
//                                 title="Lecturer detail"
//                             />
//                         </Space>
//                     )}
//                 />
//             </Table>

//             <TableFooter
//                 total={examAvailableSubjectData}
//                 range={range}
//                 slice={slice}
//                 setPage={setPage}
//                 page={page}
//             />
//         </div>
//     );

// }
export default LeaderSubject;
