CREATE PROCEDURE [dbo].[AudioTrack_GetById] (
	@Id UNIQUEIDENTIFIER
)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

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
		[dbo].[AudioTrack]
	LEFT JOIN
		[dbo].[Artist]
	ON
		[Artist].[Id] = [AudioTrack].[ArtistId]
	LEFT JOIN 
		[dbo].[Album]
	ON
		[Album].[Id] = [AudioTrack].[AlbumId]
	WHERE
		[AudioTrack].[Id] = @Id
END