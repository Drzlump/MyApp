'use strict';

const joi = require('joi');

const getTest = (request, h) => {
    return '<h1>Hellow Fab</h1>'
};

const getDyn = (request, h) => {
    return `<h1>Your number is ${request.params.number}</h1>`
};
const schema = {
    fab: joi
    .string() 
};

module.exports = {
    getTest,
    getDyn,
    schema
};