using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class FileModel
    {
        [Key]
        public string Id { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public string folderId { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public string name { get; set; }

        [DataType(DataType.Text)]
        public string UserId { get; set; }

        [DataType(DataType.DateTime)]
        public string createdAt { get; set; }

        [DataType(DataType.DateTime)]
        public string modifiedAt { get; set; }

        [DataType(DataType.Text)]
        public string size { get; set; }

        [Required]
        [DataType(DataType.Text)]
        public string type { get; set; }

        [DataType(DataType.Text)]
        public string contents { get; set; }

        [DataType(DataType.Text)]
        public string description { get; set; }
    }
}
