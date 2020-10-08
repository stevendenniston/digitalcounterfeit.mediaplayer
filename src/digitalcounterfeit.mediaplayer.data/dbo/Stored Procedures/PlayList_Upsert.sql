CREATE PROCEDURE [dbo].[PlayList_Upsert] (
	@Id UNIQUEIDENTIFIER,
	@LibraryId UNIQUEIDENTIFIER,
	@Name VARCHAR(255),
	@AudioTrackIdList [GuidList_TableType] READONLY
)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	--Needs some transaction love to add a little robustness...
	IF EXISTS (SELECT 1 FROM [dbo].[PlayList] WHERE [Id] = @Id)
	BEGIN
		UPDATE [dbo].[PlayList]
		SET [Name] = @Name 
		WHERE [Id] = @Id

		DELETE FROM [dbo].[PlayListTrack]
		WHERE [PlayListId] = @Id

		INSERT INTO 
			[dbo].[PlayListTrack]		
		SELECT
			@Id AS [PlayListId],
			[Id] AS [AudioTrackId]
		FROM
			@AudioTrackIdList
	END
	ELSE
	BEGIN
		INSERT INTO [dbo].[PlayList](
			[Id],
			[LibraryId],
			[Name]
		)
		VALUES(
			@Id,
			@LibraryId,
			@Name
		)

		INSERT INTO 
			[dbo].[PlayListTrack]		
		SELECT
			@Id AS [PlayListId],
			[Id] AS [AudioTrackId]
		FROM
			@AudioTrackIdList
	END
END