import { useState } from "react";
import { useRouter } from "next/router";
import classes from "./registerform.module.css";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const register = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    let data;
    try {
      data = await response.json();
    } catch (error) {
      setError("An error occurred");
      return;
    }

    if (response.ok) {
      router.push("/login");
    } else {
      setError(data.message || "An error occurred");
    }
  };

  return (
    <form className={classes.register__form} onSubmit={register}>
      <input
        className={classes.register__input}
        placeholder="Username..."
        type="text"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className={classes.register__input}
        placeholder="Password"
        type="password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className={classes.register__button} type="submit">
        Register
      </button>
      {error && <p className={classes.register__error}>{error}</p>}
    </form>
  );
}
