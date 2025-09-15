import { Col, Row, Statistic } from "antd";
import "./show.dashboard.scss";
import { StatisticProps } from "antd/lib";
import CountUp from "react-countup";
import { getDashboardApi } from "@/services/api";
import { useEffect, useState } from "react";

const ShowDashboard = () => {
  const [data, setData] = useState<DataDashboard>({
    countOrder: 0,
    countUser: 0,
    countBook: 0,
  });

  const getDashboard = async () => {
    const res = await getDashboardApi();
    if (res.data) {
      setData(res.data);
    }
  };

  useEffect(() => {
    getDashboard();
  });

  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} separator="," duration={2} />
  );

  return (
    <>
      <Row gutter={32}>
        <Col span={8} className="gutter-row">
          <div className="item">
            <Statistic
              title="Tổng Users"
              value={data.countUser}
              formatter={formatter}
            />
          </div>
        </Col>
        <Col span={8} className="gutter-row">
          <div className="item">
            <Statistic
              title="Tổng Order"
              value={data.countOrder}
              formatter={formatter}
            />
          </div>
        </Col>
        <Col span={8} className="gutter-row">
          <div className="item">
            <Statistic
              title="Tổng Books"
              value={data.countBook}
              formatter={formatter}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ShowDashboard;
