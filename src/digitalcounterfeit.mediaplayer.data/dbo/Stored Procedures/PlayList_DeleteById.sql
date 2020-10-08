CREATE PROCEDURE [dbo].[Playlist_DeleteById] (
	@Id UNIQUEIDENTIFIER
)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	--Needs some transaction love to add a little robustness...
	DELETE FROM [dbo].[Playlist]
	WHERE [Id] = @Id

	DELETE FROM [dbo].[PlaylistTrack]
	WHERE [PlaylistId] = @Id

END