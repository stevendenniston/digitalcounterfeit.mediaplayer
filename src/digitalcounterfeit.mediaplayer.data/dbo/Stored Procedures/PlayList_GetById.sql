CREATE PROCEDURE [dbo].[PlayList_GetById] (
	@Id UNIQUEIDENTIFIER
)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	SELECT
		[Id],
		[LibraryId],
		[Name]
	FROM
		[dbo].[PlayList]
	WHERE
		[Id] = @Id

	SELECT
		[AudioTrack].[Id],
		[AudioTrack].[Name],
		[AudioTrack].[Number],
		[AudioTrack].[DiscNumber],
		[Artist].[Id],
		[Artist].[LibraryId],
		[Artist].[Name],
		[Album].[Id],
		[Album].[LibraryId],
		[Album].[ArtistId],
		[Album].[Name]
	FROM
		[dbo].[PlayListTrack]
	LEFT JOIN
		[dbo].[AudioTrack]
	ON
		[AudioTrack].[Id] = [PlayListTrack].[AudioTrackId]
	LEFT JOIN
		[dbo].[Artist]
	ON
		[Artist].[Id] = [AudioTrack].[ArtistId]
	LEFT JOIN
		[dbo].[Album]
	ON
		[Album].[Id] = [AudioTrack].[AlbumId]
	WHERE
		[PlayListTrack].[PlayListId] = @Id
END