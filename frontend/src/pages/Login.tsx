import Navbar from "../components/Navbar";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 flex items-center justify-center px-4">
        <LoginForm />
      </main>
    </>
  );
}
