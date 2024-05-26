import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import classes from "./loginform.module.css";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result && result.error) {
      setErrorMessage(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <form className={classes.login__form} onSubmit={login}>
      <input
        className={classes.login__input}
        type="text"
        value={username}
        placeholder="Username..."
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className={classes.login__input}
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className={classes.login__button} type="submit">
        Login
      </button>
      {errorMessage && (
        <p className={classes.login__error}>Wrong credentials</p>
      )}
    </form>
  );
}
