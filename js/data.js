// All editable site content lives here — no HTML editing needed for text updates.

const EXPERIENCE = [
  {
    title: "Business Intelligence Analyst",
    org: "Vaishnav Publications and Digitalization",
    location: "Pune, India",
    date: "Jan 2023 – Apr 2025",
    bullets: [
      "Tracked KPI performance across SEO, search, and social media for 5+ client accounts, identifying underperforming campaigns and flagging reallocation opportunities to protect client ad spend.",
      "Identified a recurring inefficiency in weekly reporting workflows and engineered a Python-based solution to merge and cleanse marketing exports, reducing manual preparation time and reporting errors.",
      "Diagnosed and resolved data quality issues — inconsistent formatting, mismatched fields, and currency discrepancies — across a 10,000+ row multi-client dataset that were compromising reporting accuracy.",
      "Advanced from template maintenance to full ownership of dashboard design and deployment for two newly onboarded retail clients, reflecting growing trust in independent execution."
    ]
  }
];

const EDUCATION = [
  {
    school: "Northeastern University",
    degree: "MS, Information Systems",
    location: "Boston, MA",
    date: "Sep 2025 – Dec 2027"
  },
  {
    school: "University of Mumbai",
    degree: "BE, Computer Engineering",
    location: "Mumbai, India",
    date: "Graduated May 2022"
  }
];

const SKILLS = [
  {
    category: "Programming & Analysis",
    items: ["Python", "Pandas", "NumPy", "Scikit-learn", "SQL"]
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "Oracle"]
  },
  {
    category: "Data Engineering",
    items: ["Databricks", "PySpark", "Delta Lake", "Snowflake", "Azure Data Factory"]
  },
  {
    category: "Visualization & BI",
    items: ["Power BI", "Tableau", "Streamlit"]
  },
  {
    category: "Machine Learning & AI",
    items: ["Machine Learning", "Generative AI", "Large Language Models (LLMs)"]
  },
  {
    category: "Tools & Workflow",
    items: ["Git", "GitHub", "Jira"]
  }
];

const PROJECTS = [
  {
    id: "instacart",
    name: "Instacart Analytics Platform",
    role: "Both",
    stack: ["PostgreSQL (Neon)", "Python", "Streamlit", "Plotly", "SQL", "RFM Analytics"],
    shortDesc: "Cloud-hosted PostgreSQL schema ingesting a 33M+ row benchmark grocery dataset, with RFM segmentation, cohort retention, and CLV tiering surfaced through a live Streamlit dashboard.",
    metrics: ["33M+ rows ingested", "RFM segmentation", "CLV tiering"],
    github: "https://github.com/akshaygovindd/instacart-sql-analytics",
    demo: "https://instacart-sql-dashboard.streamlit.app",
    // Longer paragraphs — replace with real README content once provided.
    longDesc: [
      "Architected a relational database schema using cloud-hosted PostgreSQL (Neon) to ingest a 33M+ row benchmark grocery dataset across core relational tables.",
      "Developed analytical scripts spanning window functions, stored procedures, and triggers to power RFM segmentation, cohort retention analysis, and CLV tiering.",
      "Optimized query performance using EXPLAIN ANALYZE and composite/partial indexes, then shipped an interactive Streamlit dashboard for exploring the results live."
    ],
    architecture: ["Raw CSV Exports (3.4M orders)", "PostgreSQL (Neon)", "SQL Analytics Layer", "Streamlit Dashboard"],
    decisions: [],
    images: [
      "assets/projects/instacart/dashboard-home.png",
      "assets/projects/instacart/overview-orders-by-department.png"
    ],
    githubStats: { commits: 24, language: "Python, PL/pgSQL", updated: "Apr 2026" }
  },
  {
    id: "wildfire",
    name: "Wildfire Cause Prediction",
    role: "Data Analyst",
    stack: ["Python", "Scikit-learn", "Pandas", "NumPy", "Random Forest", "SVM", "KNN"],
    shortDesc: "Binary classification framework on 1.88M USDA fire occurrence records predicting human vs. natural causes, tuned to F1 = 0.9598 despite a severe 5.2:1 class imbalance.",
    metrics: ["F1 = 0.9598", "ROC-AUC = 0.9547", "1.88M rows"],
    github: "https://github.com/akshaygovindd/Wildfire-Cause-Prediction",
    demo: null,
    longDesc: [
      "Developed a binary classification framework on a 1.88M-row USDA Forest Service dataset to predict human vs. natural/lightning-caused wildfires.",
      "Engineered 5 spatial and temporal features, including drought indexing, to address a severe 5.2:1 class imbalance in the source data.",
      "Cross-validated 5 models on an 80/20 stratified split, tuning Random Forest via GridSearchCV to reach an F1 score of 0.9598 and ROC-AUC of 0.9547."
    ],
    architecture: ["USDA Raw Data (1.88M rows)", "Feature Engineering", "Model Training & CV", "Tuned Random Forest (F1 = 0.9598)"],
    decisions: [],
    images: [
      "assets/projects/wildfire/plot_06_class_imbalance.png",
      "assets/projects/wildfire/plot_02_geographic_analysis.png",
      "assets/projects/wildfire/plot_12_baseline_model_comparison.png"
    ],
    githubStats: { commits: 9, language: "Python (Jupyter Notebooks)", updated: "Apr 2026" }
  },
  {
    id: "foodlens",
    name: "FoodLens — Food Inspections ELT Pipeline",
    role: "Data Engineer",
    stack: ["Databricks", "PySpark", "Delta Lake", "Unity Catalog", "SQL", "Power BI", "Kimball Star Schema"],
    shortDesc: "Bronze/Silver/Gold medallion pipeline processing 387,000+ inconsistent municipal food inspection records into a Kimball star schema with SCD Type 2 tracking.",
    metrics: ["387,000+ records", "Medallion architecture", "SCD Type 2"],
    github: "https://github.com/akshaygovindd/FoodLens-Databricks-Pipeline",
    demo: null,
    longDesc: [
      "Engineered a Medallion architecture pipeline (Bronze/Silver/Gold) in Databricks to ingest 387,000+ structurally inconsistent municipal food inspection records.",
      "Resolved schema mismatches between divergent source formats using PySpark transforms and MD5-hashed surrogate keys to keep records joinable across layers.",
      "Constructed a Kimball star schema using Delta Lake MERGE for SCD Type 2 dimension tracking, with an automatic quarantine engine to isolate bad rows for review."
    ],
    decisions: [
      {
        title: "MD5-hashed surrogate keys",
        detail: "Source systems used inconsistent natural keys across formats, so MD5 hashing of normalized business keys was used to generate stable surrogate keys joinable across Bronze/Silver/Gold layers."
      },
      {
        title: "SCD Type 2 dimension tracking",
        detail: "Inspection records change over time (re-inspections, status updates). SCD Type 2 via Delta Lake MERGE preserves full history instead of overwriting prior state."
      },
      {
        title: "Schema mismatch resolution",
        detail: "Two source formats disagreed on field names, types, and granularity. PySpark transforms normalized both into a shared schema before they hit the Silver layer."
      }
    ],
    images: [
      "assets/projects/foodlens/star-schema.png",
      "assets/projects/foodlens/summary-dashboard.png",
      "assets/projects/foodlens/inspection-validation-report.png"
    ],
    githubStats: { commits: 14, language: "Python (Jupyter Notebooks)", updated: "Apr 2026" }
  }
];

const CONTACT = {
  email: "govind.ak@northeastern.edu",
  phone: "732-964-6004",
  linkedin: "https://linkedin.com/in/akshaygovind06",
  linkedinLabel: "/in/akshaygovind06",
  github: "https://github.com/akshaygovindd",
  githubLabel: "/akshaygovindd",
  location: "Boston, MA"
};
