<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->headers->get('Origin');

        // Allow: localhost for dev, the configured FRONTEND_URL, and any
        // *.vercel.app deployment (production + preview URLs).
        $allowed = $this->isAllowedOrigin($origin);

        // Short-circuit OPTIONS preflight requests so they never hit the app.
        if ($request->getMethod() === 'OPTIONS') {
            $response = response('', 204);
        } else {
            $response = $next($request);
        }

        if ($allowed && $origin) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Vary', 'Origin');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        $response->headers->set('Access-Control-Max-Age', '3600');

        return $response;
    }

    private function isAllowedOrigin(?string $origin): bool
    {
        if (!$origin) {
            return false;
        }

        $frontendUrl = rtrim(config('app.frontend_url') ?? env('FRONTEND_URL', ''), '/');
        if ($frontendUrl && $origin === $frontendUrl) {
            return true;
        }

        // Local dev
        if (in_array($origin, ['http://localhost:3000', 'http://127.0.0.1:3000'], true)) {
            return true;
        }

        // Any Vercel deployment (production and preview URLs).
        if (preg_match('#^https://[a-z0-9-]+\.vercel\.app$#i', $origin)) {
            return true;
        }

        return false;
    }
}
