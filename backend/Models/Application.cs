using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RecruitmentAPI.Models;

public class Application
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("jobId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string JobId { get; set; } = string.Empty;

    [BsonElement("candidateId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CandidateId { get; set; } = string.Empty;

    [BsonElement("coverLetter")]
    public string? CoverLetter { get; set; }

    [BsonElement("resumePath")]
    public string? ResumePath { get; set; }

    [BsonElement("projects")]
    public string? Projects { get; set; }

    [BsonElement("priorExperience")]
    public bool PriorExperience { get; set; } = false;

    [BsonElement("priorCompany")]
    public string? PriorCompany { get; set; }

    [BsonElement("status")]
    public string Status { get; set; } = "submitted"; // submitted | under_review | approved | rejected | closed

    [BsonElement("appliedAt")]
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
