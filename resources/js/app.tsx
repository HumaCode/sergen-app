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

        const pagePath = `./Pages/${name}.tsx`;
        if (pages[pagePath]) {
            return resolvePageComponent(pagePath, pages);
        }

        // Search in Modules
        const moduleMatch = name.split('::');
        if (moduleMatch.length === 2) {
            const [moduleName, pageName] = moduleMatch;
            const modulePath = `../../Modules/${moduleName}/resources/assets/js/Pages/${pageName}.tsx`;
            if (pages[modulePath]) {
                return resolvePageComponent(modulePath, pages);
            }
        }

        return resolvePageComponent(pagePath, pages);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
