using System;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")] // localhost:5001/api/users  
public class UsersController(DataContext context) : ControllerBase
{   

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {
        var users = await context.Users.ToListAsync();
        return users; 
    }

    [HttpGet("{Id}")]   // localhost:5001/api/users/3
    public async Task<ActionResult<AppUser>> GetUser(int Id)
    {
        var user = await context.Users.FindAsync(Id);

        if (user == null) return NotFound();

        return user; 
    }
}
