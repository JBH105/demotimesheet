import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Table, DatePicker } from 'antd';
import { addDoc, collection, doc, onSnapshot, getFirestore, updateDoc, deleteDoc } from 'firebase/firestore';
import { app } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Sidebar from "../../components/Common/Sidebar"
import Topbar from "../../components/Common/Topbar"
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const { Option } = Select;

function Employee() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  
  const db = getFirestore(app);

  const auth = getAuth(app);

   // This holds the information about dark mode/light mode
   const [mode, setMode] = useState();
   const [show, setShow] = useState(false);
   const [timesheetsOnly, setTimesheetsOnly] = useState(false);
   const [userTypeIdentified, setUserTypeIdentified] = useState(false);

   useEffect(() => {
     window
       .matchMedia('(prefers-color-scheme: dark)')
       .addEventListener('change', event => {
         const colorScheme = event.matches ? 'dark' : 'light';
         
         setMode(colorScheme);
       });
       const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            // User is not logged in, navigate to "/"
            navigate('/');
          }
          if(user?.email === import.meta.env.VITE_ADMIN){
              setShow(true)
          }else{
              setShow(false)
          }
          if(user?.email === import.meta.env.VITE_TIMESHEET_ONLY_USER){
            setTimesheetsOnly(true)
          }

          setUserTypeIdentified(true)
        });
  
      return () => {
        // Clean up the listener when component unmounts
        unsubscribe();
      };
  }, [navigate]);

  useEffect(() => {
    // Set up real-time listener for employees
    const unsubscribe = onSnapshot(collection(db, 'employees'), snapshot => {
      const employeesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeesData);
    });

    return () => {
      // Clean up the listener when component unmounts
      unsubscribe();
    };
  }, [db]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showEditModal = (employeeId) => {
    const employeeToEdit = employees.find(employee => employee.id === employeeId);
  
    // Convert birthday from Firestore date format to moment date format
    const formattedBirthday = moment(employeeToEdit.birthday,"YY-MM-DD");
  
    setEditEmployeeId(employeeId);
    form.setFieldsValue({
      ...employeeToEdit,
      birthday: formattedBirthday,
    });
    setIsEditModalVisible(true);
  };
  

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Convert payRate to a number
      values.payRate = parseFloat(values.payRate);
  
      // Convert birthday from moment to a string in the desired format
      values.birthday = values.birthday.format('YYYY-MM-DD'); // Convert moment to string
  
      if (editEmployeeId) {
        // Update employee in Firestore
        const employeeRef = doc(db, 'employees', editEmployeeId);
        await updateDoc(employeeRef, values);
        setEditEmployeeId(null);
      } else {
        // Add employee to Firestore
        await addDoc(collection(db, 'employees'), values);
      }
      
      setIsModalVisible(false);
      setIsEditModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleDelete = async (employeeId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this employee?");
  
    if (isConfirmed) {
      // Perform the delete action here, e.g., call your delete function
      const employeeRef = doc(db, 'employees', employeeId);
      await deleteDoc(employeeRef);
    }
   
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditModalVisible(false);
    form.resetFields();
    setEditEmployeeId(null);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Position', dataIndex: 'position', key: 'position' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'SIN', dataIndex: 'sin', key: 'sin' },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      key: 'birthday',
    },    
    { title: 'Pay Type', dataIndex: 'payType', key: 'payType' },
    {
      title: 'Pay Rate',
      dataIndex: 'payRate',
      key: 'payRate',
      // Conditionally render the "Pay Rate" column based on the "show" state
      render: (_, record) => (show ? `$${record?.payRate}` : 'N/A'),
    },
    { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => showEditModal(record.id)}>
            <EditOutlined /> Edit
          </Button>
          <Button type="link" onClick={() => handleDelete(record.id)}>
            <DeleteOutlined /> Delete
          </Button>
        </div>
      ),
    },
  ];

  

  return (
    <div className={`${mode === 'dark' ? 'bg-white' : 'bg-white'} font-lato`}>
      <Topbar collapsed={collapsed} />
      <ToastContainer autoClose={2000} />

      <div className="flex">
        {/* Left */}
        <div>
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* Right */}
        <div className="w-10/12 mb-20">
            {/* Content of the right div */}
            
            {
              !timesheetsOnly && userTypeIdentified ?
              <div className="w-5/12 mb-2 mt-36 space-x-6  mx-auto  flex flex-row justify-center align-middle">
                <Button className='bg-blue-700' type="primary" onClick={showModal}>
                  Add Employee
                </Button>
              </div>:
              <div className="w-5/12 mb-2 mt-36 space-x-6  mx-auto  flex flex-row justify-center align-middle">\
              </div>
            }

            {
              !timesheetsOnly && userTypeIdentified &&
              <div className="w-12/12 flex flex-row justify-center align-middle">
                <div>

                  <Modal
                    title={editEmployeeId ? "Edit Employee" : "Add Employee"}
                    visible={isModalVisible || isEditModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <Form form={form} layout="vertical">
                      <Form.Item label="Full Name" name="name">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                        <Input />
                      </Form.Item>

                      {/* <Form.Item label="Position" name="position">
                        <Input />
                      </Form.Item> */}
                      <Form.Item label="Position" name="position">
                        <Select>
                          <Option value="Factory Worker">Factory Worker</Option>
                          <Option value="Operator">Operator</Option>
                          <Option value="Bagger">Bagger</Option>
                          <Option value="General Manager">General Manager</Option>
                          <Option value="Labourer">Labourer</Option>
                          <Option value="CEO">CEO</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="Address" name="address">
                        <Input />
                      </Form.Item>
                      <Form.Item label="SIN" name="sin">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Birthday" name="birthday">
                        <DatePicker format="YYYY-MM-DD" />
                      </Form.Item>
                      <Form.Item label="Pay Type" name="payType">
                        <Select>
                          <Option value="hourly">Hourly</Option>
                          <Option value="weekly">Weekly</Option>
                          <Option value="security">Security</Option>
                          <Option value="bagger">Bagger</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="Pay Rate" name="payRate">
                        <Input type="number" step="0.01" />
                      </Form.Item>
                      <Form.Item label="Phone Number" name="phoneNumber">
                        <Input />
                      </Form.Item>
                    </Form>
                  </Modal>
                  <Table dataSource={employees} columns={columns} />
                </div>
              </div>
            }
            {
              timesheetsOnly && userTypeIdentified && <h1 className='text-center text-7xl'>ACCESS DENIED</h1>
            }
          </div>
      </div>
    </div>

  );
}

export default Employee;
