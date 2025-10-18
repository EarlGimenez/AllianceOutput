USE BookItDB; 
GO

-- =========================================================================
-- 1. Create the Rooms Table
-- =========================================================================
CREATE TABLE Rooms (
    -- Primary Key
    RoomID          UNIQUEIDENTIFIER    NOT NULL PRIMARY KEY DEFAULT NEWID(),
    
    -- Room Details
    Name            NVARCHAR(255)       NOT NULL,
    Location        NVARCHAR(255)       NOT NULL,
    TimeStart       TIME                NOT NULL, 
    TimeEnd         TIME                NOT NULL, 
    Purpose         NVARCHAR(100)       NULL,
    ImageURL        NVARCHAR(MAX)       NULL,
    
    -- Audit Columns
    CreatedAt       DATETIMEOFFSET      NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CreatedBy       NVARCHAR(100)       NOT NULL,
    ModifiedAt      DATETIMEOFFSET      NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    ModifiedBy      NVARCHAR(100)       NOT NULL
);
GO

-- =========================================================================
-- 2. Create the Users Table
-- =========================================================================
CREATE TABLE Users (
    -- Primary Key
    UserID          UNIQUEIDENTIFIER    NOT NULL PRIMARY KEY DEFAULT NEWID(),
    
    -- User Details
    FirstName       NVARCHAR(100)       NOT NULL,
    LastName        NVARCHAR(100)       NOT NULL,
    Username        NVARCHAR(100)       NOT NULL CONSTRAINT UC_Users_Username UNIQUE,
    Email           NVARCHAR(255)       NOT NULL CONSTRAINT UC_Users_Email UNIQUE,
    PasswordHash    NVARCHAR(255)       NOT NULL,
    Company         NVARCHAR(150)       NULL,
    IsActive        BIT                 NOT NULL DEFAULT 1,
    
    -- Audit Columns
    CreatedAt       DATETIMEOFFSET      NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CreatedBy       NVARCHAR(100)       NOT NULL,
    ModifiedAt      DATETIMEOFFSET      NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    ModifiedBy      NVARCHAR(100)       NOT NULL
);
GO

-- =========================================================================
-- 3. Create the Bookings Table
-- =========================================================================
CREATE TABLE Bookings (
    -- Primary Key
    BookingID       UNIQUEIDENTIFIER    NOT NULL PRIMARY KEY DEFAULT NEWID(),
    
    -- Foreign Keys 
    RoomID          UNIQUEIDENTIFIER    NOT NULL,
    UserID          UNIQUEIDENTIFIER    NOT NULL,
    
    -- Booking Details
    Title           NVARCHAR(255)       NOT NULL,
    BookingDate     DATE                NOT NULL,
    StartTime       TIME                NOT NULL,
    EndTime         TIME                NOT NULL,
    Description     NVARCHAR(MAX)       NULL,
    RecurrenceRule  NVARCHAR(MAX)       NULL,
    
    -- Audit Columns
    CreatedAt       DATETIMEOFFSET      NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CreatedBy       NVARCHAR(100)       NOT NULL,
    ModifiedAt      DATETIMEOFFSET      NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    ModifiedBy      NVARCHAR(100)       NOT NULL,
    
    -- FOREIGN KEY Constraints
    CONSTRAINT FK_Bookings_Rooms FOREIGN KEY (RoomID) REFERENCES Rooms (RoomID),
    CONSTRAINT FK_Bookings_Users FOREIGN KEY (UserID) REFERENCES Users (UserID)
);
GO