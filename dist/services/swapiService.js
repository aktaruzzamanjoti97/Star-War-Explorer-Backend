"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchWithCache_1 = require("../utils/fetchWithCache");
const BASE_URL = 'https://swapi.tech/api';
exports.default = {
    getPeople: (page, limit) => (0, fetchWithCache_1.fetchWithCache)(`${BASE_URL}/people?page=${page}&limit=${limit}`, `people_${page}_${limit}`),
    getPerson: (id) => (0, fetchWithCache_1.fetchWithCache)(`${BASE_URL}/people/${id}`, `person_${id}`),
};
