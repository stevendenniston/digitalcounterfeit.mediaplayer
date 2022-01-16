using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Threading.Tasks;

namespace digitalcounterfeit.mediaplayer.extensions.Security
{
    public class HasScopeHandler : AuthorizationHandler<HasScopeRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, HasScopeRequirement requirement)
        {
            if (!context.User.HasClaim(claim => claim.Type == "scope" && claim.Issuer == requirement.Issuer))
                return Task.CompletedTask;

            var scopes = context.User.FindFirst(claim => claim.Type == "scope" && claim.Issuer == requirement.Issuer).Value.Split(' ');

            if (scopes.Any(scope => scope == requirement.Scope))
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
