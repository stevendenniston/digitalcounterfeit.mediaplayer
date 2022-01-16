CREATE PROCEDURE [map].[Identity_GetBySubjectId] (
	@SubjectId NVARCHAR(255)
)
AS
BEGIN

	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

	SELECT
		[Id],
		[SubjectId]
	FROM
		[map].[Identity]
	WHERE
		[SubjectId] = @SubjectId

END