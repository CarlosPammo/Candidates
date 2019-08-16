using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using log4net;
using log4net.Config;

namespace Candidates.Error
{
	public class Logger
	{
		private readonly ILog logger;
		private static Logger instance;
		public static Logger Instance => instance ?? (instance = new Logger());

		public Logger()
		{
			logger = LogManager.GetLogger("Logger");
			XmlConfigurator.Configure();
		}

		public void Write(Severity severity, string message)
		{
			switch (severity)
			{
				case Severity.Debug:
					logger.Debug(message);
					break;
				case Severity.Information:
					logger.Info(message);
					break;
				case Severity.Warning:
					logger.Warn(message);
					break;
				case Severity.Error:
					logger.Error(message);
					break;
				case Severity.Fatal:
					logger.Fatal(message);
					break;
			}
		}
	}
}
