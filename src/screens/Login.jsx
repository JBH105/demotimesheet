import React, { useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../components/Common/Loading';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Import the necessary functions from Firebase v9
import { app } from '../firebase'; // Import the exported app object



const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async values => {
    setLoading(true);

    const { email, password } = values;
    const auth = getAuth(app); // Get the auth instance using the app object

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // Use the new functions for authentication
      setLoading(false);
      navigate('/landing'); // Redirect to the dashboard on successful login
    } catch (error) {
      setLoading(false);
      toast.error('Login failed. Check your credentials.');
    }
  };


  const onFinishFailed = errorInfo => {
    setLoading(true);
    toast('Failed:', errorInfo);
    setLoading(false);
  };

  return (
    <div className="bg-custom-background bg-cover bg-center bg-no-repeat ">
      <ToastContainer autoClose={2000} />
      <div className="flex flex-wrap bg-gradient-to-tl from-[#672A8F] to-transparent">
        <div className="w-full md:w-1/4 px-4">{/* Left column */}</div>
        <div className="w-full md:w-2/4 px-4">
          {/* Middle column */}
          <div
            className="flex justify-center items-center"
            style={{ minHeight: '100vh' }}
          >
            <Form
              style={{ maxWidth: 500 }}
              className="w-8/12"
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              {/* Form content */}
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              >
                <Input className="h-12" placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password className="h-12" placeholder="Password" />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox className="text-white">Remember me</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  className="bg-[#672A8F] w-full text-base h-12 font-semibold text-white"
                  htmlType="submit"
                >
                  {loading ? (
                    <>
                      <Loading />
                    </>
                  ) : (
                    <>Sign in</>
                  )}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="w-full md:w-1/4 px-4">
          {/* Right column */}
          <div className="flex p-10 justify-end items-end h-full">
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: '200px', height: '100px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
