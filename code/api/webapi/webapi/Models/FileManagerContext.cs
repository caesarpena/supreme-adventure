
namespace webapi.Data
{
    using Microsoft.EntityFrameworkCore;
    using webapi.Models;

    public class FileManagerContext : DbContext
    {
        public FileManagerContext(DbContextOptions<FileManagerContext> options) : base(options)
        {

        }
        public DbSet<FileModel> FileManager { get; set; }

    }
} 