using digitalcounterfeit.mediaplayer.fileprocessor.Extensions;
using System.Net;
using System.Net.Http.Headers;
using System.Text;

namespace digitalcounterfeit.mediaplayer.fileprocessor.Clients
{
    public abstract class ApiClientBase
    {
        protected abstract HttpClient Client { get; }
        protected abstract string AccessToken { get; }


        public async Task<T> GetAsync<T>(string requestUri, IEnumerable<KeyValuePair<string, string>>? queryParameters = null, IEnumerable<KeyValuePair<string, string>>? headers = null)
        {
            var queryString = GetQueryString(queryParameters?.ToArray());

            using var request = new HttpRequestMessage(HttpMethod.Get, $"{requestUri}{queryString}");

            if (!string.IsNullOrWhiteSpace(AccessToken))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);

            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Add(headers);

            using var response = await Client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

            if (!response.IsSuccessStatusCode)
            {
                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    return default;
                }

                response.EnsureSuccessStatusCode();
            }

            var responseStream = await response.Content.ReadAsStreamAsync();
            return await responseStream.ReadAndDeserializeFromJsonAsync<T>();
        }

        public async Task PutAsync(string requestUri, object content, IEnumerable<KeyValuePair<string, string>>? headers = null)
        {
            var contentStream = new MemoryStream();
            await contentStream.SerializeToJsonAndWriteAsync(content);

            using var request = new HttpRequestMessage(HttpMethod.Put, requestUri);

            if (!string.IsNullOrWhiteSpace(AccessToken))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);

            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Add(headers);

            using var stream = new StreamContent(contentStream);

            request.Content = stream;
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            using var response = await Client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

            response.EnsureSuccessStatusCode();
        }

        public async Task PatchAsync(string requestUri, object content, IEnumerable<KeyValuePair<string, string>>? headers = null)
        {
            var contentStream = new MemoryStream();
            await contentStream.SerializeToJsonAndWriteAsync(content);

            using var request = new HttpRequestMessage(HttpMethod.Patch, requestUri);

            if (!string.IsNullOrWhiteSpace(AccessToken))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);

            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Add(headers);

            using var stream = new StreamContent(contentStream);

            request.Content = stream;
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json-patch+json");

            using var response = await Client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteAsync(string requestUri, IEnumerable<KeyValuePair<string, string>>? headers = null)
        {
            using var request = new HttpRequestMessage(HttpMethod.Delete, requestUri);

            if (!string.IsNullOrWhiteSpace(AccessToken))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", AccessToken);

            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Add(headers);

            using var response = await Client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

            response.EnsureSuccessStatusCode();
        }


        private string GetQueryString(params KeyValuePair<string, string>[] parameters)
        {
            if (parameters is null || parameters.Count() <= 0)
                return string.Empty;

            var queryString = new StringBuilder();

            queryString.Append('?');

            foreach (var param in parameters)
            {
                if (!string.IsNullOrWhiteSpace(param.Value))
                    queryString.Append($"{param.Key}={param.Value}&");
            }

            return queryString.ToString().TrimEnd('?', '&');
        }
    }
}