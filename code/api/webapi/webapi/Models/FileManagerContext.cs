
namespace webapi.Data
{
    using Microsoft.EntityFrameworkCore;
    using webapi.Models;

    public class FileManagerContext : DbContext
    {
        public FileManagerContext(DbContextOptions<FileManagerContext> options) : base(options)
        {

        }

        
        public DbSet<FileManager> FileManager { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FileManager>().ToTable("FileManager");
        }

    }
} 