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
    public class MembersController : ControllerBase
    {
        private readonly FileManagerContext _fileManagerDb;

        private readonly UserManager<ApplicationUser> _userManager;
        public MembersController(FileManagerContext fileManagerDb,
            UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _fileManagerDb = fileManagerDb;
        }

        [Authorize]
        [HttpPost("new-member-request")]
        public async Task<ActionResult> NewMemberRequest(string email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var claimsIdentity = User.Identity as ClaimsIdentity;
            var currentUser = await _userManager.FindByEmailAsync(claimsIdentity?.Name);

            var fm = new FileManager();
            fm.userId = currentUser.Id;

            try
            {
                _fileManagerDb.FileManager.Add(fm);
                _fileManagerDb.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { Status = "Error", Message = ex.Message });

            }

            return Ok(StatusCodes.Status200OK);
        }

        [Authorize]
        [HttpGet("get-members")]
        public async Task<ActionResult> GetMembers(string? folderId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var claimsIdentity = User.Identity as ClaimsIdentity;
            var currentUser = await _userManager.FindByEmailAsync(claimsIdentity?.Name);

            FileManager[] result = _fileManagerDb.FileManager.Where(s => s.userId == currentUser.Id && s.folderId == folderId).ToArray();

            FileManager[] folders = Array.FindAll(result, element => element.type == "folder");
            FileManager[] files = Array.FindAll(result, element => element.type == "file");
            FileManager[] path = Array.FindAll(result, element => element.type == "path");

            return Ok(new { folders, files, path });
        }


    }
}