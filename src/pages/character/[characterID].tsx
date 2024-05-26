import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { Character } from "../../types";
import { useRouter } from "next/router";
import classes from "./character.module.css";

interface CharacterProps {
  character: Character;
}

interface Params extends ParsedUrlQuery {
  characterID: string;
}
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch("https://swapi.dev/api/people/");
  const data = await res.json();

  const paths = data.results.map((character: Character, index: number) => ({
    params: { characterID: String(index + 1) },
  }));

  return { paths, fallback: false };
};
export const getStaticProps: GetStaticProps<CharacterProps> = async ({
  params,
}) => {
  if (!params || typeof params.characterID !== "string") {
    return {
      notFound: true,
    };
  }

  const res = await fetch(`https://swapi.dev/api/people/${params.characterID}`);
  let character = await res.json();

  character.films = await Promise.all(
    character.films.map(async (filmUrl: string) => {
      const filmRes = await fetch(filmUrl);
      const film = await filmRes.json();
      return film.title;
    })
  );

  const homeworldRes = await fetch(character.homeworld);
  const homeworld = await homeworldRes.json();
  character.homeworld = homeworld.name;

  character.species = await Promise.all(
    character.species.map(async (speciesUrl: string) => {
      const speciesRes = await fetch(speciesUrl);
      const species = await speciesRes.json();
      return species.name;
    })
  );

  character.vehicles = await Promise.all(
    character.vehicles.map(async (vehicleUrl: string) => {
      const vehicleRes = await fetch(vehicleUrl);
      const vehicle = await vehicleRes.json();
      return vehicle.name;
    })
  );

  character.starships = await Promise.all(
    character.starships.map(async (starshipUrl: string) => {
      const starshipRes = await fetch(starshipUrl);
      const starship = await starshipRes.json();
      return starship.name;
    })
  );

  return {
    props: {
      character,
    },
  };
};

export default function CharacterPage({ character }: CharacterProps) {
  const router = useRouter();
  return (
    <div className={classes.char__wrapper}>
      <h1 className={classes.char__name}>{character.name}</h1>
      <p>
        <span className={classes.char__label}>Height:</span> {character.height}
      </p>
      <p>
        <span className={classes.char__label}>Mass:</span> {character.mass}
      </p>
      <p>
        <span className={classes.char__label}>Hair Color:</span>{" "}
        {character.hair_color}
      </p>
      <p>
        <span className={classes.char__label}>Skin Color:</span>{" "}
        {character.skin_color}
      </p>
      <p>
        <span className={classes.char__label}>Eye Color:</span>{" "}
        {character.eye_color}
      </p>
      <p>
        <span className={classes.char__label}>Birth Year:</span>{" "}
        {character.birth_year}
      </p>
      <p>
        <span className={classes.char__label}>Gender:</span> {character.gender}
      </p>
      <p>
        <span className={classes.char__label}>Homeworld:</span>{" "}
        {character.homeworld}
      </p>
      <div className={classes.char__flex}>
        <span className={classes.char__label}>Films:</span>
        <div>
          {character.films.map((film, index) => (
            <div key={index}>{film}</div>
          ))}
        </div>
      </div>
      <div className={classes.char__flex}>
        <span className={classes.char__label}>Species:</span>
        <div>
          {character.species.map((species, index) => (
            <div key={index}>{species}</div>
          ))}
        </div>
      </div>
      <div className={classes.char__flex}>
        <span className={classes.char__label}>Vehicles:</span>
        <div>
          {character.vehicles.map((vehicle, index) => (
            <div key={index}>{vehicle}</div>
          ))}
        </div>
      </div>
      <div className={classes.char__flex}>
        <span className={classes.char__label}>Starships:</span>
        <div>
          {character.starships.map((starship, index) => (
            <div key={index}>{starship}</div>
          ))}
        </div>
      </div>
      <button className={classes.char__button} onClick={() => router.back()}>
        Go back
      </button>
    </div>
  );
}
