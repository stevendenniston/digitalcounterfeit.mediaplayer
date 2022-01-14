using digitalcounterfeit.mediaplayer.api.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;
using System.Security.Claims;

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
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = configuration.GetValue<string>("AuthenticationDomain");
                    options.Audience = configuration.GetValue<string>("AuthenticationAudience");
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        NameClaimType = ClaimTypes.NameIdentifier
                    };
                });
        }

        public static void ConfigureAuthorization(this IServiceCollection services, IConfiguration configuration)
        {
            var domain = configuration.GetValue<string>("AuthenticationDomain");

            services.AddAuthorization(options =>
            {
                options.AddPolicy("read:api", policy => policy.Requirements.Add(new HasScopeRequirement("read:api", domain)));
                options.AddPolicy("write:api", policy => policy.Requirements.Add(new HasScopeRequirement("write:api", domain)));
            });

            services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();
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
