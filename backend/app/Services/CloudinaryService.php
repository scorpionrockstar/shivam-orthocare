<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    protected Cloudinary $cloudinary;

    public function __construct()
    {
        $cloudName = config('services.cloudinary.cloud_name');
        $apiKey    = config('services.cloudinary.api_key');
        $apiSecret = config('services.cloudinary.api_secret');

        if (!$cloudName || !$apiKey || !$apiSecret) {
            throw new \RuntimeException(
                'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, ' .
                'CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment.'
            );
        }

        Configuration::instance([
            'cloud' => [
                'cloud_name' => $cloudName,
                'api_key'    => $apiKey,
                'api_secret' => $apiSecret,
            ],
            'url' => ['secure' => true],
        ]);

        $this->cloudinary = new Cloudinary();
    }

    /**
     * Upload a file and return its secure URL.
     * $folder e.g. 'shivam-orthocare/doctors'
     */
    public function upload(UploadedFile $file, string $folder = 'shivam-orthocare'): string
    {
        $result = $this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            [
                'folder'         => $folder,
                'resource_type'  => 'image',
                'transformation' => [['quality' => 'auto', 'fetch_format' => 'auto']],
            ]
        );

        return $result['secure_url'];
    }

    /**
     * Delete an image by its Cloudinary public_id extracted from its URL.
     */
    public function deleteByUrl(string $url): void
    {
        // Extract public_id from URL like:
        // https://res.cloudinary.com/<cloud>/image/upload/v123/shivam-orthocare/doctors/abc.jpg
        if (!str_contains($url, 'res.cloudinary.com')) {
            return;
        }

        preg_match('#/upload/(?:v\d+/)?(.+?)(?:\.\w+)?$#', $url, $matches);
        if (!empty($matches[1])) {
            $this->cloudinary->uploadApi()->destroy($matches[1]);
        }
    }
}
