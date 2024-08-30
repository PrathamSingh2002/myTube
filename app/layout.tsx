'use client'
import "./globals.css";
import Link from "next/link";
import { Provider } from "react-redux";
import { store } from "./store/store";
import DropDown from "@/components/dropDown";
import VideoUploadDropDown from "@/components/videoUploadDropdown";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider store={store}>
        <body className="bg-gray-100 min-h-screen">
          <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="hidden sm:flex-shrink-0 sm:flex sm:items-center">
                    <Link href="/home" className="text-2xl font-bold text-indigo-600">HostVideo</Link>
                  </div>
                  <div className="flex ml-6 space-x-8 sm:ml-6 sm:flex sm:space-x-8">
                    <div className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 transition duration-150 ease-in-out">
                      <VideoUploadDropDown/>
                    </div>
                  </div>
                </div>
                <div className=" flex items-center ml-6">
                  <DropDown />
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </body>
      </Provider>
    </html>
  );
}

const NavLink = ({ href, children, icon }:any) => (
  <Link href={href} className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 transition duration-150 ease-in-out">
    <span className="mr-2">{icon}</span>
    {children}
  </Link>
);