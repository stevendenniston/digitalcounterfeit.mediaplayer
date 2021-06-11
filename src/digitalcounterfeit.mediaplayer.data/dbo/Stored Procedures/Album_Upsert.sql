CREATE PROCEDURE [dbo].[Album_Upsert] (
	@Id UNIQUEIDENTIFIER,
	@LibraryId UNIQUEIDENTIFIER,
	@ArtistId UNIQUEIDENTIFIER,
	@Name NVARCHAR(255),
	@Year NCHAR(4)
)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	IF EXISTS (SELECT 1 FROM [dbo].[Album] WHERE [Id] = @Id)
	BEGIN
		UPDATE [dbo].[Album]
		SET 
			[Name] = @Name,
			[Year] = @Year
		WHERE 
			[Id] = @Id
	END
	ELSE
	BEGIN
		INSERT INTO [dbo].[Album](
			[Id],
			[LibraryId],
			[ArtistId],
			[Name],
			[Year]
		)
		VALUES(
			@Id,
			@LibraryId,
			@ArtistId,
			@Name,
			@Year
		)
	END
END