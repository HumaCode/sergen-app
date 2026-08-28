<?php

namespace Modules\Certificate\Providers;

use Nwidart\Modules\Support\ModuleServiceProvider;

class CertificateServiceProvider extends ModuleServiceProvider
{
    /**
     * The name of the module.
     */
    protected string $name = 'Certificate';

    /**
     * The lowercase version of the module name.
     */
    protected string $nameLower = 'certificate';

    /**
     * Provider classes to register.
     *
     * @var string[]
     */
    protected array $providers = [
        EventServiceProvider::class,
        RouteServiceProvider::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        parent::register();

        $this->app->bind(
            \Modules\Certificate\Repositories\Contracts\CertificateTemplateRepositoryInterface::class,
            \Modules\Certificate\Repositories\Eloquent\CertificateTemplateRepository::class
        );

        $this->app->bind(
            \Modules\Certificate\Services\Contracts\CertificateTemplateServiceInterface::class,
            \Modules\Certificate\Services\CertificateTemplateService::class
        );
    }
}
