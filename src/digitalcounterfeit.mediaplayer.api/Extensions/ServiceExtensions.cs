using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;

namespace digitalcounterfeit.mediaplayer.api.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureControllers(this IServiceCollection services)
        {
            services.AddControllers(opt =>
            {
                opt.ReturnHttpNotAcceptable = true;
            }).AddNewtonsoftJson(opt =>
            {
                opt.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });
        }

        public static void ConfigureCors(this IServiceCollection services, string policyName)
        {
            services.AddCors(opt =>
            {
                opt.AddPolicy(
                    name: policyName,
                    builder =>
                    {
                        builder.WithHeaders("X-UserId");
                    });
            });
        }
    }
}
