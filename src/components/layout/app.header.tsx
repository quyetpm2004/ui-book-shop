import { useEffect, useState } from "react";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import {
  Divider,
  Badge,
  Drawer,
  Avatar,
  Popover,
  Empty,
  Modal,
  TabsProps,
  Tabs,
  Row,
  Col,
  Upload,
  Form,
  Input,
  Button,
  UploadProps,
  GetProp,
  App,
  Image,
  UploadFile,
} from "antd";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router";
import "./app.header.scss";
import { Link } from "react-router-dom";
import { useCurrentApp } from "components/context/app.context";
import {
  callUploadBookImg,
  changePasswordApi,
  logoutApi,
  updateUserApiByClient,
} from "@/services/api";
import { FormProps } from "antd/lib";
import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { MAX_LOAD_IMAGE_SIZE } from "@/services/helper";
import Password from "antd/es/input/Password";

const AppHeader = (props: any) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDetailAcc, setOpenDetailAcc] = useState<boolean>(false);

  const {
    isAuthenticated,
    user,
    setUser,
    setIsAuthenticated,
    currentCart,
    setCurrentCart,
  } = useCurrentApp();

  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logoutApi();
    if (res.data) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    }
  };

  let items = [
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => setOpenDetailAcc(true)}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: <Link to="/history">Lịch sử mua hàng</Link>,
      key: "history",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];
  if (user?.role === "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "admin",
    });
  }

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCurrentCart(JSON.parse(storedCart));
    }
  }, []);

  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
  const { message, notification } = App.useApp();

  type FieldType = {
    fullName?: string;
    phone?: string;
    email?: string;
  };

  type FieldTypePassword = {
    email?: string;
    oldpass?: string;
    newpass?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { fullName, phone } = values;
    setIsSubmit(true);

    const res = await updateUserApiByClient(
      user?.id as string,
      fullName as string,
      phone as string,
      avatar
    );
    if (res.data) {
      setIsSubmit(false);

      message.success("Update user thành công");
      const newUser: any = {
        ...user,
        fullName: fullName as string,
        phone: phone as string,
        avatar,
      };
      setUser(newUser);
      setOpenDetailAcc(false);
    } else {
      setIsSubmit(false);

      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const fileList = user?.avatar
    ? [
        {
          uid: uuidv4(), // hoặc dùng chính `user._id` nếu muốn
          name: user.avatar,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
            user.avatar
          }`,
        },
      ]
    : [];

  const [avatar, setAvatar] = useState<string>(user?.avatar ?? "");

  const handleUploadFile: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    try {
      const res = await callUploadBookImg(file as File, "avatar");
      if (res?.data?.fileUploaded) {
        const fileUploaded = res.data.fileUploaded;

        setAvatar(fileUploaded);

        console.log(fileUploaded);

        onSuccess?.("ok");
      } else {
        throw new Error(res?.message || "Upload failed");
      }
    } catch (err: any) {
      onError?.(err);
    }
  };

  const uploadProps: UploadProps = {
    // action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    listType: "picture",
    fileList: fileList as any,
    showUploadList: false,
    maxCount: 1,
    customRequest: handleUploadFile,
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < MAX_LOAD_IMAGE_SIZE;
      if (!isLt2M) {
        message.error(`Image must smaller than ${MAX_LOAD_IMAGE_SIZE}MB!`);
      }
      return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
    },
  };

  const [form] = Form.useForm();
  const [formPass] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      fullName: user?.fullName,
      phone: user?.phone,
      email: user?.email,
    });
    formPass.setFieldValue("email", user?.email);
  }, []);

  const changePassword = async (values: FieldTypePassword) => {
    const { email, oldpass, newpass } = values;
    setIsSubmit(true);

    const res = await changePasswordApi(
      email as string,
      oldpass as string,
      newpass as string
    );
    if (res.data) {
      setIsSubmit(false);
      message.success("Update user thành công");
      const newUser: any = {
        ...user,
        password: newpass,
      };
      setUser(newUser);
      setOpenDetailAcc(false);
    } else {
      setIsSubmit(false);

      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const tabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Cập nhật thông tin",
      children: (
        <>
          <Row>
            <Col span={12}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {avatar !== null ? (
                  <Image
                    width={150}
                    height={150}
                    style={{
                      borderRadius: "50%", // bo tròn
                      objectFit: "cover", // căn giữa & cắt cho vừa khung
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)", // đổ bóng nhẹ
                      border: "2px solid #eee", // viền nhẹ
                    }}
                    src={`${
                      import.meta.env.VITE_BACKEND_URL
                    }/images/avatar/${avatar}`}
                    alt="avatar"
                  />
                ) : (
                  <Image
                    width={200}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  />
                )}
                <Upload {...uploadProps}>
                  <Button
                    style={{ marginTop: "16px", display: "block" }}
                    icon={<UploadOutlined />}
                    loading={isSubmit}
                  >
                    Upload
                  </Button>
                </Upload>
              </div>
            </Col>
            <Col span={12}>
              <Form
                name="basic"
                labelCol={{ span: 24 }}
                onFinish={onFinish}
                layout="vertical"
                form={form}
              >
                <Form.Item<FieldType>
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item<FieldType>
                  label="Tên hiển thị"
                  name="fullName"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item<FieldType>
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Please input your phone!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label={null}>
                  <Button type="primary" htmlType="submit">
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: (
        <>
          <Row>
            <Col span={24}>
              <Form
                name="basic"
                labelCol={{ span: 24 }}
                onFinish={changePassword}
                layout="vertical"
                form={formPass}
              >
                <Form.Item<FieldTypePassword>
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item<FieldTypePassword>
                  label="Mật khẩu cũ"
                  name="oldpass"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Password />
                </Form.Item>
                <Form.Item<FieldTypePassword>
                  label="Mật khẩu mới"
                  name="newpass"
                  rules={[
                    {
                      required: true,
                      message: "Please input your newPassword!",
                    },
                  ]}
                >
                  <Password />
                </Form.Item>

                <Form.Item label={null}>
                  <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const contentPopover = () => {
    return (
      <div className="pop-cart-body">
        <div className="pop-cart-content">
          {currentCart?.map((book, index) => {
            return (
              <div className="book" key={`book-${index}`}>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    book?.detail?.thumbnail
                  }`}
                />
                <div className="main-text">{book?.detail?.mainText}</div>
                <div className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(book?.detail?.price ?? 0)}
                </div>
              </div>
            );
          })}
        </div>
        {currentCart.length > 0 ? (
          <div className="pop-cart-footer">
            <button onClick={() => navigate("/order")}>Xem giỏ hàng</button>
          </div>
        ) : (
          <Empty description="Không có sản phẩm trong giỏ hàng" />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="header-container" style={{ background: "#fff" }}>
        <header className="page-header">
          <div className="page-header__top">
            <div
              className="page-header__toggle"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              ☰
            </div>
            <div className="page-header__logo">
              <span className="logo">
                <span onClick={() => navigate("/")}>
                  {" "}
                  <FaReact className="rotate icon-react" />
                  King Guy
                </span>

                <VscSearchFuzzy className="icon-search" />
              </span>
              <input
                className="input-search"
                type={"text"}
                placeholder="Bạn tìm gì hôm nay"
                // value={props.searchTerm}
                // onChange={(e) => props.setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                <Popover
                  className="popover-carts"
                  placement="bottomRight"
                  rootClassName="popover-carts"
                  title={"Sản phẩm mới thêm"}
                  content={contentPopover}
                  arrow={true}
                >
                  <Badge
                    // count={carts?.length ?? 0}
                    count={currentCart?.length}
                    size={"small"}
                    showZero
                  >
                    <FiShoppingCart className="icon-cart" />
                  </Badge>
                </Popover>
              </li>
              <li className="navigation__item mobile">
                <Divider type="vertical" />
              </li>
              <li className="navigation__item mobile">
                {!isAuthenticated ? (
                  <span onClick={() => navigate("/login")}> Tài Khoản</span>
                ) : (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <Space>
                      <Avatar src={urlAvatar} />
                      {user?.fullName}
                    </Space>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p>Quản lý tài khoản</p>
        <Divider />

        <p onClick={() => handleLogout()}>Đăng xuất</p>
        <Divider />
      </Drawer>
      <Modal
        title="Quản lý tài khoản"
        open={openDetailAcc}
        footer={null}
        onCancel={() => setOpenDetailAcc(false)}
        width="50vw"
      >
        <Tabs defaultActiveKey="1" items={tabs} />
      </Modal>
    </>
  );
};

export default AppHeader;
