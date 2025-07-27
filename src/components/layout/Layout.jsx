import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout-root">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
}
