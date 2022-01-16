using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;

namespace digitalcounterfeit.mediaplayer.fileprocessor.Extensions
{
    internal static class StreamExtensions
    {
        public static async Task<T> ReadAndDeserializeFromJsonAsync<T>(this Stream stream)
        {
            if (stream == null)
            {
                throw new ArgumentNullException(nameof(stream));
            }

            if (!stream.CanRead)
            {
                throw new NotSupportedException("Can't read from this stream...");
            }

            using var reader = new StreamReader(stream, new UTF8Encoding(), true, 1024, true);
            using var jsonTextReader = new JsonTextReader(reader);

            var jToken = await JToken.LoadAsync(jsonTextReader);
            var settings = new JsonSerializerSettings
            {
                DateParseHandling = DateParseHandling.DateTimeOffset,
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                DateTimeZoneHandling = DateTimeZoneHandling.Utc
            };

            return jToken.ToObject<T>(JsonSerializer.CreateDefault(settings));
        }

        public static async Task SerializeToJsonAndWriteAsync<T>(this Stream stream, T content)
        {
            if (stream == null)
            {
                throw new ArgumentNullException(nameof(stream));
            }

            if (!stream.CanWrite)
            {
                throw new NotSupportedException("Can't write to this stream...");
            }

            using (var streamWriter = new StreamWriter(stream, new UTF8Encoding(), 1024, true))
            {
                using var jsonWriter = new JsonTextWriter(streamWriter);

                var serializer = new JsonSerializer();
                serializer.Serialize(jsonWriter, content);
                await jsonWriter.FlushAsync();
            }

            if (stream.CanSeek)
            {
                stream.Seek(0, SeekOrigin.Begin);
            }
        }
    }
}
