<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiDocumentationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite']);
        config(['database.connections.sqlite.database' => database_path('database.sqlite')]);
    }
    /**
     * Testa se a rota da UI interativa da documentação responde com sucesso.
     */
    public function test_api_documentation_ui_is_accessible(): void
    {
        $response = $this->get('/docs/api');

        $response->assertStatus(200);
        $response->assertSee('elements-api');
    }

    /**
     * Testa se o endpoint do OpenAPI JSON responde com a especificação OpenAPI 3.1 válida.
     */
    public function test_openapi_json_specification_is_served(): void
    {
        $response = $this->get('/docs/api.json');

        $response->assertStatus(200);
        $response->assertJsonPath('openapi', '3.1.0');
        $response->assertJsonPath('info.title', 'Na Prancheta | API Docs (Swagger / Elements)');
        $response->assertJsonStructure([
            'openapi',
            'info',
            'paths',
            'components' => [
                'securitySchemes',
            ],
        ]);
    }
}
