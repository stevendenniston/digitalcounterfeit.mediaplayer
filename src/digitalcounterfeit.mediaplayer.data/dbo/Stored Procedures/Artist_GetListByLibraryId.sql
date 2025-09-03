CREATE PROCEDURE [dbo].[Artist_GetListByLibraryId] (
	@LibraryId UNIQUEIDENTIFIER
) AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	SELECT 
		[Id], 
		[LibraryId], 
		[Name]
	FROM 
		[dbo].[Artist]
	WHERE 
		[LibraryId] = @LibraryId
END
GO;