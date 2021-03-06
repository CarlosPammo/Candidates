﻿using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Candidates
{
	public class RouteConfig
	{
		public static void RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
			routes.LowercaseUrls = true;

			routes.MapHttpRoute(
				name: "Api",
				routeTemplate: "api/{controller}"
			);
		}
	}
}
