import Sidebar from "../Components/organisms/Sidebar.jsx";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-64 p-6 w-full">
        {children}
      </main>
    </div>
  )
}