import RegisterForm from "../components/RegisterForm";
import { useRouter } from "next/router";
import classes from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();
  return (
    <div className={classes.register__wrapper}>
      <h1 className={classes.register__title}>Register</h1>
      <RegisterForm />
      <button
        className={classes.register__button}
        onClick={() => router.push("/login")}
      >
        Log in
      </button>
    </div>
  );
}
