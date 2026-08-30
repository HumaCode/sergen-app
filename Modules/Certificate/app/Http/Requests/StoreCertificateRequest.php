<?php

namespace Modules\Certificate\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCertificateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'template_id'        => ['nullable', 'string'],
            'participant_name'   => ['required', 'string', 'max:255'],
            'certificate_number' => ['required', 'string', 'max:255'],
            'issue_date'         => ['nullable', 'string', 'max:255'],
            'event_title'        => ['nullable', 'string', 'max:255'],
            'signatory_name'     => ['nullable', 'string', 'max:255'],
            'signatory_role'     => ['nullable', 'string', 'max:255'],
            'signature_file'     => ['nullable', 'file', 'mimes:png,jpg,jpeg', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'participant_name.required'   => 'Nama peserta wajib diisi.',
            'certificate_number.required' => 'Nomor sertifikat wajib diisi.',
            'signature_file.max'          => 'Ukuran file tanda tangan maksimal 5MB.',
        ];
    }
}
