export const pageCacheKey = (id: string) => {
	return `pagecache#${id}`;
};

export const usersKey = (userId: string) => {
	return `users#${userId}`;
};

export const sessionsKey = (sessionId: string) => {
	return `sessions#${sessionId}`;
};

export const usernamesUniqueKey = () => 'usernames:unique';

export const userLikesKey = (userId: string) => `users:likes#${userId}`;

export const usernamesKey = () => 'usernames';

// items

export const itemsKey = (itemId: string) => {
	return `items#${itemId}`;
};

export const itemsByViewsKey = () => `items:views`;

export const itemsByEndingAtKey = () => `items:endingAt`;

export const itemsByPriceKey = () => `items:price`;

export const itemsViewsKey = (itemId: string) => `items:views#${itemId}`;

export const bidHistoryKey = (itemId: string) => `history#${itemId}`;

export const itemsIndexKey = () => `idx:items`
