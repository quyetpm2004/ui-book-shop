import { useCurrentApp } from "@/components/context/app.context";
import { createOrder } from "@/services/api";
import { DeleteOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
} from "antd";
import { useEffect, useState } from "react";

interface TProps {
  next: () => void;
}
type FieldType = {
  method?: string;
  fullName?: string;
  phone?: string;
  address?: string;
};

const OrderCheckout = (props: TProps) => {
  const { next } = props;
  const { currentCart, setCurrentCart, user } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { notification } = App.useApp();

  useEffect(() => {
    let sumOrder = 0;
    currentCart.forEach((item) => {
      sumOrder += item.detail.price * item.quantity;
    });
    setTotalPrice(sumOrder);
  }, [currentCart]);

  const handleRemoveItem = (_id: string) => {
    const updatedCart = currentCart.filter((item) => item.detail._id !== _id);
    setCurrentCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(currentCart));
  };

  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      method: "COD",
      fullName: user?.fullName,
      phone: user?.phone,
      address: "",
    });
  });

  const handleSubmit = async (values: FieldType) => {
    const { method, fullName, phone, address } = values;
    const detail = currentCart.map((item) => {
      return {
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item._id,
      };
    });
    const res = await createOrder(
      fullName as string,
      address as string,
      phone as string,
      totalPrice as number,
      method as string,
      detail
    );
    if (res.data) {
      setCurrentCart([]);
      localStorage.removeItem("cart");
      next();
    } else {
      notification.error({
        description: res.error,
        message: "Có lỗi xảy ra",
      });
    }
  };

  return (
    <Row gutter={16}>
      <Col className="gutter-row" span={18}>
        {currentCart.map((item, key) => (
          <div className="order" key={key}>
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                item.detail.thumbnail
              }`}
              alt=""
            />
            <p className="main-text">{item.detail.mainText}</p>
            <p className="price">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.detail.price)}
            </p>
            <span>Số lượng: {item.quantity}</span>
            <p className="total-price">
              Tổng:{" "}
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(item.detail.price * item.quantity)}
              </span>
            </p>
            <div className="btn-remove">
              <DeleteOutlined
                onClick={() => handleRemoveItem(item.detail._id)}
                style={{ color: "rgb(148, 5, 5)" }}
              />
            </div>
          </div>
        ))}
      </Col>
      <Col className="gutter-row" span={6}>
        <div className="checkout-order check-order">
          <Form onFinish={handleSubmit} form={form} layout="vertical">
            <Form.Item<FieldType>
              label="Lựa chọn"
              name="method"
              rules={[
                { required: true, message: "Chọn 1 phương thức thanh toán!" },
              ]}
            >
              <Radio.Group>
                <Radio value="COD">Thanh toán khi nhận hàng</Radio>
                <Radio value="BANKING">Chuyển khoản ngân hàng</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item<FieldType>
              label="Họ tên"
              name="fullName"
              rules={[
                { required: true, message: "Họ tên không được bỏ trống!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được bỏ trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Địa chỉ"
              name="address"
              rules={[
                { required: true, message: "Địa chỉ không được bỏ trống!" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
          <div className="check-price">
            <p>Tạm tính</p>
            <p>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice)}
            </p>
          </div>
          <Divider />
          <div className="total">
            <p>Tổng tiền</p>
            <p className="color-price">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice)}
            </p>
          </div>
          <Divider />
          <div className="btn-buy">
            <button onClick={() => form.submit()}>
              Đặt hàng ({currentCart.length ?? 0})
            </button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default OrderCheckout;
