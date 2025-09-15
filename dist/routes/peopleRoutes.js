"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const peopleController_1 = require("../controllers/peopleController");
const router = (0, express_1.Router)();
router.get('/people', peopleController_1.getAllPeople);
router.get('/people/:id', peopleController_1.getPersonById);
exports.default = router;
