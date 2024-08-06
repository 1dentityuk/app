import { readable, derived, writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import type { Readable } from 'svelte/store';

const documentDimensions = readable({ width: 0, height: 0 }, (set) => {
	if (browser) {
		set({
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		});

		window.addEventListener('resize', () => {
			set({
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight
			});
		});
	}
});

const defaultBreakpoints = [
	{
		name: 'sm',
		breakPoint: 576
	},
	{
		name: 'md',
		breakPoint: 768
	},
	{
		name: 'lg',
		breakPoint: 992
	},
	{
		name: 'xl',
		breakPoint: 1200
	},
	{
		name: 'xxl',
		breakPoint: 1400
	}
];

const breakPoints = writable(defaultBreakpoints);

function getLevel(name: string) {
	const bps = get(breakPoints);
	for (let i = 0; i < bps.length; i++) {
		if (bps[i].name === name) {
			return bps[0].breakPoint === 0 ? i : i + 1;
		}
	}

	console.error('MediaQuery: invalid name parameter');
	return -1;
}

function getIndex(name: string) {
	const bps = get(breakPoints);
	return bps.findIndex((bp) => {
		return bp.name === name;
	});
}

class MediaQuery {
	name: string = '';
	level: number = -1;

	constructor(name: string, level: number) {
		this.name = name;
		this.level = level;
	}

	is = (name: string): boolean => {
		const lastCharacter = name.slice(name.length - 1);
		const shortName = name.slice(0, name.length - 1);
		if (lastCharacter === '+') {
			return this.level >= getLevel(shortName);
		} else if (lastCharacter === '-') {
			return this.level <= getLevel(shortName);
		} else {
			return this.name === name;
		}
	};

	applyIf = (name: string, data: any) => {
		const lastCharacter = name.slice(name.length - 1);
		const shortName = name.slice(0, name.length - 1);
		if (lastCharacter === '+') {
			if (this.level >= getLevel(shortName)) {
				return data;
			}
		} else if (lastCharacter === '-') {
			if (this.level <= getLevel(shortName)) {
				return data;
			}
		} else if (this.name === name) {
			return data;
		}

		return '';
	};

	apply = (...args: any) => {
		const index = getIndex(this.name);
		let data = '';

		for (let i = 0; i < args.length; i++) {
			if (args[i]) {
				data = args[i];
			}

			if (i === index) {
				break;
			}
		}

		return data;
	};
}

let lastBreakPoint = '';

const documentQuery = derived(
	[documentDimensions, breakPoints],
	([$documentDimensions, $breakPoints], set) => {
		const width = $documentDimensions.width;

		for (let i = $breakPoints.length - 1; i >= 0; i--) {
			if (width >= $breakPoints[i].breakPoint) {
				if (lastBreakPoint !== $breakPoints[i].name) {
					lastBreakPoint = $breakPoints[i].name;

					const level = $breakPoints[0].breakPoint === 0 ? i : i + 1;
					set(new MediaQuery($breakPoints[i].name, level));
				}

				return;
			}
		}

		if (lastBreakPoint !== '') {
			lastBreakPoint = '';
			set(new MediaQuery('', 0));
		}
	},
	new MediaQuery('', 0)
);

class mediaQueryManager {
	dimensionStore: Readable<{ width: number; height: number }>;
	mediaQueryStore: Readable<MediaQuery>;

	constructor() {
		this.dimensionStore = documentDimensions;
		this.mediaQueryStore = documentQuery;
	}

	setMediaBreakPoints(breakpoints: Array<{ name: string; breakPoint: number }>) {
		if (breakpoints.length === 0) {
			console.error('mediaQueryManager.setMediaBreakPoints(): invalid parameter');
			return;
		}

		const names: Array<string> = [];
		const dimensions: Array<number> = [];
		breakpoints.forEach((breakpoint) => {
			if (!breakpoint.name || !breakpoint.breakPoint || breakpoint.breakPoint < 0) {
				console.error('mediaQueryManager.setMediaBreakPoints(): invalid parameter');
				return;
			}

			names.push(breakpoint.name);
			dimensions.push(breakpoint.breakPoint);
		});

		const setNames = new Set(names);
		const setDimensions = new Set(dimensions);
		if (setNames.size !== breakpoints.length || setDimensions.size !== breakpoints.length) {
			console.error('mediaQueryManager.setMediaBreakPoints(): invalid parameter');
			return;
		}

		breakpoints.sort((a, b) => {
			return a.breakPoint - b.breakPoint;
		});

		breakPoints.set(breakpoints);
	}
}

export default new mediaQueryManager();
