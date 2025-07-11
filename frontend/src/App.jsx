import { Navigate, Route, Routes } from "react-router-dom";

//Pages
import HomePage from "./pages/home/HomePage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import LoginPage from "./pages/auth/login/LoginPage"
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";


//Components
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {

	const {data:authUser, isLoading} = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			const res = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/api/v1/auth/me`,{
				method:"GET",
				credentials:"include"
			});

			const data = await res.json()
			if (data.error) {
				return null
			}
			if (!res.ok) {
				throw new Error(data.error || "Something went wrong")
			}
			console.log(data)
			return data;
		},
		retry: false
	})

	if (isLoading) {
		return(
			<div className="h-screen flex justify-center items-center">
				<LoadingSpinner  size="lg"/>
			</div>
		)
	}

	return (
		<div className='flex max-w-6xl mx-auto'>
			{authUser && <Sidebar />}

			<Routes>
				<Route path='/' element={ authUser ? <HomePage /> : <Navigate to='/login' /> } />
				<Route path='/signup' element={ !authUser ? <SignUpPage /> : <Navigate to='/' /> } />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' /> } />
				<Route path='/notifications' element={ authUser ? <NotificationPage /> : <Navigate to='/login' /> } />
				<Route path='/profile/:username' element={ authUser ? <ProfilePage /> : <Navigate to='/login' /> } />
			</Routes>

			{authUser && <RightPanel />}
			<Toaster />
		</div>
	);
}

export default App;