CREATE PROCEDURE [dbo].[PlayList_DeleteById] (
	@Id UNIQUEIDENTIFIER
)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	--Needs some transaction love to add a little robustness...
	DELETE FROM [dbo].[PlayList]
	WHERE [Id] = @Id

	DELETE FROM [dbo].[PlayListTrack]
	WHERE [PlayListId] = @Id

END