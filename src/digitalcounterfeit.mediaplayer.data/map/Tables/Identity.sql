CREATE TABLE [map].[Identity] (
	[Id] UNIQUEIDENTIFIER,
	[SubjectId] NVARCHAR(255)
)
GO;

CREATE UNIQUE INDEX idx_Identity_Id_SubjectId
ON [map].[Identity] ([Id], [SubjectId])
GO;