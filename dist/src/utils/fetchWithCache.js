"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithCache = fetchWithCache;
const axios_1 = __importDefault(require("axios"));
const cache_1 = __importDefault(require("../config/cache"));
async function fetchWithCache(url, cacheKey) {
    const cachedData = cache_1.default.get(cacheKey);
    if (cachedData)
        return cachedData;
    const { data } = await axios_1.default.get(url);
    cache_1.default.set(cacheKey, data);
    return data;
}
