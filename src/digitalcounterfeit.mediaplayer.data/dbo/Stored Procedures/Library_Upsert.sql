CREATE PROCEDURE [dbo].[Library_Upsert] (
	@Id UNIQUEIDENTIFIER,
	@UserId UNIQUEIDENTIFIER,
	@Name NVARCHAR(255)
)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	IF EXISTS (SELECT 1 FROM [dbo].[Library] WHERE [Id] = @Id)
	BEGIN
		UPDATE [dbo].[Library] 
		SET [Name] = @Name 
		WHERE [Id] = @Id
	END
	ELSE
	BEGIN
		INSERT INTO [dbo].[Library](
			[Id],
			[UserId],
			[Name]
		)
		VALUES(
			@Id,
			@UserId,
			@Name
		)
	END
END