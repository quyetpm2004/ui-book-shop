import { useCurrentApp } from "@/components/context/app.context";
import { DeleteOutlined } from "@ant-design/icons";
import { App, Col, Divider, Empty, InputNumber, Row } from "antd";
import { useEffect, useState } from "react";

interface TProps {
  next: () => void;
}

const OrderDetail = (props: TProps) => {
  const { next } = props;
  const { notification } = App.useApp();
  const { currentCart, setCurrentCart } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const handleChangeInput = (value: number | null, _id: string) => {
    if (value) {
      const checkIsBookInCart = currentCart.find((item) => item._id === _id);
      if (checkIsBookInCart) {
        const updatedCart = currentCart.map((item) =>
          item._id === _id ? { ...item, quantity: value } : item
        );
        localStorage.setItem("cart", JSON.stringify(currentCart));
        setCurrentCart(updatedCart);
      }
    }
  };
  useEffect(() => {
    let sumOrder = 0;
    currentCart.forEach((item) => {
      sumOrder += item.detail.price * item.quantity;
    });
    setTotalPrice(sumOrder);
  }, [currentCart]);

  const handleRemoveItem = (_id: string) => {
    const updatedCart = currentCart.filter((item) => item.detail._id !== _id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCurrentCart(updatedCart);
  };

  const handleBuy = () => {
    if (currentCart.length === 0) {
      notification.error({
        description: "Bạn chưa có sản phẩm nào trong giỏ hàng",
        message: "Có lỗi xảy ra",
      });
    } else {
      next();
    }
  };
  return (
    <Row gutter={16}>
      <Col className="gutter-row" span={18}>
        {currentCart.length === 0 ? (
          <Empty
            style={{ marginTop: 10 }}
            description="Không có sản phẩm trong giỏ hàng"
          />
        ) : (
          <>
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
                <InputNumber
                  onChange={(value) =>
                    handleChangeInput(value, item.detail._id)
                  }
                  value={item.quantity}
                  min={1}
                  max={item.detail.quantity}
                />
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
          </>
        )}
      </Col>

      <Col className="gutter-row" span={6}>
        <div className="check-order">
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
            <button onClick={handleBuy}>
              Mua hàng ({currentCart.length ?? 0})
            </button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default OrderDetail;
