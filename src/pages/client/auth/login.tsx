import { useCurrentApp } from "@/components/context/app.context";
import { loginApi } from "@/services/api";
import type { FormProps } from "antd";
import { App, Button, Divider, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/login.scss";

type FieldType = {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
};

const LoginPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { message, notification } = App.useApp();
  const { setUser, setIsAuthenticated } = useCurrentApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async ({
    email,
    password,
  }) => {
    setIsSubmit(true);
    const res = await loginApi(email as string, password as string);
    if (res.error) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
      setIsSubmit(false);
    } else {
      setIsSubmit(false);
      localStorage.setItem("access_token", res?.data?.access_token ?? "");
      setUser(res?.data?.user ?? null);
      setIsAuthenticated(true);
      message.success("Đăng nhập thành công!");
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <div className="login-title">
        <h1>Đăng nhập</h1>
      </div>
      <Form
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
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

        <br />
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Đăng nhập
          </Button>
        </Form.Item>
        <Divider>Or</Divider>
        <p className="text text-normal" style={{ textAlign: "center" }}>
          Bạn chưa có tài khoản ? <a href="/register">Đăng Ký</a>
        </p>
      </Form>
    </div>
  );
};

export default LoginPage;
