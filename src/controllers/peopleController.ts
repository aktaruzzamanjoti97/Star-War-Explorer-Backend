import { NextFunction, Request, Response } from 'express';
import swapi from '../services/swapiService';

export const getAllPeople = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			page = '1',
			search = '',
			limit = '10',
		} = req.query as {
			page?: string;
			search?: string;
			limit?: string;
		};
		const pageNum = parseInt(page, 10);
		const limitNum = parseInt(limit, 10);

		if (search) {
			const allPeople: any[] = [];
			let currentPage = 1;

			const data = await swapi.getPeople(currentPage, limitNum);

			if (data?.results?.length) {
				allPeople.push(
					...data.results.filter((p) =>
						p.name.toLowerCase().includes(search.toLowerCase())
					)
				);
			}

			const totalPages = Math.ceil(allPeople.length / 10);

			if (pageNum > totalPages) {
				return res
					.status(404)
					.json({ error: 'No data found for this page' });
			}
			return res.json({
				results: allPeople,
				total: allPeople.length,
				page: pageNum,
				totalPages: totalPages,
			});
		}

		const data = await swapi.getPeople(pageNum, limitNum);

		const totalPages = data.total_pages || 1;

		if (pageNum > totalPages) {
			return res
				.status(404)
				.json({ error: 'Page number exceeds total pages' });
		}

		return res.json({
			results: data.results || [],
			total: data.total_records || 0,
			page: pageNum,
			totalPages: totalPages,
			next: data.next,
			previous: data.previous,
		});
		// }
	} catch (err) {
		next(err);
	}
};

export const getPersonById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const data = await swapi.getPerson(id);
		if (!data.result)
			return res.status(404).json({ error: 'Person not found' });

		const person = data.result.properties;

		res.json({ ...data.result, properties: person });
	} catch (err) {
		next(err);
	}
};
