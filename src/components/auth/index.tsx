import { Button, Result } from "antd";
import { useCurrentApp } from "components/context/app.context";
import { Link, useLocation } from "react-router-dom";

interface TProps {
  children: React.ReactNode;
}

const ProtectedRoute = (props: TProps) => {
  const { isAuthenticated, user } = useCurrentApp();
  const location = useLocation();

  const isAdminRoute = location.pathname.includes("admin");

  if (!isAuthenticated) {
    return (
      <Result
        status="404"
        title="Not Login"
        subTitle="Bạn vui lòng đăng nhập để sử dụng tính năng này"
        extra={
          <Button type="primary">
            <Link to={"/login"}>Back Home</Link>
          </Button>
        }
      />
    );
  } else if (isAuthenticated && isAdminRoute) {
    const role = user?.role;
    if (role === "USER") {
      return (
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button type="primary">
              <Link to={"/"}>Back Home</Link>
            </Button>
          }
        />
      );
    }
  }

  return props.children;
};

export default ProtectedRoute;
