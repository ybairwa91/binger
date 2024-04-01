// STATIC APP

import React from 'react';
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


export default function App() {
  return (
    <div>
      <Navbar />
      <Main />
    </div>
  )
}

////////////////////////////////
// NAVBAR
function Navbar() {
  return (
    <nav className='nav-bar'>
      <Logo />
      <Search />
      <NumResult />
    </nav>
  )
}

function Logo() {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>Binger</h1>
    </div>
  )
}

function Search() {
  return (
    <input className='search' placeholder='Search Movies..' type='text' />
  )
}

function NumResult() {
  return (
    <p className='num-results'>Found <strong>{2}</strong> results</p>
  )
}

////////////////////////////////
// MAIN 
function Main() {

  return (
    <main className='main'>
      <MovieBox />
      <WatchBox />
    </main>
  )
}

function MovieBox() {
  return (
    <div className='box'>
      <button className='btn-toggle'>-</button>
      <MovieList />
    </div>
  )
}

function MovieList() {
  return (
    <ul className='list'>{tempMovieData.map(movie => <Movie movie={movie} />)}</ul>
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

function WatchBox() {
  return (
    <div className='box'>
      <button className='btn-toggle'>-</button>
      <WatchedSummary />
      <WatchedMoviesList />
    </div>
  )
}


function WatchedSummary() {
  const avgImdbRating = average(tempWatchedData.map((movie) => movie.imdbRating));
  const avgUserRating = average(tempWatchedData.map((movie) => movie.userRating));
  const avgRuntime = average(tempWatchedData.map((movie) => movie.runtime));
  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{tempWatchedData.length} movies</span>
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

function WatchedMoviesList() {
  return (
    <ul className='list'>
      {tempWatchedData.map((movie) => (
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
