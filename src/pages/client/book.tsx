import { ShoppingCartOutlined } from "@ant-design/icons";
import { App, Button, Col, Flex, Modal, Rate, Row, Spin } from "antd";
import ImageGallery from "react-image-gallery";
import "./book.scss";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getDetailBookApi } from "@/services/api";
import { useParams } from "react-router-dom";
import BookLoader from "./book.loader";
import { useCurrentApp } from "@/components/context/app.context";

type CartItemType = {
  _id: string;
  quantity: number;
  detail: IBookTable;
};

const BookPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refGallery = useRef<ImageGallery>(null);
  const [detailBook, setDetailBook] = useState<IBookTable>();

  const { currentCart, setCurrentCart } = useCurrentApp();

  const getDetailBook = async (_id: string) => {
    setIsLoading(true);
    const res = await getDetailBookApi(_id);
    if (res.data) {
      setDetailBook(res.data);
      setIsLoading(false);
    }
  };
  const { id } = useParams();

  useEffect(() => {
    getDetailBook(id as string);
  }, []);

  // const images = [
  //   {
  //     original: detailBook.,
  //     thumbnail: "https://picsum.photos/id/1018/250/150/",
  //   },
  //   {
  //     original: "https://picsum.photos/id/1015/1000/600/",
  //     thumbnail: "https://picsum.photos/id/1015/250/150/",
  //   },
  //   {
  //     original: "https://picsum.photos/id/1019/1000/600/",
  //     thumbnail: "https://picsum.photos/id/1019/250/150/",
  //   },
  //   {
  //     original: "https://picsum.photos/id/1018/1000/600/",
  //     thumbnail: "https://picsum.photos/id/1018/250/150/",
  //   },
  //   {
  //     original: "https://picsum.photos/id/1015/1000/600/",
  //     thumbnail: "https://picsum.photos/id/1015/250/150/",
  //   },
  //   {
  //     original: "https://picsum.photos/id/1019/1000/600/",
  //     thumbnail: "https://picsum.photos/id/1019/250/150/",
  //   },
  //   {
  //     original: "https://picsum.photos/id/1018/1000/600/",
  //     thumbnail: "https://picsum.photos/id/1018/250/150/",
  //   },
  //   {
  //     original: "https://picsum.photos/id/1015/1000/600/",
  //     thumbnail: "https://picsum.photos/id/1015/250/150/",
  //   },
  //   {
  //     original: "https://picsum.photos/id/1019/1000/600/",
  //     thumbnail: "https://picsum.photos/id/1019/250/150/",
  //   },
  // ];

  const imagesBook = [detailBook?.thumbnail, ...(detailBook?.slider || [])].map(
    (item) => {
      return {
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        originalClass: "origin-class",
        thumbnailClass: "thumbnail-class",
      };
    }
  );

  const [inputQuantity, setInputQuantity] = useState<number>(1);

  const handleMinus = () => {
    if (inputQuantity > 1) {
      setInputQuantity((prev) => prev - 1);
    }
  };

  const handleAdd = () => {
    if (detailBook) {
      if (inputQuantity < detailBook?.quantity) {
        setInputQuantity((prev) => prev + 1);
      }
    }
  };

  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = Number(value);

    if (!isNaN(num)) {
      setInputQuantity(num);
    }
  };

  const [cart, setCart] = useState<CartItemType[]>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const { message } = App.useApp();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
      setCurrentCart(cart);
    }
  }, [cart]);

  const handleAddBookToCart = () => {
    if (!cart) {
      const newCart: {
        _id: string;
        quantity: number;
        detail: IBookTable;
      }[] = [];
      newCart.push({
        _id: detailBook?._id as string,
        quantity: inputQuantity,
        detail: detailBook as IBookTable,
      });
      setCart(newCart);
    } else {
      const checkIsBookInCart = cart.find(
        (item) => item._id === detailBook?._id
      );
      if (checkIsBookInCart) {
        const updatedCart = cart.map((item) =>
          item._id === detailBook?._id
            ? { ...item, quantity: item.quantity + inputQuantity }
            : item
        );
        setCart(updatedCart);
      } else {
        const newCart = {
          _id: detailBook?._id as string,
          quantity: inputQuantity,
          detail: detailBook as IBookTable,
        };
        setCart((prev) => [...prev, newCart]);
      }
    }
    message.success("Thêm vào giỏ hàng thành công!");
  };

  return (
    <div>
      <div style={{ padding: "20px 0" }}>
        <div
          style={{
            maxWidth: 1340,
            margin: "0 auto",
            padding: 16,
            background: "#fff",
          }}
        >
          {isLoading ? (
            <BookLoader />
          ) : (
            <>
              <Row gutter={16}>
                <Col span={12} className="gutter-row">
                  <ImageGallery
                    ref={refGallery}
                    items={imagesBook as any}
                    showPlayButton={false}
                    showFullscreenButton={false}
                    showNav={false}
                    onClick={() => {
                      setIsModalOpen(true);
                      setCurrentIndex(
                        refGallery.current?.getCurrentIndex() ?? 1
                      );
                    }}
                  />
                </Col>
                <Col span={12}>
                  <div className="detail">
                    <p className="author">
                      Tác giả: <span>{detailBook?.author}</span>
                    </p>
                    <p className="main-text">{detailBook?.mainText}</p>
                    <div className="other">
                      <div className="vote">
                        <Flex gap="middle">
                          <Rate defaultValue={5} style={{ fontSize: 13 }} />
                        </Flex>
                      </div>
                      <div className="sold">Đã bán {detailBook?.sold}</div>
                    </div>
                    <div className="price">
                      <span>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(detailBook?.price ?? 0)}
                      </span>
                    </div>
                    <div className="ship">
                      <span>Vận chuyển</span>
                      Miễn phí vận chuyển
                    </div>
                    <div className="quantity">
                      <span>Số lượng</span>
                      <div className="quantity-selector">
                        <button className="qty-btn" onClick={handleMinus}>
                          −
                        </button>
                        <input
                          type="text"
                          value={inputQuantity}
                          onChange={(e) => handleChangeQuantity(e)}
                          className="qty-input"
                        />
                        <button className="qty-btn" onClick={handleAdd}>
                          +
                        </button>
                      </div>
                    </div>
                    <div className="buy">
                      <Flex wrap gap="large">
                        <Button
                          color="danger"
                          variant="outlined"
                          onClick={handleAddBookToCart}
                        >
                          <ShoppingCartOutlined />
                          Thêm vào giỏ hàng
                        </Button>
                        <Button
                          color="danger"
                          variant="solid"
                          style={{ marginLeft: 12 }}
                        >
                          Mua ngay
                        </Button>
                      </Flex>
                    </div>
                  </div>
                </Col>
              </Row>
              <Modal
                footer={null} // ẩn OK & Cancel
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                width={"50vw"}
                title={detailBook?.mainText}
              >
                <ImageGallery
                  items={imagesBook as any}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  thumbnailPosition={"right"}
                  startIndex={currentIndex}
                />
              </Modal>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookPage;
