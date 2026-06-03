using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RecruitmentAPI.Models;

public class Job
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("companyId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CompanyId { get; set; } = string.Empty;

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("location")]
    public string? Location { get; set; }

    [BsonElement("salaryMin")]
    public int? SalaryMin { get; set; }

    [BsonElement("salaryMax")]
    public int? SalaryMax { get; set; }

    [BsonElement("deadline")]
    public DateTime? Deadline { get; set; }

    [BsonElement("status")]
    public string Status { get; set; } = "open"; // open | closed

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
