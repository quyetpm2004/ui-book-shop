import { getOrderApi } from "@/services/api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Popconfirm } from "antd";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

const TableOrder = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  const columns: ProColumns<IOrderTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "ID",
      dataIndex: "_id",
      search: false,
      render: (_, record) => <Link to={"#"}>{record._id}</Link>,
    },
    {
      title: "Full Name",
      dataIndex: "name",
      search: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      search: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "totalPrice",
      valueType: "money",
      sorter: true,
      hideInSearch: true,
      render: (_, record) => record.totalPrice.toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
  ];

  return (
    <ProTable<IOrderTable>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort) => {
        let query = `current=${params.current}&pageSize=${params.pageSize}`;

        if (params.name) query += `&name=/${params.name}/i`;
        if (params.address) query += `&address=/${params.address}/i`;

        if (params.startTime && params.endTime) {
          query += `&createdAt>=${params.startTime}&createdAt<=${params.endTime}`;
        }

        if (sort?.totalPrice) {
          const order = sort.totalPrice === "ascend" ? "" : "-";
          query += `&sort=${order}totalPrice`;
        } else if (sort?.createdAt) {
          const order = sort.createdAt === "ascend" ? "" : "-";
          query += `&sort=${order}createdAt`;
        } else {
          query += `&sort=-createdAt`;
        }

        const res = await getOrderApi(query);
        if (res.data) {
          setMeta(res.data.meta);
        }

        return {
          data: res.data?.result || [],
          page: 1,
          success: true,
          total: res.data?.meta.total || 0,
        };
      }}
      rowKey="_id"
      pagination={{
        pageSize: meta.pageSize,
        current: meta.current,
        total: meta.total,
        showSizeChanger: true,
      }}
      headerTitle="Table Order"
    />
  );
};

export default TableOrder;
