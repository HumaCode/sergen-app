import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob([
            './Pages/**/*.tsx',
            '../../Modules/*/resources/assets/js/Pages/**/*.tsx',
        ]);

        // Search in Modules if name contains '::'
        const moduleMatch = name.split('::');
        if (moduleMatch.length === 2) {
            const [moduleName, pageName] = moduleMatch;
            const targetSuffix = `/Modules/${moduleName}/resources/assets/js/Pages/${pageName}.tsx`.toLowerCase();
            
            const matchedKey = Object.keys(pages).find((key) =>
                key.replace(/\\/g, '/').toLowerCase().endsWith(targetSuffix)
            );

            if (matchedKey) {
                return resolvePageComponent(matchedKey, pages);
            }
        }

        return resolvePageComponent(`./Pages/${name}.tsx`, pages);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
