import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hSet('car1', {
		color: 'red',
		year: 1951
	});

	await client.hSet('car2', {
		color: 'green',
		year: 1952
	});

	await client.hSet('car3', {
		color: 'yellow',
		year: 1953
	});

	const results = await Promise.all([
		client.hGetAll('car1'),
		client.hGetAll('car2'),
		client.hGetAll('car3')
	]);

	console.log(results);
};

run();
