INSERT INTO dbo.TrainerAzureContainer(Id, containerUrl, trainerId)
VALUES 
('asset-4d018433-ffb5-4708-91d4-70cde306bc9e', '', '08ffcad3-986f-4015-abc8-312a6404bdbe')

select * from TrainerAzureContainer

INSERT INTO dbo.MediaAssets(Id, StreamingUrl, ThumbnailUrl, ContainerId)
VALUES 
('1', 'https://fitmedia-usea.streaming.media.azure.net/e0648564-cb0b-4ff4-b308-b629fff00e0c/ignite.ism/manifest', 'https://azurefitstorage.blob.core.windows.net/asset-4d018433-ffb5-4708-91d4-70cde306bc9e/Thumbnail000001.jpg', 'asset-4d018433-ffb5-4708-91d4-70cde306bc9e')



select * from TrainerAzureContainer

select * from MediaAssets




CREATE TABLE [dbo].[TrainerAzureContainer] (
	[Id] nvarchar(450) NOT NULL PRIMARY KEY,
    [containerUrl] nvarchar(450) NOT NULL,
    [trainerId] nvarchar(450) FOREIGN KEY REFERENCES [dbo].[AspNetUsers](Id) NOT NULL
);


CREATE TABLE [dbo].[MediaAssets] (
	[Id] nvarchar(450) NOT NULL PRIMARY KEY,
    [StreamingUrl] nvarchar(450) NOT NULL,
	[ThumbnailUrl] nvarchar(450) NOT NULL,
    [ContainerId] nvarchar(450) FOREIGN KEY REFERENCES [dbo].[TrainerAzureContainer](Id) NOT NULL
);

ALTER TABLE [dbo].[TrainerAzureContainer]
DROP COLUMN [StreamingUrl]

ALTER TABLE [dbo].[TrainerAzureContainer]
ADD [containerUrl] nvarchar(128);

CREATE TABLE [dbo].[FileManager] (
	[Id] nvarchar(450) NOT NULL PRIMARY KEY,
    [folderId] nvarchar(450) NOT NULL,
	[name] nvarchar(50) NOT NULL,
    [createdAt] date NOT NULL,
    [modifiedAt] date NOT NULL,
    [size] nvarchar(50) NOT NULL,
    [type] nvarchar(50) NOT NULL,
    [contents] nvarchar(50) NOT NULL,
    [description] nvarchar(50) NOT NULL,
    [userId] nvarchar(450) FOREIGN KEY REFERENCES [dbo].[AspNetUsers](Id) NOT NULL
);

CREATE TABLE [dbo].[TrainerDevelopmentFields] (
	[Id] nvarchar(450) NOT NULL PRIMARY KEY,
	[DevelopmentFieldId] nvarchar(450) FOREIGN KEY REFERENCES [dbo].[DevelopmentField](Id) NOT NULL,
    [userId] nvarchar(450) FOREIGN KEY REFERENCES [dbo].[AspNetUsers](Id) NOT NULL
);

INSERT INTO dbo.[DevelopmentField](Id, name, description)
VALUES 
('1', 'Bodybuilding coach', ''),
('2', 'Recovery', ''),
('3', 'Nutrition', ''),
('4', 'Personal trainer', ''),
('5', 'Injury prevention specialist', ''),
('6', 'Yoga instructor', ''),
('7', 'Pilates instructor', ''),
('8', 'Aerobics instructor', ''),
('9', 'Biking instructor', ''),
('10', 'Swimming instructor', ''),
('11', 'Running instructor', ''),


dotnet ef migrations add init

dotnet ef database update