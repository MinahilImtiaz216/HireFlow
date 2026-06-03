using MongoDB.Driver;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Services;

public class MongoDbService
{
    private readonly IMongoDatabase _database;

    public MongoDbService(IConfiguration configuration)
    {
        var connectionString = configuration["MongoDB:ConnectionString"] ?? "mongodb://localhost:27017";
        var databaseName = configuration["MongoDB:DatabaseName"] ?? "RecruitmentDB";
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
    }

    public IMongoCollection<User> Users => _database.GetCollection<User>("users");
    public IMongoCollection<Company> Companies => _database.GetCollection<Company>("companies");
    public IMongoCollection<Candidate> Candidates => _database.GetCollection<Candidate>("candidates");
    public IMongoCollection<Job> Jobs => _database.GetCollection<Job>("jobs");
    public IMongoCollection<Application> Applications => _database.GetCollection<Application>("applications");
    public IMongoCollection<Review> Reviews => _database.GetCollection<Review>("reviews");
}
