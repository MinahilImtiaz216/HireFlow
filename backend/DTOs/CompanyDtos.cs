namespace RecruitmentAPI.DTOs;

public class CompanyUpdateDto
{
    public string? CompanyName { get; set; }
    public string? Industry { get; set; }
    public string? Description { get; set; }
    public string? Website { get; set; }
    public string? Location { get; set; }
}

public class CompanyOutDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string? Industry { get; set; }
    public string? Description { get; set; }
    public string? Website { get; set; }
    public string? Location { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CandidateProfileUpdateDto
{
    public string? Bio { get; set; }
    public string? Location { get; set; }
    public int? ExperienceYears { get; set; }
    public string? Degree { get; set; }
    public string? Skills { get; set; }
    public string? ResumePath { get; set; }
}

public class CandidateOutDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? Location { get; set; }
    public int ExperienceYears { get; set; }
    public string? Degree { get; set; }
    public string? Skills { get; set; }
    public string? ResumePath { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
}

public class ReviewCreateDto
{
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string? CompanyId { get; set; }
}

public class ReviewOutDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string? UserName { get; set; }
    public string? UserRole { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
