CREATE PROCEDURE [dbo].[Artist_Upsert] (
	@Id UNIQUEIDENTIFIER,
	@LibraryId UNIQUEIDENTIFIER,
	@Name VARCHAR(255)
)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	IF EXISTS (SELECT 1 FROM [dbo].[Artist] WHERE [Id] = @Id)
	BEGIN
		UPDATE [dbo].[Artist] 
		SET [Name] = @Name 
		WHERE [Id] = @Id
	END
	ELSE
	BEGIN
		INSERT INTO [dbo].[Artist](
			[Id],
			[LibraryId],
			[Name]
		)
		VALUES(
			@Id,
			@LibraryId,
			@Name
		)
	END
END