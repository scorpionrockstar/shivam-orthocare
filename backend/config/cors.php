<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'storage/*'],

    'allowed_methods' => ['*'],

    // Exact origins come from FRONTEND_URL; we also allow any Vercel preview
    // deployment for this project via the regex list.
    'allowed_origins' => array_filter([
        env('FRONTEND_URL', 'http://localhost:3000'),
    ]),

    'allowed_origins_patterns' => [
        '#^https://shivam-orthocare(-[a-z0-9]+)?(\.[a-z0-9-]+)?\.vercel\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
