<?php

namespace Modules\Participant\Providers;

use Nwidart\Modules\Support\ModuleServiceProvider;
use Illuminate\Console\Scheduling\Schedule;

class ParticipantServiceProvider extends ModuleServiceProvider
{
    /**
     * The name of the module.
     */
    protected string $name = 'Participant';

    /**
     * The lowercase version of the module name.
     */
    protected string $nameLower = 'participant';

    /**
     * Command classes to register.
     *
     * @var string[]
     */
    // protected array $commands = [];

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
            \Modules\Participant\Repositories\Contracts\ParticipantRepositoryInterface::class,
            \Modules\Participant\Repositories\Eloquent\ParticipantRepository::class
        );

        $this->app->bind(
            \Modules\Participant\Services\Contracts\ParticipantServiceInterface::class,
            \Modules\Participant\Services\ParticipantService::class
        );
    }

    /**
     * Define module schedules.
     * 
     * @param $schedule
     */
    // protected function configureSchedules(Schedule $schedule): void
    // {
    //     $schedule->command('inspire')->hourly();
    // }
}
