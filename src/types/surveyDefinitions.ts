import { SurveyDefinition } from "./assessment";

export const SURVEY_CONFIG: Record<"smb" | "enterprise", SurveyDefinition> = {
  smb: {
    key: "smb",
    title: "Organizational Maturity Assessment for SMBs",
    estimatedMinutes: "5 to 7",
    description: "Understand how ready your business is to grow, execute consistently, and scale effectively.",
    dimensions: [
      "strategyLeadership",
      "governanceOperatingModel",
      "processesExecution",
      "technologyData",
      "peopleCapabilities",
      "customerInnovationGrowth",
    ],
    questions: [
      // strategyLeadership
      { id: "SMB_Q1", dimension: "strategyLeadership", text: "Our leadership team has a clear direction for the business over the next 12 to 24 months." },
      { id: "SMB_Q2", dimension: "strategyLeadership", text: "Our business priorities are clearly communicated across the organization." },
      { id: "SMB_Q3", dimension: "strategyLeadership", text: "Leaders regularly review progress and make changes when priorities shift." },
      // governanceOperatingModel
      { id: "SMB_Q4", dimension: "governanceOperatingModel", text: "Roles and responsibilities are clear across teams." },
      { id: "SMB_Q5", dimension: "governanceOperatingModel", text: "Decisions are made in a timely and consistent way." },
      { id: "SMB_Q6", dimension: "governanceOperatingModel", text: "We have regular management routines to track business performance." },
      // processesExecution
      { id: "SMB_Q7", dimension: "processesExecution", text: "Our core business processes are clearly defined and followed consistently." },
      { id: "SMB_Q8", dimension: "processesExecution", text: "Teams work well together across functions or departments." },
      { id: "SMB_Q9", dimension: "processesExecution", text: "We can execute important initiatives without major confusion, delays, or rework." },
      // technologyData
      { id: "SMB_Q10", dimension: "technologyData", text: "Our systems and tools support the way we work effectively." },
      { id: "SMB_Q11", dimension: "technologyData", text: "We use data to guide decisions instead of relying mainly on assumptions." },
      { id: "SMB_Q12", dimension: "technologyData", text: "Our reporting provides timely and reliable information." },
      // peopleCapabilities
      { id: "SMB_Q13", dimension: "peopleCapabilities", text: "We have the right skills and capabilities to support our business goals." },
      { id: "SMB_Q14", dimension: "peopleCapabilities", text: "Employees understand what is expected of them in their roles." },
      { id: "SMB_Q15", dimension: "peopleCapabilities", text: "Managers actively support employee development and performance improvement." },
      // customerInnovationGrowth
      { id: "SMB_Q16", dimension: "customerInnovationGrowth", text: "We have a clear understanding of our target customers and their needs." },
      { id: "SMB_Q17", dimension: "customerInnovationGrowth", text: "We regularly use customer feedback to improve our products, services, or operations." },
      { id: "SMB_Q18", dimension: "customerInnovationGrowth", text: "We have a repeatable and effective approach to business growth." },
    ],
  },
  enterprise: {
    key: "enterprise",
    title: "Organizational Maturity Assessment for Enterprises",
    estimatedMinutes: "8 to 12",
    description: "Evaluate how effectively your organization is structured to execute strategy, manage complexity, improve performance, and scale transformation.",
    dimensions: [
      "strategyLeadership",
      "governanceOperatingModel",
      "processesExecution",
      "technologyData",
      "peopleCapabilities",
      "customerInnovationGrowth",
    ],
    questions: [
      // strategyLeadership
      { id: "ENT_Q1", dimension: "strategyLeadership", text: "Our organization has a clearly defined strategy supported by measurable objectives." },
      { id: "ENT_Q2", dimension: "strategyLeadership", text: "Strategic priorities are translated into actionable plans across business units and functions." },
      { id: "ENT_Q3", dimension: "strategyLeadership", text: "Leadership alignment is strong across the organization." },
      { id: "ENT_Q4", dimension: "strategyLeadership", text: "Strategic progress is reviewed through a structured performance management process." },
      { id: "ENT_Q5", dimension: "strategyLeadership", text: "The organization can adapt its priorities effectively when internal or external conditions change." },
      // governanceOperatingModel
      { id: "ENT_Q6", dimension: "governanceOperatingModel", text: "Decision rights are clearly defined across organizational levels." },
      { id: "ENT_Q7", dimension: "governanceOperatingModel", text: "Governance forums effectively resolve issues and support execution." },
      { id: "ENT_Q8", dimension: "governanceOperatingModel", text: "Accountability for outcomes is clear across functions and teams." },
      { id: "ENT_Q9", dimension: "governanceOperatingModel", text: "The operating model supports effective cross-functional coordination at scale." },
      { id: "ENT_Q10", dimension: "governanceOperatingModel", text: "Key risks, dependencies, and escalations are managed through formal mechanisms." },
      // processesExecution
      { id: "ENT_Q11", dimension: "processesExecution", text: "Core end-to-end processes are standardized across the organization where appropriate." },
      { id: "ENT_Q12", dimension: "processesExecution", text: "Process ownership is clearly assigned and actively managed." },
      { id: "ENT_Q13", dimension: "processesExecution", text: "Strategic initiatives are delivered through consistent project or portfolio management practices." },
      { id: "ENT_Q14", dimension: "processesExecution", text: "Performance issues are identified early and addressed systematically." },
      { id: "ENT_Q15", dimension: "processesExecution", text: "Continuous improvement is embedded in day-to-day operations." },
      // technologyData
      { id: "ENT_Q16", dimension: "technologyData", text: "Our core systems are sufficiently integrated across major functions." },
      { id: "ENT_Q17", dimension: "technologyData", text: "Data quality is strong enough to support operational and strategic decisions." },
      { id: "ENT_Q18", dimension: "technologyData", text: "Leaders have access to consistent dashboards and performance insights." },
      { id: "ENT_Q19", dimension: "technologyData", text: "Digital tools improve efficiency, control, and/or customer experience in meaningful ways." },
      { id: "ENT_Q20", dimension: "technologyData", text: "Data governance, cybersecurity, and system controls are well managed." },
      // peopleCapabilities
      { id: "ENT_Q21", dimension: "peopleCapabilities", text: "Workforce planning is aligned to business priorities." },
      { id: "ENT_Q22", dimension: "peopleCapabilities", text: "Critical capabilities are identified and developed proactively." },
      { id: "ENT_Q23", dimension: "peopleCapabilities", text: "Managers are effective in performance management, coaching, and team development." },
      { id: "ENT_Q24", dimension: "peopleCapabilities", text: "Our culture supports accountability, collaboration, and change adoption." },
      { id: "ENT_Q25", dimension: "peopleCapabilities", text: "Change initiatives are supported with clear communication, sponsorship, and training." },
      // customerInnovationGrowth
      { id: "ENT_Q26", dimension: "customerInnovationGrowth", text: "Customer insights are systematically incorporated into decision-making." },
      { id: "ENT_Q27", dimension: "customerInnovationGrowth", text: "The organization has structured mechanisms to identify and pursue growth opportunities." },
      { id: "ENT_Q28", dimension: "customerInnovationGrowth", text: "Innovation is supported through defined processes, not only ad hoc effort." },
      { id: "ENT_Q29", dimension: "customerInnovationGrowth", text: "Commercial, service, and operational teams are aligned around customer outcomes." },
      { id: "ENT_Q30", dimension: "customerInnovationGrowth", text: "The organization can scale new initiatives effectively across functions or markets." },
    ],
  },
};
