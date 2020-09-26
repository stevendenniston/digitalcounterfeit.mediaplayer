CREATE TABLE [dbo].[AudioTrack] (
	[Id] UNIQUEIDENTIFIER,
	[ArtistId] UNIQUEIDENTIFIER,
	[AlbumId] UNIQUEIDENTIFIER,
	[Name] VARCHAR(255),
	[Number] INT,
	[DiscNumber] INT
)
GO;