import Footer from "@/components/dashboard/footer/footer";
import Navbar from "@/components/dashboard/navbar/navbar";
import Sidebar from "@/components/dashboard/sidebar/sidebar";

const Layout = ({ children }: { children: any }) => {
  return (
    <div className="flex">
      <div className="bgSoft p-6 min-h-screen w-[25%]">
        <Sidebar />
      </div>
      <div className="flex-1 p-6">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
