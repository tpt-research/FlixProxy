var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var search = require('search-flix-locations');
var flix = require('flix');
var adapter = require('db-flix-cities');

var moment = require('moment');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/flix/query/:typed', async function (req, res, next) {
    var typed = req.params.typed;

    var result = await search(typed);

    res.status(200).send({
        success: 'true',
        message: result
    });
});

app.get('/flix/query/:typed/:limit', async function (req, res, next) {
    var typed = req.params.typed;
    var limit = req.params.limit;

    var result = await search(typed, limit);

    res.status(200).send({
        success: 'true',
        message: result
    });
});

app.get('/flix/journey/:fromID/:fromType/:toID/:toType', async function (req, res, next) {
    var fromID = {
        type: req.params.fromType,
        id: req.params.fromID
    };
    var toID = {
        type: req.params.toType,
        id: req.params.toID
    };

    var result = await flix.journeys(fromID, toID);

    res.status(200).send({
        success: 'true',
        message: result
    });
});

app.get('/flix/journey/:fromID/:fromType/:toID/:toType/:when', async function (req, res, next) {
    var fromID = {
        type: req.params.fromType,
        id: req.params.fromID
    };
    var toID = {
        type: req.params.toType,
        id: req.params.toID
    };
    var when = req.params.when;

    var option = {
        when: moment(when).toDate()
    };

    var result = await flix.journeys(fromID, toID, option);

    res.status(200).send({
        success: 'true',
        message: result
    });
});

app.get('/flix/journey/:fromID/:fromType/:toID/:toType/:when/:language', async function (req, res, next) {
    var fromID = {
        type: req.params.fromType,
        id: req.params.fromID
    };
    var toID = {
        type: req.params.toType,
        id: req.params.toID
    };
    var when = req.params.when;

    var option = {
        when: moment(when).toDate(),
        language: req.params.language
    };

    var result = await flix.journeys(fromID, toID, option);

    res.status(200).send({
        success: 'true',
        message: result
    });
});

app.get('/flix/convert/dbtoflix/:ID', async function (req, res, next) {
    var ID = req.params.ID;

    var result = await adapter.toFlix(ID);

    res.status(200).send({
        success: 'true',
        message: result
    });
});

app.get('/flix/convert/flixtodb/:ID', async function (req, res, next) {
    var ID = req.params.ID;

    var result = await adapter.toDB(ID);

    res.status(200).send({
        success: 'true',
        message: result
    });
});

module.exports = app;
