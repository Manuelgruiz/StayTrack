import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Navbar from "../components/Navbar";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4 pt-20">
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <p className="mt-4 text-gray-600">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes una cuenta?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary ml-2 underline"
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </>
  );
}
