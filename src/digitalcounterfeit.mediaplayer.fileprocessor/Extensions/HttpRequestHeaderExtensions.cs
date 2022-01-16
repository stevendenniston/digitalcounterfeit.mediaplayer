using System.Net.Http.Headers;

namespace digitalcounterfeit.mediaplayer.fileprocessor.Extensions
{
    public static class HttpRequestHeaderExtensions
    {
        public static void Add(this HttpRequestHeaders requestHeaders, IEnumerable<KeyValuePair<string, string>> headers)
        {
            if (headers != null && headers.Any())
            {
                foreach (var header in headers)
                    requestHeaders.Add(header.Key, header.Value);
            }
        }
    }
}
