import "./styles.css"
import { v4 as uuidv4 } from 'uuid';
import { addUser, checkUserSignUp, getUserById, updateUser } from '../../services/users';
import { useNavigate } from 'react-router-dom';
import { deleteAllCookies, getCookie, setCookie } from "../../helper/cookies";
import { Button, Checkbox, Divider, Form, Input } from 'antd';
import { useState } from "react";
import { useDispatch } from "react-redux";
const Registered = () => {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const nav = useNavigate()
    const onFinish = async (e) => {
        setIsLoading(true)
        const email = e.email
        const fullName = e.fullName
        const password = e.password

        const obj = {
            "email": email,
            "fullName": fullName,
            "password": password,
            "id": uuidv4(),
            "role": "USER",
            "createdAt": Date.now(),
            "latestAccess": Date.now(),
        }
        const res = await checkUserSignUp(email)
        if (res && res.length > 0) {
            setIsLoading(false)
            alert("This e-mail is already been registered!")
        }
        else {
            const res1 = await addUser(obj)
            const res2 = await getUserById(obj.id)
            if (res2 && res2.length > 0) {
                setIsLoading(false)
                alert("Sign-up successfully!")
                dispatch({
                    type: "login",
                    value: {
                        email: res2[0].email,
                        fullName: res2[0].fullName,
                        id: res2[0].id,
                        password: res2[0].password,
                        role: "USER",
                    }
                })
                setCookie("email", res2[0].email, 1)
                setCookie("fullName", res2[0].fullName, 1)
                setCookie("token", res2[0].token, 1)
                setCookie("id", res2[0].id, 1)
                setCookie("role", res2[0].role, 1)
                setTimeout(() => {
                    nav("/topics")
                }, 1000)
                let obj = res2[0]
                obj.status = "online"
                await updateUser(res2[0].id, obj)
            }
        }
    }
    const onFinishFailed = () => {

    }
    return (
        <>
            <section className="registered section">
                <div className="container">
                    <Form
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        className="registered-form"
                        initialValues={{
                            remember: true,
                        }}
                        layout="vertical"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <span className="title-medium" style={{ textAlign: "center" }}>Sign up</span>
                        <Divider></Divider>
                        <Form.Item
                            label="E-mail"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Full name"
                            name="fullName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <div style={{ padding: "8px 0px" }}></div>
                        <Form.Item
                            wrapperCol={{
                                offset: 0,
                                span: 24,
                            }}
                            style={{ marginBottom: "0px" }}
                        >
                            <Button type="primary" htmlType="submit"
                                loading={isLoading}
                                style={{ width: "100%", height: 36 }}>
                                Sign up
                            </Button>
                        </Form.Item>
                        <Divider style={{ margin: "8px 0" }}>or</Divider>
                        <Form.Item
                            wrapperCol={{
                                offset: 0,
                                span: 24,
                            }}
                        >
                            <Button
                                type="primary"
                                onClick={() => { nav('/login') }}
                                style={{ width: "100%", height: 36 }}>
                                Already have an account
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

            </section>
        </>
    )
}
export default Registered