const db = require('./db');

async function createData() {
	await db.query('DELETE FROM books');
	// await db.query("SELECT setval('invoices_id_seq', 1, false)");
	testBookResults = await db.query(
		`INSERT INTO books (isbn,  amazon_url, author, language, pages, publisher, title, year) VALUES ('0691161518', 'http://a.co/eobPtX2', 'Matthew Lane', 'english', 264, 'Princeton University Press', 'Power-Up: Unlocking the Hidden Mathematics in Video Games', 2017) RETURNING  *`
	);

	testBook = testBookResults.rows[0];
}

module.exports = { createData };
