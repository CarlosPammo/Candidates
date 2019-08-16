using System.Web.Http;
using Newtonsoft.Json.Serialization;

namespace Candidates
{
	public class WebApiConfig
	{
		public static void Register(HttpConfiguration configuration)
		{
			configuration.MapHttpAttributeRoutes();
			configuration.Formatters.JsonFormatter.SerializerSettings
				.ContractResolver = new CamelCasePropertyNamesContractResolver();
		}
	}
}