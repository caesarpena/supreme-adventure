using Microsoft.AspNetCore.Mvc;
using webapi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        //public static User user = new User();
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        //private readonly ILogger<LogoutModel> _logger;
        private readonly IConfiguration _configuration;
        //private readonly ApplicationUser _applicationUser;

        public AccountController(
            UserManager<ApplicationUser> userManager, 
            SignInManager<ApplicationUser> signInManager,  
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
           // _applicationUser = applicationUser;
        }

        

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
            var currentUser = await _userManager.FindByNameAsync(user.UserName);

            if (currentUser != null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { Status = "Error", Message = "User already exists!" });
            }
                
            var roleresult = await _userManager.AddToRoleAsync(currentUser, UserRoles.Trainer);

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }
            

            // var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            /*if (_userManager.Options.SignIn.RequireConfirmedAccount)
            {
                return RedirectToPage("RegisterConfirmation",
                                        new { email = model.Email });
            }*/
            await _signInManager.SignInAsync(user, isPersistent: false);
            return Ok();
        }

        /// <summary>
        /// Admin register a member on behalf of the member.
        /// </summary>
        /// <param name="client">member email.</param>
        /// <returns></returns>
        // <RunAsync>
        [HttpPost("register-member-internal")]
        public async Task<ActionResult> RegisterMemberInternal(RegisterBindingModel model)
        {
            var pass = Guid.NewGuid().ToString("N");
            model.Password = pass;
            model.ConfirmPassword = pass;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser { UserName = model.Email, Email = model.Email };

            var currentUser = await _userManager.FindByNameAsync(user.UserName);

            if (currentUser != null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { Status = "Error", Message = "User already exists!" });
            }

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            if (!await _roleManager.RoleExistsAsync(UserRoles.Member))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Member));

            if (await _roleManager.RoleExistsAsync(UserRoles.Member))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.Member);
            }

            //send temp password to member email

            return Ok();
        }


        [HttpPost("register-trainer")]
        public async Task<ActionResult> RegisterTrainer(RegisterBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
            
            var currentUser = await _userManager.FindByNameAsync(user.UserName);

            if (currentUser != null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { Status = "Error", Message = "User already exists!" });
            }

            /*var roleresult = await _userManager.AddToRoleAsync(currentUser, UserRoles.Trainer);*/

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            if (!await _roleManager.RoleExistsAsync(UserRoles.Trainer))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Trainer));

            if (await _roleManager.RoleExistsAsync(UserRoles.Trainer))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.Trainer);
            }

            await _signInManager.SignInAsync(user, isPersistent: false);
            return Ok();
        }

        [HttpPost]
        [Route("token")]
        public async Task<ActionResult> Login(LoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };

                var currentUser = await _userManager.FindByNameAsync(user.UserName);
                if (currentUser != null && await _userManager.CheckPasswordAsync(currentUser, model.Password))
                {
                    var userRoles = await _userManager.GetRolesAsync(currentUser);

                    var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, currentUser.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                    foreach (var userRole in userRoles)
                    {
                        authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                    }

                    var token = GetToken(authClaims);

                    return Ok(new
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        expiration = token.ValidTo,
                        name = currentUser.FirstName,
                        lastname = currentUser.LastName,
                        role = "",
                });
                }
            }
            catch(System.Net.WebException error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { Status = "Error", Message = error.Message });
            }
            
            return Unauthorized();
        }
        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }

        [Authorize]
        [HttpGet("user-details")]
        public async Task<ActionResult> GetMe()
        {
            var identity = (ClaimsIdentity)User.Identity;
            var currentUser = await _userManager.FindByNameAsync(identity.Name);
            var avatar = "";
            var status = "";
            var user = new { currentUser.FirstName, currentUser.LastName, 
                currentUser.Email, avatar, status };
            return Ok(user);
        }

        private ActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
    }
}

