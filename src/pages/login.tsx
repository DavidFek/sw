import LoginForm from "../components/LoginForm";
import { useRouter } from "next/router";
import classes from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className={classes.login__wrapper}>
      <h1 className={classes.login__title}>Login</h1>
      <LoginForm />
      <button
        className={classes.login__button}
        onClick={() => router.push("/register")}
      >
        Register
      </button>
    </div>
  );
}
