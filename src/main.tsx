import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './auth/AuthContext.tsx'

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
			<ToastContainer />
		</BrowserRouter>
	</React.StrictMode>,
);
