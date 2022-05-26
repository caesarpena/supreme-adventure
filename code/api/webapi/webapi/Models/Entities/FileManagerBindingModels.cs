using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class FileManager
    {
        [Key] 
        public string Id { get; set; }

        public string? folderId { get; set; }

        [Required]
        public string name { get; set; }

        public string userId { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime createdAt { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime modifiedAt { get; set; }

        public string size { get; set; }

        [Required]
        public string type { get; set; }
        public string contents { get; set; }
        public string? description { get; set; }
    }
}
