﻿CREATE PROCEDURE [map].[Identity_Upsert] (
	@Id UNIQUEIDENTIFIER,
	@SubjectId NVARCHAR(255)
)
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	IF NOT EXISTS (SELECT 1 FROM [map].[Identity] WHERE [Id] = @Id AND [SubjectId] = @SubjectId)
	BEGIN
		INSERT INTO [map].[Identity] ([Id], [SubjectId])
		VALUES (@Id, @SubjectId)
	END
END