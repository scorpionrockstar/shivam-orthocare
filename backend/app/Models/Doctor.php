<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Doctor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'photo', 'qualifications', 'specialization',
        'experience_years', 'bio', 'consultation_fee', 'available_days',
        'available_time_start', 'available_time_end', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'available_days' => 'array',
            'is_active' => 'boolean',
            'consultation_fee' => 'decimal:2',
        ];
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function patientVisits()
    {
        return $this->hasMany(PatientVisit::class);
    }
}
