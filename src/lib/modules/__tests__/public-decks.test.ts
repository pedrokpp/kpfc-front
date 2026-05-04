import { beforeEach, describe, expect, it, vi } from 'vitest';

const listPublic = vi.fn();
const upvote = vi.fn();

vi.mock('$lib/api/decks', async () => {
	const actual = await vi.importActual<typeof import('$lib/api/decks')>('$lib/api/decks');
	return {
		...actual,
		decksApi: {
			...actual.decksApi,
			listPublic,
			upvote
		}
	};
});

describe('publicDecks module', () => {
	beforeEach(() => {
		listPublic.mockReset();
		upvote.mockReset();
		vi.resetModules();
	});

	it('loads public decks, switches sort, and reloads after upvote', async () => {
		const decks = [
			{
				id: 1,
				user_id: 1,
				title: 'Public',
				description: '',
				is_public: true,
				upvote_count: 2,
				created_at: '',
				updated_at: ''
			}
		];

		listPublic.mockResolvedValue(decks);
		upvote.mockResolvedValue(undefined);

		const { createPublicDecksModule } = await import('$lib/modules/public-decks');
		const module = createPublicDecksModule();
		let state: any;
		module.subscribe((value) => {
			state = value;
		});

		await module.initialize();
		expect(listPublic).toHaveBeenCalledWith('upvotes');
		expect(state.decks).toEqual(decks);

		await module.setSort('');
		expect(listPublic).toHaveBeenLastCalledWith(undefined);
		expect(state.sort).toBe('');

		await module.toggleUpvote(1);
		expect(upvote).toHaveBeenCalledWith(1);
		expect(listPublic).toHaveBeenCalledTimes(3);
		expect(state.upvotingId).toBeNull();
	});
});
