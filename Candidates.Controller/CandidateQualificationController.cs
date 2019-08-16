using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Candidates.Model;

namespace Candidates.Controller
{
	[AllowAnonymous]
	public class CandidateQualificationController : BaseController
	{
		public HttpResponseMessage GetQualificationsPerCandidate(int idCandidate)
		{
			var repository = Repository<Candidate>();
			var results = (
				from c in repository.Context.Set<Candidate>() 
				join cq in repository.Context.Set<CandidateHasQualification>() on c.Id equals cq.CandidateId
				join q in repository.Context.Set<Qualification>() on cq.QualificationId equals q.Id
				where c.Id == idCandidate
				select new
				{
					cq.Id,
					Qualification = q.Name,
					q.Type,
					cq.Started,
					cq.Completed
				});

			return Request.CreateResponse(HttpStatusCode.OK, new {results});
		}

		[HttpPost]
		public HttpResponseMessage Insert(CandidateHasQualification candidateQualification)
		{
			var response = Repository<CandidateHasQualification>()
				.Insert(candidateQualification);

			return response != null
				? Request.CreateResponse(HttpStatusCode.OK, response)
				: Request.CreateResponse(HttpStatusCode.BadRequest);
		}

		[HttpDelete]
		public HttpResponseMessage Delete(int id)
		{
			var response = Repository<CandidateHasQualification>()
				.Remove(c => c.Id.Equals(id));

			return Request.CreateResponse(response > 0
				? HttpStatusCode.OK
				: HttpStatusCode.BadRequest);
		}
	}
}
