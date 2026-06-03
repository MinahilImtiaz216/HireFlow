using MongoDB.Driver;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Services;

public class SeedService
{
    private readonly MongoDbService _db;
    private readonly AuthService _auth;

    public SeedService(MongoDbService db, AuthService auth)
    {
        _db = db;
        _auth = auth;
    }

    public async Task SeedAsync()
    {
        // Only seed if no users exist
        var userCount = await _db.Users.CountDocumentsAsync(FilterDefinition<User>.Empty);
        if (userCount > 0) return;

        // Create admin
        var admin = new User { Name = "Admin User", Email = "admin@recruitment.com", Password = _auth.HashPassword("Admin@123"), Role = "admin" };
        await _db.Users.InsertOneAsync(admin);

        // Create employer
        var employer = new User { Name = "Tech Corp HR", Email = "employer@techcorp.com", Password = _auth.HashPassword("Employer@123"), Role = "employer" };
        await _db.Users.InsertOneAsync(employer);
        var company = new Company { UserId = employer.Id!, CompanyName = "Tech Corp", Industry = "Technology", Description = "Leading technology company", Website = "https://techcorp.com", Location = "Lahore, Pakistan" };
        await _db.Companies.InsertOneAsync(company);

        // Create employer 2
        var employer2 = new User { Name = "Finance Inc HR", Email = "employer@finance.com", Password = _auth.HashPassword("Employer@123"), Role = "employer" };
        await _db.Users.InsertOneAsync(employer2);
        var company2 = new Company { UserId = employer2.Id!, CompanyName = "Finance Inc", Industry = "Finance", Description = "Top financial services firm", Website = "https://financeinc.com", Location = "Karachi, Pakistan" };
        await _db.Companies.InsertOneAsync(company2);

        // Create candidate
        var candidate = new User { Name = "Ali Hassan", Email = "candidate@example.com", Password = _auth.HashPassword("Candidate@123"), Role = "candidate" };
        await _db.Users.InsertOneAsync(candidate);
        var candidateProfile = new Candidate { UserId = candidate.Id!, Bio = "Experienced software developer", Location = "Islamabad, Pakistan", ExperienceYears = 3, Degree = "BS Computer Science", Skills = "C#, Angular, MongoDB, ASP.NET" };
        await _db.Candidates.InsertOneAsync(candidateProfile);

        // Create jobs
        var jobs = new List<Job>
        {
            new() { CompanyId = company.Id!, Title = "Senior .NET Developer", Description = "We are looking for a skilled .NET developer with 3+ years of experience in ASP.NET Core and MongoDB.", Location = "Lahore", SalaryMin = 80000, SalaryMax = 120000, Deadline = DateTime.UtcNow.AddMonths(1), Status = "open" },
            new() { CompanyId = company.Id!, Title = "Angular Frontend Developer", Description = "Join our team as an Angular developer. Must know TypeScript, RxJS, and REST APIs.", Location = "Remote", SalaryMin = 60000, SalaryMax = 90000, Deadline = DateTime.UtcNow.AddMonths(2), Status = "open" },
            new() { CompanyId = company2.Id!, Title = "Financial Analyst", Description = "Analyze financial data and provide strategic recommendations. MBA preferred.", Location = "Karachi", SalaryMin = 70000, SalaryMax = 100000, Deadline = DateTime.UtcNow.AddMonths(1), Status = "open" },
            new() { CompanyId = company2.Id!, Title = "Data Scientist", Description = "Work with large datasets to drive business insights. Python, R, and ML experience required.", Location = "Karachi", SalaryMin = 90000, SalaryMax = 140000, Deadline = DateTime.UtcNow.AddMonths(3), Status = "open" },
            new() { CompanyId = company.Id!, Title = "DevOps Engineer", Description = "Manage CI/CD pipelines, cloud infrastructure on Azure/AWS, and containerization with Docker.", Location = "Lahore", SalaryMin = 85000, SalaryMax = 125000, Deadline = DateTime.UtcNow.AddMonths(1), Status = "open" },
        };
        await _db.Jobs.InsertManyAsync(jobs);

        // Sample application
        var app = new Application { JobId = jobs[0].Id!, CandidateId = candidateProfile.Id!, CoverLetter = "I am very interested in this position...", PriorExperience = true, PriorCompany = "StartupXYZ", Status = "submitted" };
        await _db.Applications.InsertOneAsync(app);

        // Sample review
        var review = new Review { UserId = candidate.Id!, CompanyId = company.Id!, Rating = 5, Comment = "Excellent company to work with. Very professional hiring process." };
        await _db.Reviews.InsertOneAsync(review);
    }
}
