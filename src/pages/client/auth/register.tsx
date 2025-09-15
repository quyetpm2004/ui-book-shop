import { registerApi } from "@/services/api";
import type { FormProps } from "antd";
import { App, Button, Divider, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/register.scss";

type FieldType = {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
};

const RegisterPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async ({
    fullName,
    email,
    password,
    phone,
  }) => {
    setIsSubmit(true);
    const res = await registerApi(
      fullName as string,
      email as string,
      password as string,
      phone as string
    );

    if (res.error) {
      setIsSubmit(false);

      message.error(res.message);
      return;
    }

    setIsSubmit(false);
    message.success("Đăng ký tài khoản thành công");

    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-title">
        <h1>Đăng ký tài khoản</h1>
      </div>
      <Form
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType>
          labelCol={{ span: 24 }}
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: "Họ tên không được để trống" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          labelCol={{ span: 24 }}
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email không được để trống" },
            { type: "email", message: "Email không đúng định dạng" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          labelCol={{ span: 24 }}
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Mật khẩu không được để trống" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          labelCol={{ span: 24 }}
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Số điện thoại không được để trống" },
          ]}
        >
          <Input />
        </Form.Item>
        <br />
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Đăng ký
          </Button>
        </Form.Item>
        <Divider>Or</Divider>
        <p className="text text-normal" style={{ textAlign: "center" }}>
          Đã có tài khoản ? <a href="/login">Đăng Nhập</a>
        </p>
      </Form>
    </div>
  );
};

export default RegisterPage;
