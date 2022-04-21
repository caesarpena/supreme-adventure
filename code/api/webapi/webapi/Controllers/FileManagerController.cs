using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using webapi.Models;
using webapi.Models.Identity;

namespace webapi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FileManagerController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        private readonly UserManager<ApplicationUser> _userManager;
        public FileManagerController(ApplicationDbContext db,
            UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _db = db;
        }

        [Authorize]
        [HttpPost("create-folder")]
        public async Task<ActionResult> CreateFolder(FileModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var currentUser = await _userManager.FindByEmailAsync(claimsIdentity.Name);

            _db.
            return Ok("OK");
        }
    }
}