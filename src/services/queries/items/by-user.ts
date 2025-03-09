import { itemsIndexKey, itemsKey } from '$services/keys';
import { client } from '$services/redis';
import { deserialize } from './deserialize';

interface QueryOpts {
	page: number;
	perPage: number;
	sortBy: string;
	direction: string;
}

export const itemsByUser = async (userId: string, opts: QueryOpts) => {
	const query = `@ownerId:{${userId}}`;
	const sortCriteria = opts.direction &&
		opts.sortBy && {
			BY: opts.sortBy,
			DIRECTION: opts.direction
		};

	const { total, documents } = await client.ft.search(itemsIndexKey(), query, {
		ON: 'HASH',
		SORTBY: sortCriteria,
		LIMIT: {
			from: opts.page * opts.perPage,
			size: opts.perPage
		}
	} as any);
	return {
		totalPages: Math.ceil(total / opts.perPage),
		items: documents.map(({ id, value }) => {
			return deserialize(id.replace(itemsKey(''), ''), value as any);
		})
	};
};
