using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;

namespace digitalcounterfeit.mediaplayer.api.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureControllers(this IServiceCollection services)
        {
            services.AddControllers(options =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                options.Filters.Add(new AuthorizeFilter(policy));

                options.ReturnHttpNotAcceptable = true;
            })
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });
        }

        public static void ConfigureCors(this IServiceCollection services, IConfiguration configuration, string policyName)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(
                    name: policyName,
                    builder =>
                    {
                        builder.WithOrigins(configuration.GetValue<string>("CorsOrigin"));
                        builder.WithHeaders("Content-Type");
                        builder.WithHeaders("Authorization");
                        builder.WithMethods("GET", "PUT", "PATCH", "DELETE");
                    });
            });
        }

        public static void ConfigureAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication("token")
                .AddJwtBearer("token", options =>
                {
                    options.Authority = configuration.GetValue<string>("AuthenticationAuthority");
                    options.Audience = configuration.GetValue<string>("AuthenticationAudience");
                    options.TokenValidationParameters.ValidTypes = new[] { "at+jwt" };
                });
        }

        public static void ConfigureSwagger(this IServiceCollection services, string version)
        {
            services.AddSwaggerGen(opt =>
            {
                opt.SwaggerDoc(name: version, new OpenApiInfo { Title = "DigitalCounterfeit Media Player Api", Version = version });
            });
        }
    }
}
