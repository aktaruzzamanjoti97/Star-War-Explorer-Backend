"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonById = exports.getAllPeople = void 0;
const swapiService_1 = __importDefault(require("../services/swapiService"));
const getAllPeople = async (req, res, next) => {
    try {
        const { page = '1', search = '', limit = '10', } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        if (search) {
            const allPeople = [];
            let currentPage = 1;
            const data = await swapiService_1.default.getPeople(currentPage, limitNum);
            if (data?.results?.length) {
                allPeople.push(...data.results.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())));
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
        const data = await swapiService_1.default.getPeople(pageNum, limitNum);
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
    }
    catch (err) {
        next(err);
    }
};
exports.getAllPeople = getAllPeople;
const getPersonById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await swapiService_1.default.getPerson(id);
        if (!data.result)
            return res.status(404).json({ error: 'Person not found' });
        const person = data.result.properties;
        res.json({ ...data.result, properties: person });
    }
    catch (err) {
        next(err);
    }
};
exports.getPersonById = getPersonById;
