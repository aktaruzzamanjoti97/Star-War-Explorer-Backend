import { fetchWithCache } from '../utils/fetchWithCache';

const BASE_URL = 'https://swapi.tech/api';

export interface SWAPIResponse<T> {
	result?: { properties: T; [key: string]: any };
	results?: any[];
	total_records?: number;
	total_pages?: number;
	next?: string | null;
	previous?: string | null;
}

export default {
	getPeople: (page: number, limit: number) =>
		fetchWithCache<SWAPIResponse<any>>(
			`${BASE_URL}/people?page=${page}&limit=${limit}`,
			`people_${page}_${limit}`
		),

	getPerson: (id: string) =>
		fetchWithCache<SWAPIResponse<any>>(
			`${BASE_URL}/people/${id}`,
			`person_${id}`
		),
};
