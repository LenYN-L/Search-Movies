const apiKey = 'd25392eb'

export const searchMovies = async ({ search }) => {
  if (search === '') return null

  try {
    const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${search}`)
    const json = await res.json()
    const movies = json.Search
    return movies?.map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster
    }))
  } catch (error) {
    throw new Error('Error searching movies')
  }
}
