import clsx from "clsx";
import React, { useState } from "react";
import { FaTasks, FaTrashAlt, FaUsers, FaChevronDown, FaChevronRight } from "react-icons/fa";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
  MdFolder,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const projectLinks = [
  {
    label: "Tasks",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "in-progress/in progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    link: "todo/todo",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Team",
    link: "team",
    icon: <FaUsers />,
  },
  {
    label: "Status",
    link: "status",
    icon: <IoCheckmarkDoneOutline />,
  },
  {
    label: "Trash",
    link: "trashed",
    icon: <FaTrashAlt />,
  },
];

const otherLinks = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  
  // Check if any project link is active
  const isAnyProjectActive = projectLinks.some(link => 
    path === link.link.split("/")[0]
  );

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el, isSubItem = false }) => {
    const isActive = path === el.link.split("/")[0];
    return (
      <Link
        onClick={closeSidebar}
        to={el.link}
        className={clsx(
          "relative w-full group flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out",
          isSubItem && "ml-4",
          isActive 
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        )}
      >
        <span className={clsx(
          "text-xl transition-transform duration-300 group-hover:scale-110",
          isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
        )}>
          {el.icon}
        </span>
        <span className="font-medium">{el.label}</span>
        {isActive && (
          <span className="absolute right-4 w-2 h-2 rounded-full bg-white animate-pulse" />
        )}
      </Link>
    );
  };

  const ProjectsDropdown = () => {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsProjectsOpen(!isProjectsOpen)}
          className={clsx(
            "relative w-full group flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out",
            isAnyProjectActive 
              ? "bg-gradient-to-r from-blue-600/10 to-blue-500/10 text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          )}
        >
          <span className={clsx(
            "text-xl transition-transform duration-300 group-hover:scale-110",
            isAnyProjectActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
          )}>
            <MdFolder />
          </span>
          <span className="font-medium flex-1 text-left">Projects</span>
          <span className={clsx(
            "text-sm transition-transform duration-300",
            isProjectsOpen ? "rotate-90" : "rotate-0"
          )}>
            <FaChevronRight />
          </span>
        </button>
        
        {isProjectsOpen && (
          <div className="space-y-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            {filteredProjectLinks.map((link) => (
              <NavLink el={link} key={link.label} isSubItem={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Filter project links based on user role - admins see all, regular users see first 5
  const filteredProjectLinks = user?.isAdmin ? projectLinks : projectLinks.slice(0, 5);

  return (
    <div className="relative w-full h-full flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      {/* Logo Section */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-3 bg-blue-600 rounded-full blur-xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-500 p-2.5 rounded-xl shadow-lg">
              <MdOutlineAddTask className="text-2xl text-white" />
            </div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            OrbitPlan
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 hover:scrollbar-thumb-blue-500/30">
        {/* Dashboard Link */}
        {otherLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
        
        {/* Projects Dropdown */}
        <ProjectsDropdown />
      </div>

      {/* Settings Section */}
      <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-800">
        <button className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-300">
          <MdSettings className="text-xl" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;