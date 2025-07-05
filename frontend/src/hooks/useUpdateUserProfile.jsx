import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

const useUpdateUserProfile = () => {
    
    const queryClient = useQueryClient()
    
  const {mutateAsync: updateProfile, isPending: isUpdating} = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/api/v1/user/update`,{
					method: "POST",
					credentials:"include",
					headers:{ 
					"Content-Type" : "application/json"
					},
					body: JSON.stringify(formData)
				})
				const data = await res.json()
				if (!res.ok) {
					throw new Error(data.error || "something went wrong")
				}
	
				return data;
			} catch (error) {
				throw new Error(error.message)
			}
		},
		onSuccess: async() => {
			toast.success("profile Updated Successfully")
			await Promise.all([
				queryClient.invalidateQueries({queryKey: ["authUser"]}),
				queryClient.invalidateQueries({queryKey: ["userProfile"]})
			])
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

    return {updateProfile, isUpdating}
}
export default useUpdateUserProfile