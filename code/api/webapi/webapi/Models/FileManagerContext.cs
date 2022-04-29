﻿using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using webapi.Models;
using DbContext = System.Data.Entity.DbContext;

namespace webapi.Models
{
    public class FileManagerContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx

        public FileManagerContext() : base("DefaultConnection")
        {
            Database.SetInitializer(new DropCreateDatabaseIfModelChanges<FileManagerContext>());
        }

            public static FileManagerContext Create()
            {
                return new FileManagerContext();
            }
        

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<FileManagerContext>(null);
            base.OnModelCreating(modelBuilder);
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }

        public System.Data.Entity.DbSet<FileModel> FileManager { get; set; }
    }
} 