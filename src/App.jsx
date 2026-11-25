import React, { useState, useEffect } from "react";
import "./App.css";

import {
  useNotifications,
  NotificationCenter,
  ToastNotifications,
  sendRecruitmentEmail,
  recruitmentMessages
} from "./Notifications.jsx";

const sampleJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Google",
    location: "Hyderabad",
    salary: 18,
    type: "Full Time",
    skills: ["HTML", "CSS", "JavaScript", "React"]
  },
  {
    id: 2,
    title: "Software Engineer",
    company: "Microsoft",
    location: "Bangalore",
    salary: 24,
    type: "Full Time",
    skills: ["Java", "DSA", "SQL", "Git"]
  },
  {
    id: 3,
    title: "Software Intern",
    company: "Amazon",
    location: "Hyderabad",
    salary: 6,
    type: "Internship",
    skills: ["Python", "DSA", "Git"]
  },
  {
    id: 4,
    title: "Java Developer",
    company: "TCS",
    location: "Chennai",
    salary: 5,
    type: "Full Time",
    skills: ["Java", "OOP", "SQL"]
  },
  {
    id: 5,
    title: "Data Analyst",
    company: "Infosys",
    location: "Pune",
    salary: 8,
    type: "Full Time",
    skills: ["Python", "SQL", "Statistics", "Excel"]
  },
  {
    id: 6,
    title: "React Developer",
    company: "Adobe",
    location: "Remote",
    salary: 20,
    type: "Full Time",
    skills: ["React", "JavaScript", "CSS", "Git"]
  }
];

const roadmaps = {
  "Frontend Developer": [
    "HTML", "CSS", "JavaScript", "React", "Git"
  ],
  "Java Developer": [
    "Java", "OOP", "DSA", "SQL", "Spring Boot"
  ],
  "Data Scientist": [
    "Python", "Statistics", "Pandas",
    "Machine Learning", "SQL"
  ],
  "Cloud Engineer": [
    "Linux", "Networking", "AWS", "Docker", "Git"
  ]
};

const questions = [
  {
    q: "What is 25% of 240?",
    options: ["40", "50", "60", "80"],
    answer: "60"
  },
  {
    q: "Find the next number: 2, 4, 8, 16",
    options: ["20", "24", "32", "36"],
    answer: "32"
  },
  {
    q: "Square root of 144?",
    options: ["10", "11", "12", "14"],
    answer: "12"
  },
  {
    q: "Average of 10, 20 and 30?",
    options: ["10", "20", "30", "40"],
    answer: "20"
  }
];

const features = [
  [
    "target",
    "Smart Job Matching",
    "Discover opportunities that match your technical skills."
  ],
  [
    "chart",
    "Career Intelligence",
    "Identify missing skills and improve your career readiness."
  ],
  [
    "file",
    "Resume Studio",
    "Build professional resumes and analyze job compatibility."
  ],
  [
    "code",
    "Interview Preparation",
    "Practice coding, aptitude and interview questions."
  ],
  [
    "briefcase",
    "Application Tracker",
    "Manage applications throughout your recruitment journey."
  ],
  [
    "layers",
    "Career Roadmaps",
    "Follow structured learning paths towards your dream career."
  ]
];

const icons = {
  target: (
    <>
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="12" cy="12" r="1"/>
    </>
  ),

  chart: (
    <>
      <path d="M3 3v18h18"/>
      <path d="m7 15 4-5 4 3 6-8"/>
    </>
  ),

  file: (
    <>
      <path d="M14 2H5v20h14V7z"/>
      <path d="M14 2v5h5M8 12h8M8 16h8"/>
    </>
  ),

  code: (
    <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>
  ),

  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="14" rx="2"/>
      <path d="M8 7V3h8v4M3 12h18"/>
    </>
  ),

  layers: (
    <path d="m12 2 10 6-10 6L2 8zM2 12l10 6 10-6M2 16l10 6 10-6"/>
  ),

  search: (
    <>
      <circle cx="10" cy="10" r="6"/>
      <path d="m15 15 6 6"/>
    </>
  ),

  arrow: (
    <path d="M4 12h16m-6-6 6 6-6 6"/>
  ),

  logo: (
    <>
      <circle cx="12" cy="12" r="9"/>
      <path d="M3 12h18M12 3c-6 6-6 12 0 18 6-6 6-12 0-18"/>
    </>
  )
};

function Icon({ name, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

function useStorage(key, initial) {

  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }, [key, value]);

  return [value, setValue];
}

async function hashPassword(password, salt) {

  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 600000,
      hash: "SHA-256"
    },
    key,
    256
  );

  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function Progress({ value }) {
  return (
    <div className="progress">
      <div
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`
        }}
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  );
}

/* =====================================
   PROFESSIONAL HOMEPAGE
===================================== */

function Home({
  jobs,
  onLogin,
  onRegister,
  onDemo
}) {

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [menu, setMenu] = useState(false);

  function go(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });

    setMenu(false);
  }

  const filtered = jobs.filter(j =>
    `${j.title} ${j.company} ${j.skills.join(" ")} ${j.type}`
      .toLowerCase()
      .includes(query.toLowerCase()) &&
    (
      location === "All" ||
      j.location === location
    )
  );

  return (

    <div className="cs-home" id="home">

      <header className="cs-header">

        <div className="cs-container cs-nav">

          <a className="cs-brand" href="#home">

            <span className="cs-brand-icon">
              <Icon name="logo" size={25}/>
            </span>

            Career<span>Sphere</span>

          </a>

          <nav className={`cs-links ${menu ? "cs-open" : ""}`}>

            <button onClick={() => go("home")}>
              Home
            </button>

            <button onClick={() => go("jobs")}>
              Find Jobs
            </button>

            <button onClick={() => go("companies")}>
              Companies
            </button>

            <button onClick={() => go("tools")}>
              Career Tools
            </button>

            <button onClick={() => go("about")}>
              About
            </button>

          </nav>

          <div className="cs-nav-actions">

            <button
              className="cs-outline"
              onClick={onLogin}
            >
              Sign In
            </button>

            <button
              className="cs-primary"
              onClick={onRegister}
            >
              Get Started
            </button>

            <button
              className="cs-menu"
              onClick={() => setMenu(!menu)}
            >
              ☰
            </button>

          </div>

        </div>

      </header>

      <section className="cs-hero">

        <div className="cs-container cs-hero-grid">

          <div className="cs-hero-content">

            <div className="cs-pill">
              <span className="cs-dot"/>
              THE NEXT GENERATION CAREER PLATFORM
            </div>

            <h1>
              Build a career that
              <br/>
              <span>moves you forward.</span>
            </h1>

            <p>
              Discover the right opportunities,
              master in-demand skills,
              prepare with confidence and unlock
              your professional potential.
            </p>

            <form
              className="cs-search"
              onSubmit={e => {
                e.preventDefault();
                setShowAll(true);
                go("jobs");
              }}
            >

              <div className="cs-search-input">

                <Icon name="search"/>

                <input
                  placeholder="Job title, skill or company"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />

              </div>

              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
              >

                <option value="All">
                  All locations
                </option>

                {[...new Set(jobs.map(j => j.location))]
                  .map(l => (
                    <option key={l}>{l}</option>
                  ))}

              </select>

              <button className="cs-primary">
                Search Jobs
              </button>

            </form>

            <div className="cs-popular">

              Popular:

              {["React", "Java", "Python", "Internship"]
                .map(s => (

                  <button
                    key={s}
                    onClick={() => {
                      setQuery(s);
                      setShowAll(true);
                      go("jobs");
                    }}
                  >
                    {s}
                  </button>

                ))}

            </div>

            <div className="cs-hero-actions">

              <button
                className="cs-primary"
                onClick={onRegister}
              >
                Create Your Profile
                <Icon name="arrow" size={18}/>
              </button>

              <button
                className="cs-outline"
                onClick={() => go("tools")}
              >
                Explore Career Tools
              </button>

            </div>

            <div className="cs-trust">
              <span>✓ Free to explore</span>
              <span>✓ Skill-based matching</span>
              <span>✓ Career preparation</span>
            </div>

          </div>

          <div className="cs-preview">

            <div className="cs-preview-header">

              <div>
                <small>YOUR CAREER WORKSPACE</small>
                <h3>Career Overview</h3>
              </div>

              <span className="cs-live">
                ● Preview
              </span>

            </div>

            <div className="cs-preview-card cs-readiness">

              <div>
                <small>Career readiness</small>
                <h2>You're making progress.</h2>
                <p>Keep building the skills that matter.</p>
              </div>

              <div className="cs-ring">
                <strong>84%</strong>
              </div>

            </div>

            <div className="cs-preview-stats">

              <div>
                <small>Matched Jobs</small>
                <h2>24</h2>
                <span>↑ Opportunities</span>
              </div>

              <div>
                <small>Skills Acquired</small>
                <h2>12</h2>
                <span>↑ Learning progress</span>
              </div>

              <div>
                <small>Applications</small>
                <h2>08</h2>
                <span>Track your journey</span>
              </div>

            </div>

            <div className="cs-preview-card">

              <h3>Skill Performance</h3>

              {[
                ["React", 90],
                ["JavaScript", 80],
                ["Problem Solving", 65]
              ].map(([s, v]) => (

                <div className="cs-skill" key={s}>

                  <div>
                    <span>{s}</span>
                    <strong>{v}%</strong>
                  </div>

                  <div className="cs-track">
                    <i style={{ width: `${v}%` }}/>
                  </div>

                </div>

              ))}

            </div>

            <div className="cs-preview-card cs-match">

              <span className="cs-company-icon">
                G
              </span>

              <div>
                <strong>Frontend Developer</strong>
                <small>Google · Sample opportunity</small>
              </div>

              <b>92% Match</b>

            </div>

            <small className="cs-disclaimer">
              Illustrative dashboard preview
            </small>

          </div>

        </div>

      </section>

      <section className="cs-companies" id="companies">

        <div className="cs-container">

          <p>
            EXPLORE SAMPLE OPPORTUNITIES FROM LEADING COMPANIES
          </p>

          <div className="cs-company-row">

            {[
              "Google",
              "Microsoft",
              "amazon",
              "TCS",
              "Infosys",
              "Adobe"
            ].map(c => (
              <strong key={c}>{c}</strong>
            ))}

          </div>

        </div>

      </section>

      <section className="cs-section" id="jobs">

        <div className="cs-container">

          <div className="cs-section-heading">

            <div>
              <small>DISCOVER OPPORTUNITIES</small>
              <h2>Find your next opportunity.</h2>
              <p>
                Explore sample listings and recruiter-posted jobs.
              </p>
            </div>

            <button
              className="cs-outline"
              onClick={() => {
                setShowAll(!showAll);
                setQuery("");
                setLocation("All");
              }}
            >
              {showAll ? "Show Less" : "View All Jobs →"}
            </button>

          </div>

          <div className="cs-categories">

            {[
              ["Frontend Development", "React"],
              ["Software Engineering", "Software"],
              ["Data & Analytics", "Data"],
              ["Internships", "Intern"]
            ].map(([label, value]) => (

              <button
                key={label}
                onClick={() => {
                  setQuery(value);
                  setLocation("All");
                  setShowAll(true);
                }}
              >
                <Icon name="briefcase"/>
                {label}
              </button>

            ))}

          </div>

          <p className="cs-result-count">
            {filtered.length} opportunities found
          </p>

          <div className="cs-job-grid">

            {filtered
              .slice(0, showAll ? filtered.length : 3)
              .map(j => (

                <article className="cs-job" key={j.id}>

                  <div className="cs-job-top">

                    <span className="cs-company-icon">
                      {j.company[0]}
                    </span>

                    <span className="cs-job-type">
                      {j.type}
                    </span>

                  </div>

                  <h3>{j.title}</h3>

                  <p>{j.company} · {j.location}</p>

                  <h3>₹{j.salary} LPA</h3>

                  <div className="cs-tags">

                    {j.skills.map((s, i) => (
                      <span key={i}>{s}</span>
                    ))}

                  </div>

                  <div className="cs-job-bottom">

                    <small>
                      {j.owner
                        ? "Recruiter posted"
                        : "Sample listing"}
                    </small>

                    <button
                      className="cs-primary"
                      onClick={onLogin}
                    >
                      Apply Now →
                    </button>

                  </div>

                </article>

              ))}

          </div>

          {!filtered.length && (
            <p>No matching jobs. Try another search.</p>
          )}

        </div>

      </section>

      <section
        className="cs-section cs-tools-section"
        id="tools"
      >

        <div className="cs-container">

          <div className="cs-centered">

            <small>EVERYTHING YOU NEED TO SUCCEED</small>

            <h2>More than a job portal.</h2>

            <p>
              One intelligent workspace for your complete career journey.
            </p>

          </div>

          <div className="cs-feature-grid">

            {features.map(([icon, title, text]) => (

              <article className="cs-feature" key={title}>

                <div className="cs-feature-icon">
                  <Icon name={icon} size={27}/>
                </div>

                <h3>{title}</h3>

                <p>{text}</p>

                <button onClick={onRegister}>
                  Explore feature
                  <Icon name="arrow" size={16}/>
                </button>

              </article>

            ))}

          </div>

        </div>

      </section>

      <section className="cs-section" id="about">

        <div className="cs-container">

          <div className="cs-centered">
            <small>YOUR PATH TO SUCCESS</small>
            <h2>Four steps. One better future.</h2>
          </div>

          <div className="cs-journey">

            {[
              [
                "01",
                "Discover",
                "Find opportunities aligned with your interests."
              ],
              [
                "02",
                "Develop",
                "Identify skill gaps and build your knowledge."
              ],
              [
                "03",
                "Prepare",
                "Practice interviews, coding and aptitude."
              ],
              [
                "04",
                "Achieve",
                "Apply confidently and track your progress."
              ]
            ].map(([n, title, text]) => (

              <div key={n}>
                <span>{n}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>

            ))}

          </div>

          <div className="cs-recruiter">

            <div>
              <small>FOR EMPLOYERS</small>
              <h2>Find your next great hire.</h2>
              <p>
                Publish opportunities, manage candidates
                and simplify recruitment.
              </p>
            </div>

            <button
              className="cs-primary"
              onClick={() => onRegister("Recruiter")}
            >
              Join as Recruiter →
            </button>

          </div>

          <div className="cs-demo">

            <h2>Experience CareerSphere</h2>

            <p>
              Explore our frontend prototype using a demonstration account.
            </p>

            <div>

              {["Candidate", "Recruiter", "Admin"]
                .map(r => (

                  <button
                    className="cs-outline"
                    key={r}
                    onClick={() => onDemo(r)}
                  >
                    {r} Demo
                  </button>

                ))}

            </div>

          </div>

        </div>

      </section>

      <footer className="cs-footer">

        <div className="cs-container cs-footer-grid">

          <div>
            <h2>Career<span>Sphere</span></h2>
            <p>Find. Learn. Prepare. Apply. Achieve.</p>
          </div>

          <div>

            <button onClick={() => go("jobs")}>
              Find Jobs
            </button>

            <button onClick={() => go("tools")}>
              Career Tools
            </button>

            <button onClick={() => go("about")}>
              About Us
            </button>

          </div>

        </div>

        <p>
          © {new Date().getFullYear()} CareerSphere · Educational frontend prototype
        </p>

      </footer>

    </div>

  );
}

/* =====================================
   MAIN APPLICATION
===================================== */

function App() {

  const {
    notifications,
    toasts,
    showToast,
    closeToast,
    addNotification,
    markAllRead,
    markRead,
    clearHistory
  } = useNotifications();

  const [emailBusy, setEmailBusy] = useState(false);

  const [user, setUser] = useStorage(
    "cs3-user", null
  );

  const [accounts, setAccounts] = useStorage(
    "cs3-accounts", []
  );

  const [jobs, setJobs] = useStorage(
    "cs3-jobs", sampleJobs
  );

  const [applications, setApplications] = useStorage(
    "cs3-applications", []
  );

  const [bookmarks, setBookmarks] = useStorage(
    "cs3-bookmarks", []
  );

  const [reports, setReports] = useStorage(
    "cs3-reports", []
  );

  const [dark, setDark] = useStorage(
    "cs3-dark", false
  );

  const [tasks, setTasks] = useStorage(
    "cs3-tasks", {}
  );

  const [reviews, setReviews] = useStorage(
    "cs3-reviews", []
  );

  const [page, setPage] = useState("Dashboard");
  const [auth, setAuth] = useState(false);
  const [register, setRegister] = useState(false);
  const [role, setRole] = useState("Candidate");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [type, setType] = useState("All");
  const [minSalary, setMinSalary] = useState(0);

  const [selectedJob, setSelectedJob] = useState(1);
  const [extraSkills, setExtraSkills] = useState("");
  const [resume, setResume] = useState("");

  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const [company, setCompany] = useState("Google");
  const [salary, setSalary] = useState(10);
  const [deduction, setDeduction] = useState(15);

  const [offerA, setOfferA] = useState(10);
  const [offerB, setOfferB] = useState(12);

  const [costA, setCostA] = useState(15000);
  const [costB, setCostB] = useState(25000);

  const [menu, setMenu] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const emptyJob = {
    title: "",
    company: "",
    location: "",
    salary: "",
    skills: "",
    type: "Full Time"
  };

  const [jobForm, setJobForm] = useState(emptyJob);

  const split = (text = "") =>
    [...new Set(
      text
        .split(",")
        .map(s => s.trim().toLowerCase())
        .filter(Boolean)
    )];

  const skills = split(user?.skills || "");

  function match(job, list = skills) {

    if (!job?.skills?.length) return 0;

    return Math.round(
      job.skills.filter(
        s => list.includes(s.toLowerCase())
      ).length / job.skills.length * 100
    );
  }

  const currentJob =
    jobs.find(j => j.id === Number(selectedJob)) ||
    jobs[0];

  const myApplications = applications.filter(
    a => a.userId === user?.id
  );

  const savedJobs = jobs.filter(
    j => bookmarks.some(
      b =>
        b.userId === user?.id &&
        b.jobId === j.id
    )
  );

  const goalSkills =
    roadmaps[user?.goal] ||
    roadmaps["Frontend Developer"];

  const readiness = Math.round(
    goalSkills.filter(
      s => skills.includes(s.toLowerCase())
    ).length / goalSkills.length * 100
  );

  function resetPasswordFields() {
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setAuthError("");
  }

  function openAuth(isRegister, selectedRole = "Candidate") {
    resetPasswordFields();
    setRegister(isRegister);
    setRole(selectedRole);
    setAuth(true);
  }

  function enter(account) {

    const {
      passwordHash,
      salt,
      ...profile
    } = account;

    setUser(profile);
    setPage("Dashboard");
    setAuth(false);
    setMenu(false);
    setAnswers({});
    setScore(null);
    setResume("");
    setExtraSkills("");
    setReviewText("");

    resetPasswordFields();

    window.scrollTo(0, 0);
  }

  function demo(selectedRole) {

    const account = {
      id: "demo-" + selectedRole,
      name: "Demo " + selectedRole,
      email: selectedRole.toLowerCase() + "@demo.com",
      role: selectedRole,
      skills: "HTML, CSS, JavaScript, Java",
      education: "B.Tech CSE",
      goal: "Frontend Developer",
      projects: "CareerSphere"
    };

    enter(account);

    showToast(
      "Demo Login Successful",
      `Welcome to the ${selectedRole} workspace.`
    );

    addNotification(
      account.id,
      "Demo Login",
      `You opened the ${selectedRole} workspace.`
    );
  }

  /* LOGIN AND REGISTRATION */

  async function authenticate(e) {

    e.preventDefault();

    if (authBusy) return;

    setAuthError("");

    const cleanEmail = email.trim().toLowerCase();

    const existing = accounts.find(
      a =>
        a.email.toLowerCase() === cleanEmail &&
        a.role === role
    );

    function fail(message) {

      setAuthError(message);

      showToast(
        register
          ? "Registration Failed"
          : "Login Failed",
        message,
        "error"
      );
    }

    if (!cleanEmail || !password) {
      return fail("Enter your email and password.");
    }

    setAuthBusy(true);

    try {

      if (register) {

        if (role === "Admin") {
          return fail(
            "Public admin registration is disabled."
          );
        }

        if (!name.trim()) {
          return fail("Enter your full name.");
        }

        if (existing) {
          return fail("Account already exists.");
        }

        if (password.length < 8) {
          return fail(
            "Password must contain at least 8 characters."
          );
        }

        if (password !== confirmPassword) {
          return fail("Passwords do not match.");
        }

        const salt = crypto.randomUUID();

        const passwordHash = await hashPassword(
          password,
          salt
        );

        const account = {
          id: Date.now(),
          name: name.trim(),
          email: cleanEmail,
          role,
          salt,
          passwordHash,
          skills: "",
          education: "",
          goal: "Frontend Developer",
          projects: ""
        };

        setAccounts(old => [...old, account]);

        enter(account);

        showToast(
          "Registration Successful",
          `Welcome to CareerSphere, ${account.name}!`
        );

        addNotification(
          account.id,
          "Registration Successful",
          "Your CareerSphere account has been created successfully."
        );

      } else {

        if (!existing) {
          return fail("Account not found. Register first.");
        }

        if (!existing.passwordHash || !existing.salt) {
          return fail(
            "Old account without password. Register with a new email."
          );
        }

        const enteredHash = await hashPassword(
          password,
          existing.salt
        );

        if (enteredHash !== existing.passwordHash) {
          return fail("Incorrect email or password.");
        }

        enter(existing);

        showToast(
          "Login Successful",
          `Welcome back, ${existing.name}!`
        );

        addNotification(
          existing.id,
          "Login Successful",
          "You have successfully logged into CareerSphere."
        );

      }

    } catch (error) {

      console.error(error);

      fail(
        "Authentication failed. Open using localhost or HTTPS."
      );

    } finally {

      setAuthBusy(false);

    }
  }

  function logout() {

    setUser(null);
    setPage("Dashboard");
    setAuth(false);
    setMenu(false);

    resetPasswordFields();

    showToast(
      "Logged Out",
      "You have successfully signed out."
    );
  }

  function updateProfile(field, value) {

    setUser(old => ({
      ...old,
      [field]: value
    }));

    setAccounts(old =>
      old.map(a =>
        a.id === user.id
          ? { ...a, [field]: value }
          : a
      )
    );
  }

  /* JOB APPLICATION */

  function apply(job) {

    if (myApplications.some(a => a.jobId === job.id)) {

      showToast(
        "Already Applied",
        "You have already applied for this job.",
        "error"
      );

      return;
    }

    const application = {
      id: Date.now(),
      jobId: job.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      title: job.title,
      company: job.company,
      status: "Applied",
      emailStatus: "Not required",
      date: new Date().toLocaleDateString()
    };

    setApplications(old => [
      ...old,
      application
    ]);

    showToast(
      "Application Successful",
      `You applied for ${job.title} at ${job.company}.`
    );

    addNotification(
      user.id,
      "Application Submitted",
      `Your application for ${job.title} at ${job.company} was submitted successfully.`
    );

    if (job.owner) {

      addNotification(
        job.owner,
        "New Job Application",
        `${user.name} applied for ${job.title}.`
      );

    }
  }

  function bookmark(job) {

    const exists = bookmarks.some(
      b =>
        b.userId === user.id &&
        b.jobId === job.id
    );

    setBookmarks(old =>
      exists
        ? old.filter(
            b => !(
              b.userId === user.id &&
              b.jobId === job.id
            )
          )
        : [
            ...old,
            {
              userId: user.id,
              jobId: job.id
            }
          ]
    );

    showToast(
      exists ? "Job Removed" : "Job Saved",
      exists
        ? "Job removed from your saved list."
        : "Job added to your saved list."
    );
  }

  function postJob(e) {

    e.preventDefault();

    if (user.role === "Candidate") return;

    setJobs(old => [
      ...old,
      {
        ...jobForm,
        id: Date.now(),
        owner: user.id,
        salary: Number(jobForm.salary),
        skills: jobForm.skills
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)
      }
    ]);

    setJobForm(emptyJob);
    setPage("Manage Jobs");

    showToast(
      "Job Published",
      "Your job has been posted successfully."
    );

    addNotification(
      user.id,
      "Job Published",
      `${jobForm.title} has been published successfully.`
    );
  }

  function toggleTask(task) {

    const key = user.id + "-" + task;

    setTasks(old => ({
      ...old,
      [key]: !old[key]
    }));
  }

  function navigate(item) {
    setPage(item);
    setMenu(false);
    window.scrollTo(0, 0);
  }

  /* RECRUITMENT EMAIL SYSTEM */

  async function updateApplicationStatus(
    application,
    status,
    retry = false
  ) {

    if (emailBusy) return;

    if (
      user.role !== "Admin" &&
      user.role !== "Recruiter"
    ) {
      return;
    }

    if (
      user.role === "Recruiter" &&
      !jobs.some(
        j =>
          j.id === application.jobId &&
          j.owner === user.id
      )
    ) {
      return;
    }

    if (!recruitmentMessages[status]) return;

    if (application.status === status && !retry) {
      return;
    }

    if (
      retry &&
      application.emailStatus !== "Failed"
    ) {
      return;
    }

    setEmailBusy(true);

    function updateEmailStatus(emailStatus) {

      setApplications(old =>
        old.map(a =>
          a.id === application.id
            ? { ...a, emailStatus }
            : a
        )
      );
    }

    try {

      if (!retry) {

        setApplications(old =>
          old.map(a =>
            a.id === application.id
              ? {
                  ...a,
                  status,
                  emailStatus:
                    status === "Applied"
                      ? "Not required"
                      : "Pending"
                }
              : a
          )
        );

        addNotification(
          application.userId,
          "Application " + status,
          `${application.company} — ${application.title}. ${recruitmentMessages[status]}`,
          status === "Rejected"
            ? "error"
            : "success"
        );

      }

      if (status === "Applied") {

        showToast(
          "Status Updated",
          "Application status updated successfully."
        );

        return;
      }

      if (String(application.userId).startsWith("demo-")) {

        updateEmailStatus("Demo only");

        showToast(
          "Status Updated",
          "Demo candidate updated. No real email was sent."
        );

        return;
      }

      updateEmailStatus("Pending");

      try {

        await sendRecruitmentEmail(
          application,
          status
        );

        updateEmailStatus("Sent");

        showToast(
          "Email Submitted",
          `Recruitment email submitted for ${application.email}.`
        );

      } catch (error) {

        console.error("EmailJS Error:", error);

        updateEmailStatus("Failed");

        showToast(
          "Email Failed",
          "Application status saved, but the email could not be sent. Check EmailJS configuration.",
          "error"
        );

      }

    } finally {

      setEmailBusy(false);

    }
  }

  /* JOB CARD */

  function JobCard({ job }) {

    const saved = savedJobs.some(
      j => j.id === job.id
    );

    const applied = myApplications.some(
      a => a.jobId === job.id
    );

    return (

      <div className="card job-card">

        <div className="job-heading">

          <div className="company-logo">
            {job.company[0]}
          </div>

          <div>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
          </div>

        </div>

        <p>{job.location} · {job.type}</p>

        <h3>₹{job.salary} LPA</h3>

        <div className="tags">

          {job.skills.map((s, i) => (
            <span key={i}>{s}</span>
          ))}

        </div>

        <div className="match">

          <strong>{match(job)}% Skill Match</strong>

          <Progress value={match(job)}/>

        </div>

        <div className="actions">

          <button
            disabled={applied}
            onClick={() => apply(job)}
          >
            {applied ? "Applied" : "Apply Now"}
          </button>

          <button
            className="secondary"
            onClick={() => bookmark(job)}
          >
            {saved ? "Saved" : "Save"}
          </button>

          <button
            className="secondary"
            onClick={() => {
              setSelectedJob(job.id);
              navigate("Skill Analyzer");
            }}
          >
            Analyze
          </button>

        </div>

        <button
          className="text-button"
          onClick={() => {

            const reason = prompt(
              "Why are you reporting this job?"
            );

            if (reason?.trim()) {

              setReports(old => [
                ...old,
                {
                  id: Date.now(),
                  title: job.title,
                  company: job.company,
                  reason,
                  status: "Pending"
                }
              ]);

              showToast(
                "Report Submitted",
                "Your report has been submitted for review."
              );
            }

          }}
        >
          Report suspicious job
        </button>

      </div>

    );
  }

  /* HOMEPAGE AND AUTHENTICATION */

  if (!user) {

    return (

      <div className="landing">

        <ToastNotifications
          toasts={toasts}
          onClose={closeToast}
        />

        <Home
          jobs={jobs}
          onLogin={() => openAuth(false)}
          onRegister={selectedRole =>
            openAuth(
              true,
              typeof selectedRole === "string"
                ? selectedRole
                : "Candidate"
            )
          }
          onDemo={demo}
        />

        {auth && (

          <div className="overlay">

            <form
              className="modal"
              onSubmit={authenticate}
            >

              <button
                type="button"
                className="close"
                disabled={authBusy}
                onClick={() => {
                  setAuth(false);
                  resetPasswordFields();
                }}
              >
                ×
              </button>

              <div className="auth-brand">
                <Icon name="logo" size={30}/>
                CareerSphere
              </div>

              <h2>
                {register
                  ? "Create your account"
                  : "Welcome back"}
              </h2>

              <p>
                {register
                  ? "Start your professional journey."
                  : "Sign in to your career workspace."}
              </p>

              <fieldset disabled={authBusy}>

                <label>Account Type</label>

                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  <option>Candidate</option>
                  <option>Recruiter</option>

                  {!register && (
                    <option>Admin</option>
                  )}

                </select>

                {register && (

                  <>

                    <label>Full Name</label>

                    <input
                      required
                      value={name}
                      placeholder="Enter full name"
                      onChange={e => setName(e.target.value)}
                    />

                  </>

                )}

                <label>Email Address</label>

                <input
                  required
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={e => setEmail(e.target.value)}
                />

                <label>Password</label>

                <div className="password-field">

                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Enter password"
                    onChange={e => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

                {register && (

                  <>

                    <small>Minimum 8 characters.</small>

                    <label>Confirm Password</label>

                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      placeholder="Confirm password"
                      onChange={e =>
                        setConfirmPassword(e.target.value)
                      }
                    />

                    {confirmPassword && (

                      <small
                        style={{
                          color:
                            password === confirmPassword
                              ? "green"
                              : "red"
                        }}
                      >
                        {password === confirmPassword
                          ? "Passwords match"
                          : "Passwords do not match"}
                      </small>

                    )}

                  </>

                )}

                {authError && (

                  <div className="auth-error">
                    {authError}
                  </div>

                )}

                <button
                  className="auth-submit"
                  disabled={authBusy}
                >
                  {authBusy
                    ? "Please wait..."
                    : register
                    ? "Create Account →"
                    : "Sign In →"}
                </button>

                <button
                  type="button"
                  className="text-button auth-switch"
                  onClick={() => {
                    setRegister(!register);
                    setRole("Candidate");
                    resetPasswordFields();
                  }}
                >
                  {register
                    ? "Already registered? Sign in"
                    : "New user? Create account"}
                </button>

              </fieldset>

              <small>
                Frontend prototype. Use a demonstration password only.
              </small>

            </form>

          </div>

        )}

      </div>

    );
  }

  /* DASHBOARD NAVIGATION */

  const candidate = user.role === "Candidate";
  const admin = user.role === "Admin";

  const ownedJobs = jobs.filter(
    j => admin || j.owner === user.id
  );

  const receivedApplications = applications.filter(
    a =>
      admin ||
      ownedJobs.some(j => j.id === a.jobId)
  );

  const groups = candidate

    ? {

        Overview: [
          "Dashboard",
          "My Profile",
          "Daily Tasks"
        ],

        Opportunities: [
          "Find Jobs",
          "Saved Jobs",
          "Applications",
          "Eligibility Checker"
        ],

        "Career Intelligence": [
          "Skill Analyzer",
          "Skill Simulator",
          "Career Roadmap",
          "Resume Builder",
          "Resume Analyzer",
          "Dream Company",
          "Career Switch",
          "Rejection Recovery"
        ],

        Preparation: [
          "Interview Prep",
          "Aptitude Test",
          "Coding Practice",
          "Placement Mode"
        ],

        Resources: [
          "Salary Calculator",
          "Offer Comparison",
          "Company Reviews",
          "Learning Resources",
          "Hackathons",
          "External Portals"
        ]

      }

    : {

        Management: [
          "Dashboard",
          "Post Job",
          "Manage Jobs",
          "Manage Candidates",
          "My Profile"
        ],

        ...(admin
          ? {
              Administration: [
                "Manage Users",
                "Job Reports"
              ]
            }
          : {})

      };

  const filteredJobs = jobs.filter(j =>

    `${j.title} ${j.company} ${j.skills.join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase()) &&

    (
      location === "All" ||
      j.location === location
    ) &&

    (
      type === "All" ||
      j.type === type
    ) &&

    j.salary >= Number(minSalary)

  );

  function Checklist({ items }) {

    return items.map(t => (

      <div className="roadmap" key={t}>

        <input
          type="checkbox"
          checked={!!tasks[user.id + "-" + t]}
          onChange={() => toggleTask(t)}
        />

        {t}

      </div>

    ));
  }

  /* =====================================
     ALL DASHBOARD MODULES
  ===================================== */

  function renderPage() {

    switch (page) {

      case "Dashboard":

        return (

          <>

            <div className="welcome">

              <div>

                <p>WELCOME TO CAREERSPHERE</p>

                <h1>Hello, {user.name}!</h1>

                <p>
                  {candidate
                    ? "Your future starts here."
                    : "Manage your recruitment workspace."}
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(
                    candidate ? "Find Jobs" : "Post Job"
                  )
                }
              >
                {candidate
                  ? "Explore Jobs →"
                  : "Post a Job →"}
              </button>

            </div>

            <div className="stats-grid">

              <Stat
                label={candidate ? "Available Jobs" : "Managed Jobs"}
                value={candidate ? jobs.length : ownedJobs.length}
              />

              <Stat
                label="Applications"
                value={
                  candidate
                    ? myApplications.length
                    : receivedApplications.length
                }
              />

              <Stat
                label={
                  candidate
                    ? "Saved Jobs"
                    : "Selected Candidates"
                }
                value={
                  candidate
                    ? savedJobs.length
                    : receivedApplications.filter(
                        a => a.status === "Selected"
                      ).length
                }
              />

              <Stat
                label={
                  candidate
                    ? "Career Readiness"
                    : "Pending Reports"
                }
                value={
                  candidate
                    ? readiness + "%"
                    : admin
                    ? reports.filter(
                        r => r.status === "Pending"
                      ).length
                    : "—"
                }
              />

            </div>

            {candidate && (

              <>

                <div className="card">

                  <h2>Career Readiness Score</h2>

                  <div className="big-score">
                    {readiness}%
                  </div>

                  <Progress value={readiness}/>

                  <p>Target career: {user.goal}</p>

                  <button
                    onClick={() =>
                      navigate("Career Roadmap")
                    }
                  >
                    Improve My Skills
                  </button>

                </div>

                <h2>Recommended Jobs</h2>

                <div className="grid">

                  {[...jobs]
                    .sort((a, b) => match(b) - match(a))
                    .slice(0, 4)
                    .map(j => (
                      <JobCard key={j.id} job={j}/>
                    ))}

                </div>

              </>

            )}

          </>

        );

      case "My Profile":

        return (

          <div className="card form-grid">

            {[
              ["name", "Full Name"],
              ["email", "Email"],
              ["education", "Education"],
              ["skills", "Skills (comma separated)"],
              ["projects", "Projects"]
            ].map(([field, label]) => (

              <div key={field}>

                <label>{label}</label>

                <input
                  value={user[field] || ""}
                  readOnly={field === "email"}
                  onChange={e =>
                    updateProfile(field, e.target.value)
                  }
                />

              </div>

            ))}

            <div>

              <label>Career Goal</label>

              <select
                value={user.goal}
                onChange={e =>
                  updateProfile("goal", e.target.value)
                }
              >

                {Object.keys(roadmaps).map(r => (
                  <option key={r}>{r}</option>
                ))}

              </select>

            </div>

            <p>Profile changes are saved automatically.</p>

          </div>

        );

      case "Find Jobs":

        return (

          <>

            <div className="card filters">

              <input
                placeholder="Search jobs, companies, skills..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
              >

                <option>All</option>

                {[...new Set(jobs.map(j => j.location))]
                  .map(l => (
                    <option key={l}>{l}</option>
                  ))}

              </select>

              <select
                value={type}
                onChange={e => setType(e.target.value)}
              >

                {[
                  "All",
                  "Full Time",
                  "Internship",
                  "Part Time"
                ].map(t => (
                  <option key={t}>{t}</option>
                ))}

              </select>

              <input
                type="number"
                min="0"
                placeholder="Minimum LPA"
                value={minSalary}
                onChange={e => setMinSalary(e.target.value)}
              />

            </div>

            <p>{filteredJobs.length} opportunities found</p>

            <div className="grid">

              {filteredJobs.map(j => (
                <JobCard key={j.id} job={j}/>
              ))}

            </div>

          </>

        );

      case "Saved Jobs":

        return (

          <div className="grid">

            {!savedJobs.length && (
              <p>No saved jobs yet.</p>
            )}

            {savedJobs.map(j => (
              <JobCard key={j.id} job={j}/>
            ))}

          </div>

        );

      case "Applications":

        return (

          <div className="card table-wrap">

            <h2>My Applications</h2>

            <table>

              <thead>

                <tr>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {myApplications.map(a => (

                  <tr key={a.id}>

                    <td>{a.title}</td>
                    <td>{a.company}</td>
                    <td>{a.date}</td>

                    <td>

                      <span
                        className="status"
                        style={
                          a.status === "Rejected"
                            ? {
                                color: "#dc2626",
                                background: "#fee2e2"
                              }
                            : {}
                        }
                      >
                        {a.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {!myApplications.length && (
              <p>No applications yet.</p>
            )}

          </div>

        );

      case "Skill Analyzer":
      case "Eligibility Checker":
      case "Skill Simulator":
      case "Resume Analyzer": {

        const list =
          page === "Skill Simulator"

            ? [...skills, ...split(extraSkills)]

            : page === "Resume Analyzer"

            ? (currentJob?.skills || [])
                .filter(s =>
                  resume.toLowerCase().includes(s.toLowerCase())
                )
                .map(s => s.toLowerCase())

            : skills;

        const result = match(currentJob, list);

        return (

          <div className="card">

            <label>Select Target Job</label>

            <select
              value={currentJob?.id || ""}
              onChange={e => setSelectedJob(e.target.value)}
            >

              {jobs.map(j => (

                <option key={j.id} value={j.id}>
                  {j.company} — {j.title}
                </option>

              ))}

            </select>

            {page === "Skill Simulator" && (

              <>

                <p>Current match: {match(currentJob)}%</p>

                <label>Skills you plan to learn</label>

                <input
                  value={extraSkills}
                  placeholder="React, Git..."
                  onChange={e =>
                    setExtraSkills(e.target.value)
                  }
                />

              </>

            )}

            {page === "Resume Analyzer" && (

              <textarea
                rows="8"
                placeholder="Paste your resume here..."
                value={resume}
                onChange={e => setResume(e.target.value)}
              />

            )}

            <div className="big-score">
              {result}%
            </div>

            <Progress value={result}/>

            <h3>Matching Skills</h3>

            <div className="tags">

              {currentJob?.skills
                .filter(s => list.includes(s.toLowerCase()))
                .map((s, i) => (

                  <span className="green" key={i}>
                    {s}
                  </span>

                ))}

            </div>

            <h3>Missing Skills</h3>

            <div className="tags">

              {currentJob?.skills
                .filter(s => !list.includes(s.toLowerCase()))
                .map((s, i) => (

                  <span className="red" key={i}>
                    {s}
                  </span>

                ))}

            </div>

            {page === "Eligibility Checker" && (

              <p>
                {result === 100
                  ? "All listed skills matched."
                  : "Some required skills are missing."}

                {" "}Actual eligibility depends on employer requirements.
              </p>

            )}

            <button
              onClick={() => navigate("Career Roadmap")}
            >
              View Learning Roadmap
            </button>

          </div>

        );
      }

      case "Career Roadmap":
      case "Career Switch":

        return (

          <div className="card">

            <label>Select Career</label>

            <select
              value={user.goal}
              onChange={e =>
                updateProfile("goal", e.target.value)
              }
            >

              {Object.keys(roadmaps).map(r => (
                <option key={r}>{r}</option>
              ))}

            </select>

            {goalSkills.map((s, i) => (

              <div className="roadmap" key={s}>

                <div className="step">
                  {i + 1}
                </div>

                <div className="grow">

                  <h3>{s}</h3>

                  <p>
                    {skills.includes(s.toLowerCase())
                      ? "Already in your profile"
                      : "Recommended skill to learn"}
                  </p>

                </div>

                <input
                  type="checkbox"
                  checked={!!tasks[user.id + "-" + s]}
                  onChange={() => toggleTask(s)}
                />

              </div>

            ))}

          </div>

        );

      case "Resume Builder":

        return (

          <>

            <div className="card actions no-print">

              <button
                onClick={() => navigate("My Profile")}
              >
                Edit Profile
              </button>

              <button onClick={() => window.print()}>
                Print / Save PDF
              </button>

            </div>

            <div className="card resume" id="print-area">

              <h1>{user.name}</h1>

              <p>{user.email}</p>

              <hr/>

              <h2>Career Objective</h2>

              <p>
                Aspiring {user.goal} seeking opportunities
                to apply technical skills.
              </p>

              <h2>Education</h2>

              <p>{user.education || "Add your education"}</p>

              <h2>Technical Skills</h2>

              <p>{user.skills || "Add your skills"}</p>

              <h2>Projects</h2>

              <p>{user.projects || "Add your projects"}</p>

            </div>

          </>

        );

      case "Dream Company":

        return (

          <div className="card">

            <label>Choose your dream company</label>

            <select
              value={company}
              onChange={e => setCompany(e.target.value)}
            >

              {sampleJobs.map(j => (
                <option key={j.id}>{j.company}</option>
              ))}

            </select>

            <h2>Your preparation plan for {company}</h2>

            <Checklist
              items={[
                "Week 1: Strengthen programming fundamentals",
                "Week 2: Practice data structures and algorithms",
                "Week 3: Build a relevant project",
                "Week 4: Mock interviews and resume preparation"
              ]}
            />

            <button
              onClick={() => navigate("Interview Prep")}
            >
              Start Preparation
            </button>

          </div>

        );

      case "Rejection Recovery":

        return (

          <div className="card">

            <h2>Turn rejection into improvement</h2>

            <p>
              Review your interview feedback and identify
              areas to improve.
            </p>

            <textarea
              placeholder="Write your interview feedback..."
              rows="5"
            />

            <Checklist
              items={[
                "Review technical fundamentals",
                "Improve communication skills",
                "Update resume",
                "Practice mock interviews",
                "Apply for relevant opportunities"
              ]}
            />

          </div>

        );

      case "Interview Prep":

        return (

          <div className="card">

            <label>Target Company</label>

            <select
              value={company}
              onChange={e => setCompany(e.target.value)}
            >

              {sampleJobs.map(j => (
                <option key={j.id}>{j.company}</option>
              ))}

            </select>

            <h2>Practice Interview — {company}</h2>

            <p>
              Illustrative practice questions, not verified company questions.
            </p>

            {[
              "Tell me about yourself.",
              "Explain object-oriented programming.",
              "What is the difference between an array and a linked list?",
              "Explain a project you have developed.",
              "Why should we hire you?"
            ].map((q, i) => (

              <details key={q}>

                <summary>{i + 1}. {q}</summary>

                <textarea
                  rows="4"
                  placeholder="Practice your answer..."
                />

              </details>

            ))}

          </div>

        );

      case "Aptitude Test":

        return (

          <div className="card">

            <h2>Aptitude Assessment</h2>

            {questions.map((q, i) => (

              <div className="question" key={i}>

                <h3>{i + 1}. {q.q}</h3>

                {q.options.map(o => (

                  <label className="radio" key={o}>

                    <input
                      type="radio"
                      name={"question" + i}
                      checked={answers[i] === o}
                      onChange={() =>
                        setAnswers(old => ({
                          ...old,
                          [i]: o
                        }))
                      }
                    />

                    {o}

                  </label>

                ))}

              </div>

            ))}

            <div className="actions">

              <button
                onClick={() => {

                  const result = questions.filter(
                    (q, i) => answers[i] === q.answer
                  ).length;

                  setScore(result);

                  showToast(
                    "Test Completed",
                    `You scored ${result}/${questions.length}.`
                  );

                }}
              >
                Submit Test
              </button>

              <button
                className="secondary"
                onClick={() => {
                  setAnswers({});
                  setScore(null);
                }}
              >
                Reset
              </button>

            </div>

            {score !== null && (

              <h2>
                Score: {score}/{questions.length}
                {" "}— {score / questions.length * 100}%
              </h2>

            )}

          </div>

        );

      case "Coding Practice":

        return (

          <div className="card">

            {[
              [
                "Reverse a String",
                "hello",
                "olleh",
                "str.split('').reverse().join('')"
              ],
              [
                "Maximum Number",
                "[1,5,3]",
                "5",
                "Math.max(...arr)"
              ],
              [
                "Palindrome Check",
                "madam",
                "true",
                "str === str.split('').reverse().join('')"
              ]
            ].map(([title, input, output, solution]) => (

              <details key={title}>

                <summary>{title}</summary>

                <p>Sample Input: {input}</p>

                <p>Expected Output: {output}</p>

                <textarea
                  rows="5"
                  placeholder="Write your code here..."
                />

                <details>

                  <summary>View JavaScript Solution</summary>

                  <pre>{solution}</pre>

                </details>

              </details>

            ))}

            <p>
              Practice editor only — code execution is not enabled.
            </p>

          </div>

        );

      case "Daily Tasks":
      case "Placement Mode": {

        const list = page === "Daily Tasks"

          ? [
              "Learn one new skill",
              "Solve two coding problems",
              "Apply for a job",
              "Practice aptitude",
              "Update your resume"
            ]

          : [
              "Complete Java fundamentals",
              "Practice DSA",
              "Learn SQL",
              "Build a project",
              "Prepare resume",
              "Practice aptitude",
              "Attend mock interview",
              "Research companies"
            ];

        const completed = list.filter(
          t => tasks[user.id + "-" + t]
        ).length;

        return (

          <div className="card">

            <h2>
              {completed}/{list.length} Tasks Completed
            </h2>

            <Progress
              value={completed / list.length * 100}
            />

            <Checklist items={list}/>

          </div>

        );
      }

      case "Salary Calculator":

        return (

          <div className="card">

            <label>Annual Salary (LPA)</label>

            <input
              type="number"
              min="0"
              value={salary}
              onChange={e =>
                setSalary(Math.max(0, Number(e.target.value)))
              }
            />

            <label>Estimated deductions: {deduction}%</label>

            <input
              type="range"
              min="0"
              max="40"
              value={deduction}
              onChange={e =>
                setDeduction(Number(e.target.value))
              }
            />

            <div className="stats-grid">

              <Stat
                label="Gross Monthly"
                value={
                  "₹" +
                  Math.round(
                    salary * 100000 / 12
                  ).toLocaleString("en-IN")
                }
              />

              <Stat
                label="Estimated Take Home"
                value={
                  "₹" +
                  Math.round(
                    salary * 100000 / 12 *
                    (1 - deduction / 100)
                  ).toLocaleString("en-IN")
                }
              />

            </div>

            <p>
              Illustrative estimate, not an actual tax calculation.
            </p>

          </div>

        );

      case "Offer Comparison":

        return (

          <div className="grid">

            {[
              ["Offer A", offerA, setOfferA, costA, setCostA],
              ["Offer B", offerB, setOfferB, costB, setCostB]
            ].map(([label, amount, setAmount, cost, setCost]) => (

              <div className="card" key={label}>

                <h2>{label}</h2>

                <label>Annual Salary (LPA)</label>

                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={e =>
                    setAmount(
                      Math.max(0, Number(e.target.value))
                    )
                  }
                />

                <label>Monthly Living Expenses</label>

                <input
                  type="number"
                  min="0"
                  value={cost}
                  onChange={e =>
                    setCost(
                      Math.max(0, Number(e.target.value))
                    )
                  }
                />

                <h3>Monthly amount after expenses</h3>

                <div className="big-score">

                  ₹{Math.round(
                    amount * 100000 / 12 - cost
                  ).toLocaleString("en-IN")}

                </div>

                <p>Before taxes and payroll deductions.</p>

              </div>

            ))}

          </div>

        );

      case "Company Reviews":

        return (

          <>

            <div className="card">

              <label>Company</label>

              <select
                value={company}
                onChange={e => setCompany(e.target.value)}
              >

                {sampleJobs.map(j => (
                  <option key={j.id}>{j.company}</option>
                ))}

              </select>

              <textarea
                placeholder="Write your review..."
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
              />

              <button
                onClick={() => {

                  if (!reviewText.trim()) return;

                  setReviews(old => [
                    ...old,
                    {
                      id: Date.now(),
                      company,
                      text: reviewText,
                      author: user.name
                    }
                  ]);

                  setReviewText("");

                  showToast(
                    "Review Submitted",
                    "Your company review has been saved."
                  );

                }}
              >
                Submit Review
              </button>

            </div>

            {reviews.map(r => (

              <div className="card" key={r.id}>

                <h3>{r.company}</h3>

                <p>{r.text}</p>

                <small>{r.author} · Unverified review</small>

              </div>

            ))}

          </>

        );

      case "Learning Resources":
      case "Hackathons":
      case "External Portals": {

        const links = page === "Learning Resources"

          ? [
              ["React Documentation", "https://react.dev"],
              ["MDN Web Development", "https://developer.mozilla.org"],
              ["freeCodeCamp", "https://www.freecodecamp.org"],
              ["LeetCode", "https://leetcode.com"],
              ["GitHub Skills", "https://skills.github.com"]
            ]

          : page === "Hackathons"

          ? [
              ["Unstop", "https://unstop.com"],
              ["Devpost", "https://devpost.com"],
              ["HackerEarth", "https://www.hackerearth.com"]
            ]

          : [
              ["LinkedIn", "https://www.linkedin.com/jobs"],
              ["Naukri", "https://www.naukri.com"],
              ["Indeed", "https://in.indeed.com"],
              ["Internshala", "https://internshala.com"],
              ["Glassdoor", "https://www.glassdoor.com"],
              ["Unstop", "https://unstop.com"]
            ];

        return (

          <div className="grid">

            {links.map(([title, url]) => (

              <div className="card" key={title}>

                <h2>{title}</h2>

                <p>
                  Explore external opportunities and resources.
                </p>

                <a
                  className="button"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website ↗
                </a>

              </div>

            ))}

          </div>

        );
      }

      /* RECRUITER MODULE */

      case "Post Job":

        return !candidate && (

          <form
            className="card form-grid"
            onSubmit={postJob}
          >

            {[
              ["title", "Job Title"],
              ["company", "Company"],
              ["location", "Location"],
              ["salary", "Salary (LPA)"],
              ["skills", "Required Skills (comma separated)"]
            ].map(([field, label]) => (

              <div key={field}>

                <label>{label}</label>

                <input
                  required
                  type={field === "salary" ? "number" : "text"}
                  min={field === "salary" ? 0 : undefined}
                  value={jobForm[field]}
                  onChange={e =>
                    setJobForm(old => ({
                      ...old,
                      [field]: e.target.value
                    }))
                  }
                />

              </div>

            ))}

            <div>

              <label>Employment Type</label>

              <select
                value={jobForm.type}
                onChange={e =>
                  setJobForm(old => ({
                    ...old,
                    type: e.target.value
                  }))
                }
              >

                <option>Full Time</option>
                <option>Internship</option>
                <option>Part Time</option>

              </select>

            </div>

            <button>Publish Job</button>

          </form>

        );

      case "Manage Jobs":

        return !candidate && (

          <div className="card table-wrap">

            <table>

              <thead>

                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Salary</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {ownedJobs.map(j => (

                  <tr key={j.id}>

                    <td>{j.title}</td>
                    <td>{j.company}</td>
                    <td>₹{j.salary} LPA</td>

                    <td>

                      <button
                        className="danger"
                        onClick={() => {

                          if (confirm("Delete this job?")) {

                            setJobs(old =>
                              old.filter(x => x.id !== j.id)
                            );

                            showToast(
                              "Job Deleted",
                              "The job listing has been removed."
                            );

                          }

                        }}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {!ownedJobs.length && (
              <p>No jobs posted yet.</p>
            )}

          </div>

        );

      /* CANDIDATE MANAGEMENT WITH EMAILJS */

      case "Manage Candidates":

        return !candidate && (

          <div className="card table-wrap">

            <h2>Candidate Management</h2>

            <p>
              Review applications and send recruitment emails.
            </p>

            <table>

              <thead>

                <tr>
                  <th>Candidate</th>
                  <th>Email</th>
                  <th>Job</th>
                  <th>Status</th>
                  <th>Email Status</th>
                </tr>

              </thead>

              <tbody>

                {receivedApplications.map(a => (

                  <tr key={a.id}>

                    <td>{a.name}</td>

                    <td>{a.email}</td>

                    <td>{a.title}</td>

                    <td>

                      <select
                        value={a.status}
                        disabled={emailBusy}
                        onChange={e =>
                          updateApplicationStatus(
                            a,
                            e.target.value
                          )
                        }
                      >

                        {[
                          "Applied",
                          "Shortlisted",
                          "Interview",
                          "Selected",
                          "Rejected"
                        ].map(status => (

                          <option key={status}>
                            {status}
                          </option>

                        ))}

                      </select>

                    </td>

                    <td>

                      <span
                        className={
                          "email-status " +
                          (a.emailStatus || "").toLowerCase()
                        }
                      >
                        {a.emailStatus || "Not sent"}
                      </span>

                      {a.emailStatus === "Failed" && (

                        <button
                          className="notification-link"
                          disabled={emailBusy}
                          onClick={() =>
                            updateApplicationStatus(
                              a,
                              a.status,
                              true
                            )
                          }
                        >
                          Retry Email
                        </button>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {!receivedApplications.length && (
              <p>No applications received.</p>
            )}

          </div>

        );

      /* ADMIN MODULE */

      case "Manage Users":

        return admin && (

          <div className="card table-wrap">

            <table>

              <thead>

                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {accounts.map(a => (

                  <tr key={a.id}>

                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.role}</td>

                    <td>

                      <button
                        className="danger"
                        disabled={a.id === user.id}
                        onClick={() => {

                          if (confirm("Delete this account?")) {

                            setAccounts(old =>
                              old.filter(x => x.id !== a.id)
                            );

                            showToast(
                              "Account Deleted",
                              "The user account has been removed."
                            );

                          }

                        }}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {!accounts.length && (
              <p>No registered users.</p>
            )}

          </div>

        );

      case "Job Reports":

        return admin && (

          <div className="card table-wrap">

            <table>

              <thead>

                <tr>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {reports.map(r => (

                  <tr key={r.id}>

                    <td>{r.title}</td>
                    <td>{r.company}</td>
                    <td>{r.reason}</td>

                    <td>

                      <select
                        value={r.status}
                        onChange={e => {

                          const status = e.target.value;

                          setReports(old =>
                            old.map(x =>
                              x.id === r.id
                                ? { ...x, status }
                                : x
                            )
                          );

                          showToast(
                            "Report Updated",
                            `Report status changed to ${status}.`
                          );

                        }}
                      >

                        <option>Pending</option>
                        <option>Reviewed</option>
                        <option>Resolved</option>

                      </select>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {!reports.length && (
              <p>No job reports.</p>
            )}

          </div>

        );

      default:

        return (

          <div className="card">
            Select a module from the sidebar.
          </div>

        );

    }
  }

  /* =====================================
     MAIN DASHBOARD LAYOUT
  ===================================== */

  return (

    <div className={`app ${dark ? "dark" : ""}`}>

      <ToastNotifications
        toasts={toasts}
        onClose={closeToast}
      />

      {menu && (

        <div
          className="backdrop"
          onClick={() => setMenu(false)}
        />

      )}

      <aside className={`sidebar ${menu ? "open" : ""}`}>

        <h2>
          Career<span>Sphere</span>
        </h2>

        <div className="role-badge">
          {user.role} Workspace
        </div>

        {Object.entries(groups).map(([group, items]) => (

          <div className="nav-group" key={group}>

            <p>{group}</p>

            {items.map(item => (

              <button
                key={item}
                className={page === item ? "active" : ""}
                onClick={() => navigate(item)}
              >
                {item}
              </button>

            ))}

          </div>

        ))}

        <button
          className="logout"
          onClick={logout}
        >
          Sign Out
        </button>

      </aside>

      <main className="main">

        <header className="topbar">

          <div className="actions">

            <button
              className="mobile-menu"
              onClick={() => setMenu(!menu)}
            >
              ☰
            </button>

            <h2>{page}</h2>

          </div>

          <div className="actions">

            <button
              className="secondary"
              onClick={() => setDark(!dark)}
            >
              {dark ? "Light Mode" : "Dark Mode"}
            </button>

            <NotificationCenter
              notifications={
                notifications.filter(
                  n => n.userId === user.id
                )
              }
              onReadAll={() =>
                markAllRead(user.id)
              }
              onRead={id =>
                markRead(user.id, id)
              }
              onClear={() =>
                clearHistory(user.id)
              }
            />

            <div className="avatar">

              {user.name?.[0]?.toUpperCase() || "U"}

            </div>

          </div>

        </header>

        <div className="content">

          <div className="notice">
            CareerSphere · Frontend prototype · Data stored locally in this browser
          </div>

          {renderPage()}

        </div>

      </main>

    </div>

  );
}

export default App;