
//2 task in this versions
//ADDING SELECTED MOVIE TO WATCHEDLIST
//ye to simple hai
//ke naaya object create krna hai existing one ke through jisme jo selectedid h 
//fir add to list wale btn pe onClick karke sab kuch taam jhaam krlo



//star ka game samjho,bhai ki apan ne user rating di now its in starrating jise hume basically moviedetails me chahiye
// or apan ko wo detail mangta hai watchedMOVIE 
//component me but kaise
//apan ne ek state liya naam rakha userRating ab use pass krldiye ek func ke through,ab mere bhai
//use as a prop pass krdiya setRating me
//ab use call karaya kaha starrating ke us handler function me jaha rating store ho rhi hai
//so moviedetails me dala  ek state or usme hume setState pass krdiya fir wo call hua jaha rating change ho rahi h
//and then we update the userRating using setUserRating and thats how we got whatever we want to.

import React, { useEffect, useState } from 'react';
import './index.css'
import StarRating from '../src/StarRating'

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
  const [query, setQuery] = useState("interstellar")
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


  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError('')
          const res = await
            fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`)

          if (!res.ok) throw new Error('Something went wrong with fetching Movies')
          const data = await res.json();

          if (data.Response === 'False') throw new Error('Movie not Found')


          setMovies(data.Search)
          setError('');

        } catch (err) {
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
                  onAddWatched={handleAddWatched} />
                :
                <>
                  <WatchedSummary watched={watched} />
                  <WatchedMoviesList watched={watched} />
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



function MovieDetails({ selectedId, onAddWatched, onCloseMovie }) {

  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('');
  const { Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot,
    Released: released, Actors: actors, Director: director, Genre } = movie;


  function handleAdd() {
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




  return (
    <div className="details">

      {isLoading ? <Loader /> :
        <>
          <header>

            {/* Ye button tabhi dikhayenge jab userRating 0 se badi hoo,matlab jaise hi koi star rating de uske baad hi show kree / */}

            {
              userRating > 0 &&
              <button className="btn-back" >
                &larr;
              </button>
            }

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

              <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
              <button button className='btn-add' onClick={handleAdd}>+ Add to List</button>

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
      </div>
    </li >
  )
}
