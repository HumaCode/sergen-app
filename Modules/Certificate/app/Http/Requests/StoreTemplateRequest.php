<?php

namespace Modules\Certificate\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTemplateRequest extends FormRequest
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
            'file'        => ['nullable', 'file', 'mimes:png,jpg,jpeg,pdf', 'max:10240'],
            'is_active'   => ['nullable', 'boolean'],
        ];
    }
}
