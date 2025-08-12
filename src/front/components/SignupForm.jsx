import React, { useState } from 'react';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { signup } from "../services/userServices.js";
import { useNavigate } from "react-router-dom";

export const SignupForm = () => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const created = await signup(name, lastname, email, password);
      if (created) {
        navigate("/login");
      } else {
        setError("Error al crear el usuario, intenta con otro correo");
      }
    } catch (err) {
      setError("Error en el registro: " + err.message);
    }
  }

  return (
    <form className="w-50 mx-auto" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="inputName" className="form-label">
          First Name
        </label>
        <input
          type="text"
          className="form-control"
          id="inputName"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="inputLastname" className="form-label">
          Last Name
        </label>
        <input
          type="text"
          className="form-control"
          id="inputLastname"
          value={lastname}
          required
          onChange={(e) => setLastname(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="inputEmail" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="inputEmail"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="inputPassword" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="inputPassword"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <button type="submit" className="btn btn-primary">
        Register
      </button>
    </form>
  );
};

