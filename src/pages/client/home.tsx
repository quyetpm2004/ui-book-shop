import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Col,
  Flex,
  InputNumber,
  Pagination,
  Rate,
  Row,
  Tabs,
  Form,
  Divider,
  Spin,
} from "antd";
import "./home.scss";
import { getBookApi, getCategoryBook } from "@/services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [booksList, setBooksList] = useState<IBookTable[] | null>([]);
  const [sort, setSort] = useState<string>("-sold");
  const [filterCate, setFilterCate] = useState<string>("");
  const [filterPrice, setFilterPrice] = useState<string>("");
  let navigate = useNavigate();
  const getCatogorysList = async () => {
    const res = await getCategoryBook();
    if (res.data) {
      setCategories(res.data);
    }
  };

  useEffect(() => {
    getCatogorysList();
  }, []);

  const getBookList = async (query: string) => {
    setIsLoading(true);
    const res = await getBookApi(query);

    if (res.data) {
      setBooksList(res.data.result);
      setTotal(res.data.meta.total);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let query = `current=${currentPage}&pageSize=${pageSize}&sort=${sort}`;
    if (filterCate !== "") {
      query += `&category=${filterCate}`;
    }
    if (filterPrice !== "") {
      query += `&${filterPrice}`;
    }
    getBookList(query);
  }, [currentPage, sort, filterCate, filterPrice]);

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Filter values:", values);
    const { categories, range } = values;
    if (categories) {
      setFilterCate(categories.toString());
    }
    // xử lý khoảng giá
    if (range) {
      const { from, to } = range;
      if (typeof from === "number" && typeof to !== "number") {
        setFilterPrice(`price>=${from}`);
      } else if (typeof from !== "number" && typeof to === "number") {
        setFilterPrice(`price<=${to}`);
      } else if (typeof from === "number" && typeof to === "number") {
        setFilterPrice(`price>=${from}&price<=${to}`);
      } else {
        setFilterPrice(""); // nếu cả 2 đều undefined
      }
    } else {
      setFilterPrice(""); // nếu không có range
    }
  };

  const convertKeyToValue = (key: any) => {
    switch (key) {
      case "1":
        return "-sold";
      case "2":
        return "-createAt";
      case "3":
        return "price";
      case "4":
        return "-price";
      default:
        return "-sold";
    }
  };

  const reloadForm = () => {
    form.resetFields();
    setFilterCate("");
    setFilterPrice("");
  };

  return (
    <div className="content-container">
      <div className="content-sidebar">
        <div className="sidebar-header">
          <div>
            <FilterOutlined />
            <span style={{ marginLeft: 10, fontWeight: 600 }}>
              Bộ lọc tìm kiếm
            </span>
          </div>
          <div onClick={reloadForm} style={{ cursor: "pointer" }}>
            <ReloadOutlined />
          </div>
        </div>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="sidebar-filter">
            <Form.Item label="Danh mục sản phẩm" name="categories">
              <Checkbox.Group>
                <Row>
                  {categories?.map((item) => (
                    <Col span={24}>
                      <Checkbox style={{ marginTop: 8 }} value={item}>
                        {item}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </div>
          <Divider></Divider>
          <div>
            <Form.Item label="Khoảng giá">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Form.Item name={["range", "from"]}>
                  <InputNumber
                    placeholder="Từ"
                    min={0}
                    formatter={(value) =>
                      `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
                <span style={{ marginBottom: 24 }}>-</span>
                <Form.Item name={["range", "to"]}>
                  <InputNumber
                    placeholder="Đến"
                    min={0}
                    formatter={(value) =>
                      `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </div>
            </Form.Item>
          </div>

          <div className="filter-button">
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Áp dụng
            </Button>
          </div>
        </Form>
        <div className="feedback">
          <p>Đánh giá</p>
          <Flex gap="middle">
            <Rate defaultValue={5} />
          </Flex>
          <Flex gap="middle">
            <Rate defaultValue={4} />
            <span>trở lên</span>
          </Flex>
          <Flex gap="middle">
            <Rate defaultValue={3} />
            <span>trở lên</span>
          </Flex>
          <Flex gap="middle">
            <Rate defaultValue={2} />
            <span>trở lên</span>
          </Flex>
          <Flex gap="middle">
            <Rate defaultValue={1} />
            <span>trở lên</span>
          </Flex>
        </div>
      </div>

      <div className="content-main">
        <Spin spinning={isLoading} tip="Loading" size="small">
          <Tabs
            defaultActiveKey="1"
            onTabClick={(key) => setSort(convertKeyToValue(key))}
            items={[
              {
                key: "1",
                label: "Phổ biến",
                children: <></>,
              },
              {
                key: "2",
                label: "Hàng mới",
                children: <></>,
              },
              {
                key: "3",
                label: "Giá thấp đến cao",
                children: <></>,
              },
              {
                key: "4",
                label: "Giá cao xuống thấp",
                children: <></>,
              },
            ]}
          />

          <Row className="row-5-cols" gutter={[8, 16]}>
            {booksList?.map((item, key) => (
              <Col key={key} className="gutter-row col-5">
                <div className="book-item">
                  <div className="book-img">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        item.thumbnail
                      }`}
                      alt=""
                    />
                  </div>
                  <div className="book-body">
                    <p
                      className="book-mainText"
                      onClick={() => navigate(`/book/${item._id}`)}
                    >
                      {item.mainText}
                    </p>
                    <div className="book-price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </div>
                    <div className="book-other">
                      <div className="book-vote">
                        <Flex gap="middle">
                          <Rate defaultValue={5} style={{ fontSize: 13 }} />
                        </Flex>
                      </div>
                      <div className="book-sold">Đã bán {item.sold}</div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          <div className="pagination">
            {/*  */}
            <Pagination
              defaultCurrent={1}
              total={total}
              pageSize={pageSize}
              onChange={(page: number, pageSize: number) =>
                setCurrentPage(page)
              }
            />
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default HomePage;
