import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Modal, notification, Table, Upload } from "antd";
import { Buffer } from "buffer";
import type { Worksheet } from "exceljs";
import excel from "exceljs";
import Password from "antd/es/input/Password";
import { createListUserApi } from "@/services/api";
import { ActionType } from "@ant-design/pro-components";

const { Dragger } = Upload;

interface TProp {
  openModalImport: boolean;
  setOpenModalImport: (v: boolean) => void;
  handleImportUser: (v: Record<string, any>[]) => void;
}

const ModalImportUser = (props: TProp) => {
  const { openModalImport, setOpenModalImport, handleImportUser } = props;

  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    customRequest({ file, onSuccess }) {
      setTimeout(() => {
        if (onSuccess) onSuccess("ok");
      }, 1000);
    }, // chỉ upload lên chứ chưa call Api
    onChange: async (info) => {
      const { status } = info.file;
      if (status !== "uploading") {
        const file = info.file.originFileObj;
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const workbook = new excel.Workbook();

          await workbook.xlsx.load(buffer);
          const jsonData: Record<string, any>[] = [];
          workbook.worksheets.forEach(function (sheet: Worksheet) {
            // read first row as data keys
            let firstRow = sheet.getRow(1);
            if (!firstRow.cellCount) return;
            let keys = firstRow.values as any[];
            sheet.eachRow((row: any, rowNumber: any) => {
              if (rowNumber == 1) return;
              let values = row.values;
              const obj: Record<string, string> = {};
              for (let i = 1; i < keys.length; i++) {
                obj[keys[i]] = values[i];
              }
              jsonData.push(obj);
            });
          });
          setDataSource(jsonData);
        }
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Modal
      title="Import data user"
      open={openModalImport}
      onOk={() => {
        setOpenModalImport(false);
        handleImportUser(dataSource);
      }}
      onCancel={() => {
        setOpenModalImport(false);
        setDataSource([]);
      }}
      okText="Import data"
      okButtonProps={{
        disabled: dataSource.length > 0 ? false : true,
      }}
      maskClosable={false} // do not close when click outside
      width="50vw"
      destroyOnClose={true}
    >
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
          <a
            href="template/template_user.xlsx"
            download
            onClick={(e) => e.stopPropagation()}
          >
            {" "}
            Download Sample File
          </a>
        </p>
      </Dragger>
      <div style={{ paddingTop: 20 }}>
        <Table
          title={() => <span>Dữ liệu upload: </span>}
          columns={[
            { dataIndex: "fullName", title: "Tên hiển thị" },
            { dataIndex: "email", title: "Email" },
            { dataIndex: "phone", title: "Số điện thoại" },
          ]}
          dataSource={dataSource}
        />
      </div>
    </Modal>
  );
};

export default ModalImportUser;
