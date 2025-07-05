import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType, username, userId}) => {

	const getPostEndpoint = ()=>{
		switch (feedType) {
			case "following":
				return "/api/v1/post/following";
			
			case "forYou":
				return "/api/v1/post/allpost"

			case "likes":
				return `/api/v1/post/likedpost/${userId}`

			case "posts":
				return `/api/v1/post/user/${username}`
			
			
			default:
				return "/api/v1/post/allpost"
		}
	}

	const POST_ENDPOINT = getPostEndpoint()

	const { data:posts, refetch, isRefetching, isLoading } = useQuery({
		queryKey:["posts"],
		queryFn:  
			async() => {
				try {
					const res = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}${POST_ENDPOINT}`,{
					method:"GET",
					credentials:"include"
					})
					const data = await res.json()
	
					if (!res.ok) {
						throw new Error(data.error ||"something went wrong")
					}
					return data
				} catch (error) {
					throw new Error(error)
				}
			}
		
	});

	useEffect(()=>{
		refetch()
	},[feedType, refetch, username])

	return (
		<>
			{(isRefetching || isLoading) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isRefetching && !isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isRefetching && !isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;