import { getHistoryOrder } from "@/services/api";
import { Drawer, Space, Table, Tag } from "antd";
import { TableProps } from "antd/lib";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const History = () => {
  const [data, setData] = useState<IHistory[]>([]);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<IHistory>();

  const columns: TableProps<IHistory>["columns"] = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 70,
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => value.toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Trạng thái",
      dataIndex: "paymentStatus",
      key: "status",
      render: () => <Tag color="green">Thành công</Tag>,
    },
    {
      title: "Chi tiết",
      key: "detail",
      render: (_, record) => (
        <a
          onClick={() => {
            setDataDetail(record);
            setOpenDetail(true);
          }}
        >
          Xem chi tiết
        </a>
      ),
    },
  ];

  const getHistory = async () => {
    const res = await getHistoryOrder();
    if (res.data) {
      const transformed = res.data.map((item: IHistory, index: number) => ({
        ...item,
        key: item._id,
        stt: index + 1,
        time: new Date(item.createdAt).toLocaleString("vi-VN"),
        status: "PAID",
      }));
      setData(transformed);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <>
      <div style={{ maxWidth: 1340, margin: "0 auto" }}>
        <p style={{ padding: "20px 0" }}>Lịch sử mua hàng</p>
        <Table<IHistory> columns={columns} dataSource={data} bordered />
      </div>
      <Drawer
        title="Chi tiết đơn hàng"
        closable={{ "aria-label": "Close Button" }}
        onClose={() => setOpenDetail(false)}
        open={openDetail}
      >
        <ul>
          {dataDetail?.detail?.map((item) => (
            <li key={item._id}>
              Tên sách: {item.bookName}, số lượng: {item.quantity}
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  );
};

export default History;
