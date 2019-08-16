using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Controllers;
using Candidates.Error;
using Candidates.Error.Exceptions;
using Newtonsoft.Json;

namespace Candidates.Core
{
	public class ErrorHandler : ApiControllerActionInvoker
	{
		public override Task<HttpResponseMessage> InvokeActionAsync(HttpActionContext actionContext, CancellationToken cancellationToken)
		{
			var result = base.InvokeActionAsync(actionContext, cancellationToken);
			if (result.Exception == null)
				return result;

			var temporal = result.Exception.GetBaseException();
			AbstractException baseException;
			if (temporal is AbstractException)
			{
				baseException = temporal as AbstractException;
			}
			else
			{
				baseException = new Critical(temporal);
			}

			baseException.LogException();
			var content = JsonConvert.SerializeObject(new
			{
				type = baseException.GetType().ToString(),
				friendlyMessage = baseException.FriendlyMessage
			});

			result = Task.Run(() => new HttpResponseMessage(HttpStatusCode.InternalServerError)
			{
				Content = new StringContent(content),
				ReasonPhrase = "Internal Exception"
			}, cancellationToken);

			return result;
		}
	}
}