import axios from 'axios';
import cache from '../config/cache';

export async function fetchWithCache<T>(
	url: string,
	cacheKey: string
): Promise<T> {
	const cachedData = cache.get<T>(cacheKey);
	if (cachedData) return cachedData;

	const { data } = await axios.get<T>(url);
	cache.set(cacheKey, data);
	return data;
}
