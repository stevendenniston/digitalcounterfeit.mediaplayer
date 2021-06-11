CREATE PROCEDURE [dbo].[Album_GetByArtistIdAlbumName] (
	@ArtistId UNIQUEIDENTIFIER,
	@AlbumName NVARCHAR(255)
) AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	SELECT
		[Id],
		[LibraryId],
		[ArtistId],
		[Name],
		[Year]
	FROM
		[dbo].[Album]
	WHERE
		[ArtistId] = @ArtistId 
		AND
		[Name] = @AlbumName
END