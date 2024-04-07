////////////////////////////
//CLEAN UP DATA FETCHING
//SINCE  we are creating way many http requests
//abhi bahi jaise hi search me koi keyword dalta h to har keyword ke liye ek request jati h
//ab usi ka solution nikalna h
//race condition ko solve krnaa basically
//lets use native api called abort controller
//us in clean up fun


import React, { useEffect, useState } from 'react';
import './index.css'
import StarRating from './StarRating'



const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    tempData: true,
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    tempData: true,
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

//ye logic hai jo outside of the components hai
const average = (arr) =>
  arr.reduce((acc, cur, i) => acc + cur / arr.length, 0)

//variables
const KEY = '5b697c6c';


//ye apna app component
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null);



  function handleSelectMovie(id) {
    setSelectedId(selectedId => (id === selectedId ? null : id))
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }


  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie])
  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }

  useEffect(
    function () {
      // Install AbortController brower api in variable called controller
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError('')
          const res = await
            fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal })

          if (!res.ok) throw new Error('Something went wrong with fetching Movies')
          const data = await res.json();

          if (data.Response === 'False') throw new Error('Movie not Found')


          setMovies(data.Search)
          setError('');

        } catch (err) {

          if (err.name !== 'AbortError') {
            setError(err.message)
          }
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


      //bhai ye cleanup function hai and in btw renders ye execute hoga matlab jo request jane wali h wo que ho jayegi and last letter ke baad koi render
      //ayega nahi matlab ki ye return nhi hoga or request accept hogi
      return function () {
        controller.abort()
      }
    }, [query]

  )


  return (
    <>
      <Navbar >
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>


      <Main>
        <Box movies={movies}>
          {isLoading && <Loader />}
          {!isLoading && <MovieList movies={movies}
            onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}

        </Box>

        <Box>
          <>
            {
              selectedId ?
                <MovieDetails selectedId={selectedId}
                  onCloseMovie={handleCloseMovie}
                  setIsLoading={setIsLoading}
                  onAddWatched={handleAddWatched}
                  watched={watched}
                />
                :
                <>
                  <WatchedSummary watched={watched} />
                  <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
                </>
            }
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

function MovieList({ movies, onSelectMovie }) {

  return (
    <ul className='list list-movies'>
      {movies.map(movie => <Movie movie={movie}
        key={movie.imdbID} onSelectMovie={onSelectMovie} />)}
    </ul>
  )

}

function Movie({ movie, onSelectMovie }) {

  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
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



function MovieDetails({ selectedId, onAddWatched, onCloseMovie, watched }) {

  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('');
  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId)
  const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating

  const { Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot,
    Released: released, Actors: actors, Director: director, Genre } = movie;


  function handleAdd(id) {

    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating
    }
    onAddWatched(newWatchedMovie)
    onCloseMovie()
  }

  console.log(title)





  useEffect(function () {
    async function getMovieDetails() {
      setIsLoading(true)
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
      const data = await res.json();
      setMovie(data);
      setIsLoading(false)
    }

    getMovieDetails();
  }, [selectedId])


  useEffect(function () {
    if (!title) return

    document.title = `Movie | ${title}`

    return function () {
      document.title = "Binger";
      //bhai dekh function hai to closure wala concept samjh yaha par
      //see clean up function only render after you unmount this movieDetail component ko unmount krdee
      //matlab title state to destroy hogyi but fir bhi console me title a rhaa h kyu
      //kyuki function remember its enviromen variable where it is defined.
      console.log(`Clean up effect for Movie ${title}`);
    }
  }, [title])



  return (
    <div className="details">

      {isLoading ? <Loader /> :
        <>
          <header>

            <button className="btn-back" >
              &larr;
            </button>

            <img src={poster} alt={`Poster of ${movie} movie`} />

            <div className="details-overview">

              <h2>{title}</h2>

              <p>
                {released} &bull; {runtime}
              </p>

              <p>{Genre}</p>

              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>

            </div>

          </header>



          <section>
            <div className='rating'>
              {!isWatched ?
                <>
                  <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                  {
                    userRating > 0 &&
                    <button button className='btn-add' onClick={handleAdd}>+ Add to List</button>
                  }

                </>
                : <p>You rated this Movie {watchedUserRating}
                  <span>
                    ⭐️
                  </span>
                </p>
              }

            </div>

            <p>
              <em>{plot}</em>
            </p>

            <p>
              Starring {actors}
            </p>

            <p>
              Directed by {director}
            </p>
          </section >

        </>
      }
    </div >

  )
}


//////////////////////////
///WATCHED section

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
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )

}

function WatchedMoviesList({ watched, onDeleteWatched }) {

  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  )
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.Title} poster`} />
      <h3>{movie.title}</h3>
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
        <button className='btn-delete' onClick={() => onDeleteWatched(movie.imdbID)}>X</button>
      </div>
    </li >
  )
}
