'use strict'
const assert = require('assert');
const Greet = require('../GreetingFactoryFunc.js');
const postgres = require('pg');
const Pool = postgres.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/greetings'

const pool = new Pool({
    connectionString
});

describe('Greet Factory Function', function () {

    beforeEach(async function () {
        await pool.query('delete from greetings');
    });


    it('Should greet the Person in English and return Hello, Yegan', async function () {

        let greetFactory = Greet(pool)

        let greet = await greetFactory.checkGreet('Yegan', 'English')

        assert.equal(greet, 'Hello Andrew')

    });

    it('Should greet the Person in English and return Hello, Yegan', async function () {

        let greetFactory = Greet(pool)

        await greetFactory.checkGreet('Yegan', 'English')
        await greetFactory.checkGreet('Greg', 'English')

        let count = await greetFactory.count()
        assert.equal(count, 2)

    });

    after(async function () {
        await pool.end();
    })

});