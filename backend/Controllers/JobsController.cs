using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController : ControllerBase
{
    private readonly MongoDbService _db;

    public JobsController(MongoDbService db) => _db = db;

    private string? GetUserId() =>
        User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
        ?? User.FindFirst("sub")?.Value;

    // GET /api/jobs - public, list all open jobs
    [HttpGet]
    public async Task<IActionResult> GetJobs([FromQuery] string? search, [FromQuery] string? location, [FromQuery] string? status)
    {
        var filter = Builders<Job>.Filter.Empty;
        if (!string.IsNullOrWhiteSpace(search))
            filter &= Builders<Job>.Filter.Regex(j => j.Title, new MongoDB.Bson.BsonRegularExpression(search, "i"));
        if (!string.IsNullOrWhiteSpace(location))
            filter &= Builders<Job>.Filter.Regex(j => j.Location, new MongoDB.Bson.BsonRegularExpression(location, "i"));
        if (!string.IsNullOrWhiteSpace(status))
            filter &= Builders<Job>.Filter.Eq(j => j.Status, status);
        else
            filter &= Builders<Job>.Filter.Eq(j => j.Status, "open");

        var jobs = await _db.Jobs.Find(filter).SortByDescending(j => j.CreatedAt).ToListAsync();

        var result = new List<JobOutDto>();
        foreach (var job in jobs)
        {
            var company = await _db.Companies.Find(c => c.Id == job.CompanyId).FirstOrDefaultAsync();
            result.Add(MapJob(job, company?.CompanyName ?? "Unknown"));
        }
        return Ok(result);
    }

    // GET /api/jobs/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetJob(string id)
    {
        var job = await _db.Jobs.Find(j => j.Id == id).FirstOrDefaultAsync();
        if (job == null) return NotFound(new { message = "Job not found" });
        var company = await _db.Companies.Find(c => c.Id == job.CompanyId).FirstOrDefaultAsync();
        return Ok(MapJob(job, company?.CompanyName ?? "Unknown"));
    }

    // POST /api/jobs - employer only
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateJob([FromBody] JobCreateDto dto)
    {
        var userId = GetUserId();
        var role = User.FindFirst("role")?.Value;
        if (role != "employer" && role != "admin") return Forbid();

        var company = await _db.Companies.Find(c => c.UserId == userId).FirstOrDefaultAsync();
        if (company == null) return BadRequest(new { message = "Company profile not found" });

        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Description))
            return BadRequest(new { message = "Title and description are required" });

        var job = new Job
        {
            CompanyId = company.Id!,
            Title = dto.Title,
            Description = dto.Description,
            Location = dto.Location,
            SalaryMin = dto.SalaryMin,
            SalaryMax = dto.SalaryMax,
            Deadline = dto.Deadline
        };
        await _db.Jobs.InsertOneAsync(job);
        return CreatedAtAction(nameof(GetJob), new { id = job.Id }, MapJob(job, company.CompanyName));
    }

    // PUT /api/jobs/{id}
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateJob(string id, [FromBody] JobUpdateDto dto)
    {
        var userId = GetUserId();
        var role = User.FindFirst("role")?.Value;

        var job = await _db.Jobs.Find(j => j.Id == id).FirstOrDefaultAsync();
        if (job == null) return NotFound(new { message = "Job not found" });

        // Only the employer who owns the job or admin can update
        var company = await _db.Companies.Find(c => c.UserId == userId).FirstOrDefaultAsync();
        if (role != "admin" && (company == null || company.Id != job.CompanyId))
            return Forbid();

        var update = Builders<Job>.Update
            .Set(j => j.Title, dto.Title ?? job.Title)
            .Set(j => j.Description, dto.Description ?? job.Description)
            .Set(j => j.Location, dto.Location ?? job.Location)
            .Set(j => j.SalaryMin, dto.SalaryMin ?? job.SalaryMin)
            .Set(j => j.SalaryMax, dto.SalaryMax ?? job.SalaryMax)
            .Set(j => j.Deadline, dto.Deadline ?? job.Deadline)
            .Set(j => j.Status, dto.Status ?? job.Status);

        await _db.Jobs.UpdateOneAsync(j => j.Id == id, update);
        var updated = await _db.Jobs.Find(j => j.Id == id).FirstOrDefaultAsync();
        var companyName = company?.CompanyName ?? "Unknown";
        return Ok(MapJob(updated!, companyName));
    }

    // DELETE /api/jobs/{id}
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteJob(string id)
    {
        var userId = GetUserId();
        var role = User.FindFirst("role")?.Value;

        var job = await _db.Jobs.Find(j => j.Id == id).FirstOrDefaultAsync();
        if (job == null) return NotFound(new { message = "Job not found" });

        var company = await _db.Companies.Find(c => c.UserId == userId).FirstOrDefaultAsync();
        if (role != "admin" && (company == null || company.Id != job.CompanyId))
            return Forbid();

        await _db.Jobs.DeleteOneAsync(j => j.Id == id);
        return Ok(new { message = "Job deleted" });
    }

    // GET /api/jobs/employer/my-jobs
    [HttpGet("employer/my-jobs")]
    [Authorize]
    public async Task<IActionResult> GetMyJobs()
    {
        var userId = GetUserId();
        var company = await _db.Companies.Find(c => c.UserId == userId).FirstOrDefaultAsync();
        if (company == null) return Ok(new List<JobOutDto>());

        var jobs = await _db.Jobs.Find(j => j.CompanyId == company.Id).SortByDescending(j => j.CreatedAt).ToListAsync();
        return Ok(jobs.Select(j => MapJob(j, company.CompanyName)));
    }

    private static JobOutDto MapJob(Job job, string companyName) => new()
    {
        Id = job.Id!,
        CompanyId = job.CompanyId,
        CompanyName = companyName,
        Title = job.Title,
        Description = job.Description,
        Location = job.Location,
        SalaryMin = job.SalaryMin,
        SalaryMax = job.SalaryMax,
        Deadline = job.Deadline,
        Status = job.Status,
        CreatedAt = job.CreatedAt
    };
}
