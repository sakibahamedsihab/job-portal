require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not found in env!");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("job_portal");

    // 1. Find user recruiter@portal.com
    const email = "recruiter@portal.com";
    const user =
      (await db.collection("user").findOne({ email })) ||
      (await db.collection("users").findOne({ email }));

    if (!user) {
      console.error(`User with email ${email} not found in database!`);
      process.exit(1);
    }

    const userIdStr = user._id.toString();
    const userIdObj = user._id;

    console.log(`Found recruiter: ${user.name || user.email} (ID: ${userIdStr})`);

    // 2. Update user profile photo with a professional avatar
    const professionalAvatar =
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80";
    await db.collection("user").updateOne(
      { _id: userIdObj },
      { $set: { image: professionalAvatar, updatedAt: new Date() } }
    );
    try {
      await db.collection("users").updateOne(
        { _id: userIdObj },
        { $set: { image: professionalAvatar, updatedAt: new Date() } }
      );
    } catch (e) {}

    console.log("✓ Updated recruiter profile avatar picture");

    // 3. Remove old company and old jobs for this recruiter
    const deletedJobs = await db.collection("jobs").deleteMany({
      $or: [{ recruiterId: userIdStr }, { recruiterId: userIdObj }],
    });
    console.log(`✓ Deleted ${deletedJobs.deletedCount} old jobs for this recruiter`);

    const deletedCompanies = await db.collection("companies").deleteMany({
      $or: [{ recruiterId: userIdStr }, { recruiterId: userIdObj }],
    });
    console.log(`✓ Deleted ${deletedCompanies.deletedCount} old company record(s)`);

    // 4. Create new authentic Bangladeshi Tech Company
    const newCompany = {
      name: "Nexis Digital Technologies Ltd.",
      website: "https://nexisdigital.com.bd",
      description:
        "Nexis Digital Technologies Ltd. is a premier software engineering and enterprise digital solutions firm based in Dhaka, Bangladesh. We build high-scale cloud platforms, fintech engines, and AI applications serving millions of users across Bangladesh and international clients.",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
      recruiterId: userIdStr,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const companyResult = await db.collection("companies").insertOne(newCompany);
    const companyId = companyResult.insertedId;
    console.log(`✓ Created company: ${newCompany.name} (ID: ${companyId})`);

    // 5. Seed 8 authentic, realistic Bangladeshi Tech Job Listings with BDT (৳) Salaries
    const jobs = [
      {
        title: "Senior Full Stack Engineer (Next.js & Node.js)",
        category: "Engineering",
        jobType: "Full-Time",
        workplaceType: "Hybrid",
        experienceLevel: "Senior",
        location: "Banani, Dhaka",
        salary: "৳1,40,000 - ৳1,85,000 / month",
        description:
          "We are looking for a Senior Full Stack Engineer with strong experience in Next.js, Node.js, and cloud architectures. You will lead the core engineering team building scalable web portals and real-time dashboard systems for enterprise clients.",
        skills: ["Next.js", "React", "Node.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Docker", "Redis"],
        responsibilities: [
          "Architect and build high-performance web applications using Next.js App Router and React",
          "Develop secure, modular REST and GraphQL microservices using Node.js and TypeScript",
          "Optimize database queries, indexing, and Redis caching for low-latency response times",
          "Conduct code reviews, mentor junior and mid-level software engineers, and establish best engineering practices",
          "Participate in sprint planning and collaborate with UI/UX designers and product managers",
        ],
        requirements: [
          "4+ years of professional software development experience in full-stack JavaScript/TypeScript",
          "Strong hands-on expertise with Next.js, React, Node.js, Express, and PostgreSQL/MongoDB",
          "Solid knowledge of asynchronous programming, RESTful API design, and cloud deployments",
          "B.Sc. in Computer Science & Engineering (CSE) or equivalent practical experience",
          "Strong communication and problem-solving skills",
        ],
        benefits: [
          "2 Festival Bonuses per year (100% of basic salary each)",
          "Provident Fund (PF) and Gratuity policy",
          "Comprehensive Inpatient & Outpatient Health Insurance for employee & family",
          "Subsidized buffet lunch, evening snacks, and unlimited tea/coffee",
          "Annual company pleasure trip (Cox's Bazar / Sylhet / International)",
          "Flexible hybrid working arrangement (3 days office, 2 days WFH)",
        ],
        deadline: "2026-11-30",
        recruiterId: userIdStr,
        companyId: companyId,
        companyName: newCompany.name,
        companyLogo: newCompany.logo,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        title: "Lead Mobile App Developer (Flutter / React Native)",
        category: "Engineering",
        jobType: "Full-Time",
        workplaceType: "On-site",
        experienceLevel: "Lead",
        location: "Gulshan-2, Dhaka",
        salary: "৳1,20,000 - ৳1,65,000 / month",
        description:
          "We are seeking an experienced Mobile App Lead to direct our cross-platform mobile development efforts. You will lead the development of our flagship consumer and merchant fintech mobile apps.",
        skills: ["Flutter", "Dart", "React Native", "REST API", "Firebase", "State Management (Bloc/Provider)", "CI/CD"],
        responsibilities: [
          "Lead the mobile engineering team in designing, building, and deploying Flutter and React Native mobile apps",
          "Ensure 60fps smooth animations, responsive UI layouts, and offline data sync capability",
          "Integrate third-party SDKs, payment gateways (bKash, Nagad, SSLCommerz), and push notification services",
          "Manage Google Play Console and Apple App Store production releases and compliance",
        ],
        requirements: [
          "4+ years of mobile application development with at least 2+ published apps on Play Store / App Store",
          "Deep understanding of Flutter architecture, Dart, Bloc/Provider, and native platform channels",
          "Experience integrating biometric authentication, deep linking, and secure local storage",
          "Strong leadership ability and experience mentoring mobile developers",
        ],
        benefits: [
          "2 Festival Bonuses per year",
          "Performance-based yearly salary increments and festival gifts",
          "Full Health & Life Insurance coverage",
          "Daily breakfast, lunch, and evening snacks provided by company",
          "Monthly team recreational dinners and gaming room facilities",
        ],
        deadline: "2026-12-15",
        recruiterId: userIdStr,
        companyId: companyId,
        companyName: newCompany.name,
        companyLogo: newCompany.logo,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      },
      {
        title: "Backend Software Engineer (Go / Python)",
        category: "Engineering",
        jobType: "Full-Time",
        workplaceType: "Hybrid",
        experienceLevel: "Mid-level",
        location: "Mohakhali DOHS, Dhaka",
        salary: "৳85,000 - ৳1,25,000 / month",
        description:
          "Join our backend infrastructure team to design and build distributed microservices, transaction processing pipelines, and high-load APIs for our enterprise FinTech platforms.",
        skills: ["Go", "Python", "FastAPI", "PostgreSQL", "Kafka", "Redis", "Docker", "Microservices"],
        responsibilities: [
          "Develop reliable, high-throughput microservices using Go and Python (FastAPI)",
          "Design scalable relational database schemas and manage migrations in PostgreSQL",
          "Implement asynchronous event processing using Kafka message queues and Redis caching",
          "Write unit, integration, and performance benchmark tests",
        ],
        requirements: [
          "2.5+ years of backend development experience with Go, Python, or Node.js",
          "Proficiency in SQL, relational data modeling, indexing, and query optimization",
          "Familiarity with Docker containerization, REST API standards, and Git version control",
          "B.Sc. in CSE, EEE, or relevant engineering discipline",
        ],
        benefits: [
          "2 Festival Bonuses",
          "Bi-annual performance review and salary increment",
          "Subsidized lunch and snacks",
          "Festival gift hampers and annual sports day",
          "Medical insurance and leave encashment benefit",
        ],
        deadline: "2026-11-25",
        recruiterId: userIdStr,
        companyId: companyId,
        companyName: newCompany.name,
        companyLogo: newCompany.logo,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      },
      {
        title: "Senior UI/UX Product Designer",
        category: "Design",
        jobType: "Full-Time",
        workplaceType: "Remote",
        experienceLevel: "Senior",
        location: "Dhanmondi, Dhaka / Remote (BD)",
        salary: "৳90,000 - ৳1,30,000 / month",
        description:
          "We are looking for a creative Senior UI/UX Product Designer with a sharp eye for aesthetics, clean typography, and intuitive user workflows for web and mobile applications.",
        skills: ["Figma", "Design Systems", "UI/UX", "User Research", "Wireframing", "Prototyping", "TailwindCSS"],
        responsibilities: [
          "Create user personas, wireframes, interactive prototypes, and high-fidelity UI screens in Figma",
          "Maintain, document, and expand our comprehensive Nexis Design System component library",
          "Conduct user interviews and usability testing sessions with Bangladeshi and global users",
          "Collaborate closely with frontend developers to verify pixel-perfect UI execution",
        ],
        requirements: [
          "3.5+ years of product design experience for SaaS, FinTech, or e-commerce platforms",
          "Expert mastery of Figma (Auto-layout, Components, Variants, Design Tokens)",
          "A strong portfolio showcasing end-to-end design thinking and modern SaaS aesthetics",
          "Understanding of responsive web grids, accessibility (WCAG), and mobile UX guidelines",
        ],
        benefits: [
          "2 Festival Bonuses",
          "Home office setup allowance (৳60,000 one-time stipend)",
          "Annual learning and design certification reimbursement (৳30,000/yr)",
          "Fully flexible remote working environment anywhere within Bangladesh",
          "Annual team retreat and quarterly meetup expenses",
        ],
        deadline: "2026-11-20",
        recruiterId: userIdStr,
        companyId: companyId,
        companyName: newCompany.name,
        companyLogo: newCompany.logo,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
      },
      {
        title: "DevOps & Cloud Infrastructure Engineer",
        category: "DevOps",
        jobType: "Full-Time",
        workplaceType: "Hybrid",
        experienceLevel: "Senior",
        location: "Gulshan-1, Dhaka",
        salary: "৳1,10,000 - ৳1,55,000 / month",
        description:
          "We are seeking a proactive DevOps Engineer to manage our cloud infrastructure on AWS, automate CI/CD release pipelines, and maintain 99.9% uptime across production environments.",
        skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD (GitHub Actions)", "Linux", "Prometheus", "Grafana"],
        responsibilities: [
          "Manage and automate multi-environment infrastructure on AWS using Terraform and Docker",
          "Build, maintain, and optimize CI/CD pipelines with GitHub Actions for automated zero-downtime deployments",
          "Configure centralized logging and observability using Prometheus, Grafana, and ELK stack",
          "Ensure infrastructure security, SSL/TLS management, VPC peering, and automated database backups",
        ],
        requirements: [
          "3+ years of hands-on experience in DevOps, Linux administration, and AWS cloud services (EC2, ECS, EKS, RDS, S3)",
          "Proficiency in container orchestration with Docker and Kubernetes",
          "Strong scripting skills in Bash or Python",
          "Experience with database clustering, replication, and disaster recovery planning",
        ],
        benefits: [
          "2 Festival Bonuses",
          "Provident Fund and Gratuity benefits",
          "On-call allowance and internet bill reimbursement",
          "Medical coverage for self and family",
          "Weekly team lunch and recreational outings",
        ],
        deadline: "2026-12-31",
        recruiterId: userIdStr,
        companyId: companyId,
        companyName: newCompany.name,
        companyLogo: newCompany.logo,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 28),
      },
      {
        title: "Junior Frontend Developer (React / JavaScript)",
        category: "Engineering",
        jobType: "Full-Time",
        workplaceType: "On-site",
        experienceLevel: "Entry-level",
        location: "Mirpur DOHS, Dhaka",
        salary: "৳45,000 - ৳65,000 / month",
        description:
          "Great opportunity for passionate fresh graduates or junior developers to work with modern frontend technologies under senior tech mentors on high-impact products.",
        skills: ["React", "JavaScript (ES6+)", "HTML5", "CSS3", "TailwindCSS", "Git", "REST APIs"],
        responsibilities: [
          "Develop interactive, mobile-responsive web pages from Figma mockups using React and TailwindCSS",
          "Integrate RESTful APIs and handle dynamic client-side state management",
          "Debug frontend issues, test cross-browser compatibility, and fix UI bugs",
          "Participate in daily standup meetings, code reviews, and technical workshops",
        ],
        requirements: [
          "B.Sc. in CSE, IT, or related degree (Freshers with strong project portfolio encouraged to apply)",
          "Solid foundation in JavaScript, React, HTML5, CSS3, and responsive web design",
          "Familiarity with Git/GitHub, npm packages, and consuming REST APIs",
          "Eagerness to learn new technologies and grow rapidly in a fast-paced environment",
        ],
        benefits: [
          "2 Festival Bonuses",
          "Direct one-on-one mentorship by Senior Architects",
          "Daily lunch, evening snacks, and tea/coffee",
          "Subsidized office transport pickup/drop facility",
          "Fast-track career growth and performance appraisals",
        ],
        deadline: "2026-11-28",
        recruiterId: userIdStr,
        companyId: companyId,
        companyName: newCompany.name,
        companyLogo: newCompany.logo,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
      },
      {
        title: "Software Quality Assurance (SQA) Engineer",
        category: "Engineering",
        jobType: "Full-Time",
        workplaceType: "Hybrid",
        experienceLevel: "Mid-level",
        location: "Uttara, Dhaka",
        salary: "৳65,000 - ৳95,000 / month",
        description:
          "We are seeking an analytical SQA Engineer to ensure the quality, reliability, and security of our web and mobile applications through automated and manual testing.",
        skills: ["Selenium", "Cypress", "Postman", "API Testing", "JIRA", "Automation Testing", "SQL", "Load Testing"],
        responsibilities: [
          "Design detailed test plans, test cases, and test scenarios for web and mobile software",
          "Perform comprehensive functional, regression, API, and cross-platform sanity testing",
          "Develop and maintain automated end-to-end test suites using Cypress or Selenium",
          "Log, track, and verify software defects using JIRA in close collaboration with developers",
        ],
        requirements: [
          "2+ years of experience in manual and automated software quality assurance",
          "Proficiency with Postman for API testing and Cypress/Selenium for automation",
          "Solid understanding of SDLC, STLC, Agile methodologies, and basic SQL queries",
          "B.Sc. in CSE or relevant field; ISTQB certification is a plus",
        ],
        benefits: [
          "2 Festival Bonuses",
          "Performance-based yearly increments and project bonuses",
          "Health & accidental insurance coverage",
          "Paid study leaves and reimbursement for professional certifications",
          "Hybrid work policy (2 days work from home)",
        ],
        deadline: "2026-12-10",
        recruiterId: userIdStr,
        companyId: companyId,
        companyName: newCompany.name,
        companyLogo: newCompany.logo,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      },
      {
        title: "Product Marketing & Growth Executive",
        category: "Marketing",
        jobType: "Full-Time",
        workplaceType: "On-site",
        experienceLevel: "Mid-level",
        location: "Kawran Bazar, Dhaka",
        salary: "৳55,000 - ৳85,000 / month",
        description:
          "We are looking for a dynamic Product Marketing Executive to lead our digital marketing initiatives, B2B lead generation, and social media engagement across Bangladesh.",
        skills: ["Digital Marketing", "SEO", "Content Strategy", "Meta Ads", "Google Ads", "B2B Outreach", "Analytics"],
        responsibilities: [
          "Plan and execute targeted digital marketing campaigns across Facebook, LinkedIn, and Google",
          "Write compelling product copy, articles, case studies, and email newsletters in English & Bengali",
          "Track campaign KPIs, website traffic, conversion rates, and ROI using Google Analytics",
          "Coordinate corporate tech events, university career fairs, and hackathons",
        ],
        requirements: [
          "2+ years of experience in digital marketing or B2B SaaS product marketing in Bangladesh",
          "Proven experience managing Meta Ads and Google Ads campaigns with positive ROI",
          "Excellent written and verbal communication skills in both English and Bengali",
          "BBA / MBA in Marketing or related discipline",
        ],
        benefits: [
          "2 Festival Bonuses",
          "Performance-linked sales and campaign commissions",
          "Daily lunch and refreshments provided",
          "Annual pleasure tour and company sports tournaments",
          "Official phone bill allowance and medical coverage",
        ],
        deadline: "2026-12-05",
        recruiterId: userIdStr,
        companyId: companyId,
        companyName: newCompany.name,
        companyLogo: newCompany.logo,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 60),
      },
    ];

    const insertResult = await db.collection("jobs").insertMany(jobs);
    console.log(`✓ Successfully seeded ${insertResult.insertedCount} realistic Bangladeshi jobs for ${newCompany.name}!`);

    console.log("\n==========================================");
    console.log("  BANGLADESHI SEEDING COMPLETE!          ");
    console.log("==========================================");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await client.close();
  }
}

seed();
