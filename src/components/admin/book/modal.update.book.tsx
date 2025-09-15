import { callUploadBookImg, getCategoryBook } from "@/services/api";
import { MAX_LOAD_IMAGE_SIZE } from "@/services/helper";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Row,
  Col,
  Select,
} from "antd";
import { Image, message } from "antd";
import type { GetProp, UploadProps } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { UploadFile } from "antd/lib";
import { useEffect, useState } from "react";
interface Props {
  openUpdateBook: boolean;
  handleUpdateBook: (v: IBookTable) => void;
  handleUpdateCancel: () => void;
  bookUpdate: IBookTable | null;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ModalUpdateBook = (props: Props) => {
  const { openUpdateBook, handleUpdateBook, handleUpdateCancel, bookUpdate } =
    props;
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  // select
  const [categorys, setCategorys] = useState<string[]>([]);

  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
  const [sliderList, setSliderList] = useState<UploadFile[]>([]);

  const fetchCategories = async () => {
    const res = await getCategoryBook();
    if (res.data) {
      setCategorys(res.data);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      mainText: bookUpdate?.mainText,
      author: bookUpdate?.author,
      price: bookUpdate?.price,
      category: bookUpdate?.category,
      quantity: bookUpdate?.quantity,
    });

    if (bookUpdate?.thumbnail) {
      const thumbnailFileList = [
        {
          uid: uuidv4(),
          name: bookUpdate.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            bookUpdate.thumbnail
          }`,
        },
      ];
      setThumbnailList(thumbnailFileList as any);
      form.setFieldValue("thumbnail", thumbnailFileList);
    }

    if (bookUpdate?.slider) {
      const sliderFileList = bookUpdate.slider.map((item) => ({
        uid: uuidv4(),
        name: item,
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
      }));
      setSliderList(sliderFileList as any);
      form.setFieldValue("slider", sliderFileList);
    }

    fetchCategories();
  }, [bookUpdate]);

  const listOptionCategory = categorys.map((item) => ({
    value: item,
    label: <span>{item}</span>,
  }));

  // UPLOAD
  const getBase64 = (file: FileType): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < MAX_LOAD_IMAGE_SIZE;
    if (!isLt2M) {
      message.error(`Image must smaller than ${MAX_LOAD_IMAGE_SIZE}MB!`);
    }
    return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
  };

  const handleChange = async (
    info: UploadChangeParam,
    type: "thumbnail" | "slider"
  ) => {
    if (info.file.status === "uploading") {
      type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
      return;
    }

    if (info.file.status === "done") {
      type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleUploadFile: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
    data,
  }) => {
    try {
      const res = await callUploadBookImg(file as File, "book");
      if (res?.data?.fileUploaded) {
        const fileUploaded = res.data.fileUploaded;
        const fileUrl = `${
          import.meta.env.VITE_BACKEND_URL
        }/images/book/${fileUploaded}`;

        const newFile: UploadFile = {
          uid: (file as any).uid,
          name: fileUploaded,
          url: fileUrl,
          status: "done",
        };

        if (data?.type === "thumbnail") {
          setThumbnailList([newFile]);
          form.setFieldValue("thumbnail", [newFile]);
        } else {
          const newSliderList = [...sliderList, newFile];
          setSliderList(newSliderList);
          form.setFieldValue("slider", newSliderList);
        }

        onSuccess?.("ok");
      } else {
        throw new Error(res?.message || "Upload failed");
      }
    } catch (err: any) {
      onError?.(err);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Modal
      title="Thêm mới book"
      closable={{ "aria-label": "Custom Close Button" }}
      open={openUpdateBook}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        handleUpdateCancel();
      }}
      okText={"Cập nhật"}
      cancelText={"Hủy"}
      width="50vw"
    >
      <br />
      <Form
        name="basic"
        autoComplete="off"
        layout="vertical"
        form={form}
        onFinish={(values) => {
          const payload = {
            ...values,
            _id: bookUpdate?._id,
            thumbnail: thumbnailList?.[0]?.name || "",
            slider: sliderList?.map((item) => item.name) || [],
          };

          handleUpdateBook(payload);
        }}
      >
        <Row gutter={16}>
          <Col span={12} className="gutter-row">
            <Form.Item<IBookTable>
              labelCol={{ span: 16 }}
              label="Tên sách"
              name="mainText"
              rules={[
                { required: true, message: "Tên sách không được để trống" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12} className="gutter-row">
            <Form.Item<IBookTable>
              labelCol={{ span: 16 }}
              label="Tác giả"
              name="author"
              rules={[
                { required: true, message: "Tác giả không được để trống" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6} className="gutter-row">
            <Form.Item<IBookTable>
              labelCol={{ span: 12 }}
              label="Giá tiền"
              name="price"
              rules={[
                { required: true, message: "Giá tiền không được để trống" },
              ]}
            >
              <InputNumber
                addonAfter="đ"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                }
              />
            </Form.Item>
          </Col>
          <Col span={6} className="gutter-row">
            <Form.Item<IBookTable>
              labelCol={{ span: 12 }}
              label="Thể loại"
              name="category"
              rules={[
                { required: true, message: "Thể loại không được để trống" },
              ]}
            >
              <Select options={listOptionCategory} />
            </Form.Item>
          </Col>
          <Col span={12} className="gutter-row">
            <Form.Item<IBookTable>
              labelCol={{ span: 24 }}
              label="Số lượng"
              name="quantity"
              rules={[
                { required: true, message: "Số lượng không được để trống" },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12} className="gutter-row">
            <Form.Item<IBookTable>
              labelCol={{ span: 24 }}
              label="Ảnh Thumbnail"
              name="thumbnail"
              rules={[
                { required: true, message: "Vui lòng nhập upload thumbnail" },
              ]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                fileList={thumbnailList}
                maxCount={1}
                customRequest={(options) =>
                  handleUploadFile({ ...options, data: { type: "thumbnail" } })
                }
                beforeUpload={beforeUpload}
                onChange={(info) => handleChange(info, "thumbnail")}
                onPreview={handlePreview}
                onRemove={(file) => {
                  setThumbnailList([]);
                }}
              >
                {uploadButton}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12} className="gutter-row">
            <Form.Item<IBookTable>
              labelCol={{ span: 24 }}
              label="Ảnh Slider"
              name="slider"
              rules={[
                { required: true, message: "Vui lòng nhập upload thumbnail" },
              ]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                fileList={sliderList}
                showUploadList={true}
                customRequest={(options) =>
                  handleUploadFile({ ...options, data: { type: "slider" } })
                }
                beforeUpload={beforeUpload}
                onChange={(info) => handleChange(info, "slider")}
                onPreview={handlePreview}
                onRemove={(file) => {
                  setSliderList((prev) =>
                    prev.filter((f) => f.uid !== file.uid)
                  );
                }}
              >
                {" "}
                {uploadButton}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalUpdateBook;
