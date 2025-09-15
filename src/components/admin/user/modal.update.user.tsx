import { registerApi, updateUserApi } from "@/services/api";
import { App, Button, Divider, Form, Input, message, Modal } from "antd";
import type { FormProps } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TProp {
  openUpdateUser: boolean;
  setOpenUpdateUser: (v: boolean) => void;
  userUpdate: IUserTable;
  handleUpdate: (v: FieldType) => void;
}

type FieldType = {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
};

const ModalUpdateUser = (props: TProp) => {
  const [form] = Form.useForm();

  const { openUpdateUser, setOpenUpdateUser, userUpdate, handleUpdate } = props;
  const handleSubmit = async (values: FieldType) => {
    handleUpdate(values);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue({
      fullName: userUpdate.fullName,
      email: userUpdate.email,
      phone: userUpdate.phone,
    });
  }, [userUpdate]);

  return (
    <Modal
      title="Update user"
      closable={{ "aria-label": "Custom Close Button" }}
      open={openUpdateUser}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => setOpenUpdateUser(false)}
      okText={"Update"}
      cancelText={"Hủy"}
    >
      <br />
      <Form
        name="basic"
        autoComplete="off"
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
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
          <Input disabled={true} />
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
      </Form>
    </Modal>
  );
};

export default ModalUpdateUser;
