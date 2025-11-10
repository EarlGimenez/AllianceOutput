-- =============================================
-- Create Notifications Table
-- =============================================

USE [BookItDB]
GO

-- Create Notifications table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Notifications](
        [NotificationID] [uniqueidentifier] NOT NULL DEFAULT NEWID(),
        [Title] [nvarchar](255) NOT NULL,
        [Message] [nvarchar](max) NOT NULL,
        [Type] [nvarchar](50) NOT NULL,
        [IsRead] [bit] NOT NULL DEFAULT 0,
        [RelatedEntityID] [uniqueidentifier] NULL,
        [CreatedAt] [datetimeoffset](7) NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        [CreatedBy] [nvarchar](100) NOT NULL,
        CONSTRAINT [PK_Notifications] PRIMARY KEY CLUSTERED ([NotificationID] ASC)
    )
END
GO

-- Create index on IsRead for faster queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Notifications_IsRead' AND object_id = OBJECT_ID('Notifications'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Notifications_IsRead] 
    ON [dbo].[Notifications] ([IsRead] ASC)
END
GO

-- Create index on CreatedAt for sorting
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Notifications_CreatedAt' AND object_id = OBJECT_ID('Notifications'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Notifications_CreatedAt] 
    ON [dbo].[Notifications] ([CreatedAt] DESC)
END
GO

PRINT 'Notifications table created successfully!'
GO
