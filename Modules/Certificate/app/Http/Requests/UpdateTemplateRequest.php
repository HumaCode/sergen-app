<?php

namespace Modules\Certificate\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'orientation' => ['required', 'string', 'in:landscape,portrait'],
            'is_active'   => ['nullable', 'boolean'],
            'file'        => ['nullable', 'file', 'mimes:png,jpg,jpeg,pdf', 'max:10240'],
        ];
    }
}
