<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_name', 'patient_phone', 'patient_email', 'doctor_id',
        'appointment_date', 'appointment_time', 'message', 'status', 'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'appointment_date' => 'date',
        ];
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}
