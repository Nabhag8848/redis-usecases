import { randomBytes } from 'crypto';
import { client } from './client';
export const withLock = async (key: string, cb: (redisClient: Client, signal: any) => any) => {
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
			const signal = { expired: false };
			setTimeout(() => {
				signal.expired = true;
			}, 2000);

			const proxiedClient = buildClientProxy(2000)
			const result = await cb(proxiedClient, signal);
			return result;
		} finally {
			await client.unlock(lockKey, token);
		}
	}
};

type Client = typeof client;

const buildClientProxy = (timeoutMs) => {
	const startTime = Date.now();

	const handler = {
		get(target: Client, prop: keyof Client) {
			if (Date.now() >= startTime + timeoutMs) {
				throw new Error('Lock has expired');
			}

			const value = target[prop];
			return typeof value === 'function' ? value.bind(target) : value;
		}
	};

	return new Proxy(client, handler) as Client;
};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
