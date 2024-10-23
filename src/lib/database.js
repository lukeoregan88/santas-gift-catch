import mysql from 'mysql2/promise';

const pool = mysql.createPool({
	host: 'localhost',
	port: 8889,
	user: 'root',
	password: 'root',
	database: 'santa_scores', // Make sure this is correct
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

export async function saveScore(username, score) {
	try {
		await pool.execute('INSERT INTO scores (username, score) VALUES (?, ?)', [username, score]);
	} catch (error) {
		console.error('Error saving score:', error);
		throw error;
	}
}

export async function getLeaderboard() {
	try {
		const [rows] = await pool.execute(
			'SELECT username, score FROM scores ORDER BY score DESC LIMIT 10'
		);
		return rows;
	} catch (error) {
		console.error('Error getting leaderboard:', error);
		throw error;
	}
}
