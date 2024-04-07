// CUSTOM HOOKS
//just for reusability 
//allow us to reuse non visual logics
//one custom hook should have one purpose,to make it 
//reusable and portable(even across multiple project)
//make it affordable and reusable so can use in even another project
///now a days developers started sharing their custom hooks so thousands of new library are developing
//all rules of hooks applies to custom hooks as well
//mostly custom hooks use available hooks to build
//start with use word
//lets create our own
//name useMovie

import React, { useEffect, useRef, useState } from 'react';
import './index.css'
import StarRating from './StarRating'
import { useMovies } from './useMovies';

const average = (arr) =>
  arr.reduce((acc, cur, i) => acc + cur / arr.length, 0)

const KEY = '5b697c6c';

export default function App() {
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState(null);

  // Custom Hook
  const { movies, error, isLoading } = useMovies(query)




  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem('watched')
    return JSON.parse(storedValue);
  });

  function handleSelectMovie(id) {
    setSelectedId(selectedId => (id === selectedId ? null : id))
  }


  function handleCloseMovie() {
    setSelectedId(null)
  }


  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie]);

  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }


  useEffect(function () {
    localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched])



  ////////////////////////////////////


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
  const inputEl = useRef(null);

  useEffect(function () {
    function callback(e) {
      if (document.activeElement === inputEl.current) return;
      if (e.code === 'Enter') {
        inputEl.current.focus()
        setQuery('')
      }
    }
    document.addEventListener('keydown', callback)

    return () => document.addEventListener('keydown', callback)

  }, [setQuery])


  return (
    <input
      className='search'
      placeholder='Search Movies..'
      type='text'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
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

  const countRef = useRef(0);
  // let count = 0;

  useEffect(function () {
    if (userRating) countRef.current = countRef.current + 1;
    // if (userRating) count = count + 1;
  }, [userRating])

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
      userRating,
      countRatingDecisions: countRef.current,

    }
    onAddWatched(newWatchedMovie)
    onCloseMovie();
  }


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

          {/*    <p>{avgRating}</p>*/}

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
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(1)} min</span>
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
