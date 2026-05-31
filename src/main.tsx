import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './auth/AuthContext.tsx'

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<HashRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
			<ToastContainer />
		</HashRouter>
	</React.StrictMode>,
);
