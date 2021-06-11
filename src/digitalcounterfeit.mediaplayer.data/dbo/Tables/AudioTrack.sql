CREATE TABLE [dbo].[AudioTrack] (
	[Id] UNIQUEIDENTIFIER,
	[ArtistId] UNIQUEIDENTIFIER,
	[AlbumId] UNIQUEIDENTIFIER,
	[Name] NVARCHAR(255),
	[Number] INT,
	[DiscNumber] INT
)
GO;