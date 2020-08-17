using System.Linq;
using System.Security.Claims;

namespace digitalcounterfeit.mediaplayer.api.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserSubjectId(this ClaimsPrincipal user)
        {
            return user?.Claims.FirstOrDefault(claim => "sub".Equals(claim.Type))?.Value;
        }
    }
}
