import { App, Button, Divider, Form, Input, message, Modal } from "antd";

interface Props {
  isModalOpen: boolean;
  onFinish: (v: FieldType) => void;
  handleCancel: () => void;
  isSuccess: boolean;
}

type FieldType = {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
};

const ModalCreateUser = (props: Props) => {
  const handleSubmit = (values: FieldType) => {
    props.onFinish(values); // gọi hàm cha
    if (props.isSuccess) {
      form.resetFields(); // reset form sau khi submit
    }
  };
  const [form] = Form.useForm();
  return (
    <Modal
      title="Thêm mới người dùng"
      closable={{ "aria-label": "Custom Close Button" }}
      open={props.isModalOpen}
      onOk={() => {
        form.submit();
      }}
      onCancel={props.handleCancel}
      okText={"Tạo mới"}
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
      </Form>
    </Modal>
  );
};

export default ModalCreateUser;
