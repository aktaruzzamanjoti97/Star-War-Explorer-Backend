// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 5000;
const SWAPI_BASE_URL = 'https://swapi.tech/api';

// Initialize cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to fetch with caching
const fetchWithCache = async (url, cacheKey) => {
	const cachedData = cache.get(cacheKey);
	if (cachedData) {
		return cachedData;
	}

	try {
		const response = await axios.get(url);
		const data = response.data;
		cache.set(cacheKey, data);
		return data;
	} catch (error) {
		console.error(`Error fetching from ${url}:`, error.message);
		throw error;
	}
};

// Get all people with pagination
app.get('/api/people', async (req, res) => {
	try {
		const { page = 1, search = '' } = req.query;
		const cacheKey = `people_${page}_${search}`;

		if (search) {
			// Search across all pages if search term provided
			const allPeople = [];
			let currentPage = 1;
			let hasMore = true;

			while (hasMore) {
				const url = `${SWAPI_BASE_URL}/people?page=${currentPage}&limit=100`;
				const data = await fetchWithCache(
					url,
					`people_page_${currentPage}`
				);

				if (data.results) {
					const filtered = data.results.filter((person) =>
						person.name.toLowerCase().includes(search.toLowerCase())
					);
					allPeople.push(...filtered);
				}

				hasMore = data.next !== null;
				currentPage++;

				// Limit iterations to prevent infinite loops
				if (currentPage > 10) break;
			}

			// Paginate search results
			const startIndex = (page - 1) * 10;
			const endIndex = startIndex + 10;
			const paginatedResults = allPeople.slice(startIndex, endIndex);

			res.json({
				results: paginatedResults,
				total: allPeople.length,
				page: parseInt(page),
				totalPages: Math.ceil(allPeople.length / 10),
			});
		} else {
			const url = `${SWAPI_BASE_URL}/people?page=${page}&limit=10`;
			const data = await fetchWithCache(url, cacheKey);

			res.json({
				results: data.results || [],
				total: data.total_records || 0,
				page: parseInt(page),
				totalPages: data.total_pages || 1,
				next: data.next,
				previous: data.previous,
			});
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch people' });
	}
});

// Get single person by ID
app.get('/api/people/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const cacheKey = `person_${id}`;

		const url = `${SWAPI_BASE_URL}/people/${id}`;
		const data = await fetchWithCache(url, cacheKey);

		if (data.result) {
			// Fetch additional details
			const person = data.result.properties;

			// Fetch homeworld details
			if (person.homeworld) {
				try {
					const homeworldId = person.homeworld
						.split('/')
						.filter(Boolean)
						.pop();
					const homeworldData = await fetchWithCache(
						`${SWAPI_BASE_URL}/planets/${homeworldId}`,
						`planet_${homeworldId}`
					);
					person.homeworldDetails =
						homeworldData.result?.properties || null;
				} catch (error) {
					console.error('Failed to fetch homeworld:', error);
				}
			}

			res.json({
				...data.result,
				properties: person,
			});
		} else {
			res.status(404).json({ error: 'Person not found' });
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch person details' });
	}
});

// Get films for a person
app.get('/api/people/:id/films', async (req, res) => {
	try {
		const { id } = req.params;
		const personData = await fetchWithCache(
			`${SWAPI_BASE_URL}/people/${id}`,
			`person_${id}`
		);

		if (personData.result?.properties?.films) {
			const filmPromises = personData.result.properties.films.map(
				async (filmUrl) => {
					const filmId = filmUrl.split('/').filter(Boolean).pop();
					return fetchWithCache(
						`${SWAPI_BASE_URL}/films/${filmId}`,
						`film_${filmId}`
					);
				}
			);

			const films = await Promise.all(filmPromises);
			res.json(films.map((f) => f.result?.properties).filter(Boolean));
		} else {
			res.json([]);
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch films' });
	}
});

// Get species for a person
app.get('/api/people/:id/species', async (req, res) => {
	try {
		const { id } = req.params;
		const personData = await fetchWithCache(
			`${SWAPI_BASE_URL}/people/${id}`,
			`person_${id}`
		);

		if (
			personData.result?.properties?.species &&
			personData.result.properties.species.length > 0
		) {
			const speciesPromises = personData.result.properties.species.map(
				async (speciesUrl) => {
					const speciesId = speciesUrl.split('/').filter(Boolean).pop();
					return fetchWithCache(
						`${SWAPI_BASE_URL}/species/${speciesId}`,
						`species_${speciesId}`
					);
				}
			);

			const species = await Promise.all(speciesPromises);
			res.json(species.map((s) => s.result?.properties).filter(Boolean));
		} else {
			res.json([]);
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch species' });
	}
});

// Get vehicles for a person
app.get('/api/people/:id/vehicles', async (req, res) => {
	try {
		const { id } = req.params;
		const personData = await fetchWithCache(
			`${SWAPI_BASE_URL}/people/${id}`,
			`person_${id}`
		);

		if (
			personData.result?.properties?.vehicles &&
			personData.result.properties.vehicles.length > 0
		) {
			const vehiclePromises = personData.result.properties.vehicles.map(
				async (vehicleUrl) => {
					const vehicleId = vehicleUrl.split('/').filter(Boolean).pop();
					return fetchWithCache(
						`${SWAPI_BASE_URL}/vehicles/${vehicleId}`,
						`vehicle_${vehicleId}`
					);
				}
			);

			const vehicles = await Promise.all(vehiclePromises);
			res.json(vehicles.map((v) => v.result?.properties).filter(Boolean));
		} else {
			res.json([]);
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch vehicles' });
	}
});

// Get starships for a person
app.get('/api/people/:id/starships', async (req, res) => {
	try {
		const { id } = req.params;
		const personData = await fetchWithCache(
			`${SWAPI_BASE_URL}/people/${id}`,
			`person_${id}`
		);

		if (
			personData.result?.properties?.starships &&
			personData.result.properties.starships.length > 0
		) {
			const starshipPromises = personData.result.properties.starships.map(
				async (starshipUrl) => {
					const starshipId = starshipUrl.split('/').filter(Boolean).pop();
					return fetchWithCache(
						`${SWAPI_BASE_URL}/starships/${starshipId}`,
						`starship_${starshipId}`
					);
				}
			);

			const starships = await Promise.all(starshipPromises);
			res.json(starships.map((s) => s.result?.properties).filter(Boolean));
		} else {
			res.json([]);
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch starships' });
	}
});

// Health check endpoint
app.get('/api/health', (req, res) => {
	res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
