import React from "react";
import { Avatar, Badge, Descriptions } from "antd";
import type { DescriptionsProps } from "antd";

const ModalDetailUser = ({ data }: { data: IUserTable }) => {
  const avatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    data.avatar
  }`;

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Id",
      children: <p>{data?._id}</p>,
    },
    {
      key: "2",
      label: "Tên hiển thị",
      children: <p>{data?.fullName}</p>,
    },
    {
      key: "3",
      label: "Email",
      children: <p>{data?.email}</p>,
    },
    {
      key: "4",
      label: "Số điện thoại",
      children: <p>{data?.phone}</p>,
    },
    {
      key: "5",
      label: "Role",
      children: <Badge status="processing" text={data?.role} />,
    },
    {
      key: "7",
      label: "Avatar",
      children: <Avatar size={40} src={avatar}></Avatar>,
    },
    {
      key: "8",
      label: "Created At",
      children: <p>{new Date(data?.createdAt).toLocaleDateString("vi-VN")}</p>,
    },
    {
      key: "9",
      label: "Updated At",
      children: <p>{new Date(data?.updatedAt).toLocaleDateString("vi-VN")}</p>,
    },
  ];

  return (
    <>
      <Descriptions title="Thông tin user" bordered items={items} column={2} />
    </>
  );
};

export default ModalDetailUser;
