USE Database_Name;
GO
SET RECOVERY SIMPLE;
GO
DBCC SHRINKFILE (File_Name, 1);
GO
SET RECOVERY FULL;
GO