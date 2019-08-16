using System.Net;
using System.Net.Http;
using System.Web.Http;
using Candidates.Model;

namespace Candidates.Controller
{
	[AllowAnonymous]
	public class CandidateController : BaseController
	{
		public HttpResponseMessage GetAll()
		{
			var candidates = Repository<Candidate>()
				.Select(candidate => true);

			return Request.CreateResponse(HttpStatusCode.OK,
				new
				{
					candidates
				});
		}

		[HttpPost]
		public HttpResponseMessage Insert(Candidate candidate)
		{
			var response = Repository<Candidate>()
				.Insert(candidate);

			return response != null 
				? Request.CreateResponse(HttpStatusCode.OK, response)
				: Request.CreateResponse(HttpStatusCode.BadRequest);
		}

		[HttpPut]
		public HttpResponseMessage Update(Candidate candidate)
		{
			var response = Repository<Candidate>()
				.Update(candidate);

			return Request.CreateResponse(response > 0 
				? HttpStatusCode.OK
				: HttpStatusCode.BadRequest);
		}

		[HttpDelete]
		public HttpResponseMessage Delete(int id)
		{
			var response = Repository<Candidate>()
				.Remove(c => c.Id.Equals(id));

			return Request.CreateResponse(response > 0
				? HttpStatusCode.OK
				: HttpStatusCode.BadRequest);
		}
	}
}