using Microsoft.AspNetCore.Mvc;
using webapi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using webapi.Services;

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
        private ISendEmailService _sendEmailService;
        //private readonly ApplicationUser _applicationUser;

        public AccountController(
            UserManager<ApplicationUser> userManager, 
            SignInManager<ApplicationUser> signInManager,  
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ISendEmailService sendEmailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _sendEmailService = sendEmailService;
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
        [HttpPost("register-external")]
        public async Task<ActionResult> RegisterMemberInternal(RegisterExternalBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string pass = GeneratePassword(3, 3, 3, 3);
            var registerModel = new RegisterBindingModel();
            registerModel.Email = model.Email;
            registerModel.Password = pass;
            registerModel.ConfirmPassword = pass;

            var user = new ApplicationUser { UserName = registerModel.Email, Email = registerModel.Email };

            var currentUser = await _userManager.FindByNameAsync(user.UserName);

            if (currentUser != null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { Status = "Error", Message = "User already exists!" });
            }

            var result = await _userManager.CreateAsync(user, registerModel.Password);

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
            _ = _sendEmailService.SendEmailAsync(pass);

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

        private string GeneratePassword(int lowercase, int uppercase, int numerics, int alphaNumerics)
        {
            string lowers = "abcdefghijklmnopqrstuvwxyz";
            string uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string number = "0123456789";
            string alphaNumeric = "!@#$%^&*()";

            Random random = new Random();

            string generated = "!";
            for (int i = 1; i <= lowercase; i++)
                generated = generated.Insert(
                    random.Next(generated.Length),
                    lowers[random.Next(lowers.Length - 1)].ToString()
                );

            for (int i = 1; i <= uppercase; i++)
                generated = generated.Insert(
                    random.Next(generated.Length),
                    uppers[random.Next(uppers.Length - 1)].ToString()
                );

            for (int i = 1; i <= numerics; i++)
                generated = generated.Insert(
                    random.Next(generated.Length),
                    number[random.Next(number.Length - 1)].ToString()
                );
            for (int i = 1; i <= alphaNumerics; i++)
                generated = generated.Insert(
                    random.Next(generated.Length),
                    alphaNumeric[random.Next(alphaNumeric.Length - 1)].ToString()
                );

            return generated.Replace("!", string.Empty);

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

