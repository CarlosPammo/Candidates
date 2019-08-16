using System.Net;
using System.Net.Http;
using System.Web.Http;
using Candidates.Model;

namespace Candidates.Controller
{
	[AllowAnonymous]
	public class QualificationController : BaseController
	{
		public HttpResponseMessage GetAll()
		{
			var qualifications = Repository<Qualification>()
				.Select(qualification => true);

			return Request.CreateResponse(HttpStatusCode.OK,
				new
				{
					qualifications
				});
		}

		[HttpPost]
		public HttpResponseMessage Insert(Qualification qualification)
		{
			var response = Repository<Qualification>()
				.Insert(qualification);

			return response != null
				? Request.CreateResponse(HttpStatusCode.OK, response)
				: Request.CreateResponse(HttpStatusCode.BadRequest);
		}

		[HttpDelete]
		public HttpResponseMessage Delete(int id)
		{
			var response = Repository<Qualification>()
				.Remove(c => c.Id.Equals(id));

			return Request.CreateResponse(response > 0
				? HttpStatusCode.OK
				: HttpStatusCode.BadRequest);
		}
	}
}