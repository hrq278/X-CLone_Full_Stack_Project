import { useMutation, useQueryClient } from "@tanstack/react-query"



const useFollowUnFollow = () => {


    const queryClient = useQueryClient()


    const { mutate:follow, isPending } = useMutation({
    mutationFn:async (userId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/api/v1/user/follow/${userId}`,{
                method:"POST",
				credentials:"include"
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
    onSuccess: (data)=>{
        Promise.all([
        queryClient.invalidateQueries({queryKey: ["suggestedUser"]}),
        queryClient.invalidateQueries({queryKey: ["authUser"]})    
        ])
        
    },
    onError:(error)=>{
        toast.error(error.message)
    }
})

return { follow, isPending }
}

export default useFollowUnFollow;