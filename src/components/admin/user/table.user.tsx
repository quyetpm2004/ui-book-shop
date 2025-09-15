import {
  createListUserApi,
  createUserApi,
  deleteUserApi,
  getUserApi,
  registerApi,
  updateUserApi,
} from "@/services/api";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { App, Button, Drawer, Modal, Popconfirm, Space, Tag } from "antd";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModalDetailUser from "./modal.detail.user";
import ModalCreateUser from "./modal.create.user";
import type { FormProps } from "antd";
import ModalImportUser from "./data/modal.import.user";
import ModalUpdateUser from "./modal.update.user";
import { PopconfirmProps } from "antd/lib";
import { CSVLink, CSVDownload } from "react-csv";
import { Data } from "react-csv/lib/core";

type FieldType = {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
};

const TableUser = () => {
  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "_id",
      dataIndex: "_id",
      ellipsis: true,
      search: false,
      render: (_, record) => (
        <Link to={"#"} onClick={() => showDrawer(record)}>
          {" "}
          {record._id}{" "}
        </Link>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
      search: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "dateRange",
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
      sorter: true,
    },
    {
      title: "Action",
      render: (text, record, _, action) => [
        <div>
          <EditOutlined
            style={{ marginRight: 15, color: "#f57800" }}
            onClick={() => {
              setUserUpdate(record);
              setOpenUpdateUser(true);
            }}
          />
          <Popconfirm
            title="Delete user"
            description={`Bạn có chắc chắn muốn xóa user ${record.fullName} không`}
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            cancelText="Hủy"
          >
            <DeleteOutlined style={{ color: "#f57800" }} />
          </Popconfirm>
        </div>,
      ],
      search: false,
    },
  ];
  // modal create user
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const actionRef = useRef<ActionType>();
  const { message, notification } = App.useApp();

  const showModal = () => {
    setIsModalOpen(true);
  };

  // create user
  const onFinish: FormProps<FieldType>["onFinish"] = async ({
    fullName,
    email,
    password,
    phone,
  }) => {
    const res = await createUserApi(
      fullName as string,
      email as string,
      password as string,
      phone as string
    );

    if (res.error) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    } else {
      message.success("Thêm mới user thành công");
      setIsSuccess(true);
      setIsModalOpen(false);
      actionRef?.current?.reload();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const [open, setOpen] = useState(false);
  const [dataDetail, setDataDetail] = useState<IUserTable | null>(null);

  const showDrawer = (data: IUserTable) => {
    setOpen(true);
    setDataDetail(data);
  };

  const onClose = () => {
    setOpen(false);
  };

  // modal import data
  const [openModalImport, setOpenModalImport] = useState<boolean>(false);

  // modal update user
  const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);
  const [userUpdate, setUserUpdate] = useState<IUserTable | null>(null);

  const handleUpdate = async (values: FieldType) => {
    const { fullName, email, phone } = values;
    const _id = userUpdate?._id;
    const res = await updateUserApi(
      _id as string,
      fullName as string,
      phone as string
    );
    if (res.data) {
      message.success("Update user thành công!");
      setOpenUpdateUser(false);
      actionRef?.current?.reload();
    } else {
      message.error("Có lỗi xảy ra, vui lòng thực hiện lại");
    }
  };

  // delete user
  const handleDelete = async (_id: string) => {
    const res = await deleteUserApi(_id);
    if (res.data) {
      message.success("Delete user thành công!");
      actionRef?.current?.reload();
    } else {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  // import user
  const handleImportUser = async (dataSource: Record<string, any>[]) => {
    for (let i = 0; i < dataSource.length; i++) {
      dataSource[i] = {
        ...dataSource[i],
        password: "123456",
      };
    }
    const res = await createListUserApi(dataSource);
    if (res.data) {
      notification.success({
        description: "Bulk Create Users",
        message: `Success ${res.data.countSuccess}; Error ${res.data.countError}`,
      });
      actionRef?.current?.reload();
    }
  };

  // export user
  const [userExport, setUserExport] = useState<IUserTable[] | Data>([]);

  return (
    <>
      <ProTable<IUserTable>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.fullName) {
              query += `&fullName=/${params.fullName}/i`;
            }
            if (params.email) {
              query += `&email=/${params.email}/i`;
            }
            if (params.startTime && params.endTime) {
              query += `&createdAt>=${params.startTime}&createdAt<=${params.endTime}`;
            }
          }
          if (sort?.createdAt) {
            const order = sort.createdAt === "ascend" ? "" : "-";
            query += `&sort=${order}createdAt`;
          } else {
            query += `&sort=-createdAt`;
          }

          const res = await getUserApi(query);
          if (res.data) {
            setMeta(res.data.meta);
            setUserExport(res.data.result);
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
              showModal();
              actionRef.current?.reload();
            }}
            type="primary"
          >
            Add new
          </Button>,
          <Button key="button" icon={<ExportOutlined />} type="primary">
            <CSVLink data={userExport} filename="export-user.csv">
              Export
            </CSVLink>
          </Button>,
          <Button
            icon={<ImportOutlined />}
            type="primary"
            onClick={() => setOpenModalImport(true)}
          >
            Import
          </Button>,
        ]}
      />
      <Drawer
        title="Chức năng xem chi tiết"
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
        width={700}
      >
        {dataDetail && <ModalDetailUser data={dataDetail} />}
      </Drawer>
      <ModalCreateUser
        isModalOpen={isModalOpen}
        onFinish={onFinish}
        handleCancel={handleCancel}
        isSuccess={isSuccess}
      />
      <ModalImportUser
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
        handleImportUser={handleImportUser}
      />
      {userUpdate && (
        <ModalUpdateUser
          openUpdateUser={openUpdateUser}
          setOpenUpdateUser={setOpenUpdateUser}
          userUpdate={userUpdate}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default TableUser;
