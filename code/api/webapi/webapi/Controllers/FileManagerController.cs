using webapi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using webapi.Data;

namespace webapi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FileManagerController : ControllerBase
    {
        private readonly FileManagerContext _db;

        private readonly UserManager<ApplicationUser> _userManager;
        public FileManagerController(FileManagerContext db,
            UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _db = db;
        }

        [Authorize]
        [HttpPost("create-item")]
        public async Task<ActionResult> CreateFolder(FileManager model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var currentUser = await _userManager.FindByEmailAsync(claimsIdentity.Name);

            model.userId = currentUser.Id;
            model.createdAt = DateTime.Now;
            model.modifiedAt = DateTime.Now;

            _db.FileManager.Add(model);
            _db.SaveChanges();

            return Ok("OK");
        }
        [Authorize]
        [HttpGet("get-items")]
        public async Task<ActionResult> GetItems(string? folderId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var currentUser = await _userManager.FindByEmailAsync(claimsIdentity.Name);

            FileManager[] result = _db.FileManager.Where(s => s.userId == currentUser.Id && s.folderId == folderId).ToArray();

            return Ok(result);
        }
    }
}