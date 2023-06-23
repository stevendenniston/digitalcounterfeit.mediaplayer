using digitalcounterfeit.mediaplayer.fileprocessor;
using digitalcounterfeit.mediaplayer.fileprocessor.Clients;
using digitalcounterfeit.mediaplayer.fileprocessor.Clients.Interfaces;
using digitalcounterfeit.mediaplayer.services;
using digitalcounterfeit.mediaplayer.services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;
using System.Reflection;

Log.Logger = new LoggerConfiguration()
#if DEBUG
                .MinimumLevel.Debug()
#else
                .MinimumLevel.Information()
#endif
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
                .MinimumLevel.Override("System", LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.AspNetCore.Authentication", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.File(
                    @$"\LogFiles\Application\{Assembly.GetExecutingAssembly().GetName().Name}.txt",
                    fileSizeLimitBytes: 1_000_000,
                    rollOnFileSizeLimit: true,
                    shared: true,
                    flushToDiskInterval: TimeSpan.FromSeconds(1))
                .WriteTo.Console(
                    outputTemplate: "[{Timestamp:HH:mm:ss} {Level}] {SourceContext}{NewLine}{Message:lj}{NewLine}{Exception}{NewLine}",
                    theme: AnsiConsoleTheme.Code)
                .CreateLogger();

IHost host = Host.CreateDefaultBuilder(args)
    .UseSerilog()
    .ConfigureServices(services =>
    {
        services.AddHttpClient();
        services.AddSingleton<IMemoryCache, MemoryCache>();
        services.AddSingleton<IMediaPlayerApi, MediaPlayerApi>();
        services.AddSingleton<IAzureAudioStorage, AzureAudioStorage>();
        services.AddSingleton<IAzureImageStorage, AzureImageStorage>();
        services.AddHostedService<AudioFileProcessor>();
    })
    .Build();

await host.RunAsync();
