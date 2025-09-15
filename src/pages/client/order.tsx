import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  InputNumber,
  message,
  Result,
  Row,
  Steps,
  theme,
} from "antd";
import "./order.scss";
import { useCurrentApp } from "@/components/context/app.context";
import { useEffect, useState } from "react";
import OrderDetail from "./order/order.detail";
import OrderCheckout from "./order/order.checkout";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const steps = [
    {
      title: "Đơn hàng",
      content: <></>,
    },
    {
      title: "Đặt hàng",
      content: <></>,
    },
    {
      title: "Thanh toán",
      content: <></>,
    },
  ];

  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 1340, margin: "0 auto" }}>
      <div className="step">
        <Steps current={current} items={items} style={{ marginTop: 10 }} />
      </div>
      <>{current === 0 && <OrderDetail next={next} />}</>
      <>{current === 1 && <OrderCheckout next={next} />}</>
      <>
        {current === 2 && (
          <Result
            status="success"
            title="Đặt hàng thành công"
            subTitle="Hệ thống đã ghi nhận thông tin đơn hàng của bạn"
            extra={[
              <Button type="primary" key="console">
                Trang chủ
              </Button>,
              <Button key="buy" onClick={() => navigate("/history")}>
                Lịch sử mua hàng
              </Button>,
            ]}
          />
        )}
      </>
      <div style={{ margin: "5px 0 0", padding: "0 0 8px" }}>
        {current === 1 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Quay trở lại
          </Button>
        )}
      </div>
    </div>
    // <div style={{ maxWidth: 1340, margin: "0 auto" }}>
    //   <OrderDetail />
    // </div>
  );
};

export default OrderPage;
