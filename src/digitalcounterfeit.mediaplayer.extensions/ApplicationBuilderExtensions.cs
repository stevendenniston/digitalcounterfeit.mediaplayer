using Microsoft.AspNetCore.Builder;

namespace digitalcounterfeit.mediaplayer.extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static void ConfigureSwagger(this IApplicationBuilder app, string version)
        {
            app.UseSwagger();
            app.UseSwaggerUI(config =>
            {
                config.SwaggerEndpoint(url: $"/swagger/{version}/swagger.json", name: $"DigitalCounterfeit Media Player Api {version}");
            });
        }

        public static void ConfigureEndpoints(this IApplicationBuilder app)
        {
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
