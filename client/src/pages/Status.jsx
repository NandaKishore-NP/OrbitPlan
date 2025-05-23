import React from "react";
import { useGetUserTaskStatusQuery } from "../redux/slices/api/userApiSlice";
import { countTasksByStage, getInitials } from "../utils";
import { Loading, Title } from "../components";

const StatusPage = () => {
  const { data, isLoading } = useGetUserTaskStatusQuery();

  if (isLoading)
    <div className='py-10'>
      <Loading />
    </div>;

  const TableHeader = () => (
    <thead className='border-b border-gray-300 dark:border-gray-600'>
      <tr className='text-black dark:text-white  text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Title</th>
        <th className='py-2'>Task Progress</th>
        <th className='py-2'>Task Numbers</th>
        <th className='py-2'>Total Task</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => {
    const counts = countTasksByStage(user?.tasks);

    return (
      <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
        <td className='p-2'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700'>
              <span className='text-xs md:text-sm text-center'>
                {getInitials(user.name)}
              </span>
            </div>
            {user.name}
          </div>
        </td>
        <td className='p-2'>{user.title}</td>
        <td className='p-2'>
          {
            <div className='flex items-center gap-2 text-white text-sm'>
              <p className='px-2 py-1 bg-blue-600 rounded'>
                {(counts.inProgress * 100).toFixed(1)}%
              </p>
              <p className='px-2 py-1 bg-amber-600 rounded'>
                {(counts.todo * 100).toFixed(1)}%
              </p>
              <p className='px-2 py-1 bg-emerald-600 rounded'>
                {(counts.completed * 100).toFixed(1)}%
              </p>
            </div>
          }
        </td>

        <td className='p-2 flex gap-3'>
          <span>{counts.inProgress}</span> {" | "}
          <span>{counts.todo}</span>
          {" | "}
          <span>{counts.completed}</span>
        </td>

        <td className='p-2'>
          <span>{user?.tasks?.length}</span>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='User Task Status' />
        </div>
        <div className='bg-white dark:bg-[#1f1f1f] px-2 md:px-4 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {data?.map((user, index) => (
                  <TableRow key={index} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusPage;
