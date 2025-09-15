import { Skeleton, Row, Col, Space } from "antd";

const BookLoader = () => {
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={12} className="gutter-row">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Skeleton.Image
              active
              style={{
                width: 500,
                height: 400,
                borderRadius: 8,
                objectFit: "cover",
              }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Skeleton.Image
                active
                style={{ width: 70, height: 90, borderRadius: 4 }}
              />
              <Skeleton.Image
                active
                style={{ width: 70, height: 90, borderRadius: 4 }}
              />
              <Skeleton.Image
                active
                style={{ width: 70, height: 90, borderRadius: 4 }}
              />
            </div>
          </div>
        </Col>

        {/* Thông tin bên phải */}
        <Col span={12} className="gutter-row">
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Skeleton.Input active size="large" style={{ width: "60%" }} />
            <Skeleton.Input active size="large" style={{ width: 180 }} />
            <Skeleton.Input active size="large" style={{ width: "30%" }} />
            <Skeleton.Input active size="small" style={{ width: "50%" }} />
            <Skeleton.Input active size="default" style={{ width: "30%" }} />
            <Skeleton.Button active size="large" style={{ width: 160 }} />
            <Skeleton.Button active size="large" style={{ width: 160 }} />
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default BookLoader;
