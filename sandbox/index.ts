import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hSet('car', {
		color: 'red',
		year: 1951
	});

	const car = await client.hGetAll('car#32');
};

run();
