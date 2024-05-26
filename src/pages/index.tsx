import { GetStaticProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Character } from "../types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import classes from "./characterList.module.css";

interface HomeProps {
  characters: Character[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const res = await fetch("https://swapi.dev/api/people/");
  const data = await res.json();
  const characters = data.results;

  return {
    props: {
      characters,
    },
  };
};

export default function Home({ characters }: HomeProps) {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterField, setFilterField] = useState("name");
  const [filterValue, setFilterValue] = useState("");
  const [sortedAndFilteredCharacters, setSortedAndFilteredCharacters] =
    useState(characters);
  const { data: session, status } = useSession();
  const isUserLoading = status === "loading";
  const isUserSignedIn = !!session?.user;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(
    sortedAndFilteredCharacters.length / itemsPerPage
  );

  const charactersForCurrentPage = sortedAndFilteredCharacters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  useEffect(() => {
    let newCharacters = [...characters];

    newCharacters.sort((a, b) => {
      const key = sortField as keyof Character;
      if (a[key] < b[key]) return sortDirection === "asc" ? -1 : 1;
      if (a[key] > b[key]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    newCharacters = newCharacters.filter((character) => {
      const key = filterField as keyof Character;
      return String(character[key])
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    });

    setSortedAndFilteredCharacters(newCharacters);
  }, [sortField, sortDirection, filterField, filterValue]);

  useEffect(() => {
    if (!isUserLoading && !isUserSignedIn) {
      router.push("/login");
    }
  }, [isUserLoading, isUserSignedIn, router]);

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!isUserSignedIn) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={classes.optionsContainer}>
        <div className={classes.sortContainer}>
          <label className={classes.label}>
            Sort Field:{" "}
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className={classes.select}
            >
              <option value="name" className={classes.option}>
                Name
              </option>
              <option value="height" className={classes.option}>
                Height
              </option>
              <option value="mass" className={classes.option}>
                Mass
              </option>
              <option value="gender" className={classes.option}>
                Gender
              </option>
            </select>
          </label>
          <label className={classes.label}>
            Sort Direction:{" "}
            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              className={classes.select}
            >
              <option value="asc" className={classes.option}>
                Ascending
              </option>
              <option value="desc" className={classes.option}>
                Descending
              </option>
            </select>
          </label>
        </div>
        <div className={classes.filterContainer}>
          <label className={classes.label}>
            Filter Field:{" "}
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className={classes.select}
            >
              <option value="name" className={classes.option}>
                Name
              </option>
              <option value="height" className={classes.option}>
                Height
              </option>
              <option value="mass" className={classes.option}>
                Mass
              </option>
              <option value="gender" className={classes.option}>
                Gender
              </option>
            </select>
          </label>
          <label className={classes.label}>
            Filter Value:{" "}
            <input
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className={classes.input}
            />
          </label>
        </div>
      </div>
      <div className={classes.characterContainer}>
        {charactersForCurrentPage.map((character) => (
          <Link
            href={`/character/${character.url.split("/").slice(-2, -1)[0]}`}
            key={character.url}
            className={classes.characterLink}
          >
            <div className={classes.characterCard}>
              <p className={classes.characterDetail}>Name: {character.name}</p>
              <p className={classes.characterDetail}>
                Height: {character.height}
              </p>
              <p className={classes.characterDetail}>Mass: {character.mass}</p>
              <p className={classes.characterDetail}>
                Gender: {character.gender}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className={classes.button__wrapper}>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={classes.button}
        >
          Previous
        </button>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={classes.button}
        >
          Next
        </button>
      </div>
    </div>
  );
}
