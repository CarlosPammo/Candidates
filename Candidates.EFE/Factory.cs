using System.Configuration;
using Candidates.EFE.Context;

namespace Candidates.EFE
{
	public class Factory<T> where T: class, new ()
	{
		public Repository<T> Get()
		{
			return new Repository<T>(
				new Base(
					ConfigurationManager.AppSettings.Get("ConnectionString")
				));
		}
	}
}
