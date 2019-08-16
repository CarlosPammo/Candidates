using System.Data.Common;
using System.Data.Entity;

namespace Candidates.EFE.Context
{
	public abstract class AbstractContext : DbContext
	{
		public string Schema { get; set; }

		public DbConnection Connection => Database.Connection;

		protected AbstractContext(string context, string schema)
			: base(context)
		{
			Schema = schema;
		}

		protected abstract void SetConnectionString(string connectionString);
	}
}