import Navbar from "../components/Navbar";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 flex items-center justify-center px-4">
        <RegisterForm />
      </main>
    </>
  );
}
