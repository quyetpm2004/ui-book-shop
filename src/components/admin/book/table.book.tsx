import {
  createBookApi,
  deleteBookApi,
  getBookApi,
  updateBookApi,
} from "@/services/api";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { App, Button, Drawer, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import ModalDetailBook from "./modal.detail.book";
import ModalCreateBook from "./modal.create.book";
import ModalUpdateBook from "./modal.update.book";
import { Data } from "react-csv/lib/core";

const TableBook = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<IBookTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Id",
      dataIndex: "_id",
      ellipsis: true,
      search: false,
      render: (_, record) => (
        <Link
          to={"#"}
          onClick={() => {
            setOpenDetailBook(true);
            setDataDetail(record);
          }}
        >
          {" "}
          {record._id}{" "}
        </Link>
      ),
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: true,
      search: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      hideInSearch: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
      search: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: true,
      hideInSearch: true,
      render: (_, record) => (
        <>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(record.price)}
        </>
      ),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      valueType: "date",
      hideInSearch: true,
      sorter: true,
    },
    {
      title: "Action",
      render: (text, record, _, action) => [
        <div>
          <EditOutlined
            style={{ marginRight: 15, color: "#f57800" }}
            onClick={() => {
              setBookUpdate(record);
              setOpenUpdateBook(true);
            }}
          />
          <Popconfirm
            title="Delete user"
            description={`Bạn có chắc chắn muốn xóa book ${record.mainText} không`}
            okText="Delete"
            cancelText="Hủy"
            onConfirm={(e) => handleDeleteBook(record._id)}
          >
            <DeleteOutlined style={{ color: "#f57800" }} />
          </Popconfirm>
        </div>,
      ],
      search: false,
    },
  ];

  // filter, sort
  const [meta, setMeta] = useState<IMeta>({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  const { fication } = App.useApp();

  // view detail
  const [openDetailBook, setOpenDetailBook] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<IBookTable | null>(null);

  // create book
  const [openCreateBook, setOpenCreateBook] = useState<boolean>(false);
  const handleCreateBook = async (values: IBookTable) => {
    console.log("hehe", values);
    const { mainText, author, price, quantity, category, thumbnail, slider } =
      values;
    const res = await createBookApi(
      mainText,
      author,
      price,
      quantity,
      category,
      thumbnail,
      slider
    );

    if (res.data) {
      message.success("Thêm mới book thành công");
      setOpenCreateBook(false);
      actionRef.current?.reload();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };
  const handleCancel = () => {
    setOpenCreateBook(false);
  };

  // update book
  const [bookUpdate, setBookUpdate] = useState<IBookTable | null>(null);
  const [openUpdateBook, setOpenUpdateBook] = useState<boolean>(false);
  const handleUpdateBook = async (values: IBookTable) => {
    console.log("hehe", values);
    const {
      mainText,
      author,
      price,
      quantity,
      category,
      thumbnail,
      slider,
      _id,
    } = values;
    const res = await updateBookApi(
      mainText,
      author,
      price,
      quantity,
      category,
      thumbnail,
      slider,
      _id
    );

    if (res.data) {
      message.success("Update book thành công");
      setOpenUpdateBook(false);
      actionRef.current?.reload();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };
  const handleUpdateCancel = () => {
    setOpenUpdateBook(false);
  };

  // delete book
  const handleDeleteBook = async (_id: string) => {
    const res = await deleteBookApi(_id);
    if (res.data) {
      message.success("Delete thành công");
      actionRef.current?.reload();
    } else {
      message.error("Có lỗi xảy ra");
    }
  };

  // export book
  const [bookExport, setBookExport] = useState<IBookTable[] | Data>([]);

  return (
    <>
      <ProTable<IBookTable>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.mainText) {
              query += `&mainText=/${params.mainText}/i`;
            }
            if (params.author) {
              query += `&author=/${params.author}/i`;
            }
          }
          if (sort?.updatedAt) {
            const order = sort.updatedAt === "ascend" ? "" : "-";
            query += `&sort=${order}updatedAt`;
          } else if (sort?.price) {
            const order = sort.price === "ascend" ? "" : "-";
            query += `&sort=${order}price`;
          } else {
            query += "&sort=-updatedAt";
          }

          const res = await getBookApi(query);
          if (res.data) {
            setMeta(res.data.meta);
            setBookExport(res.data.result);
          }
          return {
            data: res.data?.result,
            page: 1,
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="_id"
        pagination={{
          pageSize: meta.pageSize,
          current: meta.current,
          total: meta.total,
          showSizeChanger: true,
        }}
        headerTitle="Table user"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenCreateBook(true);
              //   actionRef.current?.reload();
            }}
            type="primary"
          >
            Add new
          </Button>,
          <Button key="button" icon={<ExportOutlined />} type="primary">
            <CSVLink data={bookExport} filename="export-book.csv">
              Export
            </CSVLink>
          </Button>,
        ]}
      />
      <Drawer
        title="Chức năng xem chi tiết"
        closable={{ "aria-label": "Close Button" }}
        onClose={() => setOpenDetailBook(false)}
        open={openDetailBook}
        width="60vw"
      >
        {openDetailBook && dataDetail && <ModalDetailBook data={dataDetail} />}
      </Drawer>
      <ModalCreateBook
        openCreateBook={openCreateBook}
        handleCreateBook={handleCreateBook}
        handleCancel={handleCancel}
      />
      <ModalUpdateBook
        openUpdateBook={openUpdateBook}
        handleUpdateBook={handleUpdateBook}
        handleUpdateCancel={handleUpdateCancel}
        bookUpdate={bookUpdate}
      />
    </>
  );
};

export default TableBook;
