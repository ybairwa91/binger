// UseEffect ka game
import React, { useDebugValue, useEffect, useState } from 'react';
import './index.css'


const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },

];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i) => acc + cur / arr.length, 0)

const KEY = '5b697c6c';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')

  //FETCHING API FOR MOVIES LIST
  // fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`).then(res => res.json()).then(data => console.log(data.Search))

  // useEffect(function () {
  //   fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  //     .then(res => res.json())
  //     .then(data => setMovies(data.Search))
  // }, [query])

  ////////////////////////////////////////////////
  // HANDLE LOADING STAGE
  // useEffect(
  //   function () {
  //     async function fetchMovies() {
  //       setIsLoading(true);
  //       const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  //       const data = await res.json();
  //       console.log(data.Search);
  //       setMovies(data.Search)
  //       setIsLoading(false);
  //     }
  //     fetchMovies()
  //   }, []

  // )

  /////////////////////////////////////
  //Handle errors

  // useEffect(
  //   function () {
  //     async function fetchMovies() {
  //       try {
  //         setIsLoading(true);
  //         setError('')
  //         const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  //         //Network issue gives response.ok=false
  //         //lets handle this network error
  //         if (!res.ok) throw new Error('Something went wrong with fetching Movies')
  //         console.log(res);

  //         const data = await res.json();
  //         //what is there is no image for such name as u put in search bar
  //         if (data.Response === 'False') throw new Error('Movie not Found')
  //         console.log(data.Search);
  //         setMovies(data.Search)
  //         setError('');
  //       } catch (err) {
  //         console.log(err.message);
  //         setError(err.message)
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }


  //     fetchMovies()

  //   }, []

  // )

  //////////////////////////////////////////
  //lets take use of Search bar

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError('')
          const res = await
            fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`)
          //Network issue gives response.ok=false
          //lets handle this network error
          if (!res.ok) throw new Error('Something went wrong with fetching Movies')
          console.log(res);

          const data = await res.json();
          //what is there is no image for such name as u put in search bar
          if (data.Response === 'False') throw new Error('Movie not Found')
          console.log(data.Search);
          setMovies(data.Search)
          setError('');
        } catch (err) {
          console.log(err.message);
          setError(err.message)
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([])
        setError('')
        return;
      }

      fetchMovies()
    }, [query]

  )


  return (
    <>
      <Navbar >
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>

      <Main>
        <Box movies={movies} >
          {isLoading && <Loader />}
          {!isLoading && <MovieList movies={movies} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          <>
            <WatchedSummary watched={watched} />
            <WatchedMoviesList watched={watched} />
          </>
        </Box>
      </Main >
    </>
  )
}

function Loader() {
  return <h2 className="loader">Loading..</h2>
}

function ErrorMessage({ message }) {
  return (
    <p className='error'>
      <span>⛔️</span>{message}
    </p>
  )
}


////////////////////////////////
// NAVBAR
function Navbar({ movies, children }) {
  return (
    <nav className='nav-bar'>
      <Logo />
      {children}
    </nav>
  )
}



function Logo() {
  return (
    <div className='logo'>
      <span role='img'>🎬</span>
      <h1>Binger</h1>
    </div>
  )
}

function Search({ query, setQuery }) {

  return (
    <input
      className='search'
      placeholder='Search Movies..'
      type='text'
      value={query}
      onChange={(e) => setQuery(e.target.value)} />
  )
}

function NumResult({ movies }) {
  return (
    <p className='num-results'>
      Found <strong>{movies.length} </strong>
      results</p>
  )
}

////////////////////////////////
// MAIN 
function Main({ movies, watched, children }) {
  return (
    <main className='main'>
      {children}
    </main>
  )
}



function Box({ movies, children }) {
  const [isOpen, setIsOpen] = useState(true)

  function handleBtn() {
    setIsOpen(open => !open)
  }
  return (
    <div className='box'>
      <button className='btn-toggle' onClick={handleBtn}>
        {isOpen ? "-" : "+"}
      </button>
      {
        isOpen &&
        children
      }
    </div>
  )
}

function MovieList({ movies }) {
  return (
    <ul className='list'>
      {movies.map(movie => <Movie movie={movie} key={movie.imdbID} />)}
    </ul>
  )
}

function Movie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} Poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li >
  )
}



function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )

}

function WatchedMoviesList({ watched }) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  )
}
function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li >
  )
}
