import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { LogoutButton } from "./LogoutButton";

export const Navbar = () => {
	const { store } = useGlobalReducer();

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{store.isAuth ? (
						<LogoutButton />
					) : (
						<Link to="/login" className="btn btn-primary">
							Login
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};
