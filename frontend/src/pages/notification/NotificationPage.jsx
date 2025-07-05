import { Link } from "react-router-dom";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatPostDate } from "../../utils/date"; 

const NotificationPage = () => {

	const queryClient = useQueryClient() 

	const {data:notifications, isLoading } = useQuery({
		queryKey:["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/api/v1/notifications/all`,{
					method:"GET",
					credentials:"include"
				})
				const data = await res.json()
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}
				return data
			} catch (error) {
				throw new Error(error.message)
			}
		}
	})

	const {mutate:deleteNotifications, isPending } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/api/v1/notifications/delete`,{
					method: "DELETE",
					credentials:"include"
				});
				const data = await res.json()
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}
				return data
			} catch (error) {
				throw new Error(error.message)
			}
		},
		onSuccess: (data)=>{
			toast.success(data.message || "All Notifications Deleted");
			queryClient.invalidateQueries({queryKey: [ "notifications" ] })
		},
		onError: (error) => {
			toast.error(error.message || "Something Went Wrong")
		}
	})
	const handleDelete = () =>{
		if(isPending) return;
		deleteNotifications();
	}
	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={handleDelete}>
									{isPending ? "Deleting..." : "Delete all notifications"}
								</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex justify-between items-center p-4'>
						{/* Left side: Icon + info */}
						<div className='flex items-center gap-3'>
							{notification.type === "follow" && <FaUser className='w-6 h-6 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-6 h-6 text-red-500' />}

							<Link to={`/profile/${notification.from.username}`} className='flex items-center gap-2'>
							<div className='avatar'>
								<div className='w-8 rounded-full'>
								<img src={notification.from.profileImage || "/avatar-placeholder.png"} />
								</div>
							</div>
							<div className='flex flex-col'>
								<span className='font-bold'>@{notification.from.username}</span>
								<span className='text-sm text-gray-400'>
								{notification.type === "follow" ? "followed you" : "liked your post"}
								</span>
							</div>
							</Link>
						</div>

						{/* Right side: Timestamp */}
						<span className='text-xs text-gray-500 whitespace-nowrap'>
							{formatPostDate(notification.createdAt)}
						</span>
						</div>
					</div>
					))}
			</div>
		</>
	);
};
export default NotificationPage;