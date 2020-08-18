using digitalcounterfeit.mediaplayer.api.Extensions;
using digitalcounterfeit.mediaplayer.api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace digitalcounterfeit.mediaplayer.api
{
    public class Startup
    {
        private readonly string _corsPolicy = "CorsPolicy";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            Version = Configuration.GetValue<string>("Version");
        }

        public IConfiguration Configuration { get; }
        public string Version { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.ConfigureCors(_corsPolicy);
            services.ConfigureControllers();

            services.AddSwaggerGen(opt =>
            {
                opt.SwaggerDoc(name: Version, new OpenApiInfo { Title = "DigitalCounterfeit Media Player Api", Version = Version });
            });

            services.AddSingleton<IAzureAudioStorage, AzureAudioStorage>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(_corsPolicy);
            app.ConfigureExceptionHandler();
            app.UseRouting();
            app.UseAuthorization();
            app.UseSwagger();
            app.UseSwaggerUI(config =>
            {
                config.SwaggerEndpoint(url: $"/swagger/{Version}/swagger.json", name: $"DigitalCounterfeit Media Player Api {Version}");
            });
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
