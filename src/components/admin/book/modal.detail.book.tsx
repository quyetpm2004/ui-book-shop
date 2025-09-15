import React, { useState } from "react";
import { Avatar, Badge, Descriptions, Divider } from "antd";
import type { DescriptionsProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { v4 as uuidv4 } from "uuid";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ModalDetailBook = ({ data }: { data: IBookTable }) => {
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Id",
      children: <p>{data?._id}</p>,
    },
    {
      key: "2",
      label: "Tên sách",
      children: <p>{data?.mainText}</p>,
    },
    {
      key: "3",
      label: "Tác giả",
      children: <p>{data?.author}</p>,
    },
    {
      key: "4",
      label: "Số giá tiền",
      children: (
        <p>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(data?.price)}
        </p>
      ),
    },
    {
      key: "5",
      label: "Thể loại",
      children: <Badge status="processing" text={data?.category} />,
      span: 2,
    },
    {
      key: "7",
      label: "Created At",
      children: <p>{new Date(data?.createdAt).toLocaleDateString("vi-VN")}</p>,
    },
    {
      key: "8",
      label: "Updated At",
      children: <p>{new Date(data?.updatedAt).toLocaleDateString("vi-VN")}</p>,
    },
  ];

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  // handle file

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const images: UploadFile[] = data.slider
    .concat(data.thumbnail)
    .map((item, key) => {
      return {
        uid: uuidv4(),
        name: item,
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
      };
    });
  const [fileList, setFileList] = useState<UploadFile[]>(images);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  //   const uploadButton = (
  //     <button style={{ border: 0, background: "none" }} type="button">
  //       <PlusOutlined />
  //       <div style={{ marginTop: 8 }}>Upload</div>
  //     </button>
  //   );

  return (
    <>
      <Descriptions title="Thông tin book" bordered items={items} column={2} />
      <div style={{ marginTop: 20 }}>
        <Divider orientation="left">Ảnh Books</Divider>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        ></Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </div>
    </>
  );
};

export default ModalDetailBook;
