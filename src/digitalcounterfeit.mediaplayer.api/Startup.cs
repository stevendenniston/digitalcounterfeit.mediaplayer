using digitalcounterfeit.mediaplayer.api.Data;
using digitalcounterfeit.mediaplayer.api.Data.Interfaces;
using digitalcounterfeit.mediaplayer.extensions;
using digitalcounterfeit.mediaplayer.services;
using digitalcounterfeit.mediaplayer.services.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

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

        public void ConfigureServices(IServiceCollection services)
        {
            services.ConfigureCors(Configuration, _corsPolicy);
            services.ConfigureAuthentication(Configuration);
            services.ConfigureAuthorization(Configuration);
            services.ConfigureControllers();
            services.ConfigureSwagger(Version);

            services.AddScoped<IAzureAudioStorage, AzureAudioStorage>();
            services.AddScoped<IAzureImageStorage, AzureImageStorage>();

            services.AddScoped<IAlbumRepository, AlbumRepository>();
            services.AddScoped<IArtistRepository, ArtistRepository>();
            services.AddScoped<IAudioTrackRepository, AudioTrackRepository>();
            services.AddScoped<IIdentityRepository, IdentityRepository>();
            services.AddScoped<ILibraryRepository, LibraryRepository>();
            services.AddScoped<IPlaylistRepository, PlaylistRepository>();
        }
        
        public void Configure(IApplicationBuilder app, IWebHostEnvironment environment)
        {
            if (environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(_corsPolicy);
            app.ConfigureExceptionHandler();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.ConfigureSwagger(Version);
            app.ConfigureEndpoints();
        }
    }
}
