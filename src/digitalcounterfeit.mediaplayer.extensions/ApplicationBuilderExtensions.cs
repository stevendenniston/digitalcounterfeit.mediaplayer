using Microsoft.AspNetCore.Builder;

namespace digitalcounterfeit.mediaplayer.extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static void ConfigureEndpoints(this IApplicationBuilder app)
        {
            app.UseEndpoints(endpoints =>
            {
                app.UseSwagger();
                app.UseSwaggerUI(setup =>
                {
                    var descriptions = endpoints.DescribeApiVersions();

                    foreach (var description in descriptions)
                    {
                        setup.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json", description.GroupName.ToUpperInvariant());
                    }
                });                

                endpoints.MapControllers();
            });
        }
    }
}
