CREATE PROCEDURE [dbo].[AudioTrack_Upsert] (
	@Id UNIQUEIDENTIFIER,	
	@ArtistId UNIQUEIDENTIFIER,
	@AlbumId UNIQUEIDENTIFIER,
	@Name NVARCHAR(255),
	@Number INT,
	@DiscNumber INT
)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	IF EXISTS (SELECT 1 FROM [dbo].[AudioTrack] WHERE [Id] = @Id)
	BEGIN
		UPDATE [dbo].[AudioTrack]
		SET 
			[ArtistId] = @ArtistId,
			[AlbumId] = @AlbumId,
			[Name] = @Name,
			[Number] = @Number,
			[DiscNumber] = @DiscNumber
		WHERE [Id] = @Id
	END
	ELSE
	BEGIN
		INSERT INTO [dbo].[AudioTrack](
			[Id],			
			[ArtistId],
			[AlbumId],
			[Name],
			[Number],
			[DiscNumber]
		)
		VALUES(
			@Id,			
			@ArtistId,
			@AlbumId,
			@Name,
			@Number,
			@DiscNumber
		)
	END
END