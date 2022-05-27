
namespace webapi.Data
{
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;
    using webapi.Models;

    public class FileManagerContext : IdentityDbContext
    {
        public FileManagerContext(DbContextOptions<FileManagerContext> options) 
            : base(options)
        {

        }
        public DbSet<FileManager> FileManager { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }

    }
} 