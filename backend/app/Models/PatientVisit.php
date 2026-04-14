<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientVisit extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_record_id', 'doctor_id', 'visit_date',
        'diagnosis', 'treatment', 'notes', 'next_visit_date',
    ];

    protected function casts(): array
    {
        return [
            'visit_date' => 'date',
            'next_visit_date' => 'date',
        ];
    }

    public function patientRecord()
    {
        return $this->belongsTo(PatientRecord::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}
