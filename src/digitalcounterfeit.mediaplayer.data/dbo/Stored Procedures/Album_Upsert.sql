CREATE PROCEDURE [dbo].[Album_Upsert] (
	@Id UNIQUEIDENTIFIER,
	@LibraryId UNIQUEIDENTIFIER,
	@ArtistId UNIQUEIDENTIFIER,
	@Name VARCHAR(255)
)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	IF EXISTS (SELECT 1 FROM [dbo].[Album] WHERE [Id] = @Id)
	BEGIN
		UPDATE [dbo].[Album]
		SET [Name] = @Name
		WHERE [Id] = @Id
	END
	ELSE
	BEGIN
		INSERT INTO [dbo].[Album](
			[Id],
			[LibraryId],
			[ArtistId],
			[Name]
		)
		VALUES(
			@Id,
			@LibraryId,
			@ArtistId,
			@Name
		)
	END
END