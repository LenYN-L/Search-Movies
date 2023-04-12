import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'

function useSearch () {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState('')
  const isFirstInput = useRef(true)

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }

    if (search === '') {
      setError('No se puede buscar una pelicula vacia')
      return
    }

    if (search.match(/^\d+$/)) {
      setError('No se puede buscar una pelicula con un numero')
      return
    }

    if (search.length < 3) {
      setError('la busqueda debe tener al menos 3 caracteres')
      return
    }

    setError(null)
  }, [search])
  return { search, updateSearch, error }
}

function App () {
  const { search, updateSearch, error } = useSearch()
  const [sort, setSort] = useState(false)
  const { movies, getMovies, loading } = useMovies({ search, sort })

  // Con JS formulario no controlado
  // const handleSubmit = (event) => {
  //   event.preventDefault()
  //   const data = Object.fromEntries(new window.FormData(event.target))
  //   console.log(data, 'dato')
  // }

  const debounceGetMovies = useCallback(debounce(search => {
    console.log('search', search)
    getMovies({ search })
  }, 500), [getMovies])

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debounceGetMovies(newSearch)
  }

  const handleChangeBox = (event) => {
    setSort(!sort)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  return (
    <div className='page'>
      <header>
        <h1>Buscador de Peliculas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input style={{ border: '1px solid transparent', borderColor: error ? 'red' : 'transparent' }} onChange={handleChange} value={search} name='query' type='text' placeholder='Avengers, Star Wars, The Matrix...' />
          <label htmlFor='filterA-Z'>Filter By Name</label>
          <input id='filterA-Z' onChange={handleChangeBox} type='checkbox' />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>
      <main>

        {
          loading ? <p>Cargando...</p> : <Movies movies={movies} />
        }

      </main>
    </div>
  )
}

export default App
