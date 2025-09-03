using System.Linq;
using System.Security.Claims;

namespace digitalcounterfeit.mediaplayer.extensions
{
    public static class ClaimsPrincipalExtensions
    {
        private const string SUBJECT_ID = "sub";
        private const string NAME_IDENTIFIER = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

        public static string GetUserSubjectId(this ClaimsPrincipal user)
        {
            return user?.Claims.FirstOrDefault(claim => SUBJECT_ID.Contains(claim.Type) || NAME_IDENTIFIER.Contains(claim.Type))?.Value;
        }
    }
}
