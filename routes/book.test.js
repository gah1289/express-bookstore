process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');
const { createData } = require('../testData');

beforeEach(createData);

afterEach(async () => {
	await db.query(`DELETE FROM books`);
});

afterAll(async () => {
	await db.end();
});

describe('GET /books', () => {
	test('Get a list with one book', async () => {
		const res = await request(app).get('/books');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			books : [
				testBook
			]
		});
	});
});

describe('GET /books/:isbn', () => {
	test('Get a list with one book', async () => {
		const res = await request(app).get(`/books/${testBook.isbn}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			book : testBook
		});
	});
});

describe('POST /books', () => {
	test('Creates a single book', async () => {
		const res = await request(app).post('/books').send({
			isbn       : '1524796301',
			amazon_url :
				'https://www.amazon.com/dp/1524796301/ref=s9_acsd_al_bw_c2_x_3_i?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-14&pf_rd_r=BNKRR79FBG01B93J24NP&pf_rd_t=101&pf_rd_p=1767afb8-1f8e-47a6-a33c-ac84b1afe6fd&pf_rd_i=283155',
			author     : 'George R.R. Martin',
			language   : 'english',
			pages      : 752,
			publisher  : 'Bantam',
			title      :
				'Fire & Blood: 300 Years Before A Game of Thrones (The Targaryen Dynasty: The House of the Dragon)',
			year       : 2020
		});
		expect(res.statusCode).toBe(201);

		expect(res.body).toEqual({
			book : {
				isbn       : '1524796301',
				amazon_url :
					'https://www.amazon.com/dp/1524796301/ref=s9_acsd_al_bw_c2_x_3_i?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-14&pf_rd_r=BNKRR79FBG01B93J24NP&pf_rd_t=101&pf_rd_p=1767afb8-1f8e-47a6-a33c-ac84b1afe6fd&pf_rd_i=283155',
				author     : 'George R.R. Martin',
				language   : 'english',
				pages      : 752,
				publisher  : 'Bantam',
				title      :
					'Fire & Blood: 300 Years Before A Game of Thrones (The Targaryen Dynasty: The House of the Dragon)',
				year       : 2020
			}
		});
	});

	test('Rejects POST book with bad isbn', async () => {
		const res = await request(app).post('/books').send({
			isbn       : 'dog',
			amazon_url :
				'https://www.amazon.com/dp/1524796301/ref=s9_acsd_al_bw_c2_x_3_i?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-14&pf_rd_r=BNKRR79FBG01B93J24NP&pf_rd_t=101&pf_rd_p=1767afb8-1f8e-47a6-a33c-ac84b1afe6fd&pf_rd_i=283155',
			author     : 'George R.R. Martin',
			language   : 'english',
			pages      : 752,
			publisher  : 'Bantam',
			title      :
				'Fire & Blood: 300 Years Before A Game of Thrones (The Targaryen Dynasty: The House of the Dragon)',
			year       : 2020
		});

		expect(res.statusCode).toBe(400);
	});

	test('Rejects POST book with invalid year', async () => {
		const res = await request(app).post('/books').send({
			isbn       : '1524796301',
			amazon_url :
				'https://www.amazon.com/dp/1524796301/ref=s9_acsd_al_bw_c2_x_3_i?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-14&pf_rd_r=BNKRR79FBG01B93J24NP&pf_rd_t=101&pf_rd_p=1767afb8-1f8e-47a6-a33c-ac84b1afe6fd&pf_rd_i=283155',
			author     : 'George R.R. Martin',
			language   : 'english',
			pages      : 752,
			publisher  : 'Bantam',
			title      :
				'Fire & Blood: 300 Years Before A Game of Thrones (The Targaryen Dynasty: The House of the Dragon)',
			year       : 2030
		});
		console.log(res);
		expect(res.statusCode).toBe(400);
	});
});

describe('PUT /books/:isbn', () => {
	test('Updates a single book', async () => {
		const res = await request(app).put(`/books/${testBook.isbn}`).send({
			amazon_url : 'http://a.co/eobPtX2',
			author     : 'Matthew Lane',
			language   : 'spanish',
			pages      : 264,
			publisher  : 'Princeton University Press',
			title      : 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
			year       : 2017
		});
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			book : {
				isbn       : '0691161518',
				amazon_url : 'http://a.co/eobPtX2',
				author     : 'Matthew Lane',
				language   : 'spanish',
				pages      : 264,
				publisher  : 'Princeton University Press',
				title      : 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
				year       : 2017
			}
		});
	});
	test('Responds with 400 for invalid id', async () => {
		const res = await request(app).patch(`/books/0`).send({
			isbn       : '0691161518',
			amazon_url : 'http://a.co/eobPtX2',
			author     : 'Matthew Lane',
			language   : 'spanish',
			pages      : 264,
			publisher  : 'Princeton University Press',
			title      : 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
			year       : 2017
		});
		expect(res.statusCode).toBe(404);
	});
});

// describe('DELETE /companies/:code', () => {
// 	test('Deletes a single company', async () => {
// 		const res = await request(app).delete(`/companies/${testCompany.code}`);
// 		expect(res.statusCode).toBe(200);
// 		expect(res.body).toEqual({ status: 'deleted' });
// 	});
// });
