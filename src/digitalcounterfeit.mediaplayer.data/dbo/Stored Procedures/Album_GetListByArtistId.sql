CREATE PROCEDURE [dbo].[Album_GetListByArtistId](
	@ArtistId UNIQUEIDENTIFIER
) 
AS
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
		[Album]
	WHERE
		[ArtistId] = @ArtistId
END
GO;