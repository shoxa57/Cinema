const TMDB_KEY = 'f18d699584cca1e4e104116ccc977c68';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/original';

const movieGrid = document.getElementById('movieGrid');
const movieSearch = document.getElementById('movieSearch');
const bgOverlay = document.getElementById('bgOverlay');

// Load popular movies
fetchMovies(`${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}`);

async function fetchMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    displayMovies(data.results);
}

function displayMovies(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        if (!movie.poster_path) return;
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span style="color: #ffbd2e;">★ ${movie.vote_average.toFixed(1)}</span>
            </div>
        `;

        card.onmouseenter = () => {
            bgOverlay.style.backgroundImage = `url(${TMDB_IMG + movie.backdrop_path})`;
        };

        card.onclick = () => openModal(movie);
        movieGrid.appendChild(card);
    });
}

function openModal(movie) {
    const modal = document.getElementById('movieModal');
    const container = document.getElementById('videoContainer');
    
    document.getElementById('modalTitle').innerText = movie.title;
    document.getElementById('modalDesc').innerText = movie.overview;
    document.getElementById('modalRating').innerText = `★ ${movie.vote_average.toFixed(1)}`;
    document.getElementById('modalDate').innerText = movie.release_date.split('-')[0];

    container.innerHTML = `<iframe src="https://vidsrc.me/embed/movie?tmdb=${movie.id}" allowfullscreen></iframe>`;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

document.getElementById('closeModal').onclick = () => {
    document.getElementById('movieModal').style.display = 'none';
    document.getElementById('videoContainer').innerHTML = '';
    document.body.style.overflow = 'auto';
};

movieSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = movieSearch.value;
        fetchMovies(`${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${query}`);
    }
});