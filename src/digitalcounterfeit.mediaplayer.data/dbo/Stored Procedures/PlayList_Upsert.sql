CREATE PROCEDURE [dbo].[Playlist_Upsert] (
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
	IF EXISTS (SELECT 1 FROM [dbo].[Playlist] WHERE [Id] = @Id)
	BEGIN
		UPDATE [dbo].[Playlist]
		SET [Name] = @Name 
		WHERE [Id] = @Id

		DELETE FROM [dbo].[PlaylistTrack]
		WHERE [PlaylistId] = @Id

		INSERT INTO 
			[dbo].[PlaylistTrack]		
		SELECT
			@Id AS [PlaylistId],
			[Id] AS [AudioTrackId]
		FROM
			@AudioTrackIdList
	END
	ELSE
	BEGIN
		INSERT INTO [dbo].[Playlist](
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
			[dbo].[PlaylistTrack]		
		SELECT
			@Id AS [PlaylistId],
			[Id] AS [AudioTrackId]
		FROM
			@AudioTrackIdList
	END
END