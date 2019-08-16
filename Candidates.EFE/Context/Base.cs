using System.Configuration;
using System.Data.Entity;
using System.Data.SqlClient;
using Candidates.EFE.Map;

namespace Candidates.EFE.Context
{
	public class Base : AbstractContext
	{
		public Base(string user, string password)
			: base("name=SqlContext", "dbo")
		{
			var builder = new SqlConnectionStringBuilder
			{
				DataSource = ConfigurationManager.AppSettings.Get("Server"),
				InitialCatalog = ConfigurationManager.AppSettings.Get("Name"),
				PersistSecurityInfo = true,
				MultipleActiveResultSets = true,
				UserID = user,
				Password = password
			};

			SetConnectionString(builder.ToString());
			Database.SetInitializer(new CreateDatabaseIfNotExists<Base>());
		}

		public Base(string connectionString)
			: base("name=SqlContext", "dbo")
		{
			SetConnectionString(connectionString);
			Database.SetInitializer(new CreateDatabaseIfNotExists<Base>());
		}

		protected override sealed void SetConnectionString(string connectionString)
		{
			Database.Connection.ConnectionString = connectionString;
		}

		protected override void OnModelCreating(DbModelBuilder modelBuilder)
		{
			modelBuilder.Configurations.Add(new CandidateMap(Schema));
			modelBuilder.Configurations.Add(new QualificationMap(Schema));
			modelBuilder.Configurations.Add(new CandidateHasQualificationMap(Schema));
		}
	}
}