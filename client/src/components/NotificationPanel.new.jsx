import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import {
  useGetNotificationsQuery,
  useMarkNotiAsReadMutation,
} from "../redux/slices/api/userApiSlice";
import ViewNotification from "./ViewNotification";

const ICONS = {
  alert: <HiBellAlert className="h-5 w-5 text-gray-600" />,
  message: <BiSolidMessageRounded className="h-5 w-5 text-gray-600" />,
};

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data, refetch } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotiAsReadMutation();

  const viewHandler = (el) => {
    setSelected(el);
    readHandler("one", el._id);
    setOpen(true);
  };

  const readHandler = async (type, id) => {
    try {
      await markAsRead({ type, id }).unwrap();
      refetch();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <>
      <Popover className="relative">
        {({ open: isPanelOpen }) => (
          <>
            <Popover.Button className="group relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
              <div className="relative">
                <IoIosNotificationsOutline className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-200" />
                {data?.notifications?.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                )}
              </div>
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 sm:w-96 transform">
                <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg ring-1 ring-gray-200 dark:ring-gray-800">
                  <div className="relative bg-white dark:bg-gray-900 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Notifications
                      </h2>
                      <button
                        onClick={() => readHandler("all", "")}
                        className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                      {data?.notifications?.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-gray-500 dark:text-gray-400">
                            No new notifications
                          </p>
                        </div>
                      ) : (
                        data?.notifications?.map((noti) => (
                          <button
                            key={noti._id}
                            onClick={() => viewHandler(noti)}
                            className={`w-full flex items-start space-x-3 p-3 rounded-xl transition-all duration-200 ${
                              noti.isRead
                                ? "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
                                : "bg-blue-50 dark:bg-blue-900/20"
                            }`}
                          >
                            <div className={`flex-shrink-0 mt-1 ${
                              noti.isRead ? "" : "animate-pulse"
                            }`}>
                              {ICONS[noti.type || "alert"]}
                            </div>
                            <div className="flex-1 text-left">
                              <p className={`text-sm ${
                                noti.isRead
                                  ? "text-gray-600 dark:text-gray-400"
                                  : "text-gray-900 dark:text-gray-100 font-medium"
                              }`}>
                                {noti.text}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {moment(noti.createdAt).fromNow()}
                              </p>
                            </div>
                            {!noti.isRead && (
                              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>

      <ViewNotification open={open} setOpen={setOpen} noti={selected} />
    </>
  );
}
