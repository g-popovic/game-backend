import { sum } from './token';

describe('token', () => {
	it('should return proper sum of 2 numbers', () => {
		expect(sum(1, 2)).toBe(3);
	});

	it('test test', () => {
		expect(1 + 1).toBe(2);
	});
});
