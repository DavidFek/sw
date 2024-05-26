import classes from "./404.module.css";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className={classes.notfound__wrapper}>
        <h1 className={classes.notfound__title}>Not found</h1>
        <p className={classes.notfound__par}>
          This isn't the page you are looking for.
        </p>
      </div>
    </main>
  );
}
