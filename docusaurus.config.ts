import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Openbeehive Docs',
  tagline: 'Offline-first beekeeping records',
  favicon: 'img/favicon.svg',

  // Improve compatibility with the upcoming Docusaurus v4
  future: {
    v4: true,
  },

  url: 'https://docs.openbeehive.org',
  baseUrl: '/',

  organizationName: 'johnnycube',
  projectName: 'openbeehive-docs',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr', 'es', 'it'],
    localeConfigs: {
      en: {label: 'English'},
      de: {label: 'Deutsch'},
      fr: {label: 'Français'},
      es: {label: 'Español'},
      it: {label: 'Italiano'},
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // docs-only site: docs served at the root
          editUrl:
            'https://github.com/johnnycube/openbeehive-docs/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/openbeehive-social-card.svg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Openbeehive',
      logo: {
        alt: 'Openbeehive',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {type: 'docsVersionDropdown', position: 'right'},
        {type: 'localeDropdown', position: 'right'},
        {
          href: 'https://app.openbeehive.org',
          label: 'Open app',
          position: 'right',
        },
        {
          href: 'https://openbeehive.org',
          label: 'Website',
          position: 'right',
        },
        {
          href: 'https://github.com/johnnycube/openbeehive-app',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Getting started', to: '/'},
            {label: 'Using the app', to: '/using-the-app/dashboard'},
            {label: 'Self-hosting', to: '/self-hosting/quick-start'},
            {label: 'Beekeeping basics', to: '/beekeeping/getting-started'},
          ],
        },
        {
          title: 'Openbeehive',
          items: [
            {label: 'App', href: 'https://app.openbeehive.org'},
            {label: 'Website', href: 'https://openbeehive.org'},
            {label: 'GitHub', href: 'https://github.com/johnnycube/openbeehive-app'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Discussions', href: 'https://github.com/johnnycube/openbeehive-app/discussions'},
            {label: 'Issues', href: 'https://github.com/johnnycube/openbeehive-docs/issues'},
            {label: 'License (AGPL-3.0)', href: 'https://github.com/johnnycube/openbeehive-docs/blob/main/LICENSE'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Openbeehive · Licensed under AGPL-3.0`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'go', 'sql', 'nginx', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
