<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Controle de acesso à documentação interativa da API (Scramble / Swagger UI)
        Gate::define('viewApiDocs', function (?User $user = null) {
            if (app()->environment('local', 'testing')) {
                return true;
            }

            return env('API_DOCS_PUBLIC', false) || $user?->isRoot();
        });
    }
}
