import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import '../../../css/buat-sertifikat.css';
import {
    CertificateFormData,
    INITIAL_FORM_DATA,
    SYSTEM_PRESETS,
    TemplateOption,
} from '../../sertificate';
import { LivePreview } from './Partials/LivePreview';
import { ParticipantForm } from './Partials/ParticipantForm';
import { SignatureUploadModal } from './Partials/SignatureUploadModal';
import { Stepper } from './Partials/Stepper';
import { TemplatePicker } from './Partials/TemplatePicker';

interface CreateProps {
    templates?: TemplateOption[] | { data?: TemplateOption[] };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Create({ templates = [] }: CreateProps) {
    const customTemplatesList: TemplateOption[] = Array.isArray(templates)
        ? templates
        : Array.isArray((templates as any)?.data)
        ? (templates as any).data
        : [];

    const [currentStep, setCurrentStep] = useState<number>(2);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption | null>(
        customTemplatesList.length > 0 ? customTemplatesList[0] : SYSTEM_PRESETS[0]
    );
    const [showSigModal, setShowSigModal] = useState<boolean>(false);
    const [notification, setNotification] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<CertificateFormData>({
        ...INITIAL_FORM_DATA,
        template_id: (customTemplatesList.length > 0 ? customTemplatesList[0] : SYSTEM_PRESETS[0]).id,
    });

    const handleFieldChange = (field: keyof CertificateFormData, value: any) => {
        setData(field, value);
    };

    const handleSelectTemplate = (template: TemplateOption) => {
        setSelectedTemplate(template);
        setData('template_id', template.id);
    };

    const handleSaveSignature = (file: File | null, previewUrl: string | null) => {
        setData((prev) => ({
            ...prev,
            signature_file: file,
            signature_preview_url: previewUrl,
        }));
    };

    const handleSaveDraft = () => {
        setNotification('Draft sertifikat berhasil disimpan secara lokal!');
        setTimeout(() => setNotification(null), 3500);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        post(route('certificate.store'), {
            forceFormData: true,
            onSuccess: () => {
                setNotification(`Sertifikat untuk "${data.participant_name}" berhasil diterbitkan!`);
                setTimeout(() => setNotification(null), 4000);
            },
            onError: (errs) => {
                console.error('Validation errors:', errs);
            },
        });
    };

    return (
        <AuthenticatedLayout defaultSidebarCollapsed={true}>
            <Head title="Buat Sertifikat — SerGen" />

            {notification && (
                <div
                    style={{
                        position: 'fixed',
                        top: '80px',
                        right: '24px',
                        zIndex: 9999,
                        background: '#2A9D8F',
                        color: '#fff',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        fontSize: '13.5px',
                        fontWeight: 500,
                        boxShadow: '0 10px 25px rgba(42, 157, 143, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        animation: 'fadeIn 0.3s ease',
                    }}
                >
                    <i className="bi bi-check-circle-fill"></i>
                    <span>{notification}</span>
                </div>
            )}

            <div className="page-head">
                <div>
                    <h1>Buat Sertifikat</h1>
                    <p>Pilih template, isi data peserta, lalu terbitkan sertifikat.</p>
                </div>
                <a className="btn-ghost" href="#">
                    <i className="bi bi-layers"></i> Butuh banyak sekaligus? Pakai Batch
                </a>
            </div>

            {/* Stepper Partial */}
            <Stepper
                currentStep={currentStep}
                onStepClick={(stepId) => setCurrentStep(stepId)}
            />

            <form onSubmit={handleSubmit}>
                <div className="build-grid">
                    {/* LEFT Column: Form & Template Selector */}
                    <div>
                        <TemplatePicker
                            templates={customTemplatesList}
                            selectedTemplateId={data.template_id || (selectedTemplate?.id ?? '')}
                            onSelectTemplate={handleSelectTemplate}
                        />

                        <ParticipantForm
                            data={data}
                            onChange={handleFieldChange}
                            onOpenSigModal={() => setShowSigModal(true)}
                            errors={errors as Record<string, string>}
                            isCustomTemplate={Boolean(selectedTemplate?.file_url)}
                        />
                    </div>

                    {/* RIGHT Column: Live Preview Sticky */}
                    <div>
                        <LivePreview
                            data={data}
                            selectedTemplate={selectedTemplate}
                            onSaveDraft={handleSaveDraft}
                            onSubmitCertificate={handleSubmit}
                            isSubmitting={processing}
                        />
                    </div>
                </div>
            </form>

            {/* Signature Modal Partial */}
            <SignatureUploadModal
                show={showSigModal}
                onClose={() => setShowSigModal(false)}
                onSaveSignature={handleSaveSignature}
            />
        </AuthenticatedLayout>
    );
}
