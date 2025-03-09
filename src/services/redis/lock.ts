import { randomBytes } from 'cryto';
import { client } from './client';
export const withLock = async (key: string, cb: () => any) => {
	const retryDelayms = 100;
	let retries = 20;

	const token = randomBytes(6).toString('hex');

	const lockKey = `lock:${key}`;

	while (retries >= 0) {
		retries--;
		const acquired = await client.set(lockKey, token, {
			NX: true,
			PX: 2000
		});

		if (!acquired) {
			await pause(retryDelayms);
			continue;
		}

		try {
			const result = await cb();
			return result;
		} finally {
			await client.unlock(lockKey, token);
		}
	}
};

const buildClientProxy = () => {};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
