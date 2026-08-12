import { Navigate } from "react-router-dom";

const HomeRedirect = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    switch (user.role) {
        case "admin":
            return <Navigate to="/admin/dashboard" replace />;

        case "receptionist":
            return <Navigate to="/receptionist/dashboard" replace />;

        case "employee":
            return <Navigate to="/employee/dashboard" replace />;

        default:
            return <Navigate to="/unauthorized" replace />;
    }
};

export default HomeRedirect;