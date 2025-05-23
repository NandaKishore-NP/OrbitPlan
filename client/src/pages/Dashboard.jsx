import clsx from "clsx";
import moment from "moment";
import React, { useEffect } from "react";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { LuClipboardEdit } from "react-icons/lu";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { Chart, Loading, UserInfo } from "../components";
import { useGetDasboardStatsQuery } from "../redux/slices/api/taskApiSlice";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import { useSelector } from "react-redux";

const Card = ({ label, count, bg, icon }) => {
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
      {/* Background gradient effect */}
      <div
        className={clsx(
          "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300",
          bg.replace("bg-", "bg-opacity-50 bg-")
        )}
      />

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative flex items-center justify-between">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-bold text-gray-800 dark:text-white">{count}</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">111 last month</span>
          </div>
        </div>

        <div
          className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center text-white transform group-hover:scale-110 transition-all duration-300",
            bg
          )}
        >
          <span className="text-xl">{icon}</span>
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className={clsx(
          "absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300",
          bg
        )}
      />
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading, error } = useGetDasboardStatsQuery();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const totals = data?.tasks || [];

  if (isLoading)
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: data?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "COMPLTED TASK",
      total: totals["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS ",
      total: totals["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODOS",
      total: totals["todo"],
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]" || 0,
    },
  ];

  return (
    <div className='h-full space-y-6 py-6'>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your tasks today.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
        {stats?.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

      {/* Chart Section */}
      <div className='relative w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl overflow-hidden'>
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-violet-50/50 dark:from-blue-900/20 dark:to-violet-900/20 opacity-50" />

        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className='text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent'>
                Task Distribution
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Analysis by priority level
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/30"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Low</span>
              </div>
            </div>
          </div>
          <div className="transform transition-transform duration-300 hover:scale-[1.01]">
            <Chart data={data?.graphData} />
          </div>
        </div>
      </div>

      <div className='w-full flex flex-col md:flex-row gap-6 2xl:gap-10'>
        {/* RECENT TASKS */}
        {data && <TaskTable tasks={data?.last10Task} />}
        {/* RECENT USERS */}
        {data && user?.isAdmin && <UserTable users={data?.users} />}
      </div>
    </div>
  );
};

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead>
      <tr className='text-gray-600 dark:text-gray-300 text-left border-b border-gray-200 dark:border-gray-700'>
        <th className='pb-3 font-medium'>Full Name</th>
        <th className='pb-3 font-medium'>Status</th>
        <th className='pb-3 font-medium'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='group border-b border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 transition-all duration-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'>
      <td className='py-4'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <div className='absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-300'></div>
            <div className='relative w-10 h-10 rounded-full text-white flex items-center justify-center text-sm bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg transform group-hover:scale-110 transition-all duration-300 hover:shadow-indigo-500/25'>
              <span className='text-center font-medium'>{getInitials(user?.name)}</span>
            </div>
          </div>
          <div>
            <p className='font-medium text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200'> 
              {user.name}
            </p>
            <span className='text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200'>
              {user?.role}
            </span>
          </div>
        </div>
      </td>

      <td>
        <div
          className={clsx(
            "w-fit px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
            user?.isActive 
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20" 
              : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20",
            "group-hover:shadow-lg group-hover:-translate-y-0.5"
          )}
        >
          <div className="flex items-center gap-1.5">
            <span className={clsx(
              "w-1.5 h-1.5 rounded-full",
              user?.isActive ? "bg-emerald-500" : "bg-amber-500",
              "animate-pulse"
            )} />
            {user?.isActive ? "Active" : "Disabled"}
          </div>
        </div>
      </td>
      <td className='py-4'>
        <span className='text-sm text-gray-500 dark:text-gray-400 font-medium group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200'>
          {moment(user?.createdAt).fromNow()}
        </span>
      </td>
    </tr>
  );

  return (
    <div className='w-full md:w-1/3 bg-white dark:bg-gray-800 p-6 shadow-lg rounded-2xl transform transition-all duration-300 hover:shadow-xl'>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Users</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Latest user activities and status</p>
      </div>
      <div className="overflow-x-auto">
        <table className='w-full mb-5'>
          <TableHeader />
          <tbody>
            {users?.map((user, index) => (
              <TableRow key={index + user?._id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TaskTable = ({ tasks }) => {
  const { user } = useSelector((state) => state.auth);

  const ICONS = {
    high: <MdKeyboardDoubleArrowUp className="animate-bounce" />,
    medium: <MdKeyboardArrowUp className="animate-pulse" />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead>
      <tr className='text-gray-600 dark:text-gray-300 text-left border-b border-gray-200 dark:border-gray-700'>
        <th className='pb-3 font-medium'>Task Title</th>
        <th className='pb-3 font-medium'>Priority</th>
        <th className='pb-3 font-medium'>Team</th>
        <th className='pb-3 font-medium hidden md:block'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='group border-b border-gray-100 dark:border-gray-800 text-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-300'>
      <td className='py-4'>
        <div className='flex items-center gap-3'>
          <div
            className={clsx(
              "w-3 h-3 rounded-full ring-2 ring-offset-2 dark:ring-offset-gray-800 transition-all duration-300",
              TASK_TYPE[task.stage],
              task.stage === 'completed' ? 'ring-green-500/30 group-hover:ring-green-500/50' : 
              task.stage === 'in progress' ? 'ring-yellow-500/30 group-hover:ring-yellow-500/50' : 'ring-blue-500/30 group-hover:ring-blue-500/50',
              "group-hover:scale-125 group-hover:ring-offset-4"
            )}
          >
            <div className={clsx(
              "w-full h-full rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300",
              task.stage === 'completed' ? 'bg-green-500' : 
              task.stage === 'in progress' ? 'bg-yellow-500' : 'bg-blue-500'
            )} />
          </div>
          <div>
            <p className='text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200'>
              {task?.title}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
              {task?.stage}
            </span>
          </div>
        </div>
      </td>
      <td className='py-4'>
        <div className="flex gap-2 items-center">
          <span className={clsx(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
            task?.priority === 'high' 
              ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-500/20" 
              : task?.priority === 'medium'
              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20"
              : "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-500/20",
            "group-hover:shadow-lg group-hover:-translate-y-0.5"
          )}>
            <span className="text-lg transform group-hover:scale-110 transition-transform duration-200">
              {ICONS[task?.priority]}
            </span>
            <span className='capitalize'>{task?.priority}</span>
          </span>
        </div>
      </td>

      <td className='py-2'>
        <div className='flex -space-x-2 hover:space-x-1 transition-all duration-300'>
          {task?.team.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-8 h-8 rounded-full text-white flex items-center justify-center text-sm border-2 border-white dark:border-gray-800 transform transition-all duration-300",
                BGS[index % BGS?.length],
                "hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>

      <td className='py-2 hidden md:block'>
        <span className='text-sm text-gray-500 dark:text-gray-400 font-medium'>
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );

  return (
    <div
      className={clsx(
        "w-full bg-white dark:bg-gray-800 p-6 shadow-lg rounded-2xl transform transition-all duration-300 hover:shadow-xl",
        user?.isAdmin ? "md:w-2/3" : ""
      )}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Tasks</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Latest task updates and assignments</p>
      </div>
      <div className="overflow-x-auto">
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {tasks.map((task, id) => (
              <TableRow key={task?._id + id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
