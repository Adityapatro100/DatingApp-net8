using System;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers;


public class UsersController(DataContext context) : BaseApiController
{   
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {
        var users = await context.Users.ToListAsync();
        return users; 
    }

    [Authorize]
    [HttpGet("{Id}")]   // localhost:5001/api/users/3
    public async Task<ActionResult<AppUser>> GetUser(int Id)
    {
        var user = await context.Users.FindAsync(Id);

        if (user == null) return NotFound();

        return user; 
    }
}
