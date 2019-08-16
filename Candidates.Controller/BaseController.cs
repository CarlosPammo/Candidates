using System.Web.Http;
using Candidates.EFE;

namespace Candidates.Controller
{
	[Authorize]
	public class BaseController : ApiController
	{
		protected Repository<T> Repository<T>() where T : class, new()
		{
			return new Factory<T>().Get();
		}
	}
}
