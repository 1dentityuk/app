import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vitest/config';
import svg from '@poppanator/sveltekit-svg';

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit(),
		svg({
			includePaths: ['./src/lib/assets/icons', './src/lib/assets/svg'],
			svgoOptions: {
				multipass: true,
				plugins: [
					{
						name: 'preset-default',
						params: { overrides: { removeViewBox: false } }
					},
					{
						name: 'removeAttrs',
						params: { attrs: '(width|height)' }
					}
				]
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		https: {
			key: './.cert/key.pem',
			cert: './.cert/cert.pem'
		},
		proxy: {}
	}
});
