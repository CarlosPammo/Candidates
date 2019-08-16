using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Mvc;
using System.Web.Routing;
using Candidates.Core;
using Newtonsoft.Json;

namespace Candidates
{
	public class MvcApplication : HttpApplication
	{
		protected void Application_Start()
		{
			GlobalConfiguration.Configure(WebApiConfig.Register);
			AreaRegistration.RegisterAllAreas();
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			RouteConfig.RegisterRoutes(RouteTable.Routes);

			GlobalConfiguration.Configuration.Formatters.JsonFormatter
				.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;

			GlobalConfiguration.Configuration.Services
				.Replace(typeof(IHttpActionInvoker), new ErrorHandler());

			GlobalConfiguration.Configuration.EnsureInitialized();
		}
	}
}
