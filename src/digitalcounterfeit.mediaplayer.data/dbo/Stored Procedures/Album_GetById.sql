﻿CREATE PROCEDURE [dbo].[Album_GetById] (
	@Id UNIQUEIDENTIFIER
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
		[dbo].[Album]
	WHERE
		[Id] = @Id
END