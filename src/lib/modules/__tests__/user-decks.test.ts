import { beforeEach, describe, expect, it, vi } from 'vitest';

const list = vi.fn();
const create = vi.fn();
const update = vi.fn();
const remove = vi.fn();

vi.mock('$lib/api/decks', () => ({
	decksApi: {
		list,
		create,
		update,
		delete: remove
	}
}));

describe('userDecks module', () => {
	beforeEach(() => {
		list.mockReset();
		create.mockReset();
		update.mockReset();
		remove.mockReset();
		vi.resetModules();
	});

	it('loads and reconciles the user deck collection', async () => {
		const deckA = {
			id: 1,
			user_id: 1,
			title: 'Go Basics',
			description: '',
			is_public: false,
			upvote_count: 0,
			created_at: '',
			updated_at: ''
		};
		const deckB = { ...deckA, id: 2, title: 'Rust' };
		list.mockResolvedValue([deckA]);
		create.mockResolvedValue(deckB);
		update.mockResolvedValue({ ...deckA, title: 'Go Deep' });
		remove.mockResolvedValue(undefined);

		const { createUserDecksModule } = await import('$lib/modules/user-decks');
		const module = createUserDecksModule();
		let state: any = { decks: [], loading: true, saving: false };
		module.subscribe((value) => {
			state = value;
		});

		await module.initialize();
		expect(state.decks).toEqual([deckA]);
		expect(state.loading).toBe(false);

		await module.create({ title: 'Rust', description: '', is_public: false });
		expect(state.decks.map((deck: any) => deck.id)).toEqual([2, 1]);

		await module.update(1, { title: 'Go Deep', description: '', is_public: false });
		expect(state.decks.find((deck: any) => deck.id === 1)?.title).toBe('Go Deep');

		await module.remove(2);
		expect(state.decks.map((deck: any) => deck.id)).toEqual([1]);
		expect(state.saving).toBe(false);
	});
});
